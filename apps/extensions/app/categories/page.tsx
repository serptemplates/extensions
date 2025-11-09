import type { Metadata } from "next";
import { getCategoriesWithCounts } from "@serp-extensions/app-core/lib/catalog";
import { ListHero } from "@/components/shared/ListHero";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CollectionGrid, type CollectionItem } from "@/components/shared/CollectionGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Categories - SERP Extensions",
  description:
    "Explore browser extensions by category. Discover popular picks across productivity, privacy, accessibility, and more.",
};

function formatCategoryName(slug: string, fallback?: string) {
  if (fallback && fallback.trim().length > 0) return fallback;
  return slug
    .split("-")
    .map((s) => (s ? s[0]!.toUpperCase() + s.slice(1) : s))
    .join(" ");
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  const visible = categories
    .filter((c) => c.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <ListHero
        title="Browse Extensions by Category"
        subtitle={`${visible.length} curated categories to explore.`}
        badges={["Popular picks", "Updated regularly"]}
      />

      {/* Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {visible.length === 0 ? (
            <div className="text-center text-gray-600">
              No categories yet. Seed data or connect a database to populate this list.
            </div>
          ) : (
            <CollectionGrid
              items={visible.map<CollectionItem>((c) => ({
                href: `/categories/${c.slug}`,
                title: formatCategoryName(c.slug, c.name),
                description: c.description ?? undefined,
                rightBadge: c.count > 0 ? String(c.count) : undefined,
              }))}
            />
          )}
        </div>
      </section>
    </main>
  );
}
