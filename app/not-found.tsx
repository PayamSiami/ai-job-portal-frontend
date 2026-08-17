// app/not-found.tsx
import { NotFoundPage } from '@/components/ui/NotFoundPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'صفحه‌ای که به دنبال آن هستید پیدا نشد | جاب مچ',
    description: 'متأسفیم، صفحه‌ای که درخواست کرده‌اید وجود ندارد یا به مکان دیگری منتقل شده است.',
};

export default function NotFound() {
    return <NotFoundPage />;
}
