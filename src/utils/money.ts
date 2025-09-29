export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

export const toCents = (value: number): number => {
  return Math.round(value * 100);
};

export const fromCents = (value: number): number => {
  return value / 100;
};
