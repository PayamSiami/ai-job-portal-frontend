'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sliders, X } from 'lucide-react';

interface JobFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    experienceLevel: '',
    workMode: '',
    jobType: '',
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      title: '',
      location: '',
      minSalary: '',
      maxSalary: '',
      experienceLevel: '',
      workMode: '',
      jobType: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Filters
          </span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Search</label>
          <Input
            placeholder="Job title, keywords..."
            value={filters.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="City, state, or country"
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">Min Salary</label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minSalary}
              onChange={(e) => handleChange('minSalary', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max Salary</label>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxSalary}
              onChange={(e) => handleChange('maxSalary', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Experience Level</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.experienceLevel}
            onChange={(e) => handleChange('experienceLevel', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Work Mode</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.workMode}
            onChange={(e) => handleChange('workMode', e.target.value)}
          >
            <option value="">All</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-Site</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Job Type</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.jobType}
            onChange={(e) => handleChange('jobType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};