/*
  # タグ機能の追加

  1. 新規テーブル
    - `tags`: タグ管理用テーブル
      - `id`: UUID (主キー)
      - `user_id`: タグ作成者のID (外部キー)
      - `name`: タグ名
      - `color`: タグの色
      - `created_at`: 作成日時

    - `todo_tags`: TodoとTagの中間テーブル
      - `id`: UUID (主キー)
      - `todo_id`: TodoのID (外部キー)
      - `tag_id`: TagのID (外部キー)
      - `created_at`: 作成日時

  2. セキュリティ
    - 両テーブルでRLSを有効化
    - タグの作成・閲覧・更新・削除に関するポリシーを設定
    - Todo-Tag関連付けのポリシーを設定
*/

-- タグテーブルの作成
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Todo-Tag中間テーブルの作成
CREATE TABLE IF NOT EXISTS todo_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(todo_id, tag_id)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS tags_name_idx ON tags(name);
CREATE INDEX IF NOT EXISTS tags_user_id_idx ON tags(user_id);
CREATE INDEX IF NOT EXISTS todo_tags_todo_id_idx ON todo_tags(todo_id);
CREATE INDEX IF NOT EXISTS todo_tags_tag_id_idx ON todo_tags(tag_id);

-- RLSの有効化
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_tags ENABLE ROW LEVEL SECURITY;

-- タグのポリシー設定
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tags' 
    AND policyname = 'タグは作成者のみアクセス可能'
  ) THEN
    CREATE POLICY "タグは作成者のみアクセス可能"
      ON tags
      FOR ALL
      TO public
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Todo-Tag関連付けのポリシー設定
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todo_tags' 
    AND policyname = 'タグ関連付けは関連Todoの作成者のみアクセス可能'
  ) THEN
    CREATE POLICY "タグ関連付けは関連Todoの作成者のみアクセス可能"
      ON todo_tags
      FOR ALL
      TO public
      USING (EXISTS (
        SELECT 1
        FROM todos
        WHERE todos.id = todo_tags.todo_id
        AND todos.user_id = auth.uid()
      ))
      WITH CHECK (EXISTS (
        SELECT 1
        FROM todos
        WHERE todos.id = todo_tags.todo_id
        AND todos.user_id = auth.uid()
      ));
  END IF;
END $$;