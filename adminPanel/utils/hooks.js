import { useEffect } from 'react';

export const useAsyncEffect = (asyncEffect, dependencies) => {
  useEffect(() => {
    const asyncEffectWrapper = async () => {
      await asyncEffect();
    };
    asyncEffectWrapper();
  }, dependencies);
};
