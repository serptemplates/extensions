import { config } from "dotenv";
import path from "path";
import { neon } from "@neondatabase/serverless";

// Load environment
config({
  path: path.join(process.cwd(), "apps/extensions/.env.local"),
});

async function getTableSchema(connectionString: string) {
  const sql = neon(connectionString);
  
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  
  const schemas: Record<string, any[]> = {};
  
  for (const { table_name } of tables) {
    const columns = await sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = ${table_name}
      ORDER BY ordinal_position
    `;
    schemas[table_name] = columns;
  }
  
  return schemas;
}

async function compareSchemas() {
  console.log("🔍 Comparing database schemas...\n");
  
  const devUrl = process.env.DATABASE_URL;
  const prodUrl = "postgresql://neondb_owner:npg_9nNplZtB7QXI@ep-broad-boat-a4iixfun-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
  
  if (!devUrl) {
    console.error("❌ DATABASE_URL not found");
    return;
  }
  
  console.log("📊 Development DB:", devUrl.split("@")[1]?.split("/")[0]);
  console.log("📊 Production DB:", prodUrl.split("@")[1]?.split("/")[0]);
  console.log();
  
  const [devSchema, prodSchema] = await Promise.all([
    getTableSchema(devUrl),
    getTableSchema(prodUrl),
  ]);
  
  const devTables = Object.keys(devSchema).sort();
  const prodTables = Object.keys(prodSchema).sort();
  
  console.log(`📋 Dev tables (${devTables.length}):`, devTables.join(", "));
  console.log(`📋 Prod tables (${prodTables.length}):`, prodTables.join(", "));
  console.log();
  
  // Check if tables match
  if (JSON.stringify(devTables) !== JSON.stringify(prodTables)) {
    console.log("❌ Table names don't match!");
    const onlyInDev = devTables.filter(t => !prodTables.includes(t));
    const onlyInProd = prodTables.filter(t => !devTables.includes(t));
    if (onlyInDev.length) console.log("  Only in dev:", onlyInDev);
    if (onlyInProd.length) console.log("  Only in prod:", onlyInProd);
    return;
  }
  
  console.log("✅ All tables exist in both databases\n");
  
  // Compare columns for each table
  let allMatch = true;
  for (const table of devTables) {
    const devCols = devSchema[table].map(c => `${c.column_name}:${c.data_type}`);
    const prodCols = prodSchema[table].map(c => `${c.column_name}:${c.data_type}`);
    
    if (JSON.stringify(devCols) === JSON.stringify(prodCols)) {
      console.log(`✅ ${table}: columns match (${devCols.length} columns)`);
    } else {
      console.log(`❌ ${table}: columns don't match`);
      console.log(`  Dev:`, devCols);
      console.log(`  Prod:`, prodCols);
      allMatch = false;
    }
  }
  
  console.log();
  if (allMatch) {
    console.log("🎉 All schemas match perfectly!");
  } else {
    console.log("⚠️  Some schema differences found");
  }
}

compareSchemas().catch(console.error);
