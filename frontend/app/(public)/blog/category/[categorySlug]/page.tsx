import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { client } from "@/lib/sanity/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import styles from '../../blog.module.css';
import type { BlogPost, CategoryWithCount, GroupedCategory, BlogCategory } from "@/lib/types/blog";
import { categoryDisplayNames, categoryGroups } from "@/lib/utils/blogUtils";
import { CATEGORIES_QUERY, POSTS_BY_CATEGORY_QUERY } from "@/lib/sanity/queries";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryList } from "@/components/blog/CategoryList";

interface CategoryPageProps {
  params: { categorySlug: string };
}

// Dynamic metadata for category pages
export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.categorySlug;
  const category = await client.fetch<BlogCategory>(`*[_type == "category" && slug.current == $slug][0]{title, "slug": slug.current}`, { slug });
  const previousImages = (await parent).openGraph?.images || [];

  const title = category ? `${categoryDisplayNames[category.title] || category.title} | Blog` : "Category Blog";
  const description = category ? `Posts about ${categoryDisplayNames[category.title] || category.title}` : "Explore blog posts by category";

  return {
    title,
    description,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  };
}

// Function to generate static paths for all categories
export async function generateStaticParams() {
  const categories = await client.fetch<{ slug: string }[]>(`*[_type == "category" && defined(slug.current)]{
    "slug": slug.current
  }`);

  return categories.map((category) => ({
    categorySlug: category.slug
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const selectedCategorySlug = params.categorySlug.toLowerCase();

  const posts = await client.fetch<BlogPost[]>(POSTS_BY_CATEGORY_QUERY, { categorySlug: selectedCategorySlug });
  const allCategories = await client.fetch<CategoryWithCount[]>(CATEGORIES_QUERY);
  
  const currentCategoryDetails = allCategories.find(cat => cat.slug === selectedCategorySlug);

  const groupedCategories: GroupedCategory[] = categoryGroups.map(group => ({
    name: group.name,
    categories: allCategories.filter((category: CategoryWithCount) => group.titles.includes(category.title)),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
        <div className="text-center sm:text-left flex-1 mb-6 sm:mb-0">
          <h1 className="text-4xl font-bold mb-2">
            {currentCategoryDetails ? `${categoryDisplayNames[currentCategoryDetails.title] || currentCategoryDetails.title}` : 'Category'} Posts
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore articles in the {currentCategoryDetails ? `"${categoryDisplayNames[currentCategoryDetails.title] || currentCategoryDetails.title}"` : 'selected'} category.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300">
              &larr; Back to all posts
            </Link>
          </div>
          
          <div className={styles['posts-grid']}>
            {posts.length === 0 ? (
              <div className={`text-center py-12 text-gray-600 ${styles['fade-in']}`}>
                <p>No posts available in the "{currentCategoryDetails ? categoryDisplayNames[currentCategoryDetails.title] || currentCategoryDetails.title : selectedCategorySlug}" category. Check back later!</p>
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

        <div className="lg:col-span-1">
          <h2 className="text-3xl font-semibold mb-8">Categories</h2>
          <CategoryList groupedCategories={groupedCategories} selectedCategorySlug={selectedCategorySlug} />
        </div>
      </div>
    </div>
  );
}