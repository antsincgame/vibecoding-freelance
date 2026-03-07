import { useEffect, useState } from 'react';

const STORAGE_KEY = 'vibecoder-perf-mode';

function detectPerfMode(): boolean {
  const manual = localStorage.getItem(STORAGE_KEY);
  if (manual === '1') return true;
  if (manual === '0') return false;

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof deviceMemory === 'number' && deviceMemory <= 4) return true;

  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores > 0 && cores <= 4) return true;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return true;

  return false;
}

export function usePerformanceMode(): { perfMode: boolean } {
  const [perfMode, setPerfMode] = useState(false);

  useEffect(() => {
    const value = detectPerfMode();
    setPerfMode(value);

    if (value) {
      document.body.classList.add('perf-mode');
    } else {
      document.body.classList.remove('perf-mode');
    }

    return () => {
      document.body.classList.remove('perf-mode');
    };
  }, []);

  return { perfMode };
}
