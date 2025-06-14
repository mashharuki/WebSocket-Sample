'use client';

import { messageBoardAtom, socketAtom, userNameAtom } from '@/globalStates/atoms';
import Message from '@/models/message';
import { useAtom } from 'jotai';
import { FormEventHandler, useState } from 'react';

// メッセージの入力と一覧を行うコンポーネント
export default function MessageList() {
  const [message, setMessage] = useState<string>('');
  // 各グローバル状態のAtomを用意
  const [messageBoard] = useAtom(messageBoardAtom);
  const [userName] = useAtom(userNameAtom);
  const [socket] = useAtom(socketAtom);

  // メッセージの送信
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    
    // WebSocketが接続されていない場合は処理を停止
    if (!socket || !socket.connected) {
      console.warn('WebSocket is not connected');
      return;
    }
    
    // メッセージが空の場合は送信しない
    if (!message.trim()) {
      return;
    }
    
    // 送信するメッセージを作成
    const sendMessage: Message = {
      id: `${userName}-${Date.now()}-${Math.random()}`,    // より安定したID生成
      room: 1,
      author: userName,
      body: message,
    };
    // サーバーにメッセージを送信
    socket.emit('message', sendMessage);
    //　メッセージ入力欄を空にする
    setMessage('');
  };

  const isConnected = socket && socket.connected;

  return (
    <>
      <section>
        {/* 接続状態の表示 */}
        <div className={`mb-4 p-2 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isConnected ? '✅ WebSocket接続済み' : '❌ WebSocket未接続'}
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* メッセージ本文の入力欄 */}
          <input
            className="border border-gray-400 p-2"
            name="message"
            placeholder="enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete={'off'}
            disabled={!isConnected}
          />
          {/* メッセージ送信ボタン */}
          <button 
            className={`font-bold py-2 px-4 rounded ml-2 ${
              isConnected 
                ? 'bg-blue-500 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isConnected}
          >
            Send
          </button>
        </form>
      </section>
      <section>
        <ul>
          {/* メッセージ一覧を表示 */}
          {messageBoard.map((message: Message) => (
            <li key={message.id}>{message.author}:{message.body}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
