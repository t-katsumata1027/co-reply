import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateReplyDraft(
  postContent: string,
  persona: string,
  goal: string,
  language: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
あなたはSNSの engagement assistant です。
以下の情報を元に、自然で共感を生むリプライの案を作成してください。

[元の投稿]:
${postContent}

[あなたのペルソナ]:
${persona}

[リプライの目的]:
${goal}

- 言語: ${language === 'ja' ? '日本語' : '英語'}
- 注意点: スパムっぽくならないこと、共感から入ること、非常に短文（最大140文字以内）。
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.trim();
}
