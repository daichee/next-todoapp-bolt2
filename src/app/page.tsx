import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, Tag, MessageSquare } from 'lucide-react';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const headersList = headers();
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Todo App</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                アカウント作成
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                シンプルで使いやすい
                <span className="block text-blue-600">タスク管理アプリ</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                タスクの整理、期限管理、優先度設定を簡単に。
                チームでの共有やコメント機能で、効率的な協業を実現します。
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                >
                  無料で始める
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  シンプルな操作性
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  直感的なインターフェースで、すぐに使い始められます。
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  期限管理
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  タスクの期限を設定し、優先順位を明確に。
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Tag className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  タグ機能
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  カスタムタグでタスクを整理し、素早く見つけられます。
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  コメント機能
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  タスクにコメントを追加して、情報を共有。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; 2025 Todo App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}