const { Router } = require('express');
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { validateOrderCreate, validateBody } = require('../middleware/validation.middleware');

const router = Router();

router.post('/', validateOrderCreate, createOrder);
router.get('/:orderId', getOrderById);
router.get('/user/:userId', getOrdersByUser);
router.patch('/:orderId/status', validateBody(['status']), updateOrderStatus);

module.exports = router;
