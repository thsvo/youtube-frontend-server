"use client";

export const runtime = 'edge';

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Share2, Bookmark, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Header } from "../../Header";
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

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const slug = params.slug as string;

  // Generate UUID for tracking
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Fetch single blog post by slug
  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);

      // First fetch all posts to find the one with matching slug
      const response = await fetch('https://wordpress.codeopx.com/wp-json/custom/v1/posts/');
      if (response.ok) {
        const posts = await response.json();
        const foundPost = posts.find((p: BlogPost) => p.slug === slug);
        
        if (foundPost) {
          // Add UUID for tracking
          foundPost.uuid = generateUUID();
          setPost(foundPost);
          
          // Track blog post view
          trackBlogEvent({
            postId: foundPost.ID,
            slug: foundPost.slug,
            uuid: foundPost.uuid,
            action: 'detailed_view'
          });

          // Find related posts (same categories)
          const related = posts
            .filter((p: BlogPost) => 
              p.ID !== foundPost.ID && 
              p.categories.some(cat => foundPost.categories.includes(cat))
            )
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          setError('Blog post not found');
        }
      } else {
        setError('Failed to fetch blog post');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Error fetching blog post');
    } finally {
      setLoading(false);
    }
  };

  // Fetch blog post on component mount
  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: post?.title,
      text: post?.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Bookmark functionality (local storage)
  const handleBookmark = () => {
    if (!post) return;

    const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
    const isCurrentlyBookmarked = bookmarks.some((b: any) => b.ID === post.ID);

    if (isCurrentlyBookmarked) {
      const updatedBookmarks = bookmarks.filter((b: any) => b.ID !== post.ID);
      localStorage.setItem('blogBookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      const newBookmarks = [...bookmarks, {
        ID: post.ID,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        bookmarkedAt: new Date().toISOString()
      }];
      localStorage.setItem('blogBookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(true);
    }
  };

  // Check if post is bookmarked
  useEffect(() => {
    if (post) {
      const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
      const isBookmarked = bookmarks.some((b: any) => b.ID === post.ID);
      setIsBookmarked(isBookmarked);
    }
  }, [post]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'The blog post you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
              <Link href="/blog">
                <Button>Browse All Posts</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title }
          ]} 
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end mb-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <article className="mb-12">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              {post.uuid && (
                <span className="text-xs font-mono">
                  ID: {post.uuid.split('-')[0]}
                </span>
              )}
            </div>

            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card 
                  key={relatedPost.ID} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                >
                  {relatedPost.featured_image && (
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={relatedPost.featured_image} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(relatedPost.date)}</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
