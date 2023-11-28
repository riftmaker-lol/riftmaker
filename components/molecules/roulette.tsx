'use client';

import { TournamentData } from '@/app/api/tournament/[tournamentId]/route';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useQuery } from 'react-query';
import Loading from '../ui/loading';
import { animated, easings, useSpring, useSpringRef } from '@react-spring/web';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import { Button } from '../ui/button';
import { set } from 'lodash';
import { GiRollingDices } from 'react-icons/gi';

interface RouletteProps {
  tournamentId: string;
}

type Player = TournamentData['participants'][0];

interface Candidate extends Player {
  image: string;
}

const Roulette = ({ tournamentId }: RouletteProps) => {
  const { isLoading, error, data } = useQuery<TournamentData>('tounament-details', () =>
    fetch(`/api/tournament/${tournamentId}/shuffle`).then((res) => res.json()),
  );

  const [start, setStart] = useState(false);
  const [speed, setSpeed] = useState(500);
  const ref = useRef<ReturnType<typeof setTimeout>>();

  const handleStart = () => {
    setStart(true);
    setSpeed(500);
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      setStart(false);
    }, 5_000);
  };

  return (
    <div className="flex flex-col w-full relative justify-center gap-4 items-center overflow-x-hidden">
      <Marquee className="flex flex-row gap-4 w-full h-40" play={start} speed={speed}>
        {data?.participants.map((participant) => (
          <div key={participant.id} className="flex gap-2 items-center flex-col mx-4">
            <Image src={participant.image!} alt={participant.name} className="rounded-full" width={40} height={40} />
            <span>{participant.name}</span>
          </div>
        ))}
      </Marquee>

      <Button onClick={handleStart} className="flex gap-2 items-center">
        <GiRollingDices className="w-4 h-4 mr-2" />
        Start Roulette
      </Button>
    </div>
  );
};

export default Roulette;
