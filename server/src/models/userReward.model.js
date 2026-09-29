const { getCollection } = require('../config/database');

const collection = getCollection('user_rewards');

const UserRewardModel = {
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => {
    const userReward = {
      userId: data.userId,
      type: data.type || 'POINTS',
      points: Number(data.points) || 0,
      xp: Number(data.xp) || 0,
      badgeCode: data.badgeCode || null,
      sourceEventId: data.sourceEventId || null,
      description: data.description || '',
      ...data,
    };
    return collection.create(userReward);
  },
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = UserRewardModel;
