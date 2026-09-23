import type { Metadata } from 'next';
import { config } from '@/lib/config';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'درباره ما | جاب مچ — پلتفرم استخدام هوشمند هوش مصنوعی',
  description:
    'جاب مچ (JobMatch) یک پلتفرم استخدام هوشمند است که با هوش مصنوعی به متقاضیان کمک می‌کند تا شغل رویایی‌شان را بیابند و به کارفرمایان راه‌حل‌های نیروی انسانی هوشمند ارائه دهد. دربارهٔ تیم، ماموریت و ارزش‌های ما بخوانید.',
  keywords:
    'درباره ما, جاب مچ, استخدام هوشمند, هوش مصنوعی و کار, JobMatch, تیم استخدام, مأموریت جاب مچ',
  openGraph: {
    title: 'درباره ما | جاب مچ — پلتفرم استخدام هوشمند هوش مصنوعی',
    description:
      'جاب مچ (JobMatch) یک پلتفرم استخدام هوشمند است که با هوش مصنوعی به متقاضیان کمک می‌کند تا شغل رویایی‌شان را بیابند و به کارفرمایان راه‌حل‌های نیروی انسانی هوشمند ارائه دهد.',
    type: 'website',
    url: `${baseUrl}/about`,
  },
  alternates: { canonical: `${baseUrl}/about` },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'دربارهٔ جاب مچ | JobMatch',
    description:
      'جاب مچ (JobMatch) یک پلتفرم استخدام هوشمند با هوش مصنوعی است که به متقاضیان کمک می‌کند شغل رویایی بیابند و به کارفرمایان راه‌حل‌های نیروی انسانی هوشمند ارائه دهد.',
    url: `${baseUrl}/about`,
    mainEntityOfPage: `${baseUrl}/about`,
    publisher: {
      '@type': 'Organization',
      name: 'جاب مچ',
      alternateName: 'JobMatch',
      url: baseUrl || undefined,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
        width: 240,
        height: 60,
      },
      sameAs: [
        'https://www.linkedin.com/company/jobmatch',
        'https://twitter.com/jobmatchir',
        'https://www.instagram.com/jobmatch.ir',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@jobmatch.ir',
          availableLanguage: ['fa', 'en'],
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article
        className="prose lg:prose-xl max-w-4xl mx-auto py-16 px-4 text-right"
        dir="rtl"
      >
        <h1 className="text-4xl font-bold text-center mb-12">دربارهٔ جاب مچ</h1>

        <p className="text-sm text-muted-foreground text-center mb-8">
          به‌روزرسانی: ۲ مهر ۱۴۰۵
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">مأموریت ما</h2>
          <p>
            جاب مچ (JobMatch) مأموریت دارد بازار کار ایران را با هوش مصنوعی هوشمندتر
            کند. به جای این که متقاضیان به‌صورت تصادفی به هزاران آگهی بروند، جاب مچ با
            تحلیل مهارت‌ها، سبک کاری و رشد شغلی، هر نفر را به شغلی هدایت می‌کند که
            واقعاً برایش مناسب است.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">چطور کار می‌کند؟</h2>
          <p>
            کاربران رزومهٔ هوشمند خود را بارگذاری می‌کنند؛ الگوریتم‌های ما مهارت‌هایشان
            را به بردارهای معنایی تبدیل می‌کنند و با دقت بالا شغل‌های منطبق را پیشنهاد
            می‌دهند. کارفرمایان می‌توانند آینده نیروی انسانی خود را با پیش‌بینی منطقه
            مهارت‌های در حال رشد برنامه‌ریزی کنند. همهٔ این‌ها در عمل — نه در اسلایدر
            ریسانس.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">ارزش‌های ما</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>شفافیت:</strong> هیچ «سیاه‌جامعهٔ الگوریتمی» نداریم؛ شما همیشه می‌توانید
              ببینید چرا یک شغل به شما نشان داده شد.
            </li>
            <li>
              <strong>برابری:</strong> فرصت برابر برای همه؛ فیلترهای هوشمند از پیش‌داوری
             ‌های ناآگاهانه جلوگیری می‌کنند.
            </li>
            <li>
              <strong>رشد مداوم:</strong> ما سالانه بیش از ۲۲۰ هزار ساعت آموزش و تحقیق می‌دهیم
              تا الگوریتم‌هایمان بهتر شوند.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">تیم ما</h2>
          <p>
            تیم جاب مچ ترکیبی است از مهندسان هوش مصنوعی، متخصصان رفتارشناسی شغلی و
            کاریاب‌های با تجربه. رهبری این تیم، توسط دکتر ایمان صادقی (پیشین گوگل،
            تحصیل‌کردهٔ کارشناسی ارشد MIT) انجام می‌شود که بیش از ده سال در زمینهٔ
            ماشین‌یادگیری کاربردی و بازاریابی استخدامی تجربه دارد.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">تماس با ما</h2>
          <p>
            ایمیل: <a href="mailto:support@jobmatch.ir" className="text-blue-600">support@jobmatch.ir</a>
            <br />
            تلفن: <span dir="ltr">+98 921 808 7195</span>
            <br />
            آدرس: تهران، ایران
          </p>
        </section>

        <div className="mt-12 p-6 bg-muted/30 rounded-xl text-sm">
          <p>
            جاب مچ یک شرکت خصوصی است که در سال ۱۴۰۲ تأسیس شد. تمام حقوق مطبوعاتی محفوظ
            است. استفاده از این صفحه به معنای پذیرش{' '}
            <a href="/privacy" className="text-blue-600">حریم‌خصوصی جاب مچ</a> است.
          </p>
        </div>
      </article>
    </>
  );
}
