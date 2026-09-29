import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

/**
 * Hook to manage Socket.IO connection for real-time race telemetry
 */
export function useRaceSocket(raceId, callbacks = {}) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const { onState, onEvent, onLeaderboard, onFinished } = callbacks;

  useEffect(() => {
    if (!raceId) return;

    let socket;
    try {
      socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        timeout: 5000,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
        setError(null);
        socket.emit('race:join', { raceId });
      });

      socket.on('connect_error', (err) => {
        setConnected(false);
        setError(err.message || 'Real-time telemetry link offline');
      });

      socket.on('disconnect', () => {
        setConnected(false);
      });

      if (onState) {
        socket.on('race:state', onState);
      }

      if (onEvent) {
        socket.on('race:event', onEvent);
      }

      if (onLeaderboard) {
        socket.on('race:leaderboard', onLeaderboard);
      }

      if (onFinished) {
        socket.on('race:finished', onFinished);
      }
    } catch (err) {
      setError(err.message);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [raceId]);

  return {
    socket: socketRef.current,
    connected,
    error,
  };
}

export default useRaceSocket;
