import { client, urlFor } from "@/lib/sanity/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortableText } from "@portabletext/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import BlogImage from "@/components/blog/BlogImage";
import { notFound } from "next/navigation";

const POSTS_PER_PAGE = 5;

interface AuthorPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  mainImage: any;
  categories: Array<{ title: string }>;
}

async function getAuthorData(slug: string) {
  const author = await client.fetch(
    `
    *[_type == "author" && slug.current == $slug][0]{
      name,
      image,
      bio,
      "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage,
        categories[]->{title}
      }
    }
  `,
    { slug }
  );

  return author;
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const author = await getAuthorData(params.slug);
  if (!author) notFound();

  const page = Number(searchParams.page) || 0;
  const { name, image, bio, posts = [] } = author;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPage = Math.min(Math.max(page, 0), totalPages - 1);
  const currentPosts = posts.slice(
    currentPage * POSTS_PER_PAGE,
    (currentPage + 1) * POSTS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Author Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={image ? urlFor(image).width(128).height(128).url() : ""}
              alt={name}
            />
            <AvatarFallback className="text-2xl">
              {name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-center md:text-left">{name}</h1>
            <div className="prose mt-4">
              <PortableText value={bio} />
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="relative">
          <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>

          {posts.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              No posts available
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post: Post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group"
                  >
                    <Card className="overflow-hidden h-full">
                      <div className="aspect-video relative">
                        <BlogImage
                          image={post.mainImage}
                          alt={post.title}
                          width={400}
                          height={225}
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                          {post.categories?.[0] && (
                            <span className="text-sm text-blue-600">
                              {post.categories[0].title}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Navigation Buttons */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-4">
                  <Button
                    variant="outline"
                    asChild
                    disabled={currentPage === 0}
                  >
                    <Link
                      href={`/blog/author/${params.slug}?page=${currentPage - 1}`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    disabled={currentPage === totalPages - 1}
                  >
                    <Link
                      href={`/blog/author/${params.slug}?page=${currentPage + 1}`}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}