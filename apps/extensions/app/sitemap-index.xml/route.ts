import { NextResponse } from "next/server";

import {
  SITEMAP_PAGE_SIZE,
  buildCorePageEntries,
  buildToolEntries,
  buildTopicEntries,
  buildCategoryEntries,
  escapeXml,
  resolveBaseUrl,
} from "@/lib/sitemap-utils";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const baseUrl = resolveBaseUrl();
  const now = new Date();

  const coreEntries = buildCorePageEntries();
  const coreLastMod =
    coreEntries.reduce<Date | null>((latest, entry) => {
      return !latest || entry.lastModified > latest ? entry.lastModified : latest;
    }, null) ?? now;

  const toolEntries = buildToolEntries();
  const totalExtensionPages = toolEntries.length
    ? Math.max(1, Math.ceil(toolEntries.length / SITEMAP_PAGE_SIZE))
    : 0;
  const toolsLastMod = toolEntries.length
    ? toolEntries.reduce<Date | null>((latest, entry) => {
        return !latest || entry.lastModified > latest ? entry.lastModified : latest;
      }, null) ?? now
    : null;

  const topicEntries = await buildTopicEntries();
  const topicsLastMod = topicEntries.length
    ? topicEntries.reduce<Date | null>((latest, entry) => {
        return !latest || entry.lastModified > latest ? entry.lastModified : latest;
      }, null) ?? now
    : null;

  const categoryEntries = await buildCategoryEntries();
  const categoriesLastMod = categoryEntries.length
    ? categoryEntries.reduce<Date | null>((latest, entry) => {
        return !latest || entry.lastModified > latest ? entry.lastModified : latest;
      }, null) ?? now
    : null;

  const sitemapEntries: Array<{ loc: string; lastmod: string }> = [];

  if (coreEntries.length > 0) {
    sitemapEntries.push({
      loc: `${baseUrl}/pages-sitemap.xml`,
      lastmod: coreLastMod.toISOString(),
    });
  }

  if (totalExtensionPages > 0 && toolsLastMod) {
    sitemapEntries.push({
      loc: `${baseUrl}/extensions-sitemap.xml`,
      lastmod: toolsLastMod.toISOString(),
    });

    // Only needed if we ever paginate beyond page 1
    for (let page = 2; page <= totalExtensionPages; page += 1) {
      sitemapEntries.push({
        loc: `${baseUrl}/extensions-sitemap-${page}.xml`,
        lastmod: toolsLastMod.toISOString(),
      });
    }
  }

  if (topicEntries.length > 0 && topicsLastMod) {
    sitemapEntries.push({
      loc: `${baseUrl}/best-sitemap.xml`,
      lastmod: topicsLastMod.toISOString(),
    });
  }

  if (categoryEntries.length > 0 && categoriesLastMod) {
    sitemapEntries.push({
      loc: `${baseUrl}/categories-sitemap.xml`,
      lastmod: categoriesLastMod.toISOString(),
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (item) => `  <sitemap>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
