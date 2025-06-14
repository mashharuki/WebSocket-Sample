import MessageList from '@/components/MessageList';
import { Suspense } from 'react';

// メッセージの入力と一覧を行うページコンポーネント
export default function Rooms() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <MessageList />
    </Suspense>
  );
}