const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const { connectDB } = require('../config/database');
const seedDatabase = require('../seed/seed');
const OrderModel = require('../models/order.model');

const request = supertest(app);

describe('Order Service & Endpoints', () => {
  before(async () => {
    await connectDB();
    await seedDatabase({ force: true });
  });

  it('GET /api/restaurants - retrieves restaurants list', async () => {
    const res = await request.get('/api/restaurants');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 4);
  });

  it('GET /api/restaurants/:id/menu - retrieves restaurant menu', async () => {
    const res = await request.get('/api/restaurants/rest_pizza_01/menu');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.length >= 3);
    assert.strictEqual(res.body.data[0].restaurantId, 'rest_pizza_01');
  });

  it('POST /api/orders - strictly enforces database menu prices (ignores frontend price tampering)', async () => {
    // Truffle Turbo Pizza database price is ₹380
    // Frontend sends ₹50 to try tampering with the total
    const payload = {
      userId: 'user_demo_1',
      restaurantId: 'rest_pizza_01',
      items: [
        {
          menuItemId: 'item_pizza_01',
          quantity: 2,
          price: 50, // TAMPERED PRICE
        },
      ],
      autoStartRace: false,
    };

    const res = await request.post('/api/orders').send(payload);

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    const order = res.body.data.order;

    // Database price (380) * 2 = 760
    assert.strictEqual(order.total, 760, 'Total must strictly equal database price (380 * 2 = 760)');
    assert.strictEqual(order.items[0].unitPrice, 380, 'Unit price must be derived from database');
    assert.strictEqual(order.status, 'PLACED');
  });

  it('POST /api/orders - fails when item does not belong to the restaurant', async () => {
    const payload = {
      userId: 'user_demo_1',
      restaurantId: 'rest_pizza_01',
      items: [
        {
          menuItemId: 'item_samosa_01', // belongs to rest_samosa_02
          quantity: 1,
        },
      ],
    };

    const res = await request.post('/api/orders').send(payload);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/orders - fails validation on empty items or invalid quantity', async () => {
    const resEmpty = await request.post('/api/orders').send({
      userId: 'user_demo_1',
      restaurantId: 'rest_pizza_01',
      items: [],
    });
    assert.strictEqual(resEmpty.status, 400);

    const resInvalidQty = await request.post('/api/orders').send({
      userId: 'user_demo_1',
      restaurantId: 'rest_pizza_01',
      items: [{ menuItemId: 'item_pizza_01', quantity: -1 }],
    });
    assert.strictEqual(resInvalidQty.status, 400);
  });

  it('PATCH /api/orders/:id/status - enforces valid status transitions', async () => {
    // Create an order
    const createRes = await request.post('/api/orders').send({
      userId: 'user_demo_1',
      restaurantId: 'rest_pizza_01',
      items: [{ menuItemId: 'item_pizza_01', quantity: 1 }],
      autoStartRace: false,
    });
    const orderId = createRes.body.data.order._id;

    // Transition 1: PLACED -> ACCEPTED (valid)
    const resAccepted = await request.patch(`/api/orders/${orderId}/status`).send({
      status: OrderModel.ORDER_STATUSES.ACCEPTED,
    });
    assert.strictEqual(resAccepted.status, 200);
    assert.strictEqual(resAccepted.body.data.status, 'ACCEPTED');

    // Invalid transition: ACCEPTED -> DELIVERED (skipping PREPARING/READY/PICKED_UP)
    const resInvalid = await request.patch(`/api/orders/${orderId}/status`).send({
      status: OrderModel.ORDER_STATUSES.DELIVERED,
    });
    assert.strictEqual(resInvalid.status, 400);
    assert.strictEqual(resInvalid.body.success, false);

    // Transition 2: ACCEPTED -> PREPARING (valid)
    const resPrep = await request.patch(`/api/orders/${orderId}/status`).send({
      status: OrderModel.ORDER_STATUSES.PREPARING,
    });
    assert.strictEqual(resPrep.status, 200);
    assert.strictEqual(resPrep.body.data.status, 'PREPARING');
  });
});
