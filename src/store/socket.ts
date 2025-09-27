import { io, Socket } from 'socket.io-client';
import { API_HOST } from '../config';

export const connectSocket = (ns: 'location' | 'chat', token: string): Socket =>
  io(`${API_HOST}/ws/${ns}`, { auth: { token }, transports: ['websocket'] });
