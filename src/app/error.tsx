'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          エラーが発生しました
        </h2>
        <p className="mt-2 text-gray-600">
          申し訳ありませんが、予期せぬエラーが発生しました。
        </p>
        <button
          onClick={reset}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}