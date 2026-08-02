import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: 'ثبت‌نام در جاب‌آی | پلتفرم استخدام با هوش مصنوعی',
  description: 'در جاب‌آی ثبت‌نام کنید تا به هزاران شغل دسترسی داشته باشید. جستجوی هوشمند با AI، ذخیره آگهی‌های مورد علاقه و مدیریت رزومه.',
  keywords: 'ثبت‌نام, جاب‌آی, حساب کاربری, کاریابی, رزومه',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}