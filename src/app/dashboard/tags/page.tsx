'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Database } from '@/types/supabase';

type Tag = Database['public']['Tables']['tags']['Row'];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchTags();

    const channel = supabase
      .channel('tags')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tags',
        },
        () => {
          fetchTags();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching tags:', error);
      return;
    }

    setTags(data || []);
  }

  async function handleCreate() {
    if (!newTagName.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tags')
        .insert([
          {
            name: newTagName.trim(),
            color: newTagColor,
          },
        ]);

      if (error) throw error;
      setNewTagName('');
      setNewTagColor('#3b82f6');
      setIsCreating(false);
      toast.success('タグを作成しました');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('タグの作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate(tag: Tag) {
    if (!newTagName.trim()) return;

    try {
      const { error } = await supabase
        .from('tags')
        .update({
          name: newTagName.trim(),
          color: newTagColor,
        })
        .eq('id', tag.id);

      if (error) throw error;
      setEditingTag(null);
      setNewTagName('');
      setNewTagColor('#3b82f6');
      toast.success('タグを更新しました');
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('タグの更新に失敗しました');
    }
  }

  async function handleDelete(tagId: string) {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
      toast.success('タグを削除しました');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('タグの削除に失敗しました');
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">タグ管理</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-5 h-5" />
          <span>新しいタグ</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="タグ名"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-12 h-10 rounded-md border-gray-300 shadow-sm cursor-pointer"
            />
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>作成</span>
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {tags.map(tag => (
            <div key={tag.id} className="p-4">
              {editingTag === tag.id ? (
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    autoFocus
                  />
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-12 h-10 rounded-md border-gray-300 shadow-sm cursor-pointer"
                  />
                  <button
                    onClick={() => handleUpdate(tag)}
                    className="p-2 text-green-600 hover:text-green-700"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingTag(null)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-gray-900">{tag.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingTag(tag.id);
                        setNewTagName(tag.name);
                        setNewTagColor(tag.color || '#3b82f6');
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {tags.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              タグがありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}