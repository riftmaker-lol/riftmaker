'use client';

import { TournamentData } from '@/app/api/tournament/[tournamentId]/route';
import { useMemo, useState } from 'react';

import { useQuery } from 'react-query';
import Loading from '../ui/loading';

interface RouletteProps {
  tournamentId: string;
}

type Player = TournamentData['participants'][0];

interface Candidate extends Player {
  image: string;
}

const Roulette = ({ tournamentId }: RouletteProps) => {
  const { isLoading, error, data, refetch } = useQuery('tounament-details', () =>
    fetch(`/api/tournament/${tournamentId}/shuffle`).then((res) => res.json()),
  );

  const [start, setStart] = useState(false);

  const winner = useMemo(() => {
    if (!data) return null;
    return data.participants[0];
  }, [data]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loading className="w-4 h-4" /> <span>Loading ...</span>
      </div>
    );

  if (error) return 'An error has occurred: ' + (error as Error).message;

  return (
    <div className="flex w-full relative justify-center gap-4 items-center">
      <Loading />
      <h1 className="text-3xl font-semibold">WORK IN PROGRESS...</h1>
    </div>
  );
};

export default Roulette;
