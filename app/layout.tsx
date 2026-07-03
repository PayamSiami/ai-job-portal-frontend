import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import MainLayout from './(main)/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobAI - AI-Powered Job Portal',
  description: 'Find your dream job with AI-powered search and matching',
  keywords: 'jobs, career, AI, job search, employment',
  authors: [{ name: 'JobAI Team' }],
  openGraph: {
    title: 'JobAI - AI-Powered Job Portal',
    description: 'Find your dream job with AI-powered search and matching',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <MainLayout>
          {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}