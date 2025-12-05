import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { ArrowRight } from "lucide-react"
import { client } from "@/shared/lib/sanity/client"
import { urlFor } from "@/shared/lib/sanity/client"
import { LATEST_POSTS_QUERY } from "@/shared/lib/sanity/queries"
import type { BlogPost } from "@/features/blog/types/blog"

export default async function BlogSection() {
  // Fetch latest 3 posts from Sanity
  const latestPosts = await client.fetch<BlogPost[]>(LATEST_POSTS_QUERY)

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="font-ui text-sm font-medium text-ds-text-light uppercase tracking-wide">Articles</p>
          <h2 className="font-display text-ds-primary text-4xl font-bold">Learn more about Vietnamese</h2>
          <p className="font-body text-ds-text-light max-w-2xl mx-auto leading-relaxed">
            Explore our blog for insightful articles, language tips, and cultural insights to enhance your Vietnamese
            learning journey.
          </p>
          <Link href="/blog">
            <Button variant="link" className="group font-ui">
              View All Blogs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="font-body text-ds-text-light">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            latestPosts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`} className="group">
                <article className="h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                    {post.mainImage ? (
                      <Image
                        src={urlFor(post.mainImage).width(600).height(450).url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ds-primary/10 to-ds-secondary/10 flex items-center justify-center">
                        <span className="text-6xl">📚</span>
                      </div>
                    )}
                    {post.categories && post.categories.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 hover:bg-white/95 text-gray-900 font-ui">
                          {post.categories[0].title}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="font-title text-xl font-semibold text-gray-800 group-hover:text-ds-primary transition-colors">
                      {post.title}
                    </h3>
                    <time className="font-body text-sm text-ds-text-lighter">
                      {formatDate(post.publishedAt)}
                    </time>
                    <div className="flex items-center text-sm font-medium text-ds-primary font-ui">
                      Read more
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
