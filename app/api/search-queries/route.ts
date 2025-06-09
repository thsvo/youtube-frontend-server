import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SEARCH_QUERIES_FILE = path.join(process.cwd(), "data", "search-queries.json");

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(SEARCH_QUERIES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read existing search queries
function getSearchQueries(): string[] {
  try {
    ensureDataDirectory();
    if (fs.existsSync(SEARCH_QUERIES_FILE)) {
      const data = fs.readFileSync(SEARCH_QUERIES_FILE, "utf8");
      const parsed = JSON.parse(data);
      return parsed.queries || [];
    }
  } catch (error) {
    console.error("Error reading search queries:", error);
  }
  return [];
}

// Save search queries
function saveSearchQueries(queries: string[]) {
  try {
    ensureDataDirectory();
    const data = {
      queries: Array.from(new Set(queries)), // Remove duplicates
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(SEARCH_QUERIES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving search queries:", error);
  }
}

// GET: Return all search queries for sitemap generation
export async function GET() {
  try {
    const queries = getSearchQueries();
    
    // If no queries exist, return popular fallback terms
    if (queries.length === 0) {
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
      return NextResponse.json({ queries: popularTerms });
    }

    return NextResponse.json({ queries });
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
    const existingQueries = getSearchQueries();
    
    // Add new query if it doesn't exist
    if (!existingQueries.includes(cleanQuery)) {
      existingQueries.push(cleanQuery);
      saveSearchQueries(existingQueries);
    }

    return NextResponse.json({ success: true, query: cleanQuery });
  } catch (error) {
    console.error("Error in POST /api/search-queries:", error);
    return NextResponse.json({ error: "Failed to save search query" }, { status: 500 });
  }
}
