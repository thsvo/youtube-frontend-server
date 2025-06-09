import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Youtube, Film } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Content {
  _id: string
  title: string
  description: string
  thumbnail: string
  createdAt: string
  type: "youtube" | "omdb"
  videoId?: string
  imdbID?: string
  year?: string
  director?: string
}

interface ContentResultsProps {
  contents: Content[]
  isLoading: boolean
  activeTab: string
}

export function ContentResults({ contents, isLoading, activeTab }: ContentResultsProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

  // Filter contents based on active tab
  const filteredContents = activeTab === "youtube" ? contents : contents.filter((content) => content.type === activeTab)

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

  if (filteredContents.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Search for videos or movies to see results</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContents.map((content) => (
        <Card key={content._id} className="overflow-hidden flex flex-col">
          <Link href={`/${content.type}/${content._id}`} className="relative aspect-video">
            <Image
              src={`${API_BASE_URL}${content.thumbnail}`}
              alt={content.title}
              fill
              className="object-cover"
             
            />
            <div className="absolute top-2 right-2">
              <Badge variant={content.type === "youtube" ? "default" : "secondary"}>
                {content.type === "youtube" ? <Youtube className="h-3 w-3 mr-1" /> : <Film className="h-3 w-3 mr-1" />}
                {content.type === "youtube" ? "YouTube" : "Movie"}
              </Badge>
            </div>
            {content.type === "omdb" && content.year && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline" className="bg-black/50 text-white border-none">
                  {content.year}
                </Badge>
              </div>
            )}
          </Link>
          <CardHeader>
            <Link href={`/${content.type}/${content._id}`} className="hover:underline">
              <CardTitle className="line-clamp-2">{content.title}</CardTitle>
            </Link>
            <CardDescription>
              {content.type === "omdb" && content.director ? (
                <span>Director: {content.director}</span>
              ) : (
                <span>{new Date(content.createdAt).toLocaleDateString()}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">{content.description}</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${content.type}/${content._id}`}>View Details</Link>
            </Button>
            <Button size="sm" asChild>
              {content.type === "youtube" ? (
                <a
                  href={`https://youtube.com/watch?v=${content.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-1"
                >
                  Watch <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <a
                  href={`https://www.imdb.com/title/${content.imdbID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-1"
                >
                  IMDB <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

