import { expect, test } from 'vitest';
import { sortByPlayerElo } from '../table';
import { PlayerRole, User } from '@prisma/client';
import { Player } from '@/components/molecules/roulette';

test('should sort players by their elo', () => {
  const players = [
    {
      name: 'John',
      elo: 'Diamond 1',
    },
    {
      name: 'Alex',
      elo: 'Iron 2',
    },
    {
      name: 'Bob',
      elo: 'Diamond 3',
    },
    {
      name: 'Ekb',
      elo: 'Zrag',
    },
  ];

  const expected = [
    {
      name: 'John',
      elo: 'Diamond 1',
    },
    {
      name: 'Bob',
      elo: 'Diamond 3',
    },
    {
      name: 'Alex',
      elo: 'Iron 2',
    },
    {
      name: 'Ekb',
      elo: 'Zrag',
    },
  ];

  const result = players.sort((a, b) => sortByPlayerElo(b, a));

  expect(result).toEqual(expected);
});
