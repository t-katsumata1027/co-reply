import { supabase } from '@/lib/supabase';

export async function saveDraft(postId: string, content: string) {
  const { data, error } = await supabase
    .from('drafts')
    .insert({
      post_id: postId,
      content: content,
    });

  if (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
  return data;
}
