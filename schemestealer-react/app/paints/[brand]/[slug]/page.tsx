import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ brand: string; slug: string }>;
};

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'lib', 'data', 'conversions.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileData);
  
  const params = [];
  for (const slug of Object.keys(data.paints)) {
    const paint = data.paints[slug].source;
    const brandSlug = paint.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    params.push({
      brand: brandSlug,
      slug: slug,
    });
  }
  
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'lib', 'data', 'conversions.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileData);
  
  const paintData = data.paints[resolvedParams.slug];
  if (!paintData) return { title: 'Paint Not Found' };
  
  const paint = paintData.source;
  return {
    title: `${paint.name} by ${paint.brand} - Paint Details & Color Matches`,
    description: `Detailed color information and cross-brand paint matches for ${paint.name} by ${paint.brand}.`,
  };
}

export default async function PaintHubPage({ params }: Props) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'lib', 'data', 'conversions.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileData);
  
  const paintData = data.paints[resolvedParams.slug];
  if (!paintData) {
    notFound();
  }
  
  const source = paintData.source;
  const matches = paintData.matches;
  
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      {/* UI STUB - Stop here per user instructions */}
      <h1 className="text-3xl font-bold text-green-400 mb-4">{source.name}</h1>
      <p className="text-gray-400 mb-8">{source.brand} &bull; <span style={{color: source.hex}}>{source.hex}</span></p>
      
      <h2 className="text-2xl font-bold text-white mb-4">Cross-Brand Equivalents</h2>
      <div className="text-gray-300 border border-green-500/30 p-6 rounded-lg bg-green-950/10">
        <p className="mb-4 text-green-400 font-mono">{'// UI GENERATION PAUSED FOR COLLABORATION'}</p>
        <p>Total target brands matched: {Object.keys(matches).length}</p>
        <p className="text-sm mt-4 text-gray-500">We will build the SwatchCompare and DeltaEBadge components here.</p>
      </div>
    </main>
  );
}
