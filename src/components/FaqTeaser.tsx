import { type FaqItem, FaqBlock } from "./FaqBlock";

const teasers: FaqItem[] = [
  {
    q: "How often do prices update?",
    a: "Every 60 seconds. Prices come from CoinGecko through cached endpoints so the site stays fast even under heavy traffic.",
  },
  {
    q: "Where does the news come from?",
    a: "Official RSS feeds of CoinDesk, Cointelegraph, Decrypt, and The Block for crypto, plus CNBC, MarketWatch, and WSJ Markets for finance — new items show up within five minutes and always link back to the original article.",
  },
  {
    q: "Is my watchlist or portfolio stored on a server?",
    a: "No. Watchlists and portfolios live in your browser's local storage only. Clearing site data resets them.",
  },
  {
    q: "What is BTC dominance?",
    a: "Bitcoin's market cap divided by the total crypto market cap, as a percentage. Rising dominance means bitcoin is outperforming altcoins.",
  },
  {
    q: "What is the Fear & Greed Index?",
    a: "A daily sentiment score from 0 (extreme fear) to 100 (extreme greed) provided by Alternative.me, combining volatility, momentum, and social data.",
  },
  {
    q: "Where does the market data come from?",
    a: "CoinGecko's free public API for prices and market stats, with sentiment from Alternative.me. Data is cached briefly to stay fast and within rate limits.",
  },
];

export function FaqTeaser() {
  return <FaqBlock items={teasers} title="FAQ" />;
}
