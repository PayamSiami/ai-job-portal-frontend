import type { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'پروفایل کاربری | جاب‌آی',
  description: 'مدیریت اطلاعات پروفایل، مهارت‌ها، سابقه کاری و تحصیلات در جاب‌آی',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}