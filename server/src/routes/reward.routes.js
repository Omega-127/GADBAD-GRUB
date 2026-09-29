const { Router } = require('express');
const {
  getBadges,
  getUserRewards,
  getUserProfile,
} = require('../controllers/reward.controller');

const router = Router();

router.get('/badges', getBadges);
router.get('/user/:userId', getUserRewards);
router.get('/user/:userId/profile', getUserProfile);

module.exports = router;
