import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';
import MainLayout from './(main)/layout';

// Persian font as primary
const vazirmatn = localFont({
  src: './fonts/Vazirmatn-VariableFont_wght.ttf',
  variable: '--font-vazirmatn',
  display: 'swap',
});

// English font local fallback (Zero network requests during build)
const inter = localFont({
  src: './fonts/Inter-VariableFont_slnt,wght.ttf', // Place file in app/fonts/
  variable: '--font-inter',
  display: 'swap',
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