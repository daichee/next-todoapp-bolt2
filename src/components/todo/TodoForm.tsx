'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PlusCircle } from 'lucide-react';
import TagSelect from '@/components/TagSelect';
import toast from 'react-hot-toast';

export default function TodoForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const { data: todo, error: todoError } = await supabase
        .from('todos')
        .insert([
          {
            title: title.trim(),
            description: description.trim() || null,
            priority,
            due_date: dueDate || null,
          },
        ])
        .select()
        .single();

      if (todoError || !todo) {
        throw todoError;
      }

      if (selectedTags.length > 0) {
        const { error: tagError } = await supabase
          .from('todo_tags')
          .insert(
            selectedTags.map(tagId => ({
              todo_id: todo.id,
              tag_id: tagId,
            }))
          );

        if (tagError) {
          throw tagError;
        }
      }

      setIsOpen(false);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setSelectedTags([]);
      toast.success('タスクを追加しました');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('タスクの追加に失敗しました');
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-5 h-5" />
        <span>新しいタスクを追加</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">新しいタスク</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  タイトル
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  説明
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  優先度
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                  期限日
                </label>
                <input
                  id="due_date"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグ
                </label>
                <TagSelect
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}