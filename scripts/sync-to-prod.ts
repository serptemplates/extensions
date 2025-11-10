import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

// Load production env
config({ path: resolve(process.cwd(), "apps/extensions/.env.production") });

async function syncToProduction() {
  const PROD_DB_URL = process.env.DATABASE_URL;
  
  if (!PROD_DB_URL) {
    console.error('❌ DATABASE_URL not found in .env.production');
    console.error('   Run: cd apps/extensions && vercel env pull .env.production --environment=production');
    process.exit(1);
  }
  
  console.log('🚀 Syncing changes to PRODUCTION database...');
  console.log(`   Database: ${PROD_DB_URL.match(/ep-[^-]+-[^-]+-[^-]+/)?.[0]}\n`);
  
  const sql = neon(PROD_DB_URL);
  
  try {
    // 1. Add video-downloader tags to all downloader extensions
    console.log('📝 Step 1: Adding video-downloader tags to downloader extensions...');
    
    const downloaderExtensions = await sql`
      SELECT id, name, tags
      FROM extensions
      WHERE name LIKE '%Downloader'
      ORDER BY name
    `;

    console.log(`   Found ${downloaderExtensions.length} downloader extensions`);
    
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
        
        console.log(`   ✓ Updated: ${ext.name}`);
        updated++;
      } else {
        console.log(`   - Skipped: ${ext.name} (already has tag)`);
      }
    }
    
    console.log(`\n✅ Step 1 Complete: Updated ${updated} extensions with video-downloader tag\n`);
    
    // 2. Verify the changes
    console.log('🔍 Step 2: Verifying changes...');
    
    const verifyTags = await sql`
      SELECT COUNT(*) as count
      FROM extensions
      WHERE tags::jsonb @> '["video-downloader"]'::jsonb
    `;
    
    console.log(`   ✓ ${verifyTags[0]?.count || 0} extensions now have video-downloader tag`);
    
    console.log('\n✅ All changes synced to production successfully!');
    console.log('\n📌 Next steps:');
    console.log('   1. Test your changes locally');
    console.log('   2. Commit your code changes');
    console.log('   3. Push to GitHub');
    console.log('   4. Vercel will auto-deploy\n');
    
  } catch (error) {
    console.error('❌ Error syncing to production:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

syncToProduction();
