'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar, MessageSquare, Tag as TagIcon, Trash2, Edit2 } from 'lucide-react';
import TodoComments from './TodoComments';
import type { Database } from '@/types/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];
type TodoWithTags = Todo & {
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
};

interface TodoItemProps {
  todo: TodoWithTags;
  onUpdate: () => void;
}

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [showComments, setShowComments] = useState(false);
  const supabase = createClient();

  async function handleToggleComplete() {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id);

    if (error) {
      console.error('Error updating todo:', error);
      return;
    }

    onUpdate();
  }

  async function handleDelete() {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id);

    if (error) {
      console.error('Error deleting todo:', error);
      return;
    }

    onUpdate();
  }

  async function handleUpdate() {
    if (!editedTitle.trim()) return;

    const { error } = await supabase
      .from('todos')
      .update({ title: editedTitle })
      .eq('id', todo.id);

    if (error) {
      console.error('Error updating todo:', error);
      return;
    }

    setIsEditing(false);
    onUpdate();
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="h-5 w-5 rounded border-gray-300"
          />
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdate();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <span
              className={`text-lg ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority as keyof typeof priorityColors]}`}>
            {todo.priority}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {todo.description && (
        <p className="text-gray-600 text-sm mt-2">{todo.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {todo.due_date && (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>期限: {new Date(todo.due_date).toLocaleString()}</span>
          </div>
        )}
        {todo.tags && todo.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <TagIcon className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {todo.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">コメント</span>
        </button>
      </div>
      {showComments && (
        <TodoComments todoId={todo.id} />
      )}
    </div>
  );
}