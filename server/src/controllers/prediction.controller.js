const predictionService = require('../services/prediction.service');
const asyncHandler = require('../utils/asyncHandler');

const getAiPrediction = asyncHandler(async (req, res) => {
  const { raceId } = req.params;
  const prediction = await predictionService.getAiPrediction(raceId);
  res.status(200).json({
    success: true,
    data: prediction,
    message: 'AI ETA prediction calculated',
  });
});

const submitPrediction = asyncHandler(async (req, res) => {
  const { raceId } = req.params;
  const { userId, predictedRacerId } = req.body;

  const prediction = await predictionService.submitPrediction(raceId, {
    userId,
    predictedRacerId,
  });

  res.status(201).json({
    success: true,
    data: prediction,
    message: 'Prediction registered successfully',
  });
});

const getRacePredictions = asyncHandler(async (req, res) => {
  const { raceId } = req.params;
  const predictions = await predictionService.getPredictionsByRace(raceId);
  res.status(200).json({
    success: true,
    data: predictions,
    message: 'Race predictions retrieved',
  });
});

const getUserPredictions = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const predictions = await predictionService.getPredictionsByUser(userId);
  res.status(200).json({
    success: true,
    data: predictions,
    message: 'User predictions retrieved',
  });
});

module.exports = {
  getAiPrediction,
  submitPrediction,
  getRacePredictions,
  getUserPredictions,
};
