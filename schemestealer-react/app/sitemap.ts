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
    },
    {
      url: `${baseUrl}/inspiration`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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
    
    // Paint Pages Routes
    let paintRoutes: MetadataRoute.Sitemap = [];
    try {
      const paintsFilePath = path.join(process.cwd(), 'lib', 'data', 'conversions.json');
      const paintsFileData = fs.readFileSync(paintsFilePath, 'utf8');
      const paintsData = JSON.parse(paintsFileData);
      
      paintRoutes = Object.keys(paintsData.paints).map((slug: string) => {
        const paint = paintsData.paints[slug].source;
        const brandSlug = paint.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        return {
          url: `${baseUrl}/paints/${brandSlug}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        };
      });
    } catch (error) {
      console.error('Error reading conversions.json for sitemap generation:', error);
    }
    
    return [...routes, ...dynamicRoutes, ...paintRoutes];
  } catch (error) {
    console.error('Error reading conversion paths for sitemap generation:', error);
    return routes;
  }
}
