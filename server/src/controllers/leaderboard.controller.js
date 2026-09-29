const leaderboardService = require('../services/leaderboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getLeaderboard = asyncHandler(async (req, res) => {
  const { raceId } = req.query;
  const leaderboard = await leaderboardService.getRaceLeaderboard(raceId || null);
  res.status(200).json({
    success: true,
    data: leaderboard,
    message: 'Leaderboard retrieved successfully',
  });
});

const getUserLeaderboard = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10);
  const users = await leaderboardService.getUserLeaderboard(limit);
  res.status(200).json({
    success: true,
    data: users,
    message: 'User leaderboard retrieved successfully',
  });
});

module.exports = {
  getLeaderboard,
  getUserLeaderboard,
};
