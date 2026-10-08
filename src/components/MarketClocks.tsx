"use client";

import { useEffect, useState } from "react";

interface CityClock {
  label: string;
  tz: string;
  openMinutes: [number, number];
}

const CITIES: CityClock[] = [
  { label: "New York", tz: "America/New_York", openMinutes: [9 * 60 + 30, 16 * 60] },
  { label: "London", tz: "Europe/London", openMinutes: [8 * 60, 16 * 60 + 30] },
  { label: "Tokyo", tz: "Asia/Tokyo", openMinutes: [9 * 60, 15 * 60 + 30] },
  { label: "Sydney", tz: "Australia/Sydney", openMinutes: [10 * 60, 16 * 60] },
];

interface ClockState {
  time: string;
  open: boolean;
}

function readClock(city: CityClock, now: Date): ClockState {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: city.tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);
  const second = get("second");
  const weekday = get("weekday");
  const minutes = hour * 60 + minute;
  const weekend = weekday === "Sat" || weekday === "Sun";

  return {
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${second}`,
    open: !weekend && minutes >= city.openMinutes[0] && minutes < city.openMinutes[1],
  };
}

export function MarketClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const frame = requestAnimationFrame(tick);
    const timer = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-lg border-2 border-ink bg-ink sm:grid-cols-4">
      {CITIES.map((city) => {
        const clock = now ? readClock(city, now) : null;
        return (
          <div key={city.label} className="bg-surface p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {city.label}
            </p>
            <div className="mt-0.5 flex items-baseline justify-between gap-2">
              <p className="text-base font-bold tabular-nums md:text-lg">
                {clock ? clock.time : "--:--:--"}
              </p>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  clock?.open
                    ? "bg-up text-surface"
                    : "border border-ink text-ink"
                }`}
              >
                {clock ? (clock.open ? "Open" : "Closed") : "—"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
