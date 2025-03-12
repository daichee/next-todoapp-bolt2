import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import TodoList from '@/components/todo/TodoList';
import TodoForm from '@/components/todo/TodoForm';
import DashboardStats from '@/components/dashboard/DashboardStats';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: todos } = await supabase
    .from('todos')
    .select(`
      *,
      tags:todo_tags(
        tag:tags(
          id,
          name,
          color
        )
      )
    `)
    .order('created_at', { ascending: false });

  const todosWithTags = todos?.map(todo => ({
    ...todo,
    tags: todo.tags?.map(({ tag }) => tag).filter(Boolean),
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
      </div>

      <DashboardStats todos={todosWithTags} />

      <div className="space-y-6">
        <TodoForm />
        <TodoList initialTodos={todosWithTags} />
      </div>
    </div>
  );
}