"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Github, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="http://codeopx.com" className="mr-6 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-5 w-5">
              <rect width="256" height="256" fill="none" />
              <line
                x1="208"
                y1="128"
                x2="128"
                y2="208"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
              <line
                x1="192"
                y1="40"
                x2="40"
                y2="192"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
            </svg>
            <span className="hidden font-bold sm:inline-block">CodeOpx</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Blog
            </Link>
            <Link href="http://twittervideodownloader.codeopx.com" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Twitter Video Downloader
            </Link>
            <Link href="https://redditvideodownloader.codeopx.com" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Reddit Video Downloader
            </Link>
            {/* <Link href="/blocks" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Blocks
            </Link>
            <Link href="/charts" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Charts
            </Link>
            <Link href="/themes" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Themes
            </Link>
            <Link href="/colors" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Term
            </Link> */}
          </nav>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav setIsOpen={setIsOpen} />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            {/* <Link href="https://github.com/shadcn-ui/ui" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link> */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

function CommandMenu() {
  return (
    <div className="relative">
      {/* <Button
        variant="outline"
        className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button> */}
    </div>
  )
}

function MobileNav({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  return (
    <div className="flex flex-col space-y-3 px-6 py-2">
      <Link href="/" className="flex items-center space-x-2 py-1" onClick={() => setIsOpen(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-5 w-5">
          <rect width="256" height="256" fill="none" />
          <line
            x1="208"
            y1="128"
            x2="128"
            y2="208"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <line
            x1="192"
            y1="40"
            x2="40"
            y2="192"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
        </svg>
        <span className="font-bold">Codeopx Search</span>
      </Link>
      <div className="flex flex-col space-y-3">
        <Link
          href="/blog"
          className="transition-colors hover:text-foreground text-muted-foreground"
          onClick={() => setIsOpen(false)}
        >
          Blog
        </Link>
        <Link
          href="http://twittervideodownloader.codeopx.com"
          className="transition-colors hover:text-foreground text-muted-foreground"
          onClick={() => setIsOpen(false)}
        >
          Twitter Video Downloader
        </Link>
        <Link
          href="https://redditvideodownloader.codeopx.com"
          className="transition-colors hover:text-foreground text-muted-foreground"
          onClick={() => setIsOpen(false)}
        >
          Reddit Video Downloader
        </Link>
      </div>
    </div>
  )
}

