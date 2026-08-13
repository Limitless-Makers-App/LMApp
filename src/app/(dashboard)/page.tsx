'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardHomePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Ekipler</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Hoş geldin, {user?.displayName || user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-zinc-300 px-4 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500 dark:text-zinc-400">
          Henüz hiç ekip bulunmuyor.
        </p>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          Firestore servisleri eklendiğinde ekipler burada listelenecek.
        </p>
      </div>
    </div>
  );
}