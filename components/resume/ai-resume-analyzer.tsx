'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertCircle, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';
import { useResume } from '@/lib/hooks/use-resume';
import toast from 'react-hot-toast';

interface AnalysisResult {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    recommendedJobs: string[];
}

export const AIResumeAnalyzer = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const { currentResume, analyzeResume } = useResume();

    const handleAnalyze = async () => {
        if (!currentResume) {
            toast.error('Please create a resume first');
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await analyzeResume(currentResume.id);
            setAnalysis(result);
            toast.success('Resume analysis complete!');
        } catch (error) {
            toast.error('Failed to analyze resume');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        AI Resume Analyzer
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !currentResume}
                        className="w-full"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Analyze My Resume
                            </>
                        )}
                    </Button>
                    {!currentResume && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Create a resume first to analyze it
                        </p>
                    )}
                </CardContent>
            </Card>

            {analysis && (
                <>
                    {/* Score Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="relative inline-flex">
                                    <div className="text-6xl font-bold text-blue-600">{analysis.score}%</div>
                                    <div className="absolute -top-2 -right-2">
                                        <Badge className="bg-green-500">Match</Badge>
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2">Resume Score</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Strengths */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {analysis.strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">•</span>
                                        <span className="text-sm text-gray-700">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Areas for Improvement */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-600">
                                <AlertCircle className="w-5 h-5" />
                                Areas to Improve
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {analysis.weaknesses.map((weakness, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-yellow-500 mt-1">•</span>
                                        <span className="text-sm text-gray-700">{weakness}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Suggestions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-600">
                                <TrendingUp className="w-5 h-5" />
                                Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {analysis.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-purple-500 mt-1">•</span>
                                        <span className="text-sm text-gray-700">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Recommended Jobs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-600">
                                <Sparkles className="w-5 h-5" />
                                Recommended Jobs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {analysis.recommendedJobs.map((job, index) => (
                                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900">{job}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};