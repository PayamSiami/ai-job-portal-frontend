import type { Metadata } from 'next';
import { config } from '@/lib/config';
import EmployerClient from './EmployerClient';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
    title: 'داشبورد کارفرما | جاب‌آی',
    description: 'مدیریت آگهی‌های استخدام، بررسی درخواست‌ها و پایش آمار استخدام با هوش مصنوعی',
    robots: {
        index: false,
        follow: false,
    },
};

export default function EmployerDashboardPage() {
    return (
        <>
            <BreadcrumbStructuredData items={generateBreadcrumbs.employerDashboard(baseUrl)} />
            <EmployerClient />
        </>
    )
}