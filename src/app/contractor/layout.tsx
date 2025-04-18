import { getMainNavigation } from '@/src/lib/navigation';
import MainLayout from '@/components/layout/MainLayout';

export default function ContractorLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout navigation={getMainNavigation('contractor')} section="contractor">
      {children}
    </MainLayout>
  );
}   