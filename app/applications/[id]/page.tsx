"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Clock,
  FileText,
  ArrowRight,
  Share2,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Undo2,
} from "lucide-react";
import { useApplications } from "@/lib/hooks/use-application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
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

  const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    reviewing: Eye,
    accepted: CheckCircle,
    rejected: XCircle,
    interview: MessageSquare,
    withdrawn: Undo2,
  };

  const normalizedStatus = status?.toLowerCase() || "pending";
  const style =
    statusStyles[normalizedStatus] || "bg-gray-50 text-gray-700 border-gray-200";
  const label = statusLabels[normalizedStatus] || status || "درحال بررسی";
  const Icon = statusIcons[normalizedStatus] || AlertCircle;

  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span
        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${style}`}
      >
        {label}
      </span>
    </div>
  );
};

// Status Progress Steps
const STATUS_STEPS = [
  { value: "pending", label: "ثبت درخواست", icon: FileText },
  { value: "reviewing", label: "بررسی رزومه", icon: Eye },
  { value: "interview", label: "مصاحبه", icon: MessageSquare },
  { value: "accepted", label: "پذیرش", icon: CheckCircle },
  { value: "rejected", label: "رد", icon: XCircle },
  { value: "withdrawn", label: "لغو شده", icon: Undo2 },
];

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const { useGetApplicationById, useWithdrawApplication } = useApplications();
  const applicationId = params.id;
  const { data: app, isLoading, refetch } = useGetApplicationById(applicationId);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const isWithdrawn = app?.status?.toLowerCase() === "withdrawn";

  // Withdraw mutation
  const withdrawMutation = useWithdrawApplication();

  const formatDateTime = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get current status index for progress
  const getStatusIndex = (status: string) => {
    const normalized = status?.toLowerCase() || "pending";
    const index = STATUS_STEPS.findIndex((s) => s.value === normalized);
    return index >= 0 ? index : 0;
  };

  const currentStatusIndex = getStatusIndex(app?.status || "");

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-amber-600 border-amber-200 bg-amber-50",
      reviewing: "text-blue-600 border-blue-200 bg-blue-50",
      interview: "text-purple-600 border-purple-200 bg-purple-50",
      accepted: "text-emerald-600 border-emerald-200 bg-emerald-50",
      rejected: "text-rose-600 border-rose-200 bg-rose-50",
      withdrawn: "text-gray-600 border-gray-200 bg-gray-50",
    };
    return colors[status?.toLowerCase()] || "text-gray-600 border-gray-200 bg-gray-50";
  };

  // Check if application can be withdrawn
  const canWithdraw = (status: string) => {
    const statusLower = status?.toLowerCase();
    return ["pending", "reviewing", "interview"].includes(statusLower);
  };

  // Handle withdraw
  const handleWithdrawClick = () => {
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    try {
      await withdrawMutation.mutateAsync(applicationId);
      toast.success("✅ درخواست شما با موفقیت لغو شد");
      refetch();
      setWithdrawDialogOpen(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "خطا در لغو درخواست");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 dir-rtl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found
  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-16 dir-rtl">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          درخواست یافت نشد
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          درخواست مورد نظر شما وجود ندارد یا حذف شده است.
        </p>
        <Link href="/applications">
          <Button>
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت به لیست درخواست‌ها
          </Button>
        </Link>
      </div>
    );
  }

  // Get job title and company from the nested structure
  const jobTitle = typeof app.job === 'object' ? app.job?.title : app.job;
  const companyName = typeof app.job === 'object' ? app.job?.company : undefined;

  return (
    <div className="space-y-6 dir-rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/applications">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowRight className="w-4 h-4" />
              بازگشت
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {jobTitle || "جزئیات درخواست"}
            </h1>
            <p className="text-sm text-gray-500">
              {companyName || "شرکت نامشخص"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Badge */}
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border",
              getStatusColor(app.status)
            )}
          >
            {getStatusBadge(app.status)}
          </div>

          {/* Action Buttons */}
          {canWithdraw(app.status) && !isWithdrawn && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleWithdrawClick}
              className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
              disabled={withdrawMutation.isPending}
            >
              {withdrawMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              لغو درخواست
            </Button>
          )}

          {isWithdrawn && (
            <Badge variant="secondary" className="gap-2 px-3 py-1.5">
              <Undo2 className="w-4 h-4" />
              این درخواست لغو شده است
            </Badge>
          )}

          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            اشتراک‌گذاری
          </Button>
        </div>
      </div>

      {/* Status Progress */}
      <Card
        className={cn(
          "border shadow-sm",
          isWithdrawn ? "border-gray-200 bg-gray-50/50" : "border-gray-100"
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">وضعیت درخواست</h3>
            <span className="text-xs text-gray-500">
              آخرین به‌روزرسانی: {formatDateTime(app.updatedAt)}
            </span>
          </div>

          <div className="relative">
            {/* Progress Steps */}
            <div className="flex justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />

              {/* Progress Line Fill */}
              {!isWithdrawn && currentStatusIndex < STATUS_STEPS.length - 1 && (
                <div
                  className="absolute top-5 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${(currentStatusIndex / (STATUS_STEPS.length - 2)) * 100}%`,
                  }}
                />
              )}

              {STATUS_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStatusIndex && !isWithdrawn;
                const isRejected =
                  step.value === "rejected" && app.status?.toLowerCase() === "rejected";
                const isWithdrawnStep = step.value === "withdrawn" && isWithdrawn;

                // Skip showing withdrawn step if not withdrawn
                if (step.value === "withdrawn" && !isWithdrawn) {
                  return null;
                }

                // Skip showing progress after withdrawn
                if (isWithdrawn && index > currentStatusIndex) {
                  return null;
                }

                return (
                  <div
                    key={step.value}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                        isWithdrawnStep
                          ? "bg-gray-400 border-gray-400 text-white"
                          : isCompleted && !isRejected
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                            : isRejected
                              ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200"
                              : "bg-white border-gray-300 text-gray-400"
                      )}
                    >
                      {isCompleted && !isRejected && !isWithdrawnStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : isRejected ? (
                        <XCircle className="w-5 h-5" />
                      ) : isWithdrawnStep ? (
                        <Undo2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium mt-2 text-center",
                        isWithdrawnStep
                          ? "text-gray-500"
                          : isCompleted && !isRejected
                            ? "text-blue-600"
                            : isRejected
                              ? "text-rose-600"
                              : "text-gray-400"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Withdrawn Message */}
          {isWithdrawn && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <Undo2 className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    این درخواست توسط شما لغو شده است
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    در صورت تمایل می‌توانید مجدداً برای این موقعیت شغلی درخواست دهید.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {app.statusHistory && app.statusHistory.length > 0 && !isWithdrawn && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    {app.statusHistory[app.statusHistory.length - 1]?.notes ||
                      "هیچ توضیحی ثبت نشده است."}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    توسط {app.statusHistory[app.statusHistory.length - 1]?.updatedBy?.fullName || "سیستم"} -{" "}
                    {formatDateTime(app.statusHistory[app.statusHistory.length - 1]?.updatedAt || "-")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resume Section */}
          {app.resume && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">رزومه ارسالی</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-500">نام و نام خانوادگی</span>
                    <span className="text-sm font-medium">
                      {app.resume?.personalInfo?.firstName} {app.resume?.personalInfo?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-500">عنوان</span>
                    <span className="text-sm font-medium">{app.resume?.title || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-500">ایمیل</span>
                    <span className="text-sm font-medium">{app.resume?.personalInfo?.email || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-500">تلفیحات</span>
                    <span className="text-sm font-medium">{app.resume?.personalInfo?.phone || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">مکان</span>
                    <span className="text-sm font-medium">{app.resume?.personalInfo?.location || "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cover Letter */}
          {app.coverLetter && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">نامه همراه</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {app.coverLetter}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Application Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">اطلاعات درخواست</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">تاریخ ثبت</p>
                  <p className="text-sm font-medium">{formatDateTime(app.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">حقوق درخواستی</p>
                  <p className="text-sm font-medium">
                    {app.expectedSalary ? `${app.expectedSalary.toLocaleString()} تومان` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">تاریخ شروع</p>
                  <p className="text-sm font-medium">{formatDateTime(app.availableFrom || "-")}</p>
                </div>
                {app.aiScore !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500">امتیاز AI</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(app.aiScore * 10, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(app.aiScore * 10)}%
                      </span>
                    </div>
                  </div>
                )}
                {app.aiRecommendation && (
                  <div>
                    <p className="text-xs text-gray-500">توصیه AI</p>
                    <Badge variant="outline" className="mt-1">
                      {app.aiRecommendation === "consider"
                        ? "مناسب"
                        : app.aiRecommendation === "recommend"
                          ? "توصیه می‌شود"
                          : app.aiRecommendation === "strong_recommend"
                            ? "توصیه قوی"
                            : app.aiRecommendation === "reject"
                              ? "رد"
                              : app.aiRecommendation}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis (if available) */}
          {(() => {
            const aiStrengths = app.aiStrengths || [];
            const aiWeaknesses = app.aiWeaknesses || [];
            const showAIAnalysis =
              aiStrengths.length > 0 || aiWeaknesses.length > 0 || app.aiExplanation;

            if (!showAIAnalysis) return null;

            return (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">تحلیل هوش مصنوعی</h3>
                  <div className="space-y-4">
                    {aiStrengths.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">نقاط قوت</p>
                        <div className="flex flex-wrap gap-2">
                          {aiStrengths.map((strength: string, index: number) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {aiWeaknesses.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">نقاط ضعف</p>
                        <div className="flex flex-wrap gap-2">
                          {aiWeaknesses.map((weakness: string, index: number) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {weakness}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {app.aiExplanation && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">توضیحات</p>
                        <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {app.aiExplanation}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

        </div>
      </div>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>آیا از لغو درخواست خود مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              شما در حال لغو درخواست خود برای موقعیت شغلی {jobTitle || "جزئیات درخواست"} هستید.
              <br />
              <span className="text-amber-600 font-medium mt-2 block">
                ⚠️ توجه: این عمل قابل بازگشت نیست و پس از لغو، درخواست شما از فرآیند بررسی حذف خواهد شد.
              </span>
              <br />
              <span className="text-sm text-gray-500 block mt-2">
                شرکت: {companyName || "شرکت نامشخص"}
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
  );
}
