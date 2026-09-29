const { Router } = require('express');
const {
  getRaceCommentary,
  generateCommentary,
} = require('../controllers/commentary.controller');

const router = Router();

router.get('/:raceId', getRaceCommentary);
router.post('/generate', generateCommentary);

module.exports = router;
