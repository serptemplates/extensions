import { notFound } from "next/navigation";
import { getTopicBySlug, getExtensionsByTopic } from "@serp-extensions/app-core/lib/catalog";
import { getExtensionUrl } from "@serp-extensions/app-core/lib/urls";
import { ItemCard } from "@/components/ItemCard";
import { Badge } from "@serp-extensions/ui/components/badge";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  // Get extensions from join table, ordered by rank
  const extensions = await getExtensionsByTopic(slug);

  // Process extensions for display
  const relatedExtensions = extensions.map((ext) => ({
    id: ext.id,
    slug: ext.slug,
    name: ext.name,
    href: getExtensionUrl(ext),
    imageUrl: ext.icon,
    description: ext.description,
    rating: ext.rating,
    users: ext.users,
    isPopular: ext.isPopular,
  }));

  // Business Logic: Topics with no extensions should 404
  // This prevents empty/useless pages from being indexed by search engines
  if (relatedExtensions.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Topics", href: "/topics" }, { label: topic.name }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container relative py-16 md:py-24 px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                Topic
              </Badge>
              {topic.ahrefsSv && topic.ahrefsSv > 100000 && (
                <Badge variant="outline">
                  Popular
                </Badge>
              )}
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {topic.name}
            </h1>
            
            {topic.description && (
              <p className="text-lg text-muted-foreground">
                {topic.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Extensions Grid */}
      <section className="container mx-auto max-w-4xl py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">
          {relatedExtensions.length} {relatedExtensions.length === 1 ? 'Extension' : 'Extensions'}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {relatedExtensions.map((tool) => (
            <ItemCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    return {
      title: "Topic Not Found",
    };
  }

  return {
    title: `${topic.name} Extensions - SERP Extensions`,
    description: topic.description || `Discover the best ${topic.name.toLowerCase()} browser extensions`,
  };
}
