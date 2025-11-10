import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), "apps/extensions/.env.local") });

async function checkBothDatabases() {
  console.log("🔍 Checking both databases...\n");
  
  const db1 = process.env.DATABASE_URL;
  const db2 = process.env.SERP_EXTENSIONS_DB_DATABASE_URL;
  
  // Check DATABASE_URL (US West 2)
  if (db1) {
    console.log("1️⃣  DATABASE_URL (US West 2)");
    console.log("   Host: ep-morning-base-af1t20mp\n");
    
    try {
      const sql = neon(db1);
      const [extCount] = await sql`SELECT COUNT(*) as count FROM extensions`;
      const [devCount] = await sql`SELECT COUNT(*) as count FROM developers`;
      
      console.log(`   ✅ Connected!`);
      console.log(`   Extensions: ${extCount?.count || 0}`);
      console.log(`   Developers: ${devCount?.count || 0}`);
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log("");
  
  // Check SERP_EXTENSIONS_DB_DATABASE_URL (US East 1)
  if (db2) {
    console.log("2️⃣  SERP_EXTENSIONS_DB_DATABASE_URL (US East 1)");
    console.log("   Host: ep-late-cloud-adi6r980\n");
    
    try {
      const sql = neon(db2);
      const [extCount] = await sql`SELECT COUNT(*) as count FROM extensions`;
      const [devCount] = await sql`SELECT COUNT(*) as count FROM developers`;
      
      console.log(`   ✅ Connected!`);
      console.log(`   Extensions: ${extCount?.count || 0}`);
      console.log(`   Developers: ${devCount?.count || 0}`);
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log("\n📝 Notes:");
  console.log("   - DATABASE_URL is currently active (used by your app)");
  console.log("   - SERP_EXTENSIONS_DB has 'preview' in script names (staging?)");
  console.log("   - Both are Neon databases in your Vercel setup");
}

checkBothDatabases();
