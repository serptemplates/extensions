"use client";

import { useState, useRef } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@serp-extensions/ui/components/card";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface ItemCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    href: string;
    icon?: LucideIcon;
    imageUrl?: string;
    rating?: number;
    users?: string;
    isPopular?: boolean;
  };
};

const colors = [
  "rgb(239, 68, 68)",   // red-500
  "rgb(245, 158, 11)",  // amber-500
  "rgb(34, 197, 94)",   // green-500
  "rgb(59, 130, 246)",  // blue-500
  "rgb(168, 85, 247)",  // purple-500
  "rgb(236, 72, 153)",  // pink-500
  "rgb(20, 184, 166)",  // teal-500
  "rgb(251, 146, 60)",  // orange-500
  "rgb(99, 102, 241)",  // indigo-500
  "rgb(244, 63, 94)",   // rose-500
  "rgb(14, 165, 233)",  // sky-500
  "rgb(163, 230, 53)",  // lime-400
];

export function ItemCard({ tool }: ItemCardProps) {
  const [borderColor, setBorderColor] = useState<string>("");
  const [imageError, setImageError] = useState(false);
  const colorIndexRef = useRef(0);

  const handleMouseEnter = () => {
    // Cycle through colors sequentially instead of random
    colorIndexRef.current = (colorIndexRef.current + 1) % colors.length;
    const color = colors[colorIndexRef.current];
    if (color) {
      setBorderColor(color);
    }
  };

  const handleMouseLeave = () => {
    setBorderColor("");
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={tool.href}>
      <Card
        className="group h-full transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-2"
        style={{
          borderColor: borderColor || undefined,
          transition: "all 0.3s ease, border-color 0.2s ease",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-start gap-3">
              {tool.imageUrl && !imageError ? (
                <Image
                  src={tool.imageUrl}
                  alt={tool.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 mt-0.5 rounded-md bg-white object-cover"
                  onError={handleImageError}
                />
              ) : tool.icon ? (
                <tool.icon
                  className="h-6 w-6 mt-0.5 transition-colors duration-300"
                  style={{ color: borderColor || undefined }}
                />
              ) : (
                <div className="h-8 w-8 mt-0.5 rounded-md bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600">
                    {tool.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {tool.name}
                </CardTitle>
              </div>
            </div>
          </div>
          <CardDescription className="line-clamp-2 mb-3">
            {tool.description}
          </CardDescription>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            {tool.rating && (
              <span className="flex items-center gap-1">
                ⭐ {tool.rating.toFixed(1)}
              </span>
            )}
            {tool.users && (
              <span>{tool.users}</span>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}