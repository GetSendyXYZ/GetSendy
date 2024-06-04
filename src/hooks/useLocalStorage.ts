/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

type LocalStorageKey = string;

const useLocalStorage = <T>(
  key: LocalStorageKey,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error: any) {
      console.error(`Error retrieving value from localStorage: ${error}`);
      return initialValue;
    }
  });

  const setValue = (value: T): void => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error: any) {
      console.error(`Error setting value in localStorage: ${error}`);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
