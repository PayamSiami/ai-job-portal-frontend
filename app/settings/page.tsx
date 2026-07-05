/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    User,
    Lock,
    Bell,
    Shield,
    Save,
    Loader2,
    Camera,
    AlertCircle,
    Trash2,
    ChevronRight,
    Key,
    Eye,
    EyeOff,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '@/lib/services/user.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
} from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod schemas
const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    location: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const notificationSchema = z.object({
    emailNotifications: z.boolean(),
    jobAlerts: z.boolean(),
    applicationUpdates: z.boolean(),
    marketingEmails: z.boolean(),
    pushNotifications: z.boolean(),
    weeklyDigest: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Fetch user profile
    const { data: userData, isLoading, refetch } = useQuery({
        queryKey: ['user-profile'],
        queryFn: () => userService.getProfile(),
    });

    // Profile form
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            bio: '',
            location: '',
            company: '',
            title: '',
            website: '',
        },
    });

    // Password form
    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    // Notification form
    const notificationForm = useForm<NotificationFormData>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            emailNotifications: true,
            jobAlerts: true,
            applicationUpdates: true,
            marketingEmails: false,
            pushNotifications: true,
            weeklyDigest: false,
        },
    });

    // Update profile when data loads
    useEffect(() => {
        if (userData?.data) {
            const { profile } = userData?.data;
            profileForm.reset({
                lastName: profile.firstName || '',
                firstName: profile.lastName || '',
                email: userData?.data.email || '',
                phone: profile.phone || '',
                bio: profile.bio || '',
                location: profile.location || '',
                company: profile.company || '',
                title: profile.title || '',
                website: profile.website || '',
            });

            // if (user.notificationPreferences) {
            //     notificationForm.reset({
            //         emailNotifications: user.notificationPreferences.emailNotifications ?? true,
            //         jobAlerts: user.notificationPreferences.jobAlerts ?? true,
            //         applicationUpdates: user.notificationPreferences.applicationUpdates ?? true,
            //         marketingEmails: user.notificationPreferences.marketingEmails ?? false,
            //         pushNotifications: user.notificationPreferences.pushNotifications ?? true,
            //         weeklyDigest: user.notificationPreferences.weeklyDigest ?? false,
            //     });
            // }
        }
    }, [userData, profileForm, notificationForm]);

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (data: ProfileFormData) => {
            const payload = { profile: data };
            return userService.updateProfile(payload);
        },
        onSuccess: () => {
            toast.success('Profile updated successfully');
            refetch();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || 'Failed to update profile');
        },
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: (data: PasswordFormData) => userService.changePassword(data),
        onSuccess: () => {
            toast.success('Password changed successfully');
            passwordForm.reset();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || 'Failed to change password');
        },
    });

    // Update notifications mutation
    const updateNotificationsMutation = useMutation({
        mutationFn: (data: NotificationFormData) => userService.updateNotifications(data),
        onSuccess: () => {
            toast.success('Notification preferences updated');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || 'Failed to update notifications');
        },
    });

    // Upload avatar mutation
    const uploadAvatarMutation = useMutation({
        mutationFn: (file: File) => userService.uploadAvatar(file),
        onSuccess: () => {
            toast.success('Avatar updated successfully');
            setAvatarFile(null);
            setAvatarPreview(null);
            refetch();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || 'Failed to upload avatar');
        },
    });

    // Delete account mutation
    const deleteAccountMutation = useMutation({
        mutationFn: () => userService.deleteAccount(),
        onSuccess: () => {
            toast.success('Account deleted successfully');
            localStorage.removeItem('token');
            router.push('/');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || 'Failed to delete account');
        },
    });

    // Handle profile submit
    const onProfileSubmit = (data: ProfileFormData) => {
        updateProfileMutation.mutate(data);
    };

    // Handle password submit
    const onPasswordSubmit = (data: PasswordFormData) => {
        changePasswordMutation.mutate(data);
    };

    // Handle notifications submit
    const onNotificationsSubmit = (data: NotificationFormData) => {
        updateNotificationsMutation.mutate(data);
    };

    // Handle avatar upload
    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarSave = () => {
        if (avatarFile) {
            uploadAvatarMutation.mutate(avatarFile);
        }
    };

    const handleAvatarCancel = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const getInitials = (name: string) => {
        return name
            ?.split(' ')
            ?.map((n) => n[0])
            ?.join('')
            ?.toUpperCase() || 'U';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    const user = userData?.user;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600">Manage your account preferences and settings</p>
                </div>
                <Badge variant="outline" className="px-4 py-2">
                    {user?.role || 'User'}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 border-4 border-blue-100">
                                        <AvatarImage src={avatarPreview || user?.avatar} />
                                        <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                                            {getInitials(user?.fullName || 'User')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                                        <Camera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                        />
                                    </label>
                                </div>
                                {avatarFile && (
                                    <div className="flex gap-2 mt-2">
                                        <Button size="sm" onClick={handleAvatarSave} className="h-8">
                                            Save
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleAvatarCancel} className="h-8">
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                                <h3 className="mt-3 font-semibold text-gray-900">
                                    {user?.fullName || 'User'}
                                </h3>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>

                            <Separator className="my-4" />

                            <nav className="space-y-1">
                                {[
                                    { id: 'profile', label: 'Profile', icon: User },
                                    { id: 'account', label: 'Account', icon: Shield },
                                    { id: 'notifications', label: 'Notifications', icon: Bell },
                                    { id: 'security', label: 'Security', icon: Lock },
                                ].map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === id
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{label}</span>
                                        {activeTab === id && (
                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </nav>

                            <Separator className="my-4" />

                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        Update your personal information and public profile
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...profileForm}>
                                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={profileForm.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="John" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="lastName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Last Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Doe" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={profileForm.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} type="email" placeholder="john@example.com" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="+1 234 567 890" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={profileForm.control}
                                                    name="location"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Location</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="San Francisco, CA" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="company"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Company</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Company Name" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Job Title</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Senior Developer" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={profileForm.control}
                                                name="website"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Website</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="https://yourwebsite.com" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={profileForm.control}
                                                name="bio"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Bio</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                placeholder="Tell us about yourself..."
                                                                className="min-h-[100px]"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Brief description for your profile (max 500 characters)
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                disabled={updateProfileMutation.isPending}
                                            >
                                                {updateProfileMutation.isPending ? (
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
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Account Tab */}
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>
                                        Manage your account preferences and language settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Language</Label>
                                                <p className="text-sm text-gray-500">Choose your preferred language</p>
                                            </div>
                                            <Select defaultValue="en">
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Spanish</SelectItem>
                                                    <SelectItem value="fr">French</SelectItem>
                                                    <SelectItem value="de">German</SelectItem>
                                                    <SelectItem value="zh">Chinese</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Timezone</Label>
                                                <p className="text-sm text-gray-500">Set your local timezone</p>
                                            </div>
                                            <Select defaultValue="utc-8">
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Select timezone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="utc-8">Pacific Time</SelectItem>
                                                    <SelectItem value="utc-5">Eastern Time</SelectItem>
                                                    <SelectItem value="utc+0">UTC</SelectItem>
                                                    <SelectItem value="utc+1">Central European</SelectItem>
                                                    <SelectItem value="utc+8">China Standard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Theme</Label>
                                                <p className="text-sm text-gray-500">Choose your preferred theme</p>
                                            </div>
                                            <Select defaultValue="light">
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Select theme" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="system">System</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Two-Factor Authentication</Label>
                                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>
                                        Choose what notifications you want to receive
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...notificationForm}>
                                        <form onSubmit={notificationForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                                            <div className="space-y-4">
                                                <FormField
                                                    control={notificationForm.control}
                                                    name="emailNotifications"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div>
                                                                <FormLabel>Email Notifications</FormLabel>
                                                                <FormDescription>
                                                                    Receive notifications via email
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <Separator />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="jobAlerts"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div>
                                                                <FormLabel>Job Alerts</FormLabel>
                                                                <FormDescription>
                                                                    Get notified about new job matches
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <Separator />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="applicationUpdates"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div>
                                                                <FormLabel>Application Updates</FormLabel>
                                                                <FormDescription>
                                                                    Receive updates on your job applications
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <Separator />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="marketingEmails"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div>
                                                                <FormLabel>Marketing Emails</FormLabel>
                                                                <FormDescription>
                                                                    Receive promotional and marketing emails
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <Separator />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="pushNotifications"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div>
                                                                <FormLabel>Push Notifications</FormLabel>
                                                                <FormDescription>
                                                                    Receive push notifications in your browser
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <Separator />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="weeklyDigest"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between">
                                                            <div>
                                                                <FormLabel>Weekly Digest</FormLabel>
                                                                <FormDescription>
                                                                    Receive a weekly summary of activity
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={updateNotificationsMutation.isPending}
                                            >
                                                {updateNotificationsMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Save Preferences
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security</CardTitle>
                                    <CardDescription>
                                        Change your password and manage security settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...passwordForm}>
                                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                            <FormField
                                                control={passwordForm.control}
                                                name="currentPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Current Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    {...field}
                                                                    type={showPassword ? 'text' : 'password'}
                                                                    placeholder="Enter current password"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOff className="w-4 h-4" />
                                                                    ) : (
                                                                        <Eye className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={passwordForm.control}
                                                name="newPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>New Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    {...field}
                                                                    type={showNewPassword ? 'text' : 'password'}
                                                                    placeholder="Enter new password"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                                >
                                                                    {showNewPassword ? (
                                                                        <EyeOff className="w-4 h-4" />
                                                                    ) : (
                                                                        <Eye className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Password must be at least 8 characters long
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={passwordForm.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Confirm New Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    {...field}
                                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                                    placeholder="Confirm new password"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                >
                                                                    {showConfirmPassword ? (
                                                                        <EyeOff className="w-4 h-4" />
                                                                    ) : (
                                                                        <Eye className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                disabled={changePasswordMutation.isPending}
                                            >
                                                {changePasswordMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Changing Password...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Key className="w-4 h-4 mr-2" />
                                                        Change Password
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>

                                    <Separator className="my-6" />

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Active Sessions</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <div>
                                                        <p className="text-sm font-medium">Current Session</p>
                                                        <p className="text-xs text-gray-500">Chrome • Windows • IP: 192.168.1.1</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                    <div>
                                                        <p className="text-sm font-medium">Mobile Device</p>
                                                        <p className="text-xs text-gray-500">Safari • iOS • Last active: 2 days ago</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">Revoke</Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Delete Account Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your account? This action cannot be undone.
                            All your data, including jobs, applications, and profile information will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This action is permanent and cannot be reversed.
                        </AlertDescription>
                    </Alert>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteAccountMutation.mutate()}
                            disabled={deleteAccountMutation.isPending}
                        >
                            {deleteAccountMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}