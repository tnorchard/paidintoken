import Link from "next/link";
import { glossary } from "@/data/glossary";

export function GlossaryGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {glossary.map((entry) => (
        <Link
          key={entry.slug}
          href={`/learn/${entry.slug}`}
          className="group rounded-lg border border-line bg-card p-4 transition hover:-translate-y-0.5 hover:border-accent"
        >
          <span className="flex items-center justify-between gap-3 text-sm font-bold">
            {entry.term}
            <span aria-hidden="true" className="text-accent">
              →
            </span>
          </span>
          <span className="mt-2 line-clamp-3 block text-sm leading-relaxed text-muted">
            {entry.body}
          </span>
        </Link>
      ))}
    </div>
  );
}
