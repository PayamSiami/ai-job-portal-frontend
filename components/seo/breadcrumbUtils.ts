export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Helper function to generate breadcrumb items for common routes
 */
export const generateBreadcrumbs = {
  /**
   * Homepage breadcrumb
   */
  home: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
  ],

  /**
   * Jobs listing page breadcrumb
   */
  jobs: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'جستجوی شغل', url: `${baseUrl}/jobs` },
  ],

  /**
   * Job detail page breadcrumb
   */
  jobDetail: (baseUrl: string, jobTitle: string, jobId: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'جستجوی شغل', url: `${baseUrl}/jobs` },
    { name: jobTitle, url: `${baseUrl}/jobs/${jobId}` },
  ],

  /**
   * Category page breadcrumb
   */
  category: (baseUrl: string, categoryName: string, categorySlug: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'جستجوی شغل', url: `${baseUrl}/jobs` },
    { name: categoryName, url: `${baseUrl}/jobs/category/${categorySlug}` },
  ],

  /**
   * Employer dashboard breadcrumb
   */
  employerDashboard: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'داشبورد کارفرما', url: `${baseUrl}/employer/dashboard` },
  ],

  /**
   * User dashboard breadcrumb
   */
  userDashboard: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'داشبورد', url: `${baseUrl}/dashboard` },
  ],

  /**
   * Profile page breadcrumb
   */
  profile: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'داشبورد', url: `${baseUrl}/dashboard` },
    { name: 'پروفایل', url: `${baseUrl}/profile` },
  ],

  /**
   * Settings page breadcrumb
   */
  settings: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'داشبورد', url: `${baseUrl}/dashboard` },
    { name: 'تنظیمات', url: `${baseUrl}/settings` },
  ],

  /**
   * Applications page breadcrumb
   */
  applications: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'داشبورد', url: `${baseUrl}/dashboard` },
    { name: 'درخواست‌های شغلی', url: `${baseUrl}/applications` },
  ],

  /**
   * Application detail breadcrumb
   */
  applicationDetail: (baseUrl: string, jobTitle: string, applicationId: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'داشبورد', url: `${baseUrl}/dashboard` },
    { name: 'درخواست‌های شغلی', url: `${baseUrl}/applications` },
    { name: jobTitle, url: `${baseUrl}/applications/${applicationId}` },
  ],

  /**
   * Resumes page breadcrumb
   */
  resumes: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'داشبورد', url: `${baseUrl}/dashboard` },
    { name: 'رزومه‌ها', url: `${baseUrl}/resumes` },
  ],

  /**
   * Auth pages breadcrumb
   */
  auth: (baseUrl: string, pageName: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: pageName, url: `${baseUrl}/auth/${pageName.toLowerCase()}` },
  ],

  /**
   * Blog index breadcrumb
   */
  blog: (baseUrl: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'بلاگ', url: `${baseUrl}/blog` },
  ],

  /**
   * Blog post detail breadcrumb
   */
  blogPost: (baseUrl: string, postTitle: string, slug: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'بلاگ', url: `${baseUrl}/blog` },
    { name: postTitle, url: `${baseUrl}/blog/${slug}` },
  ],

  /**
   * Blog category listing breadcrumb
   */
  blogCategory: (baseUrl: string, categoryName: string, categorySlug: string): BreadcrumbItem[] => [
    { name: 'خانه', url: baseUrl },
    { name: 'بلاگ', url: `${baseUrl}/blog` },
    { name: categoryName, url: `${baseUrl}/blog/category/${categorySlug}` },
  ],
};