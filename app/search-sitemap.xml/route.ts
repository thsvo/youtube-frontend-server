import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  try {
    let searchQueries: string[] = [];

    // Try to fetch from API
    try {
      const response = await fetch(`${baseUrl}/api/search-queries`, {
        next: { revalidate: 300 } // Revalidate every 5 minutes
      });
      
      if (response.ok) {
        const data = await response.json();
        searchQueries = data.queries || [];
        console.log("Search sitemap - Found queries from API:", searchQueries);
      }
    } catch (error) {
      console.error("Error fetching from API:", error);
    }

    // Generate XML sitemap for search pages
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${searchQueries
  .map(
    (query) => `  <url>
    <loc>${baseUrl}/search/${encodeURIComponent(query)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error generating search sitemap:", error);
    
    // Return empty sitemap on error
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
