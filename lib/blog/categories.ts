export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
  /** Short emoji or icon name used in badges */
  icon: string;
  /** Tailwind-friendly color hint for badge styling */
  color: "blue" | "green" | "purple" | "orange" | "pink" | "teal" | "indigo" | "amber";
  /** SEO: 1-2 sentence description for the category archive page */
  seoDescription: string;
}

export const BLOG_CATEGORIES: Record<string, BlogCategory> = {
  jobsearch: {
    slug: "jobsearch",
    name: "جستجوی شغل",
    description: "راهنماها و استراتژی‌های پیدا کردن شغل مناسب",
    icon: "🔍",
    color: "blue",
    seoDescription:
      "راهنمای جستجوی شغل در ایران: استراتژی‌های پیدا کردن شغل، شبکه‌سازی، و استفاده از ابزارهای هوشمند برای یافتن فرصت‌های شغلی مناسب.",
  },
  resume: {
    slug: "resume",
    name: "رزومه و کارآیی",
    description: "ساخت رزومه حرفه‌ای و بهینه‌سازی پروفایل کاری",
    icon: "📄",
    color: "green",
    seoDescription:
      "آموزش ساخت رزومه حرفه‌ای، بهینه‌سازی برای ATS، و نوشتن نامه انگیزشی که کارفرما را متقاعد می‌کند.",
  },
  interview: {
    slug: "interview",
    name: "مصاحبه شغلی",
    description: "آمادگی برای مصاحبه فنی، رفتاری و هوش مصنوعی",
    icon: "🎤",
    color: "purple",
    seoDescription:
      "آمادگی مصاحبه شغلی: سؤالات رایج فنی و رفتاری، تکنیک‌های پاسخ‌دهی، و مصاحبه با هوش مصنوعی.",
  },
  ai: {
    slug: "ai",
    name: "هوش مصنوعی و کار",
    description: "تأثیر AI بر بازار کار و ابزارهای هوشمند استخدام",
    icon: "🤖",
    color: "indigo",
    seoDescription:
      "هوش مصنوعی و بازار کار: ابزارهای AI برای جستجوی شغل، رزومه‌ساز هوشمند، و روندهای استخدام در ۱۴۰۵.",
  },
  career: {
    slug: "career",
    name: "پیشرفت حرفه‌ای",
    description: "توسعه مهارت‌ها و ارتقاء در مسیر شغلی",
    icon: "📈",
    color: "orange",
    seoDescription:
      "پیشرفت حرفه‌ای و مسیر شغلی: یادگیری مهارت‌های جدید، تغییر حرفه، و ارتقاء به نقش‌های بالاتر.",
  },
  remote: {
    slug: "remote",
    name: "دورکاری و کار از راه دور",
    description: "راهنماها و روندهای دورکاری و کار ترکیبی",
    icon: "🏠",
    color: "teal",
    seoDescription:
      "دورکاری و کار از راه دور در ایران: مزایا، چالش‌ها، ابزارها، و پیدا کردن شغل‌های دورکاری معتبر.",
  },
  tech: {
    slug: "tech",
    name: "مهارت‌های فنی",
    description: "نقشه راه، ابزارها و مهارت‌های برنامه‌نویسی",
    icon: "💻",
    color: "pink",
    seoDescription:
      "یادگیری مهارت‌های فنی: نقشه راه برنامه‌نویسی، فریم‌ورک‌ها، DevOps، و ابزارهای توسعه نرم‌افزار.",
  },
  salary: {
    slug: "salary",
    name: "حقوق و مذاکره",
    description: "گزارش حقوق، مذاکره و مزایای شغلی",
    icon: "💰",
    color: "amber",
    seoDescription:
      "گزارش حقوق بازار کار ایران و آموزش مذاکره حقوق: چطور پیشنهاد بالاتر بگیریم و مزایای شغلی را ارزیابی کنیم.",
  },
  freelance: {
    slug: "freelance",
    name: "فریلنس و پروژه‌محور",
    description: "کار آزاد، پروژه‌های بین‌المللی و درآمد ارزی",
    icon: "🧑‍💻",
    color: "blue",
    seoDescription:
      "فریلنس و کار پروژه‌محور: پیدا کردن مشتری، قرارداد، درآمد ارزی، و مدیریت مالیات.",
  },
  startup: {
    slug: "startup",
    name: "استارتاپ و کارآفرینی",
    description: "کار در استارتاپ و ساختن کسب‌وکار",
    icon: "🚀",
    color: "orange",
    seoDescription:
      "کار در استارتاپ و کارآفرینی: تفاوت شرکت بزرگ و استارتاپ، equity، و رشد سریع در تیم‌های کوچک.",
  },
  students: {
    slug: "students",
    name: "دانشجویان و فارغ‌التحصیلان",
    description: "اولین شغل، کارآموزی و شروع مسیر حرفه‌ای",
    icon: "🎓",
    color: "green",
    seoDescription:
      "راهنمای شغل‌یابی برای دانشجویان و فارغ‌التحصیلان: اولین رزومه، کارآموزی، و پیدا کردن اولین شغل.",
  },
};

/** Backwards-compatible: `BLOG_CATEGORIES[slug]` as a plain string map */
export const BLOG_CATEGORY_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(BLOG_CATEGORIES).map(([slug, cat]) => [slug, cat.name]),
);

/** Safe lookup with fallback */
export function getCategoryName(slug: string): string {
  return BLOG_CATEGORIES[slug]?.name ?? slug;
}

export function getCategory(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES[slug];
}
