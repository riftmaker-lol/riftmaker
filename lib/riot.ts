import { RecentRoles, SummonerProfile } from '@/types/riot';
import { PlayerRole } from '@prisma/client';

const UGG_ENPOT = 'https://u.gg/api';

export const summonerProfile = async (
  riotUserName: string,
  riotTagLine: string,
  regionId: string,
  seasonId: number,
) => {
  const resProfile = await fetch(UGG_ENPOT, {
    headers: {
      accept: '*/*',
      'accept-language': 'en_us',
      'content-type': 'application/json',
    },
    referrer: `https://u.gg/lol/profile/${regionId}/${riotUserName}-${riotTagLine}/overview`,
    body: `{\"operationName\":\"getSummonerProfile\",\"variables\":{\"regionId\":\"${regionId}\",\"riotUserName\":\"${riotUserName}\",\"riotTagLine\":\"${riotTagLine}\",\"seasonId\":${seasonId}},\"query\":\"query getSummonerProfile($regionId: String!, $seasonId: Int!, $riotUserName: String!, $riotTagLine: String!) {\\n  fetchProfileRanks(\\n    riotUserName: $riotUserName\\n    riotTagLine: $riotTagLine\\n    regionId: $regionId\\n    seasonId: $seasonId\\n  ) {\\n    rankScores {\\n      lastUpdatedAt\\n      losses\\n      lp\\n      promoProgress\\n      queueType\\n      rank\\n      role\\n      seasonId\\n      tier\\n      wins\\n      __typename\\n    }\\n    __typename\\n  }\\n  profileInitSimple(\\n    regionId: $regionId\\n    riotUserName: $riotUserName\\n    riotTagLine: $riotTagLine\\n  ) {\\n    lastModified\\n    memberStatus\\n    playerInfo {\\n      accountIdV3\\n      accountIdV4\\n      exodiaUuid\\n      iconId\\n      puuidV4\\n      regionId\\n      summonerIdV3\\n      summonerIdV4\\n      summonerLevel\\n      riotUserName\\n      riotTagLine\\n      __typename\\n    }\\n    customizationData {\\n      headerBg\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}`,
    method: 'POST',
  });

  if (!resProfile.ok) {
    throw new Error('Failed to fetch data');
  }

  const GQLquery = `
  query recentRoleRates(
    $queueType: Int!
    $regionId: String!
    $riotTagLine: String!
    $riotUserName: String!
  ) {
    recentRoleRates(
      queueType: $queueType
      regionId: $regionId
      riotTagLine: $riotTagLine
      riotUserName: $riotUserName
    ) {
      adc {
        gameCount
        winCount
      }
      jungle {
        gameCount
        winCount
      }
      mid {
        gameCount
        winCount
      }
      top {
        gameCount
        winCount
      }
      supp {
        gameCount
        winCount
      }
      none {
        gameCount
        winCount
      }
    }
  }
`;
  const resRoles = await fetch(UGG_ENPOT, {
    headers: {
      accept: '*/*',
      'accept-language': 'en_us',
      'content-type': 'application/json',
    },
    referrer: `https://u.gg/lol/profile/${regionId}/${riotUserName}-${riotTagLine}/overview`,
    body: `{\"operationName\":\"recentRoleRates\",\"variables\":{\"regionId\":\"${regionId}\",\"riotUserName\":\"${riotUserName}\",\"riotTagLine\":\"${riotTagLine}\",\"queueType\":-1},\"query\":\"${GQLquery}\"}`,
    method: 'POST',
  });

  if (!resRoles.ok) {
    throw new Error('Failed to history data');
  }

  return {
    profile: resProfile.json() as Promise<SummonerProfile>,
    recentRoles: resRoles.json() as Promise<RecentRoles>,
  };
};

const getSeasonId = async () => {
  const res = await fetch(
    'https://sandu-variables-default-rtdb.europe-west1.firebasedatabase.app/riftmaker-season-id.json',
    { method: 'GET' },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch seasonId');
  }

  return res.json() as Promise<number>;
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

  return PlayerRole[(mainRole == 'none' ? 'fill' : mainRole).toUpperCase() as keyof typeof PlayerRole];
};

const getRank = (profile: SummonerProfile) => {
  const rankScores = profile.data.fetchProfileRanks.rankScores;

  for (const score of rankScores) {
    if (score.queueType === 'ranked_solo_5x5') {
      return `${score.tier} ${score.rank}`;
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
