const { Router } = require('express');
const {
  createRace,
  getAllRaces,
  getRaceById,
  getRaceEvents,
  startRace,
  getRaceStream,
} = require('../controllers/race.controller');
const {
  getAiPrediction,
  submitPrediction,
  getRacePredictions,
} = require('../controllers/prediction.controller');
const { validatePredictionCreate } = require('../middleware/validation.middleware');

const router = Router();

router.post('/', createRace);
router.get('/', getAllRaces);
router.get('/:raceId', getRaceById);
router.get('/:raceId/events', getRaceEvents);
router.post('/:raceId/start', startRace);

// SSE Stream for live updates
router.get('/:raceId/stream', getRaceStream);

// Sub-routes for predictions associated with a race
router.get('/:raceId/ai-prediction', getAiPrediction);
router.post('/:raceId/predictions', validatePredictionCreate, submitPrediction);
router.get('/:raceId/predictions', getRacePredictions);

module.exports = router;
