import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTwitterScout } from '@/lib/scout/twitter';
import { savePosts } from '@/lib/db/posts';

export async function GET(request: Request) {
  // セキュリティガード (簡易的なチェック)
  const authHeader = request.headers.get('Authorization');
  const secretKey = process.env.SCOUT_API_SECRET;
  
  if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. プロジェクト取得 (テスト用に最初の1件)
    const { data: projects, error: pError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (pError || !projects || projects.length === 0) {
      return NextResponse.json({ error: 'No projects found' }, { status: 404 });
    }

    const project = projects[0];
    const scout = getTwitterScout();

    // 2. 投稿取得
    const posts = await scout.fetchPosts(project.keywords || []);

    // 3. 保存
    await savePosts(project.id, posts);

    return NextResponse.json({
      message: 'Scouting completed',
      projectId: project.id,
      savedCount: posts.length
    });
  } catch (error) {
    console.error('Scouting error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
