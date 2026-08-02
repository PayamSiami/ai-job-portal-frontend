/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  FileText,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Download,
  Star,
  StarOff,
  Loader2,
  Search,
  Grid,
  List,
  Sparkles,
  User,
  Briefcase,
  Award,
  Calendar,
  Globe,
  Lock,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { resumeService, Resume } from '@/lib/services/resume.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CreateResumeModal } from '@/components/resume/CreateResumeModal';
import { TemplatePreview } from '@/components/resume/TemplatePreview';

export default function ResumesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);

  // Fetch resumes
  const { data: resumes, isLoading, refetch } = useQuery({
    queryKey: ['resumes', statusFilter],
    queryFn: () => {
      if (statusFilter !== 'all') {
        return resumeService.getResumes({ status: statusFilter });
      }
      return resumeService.getResumes({});
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => resumeService.deleteResume(id),
    onSuccess: () => {
      toast.success('رزومه با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setDeleteDialogOpen(false);
      setSelectedResume(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'حذف رزومه با شکست مواجه شد');
    },
  });

  // Set default mutation
  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => resumeService.setDefaultResume(id),
    onSuccess: () => {
      toast.success('رزومه پیش‌فرض بروزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'تنظیم رزومه پیش‌فرض با شکست مواجه شد');
    },
  });

  // Filter resumes by search
  const filteredResumes = resumes?.filter((resume: Resume) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.toLowerCase();
    return (
      resume.title.toLowerCase().includes(query) ||
      fullName.includes(query) ||
      resume.personalInfo.email.toLowerCase().includes(query) ||
      resume.personalInfo.location?.toLowerCase().includes(query)
    );
  });

  const handleDelete = (resume: Resume) => {
    setSelectedResume(resume);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedResume) {
      deleteMutation.mutate(selectedResume._id);
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate(id);
  };

  const handlePreview = (resume: Resume) => {
    setPreviewResume(resume);
    setPreviewDialogOpen(true);
  };

  const getTemplateColor = (template: string) => {
    switch (template) {
      case 'modern':
        return 'bg-blue-100 text-blue-800';
      case 'classic':
        return 'bg-gray-100 text-gray-800';
      case 'minimal':
        return 'bg-green-100 text-green-800';
      case 'creative':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemplateLabel = (template: string) => {
    switch (template) {
      case 'modern':
        return 'مدرن';
      case 'classic':
        return 'کلاسیک';
      case 'minimal':
        return 'مینیمال';
      case 'creative':
        return 'خلاق';
      default:
        return template;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days === 0) {
      if (hours === 0) return 'همین الان';
      return `${hours} ساعت پیش`;
    }
    if (days === 1) return '۱ روز پیش';
    if (days < 7) return `${days} روز پیش`;
    return formatDate(date);
  };

  // Calculate resume completion percentage
  const calculateCompletion = (resume: Resume) => {
    let total = 0;
    let completed = 0;

    // Personal Info
    const personalFields = ['firstName', 'lastName', 'email'];
    if (!resume?.personalInfo) return 0
    personalFields.forEach(field => {
      total++;
      if (resume?.personalInfo && resume?.personalInfo[field as keyof typeof resume.personalInfo]) completed++;
    });

    // Summary
    total++;
    if (resume?.personalInfo.summary) completed++;

    // Experience
    total++;
    if (resume?.experience && resume.experience.length > 0) completed++;

    // Education
    total++;
    if (resume?.education && resume.education.length > 0) completed++;

    // Skills
    total++;
    if (resume?.skills && resume.skills.length > 0) completed++;

    // Calculate percentage
    return Math.round((completed / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl" >
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-64">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            رزومه‌های من
          </h1>
          <p className="text-gray-600">
            با استفاده از قالب‌های داخلی، چندین نسخه رزومه ایجاد و مدیریت کنید
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          ایجاد رزومه جدید
        </Button>
      </div>

      {/* Default Resume Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">رزومه پیش‌فرض:</span>
          <span>
            {resumes?.find((r: Resume) => r.isDefault)?.title || 'هیچ رزومه پیش‌فرضی تنظیم نشده است'}
          </span>
          <span className="text-blue-600 text-xs mr-2">
            زمانی که بدون انتخاب نسخه، درخواست می‌دهید از این رزومه استفاده می‌شود.
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="جستجوی رزومه‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9 text-right"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">همه</TabsTrigger>
              <TabsTrigger value="active">فعال</TabsTrigger>
              <TabsTrigger value="draft">پیش‌نویس‌ها</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredResumes?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'هیچ رزومه‌ای با جستجوی شما مطابقت ندارد' : 'هنوز رزومه‌ای ایجاد نشده است'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'سعی کنید عبارت جستجو را تغییر دهید'
                : 'اولین رزومه خود را ایجاد کنید تا شروع به درخواست شغل کنید'}
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                پاک کردن جستجو
              </Button>
            ) : (
              <Button onClick={() => setCreateModalOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                ایجاد اولین رزومه
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resume Grid */}
      {filteredResumes && filteredResumes?.length > 0 && (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
          : 'space-y-4'
        }>
          {filteredResumes?.map((resume: Resume) => {
            const completion = calculateCompletion(resume);
            const isDefault = resume.isDefault;

            return (
              <Card key={resume._id} className={`hover:shadow-lg transition-shadow ${isDefault ? 'border-blue-300 border-2' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {resume.title}
                        </h3>
                        {isDefault && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            <Star className="w-3 h-3 ml-1 fill-current" />
                            پیش‌فرض
                          </Badge>
                        )}
                      </div>
                      {resume?.personalInfo && <p className="text-sm text-gray-500 text-right">
                        {resume?.personalInfo?.firstName} {resume?.personalInfo?.lastName} • {resume?.personalInfo?.title || 'بدون عنوان'}
                      </p>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className='w-56'>
                        <DropdownMenuItem onClick={() => handlePreview(resume)}>
                          <Eye className="w-4 h-4 ml-2" />
                          مشاهده و خروجی
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/resumes/${resume._id}/edit`)}>
                          <Edit2 className="w-4 h-4 ml-2" />
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetDefault(resume._id)}>
                          {isDefault ? (
                            <>
                              <StarOff className="w-4 h-4 ml-2" />
                              حذف پیش‌فرض
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 ml-2" />
                              تنظیم به عنوان پیش‌فرض
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          resumeService.downloadPDF(resume._id);
                        }}>
                          <Download className="w-4 h-4 ml-2" />
                          دانلود PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          router.push(`/resumes/${resume._id}`);
                        }}>
                          <Eye className="w-4 h-4 ml-2" />
                          پیش‌نمایش PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Sparkles className="w-4 h-4 ml-2" />
                          بازخورد شغلی هوش مصنوعی
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(resume)}
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Completion Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">تکمیل</span>
                      <span className="font-medium text-gray-900">{completion}%</span>
                    </div>
                    <Progress value={completion} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {getTimeAgo(resume.updatedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      {resume.visibility === 'public' ? (
                        <Globe className="w-3 h-3" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                      {resume?.visibility && resume?.visibility?.toUpperCase()}
                    </span>
                    <Badge className={getTemplateColor(resume.template)} variant="outline">
                      {getTemplateLabel(resume.template)}
                    </Badge>
                  </div>

                  {/* Stats Count */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {resume.experience?.length || 0} سابقه کاری
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {resume.education?.length || 0} تحصیلات
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {resume.skills?.length || 0} مهارت
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(resume)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 ml-1" />
                        مشاهده
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/resumes/${resume._id}/edit`)}
                        className="text-xs"
                      >
                        <Edit2 className="w-3 h-3 ml-1" />
                        ویرایش
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSetDefault(resume._id)}
                      variant={isDefault ? 'secondary' : 'ghost'}
                      className="text-xs"
                    >
                      {isDefault ? (
                        'پیش‌فرض ✓'
                      ) : (
                        'تنظیم به عنوان پیش‌فرض'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center border-t pt-8">
        <h3 className="text-sm font-medium text-gray-900 mb-2">درباره قالب‌های ما</h3>
        <p className="text-sm text-gray-500">
          از بین قالب‌های طراحی شده حرفه‌ای برای نمایش مهارت‌ها و تجربه خود انتخاب کنید.
          هر قالب برای سیستم‌های ATS و مدیران استخدام بهینه شده است.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Badge variant="outline" className="text-xs">مدرن</Badge>
          <Badge variant="outline" className="text-xs">کلاسیک</Badge>
          <Badge variant="outline" className="text-xs">مینیمال</Badge>
          <Badge variant="outline" className="text-xs">خلاق</Badge>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف رزومه</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید این رزومه را حذف کنید؟ این عمل قابل بازگشت نیست.
              {selectedResume && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedResume.title}</p>
                  <p className="text-sm text-gray-500">
                    {selectedResume.personalInfo.firstName} {selectedResume.personalInfo.lastName}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال حذف...
                </>
              ) : (
                'حذف رزومه'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="w-screen max-w-screen max-h-[95vh] overflow-hidden p-0 sm:p-0 md:p-1">
          <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6 shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              پیش‌نمایش رزومه
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              رزومه خود را در قالب‌های مختلف پیش‌نمایش کنید و به صورت PDF خروجی بگیرید
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4">
            {previewResume && (
              <TemplatePreview
                resume={previewResume}
                onExport={() => {
                  // Handle export complete
                }}
              />
            )}
          </div>

          <DialogFooter className="px-4 pb-4 sm:px-6 sm:pb-6 shrink-0">
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
              className="w-full sm:w-auto text-sm"
            >
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Resume Modal */}
      <CreateResumeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}