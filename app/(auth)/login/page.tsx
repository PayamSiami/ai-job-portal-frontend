import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: 'ورود به جاب‌آی | پلتفرم استخدام با هوش مصنوعی',
  description: 'به حساب کاربری خود در جاب‌آی وارد شوید تا از جستجوی هوشمند شغل، ذخیره آگهی‌ها و مدیریت درخواست‌های شغلی بهره‌مند شوید.',
  keywords: 'ورود, جاب‌آی, حساب کاربری, کاریابی',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}