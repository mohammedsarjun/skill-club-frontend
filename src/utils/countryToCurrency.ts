export type CountryCurrencyCode = 'IN' | 'US' | 'GB' | 'AU' | 'CA' | 'SG' | 'AE' | 'JP' | 'CH' | 'EU';

export const countryToCurrency: Record<CountryCurrencyCode, string> = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  AU: 'AUD',
  CA: 'CAD',
  SG: 'SGD',
  AE: 'AED',
  JP: 'JPY',
  CH: 'CHF',
  EU: 'EUR'
};

export function getCurrency(code: string): string {
  return countryToCurrency[code as CountryCurrencyCode] || 'USD';
}

export default countryToCurrency;