import { client } from "@/shared/lib/sanity/client";
import { Card } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/utils/cn";
import {
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { BlogPost, SanityAuthor } from "@/features/blog/types/blog";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { ShareButtons } from "@/features/blog/components/ShareButtons";
import Link from "next/link";
import BlogImage from "@/features/blog/components/BlogImage";
import { AuthorCard } from "@/features/blog/components/AuthorCard";
import { TableOfContents } from "@/features/blog/components/TableOfContents";
import { DownloadPDFButton } from "@/features/blog/components/DownloadPDFButton"; 
import { CommentSection } from "@/features/blog/components/CommentSection";

// Helper function to get text content from a node
const getChildrenText = (node: any) => {
  if (!node.children) return '';
  return node.children.map((child: any) => child.text || '').join('');
};

// Function to filter and transform nodes based on a matcher
const filter = (ast: any[], match: (node: any) => boolean) =>
  ast.reduce((acc: any[], node) => {
    if (match(node)) acc.push(node);
    if (node.children) acc.push(...filter(node.children, match));
    return acc;
  }, []);

// Function to find and process headings
const findHeadings = (ast: any[]) =>
  filter(ast, node => /h\d/.test(node.style)).map(node => {
    const text = getChildrenText(node);
    // Create a slug from the heading text
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const level = Number(node.style.slice(1));
    return { ...node, text, slug, level };
  });

// Helper functions for nesting
const get = (object: any, path: any[]) => path.reduce((prev, curr) => prev[curr], object);
const getObjectPath = (path: any[]) =>
  path.length === 0
    ? path
    : ['subheadings'].concat(path.join('.subheadings.').split('.'));

// Function to create nested outline
const parseOutline = (ast: any[]) => {
  const outline = { subheadings: [] as any[] };
  const headings = findHeadings(ast);
  const path: number[] = [];
  let lastLevel = 0;

  headings.forEach(heading => {
    const level = heading.level;
    heading.subheadings = [];

    if (level < lastLevel) {
      for (let i = lastLevel; i >= level; i--) path.pop();
    } else if (level === lastLevel) {
      path.pop();
    }

    const prop = get(outline, getObjectPath(path));
    prop.subheadings.push(heading);
    path.push(prop.subheadings.length - 1);
    lastLevel = level;
  });

  return outline.subheadings;
};

const PortableTextImage = ({ value }: { value: any }) => {
  return (
    <div className="my-8">
      <BlogImage
        image={value}
        alt={value.alt || 'Blog content image'}
        width={800}
        height={500}
        className="rounded-lg w-full h-auto"
      />
      {value.caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {value.caption}
        </figcaption>
      )}
    </div>
  );
};

interface HeadingProps {
  value: any & { id?: string };
  children?: React.ReactNode;
}

// Define a type for comments, mirroring the Sanity schema but for client-side use
export interface CommentType {
  _id: string;
  name: string;
  email?: string; // Email might be sensitive, consider if it should always be fetched
  commentText: string;
  createdAt: string;
  parentComment?: { _id: string; name: string }; // Basic info for parent
  likes: number;
  // We don't fetch isApproved or captchaIdentifier to the client for approved comments display
  replies?: CommentType[]; // For nested replies, populated client-side or by query
  _rev?: string; // For optimistic updates or edit checks
  // If you add `updatedAt` to Sanity schema and fetch it:
  // updatedAt?: string;
}

