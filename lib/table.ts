import { Player } from '@/components/molecules/roulette';
import { Tournament, TournamentStatus } from '@prisma/client';
import { Ranks } from './draft';

export const sortByStatus = (
  a: { status: TournamentStatus; createdAt: Date },
  b: { status: TournamentStatus; createdAt: Date },
) => {
  const { status: aStatus, createdAt: aCreatedAt } = a;
  const { status: bStatus, createdAt: bCreatedAt } = b;

  const orderedEnum = [
    TournamentStatus.READY,
    TournamentStatus.ACCEPTING_PARTICIPANTS,
    TournamentStatus.CREATED,
    TournamentStatus.FINISHED,
  ];

  const aIndex = orderedEnum.indexOf(aStatus);
  const bIndex = orderedEnum.indexOf(bStatus);

  if (aIndex === bIndex) {
    return aCreatedAt < bCreatedAt ? 1 : -1;
  }

  return aIndex > bIndex ? 1 : -1;
};

export const sortByPlayerElo = (a: { elo: string }, b: { elo: string }) => {
  const aElo = a.elo.toUpperCase();
  const bElo = b.elo.toUpperCase();

  const orderedRanks = ['ZRAG', ...Ranks];

  const strippedA = aElo?.split(' ')[0];
  const strippedB = bElo?.split(' ')[0];

  const aIndex = orderedRanks.indexOf(strippedA as string);
  const bIndex = orderedRanks.indexOf(strippedB as string);

  if (aIndex === bIndex) {
    return aElo > bElo ? -1 : 1;
  }

  return aIndex > bIndex ? -1 : 1;
};
