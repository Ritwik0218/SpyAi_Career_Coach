import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/database-health";

export async function GET() {
  try {
    const health = await checkDatabaseHealth();
    
    return NextResponse.json({
      status: health.healthy ? "ok" : "error",
      database: health.healthy ? "connected" : "disconnected",
      error: health.error || null,
      timestamp: new Date().toISOString()
    }, {
      status: health.healthy ? 200 : 503
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString()
    }, {
      status: 503
    });
  }
}
