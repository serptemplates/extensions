import { config } from "dotenv";
import path from "path";
import { neon } from "@neondatabase/serverless";

// Load environment
config({
  path: path.join(process.cwd(), "apps/extensions/.env.local"),
});

async function getDataCounts(connectionString: string) {
  const sql = neon(connectionString);
  
  const [developers] = await sql`SELECT COUNT(*)::int as count FROM developers`;
  const [extensions] = await sql`SELECT COUNT(*)::int as count FROM extensions`;
  const [categories] = await sql`SELECT COUNT(*)::int as count FROM categories`;
  const [topics] = await sql`SELECT COUNT(*)::int as count FROM topics`;
  
  const devList = await sql`SELECT slug, name FROM developers ORDER BY slug`;
  const extList = await sql`SELECT slug, name, developer_id FROM extensions ORDER BY slug LIMIT 10`;
  
  return {
    counts: {
      developers: developers.count,
      extensions: extensions.count,
      categories: categories.count,
      topics: topics.count,
    },
    developers: devList,
    extensions: extList,
  };
}

async function compareData() {
  console.log("🔍 Comparing database data...\n");
  
  const devUrl = process.env.DATABASE_URL;
  const prodUrl = "postgresql://neondb_owner:npg_9nNplZtB7QXI@ep-broad-boat-a4iixfun-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
  
  if (!devUrl) {
    console.error("❌ DATABASE_URL not found");
    return;
  }
  
  console.log("📊 Development DB:", devUrl.split("@")[1]?.split("/")[0]);
  console.log("📊 Production DB:", prodUrl.split("@")[1]?.split("/")[0]);
  console.log();
  
  const [devData, prodData] = await Promise.all([
    getDataCounts(devUrl),
    getDataCounts(prodUrl),
  ]);
  
  console.log("📈 Row Counts:");
  console.log("─────────────────────────────────────");
  console.log(`Developers:  Dev=${devData.counts.developers}  Prod=${prodData.counts.developers}  ${devData.counts.developers === prodData.counts.developers ? "✅" : "❌"}`);
  console.log(`Extensions:  Dev=${devData.counts.extensions}  Prod=${prodData.counts.extensions}  ${devData.counts.extensions === prodData.counts.extensions ? "✅" : "❌"}`);
  console.log(`Categories:  Dev=${devData.counts.categories}  Prod=${prodData.counts.categories}  ${devData.counts.categories === prodData.counts.categories ? "✅" : "❌"}`);
  console.log(`Topics:      Dev=${devData.counts.topics}  Prod=${prodData.counts.topics}  ${devData.counts.topics === prodData.counts.topics ? "✅" : "❌"}`);
  console.log();
  
  console.log("👥 Developers:");
  console.log("Dev:", devData.developers.map(d => d.slug).join(", "));
  console.log("Prod:", prodData.developers.map(d => d.slug).join(", "));
  console.log();
  
  console.log("📦 Extensions (first 10):");
  console.log("\nDev:");
  devData.extensions.forEach(e => {
    console.log(`  - ${e.slug} (dev: ${e.developer_id || "none"})`);
  });
  console.log("\nProd:");
  prodData.extensions.forEach(e => {
    console.log(`  - ${e.slug} (dev: ${e.developer_id || "none"})`);
  });
  console.log();
  
  const allMatch = 
    devData.counts.developers === prodData.counts.developers &&
    devData.counts.extensions === prodData.counts.extensions &&
    devData.counts.categories === prodData.counts.categories &&
    devData.counts.topics === prodData.counts.topics;
  
  if (allMatch) {
    console.log("🎉 Data counts match!");
  } else {
    console.log("⚠️  Data counts differ between dev and prod");
  }
}

compareData().catch(console.error);
