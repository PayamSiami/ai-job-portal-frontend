import type { Metadata } from 'next';
import { config } from '@/lib/config';
import DashboardClient from './DashboardClient';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'داشبورد کاربر | جاب مچ',
  description: 'مدیریت درخواست‌های شغلی، پیگیری مصاحبه‌ها و مشاهده آمار استخدامی شما در جاب مچ',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.userDashboard(baseUrl)} />
      <DashboardClient />
    </>
  );
}