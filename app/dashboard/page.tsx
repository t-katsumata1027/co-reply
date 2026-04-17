import { supabase } from '@/lib/supabase';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      drafts (content)
    `)
    .eq('status', 'pending');

  if (error) throw error;

  return <DashboardClient initialPosts={posts || []} />;
}
