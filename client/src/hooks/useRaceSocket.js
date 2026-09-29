import { useEffect, useRef, useState, useCallback } from 'react';
import { API_BASE_URL } from '../utils/constants';
import raceApi from '../services/raceApi';
import { normalizeRace } from '../utils/normalizeRace';

/**
 * Hook to manage real-time race telemetry via Server-Sent Events (SSE)
 * Natively supported on Render (backend) and Vercel (frontend)
 */
export function useRaceSocket(raceId, callbacks = {}) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);
  const pollRef = useRef(null);

  const { onState, onEvent, onLeaderboard, onFinished } = callbacks;

  const applyPayload = useCallback(async (data) => {
    if (!data) return;

    // Server RACE_UPDATE often omits full racers[] — refresh from REST when needed
    let raceSnapshot = null;
    if (data.type === 'RACE_UPDATE' && (!data.racers || !data.racers.length) && raceId) {
      try {
        raceSnapshot = await raceApi.getRace(raceId);
      } catch {
        // ignore refresh failures; use partial payload
      }
    }

    const normalized = raceSnapshot
      ? raceSnapshot
      : normalizeRace({
          ...data,
          status: data.status || (data.event?.type === 'RACE_FINISHED' ? 'FINISHED' : data.status),
          progress: data.racer?.progress ?? data.progress,
          racers: data.racers,
          racerId: data.racer?.id || data.racerId,
          racerName: data.racer?.name || data.racerName,
          etaSeconds: data.racer?.etaSeconds ?? data.etaSeconds,
        });

    if (onState && (data.type === 'INITIAL_STATE' || data.type === 'RACE_UPDATE' || raceSnapshot)) {
      onState({
        ...normalized,
        racers: normalized.racers,
        progress: normalized.progress,
        status: normalized.status,
        winner:
          normalized.status === 'finished'
            ? normalized.racers?.[0]
            : null,
      });
    }

    if (onLeaderboard && normalized.racers) {
      onLeaderboard(normalized.racers);
    }

    if (onEvent && data.event) {
      onEvent({
        _id: `sse_${Date.now()}`,
        raceId,
        type: data.event.type || 'UPDATE',
        message: data.event.message || data.event,
        source: 'simulator',
        createdAt: data.timestamp || new Date().toISOString(),
      });
    }

    if (
      onFinished &&
      (normalized.status === 'finished' ||
        data.type === 'RACE_FINISHED' ||
        data.event?.type === 'RACE_FINISHED')
    ) {
      onFinished({ winner: normalized.racers?.[0] || data.racer });
    }
  }, [raceId, onState, onEvent, onLeaderboard, onFinished]);

  useEffect(() => {
    if (!raceId) return;

    let eventSource = null;
    let isSubscribed = true;

    // Connect to backend Server-Sent Events (SSE) stream
    if (typeof window !== 'undefined' && window.EventSource) {
      try {
        const streamUrl = `${API_BASE_URL}/races/${raceId}/stream`;
        eventSource = new EventSource(streamUrl);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          if (!isSubscribed) return;
          setConnected(true);
          setError(null);
        };

        eventSource.onmessage = (e) => {
          if (!isSubscribed || !e.data) return;
          try {
            const data = JSON.parse(e.data);
            applyPayload(data);
          } catch {
            // Ignore comments/heartbeats
          }
        };

        eventSource.onerror = () => {
          if (!isSubscribed) return;
          setConnected(false);
          setError('Live telemetry link offline, using local simulator');
          if (eventSource) {
            eventSource.close();
          }
        };
      } catch (err) {
        setError(err.message);
      }
    }

    // Lightweight REST poll as backup while SSE is connected (covers sparse SSE payloads)
    pollRef.current = setInterval(async () => {
      if (!isSubscribed) return;
      try {
        const race = await raceApi.getRace(raceId);
        if (!isSubscribed || !race) return;
        if (onState) onState(race);
        if (onLeaderboard && race.racers) onLeaderboard(race.racers);
        if (onFinished && race.status === 'finished') {
          onFinished({ winner: race.racers?.[0] });
        }
      } catch {
        // silent — local sim / SSE may still drive UI
      }
    }, 2500);

    return () => {
      isSubscribed = false;
      if (eventSource) {
        eventSource.close();
      }
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [raceId, applyPayload, onState, onLeaderboard, onFinished]);

  return {
    socket: null,
    connected,
    error,
  };
}

export default useRaceSocket;
