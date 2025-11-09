import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";
import { topics, categories, type TopicRow, type CategoryRow } from "./schema";

const sql = neon(process.env.DATABASE_URL ?? process.env.SERP_EXTENSIONS_DB_DATABASE_URL!);
const db = drizzle(sql);

// Topic queries
export async function getTopicBySlug(slug: string): Promise<TopicRow | undefined> {
  const result = await db.select().from(topics).where(eq(topics.slug, slug)).limit(1);
  return result[0];
}

export async function getAllTopics(): Promise<TopicRow[]> {
  return db.select().from(topics);
}

export async function getTopTopics(limit = 10): Promise<TopicRow[]> {
  return db
    .select()
    .from(topics)
    .orderBy(desc(topics.ahrefsSv)) // Order by search volume descending
    .limit(limit);
}

// Category queries
export async function getCategoryBySlug(slug: string): Promise<CategoryRow | undefined> {
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function getAllCategories(): Promise<CategoryRow[]> {
  return db.select().from(categories);
}

export async function getTopCategories(limit = 10): Promise<CategoryRow[]> {
  return db
    .select()
    .from(categories)
    .orderBy(desc(categories.ahrefsSv)) // Order by search volume descending
    .limit(limit);
}
