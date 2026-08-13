'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function EkipDetayPage() {
  const params = useParams();
  const ekipId = params?.id as string;

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        &larr; Ekiplere Dön
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Ekip #{ekipId}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Ekip detayları, durum ve yorumlar yakında burada görünecek.
      </p>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-400 dark:text-zinc-500">
          🔧 Yapım aşamasında
        </p>
      </div>
    </div>
  );
}