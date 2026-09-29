const { getCollection } = require('../config/database');

const collection = getCollection('menu_items');

const MenuItemModel = {
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => {
    const item = {
      restaurantId: data.restaurantId,
      name: data.name,
      description: data.description || '',
      price: Number(data.price) || 0,
      imageUrl: data.imageUrl || '',
      category: data.category || 'Main',
      isAvailable: data.isAvailable !== false,
      ...data,
    };
    return collection.create(item);
  },
  findByIdAndUpdate: (id, update, options) => collection.findByIdAndUpdate(id, update, options),
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = MenuItemModel;
