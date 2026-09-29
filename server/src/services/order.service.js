const OrderModel = require('../models/order.model');
const RestaurantModel = require('../models/restaurant.model');
const MenuItemModel = require('../models/menuItem.model');
const UserModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const generateId = require('../utils/generateId');

class OrderService {
  async getAllRestaurants() {
    return RestaurantModel.find({ isAvailable: true });
  }

  async getRestaurantById(restaurantId) {
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw ApiError.notFound(`Restaurant not found with id: ${restaurantId}`);
    }
    return restaurant;
  }

  async getRestaurantMenu(restaurantId) {
    await this.getRestaurantById(restaurantId); // Validate existence
    return MenuItemModel.find({ restaurantId, isAvailable: true });
  }

  async createOrder({ userId, restaurantId, items }) {
    // 1. Validate User
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.notFound(`User not found with id: ${userId}`);
    }

    // 2. Validate Restaurant
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw ApiError.notFound(`Restaurant not found with id: ${restaurantId}`);
    }
    if (!restaurant.isAvailable) {
      throw ApiError.badRequest('Restaurant is currently unavailable');
    }

    // 3. Validate and Calculate Prices from Database
    if (!Array.isArray(items) || items.length === 0) {
      throw ApiError.badRequest('Order must contain at least one item');
    }

    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbItem = await MenuItemModel.findById(item.menuItemId);
      if (!dbItem) {
        throw ApiError.notFound(`Menu item not found: ${item.menuItemId}`);
      }

      if (String(dbItem.restaurantId) !== String(restaurantId)) {
        throw ApiError.badRequest(
          `Item "${dbItem.name}" does not belong to restaurant ${restaurant.name}`
        );
      }

      if (!dbItem.isAvailable) {
        throw ApiError.badRequest(`Item "${dbItem.name}" is currently sold out`);
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        throw ApiError.badRequest(`Invalid quantity for item "${dbItem.name}"`);
      }

      // CRITICAL RULE: Database menu price is the single source of truth
      const unitPrice = Number(dbItem.price);
      const subtotal = unitPrice * qty;
      calculatedTotal += subtotal;

      verifiedItems.push({
        menuItemId: dbItem._id,
        name: dbItem.name,
        quantity: qty,
        unitPrice: unitPrice,
        subtotal: subtotal,
      });
    }

    // 4. Create Order
    const orderId = generateId('ord');
    const prepMinutes = restaurant.prepTimeMinutes || 15;
    const estimatedDeliveryAt = new Date(Date.now() + (prepMinutes + 10) * 60 * 1000).toISOString();

    const order = await OrderModel.create({
      _id: orderId,
      id: orderId,
      userId,
      restaurantId,
      items: verifiedItems,
      total: calculatedTotal,
      status: OrderModel.ORDER_STATUSES.PLACED,
      estimatedDeliveryAt,
    });

    return order;
  }

  async getOrderById(orderId) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw ApiError.notFound(`Order not found with id: ${orderId}`);
    }
    return order;
  }

  async getOrdersByUserId(userId) {
    return OrderModel.find({ userId });
  }

  async updateOrderStatus(orderId, newStatus) {
    const order = await this.getOrderById(orderId);

    const validStatuses = Object.values(OrderModel.ORDER_STATUSES);
    if (!validStatuses.includes(newStatus)) {
      throw ApiError.badRequest(`Invalid order status: ${newStatus}`);
    }

    // Check transition
    const allowedTransitions = OrderModel.VALID_STATUS_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw ApiError.badRequest(
        `Cannot transition order status from "${order.status}" to "${newStatus}". Allowed transitions: ${
          allowedTransitions.length > 0 ? allowedTransitions.join(', ') : 'None (Terminal state)'
        }`
      );
    }

    const updated = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    return updated;
  }
}

module.exports = new OrderService();
