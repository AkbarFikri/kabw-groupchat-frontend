import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:8080';

let sharedSocket: Socket | null = null;

export function getSocket(): Socket {
  if (!sharedSocket) {
    sharedSocket = io(SOCKET_URL, { withCredentials: true });
  }
  return sharedSocket;
}

export function disconnectSocket() {
  if (sharedSocket) {
    sharedSocket.disconnect();
    sharedSocket = null;
  }
}

export function useGroupSocket(groupId: string | null, onMessage: (msg: unknown) => void) {
  const callbackRef = useRef(onMessage);
  callbackRef.current = onMessage;

  useEffect(() => {
    if (!groupId) return;
    const socket = getSocket();

    socket.emit('join-group', groupId);

    const handler = (msg: unknown) => callbackRef.current(msg);
    socket.on('message', handler);

    return () => {
      socket.off('message', handler);
      socket.emit('leave-group', groupId);
    };
  }, [groupId]);
}
