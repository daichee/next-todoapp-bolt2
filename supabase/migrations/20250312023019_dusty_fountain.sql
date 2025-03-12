/*
  # 初期テーブル作成

  1. 新規テーブル
    - `todos`: タスク管理用テーブル
      - `id`: UUID (主キー)
      - `user_id`: ユーザーID (認証用)
      - `title`: タスクのタイトル
      - `description`: タスクの詳細説明
      - `completed`: 完了状態
      - `priority`: 優先度 (low/medium/high)
      - `created_at`: 作成日時
      - `updated_at`: 更新日時
      - `due_date`: 期限日

    - `profiles`: ユーザープロフィール用テーブル
      - `id`: UUID (主キー)
      - `email`: メールアドレス
      - `name`: 表示名
      - `avatar_url`: アバター画像URL
      - `created_at`: 作成日時

  2. セキュリティ
    - 両テーブルでRLSを有効化
    - ユーザーごとのデータアクセス制御を実装
*/

-- todosテーブルの作成
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ,
  CONSTRAINT priority_check CHECK (priority IN ('low', 'medium', 'high'))
);

-- profilesテーブルの作成
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLSの有効化
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- todosテーブルのポリシー設定
CREATE POLICY "Users can create their own todos"
  ON todos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own todos"
  ON todos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON todos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON todos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- profilesテーブルのポリシー設定
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);