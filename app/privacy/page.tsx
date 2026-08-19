import type { Metadata } from 'next';
import { config } from '@/lib/config';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'سیاست حریم خصوصی | جاب مچ',
  description:
    'سیاست حریم خصوصی جاب مچ. نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات شخصی شما در پلتفرم استخدام هوشمند جاب مچ.',
  keywords: 'حریم خصوصی, سیاست حریم خصوصی, جاب مچ, استخدام, حریم شخصی',
  openGraph: {
    title: 'سیاست حریم خصوصی | جاب مچ',
    description:
      'سیاست حریم خصوصی جاب مچ. نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات شخصی شما در پلتفرم استخدام هوشمند جاب مچ.',
    type: 'website',
    url: `${baseUrl}/privacy`,
  },
  alternates: { canonical: `${baseUrl}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'سیاست حریم خصوصی | جاب مچ',
    description:
      'سیاست حریم خصوصی جاب مچ. نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات شخصی شما در پلتفرم استخدام هوشمند جاب مچ.',
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
      '@id': `${baseUrl}/privacy`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="prose lg:prose-xl max-w-4xl mx-auto py-16 px-4 text-right" dir="rtl">
      <h1 className="text-4xl font-bold text-center mb-12">سیاست حریم خصوصی</h1>

      <p className="text-sm text-muted-foreground text-center mb-8">
        آخرین بروز رسانی: ۱۸ اوغوست ۲۰۲۶
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۱. مقدمه</h2>
        <p>
          جاب مچ (JobMatch) به حریم خصوصی و امنیت اطلاعات شخصی شما اهمیت ویژه‌ای می‌دهد. این سیاست
          حریم خصوصی توضیح می‌دهد که چه اطلاعاتی جمع‌آوری می‌کنیم، چگونه استفاده می‌کنیم و چه حقوقی
          برای شما قائل‌العمل می‌باشد.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۲. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>اطلاعات شخصی:</strong> نام، ایمیل، شماره تلفن، موقعیت مکانی و سایر اطلاعاتی که
            در حساب کاربری یا رزومه‌تان وارد می‌کنید.
          </li>
          <li>
            <strong>داده‌های مرتبط با استخدام:</strong> رزومه، پوشش شغلی، درخواست‌های شغلی و تعاملات
            شما با شرکت‌ها.
          </li>
          <li>
            <strong>داده‌های فنی:</strong> آدرس IP، نوع مرورگر، صفحه‌نمایش، فعالیت در سایت و لاگ‌ها
            برای بهبود عملکرد.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۳. نحوهٔ استفاده از اطلاعات</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>ارائه و شخصی‌سازی سرویس‌های استخدامی شما.</li>
          <li>بهبود و بهینه‌سازی الگوریتم‌های هوش مصنوعی جستجوی شغل.</li>
          <li>اتصال شما با کارفرمایان و ارسال درخواست‌های شغلی.</li>
          <li>ارسال اعلان‌ها و اطلاعیه‌های مرتبط با شغل (در صورت رضایت شما).</li>
          <li>جلوگیری از سوء استفادهٔ غیرمجاز و حفظ امنیت پلتفرم.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۴. به اشتراک‌گذاری با سوم‌طرفین</h2>
        <p>
          اطلاعات شما صرفاً در زیر موارد به اشتراک گذاشته می‌شود: (الف) با نقض قانون، (ب) با رضایت
          صریح شما، (ج) برای ارائه سرویس درخواستی‌تان (مانند ارسال رزومه به شرکت‌ها). ما هرگز
          اطلاعات شخصی شما را برای فروش یا تبلیغات بدون‌هدف نمی‌فروشیم.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۵. حقوق شما</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>دسترسی به اطلاعات شخصی خود.</li>
          <li>اصلاح یا بروزرسانی اطلاعات نادرست.</li>
          <li>حذف حساب کاربری و داده‌ها.</li>
          <li>درخواست برون‌بری داده‌ها.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۶. امنیت اطلاعات</h2>
        <p>
          ما از روش‌های رمزنگاری، کنترل دسترسی و نظارت مداوم برای حفاظت از داده‌های شما استفاده
          می‌کنیم. با این حال، هیچ روش‌انتقال یا ذخیره‌سازی اطلاعاتی ۱۰۰٪ امن نیست.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۷. تماس با ما</h2>
        <p>
          در صورت سؤال یا درخواست مرتبط با حریم خصوصی، با تیم ما تماس بگیرید:
          <br />
          ایمیل: <a href="mailto:privacy@jobmatch.ir" className="text-blue-600">privacy@jobmatch.ir</a>
          <br />
          تلفن: <span dir="ltr">+98 921 808 7195</span>
        </p>
      </section>

      <div className="mt-12 p-6 bg-muted/30 rounded-xl text-sm">
        <p>
          این سند صرفاً یک چارچوب کلی است و ممکن است در آینده به‌روزرسانی شود. استفاده از
          خدمات جاب مچ به معنای پذیرش این سیاست حریم خصوصی است.
        </p>
      </div>
      </article>
    </>
  );
}
