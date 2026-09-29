const { getCollection } = require('../config/database');

const collection = getCollection('rewards');

const BADGES = {
  FIRST_ORDER: {
    code: 'FIRST_ORDER',
    name: 'First Bite',
    description: 'Placed your first food order in Gadbad Grub!',
    icon: '🍔',
    points: 50,
    xp: 25,
  },
  SPEED_PREDICTOR: {
    code: 'SPEED_PREDICTOR',
    name: 'Oracle of Speed',
    description: 'Successfully predicted a virtual race winner!',
    icon: '🔮',
    points: 100,
    xp: 50,
  },
  HAT_TRICK: {
    code: 'HAT_TRICK',
    name: 'Speed Demon Streak',
    description: 'Predicted 3 consecutive race winners!',
    icon: '🔥',
    points: 250,
    xp: 150,
  },
  RACER_SUPPORTER: {
    code: 'RACER_SUPPORTER',
    name: 'Pit Crew Boss',
    description: 'Cheered on your delivery rider through live events!',
    icon: '🏁',
    points: 50,
    xp: 30,
  },
};

const RewardModel = {
  BADGES,
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => collection.create(data),
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = RewardModel;
