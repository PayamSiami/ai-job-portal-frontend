'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { resumeService, Resume } from '@/lib/services/resume.service';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Download, Loader2, Printer } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function ResumeViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params['id'] as string;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeService.getResume(id),
    enabled: !!id,
  });

  const resume = data as Resume | undefined;

  // Load PDF preview
  useEffect(() => {
    async function loadPdf() {
      if (!resume) return;

      setIsLoadingPdf(true);
      try {
        // Use the new method that returns a URL
        const url = await resumeService.getPDFPreviewUrl(resume._id);
        setPdfUrl(url);
      } catch (err) {
        console.error('Failed to load PDF:', err);
        toast.error('بارگذاری پیش‌نمایش PDF با شکست مواجه شد');
      } finally {
        setIsLoadingPdf(false);
      }
    }

    loadPdf();

    // Cleanup: revoke the object URL when component unmounts or resume changes
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [resume]); // Only re-run when resume changes

  const handleDownloadPDF = async () => {
    if (!resume) return;
    try {
      await resumeService.downloadPDF(resume._id);
      toast.success('PDF با موفقیت دانلود شد');
    } catch (err) {
      toast.error('دانلود PDF با شکست مواجه شد');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || isLoadingPdf) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">رزومه یافت نشد یا بارگذاری با شکست مواجه شد.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/resumes')}>
          بازگشت به رزومه‌ها
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
        <Button variant="ghost" onClick={() => router.push('/resumes')}>
          <ArrowLeft className="w-4 h-4 ml-2" />
          بازگشت
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/resumes/${id}/edit`)}>
            <Edit2 className="w-4 h-4 ml-2" />
            ویرایش
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 ml-2" />
            چاپ
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 ml-2" />
            دانلود PDF
          </Button>
        </div>
      </div>

      {/* Resume PDF Preview */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        {pdfUrl ? (
          <embed
            src={pdfUrl}
            type="application/pdf"
            className="w-full min-h-200"
          />
        ) : (
          <div className="flex justify-center items-center h-100">
            <p className="text-gray-500">پیش‌نمایش PDF در دسترس نیست</p>
          </div>
        )}
      </div>
    </div>
  );
}