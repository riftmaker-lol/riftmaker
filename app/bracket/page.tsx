'use client';

import React, { useState } from 'react';
import { Bracket, IRoundProps, Seed, SeedItem, SeedTeam, IRenderSeedProps } from 'react-brackets';

const initialRounds: IRoundProps[] = [
  {
    title: 'Round one',
    seeds: [
      { id: 1, teams: [{ name: 'Team A' }, { name: 'Team B' }] },
      { id: 2, teams: [{ name: 'Team C' }, { name: 'Team D' }] },
      { id: 3, teams: [{ name: 'Team E' }, { name: 'Team F' }] },
      { id: 4, teams: [{ name: 'Team G' }, { name: 'Team H' }] },
    ],
  },
  {
    title: 'Round Two',
    seeds: [
      { id: 5, teams: [] },
      { id: 6, teams: [] },
    ],
  },
  { title: 'Round Three', seeds: [{ id: 7, teams: [] }] },
];

const generateBracket = (teams: string[]): IRoundProps[] => {
  const numTeams = teams.length;

  const rounds: IRoundProps[] = [];
  while (teams.length > 1) {
    const roundTitle = `Round ${rounds.length + 1}`;
    const seeds = [];
    for (let i = 0; i < teams.length; i += 2) {
      const seedId = rounds.length * numTeams + i / 2;
      if (rounds.length === 0) {
        // Only fill names in first round
        seeds.push({
          id: seedId,
          teams: [{ name: teams[i] }, { name: teams[i + 1] }],
        });
      } else {
        seeds.push({ id: seedId, teams: [] }); // Empty entries for subsequent rounds
      }
    }
    rounds.push({ title: roundTitle, seeds });
    teams = seeds.map((seed) => seed.teams[0]?.name); // Keep only winner (name or empty string)
  }
  console.log(rounds);

  return rounds;
};

interface CustomSeedProps {
  onWin: (winningTeam: string, currentRoundIndex: number) => void;
}

const CustomSeed = ({ seed, roundIndex, onWin }: CustomSeedProps & IRenderSeedProps) => {
  const [winningSeed, setWinningSeed] = useState<number | null>(null);

  const handleWinnerSelect = (teamName: string) => {
    // Check if the seed has already produced a winner
    if (winningSeed === null) {
      // Pass the winning team to the parent component
      onWin(teamName, roundIndex);

      // Update the winning seed
      setWinningSeed(seed.id as number);
    }
  };

  return (
    <Seed>
      <SeedItem>
        <div>
          <SeedTeam>
            {seed.teams[0]?.name || 'NO TEAM '}
            <button
              onClick={() => {
                handleWinnerSelect(seed.teams[0]?.name as string);
              }}
            >
              go next round
            </button>
          </SeedTeam>
          <SeedTeam>
            {seed.teams[1]?.name || 'NO TEAM '}
            <button
              onClick={() => {
                handleWinnerSelect(seed.teams[1]?.name as string);
              }}
            >
              go next round
            </button>
          </SeedTeam>
        </div>
      </SeedItem>
    </Seed>
  );
};

const Component = () => {
  const teams = [
    'Team A',
    'Team B',
    'Team C',
    'Team D',
    'Team E',
    'Team F',
    'Team G',
    'Team H',
    'Team AA',
    'Team BB',
    'Team CC',
    'Team DD',
    'Team EE',
    'Team FF',
    'Team GG',
    'Team HH',
  ];
  //   const [rounds, setRounds] = useState(initialRounds);
  const [rounds, setRounds] = useState(generateBracket(teams));
  console.log('rounds: ', rounds);

  const handleWin = (winningTeam: string, currentRoundIndex: number) => {
    // Update the rounds data based on the winning team
    const updatedRounds = rounds.map((round, index) => {
      if (index === currentRoundIndex && round.seeds.length > 0 && winningTeam) {
        const seedIndex = round.seeds.findIndex((seed) => seed.teams.some((team) => team.name === winningTeam));
        if (seedIndex !== -1) {
          // Move the winning team to the next round
          const nextRoundIndex = currentRoundIndex + 1;
          if (nextRoundIndex < rounds.length) {
            const nextRoundSeedIndex = Math.floor(seedIndex / 2);
            rounds[nextRoundIndex].seeds[nextRoundSeedIndex].teams.push({ name: winningTeam });
          }
        }
      }
      return round;
    });

    // Update the state to trigger a re-render with the new data
    setRounds(updatedRounds);
  };

  return <Bracket rounds={rounds} renderSeedComponent={(props) => <CustomSeed {...props} onWin={handleWin} />} />;
};

export default Component;
