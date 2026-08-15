import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';
import MainLayout from './(main)/layout';

// Local Persian & English font
const vazirmatn = localFont({
  src: './fonts/Vazirmatn-VariableFont_wght.ttf',
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'جاب مچ - پلتفرم استخدام با هوش مصنوعی',
  description: 'شغل رویایی خود را با جستجو و تطابق مبتنی بر هوش مصنوعی پیدا کنید',
  keywords: 'شغل, کاریابی, هوش مصنوعی, استخدام, کار',
  authors: [{ name: 'تیم جاب مچ' }],
  openGraph: {
    title: 'جاب مچ - پلتفرم استخدام با هوش مصنوعی',
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
      className={vazirmatn.variable}
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