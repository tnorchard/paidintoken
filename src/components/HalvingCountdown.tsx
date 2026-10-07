"use client";

import { useEffect, useState } from "react";

const NEXT_HALVING = Date.UTC(2028, 3, 10);

const HISTORY = [
  { date: "Nov 28, 2012", height: "210,000", reward: "50 → 25 BTC" },
  { date: "Jul 9, 2016", height: "420,000", reward: "25 → 12.5 BTC" },
  { date: "May 11, 2020", height: "630,000", reward: "12.5 → 6.25 BTC" },
  { date: "Apr 20, 2024", height: "840,000", reward: "6.25 → 3.125 BTC" },
];

function useCountdown(target: number) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (now === null) return null;

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return { days, hours, minutes, seconds };
}

export function HalvingCountdown() {
  const countdown = useCountdown(NEXT_HALVING);

  return (
    <div className="rounded-lg border border-line bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">
        Next Bitcoin Halving · estimated April 2028
      </p>
      <p className="mt-2 text-3xl font-bold tabular-nums md:text-4xl">
        {countdown
          ? `${countdown.days.toLocaleString("en-US")}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
          : "···"}
      </p>
      <p className="mt-2 text-sm text-muted">
        Block reward 3.125 → 1.5625 BTC at block 1,050,000.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse text-sm">
          <caption className="sr-only">Past Bitcoin halvings</caption>
          <thead>
            <tr className="border-b border-ink text-left text-xs uppercase tracking-wider">
              <th scope="col" className="py-2 pr-4 font-medium">
                Halving
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Block
              </th>
              <th scope="col" className="py-2 font-medium">
                Reward Change
              </th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((row) => (
              <tr key={row.height} className="border-b border-line last:border-b-0">
                <td className="py-2 pr-4">{row.date}</td>
                <td className="py-2 pr-4 tabular-nums">{row.height}</td>
                <td className="py-2 font-semibold tabular-nums">{row.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
