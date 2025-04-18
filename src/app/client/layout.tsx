import { getMainNavigation } from '@/src/lib/navigation';
import MainLayout from '@/components/layout/MainLayout';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout navigation={getMainNavigation('client')} section="client">
      {children}
    </MainLayout>
  );
} 