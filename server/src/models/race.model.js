const { getCollection } = require('../config/database');

const collection = getCollection('races');

const RACE_STATUSES = {
  WAITING: 'WAITING',
  RUNNING: 'RUNNING',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED',
};

const TRACKING_SOURCES = {
  SIMULATOR: 'SIMULATOR',
};

const RACER_STATUSES = {
  READY: 'READY',
  RACING: 'RACING',
  FINISHED: 'FINISHED',
  DELAYED: 'DELAYED',
};

const RaceModel = {
  RACE_STATUSES,
  TRACKING_SOURCES,
  RACER_STATUSES,
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => {
    const raceId = data.raceId || data._id;
    const race = {
      orderId: data.orderId,
      raceId: raceId,
      status: data.status || RACE_STATUSES.WAITING,
      trackingSource: TRACKING_SOURCES.SIMULATOR,
      racers: Array.isArray(data.racers) ? data.racers : [],
      winningRacerId: data.winningRacerId || null,
      startedAt: data.startedAt || null,
      finishedAt: data.finishedAt || null,
      ...data,
    };
    if (raceId) race._id = raceId;
    return collection.create(race);
  },
  findByIdAndUpdate: (id, update, options) => collection.findByIdAndUpdate(id, update, options),
  updateOne: (query, update) => collection.updateOne(query, update),
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = RaceModel;
