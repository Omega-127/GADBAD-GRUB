import apiClient from './apiClient';
import { DEMO_RACERS, IS_DEMO_MODE } from '../utils/constants';

export const raceApi = {
  /**
   * Create or start a race for an order
   */
  async createRace({ orderId, racerId, racerName }) {
    try {
      const res = await apiClient.post('/races', { orderId, racerId, racerName });
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        console.info('[Demo Mode] Creating local simulated race');
        const selectedRacer = DEMO_RACERS.find(r => r.id === racerId) || DEMO_RACERS[0];
        const newRace = {
          _id: `race_${Date.now()}`,
          orderId: orderId || `ord_${Date.now()}`,
          racerId: selectedRacer.id,
          racerName: selectedRacer.name,
          progress: 5,
          etaSeconds: 480,
          status: 'racing',
          trackingSource: 'simulated',
          racers: DEMO_RACERS.map((r, idx) => ({
            ...r,
            progress: Math.max(0, 8 - idx * 2),
            speed: r.baseSpeed,
            rank: idx + 1,
            distanceLeftKm: 3.2
          })),
          updatedAt: new Date().toISOString()
        };
        sessionStorage.setItem('current_race', JSON.stringify(newRace));
        return newRace;
      }
      throw err;
    }
  },

  /**
   * Get list of active races
   */
  async getActiveRaces() {
    try {
      const res = await apiClient.get('/races');
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        return [
          {
            _id: 'race_live_demo_01',
            orderId: 'ord_demo_speed_99',
            racerName: 'Pizza Panther',
            status: 'racing',
            progress: 68,
            etaSeconds: 195,
            trackingSource: 'simulated'
          }
        ];
      }
      throw err;
    }
  },

  /**
   * Get specific race state
   */
  async getRace(raceId) {
    try {
      const res = await apiClient.get(`/races/${raceId}`);
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        const stored = sessionStorage.getItem('current_race');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed._id === raceId) return parsed;
        }
        return {
          _id: raceId || 'race_live_demo_01',
          orderId: 'ord_demo_speed_99',
          racerId: 'racer_1',
          racerName: 'Pizza Panther',
          progress: 55,
          etaSeconds: 240,
          status: 'racing',
          trackingSource: 'simulated',
          racers: DEMO_RACERS.map((r, idx) => ({
            ...r,
            progress: Math.max(10, 60 - idx * 10),
            speed: r.baseSpeed + (idx === 0 ? 5 : -2),
            rank: idx + 1,
            distanceLeftKm: (2.5 - idx * 0.4).toFixed(1)
          })),
          updatedAt: new Date().toISOString()
        };
      }
      throw err;
    }
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
            createdAt: new Date(Date.now() - 120000).toISOString()
          },
          {
            _id: 'evt_2',
            raceId,
            type: 'CHECKPOINT_1',
            message: '📍 Checkpoint 1 cleared at Avenue Parkway! Pizza Panther leads the pack by 50 meters.',
            source: 'simulator',
            createdAt: new Date(Date.now() - 60000).toISOString()
          },
          {
            _id: 'evt_3',
            raceId,
            type: 'NITRO_BOOST',
            message: '⚡ NITRO ACTIVATED! Biryani Bullet is closing in on the inside corner drift!',
            source: 'simulator',
            createdAt: new Date(Date.now() - 20000).toISOString()
          }
        ];
      }
      throw err;
    }
  }
};

export default raceApi;
