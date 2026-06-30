import fs from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://schemestealer.com';
  
  // Static Core Routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/miniature`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ];

  // Dynamic SEO Conversion Routes
  const filePath = path.join(process.cwd(), 'lib', 'data', 'conversion_paths.json');
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const paths = JSON.parse(fileData);
    
    const dynamicRoutes = paths.map((p: any) => ({
      url: `${baseUrl}/convert/${p.fromSlug}-to-${p.toBrand}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
    
    return [...routes, ...dynamicRoutes];
  } catch (error) {
    console.error('Error reading conversion paths for sitemap generation:', error);
    return routes;
  }
}
