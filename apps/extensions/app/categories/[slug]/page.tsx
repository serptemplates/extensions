import { notFound } from "next/navigation";
import { getCategoryBySlug, getExtensionsByCategory } from "@serp-extensions/app-core/lib/catalog";
import { getExtensionUrl } from "@serp-extensions/app-core/lib/urls";
import { DetailListingPage, type ToolItem } from "@/components/shared/DetailListingPage";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const extensions = await getExtensionsByCategory(slug);
  const items: ToolItem[] = extensions.map((ext) => ({
    id: ext.id,
    name: ext.name,
    href: getExtensionUrl(ext),
    imageUrl: ext.icon,
    description: ext.description,
    rating: ext.rating,
    users: ext.users,
    isPopular: ext.isPopular,
  }));

  if (items.length === 0) {
    notFound();
  }

  const title = category.name || slug.split("-").map(s => s ? s[0]!.toUpperCase() + s.slice(1) : s).join(" ");

  return (
    <DetailListingPage
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: title }]}
      title={title}
      subtitle={category.description || undefined}
      badgeLeft="Category"
      items={items}
    />
  );
}

