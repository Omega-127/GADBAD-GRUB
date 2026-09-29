import apiClient from './apiClient';
import { DEFAULT_USER, ALL_BADGES, IS_DEMO_MODE } from '../utils/constants';

export const rewardsApi = {
  /**
   * Get user profile details
   */
  async getUserProfile(userId) {
    try {
      const res = await apiClient.get(`/rewards/user/${userId}/profile`).catch(() => apiClient.get(`/users/${userId}/profile`));
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        return DEFAULT_USER;
      }
      throw err;
    }
  },

  /**
   * Get user rewards and history
   */
  async getUserRewards(userId) {
    try {
      const res = await apiClient.get(`/rewards/user/${userId}`).catch(() => apiClient.get(`/users/${userId}/rewards`));
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        return {
          points: 1250,
          xp: 3420,
          level: 7,
          badges: ALL_BADGES,
          unlockedBadges: ['FIRST_ORDER', 'PREDICTION_KING', 'LIGHTNING_FAST', 'VIP_RACER'],
          history: [
            {
              _id: 'rw_01',
              type: 'PREDICTION_WIN',
              title: 'Correct Winner Prediction: Pizza Panther',
              points: 250,
              badgeCode: 'PREDICTION_KING',
              createdAt: new Date(Date.now() - 3600 * 1000).toISOString()
            },
            {
              _id: 'rw_02',
              type: 'ORDER_BONUS',
              title: 'Speed Racer Order XP',
              points: 100,
              badgeCode: 'FIRST_ORDER',
              createdAt: new Date(Date.now() - 86400 * 1000).toISOString()
            },
            {
              _id: 'rw_03',
              type: 'SPEED_BONUS',
              title: 'Super 15-Minute Finish Bonus',
              points: 150,
              badgeCode: 'LIGHTNING_FAST',
              createdAt: new Date(Date.now() - 172800 * 1000).toISOString()
            }
          ]
        };
      }
      throw err;
    }
  }
};

export default rewardsApi;
