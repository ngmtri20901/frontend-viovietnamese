import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { ArrowRight } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  date: string
  category: string
  imageUrl: string
  slug: string
  content: any[]
  tableOfContents: any[]
  tags: string[]
}

const featuredPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to master Vietnamese tones",
    date: "September, 23, 2024",
    category: "Learning",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "how-to-master-vietnamese-tones",
    content: [],
    tableOfContents: [],
    tags: [],
  },
  {
    id: "2",
    title: "Common Vietnamese phrases for travelers",
    date: "April, 07, 2024",
    category: "Travel",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "common-vietnamese-phrases-travelers",
    content: [],
    tableOfContents: [],
    tags: [],
  },
  {
    id: "3",
    title: "Vietnamese culture: What you need to know",
    date: "August, 31, 2024",
    category: "Culture",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "vietnamese-culture-what-to-know",
    content: [],
    tableOfContents: [],
    tags: [],
  },
]

export default function BlogSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm font-medium">Articles</p>
          <h2 className="text-4xl font-bold">Learn more about Vietnamese</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our blog for insightful articles, language tips, and cultural insights to enhance your Vietnamese
            learning journey.
          </p>
          <Button variant="link" className="group">
            View All Blogs
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 hover:bg-white/95 text-gray-900">{post.category}</Badge>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  <time className="text-sm text-gray-500">{post.date}</time>
                  <div className="flex items-center text-sm font-medium text-blue-600">
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