// Updated Post Query to include comments
const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  "body": body[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->
    }
  },
  mainImage,
  contentTable,
  categories[]->{_id, title, slug},
  tags[]->{_id, title, slug},
  "author": author->{
    name,
    slug,
    image,
    bio
  },
  "comments": *[_type == "comment" && post._ref == ^._id && isApproved == true && !defined(parentComment)] | order(createdAt desc) {
    _id,
    name,
    commentText,
    createdAt,
    likes,
    "replies": *[_type == "comment" && parentComment._ref == ^._id && isApproved == true] | order(createdAt asc) {
      _id,
      name,
      commentText,
      createdAt,
      likes
    }
  }
}`;

function renderBlockContent(blocks: any[]) {
  if (!blocks || !Array.isArray(blocks)) {
    return <p className="text-gray-500">No content available.</p>;
  }

  // Add IDs to headings for linking
  const addHeadingIds = (node: any) => {
    if (node.style && /h\d/.test(node.style)) {
      const text = getChildrenText(node);
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { ...node, id: slug };
    }
    return node;
  };

  const blocksWithIds = blocks.map(addHeadingIds);

  return (
    <PortableText
      value={blocksWithIds}
      components={{
        block: {
          h2: ({ value, children }: HeadingProps) => (
            <h2 id={value.id} className="text-3xl font-semibold text-gray-900 mt-6 mb-4 border-b border-gray-200 pb-2">
              {children}
            </h2>
          ),
          h3: ({ value, children }: HeadingProps) => (
            <h3 id={value.id} className="text-2xl font-medium text-gray-800 mt-5 mb-3">
              {children}
            </h3>
          ),
          h4: ({ value, children }: HeadingProps) => (
            <h4 id={value.id} className="text-xl font-medium text-gray-700 mt-4 mb-2">
              {children}
            </h4>
          ),
          h5: ({ value, children }: HeadingProps) => (
            <h5 id={value.id} className="text-lg font-medium text-gray-600 mt-3 mb-2">
              {children}
            </h5>
          ),
        },
        types: {
          image: PortableTextImage,
        },
      }}
    />
  );
}

const InfoBox = ({
  variant,
  children,
}: {
  variant: string;
  children: React.ReactNode;
}) => {
  const getIcon = () => {
    switch (variant) {
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyle = () => {
    switch (variant) {
      case "info":
        return "bg-blue-50 border-blue-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className={cn("p-4 rounded-lg border", getStyle())}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div>{children}</div>
      </div>
    </div>
  );
};

const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-500 mb-3">{title}</h3>
    {children}
  </div>
);

interface BlogPageProps {
  params: { slug: string };
}

interface Tag {
  _id: string;
  title: string;
}

// Extend BlogPost type to include comments
interface FullBlogPost extends BlogPost {
    comments: CommentType[];
    author: SanityAuthor; // Ensure author is properly typed if not already
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post: FullBlogPost = await client.fetch(POST_QUERY, { slug: params.slug });
  if (!post) return notFound();

  const category = post.categories?.[0]?.title || "Uncategorized";
  const tags = post.tags || [];
  const outline = parseOutline(post.body);
  // Ensure shareUrl is correctly constructed with your domain
  const shareUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug.current}` : `/blog/${post.slug.current}`;
  const shareTitle = post.title;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-500 border-blue-500 hover:bg-blue-50"
                asChild
              >
                <Link href="/blog">Back to All Blog</Link>
              </Button>
            </div>
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-2">{category}</p>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            </div>
            <div className="mb-6">
              {post.mainImage ? (
                <BlogImage
                  image={post.mainImage}
                  alt={post.title}
                  width={550}
                  height={310}
                  className="rounded-xl object-cover w-full max-w-[550px] h-auto"
                />
              ) : (
                <img
                  src={`https://via.placeholder.com/550x310.png?text=${encodeURIComponent(post.title)}`}
                  alt={post.title}
                  className="rounded-xl object-cover w-full max-w-[550px] h-auto bg-gray-200"
                />
              )}
            </div>
            <div className="prose max-w-none mb-8">
              {renderBlockContent(post.body)}
            </div>
            
            {/* Author Card */}
            {post.author && <AuthorCard author={post.author} />}

            {/* Comment Section */}
            <Separator className="my-8" /> 
            <CommentSection postId={post._id} initialComments={post.comments || []} />

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Table of Contents */}
              {outline && outline.length > 0 && (
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-4">On this page</h2>
                  <ScrollArea className="h-[200px]">
                    <TableOfContents outline={outline} />
                  </ScrollArea>
                </Card>
              )}

              <Separator />

              {/* Tags */}
              {tags.length > 0 && (
                <Card className="p-4">
                  <SidebarSection title="Tags">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag: Tag) => (
                        <Badge
                          key={tag._id}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                        >
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  </SidebarSection>
                </Card>
              )}

              {/* Share */}
              <Card className="p-4">
                <SidebarSection title="Share this Guide">
                  <ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} />
                </SidebarSection>
              </Card>

              {/* Download PDF */}
              <Card className="p-4">
                <SidebarSection title="Enjoy reading this?">
                  <DownloadPDFButton postBody={post.body} postTitle={post.title} />
                </SidebarSection>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}