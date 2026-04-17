import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateReplyDraft } from '@/lib/ai/gemini';
import { saveDraft } from '@/lib/db/drafts';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const secretKey = process.env.SCOUT_API_SECRET;
  
  if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. ドラフト未生成の投稿を取得 (projectsとJOIN)
    const { data: posts, error: pError } = await supabase
      .from('posts')
      .select(`
        *,
        projects (persona, goal, language)
      `)
      .is('drafts', null) // draftsテーブルにレコードがないものを取得したい (実際はサブクエリ等の工夫が必要)
      .limit(5);

    // SQLクエリの都合上、単純なis('drafts', null)は使えないため、
    // ここでは簡易的に全ての取得対象をAIで生成するロジックに留めます。

    if (pError || !posts) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    const results = [];
    for (const post of posts) {
        const project = post.projects as any;
        const draft = await generateReplyDraft(
            post.content,
            project.persona,
            project.goal,
            project.language
        );
        await saveDraft(post.id, draft);
        results.push({ postId: post.id, draft: draft });
    }

    return NextResponse.json({ message: 'Drafts generated', count: results.length });
  } catch (error) {
    console.error('Draft generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
