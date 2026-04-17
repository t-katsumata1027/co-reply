export interface ScoutPost {
  externalId: string;
  content: string;
  authorName: string;
  authorHandle: string;
  url: string;
}

export interface TwitterScout {
  fetchPosts(keywords: string[]): Promise<ScoutPost[]>;
}

class MockTwitterScout implements TwitterScout {
  async fetchPosts(keywords: string[]): Promise<ScoutPost[]> {
    return keywords.map((k, i) => ({
      externalId: `mock-id-${i}`,
      content: `このポストは "${k}" に関するダミーの投稿です。AIによる分析が楽しみです！`,
      authorName: `ユーザー ${i}`,
      authorHandle: `user${i}`,
      url: `https://twitter.com/user${i}/status/mock-id-${i}`,
    }));
  }
}

// 本番環境実装時はここに TwitterApi を注入する予定
export const getTwitterScout = (): TwitterScout => {
  if (process.env.USE_MOCK_TWITTER_API === 'true') {
    return new MockTwitterScout();
  }
  // 本番用実装
  throw new Error("Twitter API implementation not yet configured.");
};
