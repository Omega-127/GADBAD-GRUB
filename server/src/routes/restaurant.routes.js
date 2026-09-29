const { Router } = require('express');
const {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
} = require('../controllers/restaurant.controller');

const router = Router();

router.get('/', getRestaurants);
router.get('/:restaurantId', getRestaurantById);
router.get('/:restaurantId/menu', getRestaurantMenu);

module.exports = router;
