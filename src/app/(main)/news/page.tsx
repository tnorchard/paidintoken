import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqBlock } from "@/components/FaqBlock";
import { getNews } from "@/lib/news";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Crypto News — Latest Headlines from CoinDesk, Cointelegraph & More",
  description:
    "The latest cryptocurrency news, updated every five minutes from CoinDesk, Cointelegraph, Decrypt, and The Block — prices, regulation, adoption, and market moves in one feed.",
  alternates: { canonical: "/news" },
};

function formatDateTime(publishedAt: number): string {
  if (!publishedAt) return "";
  return new Date(publishedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function NewsPage() {
  const items = await getNews(30);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Breadcrumbs items={[{ label: "News" }]} />

      <h1 className="text-3xl font-bold">Latest Crypto News</h1>
      <p className="mt-2 text-sm text-muted">
        Updated every five minutes from CoinDesk, Cointelegraph, Decrypt, and
        The Block. Each headline opens the original article.
      </p>

      <ol className="mt-6 border-t border-line">
        {items.map((item) => (
          <li key={item.link} className="border-b border-line">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1.5 py-4"
            >
              <div className="flex items-center gap-3 text-xs">
                <span className="border border-ink px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                  {item.source}
                </span>
                {item.publishedAt > 0 && (
                  <time dateTime={new Date(item.publishedAt).toISOString()}>
                    {formatDateTime(item.publishedAt)}
                  </time>
                )}
              </div>
              <span className="text-sm font-medium leading-snug group-hover:underline md:text-base">
                {item.title}
              </span>
            </a>
          </li>
        ))}
      </ol>

      {items.length === 0 && (
        <p className="py-6 text-sm text-muted">
          No news right now — check back soon.
        </p>
      )}

      <p className="mt-8 text-sm text-muted">
        Looking for numbers instead? See the{" "}
        <Link href="/#markets" className="font-semibold text-ink hover:text-accent">
          live market prices
        </Link>
        .
      </p>

      <FaqBlock
        title="FAQ · Crypto News"
        items={[
          {
            q: "Where do these stories come from?",
            a: "Official RSS feeds from CoinDesk, Cointelegraph, Decrypt, and The Block. PaidinToken never rewrites or republishes articles — every headline opens the original story on the publisher's site.",
          },
          {
            q: "How often does this feed update?",
            a: "Every five minutes. New articles appear here within minutes of publication, deduplicated across sources and sorted newest first.",
          },
          {
            q: "Why are only the last 30 stories shown?",
            a: "The archive keeps the freshest headlines for quick scanning. Older pieces live on the publishers' own sites — use each source's search if you need deeper history.",
          },
        ]}
      />
    </main>
  );
}
