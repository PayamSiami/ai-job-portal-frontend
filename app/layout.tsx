import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import MainLayout from './(main)/layout';

// Persian font as primary
const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-vazirmatn',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

// English font as fallback
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'جاب‌آی - پلتفرم استخدام با هوش مصنوعی',
  description: 'شغل رویایی خود را با جستجو و تطابق مبتنی بر هوش مصنوعی پیدا کنید',
  keywords: 'شغل, کاریابی, هوش مصنوعی, استخدام, کار',
  authors: [{ name: 'تیم جاب‌آی' }],
  openGraph: {
    title: 'جاب‌آی - پلتفرم استخدام با هوش مصنوعی',
    description: 'شغل رویایی خود را با جستجو و تطابق مبتنی بر هوش مصنوعی پیدا کنید',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="fa" 
      dir="rtl"
      suppressHydrationWarning
      className={`${vazirmatn.variable} ${inter.variable}`}
    >
      <body className="font-vazirmatn antialiased">
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}