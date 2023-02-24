import { useEffect } from 'react';

export const useAltArrows = (onPress: (delta: number) => void) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if ((target && target.tagName === 'INPUT') || (!e.altKey && !e.ctrlKey)) {
        return;
      }
      switch (e.code) {
        case 'ArrowLeft':
          onPress(-1);
          break;
        case 'ArrowRight':
          onPress(1);
          break;
        default:
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [onPress]);
};
