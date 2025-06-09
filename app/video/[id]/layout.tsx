const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function generateMetadata({ params }:any) {
  const { id } = params

  try {
    // Fetch video data
    const response = await fetch(`${API_BASE_URL}/api/video/${id}`)
    const video = await response.json()

    return {
      title: video.title || "Video Details",
      description: video.description?.substring(0, 160) || "Watch this YouTube video",
      openGraph: {
        title: video.title,
        description: video.description?.substring(0, 160),
        type: "website",
      },
    }
  } catch (error) {
    return {
      title: "Video Details",
      description: "Watch this YouTube video",
    }
  }
}

export default function VideoLayout({ children }:any) {
  return children
}

