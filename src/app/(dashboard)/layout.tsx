import { AuthGuard } from '@/components/AuthGuard';
import type { LayoutProps } from '@/types/next';

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            LMApp
          </h1>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}