-- 1. Projects テーブル
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    persona TEXT,
    goal TEXT,
    keywords TEXT[],
    language TEXT DEFAULT 'ja',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Posts テーブル
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    external_id TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT,
    author_handle TEXT,
    url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, external_id)
);

-- 3. Drafts テーブル
CREATE TABLE drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS を有効化
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー: projects
CREATE POLICY "Users can manage their own projects" ON projects
    FOR ALL USING (auth.uid() = user_id);

-- RLS ポリシー: posts (紐づくプロジェクトの所有者のみ)
CREATE POLICY "Users can manage posts of their own projects" ON posts
    FOR ALL USING (EXISTS (
        SELECT 1 FROM projects WHERE projects.id = posts.project_id AND projects.user_id = auth.uid()
    ));

-- RLS ポリシー: drafts (紐づくポストの親プロジェクトの所有者のみ)
CREATE POLICY "Users can manage drafts of their own posts" ON drafts
    FOR ALL USING (EXISTS (
        SELECT 1 FROM posts
        JOIN projects ON projects.id = posts.project_id
        WHERE posts.id = drafts.post_id AND projects.user_id = auth.uid()
    ));
