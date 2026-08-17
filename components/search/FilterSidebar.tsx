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
  { value: 'remote', label: 'دورکاری' },
  { value: 'hybrid', label: 'ترکیبی (حضوری-دورکار)' },
  { value: 'on-site', label: 'حضوری' },
];

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'تمام وقت' },
  { value: 'part-time', label: 'پاره وقت' },
  { value: 'contract', label: 'قراردادی' },
  { value: 'internship', label: 'کارآموزی' },
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'تازه‌کار' },
  { value: 'mid', label: 'متوسط' },
  { value: 'senior', label: 'ارشد' },
  { value: 'lead', label: 'رهبر تیم' },
  { value: 'executive', label: 'مدیریتی' },
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">فیلترها</h3>
          {/* Active filters count */}
          {Object.values(filters).filter(v => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)).length > 0 && (
            <Badge variant="default" className="bg-blue-600 text-white text-xs">
              {Object.values(filters).filter(v => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)).length}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
          <X className="w-4 h-4" />
          <span className="mr-1 text-sm">بستن</span>
        </Button>
      </div>

      {/* Work Mode */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-right hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => toggleExpanded('workMode')}
        >
          <h4 className="font-medium text-gray-900">نوع همکاری</h4>
          {expanded.workMode ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expanded.workMode && (
          <div className="mt-3 space-y-3 pr-2">
            {WORK_MODES.map((mode) => (
              <div key={mode.value} className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded-md transition-colors">
                <Checkbox
                  id={`work-${mode.value}`}
                  checked={filters.workMode === mode.value}
                  onCheckedChange={(checked) => {
                    onFilterChange('workMode', checked ? mode.value : undefined);
                  }}
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`work-${mode.value}`} className="text-sm cursor-pointer text-gray-700">
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
          className="flex items-center justify-between w-full text-right hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => toggleExpanded('employmentType')}
        >
          <h4 className="font-medium text-gray-900">نوع استخدام</h4>
          {expanded.employmentType ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expanded.employmentType && (
          <div className="mt-3 space-y-3 pr-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <div key={type.value} className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded-md transition-colors">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.employmentType === type.value}
                  onCheckedChange={(checked) => {
                    onFilterChange('employmentType', checked ? type.value : undefined);
                  }}
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`type-${type.value}`} className="text-sm cursor-pointer text-gray-700">
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
          className="flex items-center justify-between w-full text-right hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => toggleExpanded('experience')}
        >
          <h4 className="font-medium text-gray-900">سطح سابقه کاری</h4>
          {expanded.experience ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expanded.experience && (
          <div className="mt-3 space-y-3 pr-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded-md transition-colors">
                <Checkbox
                  id={`exp-${level.value}`}
                  checked={filters.experienceLevel === level.value}
                  onCheckedChange={(checked) => {
                    onFilterChange('experienceLevel', checked ? level.value : undefined);
                  }}
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`exp-${level.value}`} className="text-sm cursor-pointer text-gray-700">
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
          className="flex items-center justify-between w-full text-right hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => toggleExpanded('salary')}
        >
          <h4 className="font-medium text-gray-900">محدوده حقوق</h4>
          {expanded.salary ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expanded.salary && (
          <div className="mt-4 px-1">
            <Slider
              min={0}
              max={200000}
              step={5000}
              value={salaryRange}
              onValueChange={handleSalaryChange}
              className="w-full"
            />
            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                <span className="text-gray-500">حداقل: </span>
                <span className="font-medium text-gray-900">{salaryRange[0].toLocaleString()} تومان</span>
              </div>
              <div className="bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                <span className="text-gray-500">حداکثر: </span>
                <span className="font-medium text-gray-900">{salaryRange[1].toLocaleString()} تومان</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Skills */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-right hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => toggleExpanded('skills')}
        >
          <h4 className="font-medium text-gray-900">مهارت‌ها</h4>
          {expanded.skills ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expanded.skills && (
          <div className="mt-3">
            <div className="relative">
              <Input
                placeholder="مهارت‌ها را وارد کنید (با کاما جدا کنید)"
                className="pl-3 pr-3 py-2 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                ↵
              </span>
            </div>
            {filters.skills && filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filters.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="text-xs flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    {skill}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-600 transition-colors"
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
            {filters.skills && filters.skills.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onFilterChange('skills', [])}
              >
                حذف همه مهارت‌ها
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <Button 
          className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          onClick={onClose}
        >
          اعمال فیلترها
        </Button>
        
        {/* Clear all filters button */}
        {Object.values(filters).some(v => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              onFilterChange('workMode', undefined);
              onFilterChange('employmentType', undefined);
              onFilterChange('experienceLevel', undefined);
              onFilterChange('minSalary', undefined);
              onFilterChange('maxSalary', undefined);
              onFilterChange('skills', []);
              setSalaryRange([0, 150000]);
            }}
          >
            پاک کردن همه فیلترها
          </Button>
        )}
      </div>
    </div>
  );
}