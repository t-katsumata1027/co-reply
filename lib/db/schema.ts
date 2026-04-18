import { pgTable, uuid, text, timestamp, unique, pgSchema } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Supabase の auth スキーマ（参照用）
const authSchema = pgSchema('auth');
const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

// Projects テーブル
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  persona: text('persona'),
  goal: text('goal'),
  keywords: text('keywords').array(),
  language: text('language').default('ja'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Posts テーブル
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  externalId: text('external_id').notNull(),
  content: text('content').notNull(),
  authorName: text('author_name'),
  authorHandle: text('author_handle'),
  url: text('url'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  unique('posts_project_id_external_id_unique').on(table.projectId, table.externalId),
]);

// Drafts テーブル
export const drafts = pgTable('drafts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
