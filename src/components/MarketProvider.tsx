"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { BitcoinPrice, MarketData } from "@/types";

interface MarketContextValue {
  markets: MarketData | null;
  btc: BitcoinPrice | null;
}

const MarketContext = createContext<MarketContextValue>({
  markets: null,
  btc: null,
});

async function fetchMarkets(): Promise<MarketData> {
  const response = await fetch("/api/markets");
  if (!response.ok) throw new Error("Failed to fetch markets");
  return response.json();
}

async function fetchBitcoin(): Promise<BitcoinPrice> {
  const response = await fetch("/api/bitcoin");
  if (!response.ok) throw new Error("Failed to fetch bitcoin price");
  return response.json();
}

export function MarketProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<MarketData | null>(null);
  const [btc, setBtc] = useState<BitcoinPrice | null>(null);

  const refresh = useCallback(async () => {
    const [marketsResult, btcResult] = await Promise.allSettled([
      fetchMarkets(),
      fetchBitcoin(),
    ]);

    if (marketsResult.status === "fulfilled" && marketsResult.value.coins.length > 0) {
      setMarkets(marketsResult.value);
    }
    if (btcResult.status === "fulfilled") {
      setBtc(btcResult.value);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      void refresh();
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <MarketContext.Provider value={{ markets, btc }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket(): MarketContextValue {
  return useContext(MarketContext);
}
