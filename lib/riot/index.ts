import { RecentRoles, SummonerProfile } from '@/types/riot';
import { PlayerRole } from '@prisma/client';
import { recentRolesQuery, summonerProfileQuery } from './queries';

const UGG_ENPOINT = 'https://u.gg/api';

export const summonerProfile = async (
  riotUserName: string,
  riotTagLine: string,
  regionId: string,
  seasonId: number,
) => {
  const profileResult = await fetch(UGG_ENPOINT, {
    headers: {
      accept: '*/*',
      'accept-language': 'en_us',
      'content-type': 'application/json',
    },
    referrer: `https://u.gg/lol/profile/${regionId}/${riotUserName}-${riotTagLine}/overview`,
    body: JSON.stringify({
      operationName: 'getSummonerProfile',
      variables: {
        regionId,
        riotUserName,
        riotTagLine,
        seasonId,
      },
      query: summonerProfileQuery,
    }),
    method: 'POST',
  });

  const rolesResult = await fetch(UGG_ENPOINT, {
    headers: {
      accept: '*/*',
      'accept-language': 'en_us',
      'content-type': 'application/json',
    },
    referrer: `https://u.gg/lol/profile/${regionId}/${riotUserName}-${riotTagLine}/overview`,
    body: JSON.stringify({
      operationName: 'recentRoleRates',
      variables: {
        regionId,
        riotUserName,
        riotTagLine,
        queueType: -1,
      },
      query: recentRolesQuery,
    }),
    method: 'POST',
  });

  if (!rolesResult.ok || !profileResult.ok) {
    throw new Error('Failed to history data');
  }

  return {
    profile: (await profileResult.json()) as SummonerProfile,
    recentRoles: (await rolesResult.json()) as RecentRoles,
  };
};

const getSeasonId = async (): Promise<number> => {
  const res = await fetch(
    'https://sandu-variables-default-rtdb.europe-west1.firebasedatabase.app/riftmaker-season-id.json',
    { method: 'GET' },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch seasonId');
  }

  return res.json();
};

const getRole = (recentRoles: RecentRoles) => {
  const roles = recentRoles.data.recentRoleRates;
  let maxGameCount = 0;
  let mainRole = '';

  Object.entries(roles).forEach(([role, stats]) => {
    if (stats.gameCount > maxGameCount) {
      maxGameCount = stats.gameCount;
      mainRole = role;
    }
  });

  return PlayerRole[mainRole == 'none' ? PlayerRole.FILL : (mainRole as keyof typeof PlayerRole)];
};

const mapRankToDigit = (rank: string) => {
  switch (rank.toUpperCase()) {
    case 'III':
      return 3;
    case 'II':
      return 2;
    case 'I':
      return 1;
    case 'IV':
    default:
      return rank;
  }
};

const getRank = (profile: SummonerProfile) => {
  const rankScores = profile.data.fetchProfileRanks.rankScores;

  for (const score of rankScores) {
    if (score.queueType === 'ranked_solo_5x5') {
      return `${score.tier} ${mapRankToDigit(score.rank)}`.toUpperCase();
    }
  }

  return 'UNRANKED 0';
};

export const validateRiotId = async (
  riotId: string,
): Promise<{
  riotId: string;
  elo: string;
  role: PlayerRole;
}> => {
  try {
    const riotIdList = riotId.split('#');
    if (riotIdList.length < 2) throw new Error('riotId must be in format Hamid#Hamid');
    const [riotUserName, riotTagLine] = riotIdList;
    const seasonId = await getSeasonId();
    const { profile, recentRoles } = await summonerProfile(riotUserName, riotTagLine, 'euw1', seasonId);

    const role = getRole(await recentRoles);
    const elo = getRank(await profile);

    return {
      riotId,
      elo: elo === 'UNRANKED 0' ? 'Zrag' : elo,
      role,
    };
  } catch (e) {
    console.error(e);
    throw new Error('Invalid Riot ID');
  }
};
