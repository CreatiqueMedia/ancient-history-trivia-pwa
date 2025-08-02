import React, { createContext, useContext, ReactNode } from 'react';

const ServiceWorkerContext = createContext<any>(undefined);

export function useServiceWorker() {
  return useContext(ServiceWorkerContext);
}

export function ServiceWorkerProvider({ children }: { children: ReactNode }) {
  return (
    <ServiceWorkerContext.Provider value={{}}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}
