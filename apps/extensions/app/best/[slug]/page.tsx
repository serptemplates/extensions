import { notFound } from "next/navigation";
import { getTopicBySlug, getExtensionsByTopic } from "@serp-extensions/app-core/lib/catalog";
import { getExtensionUrl } from "@serp-extensions/app-core/lib/urls";
import { DetailListingPage, type ToolItem } from "@/components/shared/DetailListingPage";

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
  const relatedExtensions: ToolItem[] = extensions.map((ext) => ({
    id: ext.id,
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
    <DetailListingPage
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Topics", href: "/topics" }, { label: topic.name }]}
      title={topic.name}
      subtitle={topic.description || undefined}
      badgeLeft="Topic"
      badgeRight={topic.ahrefsSv && topic.ahrefsSv > 100000 ? "Popular" : undefined}
      items={relatedExtensions}
    />
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
