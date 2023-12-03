import { PlayerRole, Team, TeamPlayer, Tournament, User } from '@prisma/client';

export const getPotentialPlayers = (
  tournament: Tournament & {
    participants: User[];
    teams: Array<Team & { players: TeamPlayer[] }>;
  },
  random: boolean,
  elo: string | undefined,
) => {
  const playersInTeamsAlready = tournament.teams.flatMap((t) => t.players).map((p) => p.playerId);

  const potentialPlayers: User[] = [];
  if (random) {
    potentialPlayers.push(...tournament.participants.filter((p) => !playersInTeamsAlready.includes(p.id)));
  } else {
    // TODO: SORT BY ELO
    potentialPlayers.push(
      ...tournament.participants.filter((p) => p.elo?.includes(elo as string) && !playersInTeamsAlready.includes(p.id)),
    );
  }
  return potentialPlayers;
};

export const mapPlayer = (player: User) => ({
  id: player.id,
  riotId: player.riotId ?? '???',
  name: player.name ?? 'Hassan',
  role: player.role ?? 'N/A',
  elo: player.elo === 'UNRANKED 0' ? 'Zrag' : player.elo ?? 'Zrag',
  image: player.image,
});

export const Lanes = [PlayerRole.TOP, PlayerRole.JUNGLE, PlayerRole.MID, PlayerRole.ADC, PlayerRole.SUPPORT] as const;

export const Ranks = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'EMERALD',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
] as const;

export const sortByRole = <T extends { role: PlayerRole | string }>(a: T, b: T) => {
  const aRole = a.role as PlayerRole;
  const bRole = b.role as PlayerRole;

  if (aRole === bRole) return 0;
  if (aRole === PlayerRole.FILL) return -1;
  if (bRole === PlayerRole.FILL) return -1;

  return Lanes.indexOf(aRole) - Lanes.indexOf(bRole);
};
