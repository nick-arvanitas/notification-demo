import { getMainNavigation } from '../../lib/navigation/utils';
import MainLayout from '../../components/layout/MainLayout';
import { contractorNavigationBottom } from '../../lib/navigation/contractor';
export default function ContractorLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout navigation={getMainNavigation('contractor')} bottomNavigation={contractorNavigationBottom} section="contractor">
      {children}
    </MainLayout>
  );
}   