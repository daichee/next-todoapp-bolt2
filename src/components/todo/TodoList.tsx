'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TodoItem } from './TodoItem';
import { TodoFilter } from './TodoFilter';
import type { Database } from '@/types/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];
type TodoWithTags = Todo & {
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
};

interface TodoListProps {
  initialTodos: TodoWithTags[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    tags: [] as string[],
  });
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
        },
        () => {
          refreshTodos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function refreshTodos() {
    const { data } = await supabase
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

    if (data) {
      const todosWithTags = data.map(todo => ({
        ...todo,
        tags: todo.tags?.map(({ tag }) => tag).filter(Boolean),
      }));
      setTodos(todosWithTags);
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filters.status !== 'all') {
      if (filters.status === 'completed' && !todo.completed) return false;
      if (filters.status === 'active' && todo.completed) return false;
    }

    if (filters.priority !== 'all' && todo.priority !== filters.priority) {
      return false;
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!todo.title.toLowerCase().includes(search) &&
          !todo.description?.toLowerCase().includes(search)) {
        return false;
      }
    }

    if (filters.tags.length > 0) {
      if (!todo.tags?.some(tag => filters.tags.includes(tag.id))) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4">
      <TodoFilter
        filters={filters}
        onFiltersChange={setFilters}
      />
      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={refreshTodos}
          />
        ))}
      </div>
    </div>
  );
}