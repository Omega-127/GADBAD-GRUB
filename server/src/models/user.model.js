const { getCollection } = require('../config/database');

const collection = getCollection('users');

const UserModel = {
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => {
    const user = {
      displayName: data.displayName || 'Racer Guest',
      email: data.email || '',
      avatar: data.avatar || '🏎️',
      points: Number(data.points) || 0,
      xp: Number(data.xp) || 0,
      badges: Array.isArray(data.badges) ? data.badges : [],
      ...data,
    };
    return collection.create(user);
  },
  findByIdAndUpdate: (id, update, options) => collection.findByIdAndUpdate(id, update, options),
  updateOne: (query, update) => collection.updateOne(query, update),
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = UserModel;
