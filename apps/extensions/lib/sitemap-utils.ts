import { getTopicsWithCounts, getCategoriesWithCounts, getActiveExtensions } from '@serp-extensions/app-core/lib/catalog';
import { getExtensionUrl, getBestUrl } from '@serp-extensions/app-core/lib/urls';

export const SITEMAP_PAGE_SIZE = 20000;

interface SitemapEntry {
  loc: string;
  lastModified: Date;
  changeFrequency?: string;
  priority?: number;
}

export function resolveBaseUrl(): string {
  const domain =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "https://extensions.serp.co";

  return domain.replace(/\/$/, "");
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildCorePageEntries(): SitemapEntry[] {
  const baseUrl = resolveBaseUrl();
  const now = new Date();

  return [
    {
      loc: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}

export async function buildToolEntries(): Promise<SitemapEntry[]> {
  const baseUrl = resolveBaseUrl();
  const now = new Date();

  const extensions = await getActiveExtensions();
  
  return extensions.map((ext) => ({
    loc: `${baseUrl}${getExtensionUrl(ext)}`,
    lastModified: ext.updated ? new Date(ext.updated) : now,
    changeFrequency: "weekly",
    priority: ext.isPopular ? 0.8 : 0.6,
  }));
}

export async function buildTopicEntries(): Promise<SitemapEntry[]> {
  const baseUrl = resolveBaseUrl();
  
  try {
    const topics = await getTopicsWithCounts();
    
    // Filter out topics with no extensions
    const activeTopics = topics.filter((topic) => topic.count > 0);
    
    return activeTopics.map((topic) => ({
      loc: `${baseUrl}${getBestUrl(topic.slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: topic.ahrefsSv && topic.ahrefsSv > 100000 ? 0.9 : 0.7,
    }));
  } catch (error) {
    console.error('Error building topic entries:', error);
    return [];
  }
}

export async function buildCategoryEntries(): Promise<SitemapEntry[]> {
  const baseUrl = resolveBaseUrl();
  
  try {
    const categories = await getCategoriesWithCounts();
    
    // Filter out categories with no extensions
    const activeCategories = categories.filter((category) => category.count > 0);
    
    return activeCategories.map((category) => ({
      loc: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error building category entries:', error);
    return [];
  }
}
