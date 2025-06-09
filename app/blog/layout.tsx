import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | CodeOpx Search App",
  description: "Discover insights, tutorials, and stories from our team. Stay updated with the latest trends and best practices.",
  keywords: ["blog", "tutorials", "insights", "technology", "web development"],
  openGraph: {
    title: "Blog | CodeOpx Search App",
    description: "Discover insights, tutorials, and stories from our team.",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
