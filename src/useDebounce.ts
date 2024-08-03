import { useState } from "react";

// Define types for the callback and delay
const useDebounce = <T extends any[]>(callback: (...args: T) => void, delay: number): ((...args: T) => void) => {
  // Use ReturnType<typeof setTimeout> for proper typing in the browser environment
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    setTimer(newTimer);
  };

  return debouncedCallback;
};

export default useDebounce;
