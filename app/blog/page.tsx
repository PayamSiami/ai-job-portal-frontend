import type { Metadata } from 'next';
import Image from 'next/image';
import { config } from '@/lib/config';
import { BlogCard } from '@/components/blog/BlogCard';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { BlogListStructuredData } from '@/components/seo/BlogListStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';
import { BLOG_POSTS, getFeaturedPosts, getRecentPosts, BLOG_CATEGORIES } from '@/lib/data/blogPosts';
import { BlogPost } from '@/lib/data/blogPosts';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'بلاگ جاب مچ — نکات استخدام، هوش مصنوعی و کاریابی',
  description:
    'بلاگ جاب مچ: مقالات متخصصانه درباره جستجوی شغل، ساخت رزومه، مصاحبه شغلی، کار از راه دور و هوش مصنوعی در استخدام. آخرین روندها و نکات عملی برای یافتن شغل رویایی.',
  keywords:
    'بلاگ جاب مچ, مقالات استخدام, نکات رزومه, مصاحبه شغلی, هوش مصنوعی در استخدام, کاریابی, دورکاری, برنامه‌نویسی, لینکدین',
  openGraph: {
    title: 'بلاگ جاب مچ — نکات استخدام، هوش مصنوعی و کاریابی',
    description:
      'بلاگ جاب مچ: مقالات متخصصانه درباره جستجوی شغل، ساخت رزومه، مصاحبه شغلی، کار از راه دور و هوش مصنوعی در استخدام.',
    type: 'website',
    url: `${baseUrl}/blog`,
    siteName: 'جاب مچ | JobMatch',
    locale: 'fa_IR',
    images: [`${baseUrl}/logo.svg`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بلاگ جاب مچ — نکات استخدام، هوش مصنوعی و کاریابی',
    description:
      'بلاگ جاب مچ: مقالات متخصصانه درباره جستجوی شغل، ساخت رزومه، مصاحبه شغلی و هوش مصنوعی در استخدام.',
    images: [`${baseUrl}/logo.svg`],
  },
  alternates: { canonical: `${baseUrl}/blog` },
  robots: {
    index: true,
    follow: true,
    'max-snippet': 160,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

// Revalidate every 6 hours — blog content changes infrequently
export const revalidate = 21600;

/**
 * Format a date to a Persian readable string with time ago.
 */
function formatPersianDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(10);
  const allPosts = BLOG_POSTS;

  // Get unique categories with counts
  const categoryCounts: Record<string, number> = {};
  allPosts.forEach((post) => {
    categoryCounts[post.categorySlug] = (categoryCounts[post.categorySlug] || 0) + 1;
  });

  return (
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.blog(baseUrl)} />
      <BlogListStructuredData posts={allPosts} />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            بلاگ جاب مچ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            مقالات متخصصانه درباره جستجوی شغل، ساخت رزومه، مصاحبه شغلی، هوش مصنوعی در
            استخدام، و آخرین روندهای بازار کار ایران.
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              مقالات ویژه
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post: BlogPost) => (
                <BlogCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <main className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              تازه‌ترین مقالات
            </h2>
            <div className="space-y-8">
              {recentPosts.map((post: BlogPost) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {allPosts.length === 0 && (
              <p className="text-muted-foreground">
                در حال حاضر مقاله‌ای در بلاگ وجود ندارد. به زودی بازدید کنید!
              </p>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                دسته‌بندی‌ها
              </h3>
              <div className="space-y-2">
                {Object.entries(BLOG_CATEGORIES).map(([slug, name]) => (
                  <a
                    key={slug}
                    href={`/blog/category/${slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-muted/50 hover:text-blue-600 transition-colors"
                  >
                    <span>{name}</span>
                    <span className="bg-muted/30 text-xs px-2 py-0.5 rounded-full">
                      {categoryCounts[slug] || 0}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Latest Post Preview */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                محبوب‌ترین مقالات
              </h3>
              <div className="space-y-4">
                {recentPosts.slice(0, 4).map((post: BlogPost) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-16 h-16 rounded overflow-hidden bg-muted/30">
                        {post.image && (
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatPersianDate(post.datePublished)}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 text-center">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                بروز رسانی‌های بلاگ را دریافت کنید
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                جدیدترین مقالات و نکات استخدامی را مستقیماً در ایمیل بگیرید.
              </p>
              <form
                action="https://buttondown.email/api/emails/embed-subscribe/jobmatch"
                method="post"
                target="_blank"
                className="flex flex-col gap-3"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="ایمیل شما"
                  required
                  className="px-4 py-2 rounded-lg border border-border/50 bg-background text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all text-sm"
                >
                  ثبت‌نام
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
