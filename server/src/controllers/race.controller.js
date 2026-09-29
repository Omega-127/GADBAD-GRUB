const raceService = require('../services/race.service');
const raceSimulator = require('../services/raceSimulator.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const createRace = asyncHandler(async (req, res) => {
  const { orderId, autoStart } = req.body;
  if (!orderId) {
    throw ApiError.badRequest('orderId is required to create a race', 'VALIDATION_ERROR');
  }

  const race = await raceService.createRaceForOrder(orderId, { autoStart });
  res.status(201).json({
    success: true,
    data: race,
    message: 'Race created successfully',
  });
});

const getAllRaces = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const races = await raceService.getAllRaces(filter);
  res.status(200).json({
    success: true,
    data: races,
    message: 'Races retrieved successfully',
  });
});

const getRaceById = asyncHandler(async (req, res) => {
  const { raceId } = req.params;
  const race = await raceService.getRaceById(raceId);
  res.status(200).json({
    success: true,
    data: race,
    message: 'Race details retrieved successfully',
  });
});

const getRaceEvents = asyncHandler(async (req, res) => {
  const { raceId } = req.params;
  const events = await raceService.getRaceEvents(raceId);
  res.status(200).json({
    success: true,
    data: events,
    message: 'Race events retrieved successfully',
  });
});

const startRace = asyncHandler(async (req, res) => {
  const { raceId } = req.params;
  const result = await raceService.startRace(raceId, req.body || {});
  res.status(200).json({
    success: true,
    data: result,
    message: 'Race simulation initiated',
  });
});

/**
 * Server-Sent Events (SSE) live updates stream
 * Endpoint: GET /api/races/:raceId/stream
 */
const getRaceStream = asyncHandler(async (req, res) => {
  const { raceId } = req.params;
  const race = await raceService.getRaceById(raceId);

  // Set standard SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable proxy buffering if behind nginx
  });

  if (res.flushHeaders) {
    res.flushHeaders();
  }

  // Send initial connection event
  const initialPayload = {
    type: 'INITIAL_STATE',
    raceId: race._id,
    status: race.status,
    trackingSource: race.trackingSource,
    racers: race.racers,
    timestamp: new Date().toISOString(),
  };
  res.write(`data: ${JSON.stringify(initialPayload)}\n\n`);

  // Subscribe to live race simulator updates
  raceSimulator.subscribe(raceId, res);

  // Keep-alive heartbeat every 15 seconds to prevent client timeout
  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    raceSimulator.unsubscribe(raceId, res);
  });
});

module.exports = {
  createRace,
  getAllRaces,
  getRaceById,
  getRaceEvents,
  startRace,
  getRaceStream,
};
