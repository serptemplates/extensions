import "server-only";

import { cache } from "react";
import { eq, desc } from "drizzle-orm";

import extensionsJson from "../data/extensions.json";
import { getDb } from "../db/client";
import * as dbSchema from "../db/schema";
import type { ExtensionRow, CategoryRow, TopicRow } from "../db/schema";

export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface TopicRecord {
  id: string;
  slug: string;
  name: string;
  description?: string;
  ahrefsSv?: number;
  ahrefsKd?: number;
}

export interface ExtensionDeveloper {
  name?: string;
  website?: string;
  email?: string;
}

export interface ExtensionRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  overview?: string;
  category?: string;
  tags: string[];
  topics: string[];
  icon?: string;
  screenshots: string[];
  features: string[];
  languages: string[];
  chromeStoreUrl?: string;
  firefoxAddonUrl?: string;
  website?: string;
  url?: string;
  privacyPolicy?: string;
  supportSite?: string;
  isActive: boolean;
  isNew?: boolean;
  isPopular: boolean;
  rating?: number;
  ratingCount?: number;
  users?: string;
  version?: string;
  updated?: string;
  size?: string;
  developer?: ExtensionDeveloper;
  developerUsername?: string; // Extracted from GitHub URL
}

function cloneExtension(extension: ExtensionRecord): ExtensionRecord {
  return {
    ...extension,
    tags: [...(extension.tags ?? [])],
    topics: [...(extension.topics ?? [])],
    screenshots: [...(extension.screenshots ?? [])],
    features: [...(extension.features ?? [])],
    languages: [...(extension.languages ?? [])],
    developer: extension.developer ? { ...extension.developer } : undefined,
  };
}

function parseStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function normalizeCategoryRow(row: CategoryRow): CategoryRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    icon: row.icon ?? undefined,
  };
}

function normalizeTopicRow(row: TopicRow): TopicRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    ahrefsSv: row.ahrefsSv ?? undefined,
    ahrefsKd: row.ahrefsKd ?? undefined,
  };
}

function normalizeExtensionRow(row: ExtensionRow): ExtensionRecord {
  const ratingValue = row.rating ? Number(row.rating) : undefined;

  // Developer username will come from the joined developer table, not extracted here
  const developerUsername = "unknown"; // Will be set by join queries

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    overview: row.overview ?? undefined,
    category: row.category ?? undefined,
    tags: parseStringArray(row.tags),
    topics: parseStringArray(row.topics),
    icon: row.icon ?? undefined,
    screenshots: parseStringArray(row.screenshots),
    features: parseStringArray(row.features),
    languages: parseStringArray(row.languages),
    chromeStoreUrl: row.chromeStoreUrl ?? undefined,
    firefoxAddonUrl: row.firefoxAddonUrl ?? undefined,
    website: row.website ?? undefined,
    url: row.url ?? undefined,
    privacyPolicy: row.privacyPolicy ?? undefined,
    supportSite: row.supportSite ?? undefined,
    isActive: row.isActive ?? true,
    isPopular: row.isPopular ?? false,
    rating: Number.isFinite(ratingValue) ? ratingValue : undefined,
    ratingCount: row.ratingCount ?? undefined,
    users: row.users ?? undefined,
    version: row.version ?? undefined,
    updated: row.updated ?? row.updatedAt?.toISOString(),
    size: row.size ?? undefined,
    developer: row.developer ?? undefined,
    developerUsername,
  };
}

const loadCategories = cache(async (): Promise<CategoryRecord[]> => {
  const db = getDb();
  if (!db) {
    return [];
  }

  try {
    const rows = await db.select().from(dbSchema.categories).orderBy(dbSchema.categories.name);
    return rows.map(normalizeCategoryRow);
  } catch {
    return [];
  }
});

const loadTopics = cache(async (): Promise<TopicRecord[]> => {
  const db = getDb();
  if (!db) {
    return [];
  }

  try {
    const rows = await db.select().from(dbSchema.topics).orderBy(dbSchema.topics.name);
    return rows.map(normalizeTopicRow);
  } catch {
    return [];
  }
});

