import apiClient from './apiClient';
import { DEMO_RACERS, IS_DEMO_MODE, DEFAULT_USER } from '../utils/constants';
import { normalizeRace } from '../utils/normalizeRace';

function buildLocalRace(raceId, orderId, racerId) {
  const selectedRacer = DEMO_RACERS.find((r) => r.id === racerId) || DEMO_RACERS[0];
  return normalizeRace({
    _id: raceId || `race_${Date.now()}`,
    orderId: orderId || `ord_${Date.now()}`,
    racerId: selectedRacer.id,
    racerName: selectedRacer.name,
    progress: 8,
    etaSeconds: 480,
    status: 'racing',
    trackingSource: 'simulated',
    racers: DEMO_RACERS.map((r, idx) => ({
      ...r,
      progress: Math.max(0, 10 - idx * 2),
      speed: r.baseSpeed,
      rank: idx + 1,
      distanceLeftKm: 3.2,
    })),
    updatedAt: new Date().toISOString(),
  });
}

export const raceApi = {
  /**
   * Create or start a race for an order
   */
  async createRace({ orderId, racerId, racerName, autoStart = true }) {
    try {
      const res = await apiClient.post('/races', { orderId, autoStart });
      if (res.success && res.data) {
        const race = normalizeRace(res.data);
        if (autoStart && race.status === 'waiting') {
          try {
            await this.startRace(race._id);
            return normalizeRace({ ...race, status: 'racing' });
          } catch {
            return race;
          }
        }
        return race;
      }
    } catch (err) {
      if (IS_DEMO_MODE) {
        console.info('[Demo Mode] Creating local simulated race');
        const newRace = buildLocalRace(null, orderId, racerId);
        if (racerName) newRace.racerName = racerName;
        sessionStorage.setItem('current_race', JSON.stringify(newRace));
        return newRace;
      }
      throw err;
    }
  },

  /**
   * Explicitly start / resume a race simulation on the backend
   */
  async startRace(raceId) {
    const res = await apiClient.post(`/races/${raceId}/start`, {});
    if (res.success && res.data) return res.data;
    return res;
  },

  /**
   * Get list of active races
   */
  async getActiveRaces() {
    try {
      const res = await apiClient.get('/races');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(normalizeRace);
      }
    } catch (err) {
      if (IS_DEMO_MODE) {
        return [
          normalizeRace({
            _id: 'race_live_demo_01',
            orderId: 'ord_demo_speed_99',
            racerName: 'Pizza Panther',
            status: 'racing',
            progress: 68,
            etaSeconds: 195,
            trackingSource: 'simulated',
            racers: DEMO_RACERS,
          }),
        ];
      }
      throw err;
    }
    return [];
  },

  /**
   * Get specific race state
   */
  async getRace(raceId) {
    try {
      const res = await apiClient.get(`/races/${raceId}`);
      if (res.success && res.data) return normalizeRace(res.data);
    } catch (err) {
      if (IS_DEMO_MODE) {
        const stored = sessionStorage.getItem('current_race');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed._id === raceId) return normalizeRace(parsed);
        }
        return buildLocalRace(raceId || 'race_live_demo_01', 'ord_demo_speed_99', 'racer_1');
      }
      throw err;
    }
  },

  /**
   * Ensure there is a live race to watch (used by Race Watch Hub / /race with no id).
   * Prefer an existing RUNNING race; otherwise create a quick demo order+race.
   */
  async ensureLiveRace() {
    try {
      const races = await this.getActiveRaces();
      const live = (races || []).find(
        (r) =>
          (r.status === 'racing' || r.status === 'waiting') &&
          Number(r.progress || 0) < 85
      );
      if (live) {
        if (live.status === 'waiting') {
          try {
            await this.startRace(live._id);
            return normalizeRace({ ...live, status: 'racing' });
          } catch {
            return live;
          }
        }
        return live;
      }

      // Spin up a fresh order+race on the backend
      const orderRes = await apiClient.post('/orders', {
        userId: DEFAULT_USER._id,
        restaurantId: 'rest_pizza_01',
        items: [{ menuItemId: 'item_pizza_01', quantity: 1 }],
        autoStartRace: true,
      });

      if (orderRes?.success && orderRes.data) {
        const race = orderRes.data.race || orderRes.data;
        if (race?._id || race?.raceId) {
          let normalized = normalizeRace(race);
          // Backend may return stale WAITING even after autoStart — kick simulator
          if (normalized.status === 'waiting') {
            try {
              await this.startRace(normalized._id);
              normalized = normalizeRace({ ...normalized, status: 'racing' });
            } catch {
              // local / poll will recover
            }
          }
          sessionStorage.setItem('current_race', JSON.stringify(normalized));
          return normalized;
        }
        const order = orderRes.data.order || orderRes.data;
        if (order?._id) {
          return this.createRace({ orderId: order._id, autoStart: true });
        }
      }
    } catch (err) {
      if (IS_DEMO_MODE) {
        console.info('[Demo Mode] ensureLiveRace falling back to local sim', err.message);
        const local = buildLocalRace(`race_live_${Date.now()}`, `ord_live_${Date.now()}`, 'racer_1');
        sessionStorage.setItem('current_race', JSON.stringify(local));
        return local;
      }
      throw err;
    }

    // Last resort local race so the hub never bricks
    const local = buildLocalRace(`race_live_${Date.now()}`, `ord_live_${Date.now()}`, 'racer_1');
    sessionStorage.setItem('current_race', JSON.stringify(local));
    return local;
  },

  /**
   * Get events/commentary for a race
   */
  async getRaceEvents(raceId) {
    try {
      const res = await apiClient.get(`/races/${raceId}/events`);
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        return [
          {
            _id: 'evt_1',
            raceId,
            type: 'START',
            message: '🟢 GREEN LIGHT! Riders have blasted off from the restaurant kitchen with turbo speed!',
            source: 'simulator',
            createdAt: new Date(Date.now() - 120000).toISOString(),
          },
          {
            _id: 'evt_2',
            raceId,
            type: 'CHECKPOINT_1',
            message: '📍 Checkpoint 1 cleared at Avenue Parkway! Pizza Panther leads the pack by 50 meters.',
            source: 'simulator',
            createdAt: new Date(Date.now() - 60000).toISOString(),
          },
          {
            _id: 'evt_3',
            raceId,
            type: 'NITRO_BOOST',
            message: '⚡ NITRO ACTIVATED! Biryani Bullet is closing in on the inside corner drift!',
            source: 'simulator',
            createdAt: new Date(Date.now() - 20000).toISOString(),
          },
        ];
      }
      throw err;
    }
    return [];
  },
};

export default raceApi;
