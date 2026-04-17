'use client';
import { useState } from 'react';
import PostCard from '@/components/PostCard';

export default function DashboardClient({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts);

  const handleUpdate = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-2xl font-bold">Pending Replies</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  );
}
