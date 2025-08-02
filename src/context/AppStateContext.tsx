import React, { createContext, useContext, ReactNode } from 'react';

const AppStateContext = createContext<any>(undefined);

export function useAppState() {
  return useContext(AppStateContext);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  return (
    <AppStateContext.Provider value={{}}>
      {children}
    </AppStateContext.Provider>
  );
}
