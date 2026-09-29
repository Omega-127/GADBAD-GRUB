const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const { connectDB } = require('../config/database');
const seedDatabase = require('../seed/seed');
const raceSimulator = require('../services/raceSimulator.service');
const RaceModel = require('../models/race.model');

const request = supertest(app);

describe('Race Service & Simulator', () => {
  let createdOrderId;
  let createdRaceId;

  before(async () => {
    await connectDB();
    await seedDatabase({ force: true });

    // Create an order for race tests
    const orderRes = await request.post('/api/orders').send({
      userId: 'user_demo_1',
      restaurantId: 'rest_pizza_01',
      items: [{ menuItemId: 'item_pizza_01', quantity: 1 }],
      autoStartRace: false,
    });
    createdOrderId = orderRes.body.data.order._id;
  });

  after(() => {
    raceSimulator.stopAll();
  });

  it('POST /api/races - creates a race linked to order with SIMULATOR source', async () => {
    const res = await request.post('/api/races').send({
      orderId: createdOrderId,
      autoStart: false,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    const race = res.body.data;
    createdRaceId = race._id;

    assert.strictEqual(race.orderId, createdOrderId);
    assert.strictEqual(race.trackingSource, 'SIMULATOR', 'Tracking source must explicitly be SIMULATOR');
    assert.strictEqual(race.status, 'WAITING');
    assert.ok(Array.isArray(race.racers));
    assert.ok(race.racers.length >= 3, 'Must contain primary rider and demo competitors');

    const primaryRider = race.racers[0];
    assert.ok(primaryRider.name);
    assert.strictEqual(typeof primaryRider.progress, 'number');
    assert.strictEqual(typeof primaryRider.etaSeconds, 'number');
    assert.strictEqual(typeof primaryRider.distanceRemaining, 'number');
  });

  it('GET /api/races/:id - retrieves race state and racers', async () => {
    const res = await request.get(`/api/races/${createdRaceId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data._id, createdRaceId);
    assert.strictEqual(res.body.data.trackingSource, 'SIMULATOR');
  });

  it('Deterministic simulator step execution updates progress and generates events', async () => {
    // Start race
    await raceSimulator.startRace(createdRaceId, { tickIntervalMs: 10000 }); // long interval so we control ticks manually

    // Initial event: RACE_STARTED
    let events = await request.get(`/api/races/${createdRaceId}/events`);
    assert.ok(events.body.data.some((e) => e.type === 'RACE_STARTED'));

    // Step 1: Rider moved
    const step1 = await raceSimulator.step(createdRaceId);
    assert.ok(step1);
    assert.strictEqual(step1.step, 1);

    // Step 2: Checkpoint reached
    const step2 = await raceSimulator.step(createdRaceId);
    assert.strictEqual(step2.step, 2);
    assert.strictEqual(step2.event.type, 'CHECKPOINT_REACHED');

    // Step 3: Traffic started
    const step3 = await raceSimulator.step(createdRaceId);
    assert.strictEqual(step3.step, 3);
    assert.strictEqual(step3.event.type, 'TRAFFIC_STARTED');

    // Step 5: Boost activated
    await raceSimulator.step(createdRaceId); // step 4
    const step5 = await raceSimulator.step(createdRaceId);
    assert.strictEqual(step5.step, 5);
    assert.strictEqual(step5.event.type, 'BOOST_ACTIVATED');

    // Run until finish
    while ((await RaceModel.findById(createdRaceId)).status !== 'FINISHED') {
      await raceSimulator.step(createdRaceId);
    }

    const finishedRace = await RaceModel.findById(createdRaceId);
    assert.strictEqual(finishedRace.status, 'FINISHED');
    assert.ok(finishedRace.winningRacerId);

    // Ensure timer was cleaned up
    assert.strictEqual(raceSimulator.activeTimers.has(createdRaceId), false);
  });

  it('GET /api/races/:id/stream - provides SSE stream with initial state', (t, done) => {
    request
      .get(`/api/races/${createdRaceId}/stream`)
      .expect('Content-Type', /text\/event-stream/)
      .expect('Cache-Control', 'no-cache')
      .expect(200)
      .buffer(false)
      .parse((res, callback) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk.toString();
          if (rawData.includes('INITIAL_STATE')) {
            const lines = rawData.split('\n');
            const dataLine = lines.find((l) => l.startsWith('data: '));
            assert.ok(dataLine);
            const parsed = JSON.parse(dataLine.replace('data: ', ''));
            assert.strictEqual(parsed.type, 'INITIAL_STATE');
            assert.strictEqual(parsed.trackingSource, 'SIMULATOR');
            res.destroy(); // close connection
            done();
          }
        });
      })
      .end((err) => {
        if (err && err.code !== 'ECONNRESET') done(err);
      });
  });
});
