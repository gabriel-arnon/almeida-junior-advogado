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
  const socialImagePath = "/images/og-image.png";
  const socialImageUrl = absoluteUrl(socialImagePath) || socialImagePath;
  const indexingEnabled = isIndexingEnabled();
  const socialImage = {
    url: socialImageUrl,
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} - Direito Bancário e Direito do Consumidor`
  };
  const openGraph = {
    title: pageTitle,
    description,
    siteName: siteConfig.name,
    locale: "pt_BR",
    type: "website" as const,
    images: [socialImage],
    ...(url ? { url } : {})
  };

  return {
    title: pageTitle,
    description,
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      other: [{ rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" }]
    },
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
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [socialImageUrl]
    }
  };
}
