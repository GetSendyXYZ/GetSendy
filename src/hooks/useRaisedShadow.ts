import { animate, type MotionValue, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';

export function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.onChange(latest => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          void animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)');
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          void animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value, boxShadow]);

  return boxShadow;
}
