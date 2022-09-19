import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue?: T) {
  const [storedValue, setStoredValue] = useState(initialValue);
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      item && setStoredValue(JSON.parse(item));
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  type ValueType = typeof initialValue;
  const setValue = (value: ValueType | ((val: ValueType) => ValueType)) => {
    try {
      // Allow value to be a function so we have same API as useState's setter function
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}
