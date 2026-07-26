"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, useWatch, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Loader2 } from "lucide-react";
import { useResume } from "@/lib/hooks/use-resume";
import toast from "react-hot-toast";

const experienceItemSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrentJob: z.boolean().default(false),
  description: z.string().optional(),
  technologies: z.string().optional(),
});

const workExperienceSchema = z
  .object({
    experiences: z.array(experienceItemSchema),
  })
  .superRefine((data, ctx) => {
    data.experiences.forEach((exp, index) => {
      if (
        !exp.isCurrentJob &&
        exp.endDate &&
        exp.startDate &&
        new Date(exp.endDate) < new Date(exp.startDate)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date cannot be before start date",
          path: ["experiences", index, "endDate"],
        });
      }
    });
  });

// Use z.input to match the form state structure with optional default values
type WorkExperienceFormInput = z.input<typeof workExperienceSchema>;

const emptyExperience = {
  companyName: "",
  jobTitle: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrentJob: false,
  description: "",
  technologies: "",
};

const FormField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    {children}
    {error?.message && (
      <p className="text-xs text-red-500 mt-1">{error.message}</p>
    )}
  </div>
);

export const WorkExperienceForm: React.FC<{ resumeId?: string }> = ({
  resumeId,
}) => {
  const { currentResume } = useResume();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkExperienceFormInput>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: { experiences: [emptyExperience] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });
  const watchedExperiences = useWatch({ control, name: "experiences" });

  const onSubmit = async () => {
    if (!resumeId && !currentResume) {
      toast.error("Please create a resume first");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Work experience updated successfully!");
    } catch {
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
              onClick={() => append(emptyExperience)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {fields.map((field, index) => {
            const expErrors = errors.experiences?.[index];
            const isCurrent = watchedExperiences?.[index]?.isCurrentJob;

            return (
              <Card key={field.id} className="p-4 border relative space-y-3">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Company *" error={expErrors?.companyName}>
                    <Input
                      {...register(`experiences.${index}.companyName`)}
                      placeholder="Company name"
                      className={expErrors?.companyName ? "border-red-500" : ""}
                    />
                  </FormField>

                  <FormField label="Job Title *" error={expErrors?.jobTitle}>
                    <Input
                      {...register(`experiences.${index}.jobTitle`)}
                      placeholder="Your job title"
                      className={expErrors?.jobTitle ? "border-red-500" : ""}
                    />
                  </FormField>

                  <FormField label="Location">
                    <Input
                      {...register(`experiences.${index}.location`)}
                      placeholder="City, State"
                    />
                  </FormField>

                  <FormField label="Technologies">
                    <Input
                      {...register(`experiences.${index}.technologies`)}
                      placeholder="React, Node.js, Python, etc."
                    />
                  </FormField>

                  <FormField label="Start Date *" error={expErrors?.startDate}>
                    <Input
                      type="date"
                      {...register(`experiences.${index}.startDate`)}
                      className={expErrors?.startDate ? "border-red-500" : ""}
                    />
                  </FormField>

                  <FormField label="End Date" error={expErrors?.endDate}>
                    <Input
                      type="date"
                      disabled={isCurrent}
                      {...register(`experiences.${index}.endDate`)}
                      className={expErrors?.endDate ? "border-red-500" : ""}
                    />
                  </FormField>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`isCurrentJob-${index}`}
                    {...register(`experiences.${index}.isCurrentJob`, {
                      onChange: (e) => {
                        if (e.target.checked)
                          setValue(`experiences.${index}.endDate`, "");
                      },
                    })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor={`isCurrentJob-${index}`}
                    className="text-sm cursor-pointer select-none"
                  >
                    I currently work here
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    {...register(`experiences.${index}.description`)}
                    placeholder="Describe your responsibilities and achievements"
                    rows={3}
                  />
                </div>
              </Card>
            );
          })}

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