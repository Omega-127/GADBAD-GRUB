const { getCollection } = require('../config/database');

const collection = getCollection('restaurants');

const RestaurantModel = {
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => {
    const restaurant = {
      name: data.name,
      description: data.description || '',
      rating: Number(data.rating) || 4.5,
      imageUrl: data.imageUrl || '',
      isAvailable: data.isAvailable !== false,
      cuisine: data.cuisine || 'Fast Food',
      prepTimeMinutes: Number(data.prepTimeMinutes) || 15,
      ...data,
    };
    return collection.create(restaurant);
  },
  findByIdAndUpdate: (id, update, options) => collection.findByIdAndUpdate(id, update, options),
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = RestaurantModel;
