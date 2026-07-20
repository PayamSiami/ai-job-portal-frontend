/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Resume } from '@/lib/services/resume.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, Maximize2, Minimize2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/lib/services/resume.service';

interface TemplatePreviewProps {
  resume: Resume;
  onExport?: (template: string) => void;
}

export function TemplatePreview({ resume }: TemplatePreviewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);


  // Load PDF preview when template changes
  useEffect(() => {
    if (resume?._id) {
      loadPdfPreview();
    }
  }, [resume]);

  const loadPdfPreview = async () => {
    if (!resume?._id) return;
    console.log(resume)

    setIsLoadingPdf(true);
    try {
      const url = await resumeService.downloadPDF(resume._id);
      console.log(url)
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to load PDF preview:', error);
      toast.error('Failed to load preview');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleDownload = async () => {
    if (!resume?._id) {
      toast.error('Resume ID not found');
      return;
    }

    setIsExporting(true);
    try {
      await resumeService.downloadPDF(resume._id);
      toast.success(`PDF downloaded successfully! template)`);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error?.response?.data?.error || 'Failed to download PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = async () => {
    if (!resume?._id) {
      toast.error('Resume ID not found');
      return;
    }

    setIsPreviewing(true);
    try {
      await resumeService.downloadPDF(resume._id);
      toast.success(`PDF preview opened in new tab`);
    } catch (error: any) {
      console.error('Preview error:', error);
      toast.error(error?.response?.data?.error || 'Failed to preview PDF');
    } finally {
      setIsPreviewing(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Template Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 flex-1 sm:flex-none"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Fullscreen</span>
              </>
            )}
          </Button>
          <Button
            onClick={handlePreview}
            disabled={isPreviewing}
            variant="outline"
            className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 flex-1 sm:flex-none"
          >
            {isPreviewing ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                <span className="hidden xs:inline">Loading...</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Preview</span>
                <span className="xs:hidden">View</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isExporting}
            className="gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9 flex-1 sm:flex-none"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                <span className="hidden xs:inline">Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Download PDF</span>
                <span className="xs:hidden">PDF</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Template Preview */}
      <div
        className={`
          relative transition-all duration-300
          ${isFullscreen
            ? 'fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-2 sm:p-4 flex items-center justify-center'
            : ''
          }
        `}
      >
        <Card className={`
          overflow-hidden transition-all duration-300 w-full
          ${isFullscreen
            ? 'max-w-5xl max-h-[90vh] shadow-2xl'
            : 'max-h-112.5 sm:max-h-125 md:max-h-150 lg:max-h-162.5'
          }
        `}>
          <CardContent className="p-0 h-full">
            <div className="relative h-full">
              {/* Template Display - Using PDF from backend */}
              <div className={`
                p-2 sm:p-3 md:p-4 bg-gray-50 
                ${isFullscreen
                  ? 'max-h-[calc(90vh-4rem)] overflow-y-auto'
                  : 'max-h-[380px] sm:max-h-107.5 md:max-h-[520px] lg:max-h-[580px] overflow-y-auto'
                }
                flex items-start justify-center
              `}>
                {isLoadingPdf ? (
                  <div className="flex items-center justify-center w-full h-full min-h-[300px]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : pdfUrl ? (
                  <embed
                    src={pdfUrl}
                    type="application/pdf"
                    className="w-full h-full min-h-100 rounded"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full min-h-75 text-gray-500">
                    No preview available
                  </div>
                )}
              </div>

              {/* Fullscreen overlay close button */}
              {isFullscreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white shadow-md"
                  onClick={() => setIsFullscreen(false)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}