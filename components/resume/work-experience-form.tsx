"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Loader2 } from "lucide-react";
import { useResume } from "@/lib/hooks/use-resume";
import toast from "react-hot-toast";

const workExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      companyName: z.string().min(1, "Company name is required"),
      jobTitle: z.string().min(1, "Job title is required"),
      location: z.string().optional(),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      isCurrentJob: z.boolean().default(false),
      description: z.string().optional(),
      technologies: z.string().optional(),
    })
  ),
});

type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

interface WorkExperienceFormProps {
  resumeId?: string;
}

export const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  resumeId,
}) => {
  const { currentResume } = useResume();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      experiences: [
        {
          companyName: "",
          jobTitle: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrentJob: false,
          description: "",
          technologies: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const onSubmit = async (data: WorkExperienceFormData) => {
    if (!resumeId && !currentResume) {
      toast.error("Please create a resume first");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Work experience updated successfully!");
    } catch (error) {
      toast.error("Failed to update work experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Work Experience</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  companyName: "",
                  jobTitle: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  isCurrentJob: false,
                  description: "",
                  technologies: "",
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 border relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => remove(index)}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    {...register(`experiences.${index}.companyName`)}
                    placeholder="Company name"
                    className={
                      errors.experiences?.[index]?.companyName
                        ? "border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    {...register(`experiences.${index}.jobTitle`)}
                    placeholder="Your job title"
                    className={
                      errors.experiences?.[index]?.jobTitle
                        ? "border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    {...register(`experiences.${index}.location`)}
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Technologies</label>
                  <Input
                    {...register(`experiences.${index}.technologies`)}
                    placeholder="React, Node.js, Python, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    {...register(`experiences.${index}.startDate`)}
                    className={
                      errors.experiences?.[index]?.startDate
                        ? "border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    {...register(`experiences.${index}.endDate`)}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register(`experiences.${index}.isCurrentJob`)}
                  />
                  <span className="text-sm">I currently work here</span>
                </label>
              </div>

              <div className="mt-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  {...register(`experiences.${index}.description`)}
                  placeholder="Describe your responsibilities and achievements"
                  rows={3}
                />
              </div>
            </Card>
          ))}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Work Experience"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};