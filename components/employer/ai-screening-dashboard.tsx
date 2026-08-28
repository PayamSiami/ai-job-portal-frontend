'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Clock,
  FileText,
  Filter,
  Search,
  Download,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Brain,
  Target,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';

// Types
type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired' | 'interview';

interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateLocation: string;
  position: string;
  company: string;
  status: ApplicationStatus;
  aiScore: number;
  aiAnalysis: {
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    overallFit: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    keywords: string[];
  };
  appliedAt: string;
  resume: string;
  coverLetter: string;
  expectedSalary: number;
  availableFrom: string;
  interviewDate?: string;
  notes?: string;
}

interface ScreeningStats {
  total: number;
  screened: number;
  shortlisted: number;
  rejected: number;
  hired: number;
  interview: number;
  pending: number;
  avgScore: number;
}

// Status badge configuration - using bracket notation for TypeScript
const STATUS_CONFIG = {
  pending: { 
    label: 'Pending', 
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  reviewing: { 
    label: 'Reviewing', 
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Eye
  },
  shortlisted: { 
    label: 'Shortlisted', 
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: UserCheck
  },
  rejected: { 
    label: 'Rejected', 
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: UserX
  },
  hired: { 
    label: 'Hired', 
    className: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Award
  },
  interview: { 
    label: 'Interview', 
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Calendar
  },
} as const;

// Status options for select
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
];

// Mock data - Replace with actual API calls
const mockApplications: Application[] = [
  {
    id: '1',
    candidateId: '101',
    candidateName: 'John Doe',
    candidateEmail: 'john.doe@email.com',
    candidatePhone: '+1 (555) 123-4567',
    candidateLocation: 'San Francisco, CA',
    position: 'Senior React Developer',
    company: 'TechCorp Inc.',
    status: 'pending',
    aiScore: 85,
    aiAnalysis: {
      skillMatch: 90,
      experienceMatch: 80,
      educationMatch: 85,
      overallFit: 85,
      strengths: ['React expert', 'Strong TypeScript skills', 'Good communication'],
      weaknesses: ['Limited cloud experience', 'Could improve testing'],
      recommendations: ['Highlight AWS experience', 'Add testing examples'],
      keywords: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL']
    },
    appliedAt: '2026-07-01',
    resume: 'john_doe_resume.pdf',
    coverLetter: 'I am excited to apply for this position...',
    expectedSalary: 140000,
    availableFrom: '2026-08-01',
  },
  {
    id: '2',
    candidateId: '102',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane.smith@email.com',
    candidatePhone: '+1 (555) 987-6543',
    candidateLocation: 'New York, NY',
    position: 'Full Stack Developer',
    company: 'Google',
    status: 'reviewing',
    aiScore: 92,
    aiAnalysis: {
      skillMatch: 95,
      experienceMatch: 88,
      educationMatch: 92,
      overallFit: 92,
      strengths: ['Full stack expertise', 'Python/Java proficiency', 'Leadership experience'],
      weaknesses: ['Could improve DevOps skills'],
      recommendations: ['Add more cloud certifications'],
      keywords: ['Python', 'Java', 'React', 'AWS', 'Docker']
    },
    appliedAt: '2026-06-30',
    resume: 'jane_smith_resume.pdf',
    coverLetter: 'With 5 years of experience...',
    expectedSalary: 160000,
    availableFrom: '2026-07-15',
    interviewDate: '2026-07-10',
  },
  {
    id: '3',
    candidateId: '103',
    candidateName: 'Mike Johnson',
    candidateEmail: 'mike.j@email.com',
    candidatePhone: '+1 (555) 456-7890',
    candidateLocation: 'Austin, TX',
    position: 'AI/ML Engineer',
    company: 'OpenAI',
    status: 'shortlisted',
    aiScore: 78,
    aiAnalysis: {
      skillMatch: 75,
      experienceMatch: 80,
      educationMatch: 70,
      overallFit: 78,
      strengths: ['ML expertise', 'Python skills', 'Research background'],
      weaknesses: ['Limited production experience', 'Could improve deployment skills'],
      recommendations: ['Add ML deployment experience', 'Highlight production projects'],
      keywords: ['Python', 'PyTorch', 'ML', 'NLP', 'TensorFlow']
    },
    appliedAt: '2026-06-28',
    resume: 'mike_johnson_resume.pdf',
    coverLetter: 'I am passionate about AI...',
    expectedSalary: 150000,
    availableFrom: '2026-09-01',
  },
  {
    id: '4',
    candidateId: '104',
    candidateName: 'Sarah Wilson',
    candidateEmail: 'sarah.w@email.com',
    candidatePhone: '+1 (555) 789-0123',
    candidateLocation: 'Seattle, WA',
    position: 'DevOps Engineer',
    company: 'Amazon',
    status: 'rejected',
    aiScore: 45,
    aiAnalysis: {
      skillMatch: 40,
      experienceMatch: 50,
      educationMatch: 45,
      overallFit: 45,
      strengths: ['Good communication', 'Eager to learn'],
      weaknesses: ['Limited DevOps experience', 'Missing key certifications'],
      recommendations: ['Get AWS certification', 'Learn Kubernetes', 'Build CI/CD experience'],
      keywords: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins']
    },
    appliedAt: '2026-06-25',
    resume: 'sarah_wilson_resume.pdf',
    coverLetter: 'I am interested in DevOps...',
    expectedSalary: 120000,
    availableFrom: '2026-08-15',
  },
  {
    id: '5',
    candidateId: '105',
    candidateName: 'Alex Chen',
    candidateEmail: 'alex.c@email.com',
    candidatePhone: '+1 (555) 234-5678',
    candidateLocation: 'Chicago, IL',
    position: 'Data Engineer',
    company: 'Microsoft',
    status: 'interview',
    aiScore: 88,
    aiAnalysis: {
      skillMatch: 85,
      experienceMatch: 90,
      educationMatch: 88,
      overallFit: 88,
      strengths: ['Data engineering expertise', 'Strong SQL/Python', 'Good problem solving'],
      weaknesses: ['Limited cloud experience'],
      recommendations: ['Add more cloud tools experience'],
      keywords: ['Python', 'SQL', 'Spark', 'Hadoop', 'AWS']
    },
    appliedAt: '2026-06-20',
    resume: 'alex_chen_resume.pdf',
    coverLetter: 'I love working with data...',
    expectedSalary: 130000,
    availableFrom: '2026-07-20',
    interviewDate: '2026-07-15',
  },
];

