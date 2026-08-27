# PaidinToken

A Next.js rebuild of [paidintoken.com](https://paidintoken.com) — tracking Bitcoin payments received by celebrities and athletes.

## Features

- Live Bitcoin price with 24hr high/low (via CoinGecko API)
- Interactive table: hover high/low prices to recalculate athlete holdings
- Responsive layout matching the original site
- Archived legacy source files from AWS, iCloud, and PythonAnywhere

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/           # Next.js app router + API routes
  components/    # React UI components
  data/          # Athlete payment database
  lib/           # Calculation helpers
legacy/          # Archived originals from all source locations
  aws-s3/        # Production S3 deploy backup
  icloud-bitcoin-page/
  icloud-github-pit/
  icloud-desktop/
  pythonanywhere/
```

## Legacy Sources

This repo consolidates files from:

- AWS S3 backup (`paidintoken.com`)
- iCloud `Bitcoin_Page/paid_in_token`
- iCloud GitHub `pit` repo
- PythonAnywhere `tokenpaidtrial` account

## License

Private project — PaidinToken ™
