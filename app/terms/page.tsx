import type { Metadata } from 'next';
import { config } from '@/lib/config';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'شرایط استفاده | جاب مچ',
  description:
    'شرایط استفاده از سرویس جاب مچ. قوانین و مقررات مربوط به استفاده از پلتفرم استخدام هوشمند جاب مچ.',
  keywords: 'شرایط استفاده, قوانین سایت, جاب مچ, استخدام آنلاین, شرایط استفاده جاب مچ',
  openGraph: {
    title: 'شرایط استفاده | جاب مچ',
    description:
      'شرایط استفاده از سرویس جاب مچ. قوانین و مقررات مربوط به استفاده از پلتفرم استخدام هوشمند جاب مچ.',
    type: 'website',
    url: `${baseUrl}/terms`,
  },
  alternates: { canonical: `${baseUrl}/terms` },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'شرایط استفاده | جاب مچ',
    description:
      'شرایط استفاده از سرویس جاب مچ. قوانین و مقررات مربوط به استفاده از پلتفرم استخدام هوشمند جاب مچ.',
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
      '@id': `${baseUrl}/terms`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="prose lg:prose-xl max-w-4xl mx-auto py-16 px-4 text-right" dir="rtl">
      <h1 className="text-4xl font-bold text-center mb-12">شرایط استفاده از سرویس</h1>

      <p className="text-sm text-muted-foreground text-center mb-8">
        آخرین بروز رسانی: ۱۸ اوغوست ۲۰۲۶
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۱. پذیرش شرایط</h2>
        <p>
          با دسترسی یا استفاده از سرویس جاب مچ (JobMatch)، شما به این شرایط استفاده و هر
          سیاست حریم‌خصوصی مرتبط با آن اقرار می‌دهید. اگر با هر یک از شرایط مخالفت دارید، لطفاً
          از استفاده از سرویس خودداری کنید.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۲. ثبت‌نام حساب کاربری</h2>
        <p>
          برای دسترسی به برخی ویژگی‌های سرویس، باید یک حساب کاربری بسازید. شما مسئولیت
          حفظ محرمانگی رمز عبور و تمام فعالیت‌های حساب خود را بر عهده دارید. در صورت مشاهده
          هرگونه سوء استفاده غیرمجاز، بلافاصله به ما اطلاع دهید.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۳. رفتار مناسب</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>از انتشار مطالب نامناسب، توهین‌آمیز یا نچندان حرفه‌ای خودداری کنید.</li>
          <li>هرگز به شرکت‌ها یا افراد دیگر دروغ نگویید یا اطلاعات نادرست ارائه ندهید.</li>
          <li>بدون مجوز مناسب، اطلاعات حرفه‌ای و تجاری دیگران را به‌صورت غیرمجاز استخراج نکنید.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۴. محتوای کاربران</h2>
        <p>
          شما می‌توانید اطلاعات، رزومه و پیام‌های خود را در سرویس بارگذاری کنید. ما حق
          پیش‌نمایش، نظارت و حذف محتوای نامناسب را داریم. محتوای شما تحت مالکیت شماست اما ما
          حق استفاده از آن برای ارتقاء سرویس (بدون ذکر هویت شما) را داریم.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۵. محدودیت مسئولیت</h2>
        <p>
          جاب مچ یک پلتفرم واسطه است و مسئولیتی در قبال ارتباط مستقیم شما با کارفرمایان ندارد.
          ما تلاش می‌کنیم سرویس را بدون نقص فراهم کنیم، اما هیچ تضمینی در قبال در دسترس بودن
          یا صحت اطلاعات نمی‌دهیم.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۶. حفظ امنیت</h2>
        <p>
          شما متعهد نمی‌شوید که اقدام به هک، فشار DDoS، فیشینگ یا هر گونه نفوذ غیرمجاز به
          زیرساخت‌های سرویس نکنید. هرگونه نقض منجر به حذف حساب شما و اقدام قانونی خواهد شد.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۷. فسخ و حذف حساب</h2>
        <p>
          شما می‌توانید در هر زمان حساب خود را حذف کنید. ما حق حذف یا مسدود کردن حساب‌هایی
          را که با قوانین این شرایط در تضاد هستند، داریم.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">۸. قانون حاکم</h2>
        <p>
          این شرایط تحت قوانین جمهوری اسلامی ایران و دادگاه‌های تهران قابل اجرا هستند.
        </p>
      </section>

      <div className="mt-12 p-6 bg-muted/30 rounded-xl text-sm">
        <p>
          این شرایط یک چارچوب کلی هستند و ممکن است بروزرسانی شوند. استفاده نمایان از سرویس
          به‌عنوان پذیرش نسخه جدید شرایط محسوب می‌شود.
        </p>
      </div>
      </article>
    </>
  );
}
