/**
 * Format total seconds into MM:SS format
 */
export function formatSecondsToMMSS(totalSeconds) {
  if (totalSeconds == null || isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format ETA seconds into human-readable string like "4 min 12 sec" or "< 1 min"
 */
export function formatEtaHuman(totalSeconds) {
  if (totalSeconds == null || isNaN(totalSeconds) || totalSeconds <= 0) return 'Arrived! 🏁';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds > 0 ? `${seconds}s` : ''}`.trim();
}

/**
 * Format timestamp into HH:MM AM/PM
 */
export function formatTimeOfDay(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Relative time ago formatted (e.g., 'Just now', '2m ago')
 */
export function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 5) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  return `${diffInHours}h ago`;
}
