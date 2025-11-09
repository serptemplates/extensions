import extensionsData from '@serp-extensions/app-core/data/extensions.json';
import { getAllTopics, getAllCategories } from '@serp-extensions/app-core/db/queries';
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

export function buildToolEntries(): SitemapEntry[] {
  const baseUrl = resolveBaseUrl();
  const now = new Date();

  return (extensionsData as Array<{ isActive: boolean; slug: string; id: string; developerUsername?: string; updated?: string; isPopular?: boolean }>)
    .filter((ext) => ext.isActive)
    .map((ext) => ({
      loc: `${baseUrl}${getExtensionUrl(ext)}`,
      lastModified: ext.updated ? new Date(ext.updated) : now,
      changeFrequency: "weekly",
      priority: ext.isPopular ? 0.8 : 0.6,
    }));
}

export async function buildTopicEntries(): Promise<SitemapEntry[]> {
  const baseUrl = resolveBaseUrl();
  
  try {
    const allTopics = await getAllTopics();
    
    // Filter out topics with no extensions
    const topics = allTopics.filter((topic) => {
      return extensionsData.some((ext) => 
        ext.isActive && 
        ext.topics && 
        ext.topics.includes(topic.slug)
      );
    });
    
    return topics.map((topic) => ({
      loc: `${baseUrl}${getBestUrl(topic.slug)}`,
      lastModified: topic.updatedAt || topic.createdAt || new Date(),
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
    const allCategories = await getAllCategories();
    
    // Filter out categories with no extensions
    const categories = allCategories.filter((category) => {
      return extensionsData.some((ext) => 
        ext.isActive && 
        ext.category === category.slug
      );
    });
    
    return categories.map((category) => ({
      loc: `${baseUrl}/categories/${category.slug}`,
      lastModified: category.updatedAt || category.createdAt || new Date(),
      changeFrequency: "weekly",
      priority: category.ahrefsSv && category.ahrefsSv > 100000 ? 0.9 : 0.7,
    }));
  } catch (error) {
    console.error('Error building category entries:', error);
    return [];
  }
}
