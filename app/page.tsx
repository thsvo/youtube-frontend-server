"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "./Header";
import Image from "next/image";

interface BlogPost {
  ID: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  thumbnail: string;
  featured_image: string;
  categories: string[];
  tags: string[];
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://wordpress.codeopx.com/wp-json/custom/v1/posts/"
      );
      if (response.ok) {
        const posts = await response.json();
        setBlogPosts(posts);
      } else {
        console.error("Failed to fetch blog posts");
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Track the search query for sitemap generation
      try {
        await fetch("/api/search-queries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery.trim() }),
        });
      } catch (trackingError) {
        // Don't fail the search if tracking fails
        console.error("Error tracking search query:", trackingError);
      }

      router.push(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  // Update metadata dynamically
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      // Redirect to search page if there's a query in URL
      router.push(`/search/${encodeURIComponent(query)}`);
    } else {
      document.title = "YouTube Search App";
    }
  }, [searchParams, router]);

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <Header></Header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-3xl font-bold mb-6">YouTube Search App</h1>

          <form onSubmit={handleSearch} className="w-full max-w-xl flex gap-2">
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
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Welcome message */}
        {/* <div className="text-center py-12">
          <div className="text-6xl mb-4">🎥</div>
          <h2 className="text-2xl font-semibold mb-4">Welcome to YouTube Search</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Search for your favorite videos and discover amazing content. 
            Enter a search term above to get started!
          </p>
        </div> */}

        {/* Blog Posts Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Latest Blog Posts</h2>
            <Button
              variant="outline"
              onClick={() => router.push("/blog")}
              className="flex items-center gap-2"
            >
              View All Posts
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card
                  key={post.ID}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featured_image && (
                    <div className="h-48 overflow-hidden">
                      <Image
                        width={400}
                        height={400}
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.date)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    {post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map((category, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/blog/${post.slug}`)}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && blogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No blog posts available at the moment.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
