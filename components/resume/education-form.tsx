/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Loader2 } from "lucide-react";
import { useResume } from "@/lib/hooks/use-resume";
import toast from "react-hot-toast";

// ✅ Define schema with proper defaults
const educationItemSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().default(""),
  grade: z.string().default(""),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().default(""),
  isCurrentlyStudying: z.boolean().default(false),
  description: z.string().default(""),
});

const educationSchema = z.object({
  educations: z.array(educationItemSchema),
});
type EducationFormInput = z.input<typeof educationSchema>;
type EducationFormOutput = z.output<typeof educationSchema>;
type EducationFormData = EducationFormOutput;
type EducationItem = z.infer<typeof educationItemSchema>;

interface EducationFormProps {
  resumeId?: string;
}

// ✅ Helper to create a default education item
const createDefaultEducation = (): EducationItem => ({
  institutionName: "",
  degree: "",
  fieldOfStudy: "",
  grade: "",
  startDate: "",
  endDate: "",
  isCurrentlyStudying: false,
  description: "",
});

export const EducationForm: React.FC<EducationFormProps> = ({ resumeId }) => {
  const { currentResume } = useResume();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pass both Input and Output types to useForm
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EducationFormInput, any, EducationFormOutput>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: [createDefaultEducation()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  const onSubmit = async (data: EducationFormData) => {
    if (!resumeId && !currentResume) {
      toast.error("Please create a resume first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call API to update education
      console.log("Education data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Education updated successfully!");
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error("Failed to update education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const educations = watch("educations");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append(createDefaultEducation())}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>

          {fields.map((field, index) => {
            const isCurrentlyStudying = educations?.[index]?.isCurrentlyStudying;

            return (
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
                    <label className="text-sm font-medium">Institution</label>
                    <Input
                      {...register(`educations.${index}.institutionName`)}
                      placeholder="University name"
                      className={
                        errors.educations?.[index]?.institutionName
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.educations?.[index]?.institutionName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.educations[index]?.institutionName?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Degree</label>
                    <Input
                      {...register(`educations.${index}.degree`)}
                      placeholder="Bachelor's, Master's, etc."
                      className={
                        errors.educations?.[index]?.degree
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.educations?.[index]?.degree && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.educations[index]?.degree?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Field of Study</label>
                    <Input
                      {...register(`educations.${index}.fieldOfStudy`)}
                      placeholder="Computer Science, Business, etc."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Grade</label>
                    <Input
                      {...register(`educations.${index}.grade`)}
                      placeholder="GPA or grade"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      {...register(`educations.${index}.startDate`)}
                      className={
                        errors.educations?.[index]?.startDate
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.educations?.[index]?.startDate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.educations[index]?.startDate?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      {...register(`educations.${index}.endDate`)}
                      disabled={isCurrentlyStudying}
                      className={
                        isCurrentlyStudying ? "opacity-50 cursor-not-allowed" : ""
                      }
                    />
                    {isCurrentlyStudying && (
                      <p className="text-sm text-gray-500 mt-1">
                        End date disabled while currently studying
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`isCurrentlyStudying-${index}`}
                    {...register(`educations.${index}.isCurrentlyStudying`)}
                  />
                  <label
                    htmlFor={`isCurrentlyStudying-${index}`}
                    className="text-sm cursor-pointer"
                  >
                    Currently studying
                  </label>
                </div>

                <div className="mt-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    {...register(`educations.${index}.description`)}
                    placeholder="Additional details about your education"
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
              "Save Education"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};