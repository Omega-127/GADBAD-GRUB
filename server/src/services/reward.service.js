const UserModel = require('../models/user.model');
const RewardModel = require('../models/reward.model');
const UserRewardModel = require('../models/userReward.model');
const ApiError = require('../utils/ApiError');
const generateId = require('../utils/generateId');

class RewardService {
  /**
   * Award points and XP with idempotency checking via sourceEventId
   */
  async awardPointsAndXp(userId, { points = 0, xp = 0, sourceEventId = null, description = '' }) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.notFound(`User not found: ${userId}`);
    }

    // Enforce idempotency if sourceEventId provided
    if (sourceEventId) {
      const existing = await UserRewardModel.findOne({ sourceEventId });
      if (existing) {
        return { duplicate: true, userReward: existing };
      }
    }

    // Record reward
    const rewardRecord = await UserRewardModel.create({
      _id: generateId('rew'),
      userId,
      type: 'POINTS_XP',
      points,
      xp,
      sourceEventId,
      description,
    });

    // Update user balance
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $inc: { points, xp },
      },
      { new: true }
    );

    return { duplicate: false, userReward: rewardRecord, user: updatedUser };
  }

  /**
   * Award a badge to a user with idempotency
   */
  async awardBadge(userId, badgeCode, options = {}) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.notFound(`User not found: ${userId}`);
    }

    const badgeDef = RewardModel.BADGES[badgeCode];
    if (!badgeDef) {
      throw ApiError.badRequest(`Unknown badge code: ${badgeCode}`);
    }

    // Check if user already possesses this badge
    const badges = Array.isArray(user.badges) ? user.badges : [];
    if (badges.includes(badgeCode)) {
      return { awarded: false, message: 'User already has this badge' };
    }

    const sourceEventId = options.sourceEventId || `badge_${badgeCode}_${userId}`;
    const existing = await UserRewardModel.findOne({ sourceEventId });
    if (existing) {
      return { duplicate: true, userReward: existing };
    }

    // Create user reward entry
    const rewardRecord = await UserRewardModel.create({
      _id: generateId('rew_badge'),
      userId,
      type: 'BADGE',
      badgeCode,
      points: badgeDef.points || 0,
      xp: badgeDef.xp || 0,
      sourceEventId,
      description: `Earned badge: ${badgeDef.name} - ${badgeDef.description}`,
    });

    // Add badge to user and award associated points & XP
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { badges: badgeCode },
        $inc: { points: badgeDef.points || 0, xp: badgeDef.xp || 0 },
      },
      { new: true }
    );

    return { awarded: true, badge: badgeDef, userReward: rewardRecord, user: updatedUser };
  }

  /**
   * Retrieve all reward badges configured
   */
  async getAllBadges() {
    return Object.values(RewardModel.BADGES);
  }

  /**
   * Retrieve reward history for a user
   */
  async getUserRewards(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.notFound(`User not found: ${userId}`);
    }
    return UserRewardModel.find({ userId });
  }

  /**
   * Retrieve profile summary with calculated level and badges
   */
  async getUserProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.notFound(`User not found: ${userId}`);
    }

    const rewardsHistory = await UserRewardModel.find({ userId });
    const level = Math.floor((user.xp || 0) / 100) + 1;
    const nextLevelXp = level * 100;
    const levelProgress = ((user.xp || 0) % 100);

    const badgeDetails = (user.badges || []).map((code) => RewardModel.BADGES[code] || { code, name: code });

    return {
      user: {
        id: user._id,
        displayName: user.displayName,
        avatar: user.avatar,
        points: user.points,
        xp: user.xp,
        level,
        nextLevelXp,
        levelProgress,
        badges: badgeDetails,
      },
      history: rewardsHistory,
    };
  }
}

module.exports = new RewardService();
