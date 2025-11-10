import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

// Load env from apps/extensions/.env.local
config({ path: resolve(process.cwd(), "apps/extensions/.env.local") });

async function listExtensionTags() {
  const sql = neon(process.env.DATABASE_URL!);
  
  const allExtensions = await sql`
    SELECT name, tags
    FROM extensions
    ORDER BY name
  `;

  console.log('\n📦 Extensions and their Tags:\n');
  allExtensions.forEach((ext: any) => {
    const tagsList = ext.tags && ext.tags.length > 0 
      ? ext.tags.join(', ') 
      : '(no tags)';
    console.log(`• ${ext.name}`);
    console.log(`  Tags: ${tagsList}\n`);
  });

  console.log(`Total: ${allExtensions.length} extensions`);
  process.exit(0);
}

listExtensionTags();
