import { getFeaturedExtensions, getCategoriesWithCounts } from "@serp-extensions/app-core/lib/catalog";
import { HomePageClient } from "@/components/HomePageClient";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch data on the server (faster, no API call needed)
  const [extensions, categories] = await Promise.all([
    getFeaturedExtensions(100),
    getCategoriesWithCounts(),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home" }]} />
      <HomePageClient extensions={extensions} categories={categories} />
    </>
  );
}
