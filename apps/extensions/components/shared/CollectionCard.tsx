import Link from "next/link";
import { Badge } from "@serp-extensions/ui/components/badge";

export type CollectionItem = {
  href: string;
  title: string;
  description?: string;
  rightBadge?: string;
};

export function CollectionCard({ item }: { item: CollectionItem }) {
  return (
    <Link
      href={item.href}
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        {item.rightBadge && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {item.rightBadge}
          </Badge>
        )}
      </div>
      {item.description && (
        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
      )}
    </Link>
  );
}

