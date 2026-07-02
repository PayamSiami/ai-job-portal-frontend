import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number');

export const urlSchema = z.string().url('Invalid URL');

export const jobTitleSchema = z
  .string()
  .min(3, 'Job title must be at least 3 characters')
  .max(100, 'Job title must be less than 100 characters');

export const salarySchema = z
  .number()
  .min(0, 'Salary must be positive')
  .max(10000000, 'Salary must be less than 10,000,000');

export const experienceLevelSchema = z.enum([
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
  'executive',
]);

export const workModeSchema = z.enum(['remote', 'hybrid', 'on-site']);

export const jobTypeSchema = z.enum([
  'full-time',
  'part-time',
  'contract',
  'internship',
  'freelance',
]);

export const validateEmail = (email: string) => emailSchema.safeParse(email);
export const validatePassword = (password: string) => passwordSchema.safeParse(password);
export const validatePhone = (phone: string) => phoneSchema.safeParse(phone);
export const validateUrl = (url: string) => urlSchema.safeParse(url);