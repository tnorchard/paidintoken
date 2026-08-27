export interface Athlete {
  name: string;
  numbits: number;
  sumpaid: number;
  date: string;
  pricebought: number;
  transaction: string;
}

export interface BitcoinPrice {
  last: number;
  high: number;
  low: number;
}

export interface AthleteRow extends Athlete {
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  profitLossFormatted: string;
  priceAtPaymentFormatted: string;
  priceDifferenceFormatted: string;
}
