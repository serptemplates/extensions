import { config } from "dotenv";
import { resolve } from "path";

// Load env
config({ path: resolve(process.cwd(), "apps/extensions/.env.local") });

console.log("🔍 Checking which database your localhost is using...\n");

const DATABASE_URL = process.env.DATABASE_URL;
const SERP_EXTENSIONS_DB_DATABASE_URL = process.env.SERP_EXTENSIONS_DB_DATABASE_URL;

console.log("📋 Available database connections:\n");

if (DATABASE_URL) {
  const match = DATABASE_URL.match(/@([^/]+)\//);
  const host = match ? match[1] : 'unknown';
  console.log("1️⃣  DATABASE_URL:");
  console.log(`   Host: ${host}`);
  console.log(`   Priority: First (will be used)`);
}

if (SERP_EXTENSIONS_DB_DATABASE_URL) {
  const match = SERP_EXTENSIONS_DB_DATABASE_URL.match(/@([^/]+)\//);
  const host = match ? match[1] : 'unknown';
  console.log("\n2️⃣  SERP_EXTENSIONS_DB_DATABASE_URL:");
  console.log(`   Host: ${host}`);
  console.log(`   Priority: Second (fallback)`);
}

console.log("\n📍 The app uses this priority order:");
console.log("   1. DATABASE_URL (if set)");
console.log("   2. SERP_EXTENSIONS_DB_DATABASE_URL (if DATABASE_URL not set)");
console.log("   3. POSTGRES_URL (if neither above is set)");

console.log("\n✅ Your localhost is currently connected to:");
const activeUrl = DATABASE_URL || SERP_EXTENSIONS_DB_DATABASE_URL;
if (activeUrl) {
  const match = activeUrl.match(/@([^/]+)\//);
  const host = match ? match[1] : 'unknown';
  
  if (activeUrl === DATABASE_URL) {
    console.log(`   DATABASE_URL: ${host}`);
    console.log(`   Region: ${host.includes('us-west') ? 'US West 2' : host.includes('us-east') ? 'US East 1' : 'Unknown'}`);
  } else {
    console.log(`   SERP_EXTENSIONS_DB_DATABASE_URL: ${host}`);
    console.log(`   Region: ${host.includes('us-west') ? 'US West 2' : host.includes('us-east') ? 'US East 1' : 'Unknown'}`);
  }
}
