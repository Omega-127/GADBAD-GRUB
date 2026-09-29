const commentaryService = require('../services/commentary.service');
const asyncHandler = require('../utils/asyncHandler');

const getRaceCommentary = asyncHandler(async (req, res) => {
  const { raceId } = req.params;
  const commentary = await commentaryService.getRaceCommentary(raceId);
  res.status(200).json({
    success: true,
    data: commentary,
    message: 'Race commentary retrieved successfully',
  });
});

const generateCommentary = asyncHandler(async (req, res) => {
  const { eventType, metadata } = req.body;
  const text = await commentaryService.generateCustomCommentary(eventType, metadata);
  res.status(200).json({
    success: true,
    data: { commentary: text },
    message: 'Commentary generated successfully',
  });
});

module.exports = {
  getRaceCommentary,
  generateCommentary,
};
