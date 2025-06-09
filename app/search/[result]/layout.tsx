import type { Metadata } from "next";

interface SearchLayoutProps {
  children: React.ReactNode;
  params: { result: string };
}

export async function generateMetadata({ params }: SearchLayoutProps): Promise<Metadata> {
  const searchTerm = decodeURIComponent(params.result);
  
  return {
    title: `"${searchTerm}" - Search Results`,
    description: `Search results for "${searchTerm}" on YouTube Search App`,
    openGraph: {
      title: `"${searchTerm}" - Search Results`,
      description: `Search results for "${searchTerm}" on YouTube Search App`,
    },
  };
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  return children;
}
