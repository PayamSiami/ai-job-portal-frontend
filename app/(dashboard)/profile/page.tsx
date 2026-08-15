import type { Metadata } from 'next';
import { config } from '@/lib/config';
import ProfileClient from './ProfileClient';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';

const baseUrl = config.NEXT_PUBLIC_APP_URL ;

export const metadata: Metadata = {
  title: 'پروفایل کاربری | جاب مچ',
  description: 'مدیریت اطلاعات پروفایل، مهارت‌ها، سابقه کاری و تحصیلات در جاب مچ',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.profile(baseUrl)} />
      <ProfileClient />
    </>
  );
}