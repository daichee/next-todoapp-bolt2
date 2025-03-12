import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { LogOut, UserCircle, Tag as TagIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

async function getProfile(userId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data } = await supabase
    .from('profiles')
    .select('name, avatar_url')
    .eq('id', userId)
    .single();
  
  return data;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { session } } = await supabase.auth.getSession();
  const profile = session ? await getProfile(session.user.id) : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-gray-900 hover:text-gray-600"
              >
                Todo App
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-gray-700 hover:text-gray-900 rounded-md"
                >
                  タスク一覧
                </Link>
                <Link
                  href="/dashboard/tags"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 rounded-md"
                >
                  <TagIcon className="w-5 h-5" />
                  <span>タグ管理</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 rounded-md"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <UserCircle className="w-8 h-8" />
                )}
                <span>{profile?.name || 'プロフィール'}</span>
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                  <span>ログアウト</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}