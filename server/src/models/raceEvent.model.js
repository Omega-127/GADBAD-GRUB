const { getCollection } = require('../config/database');

const collection = getCollection('race_events');

const EVENT_TYPES = {
  RACE_STARTED: 'RACE_STARTED',
  RIDER_MOVED: 'RIDER_MOVED',
  CHECKPOINT_REACHED: 'CHECKPOINT_REACHED',
  TRAFFIC_STARTED: 'TRAFFIC_STARTED',
  TRAFFIC_ENDED: 'TRAFFIC_ENDED',
  BOOST_ACTIVATED: 'BOOST_ACTIVATED',
  ETA_CHANGED: 'ETA_CHANGED',
  RACE_FINISHED: 'RACE_FINISHED',
};

const RaceEventModel = {
  EVENT_TYPES,
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => {
    const event = {
      raceId: data.raceId,
      type: data.type,
      message: data.message || '',
      racerId: data.racerId || null,
      metadata: data.metadata || {},
      source: 'SIMULATOR',
      ...data,
    };
    return collection.create(event);
  },
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = RaceEventModel;
