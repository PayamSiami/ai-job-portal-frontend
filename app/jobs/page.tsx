// app/(dashboard)/jobs/page.tsx
import SearchPage from "@/components/jobs/SearchPage";
import { Suspense } from "react";

// Extract loading component for reusability
function JobsLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 animate-pulse">Loading jobs...</p>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsLoadingFallback />}>
      <SearchPage />
    </Suspense>
  );
}