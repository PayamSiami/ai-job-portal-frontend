import { useState } from "react";
import { Job, ParsedJobFilters } from "@/lib/types";
import toast from "react-hot-toast";
import { jobService } from "../services/job.service";

interface SearchResult {
  jobs: Job[];
  parsedFilters?: ParsedJobFilters;
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchJobs = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await jobService.aiSearch(query);
      setResults({
        jobs: response.results.jobs,
        parsedFilters: response.parsedFilters,
      });

      toast.success(`Found ${response.results.jobs.length} jobs`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Search failed";
      setError(message);
      toast.error(message);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, searchJobs };
};
