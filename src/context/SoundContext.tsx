import React, { createContext, useContext, ReactNode } from 'react';

const SoundContext = createContext<any>(undefined);

export function useSound() {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  return (
    <SoundContext.Provider value={{}}>
      {children}
    </SoundContext.Provider>
  );
}
