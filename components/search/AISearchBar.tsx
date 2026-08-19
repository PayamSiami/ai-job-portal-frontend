'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isLoading?: boolean;
}

const SUGGESTED_QUERIES = [
  'توسعه‌دهنده ارشد React با قابلیت دورکاری',
  'مهندس فول‌استک با ۵+ سال سابقه کار',
  'متخصص علم داده و یادگیری ماشین در تهران',
  'کارآموز برنامه‌نویسی برای تازه‌کارها',
  'مدیر محصول با حقوق بالای ۱۵۰ میلیون تومان',
  'مهندس دواپس با قابلیت دورکاری',
  'طراح UI/UX در استارتاپ‌های فناوری',
  'توسعه‌دهنده اپلیکیشن موبایل با React Native',
];

export function AISearchBar({ onSearch, initialQuery = '', isLoading = false }: AISearchBarProps) {
  // Initialize state with the prop value
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-3 justify-end">
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">جستجوی هوشمند با هوش مصنوعی</span>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="شغل ایده‌آل خود را به زبان ساده توصیف کنید..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pr-10 pl-24 py-6 bg-white/95 border-0 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 text-right"
            disabled={isLoading}
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
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
                  <Search className="w-4 h-4 ml-1" />
                  جستجو
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        {showSuggestions && !isLoading && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-2 text-right">جستجوهای پیشنهادی:</p>
              <div className="space-y-1">
                {SUGGESTED_QUERIES.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="w-full justify-end text-right px-3 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2 text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

      <p className="text-white/80 text-xs mt-3 flex items-center gap-2 flex-wrap justify-end">
        <span className="bg-white/10 px-2 py-1 rounded">"توسعه‌دهنده ارشد React با حقوق بالای ۱۲۰ میلیون"</span>
        <span className="bg-white/10 px-2 py-1 rounded">"تحلیل‌گر داده تازه‌کار در تهران"</span>
        <span>:مثال</span>
      </p>
    </div>
  );
}