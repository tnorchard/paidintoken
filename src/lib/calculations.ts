import type { Athlete, AthleteRow } from "@/types";

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function formatUsdSigned(value: number): string {
  if (value > 0) return formatUsd(value);
  return `-$${Math.abs(value).toLocaleString("en-US")}`;
}

export function buildAthleteRows(
  athletes: Athlete[],
  btcPrice: number,
): AthleteRow[] {
  return athletes.map((athlete) => {
    const currentValue =
      Math.round(athlete.numbits * btcPrice * 100) / 100;
    const profitLoss =
      Math.round((currentValue - athlete.sumpaid) * 100) / 100;
    const profitLossPercent =
      Math.round((profitLoss / athlete.sumpaid) * 100 * 100) / 100;

    const difference = btcPrice - Math.round(athlete.pricebought);
    const plusMinus = difference >= 0 ? "+" : "-";

    return {
      ...athlete,
      currentValue,
      profitLoss,
      profitLossPercent,
      profitLossFormatted: `${formatUsdSigned(profitLoss)} (${profitLossPercent}%)`,
      priceAtPaymentFormatted: formatUsd(Math.round(athlete.pricebought)),
      priceDifferenceFormatted: `${plusMinus}$${Math.abs(difference).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };
  });
}
