import { DEMO_RACERS } from './constants';

const AVATARS = ['🛵', '🏍️', '🏎️', '🚀', '🚗', '🛴'];
const COLORS = ['#FF3366', '#FFB800', '#00F0FF', '#00E676', '#9D4EDD', '#FF6B35'];

/**
 * Map backend race payloads (WAITING/RUNNING/FINISHED + racerId)
 * into the shape the race UI expects (racing/finished + id).
 */
export function normalizeRace(raw) {
  if (!raw) return null;

  const statusRaw = String(raw.status || '').toUpperCase();
  let status = 'racing';
  if (statusRaw === 'FINISHED' || statusRaw === 'CANCELLED') status = 'finished';
  else if (statusRaw === 'WAITING') status = 'waiting';
  else if (statusRaw === 'RUNNING' || statusRaw === 'RACING') status = 'racing';
  else if (raw.status === 'finished' || raw.status === 'racing' || raw.status === 'waiting') {
    status = raw.status;
  }

  const racers = (raw.racers || []).map((racer, idx) => {
    const id = racer.id || racer.racerId || `racer_${idx + 1}`;
    const demo = DEMO_RACERS.find((d) => d.id === id) || DEMO_RACERS[idx] || {};
    const progress = Number(racer.progress ?? 0);
    return {
      ...demo,
      ...racer,
      id,
      racerId: racer.racerId || id,
      name: racer.name || demo.name || `Racer ${idx + 1}`,
      progress,
      speed: racer.speed ?? demo.baseSpeed ?? 55,
      baseSpeed: racer.baseSpeed ?? demo.baseSpeed ?? 55,
      rank: racer.rank || idx + 1,
      distanceLeftKm:
        racer.distanceLeftKm ??
        (racer.distanceRemaining != null
          ? (Number(racer.distanceRemaining) / 1000).toFixed(2)
          : ((100 - progress) * 0.035).toFixed(2)),
      avatar: racer.avatar || demo.avatar || AVATARS[idx % AVATARS.length],
      color: racer.color || demo.color || COLORS[idx % COLORS.length],
      vehicle: racer.vehicle || demo.vehicle || 'Turbo Scooter',
    };
  });

  const ranked = [...racers].sort((a, b) => b.progress - a.progress)
    .map((r, idx) => ({ ...r, rank: idx + 1 }));

  const primary =
    ranked.find((r) => r.id === raw.racerId || r.racerId === raw.racerId) ||
    ranked[0] ||
    null;

  const progress = Number(
    raw.progress ??
      primary?.progress ??
      0
  );

  return {
    ...raw,
    _id: raw._id || raw.raceId,
    racerId: raw.racerId || primary?.id || ranked[0]?.id,
    racerName: raw.racerName || primary?.name || ranked[0]?.name,
    status,
    progress,
    etaSeconds: Number(
      raw.etaSeconds ??
        primary?.etaSeconds ??
        Math.max(0, Math.round((100 - progress) * 4.2))
    ),
    trackingSource: String(raw.trackingSource || 'SIMULATOR').toLowerCase() === 'simulator'
      ? 'simulated'
      : raw.trackingSource,
    racers: ranked.length ? ranked : DEMO_RACERS.map((r, idx) => ({
      ...r,
      progress: Math.max(5, 20 - idx * 4),
      speed: r.baseSpeed,
      rank: idx + 1,
      distanceLeftKm: (3.0 - idx * 0.4).toFixed(1),
    })),
  };
}

export default normalizeRace;
