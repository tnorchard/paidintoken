import type { AthleteRow } from "@/types";

interface AthleteTableProps {
  rows: AthleteRow[];
}

export function AthleteTable({ rows }: AthleteTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="pit-table w-full border-collapse text-left">
        <thead>
          <tr>
            <th>Person</th>
            <th className="col-numbits">Number of Bitcoins</th>
            <th>Sum Paid</th>
            <th>Current Value</th>
            <th className="col-pl">Profit/Loss</th>
            <th className="col-price">Price at Payment</th>
            <th className="col-date">Dates Paid</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td className="col-numbits">{row.numbits}</td>
              <td>${row.sumpaid.toLocaleString("en-US")}</td>
              <td>${row.currentValue.toLocaleString("en-US")}</td>
              <td className="col-pl">
                <span
                  className={
                    row.profitLoss >= 0 ? "text-green-700" : "text-red-700"
                  }
                >
                  {row.profitLossFormatted.split(" (")[0]}
                </span>
                <span className="yo ml-1 text-sm text-gray-600">
                  ({row.profitLossPercent}%)
                </span>
              </td>
              <td className="col-price">
                {row.priceAtPaymentFormatted}
                <span className="yo ml-1 text-sm text-gray-600">
                  ({row.priceDifferenceFormatted})
                </span>
              </td>
              <td className="col-date">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
