/**
 * Formata um valor para moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada em reais
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata uma data para o formato brasileiro
 * @param date Data a ser formatada
 * @returns String formatada no padrão dd/mm/yyyy
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('pt-BR').format(date);
} 