import type { Metadata } from "next";

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

// Generate metadata for individual blog posts
export async function generateMetadata({ params }: BlogPostLayoutProps): Promise<Metadata> {
  const slug = params.slug;
  
  try {
    // Fetch the blog post data to generate proper metadata
    const response = await fetch('https://wordpress.codeopx.com/wp-json/custom/v1/posts/');
    if (response.ok) {
      const posts = await response.json();
      const post = posts.find((p: any) => p.slug === slug);
      
      if (post) {
        return {
          title: `${post.title} | Blog`,
          description: post.excerpt || post.title,
          keywords: [...(post.categories || []), ...(post.tags || [])],
          authors: [{ name: post.author }],
          openGraph: {
            title: post.title,
            description: post.excerpt || post.title,
            type: "article",
            images: post.featured_image ? [post.featured_image] : undefined,
            authors: [post.author],
            publishedTime: post.date,
          },
          twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || post.title,
            images: post.featured_image ? [post.featured_image] : undefined,
          },
        };
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // Fallback metadata
  return {
    title: "Blog Post | CodeOpx Search App",
    description: "Read our latest blog post with insights and tutorials.",
  };
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return children;
}
