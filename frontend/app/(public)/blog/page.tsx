import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { client } from "@/lib/sanity/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import type { Metadata } from "next";
import styles from './blog.module.css';
import type { BlogPost, CategoryWithCount, GroupedCategory } from "@/lib/types/blog";
import { categoryGroups } from "@/lib/utils/blogUtils";
import { CATEGORIES_QUERY, ALL_POSTS_QUERY } from "@/lib/sanity/queries";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryList } from "@/components/blog/CategoryList";

export const metadata: Metadata = {
  title: "Blog | Learn Vietnamese",
  description: "Explore Vietnamese learning tips and culture",
};

export default async function BlogPage() {
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Fetch all posts, no category filtering on the main page
  const posts = await client.fetch<BlogPost[]>(ALL_POSTS_QUERY);
  const allCategories = await client.fetch<CategoryWithCount[]>(CATEGORIES_QUERY);

  const groupedCategories: GroupedCategory[] = categoryGroups.map(group => ({
    name: group.name,
    categories: allCategories.filter((category: CategoryWithCount) => group.titles.includes(category.title)),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top section with title and user session info */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
        <div className="text-center sm:text-left flex-1 mb-6 sm:mb-0">
          <h1 className="text-4xl font-bold mb-2">Vietnamese Learning Blog</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our collection of articles, guides, and resources to help you master Vietnamese.
          </p>
        </div>
        {session && (
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="default" size="sm">Dashboard</Button>
            </Link>
            <Avatar>
              <AvatarImage src={session.user.user_metadata?.avatar_url || "https://via.placeholder.com/50"} />
              <AvatarFallback>{session.user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: All Posts */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold">All Posts</h2>
          </div>
          
          <div className={styles['posts-grid']}>
            {posts.length === 0 ? (
              <div className={`text-center py-12 text-gray-600 ${styles['fade-in']}`}>
                <p>No posts available at the moment. Check back later!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post: BlogPost, index: number) => (
                  <PostCard key={post._id} post={post} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Categories */}
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-semibold mb-8">Categories</h2>
          <CategoryList groupedCategories={groupedCategories} />
        </div>
      </div>
    </div>
  );
}