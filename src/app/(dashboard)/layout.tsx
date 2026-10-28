import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';
import { NotificationPanel } from '@/components/layout/NotificationPanel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell rail={<NotificationPanel />}>{children}</AppShell>
    </AuthGuard>
  );
}
