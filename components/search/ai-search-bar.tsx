"use client";

import React, { useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface AISearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const exampleSearches = [
  "Senior React developer in USA with 120k salary",
  "Remote Python engineer jobs",
  "Entry level data analyst in NYC",
  "Full-time Java developer with microservices",
];

export const AISearchBar: React.FC<AISearchBarProps> = ({
  onSearch,
  isLoading = false,
  placeholder = "Describe your dream job naturally...",
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative flex items-center bg-white rounded-2xl shadow-lg transition-all duration-300 border-2",
            isFocused ? "border-blue-500 shadow-2xl" : "border-transparent",
          )}
        >
          <div className="flex items-center pl-4 pr-2">
            <Search className="w-5 h-5 text-gray-400" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 py-4 px-2 text-gray-700 placeholder-gray-400 bg-transparent outline-none"
            disabled={isLoading}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 mr-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}

          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(
              "mx-2 px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2",
              query.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                : "bg-gray-100 text-gray-400 cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Search with AI
              </>
            )}
          </Button>
        </div>

        {/* Example suggestions */}
        {isFocused && !query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
            <p className="text-sm text-gray-500 mb-3">Try searching like:</p>
            <div className="flex flex-wrap gap-2">
              {exampleSearches.map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setQuery(example);
                    onSearch(example);
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
