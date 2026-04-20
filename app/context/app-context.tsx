import { createContext, useContext, type ReactNode } from "react";
import { usePrayerTimes, type PrayerAppState } from "~/hooks/use-prayer-times";

const AppContext = createContext<PrayerAppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const state = usePrayerTimes();
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useAppContext(): PrayerAppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
