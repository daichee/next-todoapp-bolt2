import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>読み込み中...</span>
      </div>
    </div>
  );
}