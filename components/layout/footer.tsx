import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

export const Footer = () => {

  return (
    <footer className="border-t bg-white" >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">جاب مچ</span>
            </Link>
            <p className="text-sm text-gray-600 max-w-sm">
              شغل رویایی خود را با جستجوی مبتنی بر هوش مصنوعی پیدا کنید. به شرکت‌های برتر متصل شوید و حرفه خود را به سطح بعدی ببرید.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
            {/* Contact Info */}
            <div className="mt-4 text-sm text-gray-600">
              <p>تلفن تماس: <span className="font-medium text-gray-800">۰۹۲۱۸۰۸۷۱۹۵</span></p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">برای جویندگان کار</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/jobs" className="hover:text-blue-600 transition-colors">
                  مشاهده مشاغل
                </Link>
              </li>
              <li>
                <Link href="/resumes" className="hover:text-blue-600 transition-colors">
                  ساخت رزومه
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-blue-600 transition-colors">
                  جستجوی هوش مصنوعی
                </Link>
              </li>
              <li>
                <Link href="/saved-jobs" className="hover:text-blue-600 transition-colors">
                  مشاغل ذخیره شده
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">برای کارفرمایان</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="https://panel.jobmatch.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  داشبورد
                </a>
              </li>
              <li>
                <a
                  href="https://panel.jobmatch.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  ثبت آگهی شغلی
                </a>
              </li>
              <li>
                <a
                  href="https://panel.jobmatch.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  بررسی درخواست‌ها
                </a>
              </li>
              <li>
                <a
                  href="https://panel.jobmatch.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  پروفایل شرکت
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© ۲۰۲۶ جاب مچ. تمام حقوق محفوظ است.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              سیاست حریم خصوصی
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              شرایط خدمات
            </Link>
            <Link href="/cookies" className="hover:text-blue-600 transition-colors">
              سیاست کوکی
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};