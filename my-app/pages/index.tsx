import ConnectionForm from '@/components/ConnectForm';
import { Suspense } from 'react';

// 最初に表示されるページコンポーネント
export default function Home() {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <ConnectionForm />
      </Suspense>
    </>
  );
}