import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppShell } from '@/components/layout/AppShell';
import { NotificationPanel } from '@/components/layout/NotificationPanel';
import { PanelProvider } from '@/components/layout/PanelContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <PanelProvider>
        <AppShell rail={<NotificationPanel />}>{children}</AppShell>
      </PanelProvider>
    </AuthGuard>
  );
}
