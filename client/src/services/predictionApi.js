import apiClient from './apiClient';
import { IS_DEMO_MODE } from '../utils/constants';

export const predictionApi = {
  /**
   * Submit winner prediction for a race
   */
  async submitPrediction(raceId, { userId, predictedRacerId }) {
    try {
      const res = await apiClient.post(`/races/${raceId}/predictions`, { userId, predictedRacerId });
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        console.info(`[Demo Mode] Stored prediction for ${predictedRacerId} on race ${raceId}`);
        const prediction = {
          _id: `pred_${Date.now()}`,
          userId: userId || 'usr_gadbad_demo_01',
          raceId,
          predictedRacerId,
          submittedAt: new Date().toISOString(),
          result: 'pending',
          pointsAwarded: 0
        };
        sessionStorage.setItem(`pred_${raceId}`, JSON.stringify(prediction));
        return prediction;
      }
      throw err;
    }
  },

  /**
   * Get prediction for a specific race
   */
  async getPrediction(raceId) {
    if (IS_DEMO_MODE) {
      const local = sessionStorage.getItem(`pred_${raceId}`);
      if (local) return JSON.parse(local);
    }
    return null;
  }
};

export default predictionApi;
