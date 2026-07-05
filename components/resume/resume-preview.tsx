"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Resume } from "@/lib/types/resume.types";
import { User, Briefcase, GraduationCap, Code2 } from "lucide-react";

interface ResumePreviewProps {
  template: string;
  resume: Resume | null;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  template,
  resume,
}) => {
  if (!resume) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Create a resume to see preview</p>
        </CardContent>
      </Card>
    );
  }

  const getTemplateStyles = (template: string) => {
    const styles: Record<string, string> = {
      classic: "bg-white border-2 border-gray-200",
      modern: "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200",
      creative: "bg-gradient-to-r from-pink-50 to-orange-50 border-2 border-pink-200",
      professional: "bg-gray-50 border-2 border-gray-300",
    };
    return styles[template] || styles.classic;
  };

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <div className={`rounded-lg p-6 ${getTemplateStyles(template)}`}>
          {/* Personal Info */}
          <div className="text-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
            </h2>
            <p className="text-gray-600">{resume.personalInfo?.headline}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mt-2">
              <span>{resume.personalInfo?.email}</span>
              <span>{resume.personalInfo?.phone}</span>
              <span>
                {resume.personalInfo?.city}, {resume.personalInfo?.country}
              </span>
            </div>
          </div>

          {/* Summary */}
          {resume.summary && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Summary
              </h3>
              <p className="text-sm text-gray-600">{resume.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resume.workExperiences && resume.workExperiences.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Work Experience
              </h3>
              {resume.workExperiences.slice(0, 2).map((exp, index) => (
                <div key={index} className="mb-3">
                  <p className="font-medium text-gray-900">{exp.jobTitle}</p>
                  <p className="text-sm text-gray-600">{exp.companyName}</p>
                  <p className="text-xs text-gray-500">
                    {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {exp.description}
                  </p>
                </div>
              ))}
              {resume.workExperiences.length > 2 && (
                <p className="text-xs text-gray-500">
                  +{resume.workExperiences.length - 2} more experiences
                </p>
              )}
            </div>
          )}

          {/* Education */}
          {resume.educations && resume.educations.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Education
              </h3>
              {resume.educations.slice(0, 2).map((edu, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institutionName}</p>
                  <p className="text-xs text-gray-500">
                    {edu.startDate} - {edu.isCurrentlyStudying ? "Present" : edu.endDate}
                  </p>
                </div>
              ))}
              {resume.educations.length > 2 && (
                <p className="text-xs text-gray-500">
                  +{resume.educations.length - 2} more educations
                </p>
              )}
            </div>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.slice(0, 8).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium"
                  >
                    {skill.skillName}
                  </span>
                ))}
                {resume.skills.length > 8 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                    +{resume.skills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Template: {template.charAt(0).toUpperCase() + template.slice(1)}
        </div>
      </CardContent>
    </Card>
  );
};