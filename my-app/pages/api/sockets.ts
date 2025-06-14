import cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

import type { Server as HttpServer } from 'http';
import type { Socket as NetSocket } from 'net';
import { Server as SocketServer } from 'socket.io';

// Next.jsの型定義を拡張してSocket.IOの型定義を追加
type ReseponseWebSocket = NextApiResponse & {
  socket: NetSocket & { server: HttpServer & { io?: SocketServer } };
};

// CORSミドルウェアを設定
const corsMiddleware = cors();

/**
 * WebSocket用のAPIハンドラー
 * Next.jsのAPIルーティングの入り口となる関数
 * @param req 
 * @param res 
 * @returns 
 */
export default function SocketHandler(req: NextApiRequest, res: ReseponseWebSocket) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  if (res.socket.server.io) {
    return res.send('already-set-up');
  }
  // Socket.IOのサーバーを作成する
  const io = new SocketServer(res.socket.server, {
    addTrailingSlash: false,
  });

  // クライアントが接続してきたら、コネクションを確立する
  io.on('connection', (socket) => {
    const clientId = socket.id;
    console.log(`A client connected. ID: ${clientId}`);

    // メッセージを受信したら、全クライアントに送信する
    socket.on('message', (data) => {
      io.emit('message', data);
      console.log('Received message:', data);
    });

    // クライアントが切断した場合の処理
    socket.on('disconnect', () => {
      console.log('A client disconnected.');
    });
  });

  // CORS対策を一応、有効にした上でサーバーを設定する
  corsMiddleware(req, res, () => {
    res.socket.server.io = io;
    res.end();
  });
}
