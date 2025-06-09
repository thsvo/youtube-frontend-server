"use client";

export const runtime = 'edge';

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnifiedSearchResults } from "@/components/unified-search-results";
import { Header } from "../../Header";

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

export default function SearchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [videos, setVideos] = useState([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  const searchTerm = decodeURIComponent(params.result as string);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const WORDPRESS_API_URL = "https://wordpress.codeopx.com/wp-json/custom/v1/posts/";

  // Function to perform video search
  const performVideoSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoadingVideos(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Video search failed");
      }

      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error searching videos:", error);
      setVideos([]);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  // Function to perform blog search
  const performBlogSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoadingBlogs(true);

    try {
      const response = await fetch(
        `${WORDPRESS_API_URL}?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Blog search failed");
      }

      const data = await response.json();
      setBlogPosts(data);
    } catch (error) {
      console.error("Error searching blog posts:", error);
      setBlogPosts([]);
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  // Function to perform combined search
  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    // Track the search query for sitemap generation
    try {
      await fetch('/api/search-queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });
    } catch (trackingError) {
      // Don't fail the search if tracking fails
      console.error("Error tracking search query:", trackingError);
    }

    // Perform both searches in parallel
    await Promise.all([
      performVideoSearch(query),
      performBlogSearch(query)
    ]);
  };

  // Handle new search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  // Load search results when component mounts or search term changes
  useEffect(() => {
    if (searchTerm) {
      setSearchQuery(searchTerm);
      performSearch(searchTerm);
      
      // Update page title
      document.title = `"${searchTerm}" - Search Results`;
    }
  }, [searchTerm]);

  const isLoading = isLoadingVideos || isLoadingBlogs;
  const totalResults = videos.length + blogPosts.length;

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back button and search header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Search form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for videos and blog posts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        {/* Search results header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Search Results for "{searchTerm}"
          </h1>
          {!isLoading && totalResults > 0 && (
            <p className="text-muted-foreground">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} 
              ({videos.length} video{videos.length !== 1 ? 's' : ''}, {blogPosts.length} blog post{blogPosts.length !== 1 ? 's' : ''})
            </p>
          )}
        </div>

        {/* Search results */}
        <UnifiedSearchResults 
          videos={videos}
          blogPosts={blogPosts}
          isLoadingVideos={isLoadingVideos}
          isLoadingBlogs={isLoadingBlogs}
          videosCount={videos.length}
          blogsCount={blogPosts.length}
        />
        
        {/* No results message */}
        {!isLoading && totalResults === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-4">
              Try searching with different keywords or check your spelling
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="mt-4"
            >
              Go to Home
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
