const orderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');

const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await orderService.getAllRestaurants();
  res.status(200).json({
    success: true,
    data: restaurants,
    message: 'Restaurants retrieved successfully',
  });
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await orderService.getRestaurantById(restaurantId);
  res.status(200).json({
    success: true,
    data: restaurant,
    message: 'Restaurant retrieved successfully',
  });
});

const getRestaurantMenu = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const menu = await orderService.getRestaurantMenu(restaurantId);
  res.status(200).json({
    success: true,
    data: menu,
    message: 'Restaurant menu retrieved successfully',
  });
});

module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
};
