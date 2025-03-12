# Todo App

このプロジェクトは、Next.js (app router) とSupabaseを活用したモダンなTodoアプリケーションです。基本的なタスク管理から高度な機能まで実装しています。

## 📋 プロジェクト概要

Next.js (app router) をフロントエンド、Supabaseをバックエンドとして、フル機能を備えたTodoアプリケーションを構築します。効率的な開発と優れたユーザー体験を提供するための設計になっています。

### 🎯 目標

- 使いやすく直感的なTodo管理インターフェース
- リアルタイムデータ同期による複数デバイス間の一貫性
- ユーザー認証と個人データ保護の実装
- ダッシュボードによる効率的なタスク管理

## ✅ 実装状況

### 実装済み機能

- **ダッシュボード**: 統計情報、タスク概要、今後のタスクを表示
- **Todoリスト表示**: フィルタリング、ソート、検索機能を備えたTodo一覧
- **Todoフォーム**: 新規作成と編集機能を備えたモーダルフォーム
- **プロフィール管理**: ユーザー情報の表示と編集（ダッシュボード内のプロフィールページ）
- **タグ管理**: Todoに対するタグ付けと管理機能
- **詳細フィルター**: 期限や優先度によるフィルタリング
- **統計情報**: タスク完了率や優先度別の統計情報
- **UI/UXの改善**: ダークモード対応、レスポンシブデザイン
- **コメント機能**: タスクに対するコメント追加と管理

### 最近の実装機能

- **統計情報ダッシュボード**: タスクの完了率や優先度別の集計を表示
- **優先度フィルター**: 高・中・低優先度でのタスクフィルタリング
- **期限フィルター**: 今日・明日・今週・期限切れなどでのフィルタリング
- **タブナビゲーション**: すべてのタスク、今日のタスク、重要なタスク、タグ管理などのビューを簡単に切り替え
- **コメント機能**: Todoに対するコメントの追加・表示・削除
- **プロフィールページ**: ダッシュボード内でのプロフィール情報編集機能

### 実装予定機能

- **詳細分析**: さらに詳しいタスク統計や完了率などの分析機能
- **カレンダー表示**: タスクの期限をカレンダー形式で表示
- **データ同期**: リアルタイムデータベース更新と同期

## 🚀 使い方

1. **認証**:
   - メールアドレスとパスワードを使用して登録・ログインできます
   - 新規登録時は確認メールが送信されます

2. **ダッシュボード**: アプリケーションにログイン後、ダッシュボードが表示されます
   - 統計情報: 全体の進捗、未完了タスク数、優先度高タスク、期限切れタスクが一目でわかる
   - タブ: 異なるビューを切り替え可能

3. **タスク管理**:
   - 新規タスク追加: 右上の「+新しいタスク」ボタンから作成
   - タスク編集: 各タスクの編集アイコンをクリック
   - タスク完了: チェックボックスをクリック
   - タスク削除: 各タスクの削除アイコンをクリック

4. **検索とフィルタリング**:
   - 検索: 検索バーにキーワードを入力
   - フィルター: ステータス、優先度、期限日でフィルタリング
   - タグ: タグをクリックして関連タスクを表示

5. **設定**:
   - プロフィール更新: 名前やアバターの変更（`/dashboard/profile`ページまたは設定ページ）
   - タグ管理: タグの作成、編集、削除

6. **コメント機能**:
   - タスク詳細モーダルのコメントタブからコメントを表示
   - 新規コメントの追加
   - 自分のコメントの削除

## 🧩 機能仕様

機能は基本（レベル1）と高度（レベル2）に分けて実装します。

### レベル1（基本機能）

#### Todo一覧表示
- 登録済みのTodoをリスト形式で表示 
- 各Todoには、テキスト内容、作成日時、完了状態（チェックボックス）を表示 
- 完了済みのTodoは視覚的に区別（テキストに打ち消し線など） 

#### Todoの追加
- テキスト入力フィールドとボタンを配置 
- 入力後「追加」ボタンクリックまたはEnterキーでTodoを追加 
- 空の入力は追加できないよう制御（バリデーション） 

#### Todoの削除
- 各Todo項目に削除ボタンを配置 
- クリック時に確認ダイアログを表示 
- 削除後はリアルタイムで一覧から消去 

#### Todoの編集
- 各Todo項目を編集ボタンクリックで編集モード切替 
- モーダルフォームで既存のテキストを編集可能 
- 保存ボタンで保存、キャンセルボタンでキャンセル 

#### 状態フィルター
- プルダウンでTodo表示を切り替え 
  - 「すべて」：全てのTodo
  - 「未完了」：チェックがついていないTodo
  - 「完了済み」：チェック済みのTodo

### レベル2（高度な機能）

#### ソート機能
- 以下の条件でTodoを並び替え 
  - 作成日時順（新しい順/古い順）
  - アルファベット順／五十音順（昇順/降順）
  - 完了状態（完了済みを上/下）
  - 優先度順（高/中/低）
  - 期限順（近い順/遠い順）

#### 詳細フィルター
- 期限によるフィルタリング 
  - 今日期限のタスク
  - 明日期限のタスク
  - 今週期限のタスク
  - 期限切れのタスク
- 優先度によるフィルタリング 
  - 高優先度
  - 中優先度
  - 低優先度
- タグ/カテゴリーによるフィルタリング 

#### 検索機能
- テキスト検索ボックスを実装 
- タイトルと説明のテキスト内容をインクリメンタル検索 
- 検索結果をハイライト表示（オプション）

