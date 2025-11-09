import { Badge } from "@serp-extensions/ui/components/badge";
import { Breadcrumbs, type Crumb } from "@/components/shared/Breadcrumbs";
import { ItemCard } from "@/components/ItemCard";

export type ToolItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  imageUrl?: string;
  rating?: number;
  users?: string;
  isPopular?: boolean;
};

export function DetailListingPage({
  breadcrumbs,
  title,
  subtitle,
  badgeLeft,
  badgeRight,
  items,
}: {
  breadcrumbs: Crumb[];
  title: string;
  subtitle?: string;
  badgeLeft?: string;
  badgeRight?: string;
  items: ToolItem[];
}) {
  return (
    <main className="min-h-screen">
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container relative py-16 md:py-24 px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              {badgeLeft && (
                <Badge variant="secondary" className="text-sm">
                  {badgeLeft}
                </Badge>
              )}
              {badgeRight && <Badge variant="outline">{badgeRight}</Badge>}
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </section>

      {/* Extensions Grid */}
      <section className="container mx-auto max-w-4xl py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">
          {items.length} {items.length === 1 ? "Extension" : "Extensions"}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((tool) => (
            <ItemCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  );
}

