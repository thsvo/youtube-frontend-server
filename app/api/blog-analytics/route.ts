import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface AnalyticsData {
  postId: number;
  slug: string;
  uuid: string;
  action: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: AnalyticsData = await request.json();
    
    // Add additional tracking data
    const analyticsEntry = {
      ...data,
      userAgent: request.headers.get("user-agent") || "",
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    };

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing analytics data
    const analyticsFile = path.join(dataDir, "blog-analytics.json");
    let analytics: AnalyticsData[] = [];

    if (fs.existsSync(analyticsFile)) {
      try {
        const fileContent = fs.readFileSync(analyticsFile, "utf8");
        analytics = JSON.parse(fileContent);
      } catch (error) {
        console.error("Error reading analytics file:", error);
        analytics = [];
      }
    }

    // Add new entry
    analytics.push(analyticsEntry);

    // Keep only last 1000 entries to prevent file from growing too large
    if (analytics.length > 1000) {
      analytics = analytics.slice(-1000);
    }

    // Write back to file
    fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));

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
    const analyticsFile = path.join(process.cwd(), "data", "blog-analytics.json");
    
    if (!fs.existsSync(analyticsFile)) {
      return NextResponse.json({ analytics: [] });
    }

    const fileContent = fs.readFileSync(analyticsFile, "utf8");
    const analytics = JSON.parse(fileContent);

    // Return summary statistics
    const summary = {
      totalViews: analytics.length,
      uniquePosts: new Set(analytics.map((a: AnalyticsData) => a.postId)).size,
      recentViews: analytics.slice(-10),
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
