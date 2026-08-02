import { Metadata } from "next";
import ApplicationClient from "./applicationClient";


export const metadata: Metadata = {
  title: 'درخواست‌های شغلی من | جاب‌آی',
  description: 'مشاهده و مدیریت تمام درخواست‌های شغلی شما، پیگیری وضعیت و لغو درخواست‌ها',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApplicationsPage() {
  // Your component logic
  return (
    <ApplicationClient />
  );
}