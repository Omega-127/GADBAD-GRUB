const ApiError = require('../utils/ApiError');

/**
 * Validate that required fields exist in req.body
 */
const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return next(ApiError.badRequest('Request body must be a valid JSON object', 'INVALID_BODY'));
    }

    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return next(
        ApiError.badRequest(
          `Missing required fields: ${missing.join(', ')}`,
          'VALIDATION_ERROR'
        )
      );
    }

    next();
  };
};

/**
 * Validate order creation payload
 */
const validateOrderCreate = (req, res, next) => {
  const { userId, restaurantId, items } = req.body;

  if (!userId) {
    return next(ApiError.badRequest('userId is required', 'VALIDATION_ERROR'));
  }
  if (!restaurantId) {
    return next(ApiError.badRequest('restaurantId is required', 'VALIDATION_ERROR'));
  }
  if (!Array.isArray(items) || items.length === 0) {
    return next(ApiError.badRequest('items must be a non-empty array', 'VALIDATION_ERROR'));
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.menuItemId) {
      return next(ApiError.badRequest(`Item at index ${i} missing menuItemId`, 'VALIDATION_ERROR'));
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return next(
        ApiError.badRequest(`Item at index ${i} quantity must be a positive integer`, 'VALIDATION_ERROR')
      );
    }
  }

  next();
};

/**
 * Validate prediction submission payload
 */
const validatePredictionCreate = (req, res, next) => {
  const { userId, predictedRacerId } = req.body;

  if (!userId) {
    return next(ApiError.badRequest('userId is required', 'VALIDATION_ERROR'));
  }
  if (!predictedRacerId) {
    return next(ApiError.badRequest('predictedRacerId is required', 'VALIDATION_ERROR'));
  }

  next();
};

module.exports = {
  validateBody,
  validateOrderCreate,
  validatePredictionCreate,
};
