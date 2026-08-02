import type { Metadata } from 'next';
import SettingsClient from './SettingsClient';

export const metadata: Metadata = {
  title: 'تنظیمات حساب کاربری | جاب‌آی',
  description: 'مدیریت پروفایل، امنیت، اعلان‌ها و تنظیمات حساب کاربری در جاب‌آی',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return <SettingsClient />;
}