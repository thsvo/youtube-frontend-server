import type { MetadataRoute } from "next"
import fs from "fs"
import path from "path"

// Function to get all search queries from the backend data
async function getAllSearchQueries(): Promise<string[]> {
  try {
    // First try to read from the local file system
    const searchQueriesFile = path.join(process.cwd(), "data", "search-queries.json")
    
    if (fs.existsSync(searchQueriesFile)) {
      try {
        const fileContent = fs.readFileSync(searchQueriesFile, "utf8")
        const data = JSON.parse(fileContent)
        if (data.queries && Array.isArray(data.queries) && data.queries.length > 0) {
          console.log("Found search queries from file:", data.queries)
          return data.queries
        }
      } catch (error) {
        console.error("Error reading search queries file:", error)
      }
    }

    // Fallback: Try to fetch from API if file doesn't exist or is empty
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      const response = await fetch(`${API_BASE_URL}/api/search-queries`, {
        next: { revalidate: 3600 } // Cache for 1 hour
      })
      if (response.ok) {
        const data = await response.json()
        if (data.queries && Array.isArray(data.queries) && data.queries.length > 0) {
          console.log("Found search queries from API:", data.queries)
          return data.queries
        }
      }
    } catch (error) {
      console.error("Error fetching search queries from API:", error)
    }

    // Fallback: Common/popular search terms for your YouTube app
    const popularSearchTerms = [
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
    ]

    console.log("Using fallback search terms")
    return popularSearchTerms
  } catch (error) {
    console.error("Error getting search queries:", error)
    return ["music", "gaming", "tutorial"] // Minimal fallback
  }
}
 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // Get all search queries
  const searchQueries = await getAllSearchQueries()
  console.log("Sitemap generation - Search queries found:", searchQueries)

  // Base sitemap entries
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  // Add search result pages using the new route format
  const searchPages = searchQueries.slice(0, 50).map((query) => ({
    url: `${baseUrl}/search/${encodeURIComponent(query)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  console.log("Sitemap generation - Total pages:", staticPages.length + searchPages.length)
  console.log("Sitemap generation - Search pages:", searchPages.map(p => p.url))

  // Combine all entries (increased limit to 50 search pages)
  return [...staticPages, ...searchPages]
}

