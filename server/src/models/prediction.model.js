const { getCollection } = require('../config/database');

const collection = getCollection('predictions');

const PREDICTION_RESULTS = {
  PENDING: 'PENDING',
  CORRECT: 'CORRECT',
  INCORRECT: 'INCORRECT',
  VOID: 'VOID',
};

const PredictionModel = {
  PREDICTION_RESULTS,
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => {
    const prediction = {
      userId: data.userId,
      raceId: data.raceId,
      predictedRacerId: data.predictedRacerId,
      submittedAt: data.submittedAt || new Date().toISOString(),
      result: data.result || PREDICTION_RESULTS.PENDING,
      pointsAwarded: Number(data.pointsAwarded) || 0,
      xpAwarded: Number(data.xpAwarded) || 0,
      ...data,
    };
    return collection.create(prediction);
  },
  findByIdAndUpdate: (id, update, options) => collection.findByIdAndUpdate(id, update, options),
  updateOne: (query, update) => collection.updateOne(query, update),
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = PredictionModel;
