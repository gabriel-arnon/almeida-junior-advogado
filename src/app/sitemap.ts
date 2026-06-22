import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = absoluteUrl("/");
  const privacy = absoluteUrl("/politica-de-privacidade");
  const legal = absoluteUrl("/aviso-legal");

  if (!home || !privacy || !legal) {
    return [];
  }

  return [
    {
      url: home,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: privacy,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4
    },
    {
      url: legal,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4
    }
  ];
}
