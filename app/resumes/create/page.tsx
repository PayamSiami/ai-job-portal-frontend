'use client';

import { ResumeBuilder } from '@/components/resume/resume-builder';
import React from 'react';

export default function CreateResumePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ResumeBuilder mode="create" />
    </div>
  );
}