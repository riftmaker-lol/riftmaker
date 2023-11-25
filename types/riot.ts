export interface SummonerData {
  data: Data;
}

export interface Data {
  lol: Lol;
}

export interface Lol {
  player: Player;
}

export interface Player {
  aId: string;
  icon: string;
  queuesStats: QueuesStats;
  roleStats: RoleStats;
}

export interface QueuesStats {
  items: QueueStat[];
}

export interface QueueStat {
  rank: Rank;
  queue: string;
  lp: number;
  wins: number;
  winrate: number;
  gamesCount: number;
  losses: number;
}

export interface Rank {
  tier: string;
  division: string;
}

export interface RoleStats {
  filters: Filters;
  defaultRole: DefaultRole;
}

export interface Filters {
  actual: Actual;
}

export interface Actual {
  queue: string;
  rolename: string;
}

export interface DefaultRole {
  wins: number;
  looses: number;
  kda: Kda;
  csm: number;
  kp: number;
  lp: number;
}

export interface Kda {
  k: number;
  d: number;
  a: number;
  __typename: string;
}
