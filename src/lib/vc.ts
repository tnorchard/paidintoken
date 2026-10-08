import { XMLParser } from "fast-xml-parser";
import type { VentureRound } from "@/types";

const VENTURE_FEED = "https://techcrunch.com/category/venture/feed/";

const MAX_ITEMS = 20;
const MAX_ROUNDS = 7;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  processEntities: true,
});

interface RawItem {
  title?: string;
  link?: string;
  pubDate?: string;
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
    .replace(/&amp;/g, "&");
}

const RAISE_VERB =
  /(?:^|\s)(raises|raised|raise|nabs|nabbed|secures|securing|snags|lands|closes|bags|scores|pulls in|rais(?:es|ed))\s/i;

const AMOUNT_RE = /\$([\d.,]+)\s*(million|billion|mn|bn|m|b)\b/i;

const LEAD_RE =
  /(?:co-led by|led by|from|with funding from)\s+([A-Z][\w&.'’-]+(?:\s+[A-Z][\w&.'’-]+){0,2})/;

const ROUND_RE = /\b(series [A-E]|pre-seed|seed|angel|growth)\b/i;

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "its",
  "his",
  "her",
  "their",
  "after",
  "for",
  "to",
  "in",
  "at",
  "as",
  "by",
  "new",
]);

function normalizeAmount(raw: string, unitRaw: string): string {
  const value = parseFloat(raw.replace(/,/g, ""));
  if (Number.isNaN(value)) return `$${raw} ${unitRaw}`;
  const unit = unitRaw.toLowerCase();
  if (unit.startsWith("b")) return `$${value}B`;
  if (unit.startsWith("m")) return `$${value}M`;
  if (unit === "k") return `$${value}K`;
  return `$${value}`;
}

function extractCompany(title: string): string | null {
  const verbMatch = title.match(RAISE_VERB);
  if (!verbMatch || verbMatch.index === undefined) return null;

  const before = title
    .slice(0, verbMatch.index)
    .replace(/[^\w&.'’-]+/g, " ")
    .trim();

  const words = before.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const capitalized = words.filter((word, index) =>
    /^[A-Z0-9]/.test(word) && (index >= words.length - 4 || !STOPWORDS.has(word.toLowerCase())),
  );

  if (capitalized.length === 0) return null;

  const tail = capitalized.slice(-3).join(" ");
  if (STOPWORDS.has(tail.toLowerCase())) return null;
  if (capitalized.length === 1 && STOPWORDS.has(capitalized[0].toLowerCase())) {
    return null;
  }
  return tail;
}

function extractLead(title: string): string | null {
  const match = title.match(LEAD_RE);
  if (!match) return null;
  const lead = match[1].replace(/[,.:'’]+$/, "").trim();
  if (!lead || STOPWORDS.has(lead.toLowerCase())) return null;
  return lead;
}

function parseTitle(title: string): Pick<
  VentureRound,
  "company" | "raised" | "lead" | "round" | "unicorn"
> | null {
  const amountMatch = title.match(AMOUNT_RE);
  if (!amountMatch) return null;

  const roundMatch = title.match(ROUND_RE);

  return {
    company: extractCompany(title),
    raised: normalizeAmount(amountMatch[1], amountMatch[2]),
    lead: extractLead(title),
    round: roundMatch ? roundMatch[0].toLowerCase() : null,
    unicorn: /unicorn/i.test(title),
  };
}

export async function getVentureRounds(): Promise<VentureRound[]> {
  let xml: string;
  try {
    const response = await fetch(VENTURE_FEED, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        accept: "application/rss+xml,application/xml,text/xml,*/*",
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    xml = await response.text();
  } catch {
    return [];
  }

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

  const rounds: VentureRound[] = [];

  for (const item of rawItems.slice(0, MAX_ITEMS)) {
    if (!item.title || !item.link) continue;
    const title = decodeEntities(String(item.title)).trim();
    const parsed = parseTitle(title);
    if (!parsed) continue;

    const publishedAt = Date.parse(item.pubDate ?? "");
    rounds.push({
      url: item.link.trim(),
      title,
      publishedAt: Number.isNaN(publishedAt) ? 0 : publishedAt,
      ...parsed,
    });
    if (rounds.length >= MAX_ROUNDS) break;
  }

  rounds.sort((a, b) => b.publishedAt - a.publishedAt);
  return rounds;
}
