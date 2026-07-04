import type { MetadataRoute } from 'next';
import { apiRequest, type ProductListData } from './lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://youniverse.io.vn';
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/policy`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/order`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  try {
    const data = await apiRequest<ProductListData>(
      '/products?page=1&limit=100&sort=newest',
      { next: { revalidate: 300, tags: ['products'] } },
    );
    const remainingPages = Array.from(
      { length: Math.max(0, data.pagination.totalPages - 1) },
      (_, index) => index + 2,
    );
    const remainingResults = await Promise.all(
      remainingPages.map((page) =>
        apiRequest<ProductListData>(
          `/products?page=${page}&limit=100&sort=newest`,
          { next: { revalidate: 300, tags: ['products'] } },
        ),
      ),
    );
    const products = [data.items, ...remainingResults.map((result) => result.items)].flat();
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${encodeURIComponent(product.slug)}`,
      ...(product.updatedAt ? { lastModified: product.updatedAt } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
