'use client';

import dynamic from 'next/dynamic';
import { Resume } from '@/lib/services/resume.service';

// Dynamically import templates to avoid SSR issues
export const ModernTemplate = dynamic(
  () => import('./ModernTemplate').then(mod => mod.ModernTemplate),
  { ssr: false }
);

export const ClassicTemplate = dynamic(
  () => import('./ClassicTemplate').then(mod => mod.ClassicTemplate),
  { ssr: false }
);

export const MinimalTemplate = dynamic(
  () => import('./MinimalTemplate').then(mod => mod.MinimalTemplate),
  { ssr: false }
);

export const CreativeTemplate = dynamic(
  () => import('./CreativeTemplate').then(mod => mod.CreativeTemplate),
  { ssr: false }
);

export const TEMPLATES = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
};

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'creative';

export interface TemplateProps {
  resume: Resume;
  preview?: boolean;
}