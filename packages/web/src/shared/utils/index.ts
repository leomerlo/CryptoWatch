// Shared utility functions

export function formatCurrency(amount: number, currency: string, compact: boolean = false) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
  }).format(amount)
}
