"use client";

import { FAQStructuredData, FAQ_CONTENT } from '@/components/seo/FAQStructuredData';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

/**
 * Renders a visible FAQ section with matching FAQPage JSON-LD structured data.
 * Google requires FAQ content to be visible on the page for rich result eligibility.
 * Server-rendered JSON-LD + client-side accordion for good UX.
 */
export const FAQSection = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <>
      <FAQStructuredData />
      <section 
        className="py-12 md:py-16 bg-gray-50/50 dark:bg-gray-900/20 rounded-xl mb-12"
        aria-labelledby="faq-heading"
      >
        <div className="text-center mb-8">
          <h2 
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100"
          >
            سؤالات متداول
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            سؤالاتی که بیشترین درخواست را دریافت می‌کنند. اگر سؤالی ندارید، ما همیشه در
            خدمت‌تان هستیم.
          </p>
        </div>

        <div 
          className="max-w-4xl mx-auto space-y-3"
          role="list"
        >
          {FAQ_CONTENT.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                role="listitem"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-right font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-question-${item.id}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">
                      ?
                    </span>
                    {item.question}
                  </span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
                  )}
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${item.id}`}
                  className={`px-6 pb-4 pt-2 text-right text-gray-600 dark:text-gray-300 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <p className="leading-relaxed pr-9">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};