import { AuthGuard } from '@/components/AuthGuard';
import { NotificationPanel } from '@/components/home/NotificationPanel';
import { AppShell } from '@/components/layout/AppShell';
import type { LayoutProps } from '@/types/next';

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <AuthGuard>
      <AppShell rail={<NotificationPanel />}>{children}</AppShell>
    </AuthGuard>
  );
}
