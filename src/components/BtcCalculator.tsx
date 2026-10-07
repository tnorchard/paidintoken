"use client";

import { useState } from "react";

export function BtcCalculator({ btcPrice }: { btcPrice: number }) {
  const [amount, setAmount] = useState("1");

  const numeric = Number.parseFloat(amount);
  const valid = Number.isFinite(numeric) && numeric >= 0;
  const usd = valid ? numeric * btcPrice : null;

  return (
    <div className="rounded-lg border border-line bg-card p-5">
      <label
        htmlFor="btc-amount"
        className="text-xs font-bold uppercase tracking-wider text-muted"
      >
        Bitcoin amount
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-md border border-line bg-surface px-3 py-2">
          <input
            id="btc-amount"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-40 bg-transparent text-lg font-bold tabular-nums outline-none"
          />
          <span className="ml-2 text-sm font-bold text-muted">BTC</span>
        </div>
        <span aria-hidden="true" className="text-xl text-muted">
          =
        </span>
        <div className="rounded-md border border-line bg-surface px-3 py-2">
          <p className="text-lg font-bold tabular-nums">
            {usd !== null
              ? usd.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                })
              : "—"}
          </p>
          <span className="text-sm font-bold text-muted">USD</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        1 BTC = {btcPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })} ·
        rate refreshes every 60 seconds
      </p>
    </div>
  );
}
