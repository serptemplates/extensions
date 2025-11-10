import { config } from "dotenv";
import path from "path";
import { neon } from "@neondatabase/serverless";

config({ path: path.join(process.cwd(), "apps/extensions/.env.local") });

async function checkThirdPartyIds() {
  const sql = neon(process.env.DATABASE_URL!);
  
  const exts = await sql`
    SELECT id, slug, name, developer_id 
    FROM extensions 
    WHERE developer_id IS NULL 
    ORDER BY slug
  `;
  
  console.log("Third-party extensions with NULL developer_id:\n");
  exts.forEach(e => {
    console.log(`  ${e.slug}:`);
    console.log(`    id: ${e.id}`);
    console.log(`    URL would be: /extensions/${e.id}/${e.slug}/\n`);
  });
}

checkThirdPartyIds().catch(console.error);
