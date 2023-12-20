export const summonerProfileQuery = `
query getSummonerProfile($regionId: String!, $seasonId: Int!, $riotUserName: String!, $riotTagLine: String!) {
    fetchProfileRanks(
      riotUserName: $riotUserName
      riotTagLine: $riotTagLine
      regionId: $regionId
      seasonId: $seasonId
    ) {
      rankScores {
        lastUpdatedAt
        losses
        lp
        promoProgress
        queueType
        rank
        role
        seasonId
        tier
        wins
      }
    }
    profileInitSimple(
      regionId: $regionId
      riotUserName: $riotUserName
      riotTagLine: $riotTagLine
    ) {
      lastModified
      memberStatus
      playerInfo {
        accountIdV3
        accountIdV4
        exodiaUuid
        iconId
        puuidV4
        regionId
        summonerIdV3
        summonerIdV4
        summonerLevel
        riotUserName
        riotTagLine
      }
    }
}
`;

export const recentRolesQuery = `
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
}`;
