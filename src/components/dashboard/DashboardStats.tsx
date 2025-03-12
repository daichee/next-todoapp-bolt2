'use client';

import { useMemo } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart2,
  ArrowUp,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';
import type { Database } from '@/types/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];
type TodoWithTags = Todo & {
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
};

interface DashboardStatsProps {
  todos: TodoWithTags[];
}

export default function DashboardStats({ todos }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const overdue = todos.filter(todo => {
      if (!todo.due_date || todo.completed) return false;
      return new Date(todo.due_date) < today;
    }).length;

    const priorityCount = {
      high: todos.filter(todo => todo.priority === 'high' && !todo.completed).length,
      medium: todos.filter(todo => todo.priority === 'medium' && !todo.completed).length,
      low: todos.filter(todo => todo.priority === 'low' && !todo.completed).length,
    };

    const dueToday = todos.filter(todo => {
      if (!todo.due_date || todo.completed) return false;
      const dueDate = new Date(todo.due_date);
      return (
        dueDate >= today &&
        dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      );
    }).length;

    return {
      total,
      completed,
      completionRate,
      overdue,
      priorityCount,
      dueToday,
    };
  }, [todos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">完了率</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.completionRate}%
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          {stats.completed} / {stats.total} タスク完了
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">今日が期限</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.dueToday}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          今日が期限のタスク
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">期限切れ</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.overdue}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          期限切れのタスク
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">優先度別</p>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">
                  高: {stats.priorityCount.high}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">
                  中: {stats.priorityCount.medium}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  低: {stats.priorityCount.low}
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <BarChart2 className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}