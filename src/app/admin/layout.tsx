"use client";

import { getMainNavigation } from '@/src/lib/navigation';
import MainLayout from '@/components/layout/MainLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout navigation={getMainNavigation('admin')} section="admin">
            {children}
        </MainLayout>
    );
}
