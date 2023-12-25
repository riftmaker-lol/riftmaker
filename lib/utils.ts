import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Splits an array of objects based on their values at a given key.
 * Objects without a value at the given key will be set under a `-1` index.
 *
 * @param objects The array to split.
 * @param key The key of T.
 */
export function splitByWithLeftovers<
  T extends Record<string, unknown>,
  K extends keyof T,
  U extends Record<K, string | number>,
>(objects: U[], key: K): U[][] {
  const map = {} as Record<string | number, U[]>;

  for (const obj of objects) {
    const commonValue = obj[key] ?? '-1'; // Object keys are converted to a string.

    if (!map[commonValue]) map[commonValue] = [];

    map[commonValue].push(obj);
  }

  const withoutLeftovers = Object.entries(map)
    .filter(([key]) => key !== '-1')
    .map(([_, value]) => value);

  const result = [...withoutLeftovers];
  result[-1] = map[-1];
  return result;
}
