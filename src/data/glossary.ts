export interface GlossaryEntry {
  slug: string;
  term: string;
  body: string;
  paragraphs: string[];
}

export const glossary: GlossaryEntry[] = [
  {
    slug: "paid-in-token",
    term: "Paid in Token",
    body: "Getting salary or fees in bitcoin instead of dollars. Russell Okung famously routes his NFL checks through bitcoin, and mayors, musicians, and athletes have followed. It's the original idea behind this site.",
    paragraphs: [
      "\"Paid in token\" means receiving all or part of your income in cryptocurrency — usually bitcoin — instead of fiat currency. The phrase became mainstream when NFL lineman Russell Okung converted his salary to bitcoin through a payment processor, and it has since spread to mayors taking part of their paycheck in BTC, musicians accepting crypto for tickets, and boxers demanding purse payments in digital assets.",
      "The appeal is straightforward: holders believe bitcoin's long-term appreciation can beat wage growth, and getting paid in it removes the extra step of buying after each paycheck. The risk is equally clear — bitcoin's price is volatile in the short term, so the dollar value of a payment can swing dramatically between the day it's earned and the day it's spent.",
      "The original PaidinToken tracker exists to make this concrete. It lists real celebrities who have been paid in or converted earnings to bitcoin, how much they received, and what those holdings are worth today — transparent stats on a trend that's usually talked about in vague terms.",
    ],
  },
  {
    slug: "bitcoin-halving",
    term: "Bitcoin Halving",
    body: "Roughly every four years, the reward for mining new blocks is cut in half — shrinking new supply. Four halvings have happened so far, the most recent in 2024.",
    paragraphs: [
      "A bitcoin halving is a programmed event that cuts the reward miners earn for adding a new block to the blockchain in half. It happens every 210,000 blocks — approximately four years — and it is the mechanism that caps bitcoin's supply at 21 million coins by steadily slowing new issuance.",
      "The math has held since 2009: the initial reward was 50 BTC per block, and four halvings later it sits at 3.125 BTC. Each event has roughly cut the daily new supply in half, which is why traders have historically watched halvings as supply-shock events — though past price cycles are never a guarantee of future ones.",
      "The next halving is expected around April 2028, when the block reward drops from 3.125 to 1.5625 BTC. You can track the live countdown in the halving section of this site, along with the full history of every halving date and reward change.",
    ],
  },
  {
    slug: "stablecoins",
    term: "Stablecoins",
    body: "Digital dollars like USDT and USDC pegged 1:1 to fiat. They're the biggest bridge between traditional banking and crypto, used for trading, remittances, and savings.",
    paragraphs: [
      "Stablecoins are cryptocurrencies designed to hold a steady value, most commonly pegged 1:1 to the US dollar. The largest — Tether (USDT) and USD Coin (USDC) — are backed by reserves of cash and short-term Treasury securities, and each token is intended to be redeemable for one dollar.",
      "They serve as the plumbing of the crypto economy. Traders move in and out of positions without touching the banking system, exchanges quote prices against them, and people in countries with unstable currencies hold them as digital dollars. Cross-border payments use them to settle in minutes instead of days.",
      "The trade-offs are transparency and depegging risk. Reserve quality varies between issuers, and stablecoins have broken their peg during stress events — most notably TerraUSD in 2022. Checking which issuer backs a stablecoin, and how often it publishes attestations, is the first due-diligence step.",
    ],
  },
  {
    slug: "cold-wallet",
    term: "Cold Wallet",
    body: "A wallet kept offline — hardware devices or paper. Not your keys, not your coins: exchanges hold billions, cold storage keeps them out of hackers' reach.",
    paragraphs: [
      "A cold wallet (or cold storage) is any method of holding cryptocurrency keys that is never connected to the internet — hardware wallets like Ledger or Trezor devices, steel seed-phrase plates, or plain paper backups. Because the private keys never touch an online machine, remote attackers can't steal them.",
      "The opposite is a hot wallet — a phone app, browser extension, or exchange account — which stays connected for convenience but is a bigger target. The standard practice is a tiered approach: a small hot wallet for spending, and the bulk of holdings in cold storage that you rarely move.",
      "Cold storage also shifts responsibility to you. If a hardware device is lost, the seed phrase is the only recovery path, which is why serious holders engrave it on metal and store copies in separate secure locations. Not your keys, not your coins cuts both ways: total custody means no customer support if the phrase is gone.",
    ],
  },
  {
    slug: "gas-fees",
    term: "Gas Fees",
    body: "The cost of using a network. Fees pay the machines validating your transaction and rise when the network is busy — cheapest on nights and weekends.",
    paragraphs: [
      "Gas fees are the transaction costs paid to process activity on a blockchain. On Ethereum they compensate validators for the compute needed to run your transaction, and they're denominated in gwei (a tiny fraction of ETH) per unit of computational effort called gas.",
      "Fees float with demand: when networks are congested — NFT mints, market panics, major token launches — prices spike, and during quiet periods they fall. Layer-2 networks like Base, Arbitrum, and Optimism batch transactions to cut these costs by orders of magnitude, which is where most retail activity has migrated.",
      "Practical advice for users: expect the cheapest fees on weekends and during US overnight hours, use the network's own wallet estimate as a baseline, and on Ethereum prefer layer-2s for small transfers — a $5 fee on a $20 payment makes no sense.",
    ],
  },
  {
    slug: "altcoins",
    term: "Altcoins",
    body: "Everything that isn't Bitcoin — Ethereum, Solana, and thousands of others. They experiment with speed, smart contracts, and memes that BTC deliberately avoids.",
    paragraphs: [
      "Altcoins — short for alternative coins — is the catch-all term for every cryptocurrency besides bitcoin. The largest, Ethereum, introduced programmable smart contracts; others like Solana, Cardano, and Avalanche compete on speed and fees, while thousands more serve narrower purposes or no purpose at all.",
      "Investors treat altcoins as higher-risk, higher-variance bets on top of a bitcoin core position. They typically fall harder in bear markets and rally harder in bulls, and the vast majority of them lose value against bitcoin over long periods — a dynamic investors call \"altcoin season\" when it briefly reverses.",
      "When evaluating one, the useful questions are boring ones: does the network have real users and fees, is the token actually required to use it, and who holds the supply? A whitepaper full of promises answers none of them.",
    ],
  },
];
