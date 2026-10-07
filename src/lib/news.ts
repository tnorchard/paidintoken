import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "@/types";

const FEEDS = [
  { source: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { source: "Cointelegraph", url: "https://cointelegraph.com/rss" },
  { source: "Decrypt", url: "https://decrypt.co/feed" },
  { source: "The Block", url: "https://www.theblock.co/rss.xml" },
] as const;

const MAX_ITEMS_PER_FEED = 15;
const MAX_TOTAL_ITEMS = 12;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  processEntities: true,
});

interface MediaNode {
  "@_url"?: string;
  "@_type"?: string;
  "@_medium"?: string;
}

interface RawItem {
  title?: string;
  link?: string;
  pubDate?: string;
  date?: string;
  enclosure?: MediaNode | MediaNode[];
  "media:content"?: MediaNode | MediaNode[];
  "media:thumbnail"?: MediaNode | MediaNode[];
  "content:encoded"?: string;
}

function decodeEntities(value: string): string {
  return value
    .replace(
      /&#x([0-9a-fA-F]+);/g,
      (_, hex) => String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function cleanText(value: string): string {
  return decodeEntities(
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function firstNode(
  node: MediaNode | MediaNode[] | undefined,
): MediaNode | undefined {
  if (!node) return undefined;
  return Array.isArray(node) ? node[0] : node;
}

function isImageUrl(url: string | undefined): url is string {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}

function imageFromContentHtml(html: string | undefined): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}

function extractImage(item: RawItem): string | undefined {
  const mediaContent = firstNode(item["media:content"]);
  if (
    mediaContent &&
    (mediaContent["@_medium"] === "image" ||
      mediaContent["@_type"]?.startsWith("image")) &&
    isImageUrl(mediaContent["@_url"])
  ) {
    return mediaContent["@_url"];
  }

  const thumbnail = firstNode(item["media:thumbnail"]);
  if (isImageUrl(thumbnail?.["@_url"])) return thumbnail["@_url"];

  const enclosure = firstNode(item.enclosure);
  if (
    enclosure &&
    enclosure["@_type"]?.startsWith("image") &&
    isImageUrl(enclosure["@_url"])
  ) {
    return enclosure["@_url"];
  }

  if (mediaContent && isImageUrl(mediaContent["@_url"])) {
    return mediaContent["@_url"];
  }

  const fromHtml = imageFromContentHtml(item["content:encoded"]);
  if (isImageUrl(fromHtml)) return fromHtml;

  return undefined;
}

function normalizeItem(item: RawItem, source: string): NewsItem | null {
  if (!item.title || !item.link) return null;

  const publishedAt = Date.parse(item.pubDate ?? item.date ?? "");
  const link = typeof item.link === "string" ? item.link.trim() : "";

  if (!link) return null;

  return {
    title: cleanText(String(item.title)),
    link,
    source,
    publishedAt: Number.isNaN(publishedAt) ? 0 : publishedAt,
    image: extractImage(item),
  };
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<NewsItem[]> {
  const response = await fetch(feed.url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      accept: "application/rss+xml,application/xml,text/xml,*/*",
    },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${feed.source}: ${response.status}`);
  }

  const xml = await response.text();
  const doc = parser.parse(xml) as {
    rss?: { channel?: { item?: RawItem | RawItem[] } };
  };

  const channel = doc?.rss?.channel;
  if (!channel) return [];

  const rawItems = channel.item
    ? Array.isArray(channel.item)
      ? channel.item
      : [channel.item]
    : [];

  return rawItems
    .slice(0, MAX_ITEMS_PER_FEED)
    .map((item) => normalizeItem(item, feed.source))
    .filter((item): item is NewsItem => item !== null);
}

export async function getNews(limit = MAX_TOTAL_ITEMS): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const seen = new Set<string>();
  const items: NewsItem[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (seen.has(item.link)) continue;
      seen.add(item.link);
      items.push(item);
    }
  }

  items.sort((a, b) => b.publishedAt - a.publishedAt);

  return items.slice(0, limit);
}
