// コメントが記してある箇所だけ追加
import "@/styles/globals.css";
import type { AppProps } from "next/app";
//jotaiからProviderコンポーネントをインポート 
import { Provider } from "jotai";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
