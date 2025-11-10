/**
 * Generate the URL for an extension detail page
 */
export function getExtensionUrl(extension: { 
  slug: string; 
  developerUsername?: string; 
  id: string 
}): string {
  // Use developer slug from database if available (e.g., "serp" for your extensions)
  // Otherwise fall back to the extension's ID (Chrome Store ID for third-party extensions)
  const developer = extension.developerUsername || extension.id;
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
