"use client";

import { useState } from "react";
import type { NewsItem } from "@/types";

function timeAgo(publishedAt: number): string {
  if (!publishedAt) return "";
  const diff = Date.now() - publishedAt;
  if (diff < 60000) return "just now";

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function CardImage({ item }: { item: NewsItem }) {
  const [failed, setFailed] = useState(false);

  if (!item.image || failed) {
    return (
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-line to-card">
        <span className="text-3xl font-bold text-muted">{item.source[0]}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- RSS image URLs come from arbitrary external CDNs and cannot be whitelisted for next/image.
    <img
      src={item.image}
      alt=""
      loading="lazy"
      className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      onError={() => setFailed(true)}
    />
  );
}

export function NewsCarousel({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-6 text-sm text-muted">
        No news right now — check back soon.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="pit-hscroll -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3">
        {items.map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-[290px] shrink-0 snap-start overflow-hidden rounded-lg border border-line bg-card transition duration-200 hover:-translate-y-1 hover:border-accent sm:w-[320px]"
          >
            <div className="overflow-hidden">
              <CardImage item={item} />
            </div>
            <div className="p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="border border-ink px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                  {item.source}
                </span>
                <time
                  dateTime={
                    item.publishedAt
                      ? new Date(item.publishedAt).toISOString()
                      : undefined
                  }
                  suppressHydrationWarning
                  className="text-[11px] text-muted"
                >
                  {timeAgo(item.publishedAt)}
                </time>
              </div>
              <h3 className="mt-2 line-clamp-3 text-sm font-medium leading-snug group-hover:underline">
                {item.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent"
      />
    </div>
  );
}
