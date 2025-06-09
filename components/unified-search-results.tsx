import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoResults } from "./video-results"
import { BlogResults } from "./blog-results"

interface Video {
  _id: string
  videoId: string
  title: string
  description: string
  thumbnail: string
  createdAt: string
}

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

interface UnifiedSearchResultsProps {
  videos: Video[]
  blogPosts: BlogPost[]
  isLoadingVideos: boolean
  isLoadingBlogs: boolean
  videosCount: number
  blogsCount: number
}

export function UnifiedSearchResults({ 
  videos, 
  blogPosts, 
  isLoadingVideos, 
  isLoadingBlogs,
  videosCount,
  blogsCount
}: UnifiedSearchResultsProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          All ({videosCount + blogsCount})
        </TabsTrigger>
        <TabsTrigger value="videos">
          Videos ({videosCount})
        </TabsTrigger>
        <TabsTrigger value="blogs">
          Blogs ({blogsCount})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-8">
        {/* Videos Section */}
        {(videosCount > 0 || isLoadingVideos) && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Videos</h2>
            <VideoResults videos={videos} isLoading={isLoadingVideos} />
          </div>
        )}
        
        {/* Blog Posts Section */}
        {(blogsCount > 0 || isLoadingBlogs) && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
            <BlogResults posts={blogPosts} isLoading={isLoadingBlogs} />
          </div>
        )}
        
        {/* No results message */}
        {!isLoadingVideos && !isLoadingBlogs && videosCount === 0 && blogsCount === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try searching with different keywords or check your spelling
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="videos">
        <VideoResults videos={videos} isLoading={isLoadingVideos} />
      </TabsContent>
      
      <TabsContent value="blogs">
        <BlogResults posts={blogPosts} isLoading={isLoadingBlogs} />
      </TabsContent>
    </Tabs>
  )
}
