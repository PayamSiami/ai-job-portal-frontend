/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { JobFilters } from '@/lib/types/job.types';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';

interface FilterSidebarProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  onClose: () => void;
}

const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on-site', label: 'On-site' },
];

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
];

export function FilterSidebar({ filters, onFilterChange, onClose }: FilterSidebarProps) {
  const [salaryRange, setSalaryRange] = React.useState<[number, number]>([
    filters.minSalary || 0,
    filters.maxSalary || 150000,
  ]);

  const [expanded, setExpanded] = React.useState({
    workMode: true,
    employmentType: true,
    experience: true,
    salary: true,
    skills: true,
  });

  const toggleExpanded = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSalaryChange = (value: [number, number]) => {
    setSalaryRange(value);
    onFilterChange('minSalary', value[0]);
    onFilterChange('maxSalary', value[1]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Work Mode */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleExpanded('workMode')}
        >
          <h4 className="font-medium text-gray-900">Work Mode</h4>
          {expanded.workMode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.workMode && (
          <div className="mt-3 space-y-2">
            {WORK_MODES.map((mode) => (
              <div key={mode.value} className="flex items-center gap-2">
                <Checkbox
                  id={`work-${mode.value}`}
                  checked={filters.workMode === mode.value}
                  onCheckedChange={(checked) => {
                    onFilterChange('workMode', checked ? mode.value : undefined);
                  }}
                />
                <Label htmlFor={`work-${mode.value}`} className="text-sm cursor-pointer">
                  {mode.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Employment Type */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleExpanded('employmentType')}
        >
          <h4 className="font-medium text-gray-900">Employment Type</h4>
          {expanded.employmentType ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.employmentType && (
          <div className="mt-3 space-y-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <div key={type.value} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.employmentType === type.value}
                  onCheckedChange={(checked) => {
                    onFilterChange('employmentType', checked ? type.value : undefined);
                  }}
                />
                <Label htmlFor={`type-${type.value}`} className="text-sm cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Experience Level */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleExpanded('experience')}
        >
          <h4 className="font-medium text-gray-900">Experience Level</h4>
          {expanded.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.experience && (
          <div className="mt-3 space-y-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center gap-2">
                <Checkbox
                  id={`exp-${level.value}`}
                  checked={filters.experienceLevel === level.value}
                  onCheckedChange={(checked) => {
                    onFilterChange('experienceLevel', checked ? level.value : undefined);
                  }}
                />
                <Label htmlFor={`exp-${level.value}`} className="text-sm cursor-pointer">
                  {level.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Salary Range */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleExpanded('salary')}
        >
          <h4 className="font-medium text-gray-900">Salary Range</h4>
          {expanded.salary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.salary && (
          <div className="mt-3">
            <Slider
              min={0}
              max={200000}
              step={5000}
              value={salaryRange}
              onValueChange={handleSalaryChange}
            />
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>${salaryRange[0].toLocaleString()}</span>
              <span>${salaryRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Skills */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleExpanded('skills')}
        >
          <h4 className="font-medium text-gray-900">Skills</h4>
          {expanded.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.skills && (
          <div className="mt-3">
            <Input
              placeholder="Add skills (comma separated)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  const skills = input.value.split(',').map(s => s.trim()).filter(Boolean);
                  if (skills.length > 0) {
                    onFilterChange('skills', [...(filters.skills || []), ...skills]);
                    input.value = '';
                  }
                }
              }}
            />
            {filters.skills && filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs flex items-center gap-1">
                    {skill}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        onFilterChange(
                          'skills',
                          filters.skills?.filter((s) => s !== skill)
                        );
                      }}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Button className="w-full" onClick={onClose}>
        Apply Filters
      </Button>
    </div>
  );
}