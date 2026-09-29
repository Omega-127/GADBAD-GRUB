const { connectDB } = require('../config/database');
const RestaurantModel = require('../models/restaurant.model');
const MenuItemModel = require('../models/menuItem.model');
const UserModel = require('../models/user.model');
const RewardModel = require('../models/reward.model');
const { seedRestaurants, seedMenuItems } = require('./restaurants.seed');
const { seedUsers } = require('./users.seed');

async function seedDatabase(options = { force: false }) {
  await connectDB();

  const restCount = await RestaurantModel.countDocuments();
  if (restCount > 0 && !options.force) {
    return { seeded: false, message: 'Database already contains data' };
  }

  // Clear existing
  if (options.force) {
    await RestaurantModel.deleteMany({});
    await MenuItemModel.deleteMany({});
    await UserModel.deleteMany({});
    await RewardModel.deleteMany({});
  }

  // Seed restaurants
  for (const rest of seedRestaurants) {
    await RestaurantModel.create(rest);
  }

  // Seed menu items
  for (const item of seedMenuItems) {
    await MenuItemModel.create(item);
  }

  // Seed users
  for (const user of seedUsers) {
    await UserModel.create(user);
  }

  // Seed reward badges
  for (const badge of Object.values(RewardModel.BADGES)) {
    await RewardModel.create(badge);
  }

  console.log('✅ Seed completed successfully:');
  console.log(` - Restaurants: ${seedRestaurants.length}`);
  console.log(` - Menu items: ${seedMenuItems.length}`);
  console.log(` - Users: ${seedUsers.length}`);
  console.log(` - Badges: ${Object.keys(RewardModel.BADGES).length}`);

  return { seeded: true, message: 'Seed successful' };
}

// If executed directly from CLI (e.g. node src/seed/seed.js)
if (require.main === module) {
  seedDatabase({ force: true })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
