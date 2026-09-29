export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  authorTitle: string;
  category: string;
  categorySlug: string;
  tags: string[];
  readingTime: number;
  image: string;
  featured: boolean;
  content: BlogPostContent[];
}

export interface BlogPostContent {
  type: "heading" | "paragraph" | "list" | "quote" | "image";
  text?: string;
  links?: Array<{ search_text: string; href: string; label?: string }>;
  level?: 2 | 3 | 4;
  items?: string[];
  ordered?: boolean;
  attribution?: string;
  src?: string;
  alt?: string;
  caption?: string;
}
