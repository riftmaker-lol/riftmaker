export interface SummonerProfile {
  data: SummonerProfileData;
}

export interface SummonerProfileData {
  fetchProfileRanks: FetchProfileRanks;
}

export interface FetchProfileRanks {
  rankScores: RankScore[];
}

export interface RankScore {
  lastUpdatedAt: any;
  losses: number;
  lp: number;
  promoProgress: any;
  queueType: string;
  rank: string;
  role: any;
  seasonId: number;
  tier: string;
  wins: number;
}

export interface RecentRoles {
  data: Data;
}

export interface Data {
  recentRoleRates: RecentRoleRates;
}

export interface RecentRoleRates {
  adc: Adc;
  jungle: Jungle;
  mid: Mid;
  none: None;
  supp: Supp;
  top: Top;
}

export interface Adc {
  gameCount: number;
  winCount: number;
}

export interface Jungle {
  gameCount: number;
  winCount: number;
}

export interface Mid {
  gameCount: number;
  winCount: number;
}

export interface None {
  gameCount: number;
  winCount: number;
}

export interface Supp {
  gameCount: number;
  winCount: number;
}

export interface Top {
  gameCount: number;
  winCount: number;
}
