import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { config } from '@/lib/config';
import { BlogCard } from '@/components/blog/BlogCard';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { BlogListStructuredData } from '@/components/seo/BlogListStructuredData';
import {
    BLOG_CATEGORIES,
    BLOG_POSTS,
    type BlogPost,
} from '@/lib/blog';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const revalidate = 21600;

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Pre-render all category pages at build time.
 */
export async function generateStaticParams() {
    return Object.keys(BLOG_CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = BLOG_CATEGORIES[slug];

    if (!category) {
        return {
            title: 'دسته‌بندی یافت نشد | بلاگ جاب مچ',
            robots: { index: false, follow: false },
        };
    }

    // Support both string and object shape
    const name = typeof category === 'string' ? category : category.name;
    const description =
        typeof category === 'string'
            ? `مقالات دسته ${name} در بلاگ جاب مچ`
            : category.seoDescription;

    const categoryUrl = `${baseUrl}/blog/category/${slug}`;

    return {
        title: `${name} | بلاگ جاب مچ`,
        description,
        alternates: { canonical: categoryUrl },
        openGraph: {
            title: `${name} | بلاگ جاب مچ`,
            description,
            type: 'website',
            url: categoryUrl,
            siteName: 'جاب مچ | JobMatch',
            locale: 'fa_IR',
            images: [`${baseUrl}/logo.svg`],
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': 160,
            'max-image-preview': 'large',
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = BLOG_CATEGORIES[slug];

    if (!category) {
        notFound();
    }

    const name = typeof category === 'string' ? category : category.name;
    const description =
        typeof category === 'string'
            ? `مقالات دسته «${name}» در بلاگ جاب مچ`
            : category.description;

    const posts = BLOG_POSTS.filter((post) => post.categorySlug === slug).sort(
        (a, b) =>
            new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    );

    return (
        <>
            <BreadcrumbStructuredData
                items={[
                    { name: 'خانه', url: baseUrl },
                    { name: 'بلاگ', url: `${baseUrl}/blog` },
                    {
                        name,
                        url: `${baseUrl}/blog/category/${slug}`,
                    },
                ]}
            />
            <BlogListStructuredData posts={posts} />

            <div className="container mx-auto px-4 py-12">
                {/* Back link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    بازگشت به بلاگ
                </Link>

                {/* Hero */}
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        {description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                        {posts.length} مقاله در این دسته
                    </p>
                </header>

                {/* Posts grid */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: BlogPost) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-12">
                        هنوز مقاله‌ای در این دسته منتشر نشده است.
                    </p>
                )}
            </div>
        </>
    );
}