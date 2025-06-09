export async function generateMetadata({ params }:any) {
  const { videoId } = params

  try {
    // Fetch video data
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "https://download.codeopx.com"}/api/video/${videoId}`)
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

