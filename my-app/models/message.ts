import { z } from 'zod';

// とりあえずZodを使ってアプリケーション内で
// やり取りするデータモデルを定義
// ※バリデーションルールは未定義です
const MessageSchemaDef = z.object({
  id: z.string(),
  room: z.number(),
  author: z.string(),
  body: z.string()
});

// Zodのデータモデルから型定義を生成
type Message = z.infer<typeof MessageSchemaDef>;
export default Message;
