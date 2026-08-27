import type { BitcoinPrice } from "@/types";

interface PriceHeaderProps {
  prices: BitcoinPrice | null;
  onHoverHigh: () => void;
  onHoverLow: () => void;
  onHoverEnd: () => void;
}

function formatPrice(value: number | undefined): string {
  if (value === undefined) return "—";
  return value.toLocaleString("en-US");
}

export function PriceHeader({
  prices,
  onHoverHigh,
  onHoverLow,
  onHoverEnd,
}: PriceHeaderProps) {
  return (
    <>
      <p className="text-xl font-semibold">
        <b>The Current Price of Bitcoin is...</b>
      </p>

      <div className="mt-2 flex flex-wrap items-start gap-6">
        <h1 className="text-3xl font-bold">
          ${formatPrice(prices?.last)}
        </h1>

        <div className="ml-2">
          <div
            id="days_high"
            className="cursor-pointer"
            onMouseEnter={onHoverHigh}
            onMouseLeave={onHoverEnd}
          >
            <p className="text-sm font-bold text-green-600">24hr High Price</p>
            <h4 className="text-green-600">${formatPrice(prices?.high)}</h4>
          </div>

          <div
            id="days_low"
            className="mt-2 cursor-pointer"
            onMouseEnter={onHoverLow}
            onMouseLeave={onHoverEnd}
          >
            <p className="text-sm font-bold text-red-600">24hr Low Price</p>
            <h4 className="text-red-600">${formatPrice(prices?.low)}</h4>
          </div>
        </div>
      </div>
    </>
  );
}
