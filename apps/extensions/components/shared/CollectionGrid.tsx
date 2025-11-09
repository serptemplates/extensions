import { CollectionCard, type CollectionItem } from "./CollectionCard";

export function CollectionGrid({ items }: { items: CollectionItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <CollectionCard key={item.href} item={item} />
      ))}
    </div>
  );
}

