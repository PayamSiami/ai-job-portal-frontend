"use client";

import React from "react";
import { ResumeBuilder } from "@/components/resume/resume-builder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ResumesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600">Create and manage your resumes</p>
        </div>
        <Link href="/resumes/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Resume
          </Button>
        </Link>
      </div>

      <ResumeBuilder />
    </div>
  );
}
