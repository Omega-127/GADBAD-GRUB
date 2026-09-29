const { getCollection } = require('../config/database');

const collection = getCollection('orders');

const ORDER_STATUSES = {
  PLACED: 'PLACED',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  PICKED_UP: 'PICKED_UP',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

const VALID_STATUS_TRANSITIONS = {
  [ORDER_STATUSES.PLACED]: [ORDER_STATUSES.ACCEPTED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.ACCEPTED]: [ORDER_STATUSES.PREPARING, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PREPARING]: [ORDER_STATUSES.READY, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.READY]: [ORDER_STATUSES.PICKED_UP, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PICKED_UP]: [ORDER_STATUSES.DELIVERED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.DELIVERED]: [],
  [ORDER_STATUSES.CANCELLED]: [],
};

const OrderModel = {
  ORDER_STATUSES,
  VALID_STATUS_TRANSITIONS,
  find: (query) => collection.find(query),
  findOne: (query) => collection.findOne(query),
  findById: (id) => collection.findById(id),
  create: (data) => {
    const order = {
      userId: data.userId,
      restaurantId: data.restaurantId,
      items: Array.isArray(data.items) ? data.items : [],
      total: Number(data.total) || 0,
      status: data.status || ORDER_STATUSES.PLACED,
      estimatedDeliveryAt: data.estimatedDeliveryAt || new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      ...data,
    };
    return collection.create(order);
  },
  findByIdAndUpdate: (id, update, options) => collection.findByIdAndUpdate(id, update, options),
  updateOne: (query, update) => collection.updateOne(query, update),
  deleteMany: (query) => collection.deleteMany(query),
  countDocuments: (query) => collection.countDocuments(query),
  clear: () => collection.clear(),
};

module.exports = OrderModel;
