import { NextResponse } from "next/server"

export const runtime = 'edge';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  try {
    // Fetch all videos from the API
    const response = await fetch(`${API_BASE_URL}/api/videos`)
    let videos = []

    if (response.ok) {
      const data = await response.json()
      videos = data
    }

    // Generate the XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`

    // Add each video to the sitemap
    interface Video {
      _id: string
      thumbnail: string
      title: string
      description: string
      videoId: string
      createdAt: string
    }

    (videos as Video[]).forEach((video: Video) => {
      xml += `
      <url>
        <loc>${baseUrl}/video/${video._id}</loc>
        <video:video>
          <video:thumbnail_loc>${API_BASE_URL}${video.thumbnail}</video:thumbnail_loc>
          <video:title>${escapeXml(video.title)}</video:title>
          <video:description>${escapeXml(video.description.substring(0, 2048))}</video:description>
          <video:player_loc>https://www.youtube.com/watch?v=${video.videoId}</video:player_loc>
          <video:publication_date>${new Date(video.createdAt).toISOString()}</video:publication_date>
          <video:family_friendly>yes</video:family_friendly>
          <video:live>no</video:live>
        </video:video>
      </url>`
    })

    xml += `
</urlset>`

    // Return the XML with the correct content type
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  } catch (error) {
    console.error("Error generating video sitemap:", error)
    return NextResponse.json({ error: "Failed to generate video sitemap" }, { status: 500 })
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

