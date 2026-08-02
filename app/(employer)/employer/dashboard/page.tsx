import type { Metadata } from 'next';

import EmployerClient from './EmployerClient';

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
        <EmployerClient />
    )
}