'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useResume } from '@/lib/hooks/use-resume';
import { PersonalInfo } from '@/lib/types/resume.types';

// Define the schema with all fields explicitly
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  headline: z.string().default(''),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  city: z.string().default(''),
  country: z.string().default(''),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  resumeId: string;
  initialData?: PersonalInfo;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  resumeId,
  initialData,
}) => {
  const { updatePersonalInfo } = useResume();

  // Create a complete default values object
  const defaultValues: PersonalInfoFormData = {
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    headline: initialData?.headline || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    githubUrl: initialData?.githubUrl || '',
    portfolioUrl: initialData?.portfolioUrl || '',
    websiteUrl: initialData?.websiteUrl || '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        headline: initialData.headline || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        city: initialData.city || '',
        country: initialData.country || '',
        linkedinUrl: initialData.linkedinUrl || '',
        githubUrl: initialData.githubUrl || '',
        portfolioUrl: initialData.portfolioUrl || '',
        websiteUrl: initialData.websiteUrl || '',
      });
    }
  }, [initialData, reset]);

  // Define the submit handler with proper type
  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      // Clean data - remove empty strings for optional fields
      const cleanedData: Partial<PersonalInfo> = {};
      
      // Include all required fields
      cleanedData.firstName = data.firstName;
      cleanedData.lastName = data.lastName;
      cleanedData.email = data.email;
      cleanedData.phone = data.phone;
      
      // Only include optional fields if they have values
      if (data.headline) cleanedData.headline = data.headline;
      if (data.city) cleanedData.city = data.city;
      if (data.country) cleanedData.country = data.country;
      if (data.linkedinUrl) cleanedData.linkedinUrl = data.linkedinUrl;
      if (data.githubUrl) cleanedData.githubUrl = data.githubUrl;
      if (data.portfolioUrl) cleanedData.portfolioUrl = data.portfolioUrl;
      if (data.websiteUrl) cleanedData.websiteUrl = data.websiteUrl;
      
      await updatePersonalInfo.mutateAsync({
        id: resumeId,
        data: cleanedData,
      });
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to update personal info:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input
                {...register('firstName')}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input
                {...register('lastName')}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Headline</label>
            <Input
              {...register('headline')}
              placeholder="e.g., Full Stack Developer"
            />
            {errors.headline && (
              <p className="text-sm text-red-500">{errors.headline.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">City</label>
              <Input {...register('city')} />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Input {...register('country')} />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">LinkedIn URL</label>
            <Input
              {...register('linkedinUrl')}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedinUrl && (
              <p className="text-sm text-red-500">{errors.linkedinUrl.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">GitHub URL</label>
            <Input
              {...register('githubUrl')}
              placeholder="https://github.com/username"
            />
            {errors.githubUrl && (
              <p className="text-sm text-red-500">{errors.githubUrl.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Portfolio URL</label>
            <Input
              {...register('portfolioUrl')}
              placeholder="https://yourportfolio.com"
            />
            {errors.portfolioUrl && (
              <p className="text-sm text-red-500">{errors.portfolioUrl.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Website URL</label>
            <Input
              {...register('websiteUrl')}
              placeholder="https://yourwebsite.com"
            />
            {errors.websiteUrl && (
              <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Personal Information'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};