#### タグ機能
- 各Todoにタグを追加・表示する機能
- タグの追加/編集/削除
- タグによる絞り込み検索

## 📊 データモデル

以下は現在のSupabaseデータベースの構造です：

### `todos` テーブル
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ
);
```

### `comments` テーブル
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `profiles` テーブル
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `tags` テーブル
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `todo_tags` テーブル（接合テーブル）
```sql
CREATE TABLE todo_tags (
  todo_id UUID REFERENCES todos(id),
  tag_id UUID REFERENCES tags(id),
  PRIMARY KEY (todo_id, tag_id)
);
```

### `todo_with_tags` ビュー
タスクとそれに関連するタグ情報を結合したビューです。タグ名や色などの情報が配列として含まれています。

### TypeScriptインターフェース

#### Todoモデル
```typescript
interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  due_date?: string;
}
```

#### TodoWithTagsモデル（ビューから取得）
```typescript
interface TodoWithTags extends Todo {
  tags?: string[];    // タグ名の配列
  tag_ids?: string[]; // タグIDの配列
  tag_colors?: string[]; // タグカラーの配列
}
```

#### コメントモデル
```typescript
interface Comment {
  id: string;
  todo_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
```

#### ユーザーモデル
```typescript
interface Profile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}
```

#### タグモデル
```typescript
interface Tag {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  created_at: string;
}
```

## 🛠 テクノロジー

### フロントエンド
- **Next.js** (v15.2.1) - Reactフレームワーク（app router使用）
- **React** (v19.0.0) - UIライブラリ
- **TypeScript** (v5+) - 静的型付け
- **Tailwind CSS** (v4.0.12) - スタイリング

### バックエンド
- **Supabase** (v2.49.1) - BaaS（Backend as a Service）
  - **データベース**: PostgreSQL
  - **認証**: JWT認証
  - **ストレージ**: ファイルアップロード（アバター画像など）
  - **リアルタイム**: WebSocketを使用したリアルタイム更新

### 開発ツール
- **ESLint** (v9) - コード品質管理
- **Prettier** - コードフォーマッター
- **TypeScript** (v5) - 型チェック

## 🗂 プロジェクト構造

```
/next_supabase
├── public/           # 静的アセット
├── src/
│   ├── app/          # Next.js app router
│   │   ├── auth/       # 認証関連ページ
│   │   ├── dashboard/  # ダッシュボードページ
│   │   │   └── profile/  # プロフィールページ（新規追加）
│   │   ├── profile/    # プロフィールページ（ダッシュボード外）
│   │   ├── tags/       # タグ管理ページ
│   │   ├── todos/      # Todo一覧ページ
│   │   ├── settings/   # 設定ページ
│   │   ├── layout.tsx  # アプリケーションレイアウト
│   │   └── page.tsx    # ホームページ
│   ├── components/   # Reactコンポーネント
│   │   ├── auth/     # 認証関連コンポーネント
│   │   ├── comment/  # コメント関連コンポーネント
│   │   ├── dashboard/ # ダッシュボードコンポーネント（新規追加）
│   │   │   ├── DashboardHeader.tsx  # ダッシュボードヘッダー
│   │   │   ├── DashboardShell.tsx   # ダッシュボードシェル
│   │   │   └── DashboardStats.tsx   # ダッシュボード統計
│   │   ├── layout/   # レイアウトコンポーネント
│   │   ├── todo/     # Todoコンポーネント
│   │   │   ├── TodoAdvancedFilter.tsx  # 詳細フィルター
│   │   │   ├── TodoDetail.tsx          # Todo詳細表示
│   │   │   ├── TodoEditForm.tsx        # 編集フォーム
│   │   │   ├── TodoFilter.tsx          # フィルター
│   │   │   ├── TodoForm.tsx            # 追加フォーム
│   │   │   ├── TodoItem.tsx            # リストアイテム
│   │   │   ├── TodoList.tsx            # リスト表示
│   │   │   ├── TodoSearch.tsx          # 検索機能
│   │   │   ├── TodoSort.tsx            # ソート機能
│   │   │   ├── TodoTags.tsx            # タグ管理
│   │   │   └── TodoComments.tsx        # コメント機能（新規追加）
│   │   ├── ui/       # 共通UIコンポーネント
│   │   └── icons.tsx # アイコンコンポーネント（新規追加）
│   ├── contexts/     # コンテキスト（状態管理）
│   ├── hooks/        # カスタムReactフック
│   ├── lib/          # ユーティリティと外部サービス
│   │   ├── supabase/ # Supabase関連
│   │   │   ├── auth.ts      # 認証機能
│   │   │   ├── client.ts    # Supabaseクライアント
│   │   │   ├── comments.ts  # コメント操作
│   │   │   ├── tags.ts      # タグ操作
│   │   │   └── todos.ts     # Todo操作
│   ├── store/        # グローバル状態管理
│   └── types/        # TypeScript型定義
├── .eslintrc.js      # ESLint設定
├── next.config.js    # Next.js設定
├── package.json      # 依存関係とスクリプト
├── postcss.config.js # PostCSS設定
├── tailwind.config.js # Tailwind CSS設定
└── tsconfig.json     # TypeScript設定
```


## 🚢 デプロイ

VercelやNetlifyなどのプラットフォームにデプロイできます。Vercelを使用する場合は以下の手順に従ってください：

1. [Vercel](https://vercel.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成し、GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイを実行

## 📝 ライセンス

MITライセンス