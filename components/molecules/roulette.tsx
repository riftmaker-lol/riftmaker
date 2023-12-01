/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { TournamentData } from '@/app/api/tournament/[tournamentId]/route';
import { cn } from '@/lib/utils';
import { useAnimationFrame } from 'framer-motion';
import { RefObject, useEffect, useRef, useState } from 'react';
import { GiRollingDices } from 'react-icons/gi';
import { useQuery } from 'react-query';
import { Button } from '../ui/button';

interface RouletteProps {
  tournamentId: string;
}

type Player = TournamentData['participants'][0];

const size = 96;
const NUMBER_OF_CYCLES = 40;
const DURATION = 10_000;

const interpolator = (val: number) => {
  return Math.pow(Math.sin((val * Math.PI) / 2), 1.6);
};

const updateItemValue = (item: Element, _index: number) => {
  item.setAttribute('data-value', _index.toString());
};

const updateItem = (item: Element, player: Player) => {
  (item.lastChild as HTMLImageElement).src = player.image as string;
  (item.firstChild as HTMLDivElement).textContent = player.name;
};

const itemValue = (item: Element) => {
  const value = parseInt(item.getAttribute('data-value') ?? '0');
  return value;
};

const useRoulette = (wrapperRef: RefObject<HTMLDivElement>, items: Player[]) => {
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [winnerItem, setWinnerItem] = useState(0);
  const [level, setLevel] = useState(0);
  const [start, setStart] = useState(false);
  const [htmlElements, setHTMLElements] = useState<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    setHTMLElements(Array.from(wrapperRef.current.children) as HTMLDivElement[]);
  }, [wrapperRef]);

  useAnimationFrame(() => {
    if (start) update();
  });

  const startRoulette = (selectedItem: number) => {
    setLevel(0);
    setProgress(0);
    setWinnerItem(selectedItem);
    setStartTime(Date.now());

    for (let i = 0; i < 6; i++) {
      const item = htmlElements[i];
      updateItemValue(item, 0);
      updateItem(item, getItem());
    }

    setStart(true);
  };

  const update = () => {
    if (htmlElements.length === 0) return;
    setProgress((Date.now() - startTime) / DURATION);

    if (progress > 1) {
      setProgress(1);
      render();
      setStart(false);
      return;
    }

    render();
  };

  const getItem = (index?: number): Player => {
    return index !== undefined ? items?.[index] : items[Math.floor(Math.random() * items.length)];
  };

  const render = () => {
    const offset = interpolator(progress) * size * NUMBER_OF_CYCLES;
    const width = size * 6;

    for (let i = 0; i < 6; i++) {
      const item = htmlElements[i];
      const base = (i + 1) * size - offset;
      const index = -Math.floor(base / width);
      const value = (((base % width) + width) % width) - size;

      item.style.transform = `translateX(${value}px)`;

      if (itemValue(item) !== index) {
        setLevel(level + index - itemValue(item));
        updateItemValue(item, index);
        updateItem(item, getItem());

        if (level === NUMBER_OF_CYCLES - 4) {
          console.log('winner', getItem(winnerItem));
          console.log('setting item', item);
          updateItem(item, getItem(winnerItem));
        }
      }
    }
  };

  useEffect(() => {
    if (!htmlElements.length) return;
    htmlElements.forEach((element, index) => {
      element.style.transform = `translateX(${size * index}px)`;
      element.style.position = 'absolute';
    });
  }, [htmlElements]);

  return {
    startRoulette,
    start,
    update,
    htmlElements,
    winner: getItem(winnerItem)?.name,
  };
};

const Roulette = ({ tournamentId }: RouletteProps) => {
  const { data } = useQuery<TournamentData>('tounament-details', () =>
    fetch(`/api/tournament/${tournamentId}/shuffle`).then((res) => res.json()),
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const items = data?.participants ?? [];

  const { startRoulette, winner } = useRoulette(wrapperRef, items);

  return (
    <div className="flex flex-col w-full relative justify-center gap-4 items-center overflow-x-hidden">
      <div className="flex flex-row gap-4 w-[480px] h-40 relative overflow-hidden" ref={wrapperRef}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="w-24 h-24 inline-block absolute" data-value={0}>
            <div>Player {i + 0}</div>
            <img className={cn('w-full h-full block m-0 border-transparent')} />
          </div>
        ))}
      </div>

      <p>
        Winner should be: {winner} {items[2].name}
      </p>

      <Button onClick={() => startRoulette(2)} className="flex gap-2 items-center">
        <GiRollingDices className="w-4 h-4 mr-2" />
        Start Roulette
      </Button>
    </div>
  );
};

export default Roulette;
