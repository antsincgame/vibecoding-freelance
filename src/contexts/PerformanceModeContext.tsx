import { createContext, useContext, type ReactNode } from 'react';
import { usePerformanceMode } from '../hooks/usePerformanceMode';

type PerformanceModeContextValue = {
  perfMode: boolean;
};

const PerformanceModeContext = createContext<PerformanceModeContextValue | null>(null);

export function PerformanceModeProvider({ children }: { children: ReactNode }) {
  const { perfMode } = usePerformanceMode();

  return (
    <PerformanceModeContext.Provider value={{ perfMode }}>
      {children}
    </PerformanceModeContext.Provider>
  );
}

export function usePerformanceModeContext(): PerformanceModeContextValue {
  const ctx = useContext(PerformanceModeContext);
  if (!ctx) {
    return { perfMode: false };
  }
  return ctx;
}
