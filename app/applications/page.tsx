/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Loader2,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Building2,
  MapPin,
  Trash2,
  Undo2,
} from "lucide-react";
import { useApplications } from "@/lib/hooks/use-application";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { STATUS_FILTERS } from "@/lib/constants/application-status";

// Helper to render status badges with distinct colors
const getStatusBadge = (status: string) => {
  const statusStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    reviewing: "bg-blue-50 text-blue-700 border-blue-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    interview: "bg-purple-50 text-purple-700 border-purple-200",
    withdrawn: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const statusLabels: Record<string, string> = {
    pending: "درحال بررسی",
    reviewing: "در حال بررسی",
    accepted: "پذیرفته شده",
    rejected: "رد شده",
    interview: "مصاحبه",
    withdrawn: "منصرف شده",
  };

  const normalizedStatus = status?.toLowerCase() || "pending";
  const style =
    statusStyles[normalizedStatus] ||
    "bg-gray-50 text-gray-700 border-gray-200";
  const label = statusLabels[normalizedStatus] || status || "درحال بررسی";

  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${style}`}
    >
      {label}
    </span>
  );
};

export default function ApplicationsListPage() {
  const { useGetMyApplications, useWithdrawApplication } = useApplications();
  const { data: applications, isLoading, refetch } = useGetMyApplications();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedApplicationTitle, setSelectedApplicationTitle] = useState("");
  const itemsPerPage = 10;

  // Withdraw mutation
  const withdrawMutation = useWithdrawApplication();

  // Get applications array from response
  const applicationsData = useMemo(() => {
    return applications?.data?.applications || applications || [];
  }, [applications]);

  // Filter and search applications
  const filteredAndSearchedApplications = useMemo(() => {
    let filtered = applicationsData;

    // Filter by status
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (app: any) => app.status?.toLowerCase() === activeFilter
      );
    }

    // Search by job title or company
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (app: any) =>
          app?.job?.title?.toLowerCase().includes(query) ||
          app?.job?.company?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered = [...filtered].sort((a: any, b: any) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "status":
          return a.status?.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [applicationsData, activeFilter, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSearchedApplications.length / itemsPerPage);
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSearchedApplications.slice(start, end);
  }, [filteredAndSearchedApplications, currentPage]);

  // Calculate status counts for badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applicationsData.forEach((app: any) => {
      const status = app.status?.toLowerCase() || "pending";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [applicationsData]);

  // Clear all filters
  const clearFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle withdraw
  const handleWithdrawClick = (applicationId: string, jobTitle: string) => {
    setSelectedApplicationId(applicationId);
    setSelectedApplicationTitle(jobTitle);
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    if (!selectedApplicationId) return;

    try {
      await withdrawMutation.mutateAsync(selectedApplicationId);
      toast.success("✅ درخواست شما با موفقیت لغو شد");
      refetch();
      setWithdrawDialogOpen(false);
      setSelectedApplicationId(null);
      setSelectedApplicationTitle("");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "خطا در لغو درخواست");
    }
  };

  // Check if application can be withdrawn (only pending, reviewing, interview)
  const canWithdraw = (status: string) => {
    const statusLower = status?.toLowerCase();
    return ["pending", "reviewing", "interview"].includes(statusLower);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 space-y-3">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">درخواست‌های شغلی</h1>
            <p className="text-sm text-gray-500 mt-1">
              مدیریت و پیگیری تمام درخواست‌های شغلی شما
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1.5">
              <Briefcase className="w-4 h-4 ml-1.5" />
              {applicationsData.length} درخواست
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="جستجو در عنوان شغل یا شرکت..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>

              {/* Sort */}
              <div className="w-full lg:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="مرتب‌سازی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">جدیدترین</SelectItem>
                    <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
                    <SelectItem value="status">وضعیت</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(activeFilter !== "all" || searchQuery || sortBy !== "newest") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 ml-1" />
                  پاک کردن فیلترها
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Filter Tabs */}
        <div className="overflow-x-auto">
          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-full"
          >
            <TabsList className="inline-flex w-full justify-start bg-gray-100/50 p-1 rounded-lg">
              {STATUS_FILTERS.map((filter) => {
                const Icon = filter.icon;
                const count = statusCounts[filter.value] || 0;
                const isActive = activeFilter === filter.value;

                return (
                  <TabsTrigger
                    key={filter.value}
                    value={filter.value}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                      isActive
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", filter.color)} />
                    <span>{filter.label}</span>
                    {count > 0 && (
                      <Badge
                        variant={isActive ? "default" : "secondary"}
                        className="h-5 min-w-4.5 px-1.5 text-xs"
                      >
                        {count}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Applications List */}
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-sm">درحال دریافت اطلاعات...</span>
              </div>
            ) : paginatedApplications.length > 0 ? (
              <>
                {/* List Header - Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-xs font-medium text-gray-500">
                  <div className="col-span-4">عنوان شغل و شرکت</div>
                  <div className="col-span-2">تاریخ درخواست</div>
                  <div className="col-span-2">وضعیت</div>
                  <div className="col-span-2">نوع همکاری</div>
                  <div className="col-span-2 text-center">عملیات</div>
                </div>

                {/* List Items */}
                <div className="divide-y divide-gray-100">
                  {paginatedApplications.map((app: any, index: number) => {
                    const isWithdrawn = app?.status?.toLowerCase() === "withdrawn";
                    const canWithdrawApp = canWithdraw(app?.status);

                    return (
                      <div
                        key={app?._id || app?.id || index}
                        className={cn(
                          "grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50/50 transition-colors items-start md:items-center",
                          isWithdrawn && "opacity-60"
                        )}
                      >
                        {/* Job Info */}
                        <div className="col-span-4 space-y-1">
                          <Link
                            href={`/jobs/${app?.job?._id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm"
                          >
                            {app?.job?.title || "عنوان شغلی نامشخص"}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{app?.job?.company || "شرکت نامشخص"}</span>
                            {app?.job?.location && (
                              <>
                                <span className="text-gray-300">•</span>
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{app.job.location}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Date */}
                        <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(app?.createdAt)}</span>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          {getStatusBadge(app?.status)}
                        </div>

                        {/* Job Type */}
                        <div className="col-span-2">
                          <Badge variant="outline" className="text-xs">
                            {app?.job?.jobType === "full-time" && "تمام وقت"}
                            {app?.job?.jobType === "part-time" && "پاره وقت"}
                            {app?.job?.jobType === "contract" && "قراردادی"}
                            {app?.job?.jobType === "internship" && "کارآموزی"}
                            {app?.job?.jobType === "freelance" && "پروژه‌ای"}
                            {!app?.job?.jobType && "-"}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center justify-center gap-2">
                          <Link href={`/applications/${app?._id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="mr-1.5 hidden sm:inline">مشاهده</span>
                            </Button>
                          </Link>

                          {/* Withdraw Button */}
                          {canWithdrawApp && !isWithdrawn && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleWithdrawClick(app._id, app?.job?.title || "این درخواست")}
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              disabled={withdrawMutation.isPending}
                            >
                              {withdrawMutation.isPending && selectedApplicationId === app._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              <span className="mr-1.5 hidden sm:inline">لغو</span>
                            </Button>
                          )}

                          {/* Withdrawn indicator */}
                          {isWithdrawn && (
                            <Badge variant="secondary" className="text-xs">
                              <Undo2 className="w-3 h-3 ml-1" />
                              لغو شده
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-xs text-gray-500">
                      نمایش {((currentPage - 1) * itemsPerPage) + 1} تا{" "}
                      {Math.min(currentPage * itemsPerPage, filteredAndSearchedApplications.length)} از{" "}
                      {filteredAndSearchedApplications.length} نتیجه
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Empty State
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeFilter === "all"
                    ? "هنوز هیچ درخواستی ثبت نکرده‌اید."
                    : `هیچ درخواستی با وضعیت "${STATUS_FILTERS.find(f => f.value === activeFilter)?.label}" وجود ندارد.`}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {activeFilter === "all"
                    ? "برای شروع، به بخش مشاغل بروید و برای موقعیت‌های مناسب درخواست دهید."
                    : "وضعیت فیلتر را تغییر دهید یا تمام درخواست‌ها را مشاهده کنید."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {activeFilter !== "all" && (
                    <Button variant="outline" onClick={clearFilters}>
                      مشاهده همه درخواست‌ها
                    </Button>
                  )}
                  <Link href="/jobs">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Briefcase className="w-4 h-4 ml-2" />
                      مشاهده مشاغل
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdraw Confirmation Dialog */}
        <AlertDialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>آیا از لغو درخواست خود مطمئن هستید؟</AlertDialogTitle>
              <AlertDialogDescription>
                شما در حال لغو درخواست خود برای موقعیت شغلی {selectedApplicationTitle} هستید.
                <br />
                <span className="text-amber-600 font-medium mt-2 block">
                  ⚠️ توجه: این عمل قابل بازگشت نیست و پس از لغو، درخواست شما از فرآیند بررسی حذف خواهد شد.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleWithdrawConfirm}
                className="bg-rose-600 hover:bg-rose-700"
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    در حال لغو...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 ml-2" />
                    بله، لغو کن
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}