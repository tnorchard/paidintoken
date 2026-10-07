"use client";

import { useWatchlist } from "./WatchlistProvider";

export function StarButton({ coinId }: { coinId: string }) {
  const { ids, toggle } = useWatchlist();
  const active = ids.includes(coinId);

  return (
    <button
      type="button"
      onClick={() => toggle(coinId)}
      aria-label={
        active ? "Remove from watchlist" : "Add to watchlist"
      }
      aria-pressed={active}
      className={`text-base leading-none transition hover:scale-110 ${
        active ? "text-yellow-400" : "text-muted hover:text-yellow-400"
      }`}
    >
      {active ? "★" : "☆"}
    </button>
  );
}
