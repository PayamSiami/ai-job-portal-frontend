'use client';

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

export default function ProfilePage() {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Failed to load profile</p>
          <Button className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // If no profile data, show empty state
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-600">No profile data available</p>
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
    } catch (error) {
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
      } catch (error) {
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
        toast.success('Skills updated successfully!');
      } catch (error) {
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

  console.log({ displayProfile })
  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      JOB_SEEKER: 'bg-blue-100 text-blue-800',
      EMPLOYER: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-red-100 text-red-800',
    };
    return styles[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: boolean) => {
    if (status) return 'bg-green-100 text-green-800'
    else return 'bg-yellow-100 text-yellow-800'
  };

  const isImageUploading = uploadProfileImage.isPending;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
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
                  <AvatarImage src={displayProfile.profile.profileImage} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {getInitials(displayProfile?.profile?.fullName)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
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
                  {displayProfile.role.replace('_', ' ')}
                </Badge>
                <Badge className={getStatusBadge(displayProfile.isActive)}>
                  {displayProfile.isActive ? "Active" : "Deactivate"}
                </Badge>
              </div>

              {displayProfile.profile.bio && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">{displayProfile.profile.bio}</p>
              )}

              <Separator className="my-4" />

              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{displayProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{displayProfile.profile.phone}</span>
                </div>
                {displayProfile.profile.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{displayProfile.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Joined {new Date(displayProfile.createdAt).toLocaleDateString()}</span>
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
              <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    Jobs Applied
                  </span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    Saved Jobs
                  </span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Resumes
                  </span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    Skills
                  </span>
                  <span className="font-semibold">{displayProfile.profile.skills?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={editableProfile?.profile.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700">{displayProfile.profile.bio || 'No bio added yet.'}</p>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div>
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input
                        id="skills"
                        value={editableProfile?.profile.skills?.join(', ') || ''}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        placeholder="React, TypeScript, Node.js"
                      />
                      <Button className="mt-2" onClick={handleSkillsSave} size="sm">
                        Save Skills
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
                        <p className="text-gray-500 text-sm">No skills added yet.</p>
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
                    Location & Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editableProfile?.profile.location || ''}
                          onChange={(e) => handleChange('location', e.target.value)}
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={editableProfile?.profile.website || ''}
                          onChange={(e) => handleChange('website', e.target.value)}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={editableProfile?.profile.linkedin || ''}
                          onChange={(e) => handleChange('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={editableProfile?.profile.github || ''}
                          onChange={(e) => handleChange('github', e.target.value)}
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={editableProfile?.profile.twitter || ''}
                          onChange={(e) => handleChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      {displayProfile.profile.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{displayProfile.profile.location}</span>
                        </div>
                      )}
                      {displayProfile.profile.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <a
                            href={displayProfile.profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {displayProfile.profile.website}
                          </a>
                        </div>
                      )}
                      {displayProfile.profile.linkedin && (
                        <div className="flex items-center gap-2 text-sm">
                          <FaLinkedin className="w-4 h-4 text-gray-400" />
                          <a
                            href={displayProfile.profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {displayProfile.profile.github && (
                        <div className="flex items-center gap-2 text-sm">
                          <FaGithub className="w-4 h-4 text-gray-400" />
                          <a
                            href={displayProfile.profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            GitHub Profile
                          </a>
                        </div>
                      )}
                      {displayProfile.profile.twitter && (
                        <div className="flex items-center gap-2 text-sm">
                          <FaTwitter className="w-4 h-4 text-gray-400" />
                          <a
                            href={displayProfile.profile.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Twitter Profile
                          </a>
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
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {displayProfile.profile.experience && displayProfile.profile.experience.length > 0 ? (
                    displayProfile.profile.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4 pb-6 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <Badge variant={exp.current ? 'default' : 'secondary'}>
                            {exp.current ? 'Current' : 'Past'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(exp.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                          {exp.endDate
                            ? ` - ${new Date(exp.endDate).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}`
                            : ' - Present'}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
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
                    <p className="text-gray-500 text-center py-4">No work experience added yet.</p>
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
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {displayProfile.profile.education && displayProfile.profile.education.length > 0 ? (
                    displayProfile.profile.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-purple-200 pl-4 pb-6 last:pb-0">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(edu.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                          {edu.endDate
                            ? ` - ${new Date(edu.endDate).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}`
                            : ' - Present'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No education added yet.</p>
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