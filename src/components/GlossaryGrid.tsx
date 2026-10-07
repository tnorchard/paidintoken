import { glossary } from "@/data/glossary";

export function GlossaryGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {glossary.map((entry) => (
        <details
          key={entry.term}
          className="group rounded-lg border border-line bg-card p-4 transition hover:border-accent"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
            {entry.term}
            <span
              aria-hidden="true"
              className="text-lg font-normal text-accent transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-muted">{entry.body}</p>
        </details>
      ))}
    </div>
  );
}
