/**
 * Ranking algorithm for racers in Gadbad Grub
 * Rules:
 * 1. Finished racers are ordered by finishing time/order
 * 2. Active racers are ordered by lowest valid etaSeconds
 * 3. Tie-breaker 1: Highest progress percentage
 * 4. Tie-breaker 2: Stable racerId (alphabetical)
 */
function rankRacers(racers = []) {
  if (!Array.isArray(racers)) return [];

  // Deep clone to avoid mutating input array
  const sortedRacers = racers.map(r => ({ ...r }));

  sortedRacers.sort((a, b) => {
    // 1. Finished racers take top positions
    if (a.status === 'FINISHED' && b.status !== 'FINISHED') return -1;
    if (b.status === 'FINISHED' && a.status !== 'FINISHED') return 1;

    // If both finished, sort by finishedAt or higher progress
    if (a.status === 'FINISHED' && b.status === 'FINISHED') {
      if (a.finishedAt && b.finishedAt) {
        return new Date(a.finishedAt) - new Date(b.finishedAt);
      }
      return (b.progress || 100) - (a.progress || 100);
    }

    // 2. Active racers: valid ETA comparison (lowest valid etaSeconds wins)
    const aEtaValid = typeof a.etaSeconds === 'number' && !isNaN(a.etaSeconds) && a.etaSeconds >= 0;
    const bEtaValid = typeof b.etaSeconds === 'number' && !isNaN(b.etaSeconds) && b.etaSeconds >= 0;

    if (aEtaValid && !bEtaValid) return -1;
    if (!aEtaValid && bEtaValid) return 1;

    if (aEtaValid && bEtaValid && a.etaSeconds !== b.etaSeconds) {
      return a.etaSeconds - b.etaSeconds;
    }

    // 3. Tie-breaker 1: Highest progress
    const aProgress = a.progress || 0;
    const bProgress = b.progress || 0;
    if (aProgress !== bProgress) {
      return bProgress - aProgress;
    }

    // 4. Tie-breaker 2: Stable racerId
    const aId = String(a.racerId || a.id || '');
    const bId = String(b.racerId || b.id || '');
    return aId.localeCompare(bId);
  });

  // Assign 1-indexed ranks
  return sortedRacers.map((racer, index) => ({
    ...racer,
    rank: index + 1,
  }));
}

/**
 * Calculate virtual ETA in seconds based on remaining progress and progress rate
 * remainingProgress = 100 - progress
 * etaSeconds = Math.round(remainingProgress / virtualProgressRate)
 */
function calculateEtaSeconds(progress, virtualProgressRate = 1.0) {
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  if (safeProgress >= 100) return 0;
  const remaining = 100 - safeProgress;
  const rate = virtualProgressRate > 0 ? virtualProgressRate : 1.0;
  return Math.max(1, Math.round(remaining / rate));
}

module.exports = {
  rankRacers,
  calculateEtaSeconds,
};
