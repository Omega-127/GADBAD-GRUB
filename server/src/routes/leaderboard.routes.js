const { Router } = require('express');
const {
  getLeaderboard,
  getUserLeaderboard,
} = require('../controllers/leaderboard.controller');

const router = Router();

router.get('/', getLeaderboard);
router.get('/users', getUserLeaderboard);

module.exports = router;
