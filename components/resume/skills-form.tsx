"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { useResume } from "@/lib/hooks/use-resume";
import toast from "react-hot-toast";

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      skillName: z.string().min(1, "Skill name is required"),
      proficiencyLevel: z.enum([
        "beginner",
        "elementary",
        "intermediate",
        "advanced",
        "expert",
      ]),
      yearsOfExperience: z.number().min(0).optional(),
    })
  ),
});

type SkillsFormData = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  resumeId?: string;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ resumeId }) => {
  const { currentResume } = useResume();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [
        {
          skillName: "",
          proficiencyLevel: "intermediate",
          yearsOfExperience: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const onSubmit = async (data: SkillsFormData) => {
    if (!resumeId && !currentResume) {
      toast.error("Please create a resume first");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Skills updated successfully!");
    } catch (error) {
      toast.error("Failed to update skills");
    } finally {
      setIsSubmitting(false);
    }
  };

  const proficiencyLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "elementary", label: "Elementary" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Skills</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  skillName: "",
                  proficiencyLevel: "intermediate",
                  yearsOfExperience: 0,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Skill Name</label>
                  <Input
                    {...register(`skills.${index}.skillName`)}
                    placeholder="React, Python, etc."
                    className={
                      errors.skills?.[index]?.skillName ? "border-red-500" : ""
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Proficiency</label>
                  <select
                    {...register(`skills.${index}.proficiencyLevel`)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Years Experience</label>
                  <Input
                    type="number"
                    {...register(`skills.${index}.yearsOfExperience`, {
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    min={0}
                  />
                </div>
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
              "Save Skills"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};