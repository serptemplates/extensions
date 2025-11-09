import { NextResponse } from "next/server";
import { buildTopicEntries, escapeXml } from "@/lib/sitemap-utils";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const entries = await buildTopicEntries();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency ?? "weekly"}</changefreq>
    <priority>${entry.priority ?? 0.7}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
