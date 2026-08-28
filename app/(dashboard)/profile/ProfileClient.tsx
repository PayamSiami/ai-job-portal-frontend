"use client";

import React, { useState, useMemo } from 'react';
import { useProfile } from '@/lib/hooks/use-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  CheckCircle,
  Loader2,
  Users,
  FileText,
  Award,
  Globe,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { UserProfile as UserProfileType } from '@/lib/types/profile.types';

export default function ProfileClient() {
  const { useGetProfile, updateProfile, uploadProfileImage, updateSkills } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch profile data
  const { data, isLoading, error, refetch } = useGetProfile();

  // ✅ Calculate profile during rendering - no Effect needed!
  // This is the key fix - use the data directly or useMemo
  const profile = useMemo(() => {
    return data || null;
  }, [data]);

  // For editing, we need a separate state that can be modified
  const [editableProfile, setEditableProfile] = useState<UserProfileType | null>(null);

  // When entering edit mode, copy the profile data
  const handleEdit = () => {
    if (profile) {
      setEditableProfile(profile);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableProfile(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">در حال بارگذاری پروفایل...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">بارگذاری پروفایل با شکست مواجه شد</p>
          <Button className="mt-4" onClick={() => refetch()}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  // If no profile data, show empty state
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen" >
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-600">داده‌ای برای پروفایل موجود نیست</p>
        </div>
      </div>
    );
  }

  // Use editableProfile when editing, otherwise use profile
  const displayProfile = isEditing && editableProfile ? editableProfile : profile;

  const handleSave = async () => {
    if (!editableProfile) return;

    setIsSaving(true);
    try {
      const updateData = {
        fullName: editableProfile.profile.fullName,
        phone: editableProfile.profile.phone,
        bio: editableProfile.profile.bio,
        location: editableProfile.profile.location,
        website: editableProfile.profile.website,
        linkedin: editableProfile.profile.linkedin,
        github: editableProfile.profile.github,
        twitter: editableProfile.profile.twitter,
      };

      await updateProfile.mutateAsync(updateData);
      setIsEditing(false);
      setEditableProfile(null);
    } catch {
      // Error is handled in the mutation
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && profile) {
      try {
        await uploadProfileImage.mutateAsync(file);
        // Refetch profile to get updated image
        await refetch();
      } catch {
        // Error is handled in the mutation
      }
    }
  };

  // Handle string field changes in edit mode
  const handleChange = (field: keyof UserProfileType['profile'], value: string) => {
    if (editableProfile) {
      setEditableProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [field]: value
          }
        };
      });
    }
  };

  // Handle array field changes (for skills) in edit mode
  const handleSkillsChange = (value: string) => {
    if (editableProfile) {
      const skillsArray = value.split(',').map((s) => s.trim()).filter((s) => s !== '');
      setEditableProfile((prev) => {
        if (!prev) return prev;
        return { ...prev, skills: skillsArray };
      });
    }
  };

  const handleSkillsSave = async () => {
    if (editableProfile && editableProfile.profile.skills) {
      try {
        await updateSkills.mutateAsync(editableProfile.profile.skills);
        toast.success('مهارت‌ها با موفقیت بروزرسانی شدند!');
      } catch {
        // Error is handled in the mutation
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      ?.map((n) => n[0])
      ?.join('')
      ?.toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      "job-seeker": 'bg-blue-100 text-blue-800',
      "employer": 'bg-purple-100 text-purple-800',
    };
    return styles[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      "job-seeker": 'جوینده کار',
      "employer": 'کارفرما',
    };
    return labels[role] || role.replace('_', ' ');
  };

  const getStatusBadge = (status: boolean) => {
    if (status) return 'bg-green-100 text-green-800'
    else return 'bg-yellow-100 text-yellow-800'
  };

  const getStatusLabel = (status: boolean) => {
    return status ? 'فعال' : 'غیرفعال';
  };

  const isImageUploading = uploadProfileImage.isPending;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">پروفایل</h1>
          <p className="text-gray-600">اطلاعات شخصی و تنظیمات خود را مدیریت کنید</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="w-4 h-4 ml-2" />
                انصراف
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    ذخیره تغییرات
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit2 className="w-4 h-4 ml-2" />
              ویرایش پروفایل
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 mx-auto border-4 border-blue-100">
                  <AvatarImage
                    src={displayProfile.profile.profileImage}
                    alt={displayProfile?.profile?.fullName || 'پروفایل کاربری'}
                    loading="lazy"
                    decoding="async"
                  />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {getInitials(displayProfile?.profile?.fullName)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 left-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isImageUploading}
                    />
                  </label>
                )}
              </div>

              <h2 className="text-xl font-semibold mt-4">{displayProfile.profile.fullName}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge className={getRoleBadge(displayProfile.role)}>
                  {getRoleLabel(displayProfile.role)}
                </Badge>
                <Badge className={getStatusBadge(displayProfile.isActive)}>
                  {getStatusLabel(displayProfile.isActive)}
                </Badge>
              </div>

              {displayProfile.profile.bio && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">{displayProfile.profile.bio}</p>
              )}

              <Separator className="my-4" />

              <div className="space-y-2 text-sm text-right">
                <div className="flex items-center gap-2 text-gray-600 justify-end">
                  <span>{displayProfile.email}</span>
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2 text-gray-600 justify-end">
                  <span>{displayProfile.profile.phone}</span>
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                {displayProfile.profile.location && (
                  <div className="flex items-center gap-2 text-gray-600 justify-end">
                    <span>{displayProfile.profile.location}</span>
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600 justify-end">
                  <span>عضویت در {new Date(displayProfile.createdAt).toLocaleDateString('fa-IR')}</span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3">
                {displayProfile.profile.github && (
                  <a
                    href={displayProfile.profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                )}
                {displayProfile.profile.linkedin && (
                  <a
                    href={displayProfile.profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                )}
                {displayProfile.profile.twitter && (
                  <a
                    href={displayProfile.profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                )}
                {displayProfile.profile.website && (
                  <a
                    href={displayProfile.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">آمار</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    مشاغل درخواست داده
                  </span>
                  <span className="font-semibold">۲۴</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    مشاغل ذخیره شده
                  </span>
                  <span className="font-semibold">۱۲</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    رزومه‌ها
                  </span>
                  <span className="font-semibold">۳</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    مهارت‌ها
                  </span>
                  <span className="font-semibold">{displayProfile.profile.skills?.length || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">نمای کلی</TabsTrigger>
              <TabsTrigger value="experience">سابقه کاری</TabsTrigger>
              <TabsTrigger value="education">تحصیلات</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    درباره من
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div>
                      <Label htmlFor="bio">بیوگرافی</Label>
                      <textarea
                        id="bio"
                        value={editableProfile?.profile.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-right"
                        placeholder="درباره خودتان بگویید..."
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700 text-right">{displayProfile.profile.bio || 'هنوز بیوگرافی اضافه نشده است.'}</p>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    مهارت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div>
                      <Label htmlFor="skills">مهارت‌ها (با کاما جدا کنید)</Label>
                      <Input
                        id="skills"
                        value={editableProfile?.profile.skills?.join('، ') || ''}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        placeholder="React، TypeScript، Node.js"
                        className="text-right"
                      />
                      <Button className="mt-2" onClick={handleSkillsSave} size="sm">
                        ذخیره مهارت‌ها
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {displayProfile.profile.skills && displayProfile.profile.skills.length > 0 ? (
                        displayProfile.profile.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-sm">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">هنوز مهارتی اضافه نشده است.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location & Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    موقعیت و لینک‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="location">موقعیت مکانی</Label>
                        <Input
                          id="location"
                          value={editableProfile?.profile.location || ''}
                          onChange={(e) => handleChange('location', e.target.value)}
                          placeholder="شهر، کشور"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">وب‌سایت</Label>
                        <Input
                          id="website"
                          value={editableProfile?.profile.website || ''}
                          onChange={(e) => handleChange('website', e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">لینکدین</Label>
                        <Input
                          id="linkedin"
                          value={editableProfile?.profile.linkedin || ''}
                          onChange={(e) => handleChange('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">گیت‌هاب</Label>
                        <Input
                          id="github"
                          value={editableProfile?.profile.github || ''}
                          onChange={(e) => handleChange('github', e.target.value)}
                          placeholder="https://github.com/username"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">توییتر</Label>
                        <Input
                          id="twitter"
                          value={editableProfile?.profile.twitter || ''}
                          onChange={(e) => handleChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/username"
                          className="text-right"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 text-right">
                      {displayProfile.profile.location && (
                        <div className="flex items-center gap-2 text-sm justify-end">
                          <span className="text-gray-700">{displayProfile.profile.location}</span>
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      {displayProfile.profile.website && (
                        <div className="flex items-center gap-2 text-sm justify-end">
                          <a
                            href={displayProfile.profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {displayProfile.profile.website}
                          </a>
                          <Globe className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      {displayProfile.profile.linkedin && (
                        <div className="flex items-center gap-2 text-sm justify-end">
                          <a
                            href={displayProfile.profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            پروفایل لینکدین
                          </a>
                          <FaLinkedin className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      {displayProfile.profile.github && (
                        <div className="flex items-center gap-2 text-sm justify-end">
                          <a
                            href={displayProfile.profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            پروفایل گیت‌هاب
                          </a>
                          <FaGithub className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      {displayProfile.profile.twitter && (
                        <div className="flex items-center gap-2 text-sm justify-end">
                          <a
                            href={displayProfile.profile.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            پروفایل توییتر
                          </a>
                          <FaTwitter className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    سابقه کاری
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {displayProfile.profile.experience && displayProfile.profile.experience.length > 0 ? (
                    displayProfile.profile.experience.map((exp, index) => (
                      <div key={index} className="border-r-2 border-blue-200 pr-4 pb-6 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-right">{exp.title}</h4>
                            <p className="text-gray-600 text-right">{exp.company}</p>
                          </div>
                          <Badge variant={exp.current ? 'default' : 'secondary'}>
                            {exp.current ? 'فعلی' : 'گذشته'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 text-right">
                          {new Date(exp.startDate).toLocaleDateString('fa-IR', {
                            month: 'long',
                            year: 'numeric',
                          })}
                          {exp.endDate
                            ? ` - ${new Date(exp.endDate).toLocaleDateString('fa-IR', {
                              month: 'long',
                              year: 'numeric',
                            })}`
                            : ' - تاکنون'}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-2 text-right">{exp.description}</p>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">هنوز سابقه کاری اضافه نشده است.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    تحصیلات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {displayProfile.profile.education && displayProfile.profile.education.length > 0 ? (
                    displayProfile.profile.education.map((edu, index) => (
                      <div key={index} className="border-r-2 border-purple-200 pr-4 pb-6 last:pb-0">
                        <h4 className="font-semibold text-gray-900 text-right">{edu.degree}</h4>
                        <p className="text-gray-600 text-right">{edu.institution}</p>
                        <p className="text-sm text-gray-500 mt-1 text-right">
                          {new Date(edu.startDate).toLocaleDateString('fa-IR', {
                            month: 'long',
                            year: 'numeric',
                          })}
                          {edu.endDate
                            ? ` - ${new Date(edu.endDate).toLocaleDateString('fa-IR', {
                              month: 'long',
                              year: 'numeric',
                            })}`
                            : ' - تاکنون'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">هنوز تحصیلاتی اضافه نشده است.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}