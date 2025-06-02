
/**
 * Formats a number as Brazilian Real (R$) currency
 * @param value - The number value to format
 * @returns Formatted string with R$ symbol
 */
export const formatCurrency = (value: number): string => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

/**
 * Converts points or credits to their currency value
 * @param amount - Number of points or credits
 * @returns The equivalent value in Real (R$)
 */
export const convertToMoney = (amount: number): number => 
  // Conversion rule: 10 points/credits = R$1.00
   amount * 0.1
;

/**
 * Returns the formatted money value for a given number of points/credits
 * @param amount - Number of points or credits
 * @returns Formatted string with R$ symbol
 */
export const getMoneyValue = (amount: number): string => formatCurrency(convertToMoney(amount));
