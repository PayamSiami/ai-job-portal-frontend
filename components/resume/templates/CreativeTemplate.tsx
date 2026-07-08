'use client';

import React from 'react';
import { Resume } from '@/lib/services/resume.service';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  FolderKanban,
  Sparkles
} from 'lucide-react';

interface TemplateProps {
  resume: Resume;
}

export function CreativeTemplate({ resume }: TemplateProps) {
  const { personalInfo, experience, education, skills, languages, projects } = resume;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 min-h-[800px]">
        {/* Sidebar - Colorful */}
        <div className="md:col-span-1 bg-gradient-to-b from-purple-600 to-blue-600 text-white p-6">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-4">
              <span className="text-4xl font-bold">
                {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
              </span>
            </div>
            <h1 className="text-xl font-bold">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-sm text-purple-100 mt-1">{personalInfo.title || 'Professional'}</p>
          </div>

          <div className="mt-6 space-y-4">
            {/* Contact */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-200 mb-2">
                Contact
              </h3>
              <div className="space-y-2 text-sm">
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-200 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-1">
                  {skills.map((skill, index) => (
                    <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-200 mb-2">
                  Languages
                </h3>
                <div className="space-y-1">
                  {languages.map((lang, index) => (
                    <div key={index} className="text-sm flex justify-between">
                      <span>{lang.name}</span>
                      <span className="text-purple-200 capitalize">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-4 p-8">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-purple-600 pl-4">
                    <div className="flex flex-wrap justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500">
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
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-purple-600 pl-4">
                    <div className="flex flex-wrap justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-500">
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
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                <FolderKanban className="w-5 h-5 text-purple-600" />
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((project, index) => (
                  <div key={index} className="border-l-2 border-purple-600 pl-4">
                    <h4 className="font-semibold text-gray-800">{project.name}</h4>
                    {project.description && (
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
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
  );
}