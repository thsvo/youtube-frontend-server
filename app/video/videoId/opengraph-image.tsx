import { ImageResponse } from "next/og"

export const runtime = "edge"

export default async function Image({ params }: { params: { videoId: string } }) {
  const { videoId } = params

  try {
    // Fetch video data
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/video/${videoId}`)
    const video = await response.json()

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
            color: "black",
          }}
        >
          {video.title || "Video Details"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            textAlign: "center",
            color: "gray",
          }}
        >
          YouTube Video
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    // Return a default image if there's an error
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          fontSize: 60,
          fontWeight: "bold",
        }}
      >
        YouTube Video
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  }
}

