import { useEffect, useRef } from 'react';

const useArrayMemo = <T>(array: T[]) => {
  // this holds reference to previous value
  const ref = useRef<T[]>();
  // check if each element of the old and new array match
  const areArraysConsideredTheSame =
    ref.current && array.length === ref.current.length
      ? array.every((element, i) => {
          return element === ref.current?.[i];
        })
      : //initially there's no old array defined/stored, so set to false
        false;

  useEffect(() => {
    //only update prev results if array is not deemed the same
    if (!areArraysConsideredTheSame) {
      ref.current = array;
    }
  }, [areArraysConsideredTheSame, array]);
  return areArraysConsideredTheSame ? ref.current : array;
};

export default useArrayMemo;
