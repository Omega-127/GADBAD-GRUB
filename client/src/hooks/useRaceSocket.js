import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../utils/constants';

/**
 * Hook to manage real-time race telemetry via Server-Sent Events (SSE)
 * Natively supported on Render (backend) and Vercel (frontend)
 */
export function useRaceSocket(raceId, callbacks = {}) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  const { onState, onEvent, onLeaderboard, onFinished } = callbacks;

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
            if (data.type === 'INITIAL_STATE' || data.type === 'RACE_UPDATE') {
              if (onState) {
                onState({
                  racers: data.racers,
                  progress: data.racer?.progress ?? (data.racers?.[0]?.progress || 0),
                  status: data.status,
                  winner: data.status === 'finished' ? data.racers?.[0] : null,
                });
              }
              if (onLeaderboard && data.racers) {
                onLeaderboard(data.racers);
              }
              if (onEvent && data.event) {
                onEvent(data.event);
              }
              if (onFinished && (data.status === 'finished' || data.type === 'RACE_FINISHED')) {
                onFinished({ winner: data.racers?.[0] });
              }
            }
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

    return () => {
      isSubscribed = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [raceId, onState, onEvent, onLeaderboard, onFinished]);

  return {
    socket: null,
    connected,
    error,
  };
}

export default useRaceSocket;
