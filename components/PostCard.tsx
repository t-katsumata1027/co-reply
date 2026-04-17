import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { User } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  author_name: string;
  author_handle: string;
  external_id: string;
  drafts: { content: string }[];
}

export default function PostCard({ post, onUpdate }: { post: Post; onUpdate: (id: string) => void }) {
  const [text, setText] = useState(post.drafts[0]?.content || '');

  const updateStatus = async (status: string) => {
    await fetch(`/api/posts/${post.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    onUpdate(post.id);
  };

  const handleApprove = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&in_reply_to=${post.external_id}`;
    window.open(url, '_blank');
    updateStatus('sent');
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-8 w-8 rounded-full bg-muted p-1" />
          <div>
            <CardTitle className="text-sm">{post.author_name}</CardTitle>
            <p className="text-xs text-muted-foreground">@{post.author_handle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="mb-4 text-sm">{post.content}</p>
        <Textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="min-h-[100px]"
        />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={() => updateStatus('skipped')}>Skip</Button>
        <Button onClick={handleApprove}>Approve & Reply</Button>
      </CardFooter>
    </Card>
  );
}
