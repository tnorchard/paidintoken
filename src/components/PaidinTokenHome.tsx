"use client";

import { useCallback, useEffect, useState } from "react";
import type { BitcoinPrice } from "@/types";
import { athletes } from "@/data/athletes";
import { buildAthleteRows } from "@/lib/calculations";
import { PriceHeader } from "./PriceHeader";
import { AthleteTable } from "./AthleteTable";
import { Footer } from "./Footer";

async function fetchBitcoinPrice(): Promise<BitcoinPrice> {
  const response = await fetch("/api/bitcoin");
  if (!response.ok) throw new Error("Failed to fetch price");
  return response.json();
}

export function PaidinTokenHome() {
  const [prices, setPrices] = useState<BitcoinPrice | null>(null);
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);

  const loadPrices = useCallback(async () => {
    try {
      const data = await fetchBitcoinPrice();
      setPrices(data);
    } catch {
      // Keep showing last known prices on refresh failure.
    }
  }, []);

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, [loadPrices]);

  const activePrice = hoverPrice ?? prices?.last ?? 0;
  const rows = buildAthleteRows(athletes, activePrice);

  return (
    <>
      <header>
        <div className="container mx-auto mr-5 mt-4">
          <p className="title text-right text-3xl font-bold">PaidinToken</p>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto ml-4 mt-1 px-4">
          <PriceHeader
            prices={prices}
            onHoverHigh={() => prices && setHoverPrice(prices.high)}
            onHoverLow={() => prices && setHoverPrice(prices.low)}
            onHoverEnd={() => setHoverPrice(null)}
          />

          <div className="mt-4 space-y-1">
            <p className="text-lg">
              In recent times, many people have opted to receive large payments
              in cryptocurrency.
            </p>
            <p className="text-lg">
              PaidinToken aims to provide transparent stats on these payments,
              to provide a practical understanding of the already-confusing
              cryptocurrency space.
            </p>
          </div>
        </div>

        <div className="container mx-auto mt-6 px-4">
          <p className="hover-paragraph mb-2 text-center font-bold md:text-left">
            Hover over day&apos;s high and low prices to see respective data.
          </p>
          <AthleteTable rows={rows} />
          <p className="right mt-2 text-right font-bold">
            Data is updated every 60 seconds for your convenience.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
