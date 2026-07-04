import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://youniverse.io.vn/sitemap.xml',
    host: 'https://youniverse.io.vn',
  };
}
