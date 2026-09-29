const RaceModel = require('../models/race.model');
const RaceEventModel = require('../models/raceEvent.model');
const OrderModel = require('../models/order.model');
const raceSimulator = require('./raceSimulator.service');
const ApiError = require('../utils/ApiError');
const generateId = require('../utils/generateId');

class RaceService {
  async createRaceForOrder(orderId, options = {}) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw ApiError.notFound(`Order not found with id: ${orderId}`);
    }

    // Check if a race already exists for this order
    const existingRace = await RaceModel.findOne({ orderId });
    if (existingRace) {
      if (options.autoStart && existingRace.status === RaceModel.RACE_STATUSES.WAITING) {
        await raceSimulator.startRace(existingRace._id, options);
      }
      return existingRace;
    }

    const raceId = generateId('race');

    // Create realistic virtual competitors
    const racers = [
      {
        racerId: `racer_lead_${orderId.slice(-4)}`,
        raceId,
        name: 'Thunder Tandoor (Your Rider)',
        progress: 0,
        etaSeconds: 240,
        distanceRemaining: 3500,
        status: 'READY',
        rank: 1,
      },
      {
        racerId: 'racer_comp_1',
        raceId,
        name: 'Pizza Comet',
        progress: 0,
        etaSeconds: 250,
        distanceRemaining: 3500,
        status: 'READY',
        rank: 2,
      },
      {
        racerId: 'racer_comp_2',
        raceId,
        name: 'Curry Blitz',
        progress: 0,
        etaSeconds: 260,
        distanceRemaining: 3500,
        status: 'READY',
        rank: 3,
      },
      {
        racerId: 'racer_comp_3',
        raceId,
        name: 'Dosa Drift',
        progress: 0,
        etaSeconds: 275,
        distanceRemaining: 3500,
        status: 'READY',
        rank: 4,
      },
    ];

    const race = await RaceModel.create({
      _id: raceId,
      raceId,
      orderId,
      status: RaceModel.RACE_STATUSES.WAITING,
      trackingSource: 'SIMULATOR',
      racers,
    });

    if (options.autoStart) {
      await raceSimulator.startRace(raceId, options);
    }

    return race;
  }

  async getAllRaces(filter = {}) {
    return RaceModel.find(filter);
  }

  async getRaceById(raceId) {
    const race = await RaceModel.findById(raceId);
    if (!race) {
      throw ApiError.notFound(`Race not found with id: ${raceId}`);
    }
    return race;
  }

  async getRaceEvents(raceId) {
    await this.getRaceById(raceId); // Ensure exists
    return RaceEventModel.find({ raceId });
  }

  async startRace(raceId, options = {}) {
    const race = await this.getRaceById(raceId);
    if (race.status === RaceModel.RACE_STATUSES.FINISHED) {
      throw ApiError.badRequest('Race is already finished');
    }
    return raceSimulator.startRace(raceId, options);
  }
}

module.exports = new RaceService();
