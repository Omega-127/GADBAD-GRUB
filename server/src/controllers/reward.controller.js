const rewardService = require('../services/reward.service');
const asyncHandler = require('../utils/asyncHandler');

const getBadges = asyncHandler(async (req, res) => {
  const badges = await rewardService.getAllBadges();
  res.status(200).json({
    success: true,
    data: badges,
    message: 'Reward badges retrieved successfully',
  });
});

const getUserRewards = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const history = await rewardService.getUserRewards(userId);
  res.status(200).json({
    success: true,
    data: history,
    message: 'User reward history retrieved successfully',
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const profile = await rewardService.getUserProfile(userId);
  res.status(200).json({
    success: true,
    data: profile,
    message: 'User profile retrieved successfully',
  });
});

module.exports = {
  getBadges,
  getUserRewards,
  getUserProfile,
};
