'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Send, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Database } from '@/types/supabase';

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profile?: {
    name: string | null;
    avatar_url: string | null;
  };
};

interface TodoCommentsProps {
  todoId: string;
}

export default function TodoComments({ todoId }: TodoCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `todo_id=eq.${todoId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [todoId]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profile:profiles(
          name,
          avatar_url
        )
      `)
      .eq('todo_id', todoId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    setComments(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            todo_id: todoId,
            content: newComment.trim(),
          },
        ]);

      if (error) throw error;
      setNewComment('');
      toast.success('コメントを追加しました');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('コメントの追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      toast.success('コメントを削除しました');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('コメントの削除に失敗しました');
    }
  }

  async function handleUpdate(commentId: string) {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editContent.trim() })
        .eq('id', commentId);

      if (error) throw error;
      setEditingComment(null);
      setEditContent('');
      toast.success('コメントを更新しました');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('コメントの更新に失敗しました');
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2 text-gray-600">
        <MessageSquare className="w-5 h-5" />
        <h3 className="font-medium">コメント</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="コメントを追加..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>送信</span>
        </button>
      </form>

      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
            {editingComment === comment.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => handleUpdate(comment.id)}
                  className="p-2 text-green-600 hover:text-green-700"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingComment(null)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-gray-900">
                      {comment.profile?.name || 'ユーザー'}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingComment(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-gray-700">{comment.content}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}