const loadExtensions = cache(async (): Promise<ExtensionRecord[]> => {
  const db = getDb();
  if (!db) {
    return (extensionsJson as ExtensionRecord[]).map(cloneExtension);
  }

  try {
    const rows = await db
      .select()
      .from(dbSchema.extensions)
      .where(eq(dbSchema.extensions.isActive, true));

    return rows.map(normalizeExtensionRow);
  } catch {
    return (extensionsJson as ExtensionRecord[]).map(cloneExtension);
  }
});

export async function getCategories(): Promise<CategoryRecord[]> {
  return loadCategories();
}

export async function getTopics(): Promise<TopicRecord[]> {
  return loadTopics();
}

export async function getActiveExtensions(): Promise<ExtensionRecord[]> {
  const extensions = await loadExtensions();
  return extensions.filter((extension) => extension.isActive !== false);
}

export async function getFeaturedExtensions(limit: number = 12): Promise<ExtensionRecord[]> {
  const db = getDb();
  if (!db) {
    const extensions = (extensionsJson as ExtensionRecord[])
      .filter((ext) => ext.isActive !== false)
      .sort((a, b) => {
        // Prioritize: isPopular > rating > name
        if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1;
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return a.name.localeCompare(b.name);
      });
    return extensions.slice(0, limit).map(cloneExtension);
  }

  try {
    const rows = await db
      .select({
        extension: dbSchema.extensions,
        developer: dbSchema.developers,
      })
      .from(dbSchema.extensions)
      .leftJoin(
        dbSchema.developers,
        eq(dbSchema.extensions.developerId, dbSchema.developers.id)
      )
      .where(eq(dbSchema.extensions.isActive, true))
      .orderBy(
        desc(dbSchema.extensions.isPopular),
        desc(dbSchema.extensions.rating),
        desc(dbSchema.extensions.createdAt)
      )
      .limit(limit);

    return rows.map((row) => {
      const record = normalizeExtensionRow(row.extension);
      if (row.developer) {
        record.developerUsername = row.developer.slug;
      }
      return record;
    });
  } catch {
    const extensions = (extensionsJson as ExtensionRecord[])
      .filter((ext) => ext.isActive !== false)
      .sort((a, b) => {
        if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1;
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return a.name.localeCompare(b.name);
      });
    return extensions.slice(0, limit).map(cloneExtension);
  }
}

export async function getExtensionBySlugAndId(slug: string, id: string): Promise<ExtensionRecord | null> {
  const extensions = await getActiveExtensions();
  return extensions.find((extension) => extension.slug === slug && extension.id === id) ?? null;
}

export async function getExtensionByDeveloperAndSlug(
  developerSlug: string,
  extensionSlug: string
): Promise<ExtensionRecord | null> {
  const db = getDb();
  if (!db) {
    // Fallback to JSON
    const extensions = await getActiveExtensions();
    return extensions.find((ext) => ext.slug === extensionSlug) ?? null;
  }

  try {
    const rows = await db
      .select({
        extension: dbSchema.extensions,
        developer: dbSchema.developers,
      })
      .from(dbSchema.extensions)
      .leftJoin(
        dbSchema.developers,
        eq(dbSchema.extensions.developerId, dbSchema.developers.id)
      )
      .where(eq(dbSchema.extensions.slug, extensionSlug))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0]!;
    
    if (row.developer && row.developer.slug !== developerSlug) {
      return null;
    }

    const record = normalizeExtensionRow(row.extension);
    if (row.developer) {
      record.developerUsername = row.developer.slug;
    }
    
    const topicRows = await db
      .select({
        topic: dbSchema.topics,
      })
      .from(dbSchema.topicsToExtensions)
      .innerJoin(
        dbSchema.topics,
        eq(dbSchema.topics.id, dbSchema.topicsToExtensions.topicId)
      )
      .where(eq(dbSchema.topicsToExtensions.extensionId, row.extension.id))
      .orderBy(dbSchema.topicsToExtensions.rank);
    record.topics = topicRows.map(tr => tr.topic.slug);
    return record;
  } catch {
    const extensions = await getActiveExtensions();
    return extensions.find((ext) => ext.slug === extensionSlug) ?? null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getTopicBySlug(slug: string): Promise<TopicRecord | null> {
  const topics = await getTopics();
  const found = topics.find((topic) => topic.slug === slug);
  if (found) return found;
  // Fallback: synthesize a minimal topic when DB is unavailable but JSON has extensions for it
  const extensions = await getActiveExtensions();
  const hasAny = extensions.some((e) => (e.topics || []).includes(slug));
  if (!hasAny) return null;
  const toTitle = (s: string) => s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    id: `topic_${slug}`,
    slug,
    name: toTitle(slug),
    description: undefined,
    ahrefsSv: undefined,
    ahrefsKd: undefined,
  };
}

