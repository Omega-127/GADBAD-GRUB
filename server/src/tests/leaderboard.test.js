const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const { connectDB } = require('../config/database');
const seedDatabase = require('../seed/seed');

const request = supertest(app);

describe('Leaderboard & Reward Endpoints', () => {
  before(async () => {
    await connectDB();
    await seedDatabase({ force: true });
  });

  it('GET /api/leaderboard - returns race leaderboard with valid ranking', async () => {
    const res = await request.get('/api/leaderboard');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.racers));
  });

  it('GET /api/leaderboard/users - returns top users sorted by points and XP', async () => {
    const res = await request.get('/api/leaderboard/users');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 3);
    // Highest points user should be first
    assert.ok(res.body.data[0].points >= res.body.data[1].points);
    assert.strictEqual(res.body.data[0].rank, 1);
  });

  it('GET /api/rewards/badges - returns all configured badges', async () => {
    const res = await request.get('/api/rewards/badges');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.some((b) => b.code === 'FIRST_ORDER'));
    assert.ok(res.body.data.some((b) => b.code === 'SPEED_PREDICTOR'));
  });

  it('GET /api/rewards/user/:id/profile - returns user stats, level progress, and badges', async () => {
    const res = await request.get('/api/rewards/user/user_demo_1/profile');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    const profile = res.body.data.user;
    assert.strictEqual(profile.id, 'user_demo_1');
    assert.strictEqual(typeof profile.level, 'number');
    assert.ok(profile.level >= 1);
    assert.ok(Array.isArray(profile.badges));
  });

  it('GET /api/commentary/generate - generates playful racing commentary', async () => {
    const res = await request.post('/api/commentary/generate').send({
      eventType: 'BOOST_ACTIVATED',
      metadata: { racerName: 'Turbo Tandoor', progress: 50, etaSeconds: 120 },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.commentary);
    assert.ok(res.body.data.commentary.length > 5);
  });
});
