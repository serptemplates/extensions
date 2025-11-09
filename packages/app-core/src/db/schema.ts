import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  jsonb,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

export const developers = pgTable("developers", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  website: text("website"),
  githubUrl: text("github_url"),
  twitterUrl: text("twitter_url"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull().unique(),
  pageTitle: text("page_title"),
  description: text("description"),
  seoDescription: text("seo_description"),
  icon: text("icon"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const topics = pgTable("topics", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull().unique(),
  pageTitle: text("page_title"),
  description: text("description"),
  seoDescription: text("seo_description"),
  ahrefsSv: integer("ahrefs_sv"), // Search Volume
  ahrefsKd: integer("ahrefs_kd"), // Keyword Difficulty
  ahrefsTp: integer("ahrefs_tp"), // Traffic Potential
  ahrefsGsv: integer("ahrefs_gsv"), // Global Search Volume
  ahrefsGtp: integer("ahrefs_gtp"), // Global Traffic Potential
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const extensions = pgTable("extensions", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  pageTitle: text("page_title"),
  shortDescription: varchar("short_description", { length: 75 }),
  description: text("description").notNull(),
  seoDescription: text("seo_description"),
  overview: text("overview"),
  category: text("category").references(() => categories.id),
  developerId: text("developer_id").references(() => developers.id),
  tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  topics: jsonb("topics").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  icon: text("icon"),
  screenshots: jsonb("screenshots").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  features: jsonb("features").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  languages: jsonb("languages").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  chromeStoreUrl: text("chrome_store_url"),
  firefoxAddonUrl: text("firefox_addon_url"),
  website: text("website"),
  edgeStoreUrl: text("edge_store_url"),
  operaStoreUrl: text("opera_store_url"),
  url: text("url"),
  privacyPolicy: text("privacy_policy"),
  supportSite: text("support_site"),
  isActive: boolean("is_active").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
  rating: numeric("rating"),
  ratingCount: integer("rating_count"),
  users: text("users"),
  version: text("version"),
  updated: text("updated"),
  size: text("size"),
  developer: jsonb("developer").$type<{
    name?: string;
    website?: string;
    email?: string;
  } | null>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Join table for topics and extensions with ranking
export const topicsToExtensions = pgTable(
  "topics_to_extensions",
  {
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    extensionId: text("extension_id")
      .notNull()
      .references(() => extensions.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull().default(0), // For sorting extensions within a topic
    stripeProductId: text("stripe_product_id"), // Stripe product ID for this specific placement
    stripePriceId: text("stripe_price_id"), // Stripe price ID for this specific placement
    isSponsored: boolean("is_sponsored").notNull().default(false), // Whether this is a paid placement
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.topicId, table.extensionId] }),
  })
);

// Join table for categories and extensions with ranking
export const categoriesToExtensions = pgTable(
  "categories_to_extensions",
  {
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    extensionId: text("extension_id")
      .notNull()
      .references(() => extensions.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull().default(0), // For sorting extensions within a category
    stripeProductId: text("stripe_product_id"), // Stripe product ID for this specific placement
    stripePriceId: text("stripe_price_id"), // Stripe price ID for this specific placement
    isSponsored: boolean("is_sponsored").notNull().default(false), // Whether this is a paid placement
    sponsoredUntil: timestamp("sponsored_until", { withTimezone: true }), // When the sponsored placement expires
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.categoryId, table.extensionId] }),
  })
);

export type DeveloperRow = typeof developers.$inferSelect;
export type CategoryRow = typeof categories.$inferSelect;
export type TopicRow = typeof topics.$inferSelect;
export type ExtensionRow = typeof extensions.$inferSelect;
export type TopicToExtensionRow = typeof topicsToExtensions.$inferSelect;
export type CategoryToExtensionRow = typeof categoriesToExtensions.$inferSelect;
