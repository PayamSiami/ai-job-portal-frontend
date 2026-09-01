import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';
import MainLayout from './(main)/layout';
import { config } from '@/lib/config';

// Local Persian & English font
const vazirmatn = localFont({
  src: './fonts/Vazirmatn-VariableFont_wght.ttf',
  variable: '--font-vazirmatn',
  display: 'swap',
});

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: {
    default: 'جاب مچ - پلتفرم استخدام با هوش مصنوعی',
    template: `%s | جاب مچ`,
  },
  description:
    'جاب مچ (JobMatch) — پلتفرم هوشمند استخدام در ایران و دورکاری. هزاران شغل فیل‌موو، تمام‌وقت، پاره‌وقت، کارآموزی و قراردادی از شرکت‌های برتر با جستجوی هوش مصنوعی AI.',
  keywords:
    'شغل, استخدام, کاریابی, هوش مصنوعی, AI, فرصت شغلی, استخدام آنلاین, شغل دورکاری, شغل حضوری, شغل ترکیبی, فرصت‌های شغلی ایران, کاریابی آنلاین, پلتفرم استخدام',
  authors: [{ name: 'تیم جاب مچ', url: baseUrl }],
  publisher: 'جاب مچ',
  creator: 'جاب مچ',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: 'جاب مچ - پلتفرم استخدام با هوش مصنوعی',
    description:
      'جاب مچ (JobMatch) — پلتفرم هوشمند استخدام در ایران و دورکاری. هزاران شغل فیل‌موو، تمام‌وقت، پاره‌وقت، کارآموزی و قراردادی از شرکت‌های برتر با جستجوی هوش مصنوعی AI.',
    type: 'website',
    url: baseUrl,
    siteName: 'جاب مچ | JobMatch',
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
    images: [
      {
        url: `${baseUrl}/logo.svg`,
        width: 512,
        height: 512,
        alt: 'جاب مچ - لوگو پلتفرم استخدام با هوش مصنوعی',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جاب مچ - پلتفرم استخدام با هوش مصنوعی',
    description:
      'جاب مچ (JobMatch) — پلتفرم هوشمند استخدام در ایران و دورکاری با جستجوی هوش مصنوعی AI.',
    images: [`${baseUrl}/logo.svg`],
  },
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': 160,
    },
  },
  verification: {
    google: process.env['NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION'] || undefined,
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
    shortcut: '/favicon-32.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  category: 'business',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
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
      <head>
        {/*
          Inline theme-detection script.
          Runs synchronously in <head> — BEFORE the stylesheet renders — so the
          first paint already reflects the user's saved theme (or OS preference)
          instead of flashing the light-defaults and flipping on hydration.
          This eliminates FOUC and reduces the render-blocking/LCP impact.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=localStorage.getItem("theme");var t=e==="dark"||(e==="system"||!e)&&window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",t);r.style.colorScheme=t?"dark":"light"}catch(e){}})();`,
          }}
        />
        <link rel="preload" as="image" href="/logo.svg" type="image/svg+xml" fetchPriority="high" />
        {/* Preconnect to API gateway for faster company logo image loading */}
        <link
          rel="preconnect"
          href={config.NEXT_PUBLIC_API_GATEWAY_URL || ''}
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href={config.NEXT_PUBLIC_API_GATEWAY_URL || ''}
        />
      </head>
      <body className="font-vazirmatn antialiased">
        {/*
          The body/html transitions below can cause an unwanted background-color
          fade during the (now fast) theme switch. Removed to avoid extra paint
          composits and a potential flash on first load.
        */}
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}