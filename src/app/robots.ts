import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexingEnabled } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const indexingEnabled = isIndexingEnabled();
  const sitemap = absoluteUrl("/sitemap.xml");

  return {
    rules: {
      userAgent: "*",
      allow: indexingEnabled ? "/" : undefined,
      disallow: indexingEnabled ? undefined : "/"
    },
    ...(sitemap ? { sitemap } : {})
  };
}
