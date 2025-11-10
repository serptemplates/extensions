import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

// Load env from apps/extensions/.env.local
config({ path: resolve(process.cwd(), "apps/extensions/.env.local") });

async function checkDb() {
  const url = process.env.DATABASE_URL || process.env.SERP_EXTENSIONS_DB_DATABASE_URL;
  
  if (!url) {
    console.log("❌ No DATABASE_URL found");
    process.exit(1);
  }

  console.log("🔍 Connecting to database...\n");
  
  const sql = neon(url);

  try {
    // Check developers
    const developers = await sql`SELECT id, slug, name FROM developers ORDER BY created_at DESC LIMIT 10`;
    console.log(`📋 Developers (${developers.length}):`);
    developers.forEach(d => console.log(`  - ${d.slug} (${d.name})`));
    
    // Check extensions
    const extensions = await sql`SELECT id, slug, name, developer_id FROM extensions ORDER BY created_at DESC LIMIT 10`;
    console.log(`\n📦 Extensions (${extensions.length}):`);
    extensions.forEach(e => console.log(`  - ${e.slug} (${e.name}) - dev: ${e.developer_id || 'none'}`));
    
    // Check total counts
    const [devCount] = await sql`SELECT COUNT(*) as count FROM developers`;
    const [extCount] = await sql`SELECT COUNT(*) as count FROM extensions`;
    
    console.log(`\n📊 Total counts:`);
    console.log(`  - Developers: ${devCount.count}`);
    console.log(`  - Extensions: ${extCount.count}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkDb();
