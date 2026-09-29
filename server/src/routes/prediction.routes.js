const { Router } = require('express');
const {
  getUserPredictions,
  getRacePredictions,
  getAiPrediction,
  submitPrediction,
} = require('../controllers/prediction.controller');
const { validatePredictionCreate } = require('../middleware/validation.middleware');

const router = Router();

router.get('/user/:userId', getUserPredictions);
router.get('/race/:raceId', getRacePredictions);
router.get('/race/:raceId/ai', getAiPrediction);
router.post('/race/:raceId', validatePredictionCreate, submitPrediction);

module.exports = router;
