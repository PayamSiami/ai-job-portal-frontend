'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Search, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isLoading?: boolean;
}

const SUGGESTED_QUERIES = [
  'Remote senior React developer jobs',
  'Full stack engineer with 5+ years experience',
  'Data scientist machine learning roles in NYC',
  'Entry level software engineer internships',
  'Product manager positions with salary above 150k',
  'DevOps engineer remote work',
  'UX/UI designer positions in tech startups',
  'Mobile app developer React Native jobs',
];

export function AISearchBar({ onSearch, initialQuery = '', isLoading = false }: AISearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">AI-Powered Job Search</span>
        <Badge className="bg-white/20 text-white border-0">Beta</Badge>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Describe your ideal job in natural language..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-24 py-6 bg-white/95 border-0 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-white/50"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!query.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-1" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        {showSuggestions && !isLoading && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-2">Try these searches:</p>
              <div className="space-y-1">
                {SUGGESTED_QUERIES.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2 text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

      <p className="text-white/80 text-xs mt-3 flex items-center gap-2">
        <span>Example:</span>
        <span className="bg-white/10 px-2 py-1 rounded">"Remote senior React developer with salary above 120k"</span>
        <span className="bg-white/10 px-2 py-1 rounded">"Entry level data analyst jobs in NYC"</span>
      </p>
    </div>
  );
}