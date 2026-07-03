"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoForm } from "./personal-info-form";
import { EducationForm } from "./education-form";
import { WorkExperienceForm } from "./work-experience-form";
import { SkillsForm } from "./skills-form";
import { ResumePreview } from "./resume-preview";
import { AIResumeAnalyzer } from "./ai-resume-analyzer";
import { useResume } from "@/lib/hooks/use-resume";
import { Loader2, Sparkles, Eye, Download } from "lucide-react";
import toast from "react-hot-toast";

const resumeSchema = z.object({
  title: z.string().min(1, "Resume title is required"),
  template: z.enum(["classic", "modern", "creative", "professional"]),
  visibility: z.enum(["public", "private", "link-only"]),
});

type ResumeFormData = z.infer<typeof resumeSchema>;

export const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isGenerating, setIsGenerating] = useState(false);
  const { createResume, currentResume } = useResume();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      template: "professional",
      visibility: "public",
    },
  });

  const template = watch("template");

  const onSubmit = async (data: ResumeFormData) => {
    try {
      await createResume.mutateAsync(data);
      toast.success("Resume created successfully!");
    } catch (error) {
      toast.error("Failed to create resume");
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("AI generated content successfully!");
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const isCreating = createResume.isPending;

  // Helper to convert undefined to null for the PersonalInfoForm
  const personalInfoData = currentResume?.personalInfo ?? null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600">
            Create a professional resume with AI assistance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleAIGenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            AI Generate
          </Button>
          <Button className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resume Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Resume Title</label>
                    <Input
                      {...register("title")}
                      placeholder="e.g., Full Stack Developer Resume"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Template</label>
                      <select
                        {...register("template")}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                        <option value="creative">Creative</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Visibility</label>
                      <select
                        {...register("visibility")}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="link-only">Link Only</option>
                      </select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Resume"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="ai">AI Analyze</TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                {currentResume?.id ? (
                  <PersonalInfoForm 
                    resumeId={currentResume.id}
                    initialData={personalInfoData}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Please create a resume first</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="experience">
                {currentResume?.id ? (
                  <WorkExperienceForm resumeId={currentResume.id} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Please create a resume first</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="education">
                {currentResume?.id ? (
                  <EducationForm resumeId={currentResume.id} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Please create a resume first</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="skills">
                {currentResume?.id ? (
                  <SkillsForm resumeId={currentResume.id} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Please create a resume first</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="ai">
                <AIResumeAnalyzer />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="lg:col-span-1">
          <ResumePreview template={template} resume={currentResume} />
        </div>
      </div>
    </div>
  );
};