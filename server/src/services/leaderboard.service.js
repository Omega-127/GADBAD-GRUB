const RaceModel = require('../models/race.model');
const UserModel = require('../models/user.model');
const { rankRacers } = require('../utils/ranking');
const ApiError = require('../utils/ApiError');

class LeaderboardService {
  /**
   * Get ranked racers for a specific race, or the most recent active race
   */
  async getRaceLeaderboard(raceId = null) {
    let race = null;

    if (raceId) {
      race = await RaceModel.findById(raceId);
      if (!race) {
        throw ApiError.notFound(`Race not found: ${raceId}`);
      }
    } else {
      // Find the most recent active or running race
      const races = await RaceModel.find({});
      if (races.length > 0) {
        // Prefer RUNNING, then WAITING, then FINISHED
        race =
          races.find((r) => r.status === RaceModel.RACE_STATUSES.RUNNING) ||
          races.find((r) => r.status === RaceModel.RACE_STATUSES.WAITING) ||
          races[races.length - 1];
      }
    }

    if (!race || !Array.isArray(race.racers)) {
      return { raceId: null, racers: [] };
    }

    const ranked = rankRacers(race.racers);

    return {
      raceId: race._id,
      raceStatus: race.status,
      trackingSource: race.trackingSource,
      racers: ranked,
    };
  }

  /**
   * Get global user leaderboard sorted by points and XP
   */
  async getUserLeaderboard(limit = 10) {
    const users = await UserModel.find({});

    const sortedUsers = [...users].sort((a, b) => {
      const pointsDiff = (b.points || 0) - (a.points || 0);
      if (pointsDiff !== 0) return pointsDiff;
      return (b.xp || 0) - (a.xp || 0);
    });

    const ranked = sortedUsers.slice(0, limit).map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      displayName: user.displayName,
      avatar: user.avatar,
      points: user.points || 0,
      xp: user.xp || 0,
      badgeCount: Array.isArray(user.badges) ? user.badges.length : 0,
    }));

    return ranked;
  }
}

module.exports = new LeaderboardService();
