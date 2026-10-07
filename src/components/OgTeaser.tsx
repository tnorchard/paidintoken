import Link from "next/link";
import { athletes } from "@/data/athletes";

const totalBtc = athletes.reduce((sum, athlete) => sum + athlete.numbits, 0);

export function OgTeaser() {
  return (
    <section className="overflow-hidden rounded-xl border-2 border-ink bg-card p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
        The Original PaidinToken
      </p>
      <h2 className="mt-2 text-2xl font-bold md:text-3xl">
        Ever been Paid in Token?
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Russell Okung converts his NFL salary to bitcoin. So do mayors,
        rappers, and fighters. The OG tracker follows{" "}
        <span className="font-semibold text-ink">{athletes.length}</span>{" "}
        celebrities who got paid in crypto —{" "}
        <span className="font-semibold text-ink">
          {totalBtc.toLocaleString("en-US", { maximumFractionDigits: 2 })} BTC
        </span>{" "}
        in total — and shows what those payments are worth today.
      </p>
      <Link
        href="/og"
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-bold text-surface transition hover:bg-accent hover:text-black"
      >
        Open the OG Tracker
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
