// components/ui/NotFoundPage.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Home,
    Search,
    ArrowLeft,
    FileQuestion,
    Compass,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NotFoundPageProps {
    title?: string;
    description?: string;
    showHomeButton?: boolean;
    showSearchButton?: boolean;
    showBackButton?: boolean;
}

export function NotFoundPage({
    title = 'صفحه‌ای که به دنبال آن هستید پیدا نشد!',
    description = 'متأسفیم، صفحه‌ای که درخواست کرده‌اید وجود ندارد یا به مکان دیگری منتقل شده است.',
    showHomeButton = true,
    showSearchButton = true,
    showBackButton = true,
}: NotFoundPageProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-400/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.1) 1px, transparent 0)
            `,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-2xl w-full"
            >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 md:p-12">
                    {/* Error Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                <FileQuestion className="w-16 h-16 text-blue-600" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center animate-bounce">
                                    <AlertCircle className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Code */}
                    <div className="text-center mb-6">
                        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            ۴۰۴
                        </h1>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <div className="h-0.5 w-12 bg-gradient-to-r from-blue-600 to-transparent" />
                            <span className="text-sm font-medium text-gray-400">خطا</span>
                            <div className="h-0.5 w-12 bg-gradient-to-l from-purple-600 to-transparent" />
                        </div>
                    </div>

                    {/* Title and Description */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            {title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-blue-50/50 rounded-xl p-4 mb-8 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                    پیشنهادات:
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• آدرس URL را بررسی کنید</li>
                                    <li>• از جستجو برای پیدا کردن شغل مورد نظر استفاده کنید</li>
                                    <li>• به صفحه اصلی بازگردید و دوباره امتحان کنید</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {showBackButton && (
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex items-center gap-2 px-6 border-gray-300 hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                بازگشت
                            </Button>
                        )}

                        {showHomeButton && (
                            <Button
                                asChild
                                className="flex items-center gap-2 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                <Link href="/">
                                    <Home className="w-4 h-4" />
                                    صفحه اصلی
                                </Link>
                            </Button>
                        )}

                        {showSearchButton && (
                            <Button
                                asChild
                                variant="outline"
                                className="flex items-center gap-2 px-6 border-blue-200 hover:bg-blue-50"
                            >
                                <Link href="/search">
                                    <Search className="w-4 h-4" />
                                    جستجوی مشاغل
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Decorative */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <Compass className="w-4 h-4 text-gray-300" />
                        <span className="text-xs text-gray-400">
                            مسیر خود را پیدا کنید
                        </span>
                        <Compass className="w-4 h-4 text-gray-300" />
                    </div>
                </div>

                {/* Bottom Decoration */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} جاب مچ - تمامی حقوق محفوظ است
                    </p>
                </div>
            </motion.div>
        </div>
    );
}