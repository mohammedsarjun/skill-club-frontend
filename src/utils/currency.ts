// Simple INR-only currency formatting utility

export type SupportedCurrency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'AUD'
  | 'CAD'
  | 'SGD'
  | 'JPY'
  | 'AED'
  | 'CHF';

/**
 * Format amount as INR currency
 * @param amount - The amount to format
 * @param _currency - Optional currency parameter (ignored, for backwards compatibility)
 * @returns Formatted string like "₹1,234.56"
 */
export function formatCurrency(amount: number, _currency?: SupportedCurrency | string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get currency symbol (always ₹ for INR)
 */
export function getCurrencySymbol(): string {
  return '₹';
}

// Backwards-compatible stubs for formerly exported currency helpers.
// The app is INR-only now; these functions keep imports working and
// perform identity/no-op conversions.

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '₹',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  JPY: '¥',
  AED: 'د.إ',
  CHF: 'CHF',
};

export async function convertCurrency(
  amount: number,
  _from: string,
  _to: string,
): Promise<number> {
  // No conversion in single-currency mode; return the input amount.
  return amount;
}

export function getUsdRateFor(_currency: string): number {
  // Rates are not used in INR-only mode; return 1 for compatibility.
  return 1;
}
