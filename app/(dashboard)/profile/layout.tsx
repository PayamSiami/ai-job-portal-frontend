import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پروفایل کاربری | جاب مچ',
  description: 'مدیریت اطلاعات پروفایل، مهارت‌ها، سابقه کاری و تحصیلات در جاب مچ',
  robots: { index: false, follow: false },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}