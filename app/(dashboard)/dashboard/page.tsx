import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'داشبورد کاربر | جاب‌آی',
  description: 'مدیریت درخواست‌های شغلی، پیگیری مصاحبه‌ها و مشاهده آمار استخدامی شما در جاب‌آی',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}