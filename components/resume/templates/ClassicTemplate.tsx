'use client';

import React from 'react';
import { Resume } from '@/lib/services/resume.service';

interface TemplateProps {
  resume: Resume;
}

export function ClassicTemplate({ resume }: TemplateProps) {
  const { personalInfo, experience, education, skills, certifications, languages, projects } = resume;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-8 bg-gray-50">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg text-gray-600 mt-1">{personalInfo.title || 'Professional'}</p>
        
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-serif font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            {skills && skills.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                  Skills
                </h3>
                <div className="space-y-1">
                  {skills.map((skill, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-xs text-gray-400 ml-1">({skill.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                  Languages
                </h3>
                <div className="space-y-1">
                  {languages.map((lang, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-700">{lang.name}</span>
                      <span className="text-xs text-gray-400 ml-1">({lang.proficiency})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                  Certifications
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-800">{cert.name}</p>
                      <p className="text-gray-500 text-xs">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Experience */}
            {experience && experience.length > 0 && (
              <div>
                <h2 className="text-lg font-serif font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                  Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{exp.position}</h4>
                          <p className="text-gray-600 text-sm">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {exp.current ? ' Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div>
                <h2 className="text-lg font-serif font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                          <p className="text-gray-600 text-sm">{edu.institution}</p>
                          {edu.fieldOfStudy && (
                            <p className="text-gray-500 text-xs">{edu.fieldOfStudy}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {edu.current ? ' Present' : new Date(edu.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-lg font-serif font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                  Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-800">{project.name}</h4>
                      {project.description && (
                        <p className="text-gray-700 text-sm">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}