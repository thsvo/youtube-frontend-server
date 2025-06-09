import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

interface AnalyticsData {
  postId: number;
  slug: string;
  uuid: string;
  action: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

// In-memory storage for analytics (for Edge Runtime compatibility)
// In production, you'd want to use a database or external storage service
let analyticsStorage: AnalyticsData[] = [];

export async function POST(request: NextRequest) {
  try {
    const data: AnalyticsData = await request.json();
    
    // Add additional tracking data
    const analyticsEntry = {
      ...data,
      userAgent: request.headers.get("user-agent") || "",
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    };

    // Add new entry to in-memory storage
    analyticsStorage.push(analyticsEntry);

    // Keep only last 1000 entries to prevent memory issues
    if (analyticsStorage.length > 1000) {
      analyticsStorage = analyticsStorage.slice(-1000);
    }

    return NextResponse.json({ success: true, message: "Analytics data recorded" });
  } catch (error) {
    console.error("Error recording analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record analytics" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return summary statistics from in-memory storage
    const summary = {
      totalViews: analyticsStorage.length,
      uniquePosts: new Set(analyticsStorage.map((a: AnalyticsData) => a.postId)).size,
      recentViews: analyticsStorage.slice(-10),
    };

    return NextResponse.json({ analytics: summary });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
