import type { Metadata } from 'next';
import { config } from '@/lib/config';
import SettingsClient from './SettingsClient';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'تنظیمات حساب کاربری | جاب مچ',
  description: 'مدیریت پروفایل، امنیت، اعلان‌ها و تنظیمات حساب کاربری در جاب مچ',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return (
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.settings(baseUrl)} />
      <SettingsClient />
    </>
  );
}