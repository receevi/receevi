import { useState, useEffect } from "react";

export const useDebounce = (callback: () => void, delay: number) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    const _timer = setTimeout(callback, delay);
    setTimer(_timer);
  }
};
