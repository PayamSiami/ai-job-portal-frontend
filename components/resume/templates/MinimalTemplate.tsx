'use client';

import React from 'react';
import { Resume } from '@/lib/services/resume.service';

interface TemplateProps {
  resume: Resume;
}

export function MinimalTemplate({ resume }: TemplateProps) {
  const { personalInfo, experience, education, skills, languages, } = resume;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-light text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-gray-600 mt-1">{personalInfo.title || 'Professional'}</p>
        <div className="flex justify-center gap-4 mt-3 text-sm text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <p className="text-gray-700 text-center max-w-2xl mx-auto">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Languages
              </h3>
              <div className="space-y-1">
                {languages.map((lang, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span className="text-gray-700">{lang.name}</span>
                    <span className="text-gray-400">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Experience
              </h3>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{exp.position}</p>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                        {exp.current ? ' Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Education
              </h3>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{edu.degree}</p>
                        <p className="text-gray-600 text-sm">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                        {edu.current ? ' Present' : new Date(edu.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}