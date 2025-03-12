/*
  # コメント機能の追加

  1. 新規テーブル
    - `comments`: Todoに対するコメント管理用テーブル
      - `id`: UUID (主キー)
      - `todo_id`: 対象のTodoのID (外部キー)
      - `user_id`: コメント投稿者のID (外部キー)
      - `content`: コメント内容
      - `created_at`: 作成日時
      - `updated_at`: 更新日時

  2. セキュリティ
    - RLSを有効化
    - コメントの作成・閲覧・更新・削除に関するポリシーを設定
*/

-- コメントテーブルの作成
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS comments_todo_id_idx ON comments(todo_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);

-- updated_at自動更新用のトリガー
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_comments_updated_at'
  ) THEN
    CREATE TRIGGER update_comments_updated_at
      BEFORE UPDATE ON comments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- RLSの有効化
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- コメントのポリシー設定
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comments' 
    AND policyname = 'コメントは認証済みユーザーなら追加可能'
  ) THEN
    CREATE POLICY "コメントは認証済みユーザーなら追加可能"
      ON comments FOR INSERT
      TO public
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comments' 
    AND policyname = 'コメントは Todo 作成者と自分のコメントのみ閲覧'
  ) THEN
    CREATE POLICY "コメントは Todo 作成者と自分のコメントのみ閲覧"
      ON comments FOR SELECT
      TO public
      USING ((auth.uid() IN ( SELECT todos.user_id
        FROM todos
        WHERE (todos.id = comments.todo_id))) OR (auth.uid() = user_id));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comments' 
    AND policyname = 'コメントは自分のみ更新可能'
  ) THEN
    CREATE POLICY "コメントは自分のみ更新可能"
      ON comments FOR UPDATE
      TO public
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comments' 
    AND policyname = 'コメントは Todo 作成者と自分のコメントのみ削除可能'
  ) THEN
    CREATE POLICY "コメントは Todo 作成者と自分のコメントのみ削除可能"
      ON comments FOR DELETE
      TO public
      USING ((auth.uid() IN ( SELECT todos.user_id
        FROM todos
        WHERE (todos.id = comments.todo_id))) OR (auth.uid() = user_id));
  END IF;
END $$;