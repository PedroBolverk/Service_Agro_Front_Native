// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';
import { API_HOST } from '../config';

// Se quiser, adicione outros namespaces aqui.
export type KnownNamespaces = 'location' | 'chat' | 'updates';

// Opções extras (opcional)
type ConnectOpts = {
  forceNew?: boolean;
  reconnection?: boolean;
  timeout?: number;
  transports?: ('websocket' | 'polling')[];
};

export const connectSocket = (
  ns: KnownNamespaces | string,
  token: string,
  opts: ConnectOpts = {}
): Socket => {
  // Garante que não terá barra dupla
  const base = API_HOST.replace(/\/+$/, '');
  // Servidor expõe namespaces sob /ws/<ns> (ajuste se no seu back for diferente)
  const url = `${base}/ws/${ns}`;

  const socket = io(url, {
    auth: { token },
    transports: opts.transports ?? ['websocket'],
    timeout: opts.timeout ?? 10000,
    forceNew: opts.forceNew ?? true,
    reconnection: opts.reconnection ?? true,
  });

  // Logs úteis pra debug
  socket.on('connect', () => {
    console.log(`[WS ${ns}] conectado id=${socket.id} url=${url}`);
  });
  socket.on('disconnect', (reason) => {
    console.log(`[WS ${ns}] desconectado:`, reason);
  });
  socket.on('connect_error', (e: any) => {
    console.log(`[WS ${ns}] erro na conexão:`, e?.message || e);
  });
  socket.on('error', (e: any) => {
    console.log(`[WS ${ns}] erro:`, e);
  });
  socket.io.on('reconnect_attempt', (n) => {
    console.log(`[WS ${ns}] tentativa de reconexão`, n);
  });

  return socket;
};

/** Helpers opcionais */

// Entra em uma sala (útil para receber eventos só do próprio produtor/mecânico)
export const joinRoom = (socket: Socket, room: string | { userId?: string; role?: string }) => {
  // se seu back espera um payload específico, ajuste aqui:
  socket.emit('room:join', room);
};

// Sai da sala
export const leaveRoom = (socket: Socket, room: string | { userId?: string }) => {
  socket.emit('room:leave', room);
};

// Inscrever em um evento e retornar função para desinscrever
export const onEvent = <T = any>(socket: Socket, event: string, cb: (payload: T) => void) => {
  socket.on(event, cb);
  return () => socket.off(event, cb);
};
