const EventEmitter = require('events');
const env = require('../config/env');
const RaceModel = require('../models/race.model');
const RaceEventModel = require('../models/raceEvent.model');
const OrderModel = require('../models/order.model');
const { rankRacers, calculateEtaSeconds } = require('../utils/ranking');
const llmAdapter = require('../adapters/llm.adapter');

class RaceSimulatorService extends EventEmitter {
  constructor() {
    super();
    // Map of active race intervals: raceId -> intervalId
    this.activeTimers = new Map();
    // Map of current simulation tick step: raceId -> stepIndex
    this.simulationSteps = new Map();
    // Map of SSE client response streams: raceId -> Set(res)
    this.sseClients = new Map();
  }

  /**
   * Subscribe an SSE response object to updates for a specific race
   */
  subscribe(raceId, res) {
    if (!this.sseClients.has(raceId)) {
      this.sseClients.set(raceId, new Set());
    }
    this.sseClients.get(raceId).add(res);

    // Clean up when client closes connection
    res.on('close', () => {
      this.unsubscribe(raceId, res);
    });
  }

  /**
   * Unsubscribe an SSE client
   */
  unsubscribe(raceId, res) {
    const clients = this.sseClients.get(raceId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        this.sseClients.delete(raceId);
      }
    }
  }

  /**
   * Broadcast an SSE packet to all connected clients for a race
   */
  broadcastSSE(raceId, payload) {
    const clients = this.sseClients.get(raceId);
    if (!clients || clients.size === 0) return;

    const dataString = `data: ${JSON.stringify(payload)}\n\n`;
    for (const res of clients) {
      try {
        res.write(dataString);
      } catch (err) {
        console.error('Error writing to SSE client:', err.message);
      }
    }
  }

  /**
   * Start deterministic race simulation
   */
  async startRace(raceId, options = {}) {
    // Prevent duplicate timers
    if (this.activeTimers.has(raceId)) {
      return { running: true, message: 'Race simulation already running' };
    }

    const race = await RaceModel.findById(raceId);
    if (!race) {
      throw new Error(`Race not found: ${raceId}`);
    }

    if (race.status === RaceModel.RACE_STATUSES.FINISHED) {
      return { running: false, message: 'Race is already finished' };
    }

    // Mark race as RUNNING
    const now = new Date().toISOString();
    await RaceModel.findByIdAndUpdate(raceId, {
      status: RaceModel.RACE_STATUSES.RUNNING,
      startedAt: race.startedAt || now,
    });

    // Update corresponding order status to PICKED_UP
    if (race.orderId) {
      await OrderModel.findByIdAndUpdate(race.orderId, {
        status: OrderModel.ORDER_STATUSES.PICKED_UP,
      });
    }

    // Step 0: Emit RACE_STARTED event
    const startEvent = await this.recordAndBroadcastEvent(raceId, {
      type: RaceEventModel.EVENT_TYPES.RACE_STARTED,
      message: 'The race is ON! Riders have launched from the kitchen!',
      metadata: { step: 0, progress: 0 },
    });

    this.simulationSteps.set(raceId, 0);

    const tickInterval = options.tickIntervalMs || env.RACE_TICK_INTERVAL_MS;

    const timerId = setInterval(async () => {
      try {
        await this.step(raceId);
      } catch (err) {
        console.error(`Error in race simulation step for ${raceId}:`, err);
        this.stopTimer(raceId);
      }
    }, tickInterval);

    this.activeTimers.set(raceId, timerId);

    return { running: true, message: 'Simulation started', startEvent };
  }

  /**
   * Execute a single deterministic simulation step
   */
  async step(raceId) {
    const race = await RaceModel.findById(raceId);
    if (!race || race.status !== RaceModel.RACE_STATUSES.RUNNING) {
      this.stopTimer(raceId);
      return null;
    }

    const currentStep = (this.simulationSteps.get(raceId) || 0) + 1;
    this.simulationSteps.set(raceId, currentStep);

    // Deterministic progress steps (0 to 8 steps to reach 100%)
    // Each racer has distinct deterministic progress increments
    const racers = race.racers.map((racer, index) => {
      let progress = Number(racer.progress) || 0;
      let status = racer.status || 'RACING';

      // Custom offsets per racer so they race competitively
      const offsetMultiplier = index === 0 ? 1.05 : index === 1 ? 0.98 : 0.95;
      const baseIncrement = 12 * offsetMultiplier;

      // Event-based variations
      if (currentStep === 3) {
        // Traffic event at step 3 slows down competitor 1
        if (index === 1) progress += 4;
        else progress += baseIncrement;
      } else if (currentStep === 5) {
        // Speed boost at step 5 boosts the main rider
        if (index === 0) progress += baseIncrement * 1.6;
        else progress += baseIncrement;
      } else {
        progress += baseIncrement;
      }

      if (progress >= 100) {
        progress = 100;
        status = 'FINISHED';
      }

      const etaSeconds = calculateEtaSeconds(progress, index === 0 ? 1.2 : 1.0);
      const distanceRemaining = Math.max(0, Math.round((100 - progress) * 35)); // ~3.5km total virtual course

      return {
        ...racer,
        progress: Math.min(100, Math.round(progress)),
        etaSeconds: progress >= 100 ? 0 : etaSeconds,
        distanceRemaining,
        status,
      };
    });

    // Rank racers
    const rankedRacers = rankRacers(racers);

    // Determine event type for this step
    let eventType = RaceEventModel.EVENT_TYPES.RIDER_MOVED;
    let eventMessage = `Riders advance through the circuit!`;

    if (currentStep === 1) {
      eventType = RaceEventModel.EVENT_TYPES.RIDER_MOVED;
      eventMessage = `Throttle down! Early leader emerges!`;
    } else if (currentStep === 2) {
      eventType = RaceEventModel.EVENT_TYPES.CHECKPOINT_REACHED;
      eventMessage = `Checkpoint 1 reached! 25% course completed.`;
    } else if (currentStep === 3) {
      eventType = RaceEventModel.EVENT_TYPES.TRAFFIC_STARTED;
      eventMessage = `Caution: Dense traffic reported at Central Junction!`;
    } else if (currentStep === 4) {
      eventType = RaceEventModel.EVENT_TYPES.TRAFFIC_ENDED;
      eventMessage = `Clear roads ahead! Acceleration resumed!`;
    } else if (currentStep === 5) {
      eventType = RaceEventModel.EVENT_TYPES.BOOST_ACTIVATED;
      eventMessage = `⚡ TURBO BOOST ACTIVATED! Speed surge on the outer bypass!`;
    } else if (currentStep === 6) {
      eventType = RaceEventModel.EVENT_TYPES.CHECKPOINT_REACHED;
      eventMessage = `Checkpoint 2 cleared! Entering the final sector!`;
    } else if (currentStep === 7) {
      eventType = RaceEventModel.EVENT_TYPES.ETA_CHANGED;
      eventMessage = `ETA dropping fast as riders sprint towards delivery point!`;
    }

    const anyFinished = rankedRacers.some((r) => r.progress >= 100);

    if (anyFinished || currentStep >= 8) {
      // Mark all reaching 100%
      for (const r of rankedRacers) {
        if (r.progress >= 95) {
          r.progress = 100;
          r.etaSeconds = 0;
          r.distanceRemaining = 0;
          r.status = 'FINISHED';
        }
      }
      eventType = RaceEventModel.EVENT_TYPES.RACE_FINISHED;
      eventMessage = `🏁 RACE FINISHED! Order successfully delivered!`;
    }

    // Save updated race state
    const leader = rankedRacers[0];
    const updates = {
      racers: rankedRacers,
    };

    if (eventType === RaceEventModel.EVENT_TYPES.RACE_FINISHED) {
      updates.status = RaceModel.RACE_STATUSES.FINISHED;
      updates.finishedAt = new Date().toISOString();
      updates.winningRacerId = leader.racerId;
    }

    await RaceModel.findByIdAndUpdate(raceId, updates);

    // Record and broadcast event
    const event = await this.recordAndBroadcastEvent(raceId, {
      type: eventType,
      message: eventMessage,
      racerId: leader.racerId,
      metadata: {
        step: currentStep,
        leaderId: leader.racerId,
        leaderName: leader.name,
        progress: leader.progress,
        etaSeconds: leader.etaSeconds,
      },
    });

    // If finished, finish up
    if (eventType === RaceEventModel.EVENT_TYPES.RACE_FINISHED) {
      this.stopTimer(raceId);

      // Complete order
      if (race.orderId) {
        await OrderModel.findByIdAndUpdate(race.orderId, {
          status: OrderModel.ORDER_STATUSES.DELIVERED,
        });
      }

      // Notify EventEmitter for prediction settlement
      this.emit('race_finished', {
        raceId,
        winningRacerId: leader.racerId,
        race,
      });
    }

    return { raceId, step: currentStep, event, rankedRacers };
  }

  /**
   * Helper to record race event and broadcast to SSE stream
   */
  async recordAndBroadcastEvent(raceId, { type, message, racerId, metadata }) {
    // Generate AI commentary or fallback message
    const commentary = await llmAdapter.generateCommentary(type, {
      racerName: metadata?.leaderName || 'Delivery Rider',
      progress: metadata?.progress || 0,
      etaSeconds: metadata?.etaSeconds || 0,
    });

    const event = await RaceEventModel.create({
      raceId,
      type,
      message: `${message} ${commentary}`,
      racerId: racerId || null,
      metadata: metadata || {},
      source: 'SIMULATOR',
    });

    // Build the exact SSE payload required by Section 6
    const ssePayload = {
      type: 'RACE_UPDATE',
      raceId,
      racer: {
        id: racerId || metadata?.leaderId || 'racer_1',
        name: metadata?.leaderName || 'Delivery Rider',
        progress: metadata?.progress || 0,
        etaSeconds: metadata?.etaSeconds || 0,
        rank: 1,
      },
      event: {
        type: event.type,
        message: event.message,
      },
      timestamp: event.createdAt,
    };

    this.broadcastSSE(raceId, ssePayload);
    this.emit('race_event', { raceId, event, ssePayload });

    return event;
  }

  stopTimer(raceId) {
    if (this.activeTimers.has(raceId)) {
      clearInterval(this.activeTimers.get(raceId));
      this.activeTimers.delete(raceId);
    }
  }

  stopAll() {
    for (const [raceId, timerId] of this.activeTimers.entries()) {
      clearInterval(timerId);
    }
    this.activeTimers.clear();
    this.simulationSteps.clear();
  }
}

module.exports = new RaceSimulatorService();
