const PredictionModel = require('../models/prediction.model');
const RaceModel = require('../models/race.model');
const UserModel = require('../models/user.model');
const rewardService = require('./reward.service');
const raceSimulator = require('./raceSimulator.service');
const ApiError = require('../utils/ApiError');
const generateId = require('../utils/generateId');
const { rankRacers } = require('../utils/ranking');

class PredictionService {
  constructor() {
    // Listen to simulator race_finished event to auto-settle predictions
    raceSimulator.on('race_finished', async ({ raceId, winningRacerId }) => {
      try {
        await this.settleRacePredictions(raceId, winningRacerId);
      } catch (err) {
        console.error(`Error auto-settling predictions for race ${raceId}:`, err);
      }
    });
  }

  /**
   * Return explainable ETA-based predicted winner
   */
  async getAiPrediction(raceId) {
    const race = await RaceModel.findById(raceId);
    if (!race) {
      throw ApiError.notFound(`Race not found with id: ${raceId}`);
    }

    if (!Array.isArray(race.racers) || race.racers.length === 0) {
      throw ApiError.badRequest('Race has no active racers');
    }

    // Rank racers using our deterministic rule
    const ranked = rankRacers(race.racers);
    const leader = ranked[0];

    return {
      predictedWinner: {
        racerId: leader.racerId,
        name: leader.name,
        etaSeconds: leader.etaSeconds,
        progress: leader.progress,
      },
      method: 'ETA_BASED_RANKING',
      explanation: `${leader.name} currently has the lowest valid ETA (${leader.etaSeconds}s).`,
    };
  }

  /**
   * Submit a user prediction for a race
   */
  async submitPrediction(raceId, { userId, predictedRacerId }) {
    // 1. Verify User
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.notFound(`User not found with id: ${userId}`);
    }

    // 2. Verify Race
    const race = await RaceModel.findById(raceId);
    if (!race) {
      throw ApiError.notFound(`Race not found with id: ${raceId}`);
    }

    // 3. Deadline Enforcement: Reject if finished or cancelled
    if (race.status === RaceModel.RACE_STATUSES.FINISHED) {
      throw ApiError.badRequest('Race has already finished. Predictions are closed!', 'DEADLINE_PASSED');
    }
    if (race.status === RaceModel.RACE_STATUSES.CANCELLED) {
      throw ApiError.badRequest('Race has been cancelled. Predictions cannot be submitted.', 'RACE_CANCELLED');
    }

    // 4. Validate Racer ID belongs to this race
    const validRacer = race.racers.find((r) => r.racerId === predictedRacerId);
    if (!validRacer) {
      throw ApiError.badRequest(
        `Invalid racer ID "${predictedRacerId}". Must be one of: ${race.racers
          .map((r) => r.racerId)
          .join(', ')}`
      );
    }

    // 5. Prevent Duplicate Prediction per user per race
    const existing = await PredictionModel.findOne({ userId, raceId });
    if (existing) {
      throw ApiError.conflict(
        'You have already submitted a prediction for this race.',
        'DUPLICATE_PREDICTION'
      );
    }

    const predictionId = generateId('pred');
    const prediction = await PredictionModel.create({
      _id: predictionId,
      id: predictionId,
      userId,
      raceId,
      predictedRacerId,
      submittedAt: new Date().toISOString(),
      result: PredictionModel.PREDICTION_RESULTS.PENDING,
    });

    return prediction;
  }

  async getPredictionsByRace(raceId) {
    return PredictionModel.find({ raceId });
  }

  async getPredictionsByUser(userId) {
    return PredictionModel.find({ userId });
  }

  /**
   * Settle predictions once a race completes
   */
  async settleRacePredictions(raceId, winningRacerId) {
    const pendingPredictions = await PredictionModel.find({
      raceId,
      result: PredictionModel.PREDICTION_RESULTS.PENDING,
    });

    const settled = [];

    for (const pred of pendingPredictions) {
      const isWinner = pred.predictedRacerId === winningRacerId;
      const result = isWinner
        ? PredictionModel.PREDICTION_RESULTS.CORRECT
        : PredictionModel.PREDICTION_RESULTS.INCORRECT;

      const pointsAwarded = isWinner ? 100 : 10;
      const xpAwarded = isWinner ? 50 : 15;

      const updated = await PredictionModel.findByIdAndUpdate(
        pred._id,
        {
          result,
          pointsAwarded,
          xpAwarded,
        },
        { new: true }
      );

      // Award points and XP to user
      const sourceEventId = `settlement_pred_${pred._id}`;
      await rewardService.awardPointsAndXp(pred.userId, {
        points: pointsAwarded,
        xp: xpAwarded,
        sourceEventId,
        description: isWinner
          ? `Correct prediction for race ${raceId}!`
          : `Consolation reward for race ${raceId} prediction`,
      });

      // If correct prediction, award badge if not already owned
      if (isWinner) {
        await rewardService.awardBadge(pred.userId, 'SPEED_PREDICTOR', {
          sourceEventId: `badge_pred_speed_${pred._id}`,
        });
      }

      settled.push(updated);
    }

    return settled;
  }
}

module.exports = new PredictionService();
