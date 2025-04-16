'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Entry {
  date: string;
  content: string;
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const router = useRouter();

  // 오늘 날짜 구하기
  const getToday = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const handleNewEntry = () => {
    const today = getToday();
    const key = `diary-${today}`;

    if (localStorage.getItem(key)) {
      // 이미 있으면 해당 날짜로 이동
      alert('오늘 일기는 이미 작성했어요! 😄');
    } else {
      // 없으면 새로 작성
      router.push('/');
    }
  };

  useEffect(() => {
    const diaryEntries: Entry[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('diary-')) {
        const content = localStorage.getItem(key) || '';
        const date = key.replace('diary-', '');
        diaryEntries.push({ date, content });
      }
    }

    diaryEntries.sort((a, b) => b.date.localeCompare(a.date));
    setEntries(diaryEntries);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">📚 내 일기 목록</h1>
          <button
            onClick={handleNewEntry}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + 새 일기 쓰기
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-gray-500">작성된 일기가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.date}>
                <div
                  onClick={() => router.push(`/entries/${entry.date}`)}
                  className="border p-3 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <p className="font-semibold">{entry.date}</p>
                  <p className="text-sm text-gray-500 truncate">{entry.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