export async function getExtensionsByCategory(slug: string): Promise<ExtensionRecord[]> {
  const db = getDb();
  if (!db) {
    // Fallback to JSON
    const extensions = await getActiveExtensions();
    return extensions.filter((extension) => extension.category === slug);
  }
  try {
    const rows = await db
      .select({
        extension: dbSchema.extensions,
        rank: dbSchema.categoriesToExtensions.rank,
        developer: dbSchema.developers,
      })
      .from(dbSchema.categoriesToExtensions)
      .innerJoin(
        dbSchema.extensions,
        eq(dbSchema.extensions.id, dbSchema.categoriesToExtensions.extensionId)
      )
      .leftJoin(
        dbSchema.developers,
        eq(dbSchema.extensions.developerId, dbSchema.developers.id)
      )
      .innerJoin(
        dbSchema.categories,
        eq(dbSchema.categories.id, dbSchema.categoriesToExtensions.categoryId)
      )
      .where(eq(dbSchema.categories.slug, slug))
      .orderBy(dbSchema.categoriesToExtensions.rank);

    return rows.map((row) => {
      const record = normalizeExtensionRow(row.extension);
      if (row.developer) {
        record.developerUsername = row.developer.slug;
      }
      return record;
    });
  } catch {
    const extensions = await getActiveExtensions();
    return extensions.filter((extension) => extension.category === slug);
  }
}

export async function getExtensionsByTopic(slug: string): Promise<ExtensionRecord[]> {
  const db = getDb();
  if (!db) {
    // Fallback to JSON
    const extensions = await getActiveExtensions();
    return extensions.filter((extension) => extension.topics.includes(slug));
  }
  try {
    const rows = await db
      .select({
        extension: dbSchema.extensions,
        rank: dbSchema.topicsToExtensions.rank,
        developer: dbSchema.developers,
      })
      .from(dbSchema.topicsToExtensions)
      .innerJoin(
        dbSchema.extensions,
        eq(dbSchema.extensions.id, dbSchema.topicsToExtensions.extensionId)
      )
      .leftJoin(
        dbSchema.developers,
        eq(dbSchema.extensions.developerId, dbSchema.developers.id)
      )
      .innerJoin(
        dbSchema.topics,
        eq(dbSchema.topics.id, dbSchema.topicsToExtensions.topicId)
      )
      .where(eq(dbSchema.topics.slug, slug))
      .orderBy(dbSchema.topicsToExtensions.rank);

    return rows.map((row) => {
      const record = normalizeExtensionRow(row.extension);
      if (row.developer) {
        record.developerUsername = row.developer.slug;
      }
      return record;
    });
  } catch {
    const extensions = await getActiveExtensions();
    return extensions.filter((extension) => extension.topics.includes(slug));
  }
}

export async function getCategoriesWithCounts(): Promise<Array<CategoryRecord & { count: number }>> {
  const [categories, extensions] = await Promise.all([getCategories(), getActiveExtensions()]);
  const countMap = new Map<string, number>();

  extensions.forEach((extension) => {
    const key = extension.category ?? "other";
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  });

  return categories.map((category) => ({
    ...category,
    count: countMap.get(category.slug) ?? 0,
  }));
}

export async function getTopicsWithCounts(): Promise<Array<TopicRecord & { count: number }>> {
  const [topics, extensions] = await Promise.all([getTopics(), getActiveExtensions()]);
  const countMap = new Map<string, number>();

  extensions.forEach((extension) => {
    extension.topics.forEach((topicSlug) => {
      countMap.set(topicSlug, (countMap.get(topicSlug) ?? 0) + 1);
    });
  });

  return topics.map((topic) => ({
    ...topic,
    count: countMap.get(topic.slug) ?? 0,
  }));
}

export * as dbSchema from "../db/schema";
