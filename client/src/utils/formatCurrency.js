/**
 * Format numeric value to US Dollar currency string
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format reward points with commas
 */
export function formatPoints(points) {
  if (points == null || isNaN(points)) return '0 PTS';
  return `${new Intl.NumberFormat('en-US').format(points)} PTS`;
}
