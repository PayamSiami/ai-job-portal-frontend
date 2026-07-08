'use client';

import React from 'react';
import { Resume } from '@/lib/services/resume.service';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  FolderKanban,
  CheckCircle
} from 'lucide-react';

interface TemplateProps {
  resume: Resume;
  preview?: boolean;
}

export function ModernTemplate({ resume, preview = false }: TemplateProps) {
  const { personalInfo, experience, education, skills, certifications, languages, projects } = resume;

  return (
    <div className={`bg-white ${preview ? 'shadow-sm' : 'shadow-lg'} rounded-lg overflow-hidden max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-6">
        <h1 className="text-3xl font-bold">
          {personalInfo.firstName || 'John'} {personalInfo.lastName || 'Doe'}
        </h1>
        <p className="text-lg text-blue-100 mt-1">{personalInfo.title || 'Professional'}</p>
        
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-blue-100">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {personalInfo.location}
            </span>
          )}
        </div>

        <div className="flex gap-4 mt-2">
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white">
              {/* <Linkedin className="w-5 h-5" /> */}
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white">
              {/* <Github className="w-5 h-5" /> */}
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white">
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-4">
            {skills && skills.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  Skills
                </h3>
                <div className="space-y-1">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Languages className="w-4 h-4 text-blue-600" />
                  Languages
                </h3>
                <div className="space-y-1">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{lang.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index}>
                      <p className="font-medium text-gray-800 text-sm">{cert.name}</p>
                      <p className="text-xs text-gray-500">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-4">
            {experience && experience.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Experience
                </h3>
                <div className="space-y-3">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">{exp.position}</h4>
                          <p className="text-gray-600 text-sm">{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {exp.current ? ' Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-xs mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Education
                </h3>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">{edu.degree}</h4>
                          <p className="text-gray-600 text-sm">{edu.institution}</p>
                          {edu.fieldOfStudy && (
                            <p className="text-xs text-gray-500">{edu.fieldOfStudy}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {edu.current ? ' Present' : new Date(edu.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects && projects.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <FolderKanban className="w-4 h-4 text-blue-600" />
                  Projects
                </h3>
                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-800 text-sm">{project.name}</h4>
                      {project.description && (
                        <p className="text-gray-700 text-xs mt-1">{project.description}</p>
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