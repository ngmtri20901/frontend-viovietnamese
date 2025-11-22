// This file will contain the PostCard component. 

import Link from "next/link";
import { UserRoundPen, CalendarDays, ImageOff } from 'lucide-react';
import { imageUrlBuilder } from "@/lib/sanity/imageUrlBuilder";
import type { BlogPost } from "@/lib/types/blog";

interface PostCardProps {
  post: BlogPost;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  return (
    <article 
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] fade-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="md:flex">
        <div className="md:w-1/3">
          {post.mainImage ? (
            <Link href={`/blog/${post.slug.current}`} aria-label={post.title}>
              <img
                src={imageUrlBuilder.image(post.mainImage).width(400).height(250).auto('format').quality(80).url()}
                alt={`Cover image for ${post.title}`}
                className="w-full h-48 md:h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>
          ) : (
            <Link href={`/blog/${post.slug.current}`} aria-label={post.title}>
              <div className="w-full h-48 md:h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ImageOff size={48} />
              </div>
            </Link>
          )}
        </div>
        <div className="p-6 md:w-2/3 flex flex-col">
          <Link href={`/blog/${post.slug.current}`}>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800 hover:text-blue-600 transition-colors duration-200">
              {post.title}
            </h3>
          </Link>
          {post.excerpt && (
            <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
              {post.excerpt}
            </p>
          )}
          <div className="mt-auto flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 space-y-2 sm:space-y-0 sm:space-x-4">
            {post.author?.name && (
              <div className="flex items-center">
                <UserRoundPen size={14} className="mr-1.5" />
                <span>{post.author.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <CalendarDays size={14} className="mr-1.5" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 