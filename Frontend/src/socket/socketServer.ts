// import { base_url } from '@/static/data';
import { base_url } from '@/config/config';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io(base_url, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.log('Socket connection error:'+ error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

export default socket;