import { config } from "dotenv";
import path from "path";

// Load environment from the same place as other scripts
config({
  path: path.join(process.cwd(), "apps/extensions/.env.local"),
});

import { getActiveExtensions } from "../packages/app-core/src/lib/catalog";

async function testCatalog() {
  console.log("🔍 Testing catalog...\n");
  
  const extensions = await getActiveExtensions();
  
  console.log(`📦 Found ${extensions.length} extensions from catalog`);
  console.log("\nFirst 3 extensions:");
  extensions.slice(0, 3).forEach((ext) => {
    console.log(`  - ${ext.name} (${ext.slug})`);
  });
}

testCatalog().catch(console.error);
