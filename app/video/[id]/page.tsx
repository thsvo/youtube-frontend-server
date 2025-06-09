"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Video {
  _id: string
  videoId: string
  title: string
  description: string
  thumbnail: string
  createdAt: string
}

interface VideoPageProps {
  params: {
    id: string
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  const { id } = params
  const [video, setVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    async function fetchVideoDetails() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/video/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch video details")
        }

        const data = await response.json()
        setVideo(data)
      } catch (err) {
        throw new Error("Error fetching video:", err as Error);
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideoDetails()
  }, [id, API_BASE_URL])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search results
          </Link>
        </div>

        <div className="grid gap-8">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search results
          </Link>
        </div>

        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Video</h1>
          <p className="text-muted-foreground mb-6">{error || "Video not found"}</p>
          <Button asChild>
            <Link href="/">Return to Search</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to search results
        </Link>
      </div>

      <div className="grid gap-8">
        {/* Photo Section */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border">
          <Image
            src={`${API_BASE_URL}${video.thumbnail}`}
            alt={video.title}
            fill
            className="object-cover"
           
            priority
          />
        </div>

        {/* Title Section */}
        <h1 className="text-3xl font-bold">{video.title}</h1>

        {/* Description Section */}
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="whitespace-pre-line">{video.description}</p>
        </div>

        {/* Watch Now Button */}
        <div>
          <Button size="lg" asChild className="gap-2">
            <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
              Watch on YouTube <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

