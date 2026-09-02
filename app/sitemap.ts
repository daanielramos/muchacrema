import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://muchacrema.mx", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
