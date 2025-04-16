'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;

  const [content, setContent] = useState('');
  const [original, setOriginal] = useState('');
  const [editing, setEditing] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // 일기 로딩
  useEffect(() => {
    const data = localStorage.getItem(`diary-${date}`);
    if (data) {
      setContent(data);
      setOriginal(data);
    } else {
      setNotFound(true);
    }
  }, [date]);

  const handleSave = () => {
    localStorage.setItem(`diary-${date}`, content);
    setOriginal(content);
    setEditing(false);
  };

  const handleDelete = () => {
    const ok = confirm('정말 삭제하시겠습니까? 😢');
    if (ok) {
      localStorage.removeItem(`diary-${date}`);
      router.push('/entries');
    }
  };

  if (notFound) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">해당 날짜의 일기를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/entries')}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← 목록으로
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
        <button
            onClick={() => router.push('/entries')}
            className="mt-1 px-1 py-1 border rounded hover:bg-gray-100"
            >
            ← 목록으로
        </button>
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">📅 {date}</h1>
          </div>
          <div className="space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setContent(original);
                    setEditing(false);
                  }}
                  className="border px-3 py-1 rounded hover:bg-gray-100"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="border px-3 py-1 rounded hover:bg-gray-100"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-50"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full border rounded-lg p-3 resize-none"
          />
        ) : (
          <p className="whitespace-pre-wrap text-gray-800">{content}</p>
        )}
      </div>
    </main>
  );
}
