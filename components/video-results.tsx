import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface Video {
  _id: string
  videoId: string
  title: string
  description: string
  thumbnail: string
  createdAt: string
}

interface VideoResultsProps {
  videos: Video[]
  isLoading: boolean
}

export function VideoResults({ videos, isLoading }: VideoResultsProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Search for videos to see results</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card key={video._id} className="overflow-hidden flex flex-col">
          <Link href={`/video/${video._id}`} className="relative aspect-video">
            <Image
              src={`${API_BASE_URL}${video.thumbnail}`}
              alt={video.title}
              fill
              className="object-cover"
            
            />
          </Link>
          <CardHeader>
            <Link href={`/video/${video._id}`} className="hover:underline">
              <CardTitle className="line-clamp-2">{video.title}</CardTitle>
            </Link>
            <CardDescription>{new Date(video.createdAt).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">{video.description}</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/video/${video._id}`}>View Details</Link>
            </Button>
            <Button size="sm" asChild>
              <a
                href={`https://youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-1"
              >
                Watch <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

