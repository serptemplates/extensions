import { config } from "dotenv";
import path from "path";
import { neon } from "@neondatabase/serverless";

// Load environment
config({
  path: path.join(process.cwd(), "apps/extensions/.env.local"),
});

async function copyProdToLocal() {
  console.log("🔄 Copying production data to local dev database...\n");
  
  const devUrl = process.env.DATABASE_URL;
  const prodUrl = "postgresql://neondb_owner:npg_9nNplZtB7QXI@ep-broad-boat-a4iixfun-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
  
  if (!devUrl) {
    console.error("❌ DATABASE_URL not found");
    return;
  }
  
  const prodSql = neon(prodUrl);
  const devSql = neon(devUrl);
  
  console.log("📊 Source (Prod):", prodUrl.split("@")[1]?.split("/")[0]);
  console.log("📊 Target (Dev):", devUrl.split("@")[1]?.split("/")[0]);
  console.log();
  
  // Clear existing data from dev
  console.log("🗑️  Clearing dev database...");
  await devSql`DELETE FROM topics_to_extensions`;
  await devSql`DELETE FROM categories_to_extensions`;
  await devSql`DELETE FROM extensions`;
  await devSql`DELETE FROM topics`;
  await devSql`DELETE FROM categories`;
  await devSql`DELETE FROM developers`;
  console.log("✅ Dev database cleared\n");
  
  // Copy developers
  console.log("👥 Copying developers...");
  const developers = await prodSql`SELECT * FROM developers ORDER BY created_at`;
  for (const dev of developers) {
    await devSql`
      INSERT INTO developers (id, slug, name, email, website, github_url, twitter_url, description, created_at, updated_at)
      VALUES (${dev.id}, ${dev.slug}, ${dev.name}, ${dev.email}, ${dev.website}, ${dev.github_url}, ${dev.twitter_url}, ${dev.description}, ${dev.created_at}, ${dev.updated_at})
    `;
  }
  console.log(`✅ Copied ${developers.length} developers\n`);
  
  // Copy categories
  console.log("📁 Copying categories...");
  const categories = await prodSql`SELECT * FROM categories ORDER BY created_at`;
  for (const cat of categories) {
    await devSql`
      INSERT INTO categories (id, slug, name, page_title, description, seo_description, icon, created_at, updated_at)
      VALUES (${cat.id}, ${cat.slug}, ${cat.name}, ${cat.page_title}, ${cat.description}, ${cat.seo_description}, ${cat.icon}, ${cat.created_at}, ${cat.updated_at})
    `;
  }
  console.log(`✅ Copied ${categories.length} categories\n`);
  
  // Copy topics
  console.log("🏷️  Copying topics...");
  const topics = await prodSql`SELECT * FROM topics ORDER BY created_at`;
  for (const topic of topics) {
    await devSql`
      INSERT INTO topics (id, slug, name, page_title, description, seo_description, ahrefs_sv, ahrefs_kd, created_at, updated_at)
      VALUES (${topic.id}, ${topic.slug}, ${topic.name}, ${topic.page_title}, ${topic.description}, ${topic.seo_description}, ${topic.ahrefs_sv}, ${topic.ahrefs_kd}, ${topic.created_at}, ${topic.updated_at})
    `;
  }
  console.log(`✅ Copied ${topics.length} topics\n`);
  
  // Copy extensions
  console.log("📦 Copying extensions...");
  const extensions = await prodSql`SELECT * FROM extensions ORDER BY created_at`;
  for (const ext of extensions) {
    // Ensure JSON fields are properly formatted
    const tags = typeof ext.tags === 'string' ? ext.tags : JSON.stringify(ext.tags || []);
    const topics = typeof ext.topics === 'string' ? ext.topics : JSON.stringify(ext.topics || []);
    const screenshots = typeof ext.screenshots === 'string' ? ext.screenshots : JSON.stringify(ext.screenshots || []);
    const features = typeof ext.features === 'string' ? ext.features : JSON.stringify(ext.features || []);
    const languages = typeof ext.languages === 'string' ? ext.languages : JSON.stringify(ext.languages || []);
    const developer = ext.developer ? (typeof ext.developer === 'string' ? ext.developer : JSON.stringify(ext.developer)) : null;
    
    await devSql`
      INSERT INTO extensions (
        id, slug, name, page_title, description, seo_description, overview, category, developer_id,
        tags, topics, icon, screenshots, features, languages, chrome_store_url, firefox_addon_url,
        website, edge_store_url, opera_store_url, url, privacy_policy, support_site, is_active,
        is_popular, rating, rating_count, users, version, updated, size, developer, created_at, updated_at, short_description
      ) VALUES (
        ${ext.id}, ${ext.slug}, ${ext.name}, ${ext.page_title}, ${ext.description}, ${ext.seo_description},
        ${ext.overview}, ${ext.category}, ${ext.developer_id}, ${tags}::jsonb, ${topics}::jsonb, ${ext.icon},
        ${screenshots}::jsonb, ${features}::jsonb, ${languages}::jsonb, ${ext.chrome_store_url}, ${ext.firefox_addon_url},
        ${ext.website}, ${ext.edge_store_url}, ${ext.opera_store_url}, ${ext.url}, ${ext.privacy_policy},
        ${ext.support_site}, ${ext.is_active}, ${ext.is_popular}, ${ext.rating}, ${ext.rating_count},
        ${ext.users}, ${ext.version}, ${ext.updated}, ${ext.size}, ${developer}::jsonb, ${ext.created_at},
        ${ext.updated_at}, ${ext.short_description}
      )
    `;
  }
  console.log(`✅ Copied ${extensions.length} extensions\n`);
  
  // Copy junction tables
  console.log("🔗 Copying categories_to_extensions...");
  const catToExt = await prodSql`SELECT * FROM categories_to_extensions`;
  for (const rel of catToExt) {
    await devSql`
      INSERT INTO categories_to_extensions (category_id, extension_id, rank, stripe_product_id, stripe_price_id, is_sponsored, sponsored_until, created_at, updated_at)
      VALUES (${rel.category_id}, ${rel.extension_id}, ${rel.rank || 0}, ${rel.stripe_product_id}, ${rel.stripe_price_id}, ${rel.is_sponsored || false}, ${rel.sponsored_until}, ${rel.created_at}, ${rel.updated_at})
      ON CONFLICT (category_id, extension_id) DO NOTHING
    `;
  }
  console.log(`✅ Copied ${catToExt.length} category relationships\n`);
  
  console.log("🔗 Copying topics_to_extensions...");
  const topicToExt = await prodSql`SELECT * FROM topics_to_extensions`;
  for (const rel of topicToExt) {
    await devSql`
      INSERT INTO topics_to_extensions (topic_id, extension_id, rank, stripe_product_id, stripe_price_id, is_sponsored, created_at, updated_at)
      VALUES (${rel.topic_id}, ${rel.extension_id}, ${rel.rank || 0}, ${rel.stripe_product_id}, ${rel.stripe_price_id}, ${rel.is_sponsored || false}, ${rel.created_at}, ${rel.updated_at})
      ON CONFLICT (topic_id, extension_id) DO NOTHING
    `;
  }
  console.log(`✅ Copied ${topicToExt.length} topic relationships\n`);
  
  console.log("🎉 Successfully copied all data from production to dev!\n");
  
  // Verify counts
  const [devCounts] = await devSql`
    SELECT 
      (SELECT COUNT(*) FROM developers) as developers,
      (SELECT COUNT(*) FROM extensions) as extensions,
      (SELECT COUNT(*) FROM categories) as categories,
      (SELECT COUNT(*) FROM topics) as topics
  `;
  
  console.log("📊 Final counts in dev database:");
  console.log(`  - Developers: ${devCounts.developers}`);
  console.log(`  - Extensions: ${devCounts.extensions}`);
  console.log(`  - Categories: ${devCounts.categories}`);
  console.log(`  - Topics: ${devCounts.topics}`);
}

copyProdToLocal().catch(console.error);
