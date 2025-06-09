import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://download.codeopx.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/search-sitemap.xml`,
    ],
  }
}

