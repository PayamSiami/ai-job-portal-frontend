"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Calendar,
  Briefcase,
  Loader2,
  Clock,
  Filter,
  X,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { useApplications } from "@/lib/hooks/use-application";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_FILTERS } from "@/lib/constants/application-status";

// Status filter options with Farsi labels and icons


// Helper to render status badges with distinct colors
const getStatusBadge = (status: string) => {
  const statusStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    reviewing: "bg-blue-50 text-blue-700 border-blue-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    interview: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const statusLabels: Record<string, string> = {
    pending: "درحال بررسی",
    reviewing: "در حال بررسی",
    accepted: "پذیرفته شده",
    rejected: "رد شده",
    interview: "مصاحبه",
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

// Status count component
const StatusCount = ({ count }: { count: number }) => (
  <Badge variant="secondary" className="mr-1 h-5 min-w-5 px-1.5 text-xs">
    {count}
  </Badge>
);

export default function DashboardClient() {
  const { user } = useAuth();
  const { useGetMyApplications } = useApplications();
  const { data: applications, isLoading } = useGetMyApplications();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get applications array from response
  const applicationsData = useMemo(() => {
    return applications || [];
  }, [applications]);

  // Filter applications based on status
  const filteredApplications = useMemo(() => {
    if (activeFilter === "all") {
      return applicationsData;
    }
    return applicationsData.filter(
      (app: any) => app.status?.toLowerCase() === activeFilter
    );
  }, [applicationsData, activeFilter]);

  // Calculate status counts for badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applicationsData.forEach((app: any) => {
      const status = app.status?.toLowerCase() || "pending";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [applicationsData]);

  // Statistics
  const stats = useMemo(() => {
    const total = applicationsData.length;
    const pending = applicationsData.filter(
      (app: any) => app.status?.toLowerCase() === "pending" || app.status?.toLowerCase() === "reviewing"
    ).length;
    const interview = applicationsData.filter(
      (app: any) => app.status?.toLowerCase() === "interview"
    ).length;
    const accepted = applicationsData.filter(
      (app: any) => app.status?.toLowerCase() === "accepted"
    ).length;
    const rejected = applicationsData.filter(
      (app: any) => app.status?.toLowerCase() === "rejected"
    ).length;

    return [
      {
        icon: Briefcase,
        label: "کل درخواست‌ها",
        value: total,
        change: "ثبت شده",
        color: "text-blue-600 bg-blue-50",
        trend: total > 0 ? "up" : "neutral",
      },
      {
        icon: Clock,
        label: "در انتظار پاسخ",
        value: pending,
        change: "نیاز به بررسی",
        color: "text-amber-600 bg-amber-50",
        trend: pending > 0 ? "up" : "neutral",
      },
      {
        icon: MessageCircle,
        label: "مصاحبه‌ها",
        value: interview,
        change: "در انتظار شما",
        color: "text-purple-600 bg-purple-50",
        trend: interview > 0 ? "up" : "neutral",
      },
      {
        icon: CheckCircle,
        label: "پذیرفته شده",
        value: accepted,
        change: "تبریک! 🎉",
        color: "text-emerald-600 bg-emerald-50",
        trend: accepted > 0 ? "up" : "neutral",
      },
    ];
  }, [applicationsData]);

  // Clear all filters
  const clearFilters = () => {
    setActiveFilter("all");
  };

  return (
    <div className="space-y-8 dir-rtl">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">
            خوش آمدید، {user?.fullName || "کاربر"}! 👋
          </h1>
          <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
            امروز در فرآیند جستجوی شغل شما چه اتفاقی می‌افتد. وضعیت درخواست‌های
            خود را بررسی کنید.
          </p>
        </div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span>{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications with Filters */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                درخواست‌های اخیر
                <StatusCount count={filteredApplications.length} />
              </CardTitle>

              {/* Filter Toggle for Mobile */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 ml-2" />
                فیلتر
                {activeFilter !== "all" && (
                  <Badge variant="secondary" className="mr-1">
                    {activeFilter}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filter Tabs - Desktop */}
            <div className="hidden lg:block mt-4 overflow-x-auto">
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
                          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
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
                            className="h-5 min-w-[18px] px-1 text-xs"
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

            {/* Filter Chips - Mobile */}
            <div className={cn(
              "lg:hidden mt-4 flex flex-wrap gap-2 transition-all duration-200",
              showFilters ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )}>
              {STATUS_FILTERS.map((filter) => {
                const Icon = filter.icon;
                const count = statusCounts[filter.value] || 0;
                const isActive = activeFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      isActive
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{filter.label}</span>
                    {count > 0 && (
                      <span className={cn(
                        "text-xs",
                        isActive ? "text-blue-600" : "text-gray-400"
                      )}>
                        ({count})
                      </span>
                    )}
                  </button>
                );
              })}
              {activeFilter !== "all" && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                >
                  <X className="w-3 h-3" />
                  پاک کردن فیلتر
                </button>
              )}
            </div>

            {/* Active Filter Indicator */}
            {activeFilter !== "all" && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>فیلتر شده بر اساس:</span>
                <Badge variant="outline" className="gap-1">
                  {STATUS_FILTERS.find(f => f.value === activeFilter)?.label}
                  <button
                    onClick={clearFilters}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-sm">درحال دریافت اطلاعات...</span>
              </div>
            ) : filteredApplications.length > 0 ? (
              <div className="space-y-3">
                {filteredApplications.slice(0, 5).map((app: any, index: number) => (
                  <div
                    key={app?._id || app?.id || index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/80 hover:bg-gray-100/80 rounded-xl transition-colors gap-3"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {app?.jobId?.title || "عنوان شغلی نامشخص"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app?.jobId?.company || "شرکت نامشخص"}
                      </p>
                      {app?.jobId?.location && (
                        <p className="text-xs text-gray-400">
                          📍 {app.jobId.location}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {app?.createdAt
                          ? new Date(app.createdAt).toLocaleDateString("fa-IR")
                          : "-"}
                      </span>
                      {getStatusBadge(app?.status)}
                    </div>
                  </div>
                ))}

                {/* Show "View All" if there are more applications */}
                {filteredApplications.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      مشاهده همه ({filteredApplications.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-500 text-sm font-medium">
                  {activeFilter === "all"
                    ? "هنوز هیچ درخواستی ثبت نکرده‌اید."
                    : `هیچ درخواستی با وضعیت "${STATUS_FILTERS.find(f => f.value === activeFilter)?.label}" وجود ندارد.`}
                </p>
                {activeFilter !== "all" && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-2 text-blue-600"
                  >
                    مشاهده همه درخواست‌ها
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Calendar className="w-5 h-5 text-blue-600" />
              مصاحبه‌های پیش‌رو
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {applicationsData.some((app: any) => app.status?.toLowerCase() === "interview") ? (
              <div className="space-y-3">
                {applicationsData
                  .filter((app: any) => app.status?.toLowerCase() === "interview")
                  .slice(0, 3)
                  .map((app: any, index: number) => (
                    <div
                      key={app?._id || index}
                      className="flex items-center justify-between p-4 bg-purple-50/80 hover:bg-purple-100/80 rounded-xl transition-colors border border-purple-100"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {app?.jobId?.title || "عنوان شغلی"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {app?.jobId?.company || "شرکت"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-purple-700 bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg">
                          {app?.createdAt
                            ? `در انتظار ${new Date(app.createdAt).toLocaleDateString("fa-IR")}`
                            : "در انتظار هماهنگی"}
                        </span>
                        <span className="text-xs text-purple-600">
                          وضعیت: {getStatusBadge("interview")}
                        </span>
                      </div>
                    </div>
                  ))}
                {applicationsData.filter((app: any) => app.status?.toLowerCase() === "interview").length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" className="text-purple-600">
                      مشاهده همه مصاحبه‌ها
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-gray-500 text-sm">
                  هیچ مصاحبه‌ای در پیش رو ندارید.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  درخواست‌های خود را پیگیری کنید و منتظر تماس کارفرمایان باشید.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}