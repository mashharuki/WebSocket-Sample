'use client';

import { messageBoardAtom, socketAtom, userNameAtom } from '@/globalStates/atoms';
import Message from '@/models/message';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { io, Socket } from 'socket.io-client';

// ユーザー名の入力とサーバーへの接続を行うコンポーネント
export default function ConnectionForm() {
  const [userName, setUserName] = useAtom(userNameAtom);
  const [, setMessageBoard] = useAtom(messageBoardAtom);
  const [, setSocket] = useAtom(socketAtom);
  const router = useRouter();

  // フォームの送信
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    // WebSocketサーバーに接続するにはまずHTTPサーバーに接続してWebSocketのエンドポイントを取得する必要がある
    await fetch('http://localhost:3000/api/sockets', { method: 'POST' });
    // WebSocketサーバーに接続
    const socket = io({ autoConnect: false });
    // WebSocketサーバーに接続
    socket.connect();
    // WebSocketの各イベントに対する処理を定義
    socketInitializer(socket);
    // グローバル状態にソケットを保存
    setSocket(socket);
    // メッセージ一覧ページに遷移
    router.push('/rooms');
  };

  const socketInitializer = (socket: Socket) => {
    // サーバーとの接続が確立したときの処理
    socket.on('connect', () => {
      console.log('Connected to the server');
    });
    // サーバーとの接続が切断されたときの処理
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
    // サーバーからメッセージを受信したときの処理
    socket.on('message', (newMessage: Message) => {
      // グローバル状態のメッセージ一覧を更新
      setMessageBoard((messageBoard) => {
        // idが重複するメッセージを削除（一応の処理）
        const newMessageBoard = Array.from(new Map(messageBoard.map((message) => [message.id, message])).values());
        // 新しいメッセージを追加
        newMessageBoard.push(newMessage);
        return newMessageBoard;
      });
    });
  };

  // ユーザー名の入力
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    setUserName(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="border border-gray-400 p-2"
          name="name"
          placeholder="enter your name"
          value={userName}
          onChange={handleChange}
          autoComplete={'off'}
        />
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Connect</button>
      </form>
    </>
  );
}
