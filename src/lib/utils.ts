export function getPublicSiteUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!baseUrl) {
    return undefined;
  }

  try {
    return new URL(baseUrl).origin;
  } catch {
    return undefined;
  }
}

export function absoluteUrl(path = "") {
  const baseUrl = getPublicSiteUrl();

  if (!baseUrl) {
    return undefined;
  }

  return new URL(path, baseUrl).toString();
}

export function isIndexingEnabled() {
  return process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true";
}
