import { Metadata } from "next";
import { config } from '@/lib/config';
import ApplicationClient from "./applicationClient";
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'درخواست‌های شغلی من | جاب‌آی',
  description: 'مشاهده و مدیریت تمام درخواست‌های شغلی شما، پیگیری وضعیت و لغو درخواست‌ها',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApplicationsPage() {
  return (
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.applications(baseUrl)} />
      <ApplicationClient />
    </>
  );
}