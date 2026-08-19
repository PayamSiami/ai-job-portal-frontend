import type { Metadata } from 'next';
import { config } from '@/lib/config';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'سیاست کوکی | جاب مچ',
  description:
    'سیاست کوکی جاب مچ. استفاده از کوکی‌ها برای بهبود تجربه کاربری، تحلیل ترافیک و ارائه سرویس‌های شخصی‌سازی شده.',
  keywords: 'کوکی, سیاست کوکی, کوکی‌ها, جاب مچ, استفاده از کوکی',
  openGraph: {
    title: 'سیاست کوکی | جاب مچ',
    description:
      'سیاست کوکی جاب مچ. استفاده از کوکی‌ها برای بهبود تججربه کاربری، تحلیل ترافیک و ارائه سرویس‌های شخصی‌سازی شده.',
    type: 'website',
    url: `${baseUrl}/cookies`,
  },
  alternates: { canonical: `${baseUrl}/cookies` },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'سیاست کوکی | جاب مچ',
    description:
      'سیاست کوکی جاب مچ. استفاده از کوکی‌ها برای بهبود تجربه کاربری، تحلیل ترافیک و ارائه سرویس‌های شخصی‌سازی شده.',
    datePublished: '2026-08-18',
    dateModified: '2026-08-18',
    author: {
      '@type': 'Organization',
      name: 'جاب مچ',
    },
    publisher: {
      '@type': 'Organization',
      name: 'جاب مچ',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/cookies`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="prose lg:prose-xl max-w-4xl mx-auto py-16 px-4 text-right" dir="rtl">
      <h1 className="text-4xl font-bold text-center mb-12">سیاست کوکی (کوکی‌ها)</h1>

      <p className="text-sm text-muted-foreground text-center mb-8">
        آخرین بروز رسانی: ۱۸ اوغوست ۲۰۲۶
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۱. کوکی چیست؟</h2>
        <p>
          کوکی (Cookie) فایلی متنی کوچک است که در صورت بازدید از وب‌سایت، در مرورگر شما
          ذخیره می‌شود. این فایل‌ها به سایت‌ها کمک می‌کنند تا اطلاعاتی مانند ترجیحات شما یا
          جزئیات ورود به حساب را به‌صورت خودکار به یاد بآورند.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۲. نوع‌های کوکی‌های استفاده شده</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-1">کوکی‌های الزامی (Essential)</h3>
            <p>
              برای عملکرد اساسی سایت (احراز هوو، ناوبری، دسترسی به صفحات) ضروری‌اند و
              قابل غیرفعال‌سازی نیستند.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">کوکی‌های عملکردی (Functional)</h3>
            <p>
              ترجیحات شما (زبان، حالت نمایش، مناطق جغرافیایی) را ذخیره می‌کنند تا
              تجربه کاربری بهتر ارائه شود.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">کوکی‌های تحلیلی (Analytics)</h3>
            <p>
              نحوه استفاده بازدیدکنندگان از سایت را تحلیل می‌کنند تا صفحات بهبود یابند.
              شامل Google Analytics یا سرویس‌های مشابه.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">کوکی‌های تبلیغاتی (Advertising)</h3>
            <p>
              برای ارائه آگهی‌های شخصی‌سازی شده بر اساس علایق شما. این کوکی‌ها توسط
              شبکه‌های تبلیغاتی شخص ثالث قرار داده می‌شوند.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۳. نحوه مدیریت کوکی‌ها</h2>
        <p>
          شما می‌توانید در هر زمان کوکی‌ها را مشاهده، فعال یا غیرفعال کنید. اکثر مرورگرها
          امکان مدیریت کوکی‌ها را در بخش تنظیمات حریم خصوصی فراهم می‌کنند. همچنین می‌توانید
          از لینک‌های زیر استفاده کنید:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            <a
              href="https://www.google.com/policies/technologies/types/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
            مدیریت کوکی‌های گوگل
          </a>
          </li>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
            مدیریت کوکی‌ها در مرورگر خود
          </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۴. بروزرسانی‌های این سیاست</h2>
        <p>
          ممکن است این سیاست کوکی‌ها بروزرسانی شود. در صورت تغییر، تاریخ آخرین بروزرسانی در
          بالا بروز خواهد شد و در صورت لزوم، اطلاع‌رسانی انجام خواهد شد.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۵. تماس با ما</h2>
        <p>
          سؤال یا درخواست خود را در رابطه با کوکی‌ها از طریق زیر ارسال کنید:
          <br />
          ایمیل: <a href="mailto:cookies@jobmatch.ir" className="text-blue-600">cookies@jobmatch.ir</a>
        </p>
      </section>

      <div className="mt-12 p-6 bg-muted/30 rounded-xl text-sm">
        <p>
          با استفاده از سرویس جاب مچ، شما موافقت می‌کنید که کوکی‌های لازم و مجاز تنظیمات شما
          بر اساس این سیاست فعال شوند.
        </p>
      </div>
      </article>
    </>
  );
}
