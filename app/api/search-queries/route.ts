import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

// In-memory storage for search queries (for Edge Runtime compatibility)
// In production, you'd want to use a database or external storage service
let searchQueriesStorage: string[] = [];

// Fallback popular terms if no queries exist
const popularTerms = [
  "music",
  "gaming", 
  "tutorial",
  "comedy",
  "news",
  "sports",
  "technology",
  "cooking",
  "travel",
  "education",
  "entertainment",
  "movies",
  "animation",
  "documentary",
  "live stream"
];

// GET: Return all search queries for sitemap generation
export async function GET() {
  try {
    // If no queries exist, return popular fallback terms
    if (searchQueriesStorage.length === 0) {
      return NextResponse.json({ queries: popularTerms });
    }

    // Return unique queries
    const uniqueQueries = Array.from(new Set(searchQueriesStorage));
    return NextResponse.json({ queries: uniqueQueries });
  } catch (error) {
    console.error("Error in GET /api/search-queries:", error);
    return NextResponse.json({ error: "Failed to fetch search queries" }, { status: 500 });
  }
}

// POST: Add a new search query
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const cleanQuery = query.trim().toLowerCase();
    
    // Add new query
    searchQueriesStorage.push(cleanQuery);
    
    // Keep only last 1000 queries to prevent memory issues
    if (searchQueriesStorage.length > 1000) {
      searchQueriesStorage = searchQueriesStorage.slice(-1000);
    }

    return NextResponse.json({ success: true, query: cleanQuery });
  } catch (error) {
    console.error("Error in POST /api/search-queries:", error);
    return NextResponse.json({ error: "Failed to save search query" }, { status: 500 });
  }
}
