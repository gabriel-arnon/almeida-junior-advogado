import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { absoluteUrl, isIndexingEnabled } from "@/lib/utils";

type MetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
};

export function createMetadata({
  title,
  description = siteConfig.siteDescription,
  path = "/"
}: MetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const url = absoluteUrl(path);
  const indexingEnabled = isIndexingEnabled();
  const openGraph = {
    title: pageTitle,
    description,
    siteName: siteConfig.name,
    locale: "pt_BR",
    type: "website" as const,
    ...(url ? { url } : {})
  };

  return {
    title: pageTitle,
    description,
    ...(url
      ? {
          alternates: {
            canonical: url
          }
        }
      : {}),
    openGraph,
    robots: {
      index: indexingEnabled,
      follow: indexingEnabled,
      googleBot: {
        index: indexingEnabled,
        follow: indexingEnabled
      }
    }
  };
}
