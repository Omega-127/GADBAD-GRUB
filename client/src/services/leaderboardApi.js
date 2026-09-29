import apiClient from './apiClient';
import { DEMO_RACERS, IS_DEMO_MODE } from '../utils/constants';

export const leaderboardApi = {
  /**
   * Get leaderboard of active racers and top users
   */
  async getLeaderboard() {
    try {
      const res = await apiClient.get('/leaderboard');
      if (res.success && res.data) return res.data;
    } catch (err) {
      if (IS_DEMO_MODE) {
        return {
          racers: [
            {
              rank: 1,
              racerId: 'racer_1',
              racerName: 'Pizza Panther',
              avatar: '🛵',
              vehicle: 'Turbo Scooter 3000',
              etaSeconds: 180,
              progress: 75,
              wins: 42,
              winRate: '78%',
              status: 'racing'
            },
            {
              rank: 2,
              racerId: 'racer_2',
              racerName: 'Biryani Bullet',
              avatar: '🏍️',
              vehicle: 'Supersonic Hyperbike',
              etaSeconds: 210,
              progress: 70,
              wins: 38,
              winRate: '72%',
              status: 'racing'
            },
            {
              rank: 3,
              racerId: 'racer_3',
              racerName: 'Burger Beast',
              avatar: '🏎️',
              vehicle: 'Nitro Muscle Rig',
              etaSeconds: 260,
              progress: 62,
              wins: 31,
              winRate: '65%',
              status: 'racing'
            },
            {
              rank: 4,
              racerId: 'racer_4',
              racerName: 'Taco Turbo',
              avatar: '🚀',
              vehicle: 'Cyber Hoverpod',
              etaSeconds: 310,
              progress: 54,
              wins: 26,
              winRate: '60%',
              status: 'racing'
            }
          ],
          topUsers: [
            { rank: 1, name: 'VeloceGrub', points: 4890, badge: '👑 Grand Champion', accuracy: '89%' },
            { rank: 2, name: 'TurboNosh', points: 4120, badge: '⚡ High Roller', accuracy: '82%' },
            { rank: 3, name: 'SpeedyGourmet (You)', points: 1250, badge: '🔮 Track Oracle', accuracy: '68%' },
            { rank: 4, name: 'NitroSnack', points: 980, badge: '🏁 Swift Pacer', accuracy: '61%' }
          ]
        };
      }
      throw err;
    }
  }
};

export default leaderboardApi;
