/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { TournamentData } from '@/app/api/tournament/[tournamentId]/shuffle/route';
import { cn } from '@/lib/utils';
import { PlayerRole } from '@prisma/client';
import { ChevronUpIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { useEffect, useRef } from 'react';
import { GiRollingDices } from 'react-icons/gi';
import { IoRefreshOutline } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { useRoulette } from '../../hooks/useRoulette';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

interface RouletteProps {
  tournamentId: string;
  elo: string | undefined;
  role: Exclude<PlayerRole, 'FILL'> | undefined;
  config: {
    duration: number;
  };
  onLockIn: (player: Player) => void;
  onStateChange?: (state: 'running' | 'stopped') => void;
  filterPlayerIds?: string[];
  deactivate?: boolean;
}

export type Player = TournamentData['participants'][0];

const Roulette = ({
  tournamentId,
  onLockIn,
  elo,
  role,
  config,
  onStateChange,
  filterPlayerIds,
  deactivate,
}: RouletteProps) => {
  const searchParams = new URLSearchParams();

  if (elo) searchParams.append('elo', elo);
  if (role) searchParams.append('role', role);

  const { data, refetch } = useQuery<TournamentData>('tounament-details', () =>
    fetch(
      `/api/tournament/${tournamentId}/shuffle${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
    ).then((res) => res.json()),
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const items = data?.participants?.filter((p) => !filterPlayerIds?.includes(p.id)) ?? [];

  const { startRoulette, winner, running, ranOnce } = useRoulette({
    wrapperRef,
    items,
    config,
    onEnd: (player) => {
      console.log('Ended: ', player);
    },
    onStateChange,
  });

  const reroll = () => {
    startRoulette(Math.floor(Math.random() * items.length));
  };

  const lockIn = () => {
    onLockIn(winner);
  };

  useEffect(() => {
    if (data?.message) {
      toast({
        title: 'Warning',
        description: data.message,
        variant: 'warning',
      });
    }
  }, [data?.message]);

  return (
    <div className="flex flex-col w-full relative justify-center gap-4 items-center overflow-x-hidden">
      <p>Picking from {items.length} players</p>
      <div className="flex flex-row gap-4 w-[480px] h-32 relative overflow-hidden" ref={wrapperRef}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="w-24 h-24 inline-block absolute" data-value={0}>
            <div>Player {i + 0}</div>
            <img className={cn('w-full h-full block m-0 border-transparent')} />
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-4 w-[480px] justify-center items-start">
        <ChevronUpIcon className="w-8 h-8" />
      </div>
      <div className="flex flex-row gap-8">
        {!ranOnce ? (
          <Button onClick={() => startRoulette(2)} disabled={running || deactivate} className="flex gap-2 items-center">
            <GiRollingDices className="w-4 h-4" />
            Start Roulette
          </Button>
        ) : (
          <Button onClick={() => reroll()} disabled={running || deactivate} className="flex gap-2 items-center">
            <IoRefreshOutline className="w-4 h-4" />
            Reroll
          </Button>
        )}
        <Button onClick={() => lockIn()} disabled={running || deactivate} className="flex gap-2 items-center">
          <LockClosedIcon className="w-4 h-4" />
          Lock in
        </Button>
      </div>
    </div>
  );
};

export default Roulette;
