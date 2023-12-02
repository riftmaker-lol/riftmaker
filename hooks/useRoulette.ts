import { useAnimationFrame } from 'framer-motion';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Player } from '../components/molecules/roulette';

interface useRouletteProps {
  wrapperRef: RefObject<HTMLDivElement>;
  items: Player[];
  config: {
    duration: number;
  };
  onEnd: (player: Player) => void;
  onStateChange?: (state: 'running' | 'stopped') => void;
}

export const size = 96;
export const NUMBER_OF_CYCLES = 40;
export const DURATION = 5_000;

export const interpolator = (val: number) => {
  return Math.pow(Math.sin((val * Math.PI) / 2), 1.6);
};

export const updateItemValue = (item: Element, _index: number) => {
  item.setAttribute('data-value', _index.toString());
};

export const updateItem = (item: Element, player: Player) => {
  (item.lastChild as HTMLImageElement).src = player.image as string;
  (item.firstChild as HTMLDivElement).textContent = player.name;
};

export const itemValue = (item: Element) => {
  const value = parseInt(item.getAttribute('data-value') ?? '0');
  return value;
};

export const useRoulette = ({
  wrapperRef,
  items,
  onEnd,
  config = {
    duration: DURATION,
  },
  onStateChange,
}: useRouletteProps) => {
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [winnerItem, setWinnerItem] = useState(0);
  const [level, setLevel] = useState(0);
  const [running, setStart] = useState(false);
  const [htmlElements, setHTMLElements] = useState<HTMLDivElement[]>([]);
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!wrapperRef.current) return;
    setHTMLElements(Array.from(wrapperRef.current.children) as HTMLDivElement[]);
  }, [wrapperRef]);

  useAnimationFrame(() => {
    if (running) update();
  });

  const startRoulette = (selectedItem: number) => {
    setLevel(0);
    setProgress(0);
    setWinnerItem(selectedItem);
    setStartTime(Date.now());
    if (!ranOnce.current) ranOnce.current = true;

    for (let i = 0; i < 6; i++) {
      const item = htmlElements[i];
      updateItemValue(item, 0);
      updateItem(item, getItem());
    }

    setStart(true);
    onStateChange?.('running');
  };

  const update = () => {
    if (htmlElements.length === 0) return;
    setProgress((Date.now() - startTime) / config.duration);

    if (progress > 1) {
      setProgress(1);
      render();
      setStart(false);
      onEnd(getItem(winnerItem));
      onStateChange?.('stopped');
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
    running,
    update,
    htmlElements,
    winner: getItem(winnerItem),
    ranOnce: ranOnce.current,
  };
};
