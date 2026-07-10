import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SwatchCompare } from '@/components/seo/SwatchCompare';
import { DeltaEBadge } from '@/components/seo/DeltaEBadge';
import { CopyHexBadge } from '@/components/seo/CopyHexBadge';

type Props = {
  params: Promise<{ brand: string; slug: string }>;
};

let cachedConversions: any = null;

function getConversions() {
  if (cachedConversions) return cachedConversions;
  const filePath = path.join(process.cwd(), 'lib', 'data', 'conversions.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  cachedConversions = JSON.parse(fileData);
  return cachedConversions;
}

export async function generateStaticParams() {
  const data = getConversions();

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
  const data = getConversions();

  const paintData = data.paints[resolvedParams.slug];
  if (!paintData) return { title: 'Paint Not Found' };

  const paint = paintData.source;
  const displayName = paint.old_name ? `${paint.name} (formerly ${paint.old_name})` : paint.name;
  
  const pageTitle = `${displayName} by ${paint.brand} - Paint Details & Color Matches | SchemeStealer`;
  const pageDescription = `Detailed color information, \u0394E accuracy, and cross-brand paint matches for ${paint.brand} ${paint.name}. Find the perfect drop-in substitute.`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `https://schemestealer.com/paints/${resolvedParams.brand}/${resolvedParams.slug}`,
    },
  };
}

export default async function PaintHubPage({ params }: Props) {
  const resolvedParams = await params;
  const data = getConversions();

  const paintData = data.paints[resolvedParams.slug];
  if (!paintData) {
    notFound();
  }

  const source = paintData.source;
  // Convert matches into an array of [brandName, matchesArray], then format and sort them
  const brandEntries = Object.entries(paintData.matches) as [string, any[]][];
  
  // Sort by the best match in each brand (the one with the lowest delta_e)
  brandEntries.forEach(([, matchesArray]) => {
    matchesArray.sort((a, b) => a.delta_e - b.delta_e);
  });
  
  // Sort the brands so the brand with the absolute best match is at the top
  brandEntries.sort((a, b) => {
    const bestA = a[1][0]?.delta_e ?? 999;
    const bestB = b[1][0]?.delta_e ?? 999;
    return bestA - bestB;
  });

  return (
    // div, not <main>: the root layout already renders the page inside a
    // <main> with pb-nav-safe — nesting doubled both
    <div className="min-h-dvh bg-void-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* SCHEMESTEALER BRANDING */}
        <div className="flex justify-center mb-12">
          <Link href="/" className="gothic-text text-2xl sm:text-3xl text-brass hover:text-imperial-gold transition-colors tracking-widest text-shadow flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-brass flex items-center justify-center relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-brass/20"></div>
              <div className="w-2 h-2 bg-cogitator-green rounded-full shadow-[0_0_10px_#00ff41]"></div>
            </div>
            SCHEMESTEALER
            <div className="w-6 h-6 rounded-full border-2 border-brass flex items-center justify-center relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-brass/20"></div>
              <div className="w-2 h-2 bg-error rounded-full shadow-[0_0_10px_#ff0000]"></div>
            </div>
          </Link>
        </div>

        {/* HEADER SECTION */}
        <div className="mb-16 text-center">
          <p className="text-brass uppercase tracking-widest text-sm md:text-base font-bold mb-3 drop-shadow-md">
            {source.brand}
          </p>
          
          <h1 className="text-5xl md:text-7xl gothic-text text-white mb-3 tracking-tight drop-shadow-lg">
            {source.name}
          </h1>
          
          {source.old_name && (
            <p className="text-gray-400 text-lg md:text-xl italic mb-6 font-serif">
              (Formerly {source.old_name})
            </p>
          )}

          <div className="flex justify-center mt-6">
            <CopyHexBadge hex={source.hex} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mb-16">
          <h2 className="text-2xl sm:text-3xl gothic-text text-brass uppercase tracking-widest border-b border-brass/40 pb-4 px-8 text-center drop-shadow-md">
            Cross-Brand<br/>Equivalents
          </h2>
        </div>

        {/* BRAND MATCHES */}
        {brandEntries.length > 0 ? (
          <div className="space-y-24">
            {brandEntries.map(([targetBrand, matchesArray]) => {
              const topMatch = matchesArray[0];
              if (!topMatch) return null;

              return (
                <div key={targetBrand} className="relative">
                  <div className="mb-8 text-center">
                    <h3 className="tech-text text-xl text-white uppercase tracking-widest bg-charcoal/30 py-2 inline-block px-6 border border-gray-800 rounded-sm shadow-sm">
                      {targetBrand} Match
                    </h3>
                  </div>

                  <SwatchCompare
                    sourceColor={source.hex}
                    sourceName={source.name}
                    sourceBrand={source.brand}
                    targetColor={topMatch.hex}
                    targetName={topMatch.name}
                    targetBrand={targetBrand}
                  />
                  <div className="flex justify-center -mt-12 relative z-20">
                    <DeltaEBadge deltaE={topMatch.delta_e} band={topMatch.band} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-red-950/20 border border-error p-8 text-center rounded-sm max-w-2xl mx-auto mt-12">
            <p className="tech-text text-error text-xl sm:text-2xl mb-4 tracking-widest uppercase">No Equivalents Logged</p>
            <p className="text-gray-300 text-sm sm:text-base">
              The cogitator could not find any equivalents for <strong>{source.name}</strong>.
            </p>
          </div>
        )}

        <div className="mt-20 pt-10 border-t border-gray-800/50 text-center">
          <Link href="/miniature" className="inline-block bg-void-black border-2 border-brass text-brass hover:text-imperial-gold hover:border-imperial-gold font-bold tracking-widest uppercase px-8 py-4 rounded-sm hover:shadow-[0_0_15px_rgba(184,134,11,0.3)] transition-all text-shadow">
            Scan Your Own Miniature
          </Link>
        </div>
      </div>
    </div>
  );
}
