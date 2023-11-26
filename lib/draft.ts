import { Tournament, User } from '@prisma/client';

export const getPotentialPlayers = (
  tournament: Tournament & {
    participants: User[];
  },
  random: boolean,
  elo: string | undefined,
) => {
  const potentialPlayers: User[] = [];
  if (random) {
    potentialPlayers.push(...tournament.participants);
  } else {
    // TODO: SORT BY ELO
    potentialPlayers.push(...tournament.participants.filter((p) => p.elo?.includes(elo as string)));
  }
  return potentialPlayers;
};

export const mapPlayer = (player: User) => ({
  id: player.id,
  riotId: player.riotId ?? '???',
  name: player.name ?? 'Hassan',
  role: player.role ?? 'N/A',
  rank: player.elo === 'UNRANKED 0' ? 'Zrag' : player.elo ?? 'Zrag',
});
