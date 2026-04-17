import { supabase } from '@/lib/supabase';
import { ScoutPost } from '@/lib/scout/twitter';

export async function savePosts(projectId: string, posts: ScoutPost[]) {
  const { data, error } = await supabase
    .from('posts')
    .upsert(
      posts.map((post) => ({
        project_id: projectId,
        external_id: post.externalId,
        content: post.content,
        author_name: post.authorName,
        author_handle: post.authorHandle,
        url: post.url,
      })),
      { onConflict: 'project_id, external_id' }
    );

  if (error) {
    console.error('Error saving posts:', error);
    throw error;
  }
  return data;
}