// Helper functions
const getStatusConfig = (status: ApplicationStatus) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
};

const getStats = (applications: Application[]): ScreeningStats => {
  const stats: ScreeningStats = {
    total: applications.length,
    screened: applications.filter(a => a.aiScore > 0).length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    hired: applications.filter(a => a.status === 'hired').length,
    interview: applications.filter(a => a.status === 'interview').length,
    pending: applications.filter(a => a.status === 'pending').length,
    avgScore: Math.round(applications.reduce((acc, a) => acc + a.aiScore, 0) / applications.length),
  };
  return stats;
};

// Component
export const AIScreeningDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isScreeningAll, setIsScreeningAll] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch applications - Replace with actual API call
  const { data: applications = mockApplications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockApplications;
    },
  });

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = getStats(applications);

  // AI Screening Mutation
  const screenAllMutation = useMutation({
    mutationFn: async () => {
      setIsScreeningAll(true);
      // Simulate AI screening process
      await new Promise(resolve => setTimeout(resolve, 3000));
      return { success: true };
    },
    onSuccess: () => {
      toast.success('All applications screened successfully!');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: (error) => {
      toast.error('Failed to screen applications');
      console.error(error);
    },
    onSettled: () => {
      setIsScreeningAll(false);
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId: _applicationId, status: _status }: { applicationId: string; status: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: (_, { status }) => {
      toast.success(`Application status updated to ${status}`);
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsDetailsOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update status');
      console.error(error);
    },
  });

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Get match level
  const getMatchLevel = (score: number) => {
    if (score >= 80) return '🟢 Excellent';
    if (score >= 60) return '🟡 Good';
    return '🔴 Needs Improvement';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            AI Screening Dashboard
          </h2>
          <p className="text-gray-600">AI-powered candidate screening and analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => screenAllMutation.mutate()}
            disabled={isScreeningAll}
            className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isScreeningAll ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isScreeningAll ? 'Screening...' : 'Screen All with AI'}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Screened</p>
                <p className="text-xl font-bold">{stats.screened}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="mt-1">
              <Progress 
                value={(stats.screened / stats.total) * 100} 
                className="h-1" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg Score</p>
                <p className="text-xl font-bold">{stats.avgScore}%</p>
              </div>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Shortlisted</p>
                <p className="text-xl font-bold text-green-600">{stats.shortlisted}</p>
              </div>
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Rejected</p>
                <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <UserX className="w-5 h-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Interview</p>
                <p className="text-xl font-bold text-indigo-600">{stats.interview}</p>
              </div>
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Hired</p>
                <p className="text-xl font-bold text-purple-600">{stats.hired}</p>
              </div>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search candidates, positions, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    AI Score
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => {
                  const statusConfig = getStatusConfig(app.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedApplication(app);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {app.candidateName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{app.candidateName}</p>
                            <p className="text-xs text-gray-500">{app.candidateLocation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{app.position}</p>
                          <p className="text-xs text-gray-500">{app.company}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getScoreColor(app.aiScore)}`}>
                            {app.aiScore}%
                          </span>
                          <div className={`px-2 py-0.5 rounded-full text-xs ${getScoreBgColor(app.aiScore)} ${getScoreColor(app.aiScore)}`}>
                            {getMatchLevel(app.aiScore)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${statusConfig.className} gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApplication(app);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Application Details
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusConfig(selectedApplication.status).className} gap-1 text-sm`}>
                      {getStatusConfig(selectedApplication.status).label}
                    </Badge>
                    <span className={`text-2xl font-bold ${getScoreColor(selectedApplication.aiScore)}`}>
                      {selectedApplication.aiScore}%
                    </span>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  AI-powered analysis and candidate information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Candidate Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                            {selectedApplication.candidateName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{selectedApplication.candidateName}</h3>
                          <p className="text-sm text-gray-600">{selectedApplication.position}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Briefcase className="w-4 h-4" />
                            {selectedApplication.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedApplication.candidateEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedApplication.candidatePhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{selectedApplication.candidateLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Available from: {new Date(selectedApplication.availableFrom).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Analysis */}
                <Card className="border-2 border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      AI Analysis Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Skill Match</p>
                        <p className="text-2xl font-bold">{selectedApplication.aiAnalysis.skillMatch}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="text-2xl font-bold">{selectedApplication.aiAnalysis.experienceMatch}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Education</p>
                        <p className="text-2xl font-bold">{selectedApplication.aiAnalysis.educationMatch}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Overall Fit</p>
                        <p className="text-2xl font-bold">{selectedApplication.aiAnalysis.overallFit}%</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {selectedApplication.aiAnalysis.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4" />
                          Areas to Improve
                        </h4>
                        <ul className="space-y-1">
                          {selectedApplication.aiAnalysis.weaknesses.map((weakness, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-red-500">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-600 flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {selectedApplication.aiAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-600 flex items-center gap-2 mb-2">
                        <Search className="w-4 h-4" />
                        Keywords Matched
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.aiAnalysis.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="bg-blue-50 text-blue-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('/' + selectedApplication.resume, '_blank')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Candidate
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      onValueChange={(value) => {
                        updateStatusMutation.mutate({
                          applicationId: selectedApplication.id,
                          status: value,
                        });
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS
                          .filter(opt => opt.value !== 'all')
                          .map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    
                    <Button className="gap-2">
                      <UserCheck className="w-4 h-4" />
                      Move to Shortlist
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Users className="w-12 h-12 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">No applications found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIScreeningDashboard;