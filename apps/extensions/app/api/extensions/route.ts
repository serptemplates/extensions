import { getFeaturedExtensions } from "@serp-extensions/app-core/lib/catalog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const extensions = await getFeaturedExtensions(100); // Get more for filtering
    return NextResponse.json(extensions);
  } catch (error) {
    console.error('Error fetching extensions:', error);
    return NextResponse.json({ error: 'Failed to fetch extensions' }, { status: 500 });
  }
}
