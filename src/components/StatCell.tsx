import type { ReactNode } from "react";

export function fearGreedColor(value: number): string {
  if (value <= 24) return "text-down";
  if (value <= 44) return "text-orange-500";
  if (value <= 55) return "text-yellow-500";
  if (value <= 74) return "text-green-500";
  return "text-up";
}

export function StatCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="bg-surface p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums md:text-2xl">{value}</p>
      {sub}
    </div>
  );
}
