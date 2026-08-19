/**
 * FAQ structured data for rich results.
 * Covers common job-seeker questions to increase FAQ rich snippet eligibility.
 * Server-rendered so Googlebot sees JSON-LD in the initial HTML.
 *
 * NOTE: Google requires FAQ content to be visible on the page for rich result
 * eligibility. Use the <FAQSection> component alongside this to render
 * visible, user-facing FAQ content that matches this data.
 */

export const FAQ_CONTENT = [
  {
    id: 1,
    question: 'جاب مچ چیست؟',
    answer: 'جاب مچ (JobMatch) یک پلتفرم هوشمند استخدام در ایران است. با استفاده از هوش مصنوعی، شغل مناسب خود را از هزاران فرصت شغلی در حوزه‌های مختلف پیدا کنید.',
  },
  {
    id: 2,
    question: 'چگونه در جاب مچ ثبت‌نام کنم؟',
    answer: 'برای ثبت‌نام، روی دکمه ثبت‌نام در صفحه اصلی یا مسیر /register کلیک کنید. فقط نیاز به ایمیل و رمز عبور دارید و می‌توانید با حساب گوگل نیز وارد شوید.',
  },
  {
    id: 3,
    question: 'آیا می‌توانم بدون ثبت‌نام شغل جست‌وجو کنم؟',
    answer: 'بله، جستجوی شغل و مشاهده آگهی‌ها کاملاً رایگان و بدون نیاز به ثبت‌نام است. برای ارسال درخواست شغلی یا ذخیره شغل، حساب کاربری لازم است.',
  },
  {
    id: 4,
    question: 'شغل‌های دورکاری چه معنایی دارد؟',
    answer: 'شغل دورکاری به معنای آن است که شما می‌توانید از هر مکانی کار کنید. در جاب مچ می‌توانید با فیلتر کردن بر اساس نوع همکاری (دورکاری، حضوری، ترکیبی) فرصت‌های مناسب خود را پیدا کنید.',
  },
  {
    id: 5,
    question: 'چطور رزومه بسازم؟',
    answer: 'پس از ثبت‌نام و ورود به حساب کاربری، در منوی "رزومه‌ها" می‌توانید رزومه خود را با ابزار ساخت رزومه هوشمند جاب مچ بسازید و آن را برای هر شغل ارسال کنید.',
  },
  {
    id: 6,
    question: 'جاب مچ برای کارفرمایان چه ارائه‌ای دارد؟',
    answer: 'کارفرمایان می‌توانند در پنل جاب مچ ثبت شرکت کنند، آگهی شغلی منتشر کنند، به درخواست‌های ارسالی پاسخ دهند و با هوش مصنوعی، بهترین نیروها را پیدا کنند.',
  },
  {
    id: 7,
    question: 'چگونه برای یک شغل درخواست بدم؟',
    answer: 'روی شغل مورد نظر کلیک کنید، سپس روی دکمه "ثبت درخواست" یا "ارسال رزومه" کلیک کنید. اگر رزومه ندارید، ابتدا یک رزومه بسازید. هوش مصنوعی جاب مچ می‌تواند رزومه و نامه انگیزشی شما را به‌صورت خودکار بر اساس شغل سفارشی کند.',
  },
  {
    id: 8,
    question: 'چگونه جستجوی هوش مصنوعی کار می‌کند؟',
    answer: 'در جاب مچ، هوش مصنوعی با تحلیل مهارت‌ها، تجربه کاری، موقعیت جغرافیایی و نوع همکاری شما، شغل‌های مناسب را پیشنهاد می‌دهد. کافی است رزومه بارگذاری کنید یا فیلترهای دلخواه را تنظیم کنید.',
  },
  {
    id: 9,
    question: 'چه زمانی برای درخواست شغلی پاسخ می‌گیرم؟',
    answer: 'زمان پاسخگویی بسته به شرکت فرستنده شغل متفاوت است. معمولاً کارفرمایان در عرض ۳ تا ۷ روز کاری پاسخ می‌دهند. می‌توانید وضعیت درخواست خود را در بخش "درخواست‌های شغلی" در داشبورد کاربری خود پیگیری کنید.',
  },
];

export const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_CONTENT.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

export const FAQStructuredData = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
    />
  );
};
