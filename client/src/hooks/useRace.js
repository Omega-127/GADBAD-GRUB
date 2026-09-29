import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import raceApi from '../services/raceApi';
import predictionApi from '../services/predictionApi';
import useRaceSocket from './useRaceSocket';
import useAuth from './useAuth';
import { DEMO_RACERS, IS_DEMO_MODE } from '../utils/constants';

export function useRace(raceId) {
  const { addPoints, unlockBadge } = useAuth();
  
  const [race, setRace] = useState(null);
  const [events, setEvents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPrediction, setUserPrediction] = useState(null);
  const [nitroActive, setNitroActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [winner, setWinner] = useState(null);

  // Fallback simulator interval ref
  const simTimerRef = useRef(null);

  // Initial Data Fetch
  useEffect(() => {
    let mounted = true;

    async function loadInitial() {
      if (!raceId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [raceData, eventData, predData] = await Promise.all([
          raceApi.getRace(raceId),
          raceApi.getRaceEvents(raceId),
          predictionApi.getPrediction(raceId),
        ]);

        if (!mounted) return;

        setRace(raceData);
        setEvents(eventData || []);
        setUserPrediction(predData);

        // Initialize racers telemetry
        const racers = raceData.racers || DEMO_RACERS.map((r, idx) => ({
          ...r,
          progress: Math.max(5, 55 - idx * 8),
          speed: r.baseSpeed,
          rank: idx + 1,
          distanceLeftKm: (3.0 - idx * 0.4).toFixed(1)
        }));

        setRace(prev => ({ ...prev, racers }));
        setLeaderboard([...racers].sort((a, b) => b.progress - a.progress));

        if (raceData.status === 'finished' || raceData.progress >= 100) {
          setIsFinished(true);
          const topRacer = racers[0];
          setWinner(topRacer);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      mounted = false;
    };
  }, [raceId]);

  // Handle Socket Events
  const handleStateUpdate = useCallback((state) => {
    setRace((prev) => ({ ...prev, ...state }));
    if (state.racers) {
      setLeaderboard([...state.racers].sort((a, b) => b.progress - a.progress));
    }
    if (state.status === 'finished' || state.progress >= 100) {
      handleRaceFinish(state.winner || (state.racers && state.racers[0]));
    }
  }, []);

  const handleEventUpdate = useCallback((event) => {
    setEvents((prev) => [event, ...prev]);
  }, []);

  const handleLeaderboardUpdate = useCallback((ranks) => {
    setLeaderboard(ranks);
  }, []);

  const handleFinishedUpdate = useCallback((result) => {
    handleRaceFinish(result.winner);
  }, []);

  const { connected } = useRaceSocket(raceId, {
    onState: handleStateUpdate,
    onEvent: handleEventUpdate,
    onLeaderboard: handleLeaderboardUpdate,
    onFinished: handleFinishedUpdate,
  });

  // Finish handling
  const handleRaceFinish = useCallback((winningRacer) => {
    setIsFinished(true);
    setWinner(winningRacer);

    // Fire fireworks / confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#FFB800', '#FF3366', '#00E676'],
      });
    } catch {
      // Ignore if confetti context not ready
    }

    // Award XP and check predictions
    addPoints(150, 'Race Completed Delivery');
    unlockBadge('FIRST_ORDER');

    if (userPrediction && winningRacer && userPrediction.predictedRacerId === winningRacer.id) {
      addPoints(300, 'Correct Prediction Winner!');
      unlockBadge('PREDICTION_KING');
    }
  }, [userPrediction, addPoints, unlockBadge]);

  // Client Simulation fallback when socket is disconnected or demo mode
  useEffect(() => {
    if (!raceId || isFinished || connected) {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      return;
    }

    // Run tick every 1800ms
    simTimerRef.current = setInterval(() => {
      setRace((prev) => {
        if (!prev || prev.status === 'finished' || prev.progress >= 100) {
          if (simTimerRef.current) clearInterval(simTimerRef.current);
          return prev;
        }

        // Randomly adjust progress for each racer
        const updatedRacers = (prev.racers || DEMO_RACERS).map((racer) => {
          // slight randomness in tick speed
          const delta = (Math.random() * 2.8 + 1.2);
          const newProgress = Math.min(100, Math.round((racer.progress + delta) * 10) / 10);
          const currentSpeed = Math.round(racer.baseSpeed + (Math.random() * 8 - 4));
          const distanceLeft = Math.max(0, ((100 - newProgress) * 0.035).toFixed(2));
          return {
            ...racer,
            progress: newProgress,
            speed: currentSpeed,
            distanceLeftKm: distanceLeft,
          };
        });

        // Re-sort racers by progress (descending)
        updatedRacers.sort((a, b) => b.progress - a.progress);
        const rankedRacers = updatedRacers.map((r, idx) => ({ ...r, rank: idx + 1 }));

        const primaryRacer = rankedRacers.find((r) => r.id === prev.racerId) || rankedRacers[0];
        const newOverallProgress = primaryRacer.progress;
        const newEtaSeconds = Math.max(0, Math.round((100 - newOverallProgress) * 4.2));

        // Check if finished
        if (rankedRacers.some((r) => r.progress >= 100)) {
          clearInterval(simTimerRef.current);
          const champ = rankedRacers[0];
          setTimeout(() => handleRaceFinish(champ), 100);

          return {
            ...prev,
            progress: 100,
            etaSeconds: 0,
            status: 'finished',
            racers: rankedRacers,
          };
        }

        // Generate occasional playful race event
        if (Math.random() > 0.6) {
          const sampleCommentary = [
            `⚡ ${rankedRacers[0].name} leans into the hairpin turn with max tire traction!`,
            `💨 Slipstream alert! ${rankedRacers[1]?.name || 'Challenger'} is drafting right behind the leader!`,
            `🚦 Green light sequence! Virtual traffic cleared on Grand Boulevard.`,
            `🔥 Engine RPM spiking! ${rankedRacers[0].name} hits 68 km/h on the straightaway!`,
            `🍔 Food container thermal sensors reading 65°C - piping hot and secure!`
          ];
          const randomMsg = sampleCommentary[Math.floor(Math.random() * sampleCommentary.length)];
          setEvents((ePrev) => [
            {
              _id: `evt_sim_${Date.now()}`,
              raceId: prev._id,
              type: 'SIM_UPDATE',
              message: randomMsg,
              source: 'simulator',
              createdAt: new Date().toISOString(),
            },
            ...ePrev.slice(0, 15),
          ]);
        }

        setLeaderboard(rankedRacers);

        return {
          ...prev,
          progress: newOverallProgress,
          etaSeconds: newEtaSeconds,
          racers: rankedRacers,
        };
      });
    }, 1800);

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [raceId, isFinished, connected, handleRaceFinish]);

  // Submit Winner Prediction
  const submitPrediction = async (racerId) => {
    try {
      const pred = await predictionApi.submitPrediction(raceId, {
        userId: 'usr_gadbad_demo_01',
        predictedRacerId: racerId,
      });
      setUserPrediction(pred);
      addPoints(50, 'Prediction Submitted');
      return pred;
    } catch (err) {
      console.error('Failed to submit prediction', err);
    }
  };

  // Interactive Nitro Boost trigger
  const triggerNitroBoost = () => {
    if (nitroActive || isFinished) return;
    setNitroActive(true);

    // Boost primary racer progress slightly
    setRace((prev) => {
      if (!prev) return prev;
      const boosted = (prev.racers || []).map((r) => {
        if (r.id === prev.racerId || r.rank === 1) {
          return { ...r, progress: Math.min(99, r.progress + 4), speed: r.speed + 15 };
        }
        return r;
      });
      return { ...prev, racers: boosted };
    });

    setEvents((prev) => [
      {
        _id: `nitro_${Date.now()}`,
        raceId,
        type: 'NITRO_BURST',
        message: '🚀 NITRO SUPERCHARGER ENGAGED! Spectator cheer triggered +15 km/h surge!',
        source: 'simulator',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setTimeout(() => {
      setNitroActive(false);
    }, 3000);
  };

  return {
    race,
    events,
    leaderboard,
    loading,
    error,
    userPrediction,
    submitPrediction,
    nitroActive,
    triggerNitroBoost,
    isFinished,
    winner,
    connected,
  };
}

export default useRace;
