// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';
import { API_HOST } from '../config';

export const connectSocket = (ns: 'location' | 'chat', token: string): Socket => {
    const url = `${API_HOST.replace(/\/+$/, '')}/ws/${ns}`;
    const s = io(url, {
        transports: ['websocket'],
        auth: { token },
        timeout: 10000,
        forceNew: true,
        reconnection: true,
    });

    s.on('connect', () => {
        console.log(`[WS ${ns}] Conectado id=${s.id} url=${url}`);
    });
    s.on('disconnect', (reason) => {
        console.log(`[WS ${ns}] Desconectado:`, reason);
    });
    s.on('connect_error', (e) => {
        console.log(`[WS ${ns}] erro na conexão:`, e?.message || e);
    });
    s.on('error', (e) => {
        console.log(`[WS ${ns}] erro:`, e);
    });
    s.io.on('reconnect_attempt', (n) => {
        console.log(`[WS ${ns}] tentativa de reconexão`, n);
    });

    return s;
};

