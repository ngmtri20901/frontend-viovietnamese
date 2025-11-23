// This file will store shared TypeScript type definitions for the blog.

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface BlogCategory {
  _id: string;
  title: string;
  slug: string;
}

export interface BlogAuthor {
  name: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: SanitySlug;
  publishedAt: string;
  excerpt?: string;
  mainImage?: SanityImage;
  categories?: BlogCategory[];
  author?: BlogAuthor;
}

export interface CategoryWithCount extends BlogCategory {
  postCount: number;
}

export interface GroupedCategory {
  name: string;
  categories: CategoryWithCount[];
} 

export interface Tag {
  id: string
  name: string
}

export interface BlogContent {
  id: string
  type: string
  content: string
  metadata?: {
    level?: number
  }
}

export interface SanityAsset {
  _ref: string;
  _type: string;
  url?: string; // populated by asset->
}

export interface SanitySlug {
  current: string;
  _type: string;
}

export interface SanityTag {
  _id: string;
  title: string;
  slug?: SanitySlug; // Optional if not always fetched
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug?: SanitySlug; // Optional if not always fetched
}

export interface SanityAuthor {
  name: string;
  slug: SanitySlug;
  image: any; // Can be more specific if you have an Image type
  bio: any[]; // Portable Text
}

export interface BlogPostCore {
  _id: string;
  title: string;
  slug: SanitySlug;
  publishedAt: string;
  excerpt?: string;
  body: any[]; // Portable Text
  mainImage?: any; // Can be more specific, linked asset
  categories?: SanityCategory[];
  tags?: SanityTag[];
}

// This is the main BlogPost type you might have been using
export interface BlogPost extends BlogPostCore {
  author?: SanityAuthor; // Optional at base level, required in FullBlogPost
  // any other fields specific to a general blog post query
}

// Defined in [slug]/page.tsx, ensure consistency or move here
export interface CommentType {
  _id: string;
  name: string;
  email?: string; 
  commentText: string;
  createdAt: string;
  parentComment?: { _id: string; name: string };
  likes: number;
  replies?: CommentType[];
  _rev?: string;
  updatedAt?: string;
}

// Extended type used in the single post page query
export interface FullBlogPost extends BlogPostCore {
  author: SanityAuthor; // Author is required here
  comments: CommentType[];
}
