import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Calendar, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  ID: number
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  author: string
  thumbnail: string
  featured_image: string
  categories: string[]
  tags: string[]
}

interface BlogResultsProps {
  posts: BlogPost[]
  isLoading: boolean
}

export function BlogResults({ posts, isLoading }: BlogResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No blog posts found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.ID} className="overflow-hidden flex flex-col">
          {(post.thumbnail || post.featured_image) && (
            <Link href={`/blog/${post.slug}`} className="relative aspect-video">
              <Image
                src={post.thumbnail || post.featured_image || "/placeholder.jpg"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </Link>
          )}
          <CardHeader>
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            </Link>
            <CardDescription className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
            </p>
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.categories.slice(0, 2).map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {post.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.categories.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/blog/${post.slug}`}>Read More</Link>
            </Button>
            <Button size="sm" asChild>
              <a
                href={`https://wordpress.codeopx.com/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-1"
              >
                Original <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
