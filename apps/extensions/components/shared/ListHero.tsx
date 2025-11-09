import { Badge } from "@serp-extensions/ui/components/badge";

type ListHeroProps = {
  title: string;
  subtitle?: string;
  badges?: Array<string>;
};

export function ListHero({ title, subtitle, badges = [] }: ListHeroProps) {
  return (
    <section className="border-b bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-600 mb-8">{subtitle}</p>
          )}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {badges.map((b, i) => (
                <Badge key={i} variant="secondary" className="text-sm">
                  {b}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

