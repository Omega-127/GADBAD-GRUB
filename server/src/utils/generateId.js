const crypto = require('crypto');

/**
 * Generate a unique ID with an optional prefix
 * e.g., generateId('order') -> 'order_a1b2c3d4e5f6'
 */
const generateId = (prefix = '') => {
  const random = crypto.randomBytes(6).toString('hex');
  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
};

module.exports = generateId;
