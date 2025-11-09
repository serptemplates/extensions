import { getFeaturedExtensions } from "@serp-extensions/app-core/lib/catalog";
import { getExtensionUrl } from "@serp-extensions/app-core/lib/urls";
import { ItemCard } from "@/components/ItemCard";

type RelatedToolsSectionProps = {
  currentExtensionId: string;
  category?: string;
};

export async function RelatedToolsSection({ currentExtensionId, category }: RelatedToolsSectionProps) {
  // Get extensions from database
  const allExtensions = await getFeaturedExtensions(20);
  
  // Filter out current extension and optionally match category
  let relatedExtensions = allExtensions.filter(ext => ext.id !== currentExtensionId);
  
  // If category is provided, prioritize same-category extensions
  if (category) {
    const sameCategoryExts = relatedExtensions.filter(ext => ext.category === category);
    const otherExts = relatedExtensions.filter(ext => ext.category !== category);
    relatedExtensions = [...sameCategoryExts, ...otherExts];
  }
  
  // Take first 8
  const related = relatedExtensions.slice(0, 8);

  // If no related extensions, don't render
  if (related.length === 0) {
    return null;
  }

  // Map to ItemCard format
  const tools = related.map(ext => ({
    id: ext.id,
    name: ext.name,
    description: ext.description,
    href: getExtensionUrl(ext),
    imageUrl: ext.icon,
    rating: ext.rating,
    users: ext.users,
    isPopular: ext.isPopular,
  }));

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Related Extensions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {tools.map((tool) => (
          <ItemCard key={tool.id} tool={tool} />
        ))}
      </div>
    </>
  );
}
