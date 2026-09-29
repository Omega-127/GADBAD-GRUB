const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const { connectDB } = require('../config/database');
const seedDatabase = require('../seed/seed');
const raceSimulator = require('../services/raceSimulator.service');
const predictionService = require('../services/prediction.service');
const UserModel = require('../models/user.model');
const RaceModel = require('../models/race.model');

const request = supertest(app);

describe('Prediction Service & Settlement', () => {
  let activeRaceId;
  let leaderRacerId;

  before(async () => {
    await connectDB();
    await seedDatabase({ force: true });

    // Create an order and race
    const orderRes = await request.post('/api/orders').send({
      userId: 'user_demo_1',
      restaurantId: 'rest_pizza_01',
      items: [{ menuItemId: 'item_pizza_01', quantity: 1 }],
      autoStartRace: false,
    });

    const raceRes = await request.post('/api/races').send({
      orderId: orderRes.body.data.order._id,
      autoStart: false,
    });
    activeRaceId = raceRes.body.data._id;
    leaderRacerId = raceRes.body.data.racers[0].racerId;
  });

  after(() => {
    raceSimulator.stopAll();
  });

  it('GET /api/races/:id/ai-prediction - uses explainable ETA-based ranking', async () => {
    const res = await request.get(`/api/races/${activeRaceId}/ai-prediction`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const { predictedWinner, method, explanation } = res.body.data;
    assert.ok(predictedWinner);
    assert.strictEqual(predictedWinner.racerId, leaderRacerId);
    assert.strictEqual(method, 'ETA_BASED_RANKING');
    assert.ok(explanation.includes('lowest valid ETA'));
    // Ensure no fake 99% confidence claim
    assert.strictEqual(res.body.data.confidence, undefined);
  });

  it('POST /api/races/:id/predictions - allows user to predict before finish', async () => {
    const res = await request.post(`/api/races/${activeRaceId}/predictions`).send({
      userId: 'user_demo_1',
      predictedRacerId: leaderRacerId,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.userId, 'user_demo_1');
    assert.strictEqual(res.body.data.predictedRacerId, leaderRacerId);
    assert.strictEqual(res.body.data.result, 'PENDING');
  });

  it('POST /api/races/:id/predictions - rejects duplicate prediction from same user', async () => {
    const res = await request.post(`/api/races/${activeRaceId}/predictions`).send({
      userId: 'user_demo_1',
      predictedRacerId: leaderRacerId,
    });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.code, 'DUPLICATE_PREDICTION');
  });

  it('POST /api/races/:id/predictions - rejects invalid racer ID', async () => {
    const res = await request.post(`/api/races/${activeRaceId}/predictions`).send({
      userId: 'user_demo_2',
      predictedRacerId: 'non_existent_racer_999',
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('Settles predictions accurately and awards points, XP, and badges idempotently', async () => {
    const userBefore = await UserModel.findById('user_demo_1');
    const initialPoints = userBefore.points;
    const initialXp = userBefore.xp;

    // Settle with winning racer matching the prediction
    const settled = await predictionService.settleRacePredictions(activeRaceId, leaderRacerId);
    assert.strictEqual(settled.length, 1);
    assert.strictEqual(settled[0].result, 'CORRECT');
    assert.strictEqual(settled[0].pointsAwarded, 100);

    const userAfter = await UserModel.findById('user_demo_1');
    // Prediction win (+100 pts, +50 xp) + SPEED_PREDICTOR badge (+100 pts, +50 xp)
    assert.strictEqual(userAfter.points, initialPoints + 100 + 100);
    assert.strictEqual(userAfter.xp, initialXp + 50 + 50);
    assert.ok(userAfter.badges.includes('SPEED_PREDICTOR'));

    // Settle again should not duplicate rewards (idempotency check)
    await predictionService.settleRacePredictions(activeRaceId, leaderRacerId);
    const userIdempotent = await UserModel.findById('user_demo_1');
    assert.strictEqual(userIdempotent.points, userAfter.points, 'Points must not be duplicated');
  });

  it('POST /api/races/:id/predictions - rejects prediction after race finish deadline', async () => {
    // Mark race finished
    await RaceModel.findByIdAndUpdate(activeRaceId, { status: 'FINISHED' });

    const res = await request.post(`/api/races/${activeRaceId}/predictions`).send({
      userId: 'user_demo_3',
      predictedRacerId: leaderRacerId,
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.code, 'DEADLINE_PASSED');
  });
});
