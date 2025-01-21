import { io, Socket } from 'socket.io-client';
import useTokenStore from '@/store/TokenStore';

const socket: Socket = io('http://localhost:3000');

// Join user's room when socket connects
socket.on('connect', () => {
    const token = useTokenStore((state) => state.token);
  if (token) {
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    socket.emit('join', userId);
  }
});

export default socket;