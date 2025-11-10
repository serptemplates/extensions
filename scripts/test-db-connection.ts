import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

// Load env
config({ path: resolve(process.cwd(), "apps/extensions/.env.local") });

async function testDatabaseConnection() {
  console.log("🧪 Testing database connection...\n");
  
  const url = process.env.DATABASE_URL || process.env.SERP_EXTENSIONS_DB_DATABASE_URL;
  
  if (!url) {
    console.log("❌ No DATABASE_URL found");
    process.exit(1);
  }
  
  const sql = neon(url);
  
  try {
    const extensions = await sql`
      SELECT e.id, e.slug, e.name, e.is_popular, d.slug as developer_slug
      FROM extensions e
      LEFT JOIN developers d ON e.developer_id = d.id
      WHERE e.is_active = true
      ORDER BY e.created_at DESC
    `;
    
    console.log(`✅ Retrieved ${extensions.length} active extensions from database`);
    
    if (extensions.length > 0) {
      console.log("\n📦 Sample extensions:");
      extensions.slice(0, 5).forEach((ext: any) => {
        console.log(`  - ${ext.name} (${ext.slug})`);
        console.log(`    ID: ${ext.id}`);
        console.log(`    Developer: ${ext.developer_slug || 'none (third-party)'}`);
        console.log(`    Popular: ${ext.is_popular ? 'Yes' : 'No'}`);
        console.log("");
      });
    }
    
    // Test URL generation logic
    console.log("🔗 Testing URL patterns:");
    extensions.forEach((ext: any) => {
      const urlPart = ext.developer_slug || ext.id;
      console.log(`  /extensions/${urlPart}/${ext.slug}/`);
    });
    
    console.log("\n✅ Database is connected and working!");
    console.log("✅ No longer using JSON fallback!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testDatabaseConnection();
