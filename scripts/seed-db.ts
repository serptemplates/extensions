import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";

// Load env from apps/extensions/.env.local
config({ path: resolve(process.cwd(), "apps/extensions/.env.local") });

interface JsonExtension {
  id: string;
  slug: string;
  name: string;
  description: string;
  overview?: string;
  category?: string;
  topics: string[];
  tags: string[];
  isActive: boolean;
  isNew?: boolean;
  isPopular: boolean;
  rating?: number;
  ratingCount?: number;
  users?: string;
  version?: string;
  updated?: string;
  size?: string;
  languages?: string[];
  developer?: {
    name?: string;
    website?: string;
    email?: string;
  };
  website?: string;
  chromeStoreUrl?: string;
  firefoxAddonUrl?: string;
  url?: string;
  icon?: string;
  screenshots?: string[];
  features?: string[];
  privacyPolicy?: string;
  supportSite?: string;
}

async function seedDatabase() {
  const url = process.env.DATABASE_URL || process.env.SERP_EXTENSIONS_DB_DATABASE_URL;
  
  if (!url) {
    console.log("❌ No DATABASE_URL found");
    process.exit(1);
  }

  console.log("🔍 Connecting to database...\n");
  const sql = neon(url);

  try {
    // 1. Create SERP developer
    console.log("📝 Creating SERP developer...");
    const serpDevId = `dev_${nanoid(10)}`;
    await sql`
      INSERT INTO developers (id, slug, name, website, description, created_at, updated_at)
      VALUES (
        ${serpDevId},
        'serp',
        'SERP Templates',
        'https://serp.co',
        'Browser extensions by SERP Templates',
        NOW(),
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        website = EXCLUDED.website,
        description = EXCLUDED.description,
        updated_at = NOW()
      RETURNING id
    `;
    console.log("✅ SERP developer created/updated\n");

    // 2. Load extensions from JSON
    console.log("📦 Loading extensions from JSON...");
    const jsonPath = resolve(process.cwd(), "packages/app-core/src/data/extensions.json");
    const jsonData = JSON.parse(readFileSync(jsonPath, "utf-8")) as JsonExtension[];
    console.log(`Found ${jsonData.length} extensions\n`);

    // 3. Create categories
    console.log("📁 Creating categories...");
    const categories = new Set<string>();
    jsonData.forEach(ext => {
      if (ext.category) categories.add(ext.category);
    });

    const categoryMap = new Map<string, string>();
    for (const catSlug of categories) {
      const catId = `cat_${nanoid(10)}`;
      const catName = catSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      const [result] = await sql`
        INSERT INTO categories (id, slug, name, created_at, updated_at)
        VALUES (${catId}, ${catSlug}, ${catName}, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `;
      if (result) categoryMap.set(catSlug, result.id);
      console.log(`  ✓ ${catName}`);
    }
    console.log("");

    // 4. Create topics
    console.log("🏷️  Creating topics...");
    const topics = new Set<string>();
    jsonData.forEach(ext => {
      ext.topics?.forEach(t => topics.add(t));
    });

    const topicMap = new Map<string, string>();
    for (const topicSlug of topics) {
      const topicId = `topic_${nanoid(10)}`;
      const topicName = topicSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      const [result] = await sql`
        INSERT INTO topics (id, slug, name, created_at, updated_at)
        VALUES (${topicId}, ${topicSlug}, ${topicName}, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `;
      topicMap.set(topicSlug, result.id);
      console.log(`  ✓ ${topicName}`);
    }
    console.log("");

    // 5. Insert extensions
    console.log("🚀 Inserting extensions...");
    let count = 0;
    
    for (const ext of jsonData) {
      const extId = ext.id; // Use Chrome Store ID as primary key
      const categoryId = ext.category ? categoryMap.get(ext.category) : null;
      
      // These are third-party extensions, so no developerId
      await sql`
        INSERT INTO extensions (
          id, slug, name, description, overview,
          category, tags, topics, icon, screenshots, features, languages,
          chrome_store_url, firefox_addon_url, website, url,
          privacy_policy, support_site,
          is_active, is_popular, rating, rating_count, users,
          version, updated, size, developer,
          created_at, updated_at
        )
        VALUES (
          ${extId},
          ${ext.slug},
          ${ext.name},
          ${ext.description},
          ${ext.overview || null},
          ${categoryId || null},
          ${JSON.stringify(ext.tags || [])},
          ${JSON.stringify(ext.topics || [])},
          ${ext.icon || null},
          ${JSON.stringify(ext.screenshots || [])},
          ${JSON.stringify(ext.features || [])},
          ${JSON.stringify(ext.languages || [])},
          ${ext.chromeStoreUrl || null},
          ${ext.firefoxAddonUrl || null},
          ${ext.website || null},
          ${ext.url || null},
          ${ext.privacyPolicy || null},
          ${ext.supportSite || null},
          ${ext.isActive !== false},
          ${ext.isPopular || false},
          ${ext.rating || null},
          ${ext.ratingCount || null},
          ${ext.users || null},
          ${ext.version || null},
          ${ext.updated || null},
          ${ext.size || null},
          ${ext.developer ? JSON.stringify(ext.developer) : null},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          overview = EXCLUDED.overview,
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          topics = EXCLUDED.topics,
          icon = EXCLUDED.icon,
          screenshots = EXCLUDED.screenshots,
          features = EXCLUDED.features,
          languages = EXCLUDED.languages,
          chrome_store_url = EXCLUDED.chrome_store_url,
          firefox_addon_url = EXCLUDED.firefox_addon_url,
          website = EXCLUDED.website,
          url = EXCLUDED.url,
          privacy_policy = EXCLUDED.privacy_policy,
          support_site = EXCLUDED.support_site,
          is_active = EXCLUDED.is_active,
          is_popular = EXCLUDED.is_popular,
          rating = EXCLUDED.rating,
          rating_count = EXCLUDED.rating_count,
          users = EXCLUDED.users,
          version = EXCLUDED.version,
          updated = EXCLUDED.updated,
          size = EXCLUDED.size,
          developer = EXCLUDED.developer,
          updated_at = NOW()
      `;
      
      // Link to topics
      if (ext.topics && ext.topics.length > 0) {
        for (let i = 0; i < ext.topics.length; i++) {
          const topicSlug = ext.topics[i];
          const topicId = topicMap.get(topicSlug);
          if (topicId) {
            await sql`
              INSERT INTO topics_to_extensions (topic_id, extension_id, rank, created_at, updated_at)
              VALUES (${topicId}, ${extId}, ${i}, NOW(), NOW())
              ON CONFLICT (topic_id, extension_id) DO UPDATE SET rank = EXCLUDED.rank
            `;
          }
        }
      }
      
      count++;
      console.log(`  ✓ ${ext.name}`);
    }

    console.log(`\n✅ Successfully seeded ${count} extensions!\n`);

    // Show summary
    const [devCount] = await sql`SELECT COUNT(*) as count FROM developers`;
    const [extCount] = await sql`SELECT COUNT(*) as count FROM extensions`;
    const [catCount] = await sql`SELECT COUNT(*) as count FROM categories`;
    const [topicCount] = await sql`SELECT COUNT(*) as count FROM topics`;
    
    console.log("📊 Database Summary:");
    console.log(`  - Developers: ${devCount.count}`);
    console.log(`  - Extensions: ${extCount.count}`);
    console.log(`  - Categories: ${catCount.count}`);
    console.log(`  - Topics: ${topicCount.count}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedDatabase();
