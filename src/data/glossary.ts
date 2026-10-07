export interface GlossaryEntry {
  term: string;
  body: string;
}

export const glossary: GlossaryEntry[] = [
  {
    term: "Paid in Token",
    body: "Getting salary or fees in bitcoin instead of dollars. Russell Okung famously routes his NFL checks through bitcoin, and mayors, musicians, and athletes have followed. It's the original idea behind this site.",
  },
  {
    term: "Bitcoin Halving",
    body: "Roughly every four years, the reward for mining new blocks is cut in half — shrinking new supply. Four halvings have happened so far, the most recent in 2024.",
  },
  {
    term: "Stablecoins",
    body: "Digital dollars like USDT and USDC pegged 1:1 to fiat. They're the biggest bridge between traditional banking and crypto, used for trading, remittances, and savings.",
  },
  {
    term: "Cold Wallet",
    body: "A wallet kept offline — hardware devices or paper. Not your keys, not your coins: exchanges hold billions, cold storage keeps them out of hackers' reach.",
  },
  {
    term: "Gas Fees",
    body: "The cost of using a network. Fees pay the machines validating your transaction and rise when the network is busy — cheapest on nights and weekends.",
  },
  {
    term: "Altcoins",
    body: "Everything that isn't Bitcoin — Ethereum, Solana, and thousands of others. They experiment with speed, smart contracts, and memes that BTC deliberately avoids.",
  },
];
