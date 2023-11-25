import { SummonerData } from '@/types/riot';
import { PlayerRole } from '@prisma/client';

export const summonerData = async (summonerName: string, server: string) => {
  summonerName = decodeURIComponent(summonerName);
  const res = await fetch('https://app.mobalytics.gg/api/lol/graphql/v1/query', {
    headers: {
      accept: '*/*',
      'accept-language': 'en_us',
      'content-type': 'application/json',
      'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-moba-client': 'mobalytics-web',
      'x-moba-proxy-gql-ops-name': 'LolProfilePageSummonerInfoQuery',
    },
    referrer: `https://app.mobalytics.gg/lol/profile/${server}/${summonerName}/overview`,
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: `{"operationName":"LolProfilePageSummonerInfoQuery","variables":{"summonerName":"${summonerName}","region":"${server}","sQueue":null,"sRole":null,"sChampion":null},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"8ad5d73cd5306b9f5b423a0285e4a078976f125e0424b227e5f244af50954da7"}}}`,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json() as Promise<SummonerData>;
};

export const validateRiotId = async (
  riotId: string,
): Promise<{
  riotId: string;
  elo: string;
  role: PlayerRole;
}> => {
  try {
    const { data } = await summonerData(riotId, 'EUW');
    const { queuesStats, roleStats } = data.lol.player;

    const role = roleStats.filters.actual.rolename as PlayerRole;

    if (Object.values(PlayerRole).indexOf(role) === -1) {
      throw new Error('Invalid role, @Stormix, fix it thx');
    }

    const { division, tier } = queuesStats.items[0].rank;
    const elo = `${tier} ${division}`;

    return {
      riotId,
      elo,
      role,
    };
  } catch (e) {
    throw new Error('Invalid Riot ID');
  }
};
