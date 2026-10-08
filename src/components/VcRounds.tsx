import Link from "next/link";
import type { VentureRound } from "@/types";

function timeAgo(publishedAt: number): string {
  if (!publishedAt) return "";
  const diff = Date.now() - publishedAt;
  if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function VcRounds({ rounds }: { rounds: VentureRound[] }) {
  if (rounds.length === 0) {
    return (
      <p className="py-4 text-sm text-muted">
        No parsed funding rounds right now — check back soon.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="hidden border-b border-line px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted md:grid md:grid-cols-[1.4fr_0.7fr_1.1fr_1fr_auto] md:gap-4">
        <span>Startup</span>
        <span className="text-right">Raised</span>
        <span>Led by</span>
        <span>Round</span>
        <span className="text-right">When</span>
      </div>
      <ul>
        {rounds.map((round) => (
          <li key={round.url} className="border-b border-line last:border-b-0">
            <Link
              href={round.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-2 gap-x-4 gap-y-1 px-4 py-3 transition hover:bg-surface md:grid-cols-[1.4fr_0.7fr_1.1fr_1fr_auto] md:items-baseline"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold group-hover:text-accent">
                  {round.company ?? "New raise"}
                </span>
                {round.unicorn && (
                  <span className="mt-1 inline-block bg-up px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-surface">
                    Unicorn
                  </span>
                )}
              </span>
              <span className="text-right text-sm font-bold tabular-nums text-up">
                {round.raised ?? "—"}
              </span>
              <span className="truncate text-sm text-muted">
                {round.lead ?? "—"}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                {round.round ?? "—"}
              </span>
              <time
                dateTime={
                  round.publishedAt
                    ? new Date(round.publishedAt).toISOString()
                    : undefined
                }
                suppressHydrationWarning
                className="col-span-2 text-xs text-muted md:col-span-1 md:text-right"
              >
                {timeAgo(round.publishedAt)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
