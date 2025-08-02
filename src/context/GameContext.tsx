import React, { createContext, useContext, ReactNode } from 'react';

const GameContext = createContext<any>(undefined);

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }: { children: ReactNode }) {
  return (
    <GameContext.Provider value={{}}>
      {children}
    </GameContext.Provider>
  );
}
