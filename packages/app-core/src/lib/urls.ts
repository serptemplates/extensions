/**
 * Generate the URL for an extension detail page
 */
export function getExtensionUrl(extension: { 
  slug: string; 
  developerUsername?: string; 
  id: string 
}): string {
  const developer = extension.developerUsername || "serp";
  return `/extensions/${developer}/${extension.slug}`;
}

/**
 * Generate the URL for a topic page
 */
export function getTopicUrl(topicSlug: string): string {
  return `/topic/${topicSlug}`;
}

/**
 * Generate the URL for a "best" page
 */
export function getBestUrl(topicSlug: string): string {
  return `/best/${topicSlug}`;
}
