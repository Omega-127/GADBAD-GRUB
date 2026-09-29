const RaceEventModel = require('../models/raceEvent.model');
const RaceModel = require('../models/race.model');
const llmAdapter = require('../adapters/llm.adapter');
const ApiError = require('../utils/ApiError');

class CommentaryService {
  /**
   * Get all commentary events for a race
   */
  async getRaceCommentary(raceId) {
    const race = await RaceModel.findById(raceId);
    if (!race) {
      throw ApiError.notFound(`Race not found: ${raceId}`);
    }

    const events = await RaceEventModel.find({ raceId });

    return events.map((event) => ({
      id: event._id,
      raceId: event.raceId,
      type: event.type,
      commentary: event.message,
      timestamp: event.createdAt,
    }));
  }

  /**
   * Generate on-demand commentary for a hypothetical or custom situation
   */
  async generateCustomCommentary(eventType, metadata = {}) {
    return llmAdapter.generateCommentary(eventType, metadata);
  }
}

module.exports = new CommentaryService();
