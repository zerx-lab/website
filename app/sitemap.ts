import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

const baseUrl = 'https://zerx.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = source.getPages();

  const docsPages = pages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...docsPages,
  ];
}
