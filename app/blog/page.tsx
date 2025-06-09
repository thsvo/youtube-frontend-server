"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, User, ArrowLeft, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Header } from "../Header";
import { generateUUID, formatDate, trackBlogEvent } from "@/lib/blog-utils";
import Link from "next/link";

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
  uuid?: string;
}

export default function BlogLandingPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  // Generate UUID for tracking
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://wordpress.codeopx.com/wp-json/custom/v1/posts/');
      if (response.ok) {
        const posts = await response.json();
        // Add UUID to each post for tracking
        const postsWithUUID = posts.map((post: BlogPost) => ({
          ...post,
          uuid: generateUUID()
        }));
        setBlogPosts(postsWithUUID);
        setFilteredPosts(postsWithUUID);
        
        // Extract unique categories
        const allCategories = postsWithUUID.flatMap((post: BlogPost) => post.categories);
        const uniqueCategories = Array.from(new Set(allCategories));
        setCategories(uniqueCategories);
      } else {
        console.error('Failed to fetch blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = blogPosts;

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post =>
        post.categories.includes(selectedCategory)
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, blogPosts]);

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle post click with tracking
  const handlePostClick = (post: BlogPost) => {
    // Track blog post view
    trackBlogEvent({
      postId: post.ID,
      slug: post.slug,
      uuid: post.uuid || generateUUID(),
      action: 'view'
    });

    router.push(`/blog/${post.slug}`);
  };

  const LoadingSkeleton = () => (
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
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.map((post) => (
        <Card 
          key={post.ID} 
          className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={() => handlePostClick(post)}
        >
          {post.featured_image && (
            <div className="h-48 overflow-hidden">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
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
                {post.categories.slice(0, 3).map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {post.categories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.categories.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-6">
      {filteredPosts.map((post) => (
        <Card 
          key={post.ID} 
          className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={() => handlePostClick(post)}
        >
          <div className="flex flex-col md:flex-row">
            {post.featured_image && (
              <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex-1 p-6">
              <div className="mb-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.date)}
                </span>
              </div>
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {post.excerpt}
              </p>
              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.slice(0, 5).map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {post.categories.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.categories.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Breadcrumb items={[{ label: "Blog" }]} />
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover insights, tutorials, and stories from our team. Stay updated with the latest trends and best practices.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <div className="text-sm text-muted-foreground mb-6">
              Showing {filteredPosts.length} of {blogPosts.length} posts
              {selectedCategory && ` in "${selectedCategory}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredPosts.length > 0 ? (
          viewMode === "grid" ? <GridView /> : <ListView />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory
                ? "Try adjusting your search criteria or filters."
                : "No blog posts are available at the moment."}
            </p>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
