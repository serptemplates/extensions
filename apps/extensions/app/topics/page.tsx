import { getTopicsWithCounts } from "@serp-extensions/app-core/lib/catalog";
import type { Metadata } from "next";
import { getBestUrl } from "@serp-extensions/app-core/lib/urls";
import { ListHero } from "@/components/shared/ListHero";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CollectionGrid, type CollectionItem } from "@/components/shared/CollectionGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse by Topics",
  description: "Explore browser extensions by topic. Find the best extensions for password management, VPNs, ad blocking, productivity, and more.",
};

export default async function TopicsPage() {
  const allTopics = await getTopicsWithCounts();

  // Filter out topics with no extensions
  const topics = allTopics.filter((topic) => topic.count > 0);

  // Sort by search volume descending
  const sortedTopics = topics.sort((a, b) => {
    const aVol = a.ahrefsSv || 0;
    const bVol = b.ahrefsSv || 0;
    return bVol - aVol;
  });

  // Group topics by volume tier
  const highVolume = sortedTopics.filter(t => (t.ahrefsSv || 0) >= 100000);
  const mediumVolume = sortedTopics.filter(t => (t.ahrefsSv || 0) >= 10000 && (t.ahrefsSv || 0) < 100000);
  const lowVolume = sortedTopics.filter(t => (t.ahrefsSv || 0) < 10000);

  return (
    <main className="min-h-screen">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Topics" }]} />
      <ListHero
        title="Browse Extensions by Topic"
        subtitle={`Explore ${topics.length} curated topics to find the perfect browser extensions for your needs. From security and privacy to productivity and entertainment.`}
        badges={[
          `${highVolume.length} High Demand`,
          `${mediumVolume.length} Growing`,
          `${lowVolume.length} Specialized`,
        ]}
      />

      {/* Topics Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* High Volume Topics */}
          {highVolume.length > 0 && (
            <div className="mb-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Most Popular</h2>
                <p className="text-gray-600">Most sought-after extension topics</p>
              </div>
              <CollectionGrid
                items={highVolume.map<CollectionItem>((topic) => ({
                  href: getBestUrl(topic.slug),
                  title: topic.name,
                  description: topic.description ?? undefined,
                  rightBadge:
                    topic.ahrefsSv && topic.ahrefsSv > 500000 ? "Trending" : undefined,
                }))}
              />
            </div>
          )}

          {/* Medium Volume Topics */}
          {mediumVolume.length > 0 && (
            <div className="mb-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Growing Topics</h2>
                <p className="text-gray-600">Emerging extension categories</p>
              </div>
              <CollectionGrid
                items={mediumVolume.map<CollectionItem>((topic) => ({
                  href: getBestUrl(topic.slug),
                  title: topic.name,
                  description: topic.description ?? undefined,
                }))}
              />
            </div>
          )}

          {/* Low Volume Topics */}
          {lowVolume.length > 0 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Specialized Topics</h2>
                <p className="text-gray-600">Niche topics for specific use cases</p>
              </div>
              <CollectionGrid
                items={lowVolume.map<CollectionItem>((topic) => ({
                  href: getBestUrl(topic.slug),
                  title: topic.name,
                  description: topic.description ?? undefined,
                }))}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
