const seedUsers = [
  {
    _id: 'user_demo_1',
    id: 'user_demo_1',
    displayName: 'SpeedySam',
    email: 'sam@gadbad.demo',
    avatar: '🏎️',
    points: 250,
    xp: 120,
    badges: ['FIRST_ORDER'],
  },
  {
    _id: 'user_demo_2',
    id: 'user_demo_2',
    displayName: 'ChaiChaser',
    email: 'chai@gadbad.demo',
    avatar: '🚀',
    points: 500,
    xp: 350,
    badges: ['FIRST_ORDER', 'SPEED_PREDICTOR'],
  },
  {
    _id: 'user_demo_3',
    id: 'user_demo_3',
    displayName: 'BiryaniBoss',
    email: 'boss@gadbad.demo',
    avatar: '👑',
    points: 800,
    xp: 600,
    badges: ['FIRST_ORDER', 'SPEED_PREDICTOR', 'HAT_TRICK'],
  },
];

module.exports = {
  seedUsers,
};
