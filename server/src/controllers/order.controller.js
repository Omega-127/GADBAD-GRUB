const orderService = require('../services/order.service');
const raceService = require('../services/race.service');
const rewardService = require('../services/reward.service');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const { userId, restaurantId, items, autoStartRace } = req.body;

  // 1. Create Order with strict DB price calculation
  const order = await orderService.createOrder({
    userId,
    restaurantId,
    items,
  });

  // 2. Award FIRST_ORDER badge if eligible
  try {
    await rewardService.awardBadge(userId, 'FIRST_ORDER', {
      sourceEventId: `badge_first_order_${order._id}`,
    });
  } catch (err) {
    console.warn('First order badge check notice:', err.message);
  }

  // 3. Create Race linked to this order
  let race = null;
  try {
    race = await raceService.createRaceForOrder(order._id, {
      autoStart: autoStartRace !== false, // default autoStart = true for demo convenience
    });
  } catch (err) {
    console.warn('Could not auto-create race for order:', err.message);
  }

  res.status(201).json({
    success: true,
    data: {
      order,
      race,
    },
    message: 'Order created successfully and virtual race registered',
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId);
  res.status(200).json({
    success: true,
    data: order,
    message: 'Order retrieved successfully',
  });
});

const getOrdersByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const orders = await orderService.getOrdersByUserId(userId);
  res.status(200).json({
    success: true,
    data: orders,
    message: 'User orders retrieved successfully',
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const updatedOrder = await orderService.updateOrderStatus(orderId, status);
  res.status(200).json({
    success: true,
    data: updatedOrder,
    message: `Order status updated to ${status}`,
  });
});

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
};
