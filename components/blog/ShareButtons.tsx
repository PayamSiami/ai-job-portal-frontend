'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { Check, Copy } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

/**
 * Social share buttons + copy link for blog posts.
 * Wrapped in a client component because it needs navigator.clipboard.
 */
export function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${description ? `&via=jobmatch_ir` : ''}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Fallback for some browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        اشتراک‌گذاری:
      </span>

      <Button
        size="sm"
        variant="outline"
        className="h-9 w-9 p-0 rounded-full border-border/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600"
        asChild
      >
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="اشتراک‌گذاری در توییتر"
        >
          <FaTwitter className="w-4 h-4" />
        </a>
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="h-9 w-9 p-0 rounded-full border-border/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600"
        asChild
      >
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="اشتراک‌گذاری در لینکدین"
        >
          <FaLinkedin className="w-4 h-4" />
        </a>
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="h-9 w-9 p-0 rounded-full border-border/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600"
        asChild
      >
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="اشتراک‌گذاری در فیسبوک"
        >
          <FaFacebook className="w-4 h-4" />
        </a>
      </Button>

      <Button
        size="sm"
        variant="outline"
        className={cn(
          'h-9 px-3 rounded-full border-border/40 hover:bg-muted/50',
          copied && 'bg-green-50 dark:bg-green-950/40 text-green-600',
        )}
        onClick={copyToClipboard}
        aria-label="کپی لینک"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            کپی شد!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-1" />
            کپی لینک
          </>
        )}
      </Button>
    </div>
  );
}
