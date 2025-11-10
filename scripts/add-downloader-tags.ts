import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

// Load env from apps/extensions/.env.local
config({ path: resolve(process.cwd(), "apps/extensions/.env.local") });

async function addDownloaderTags() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Get all extensions that end with "Downloader" and have no tags or empty tags
  const downloaderExtensions = await sql`
    SELECT id, name, tags
    FROM extensions
    WHERE name LIKE '%Downloader'
    ORDER BY name
  `;

  console.log(`\nFound ${downloaderExtensions.length} downloader extensions`);
  
  let updated = 0;
  
  for (const ext of downloaderExtensions) {
    const currentTags = ext.tags || [];
    
    // Only update if tags are empty or don't already include 'video-downloader'
    if (currentTags.length === 0 || !currentTags.includes('video-downloader')) {
      const newTags = [...currentTags, 'video-downloader'];
      const tagsJson = JSON.stringify(newTags);
      
      await sql`
        UPDATE extensions
        SET tags = ${tagsJson}::jsonb
        WHERE id = ${ext.id}
      `;
      
      console.log(`✓ Updated: ${ext.name}`);
      updated++;
    } else {
      console.log(`- Skipped: ${ext.name} (already has video-downloader tag)`);
    }
  }
  
  console.log(`\n✅ Updated ${updated} extensions with 'video-downloader' tag`);
  process.exit(0);
}

addDownloaderTags();
