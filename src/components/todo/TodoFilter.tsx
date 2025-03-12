'use client';

import { Search } from 'lucide-react';
import TagSelect from '@/components/TagSelect';

interface TodoFilterProps {
  filters: {
    status: string;
    priority: string;
    search: string;
    tags: string[];
  };
  onFiltersChange: (filters: {
    status: string;
    priority: string;
    search: string;
    tags: string[];
  }) => void;
}

export function TodoFilter({ filters, onFiltersChange }: TodoFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="タスクを検索..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">すべてのステータス</option>
          <option value="active">未完了</option>
          <option value="completed">完了済み</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">すべての優先度</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タグでフィルター
        </label>
        <TagSelect
          selectedTags={filters.tags}
          onTagsChange={(tags) => onFiltersChange({ ...filters, tags })}
        />
      </div>
    </div>
  );
}