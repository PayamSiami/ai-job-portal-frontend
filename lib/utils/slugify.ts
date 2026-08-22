/**
 * Generate a URL-friendly slug from a Persian/English heading string.
 * Handles Persian characters by transliterating to a simple ASCII slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/[؀-ۿ]/g, (match) => {
      // Simple transliteration for Persian characters to keep slugs URL-safe
      const translit: Record<string, string> = {
        ا: 'a',
        ب: 'b',
        پ: 'p',
        ت: 't',
        ث: 's',
        ج: 'j',
        چ: 'ch',
        ح: 'h',
        خ: 'kh',
        د: 'd',
        ذ: 'z',
        ر: 'r',
        ز: 'z',
        ژ: 'zh',
        س: 's',
        ش: 'sh',
        ص: 's',
        ض: 'd',
        ط: 't',
        ظ: 'z',
        ع: 'a',
        غ: 'gh',
        ف: 'f',
        ق: 'q',
        ک: 'k',
        گ: 'g',
        ل: 'l',
        م: 'm',
        ن: 'n',
        و: 'v',
        ه: 'h',
        ی: 'y',
      };
      return translit[match] || '-';
    })
    .replace(/[؀-ۿݐ-ݿ]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim() || 'section';
}

/**
 * Extract heading text from a content array to build a table of contents.
 * Returns array of { id, text, level } for each heading.
 */
import type { BlogPostContent } from '@/lib/data/blogPosts';

export function extractHeadings(
  content: BlogPostContent[]
): { id: string; text: string; level: number }[] {
  if (!content || !Array.isArray(content)) return [];

  const headings: { id: string; text: string; level: number }[] = [];

  content.forEach((item) => {
    if (item.type === 'heading' && item.text) {
      headings.push({
        id: slugify(item.text),
        text: item.text,
        level: item.level || 2,
      });
    }
  });

  return headings;
}
