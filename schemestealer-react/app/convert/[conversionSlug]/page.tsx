import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { SwatchCompare } from '@/components/seo/SwatchCompare';
import { DeltaEBadge } from '@/components/seo/DeltaEBadge';

type Props = {
  params: Promise<{ conversionSlug: string }>;
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
  const filePath = path.join(process.cwd(), 'lib', 'data', 'conversion_paths.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const paths = JSON.parse(fileData);
  
  return paths.map((p: any) => ({
    conversionSlug: `${p.fromSlug}-to-${p.toBrand}`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  const match = resolvedParams.conversionSlug.match(/^(.+)-to-(.+)$/);
  if (!match) return { title: 'Not Found' };
  const [, fromSlug, toBrand] = match;

  const data = getConversions();
  
  const paintData = data.paints[fromSlug];
  if (!paintData) return { title: 'Not Found' };
  
  const source = paintData.source;
  const targetBrandName = Object.keys(paintData.matches).find(
    (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === toBrand
  ) || toBrand;
  
  const displayName = source.old_name ? `${source.name} (formerly ${source.old_name})` : source.name;

  const pageTitle = `${targetBrandName} Equivalent to ${source.brand} ${displayName} | SchemeStealer`;
  const pageDescription = `Find the closest ${targetBrandName} alternative for ${source.brand} ${source.name}. Compare paint swatches and view colour accuracy (\u0394E) to find the perfect drop-in substitute.`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `https://schemestealer.com/convert/${resolvedParams.conversionSlug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://schemestealer.com/convert/${resolvedParams.conversionSlug}`,
      siteName: 'SchemeStealer',
      images: [
        {
          url: `/convert/${resolvedParams.conversionSlug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [`/convert/${resolvedParams.conversionSlug}/opengraph-image`],
    },
  };
}

export default async function ConversionPage({ params }: Props) {
  const resolvedParams = await params;
  
  const match = resolvedParams.conversionSlug.match(/^(.+)-to-(.+)$/);
  if (!match) notFound();
  const [, fromSlug, toBrand] = match;

  const data = getConversions();
  
  const paintData = data.paints[fromSlug];
  if (!paintData) notFound();
  
  const source = paintData.source;
  const targetBrandName = Object.keys(paintData.matches).find(
    (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === toBrand
  );
  
  if (!targetBrandName) notFound();
  
  const matches = paintData.matches[targetBrandName] || [];
  const topMatch = matches[0];
  const otherMatches = matches.slice(1);
  
  // Format names
  const modernName = source.name;
  const oldName = source.old_name;
  const fullSourceName = oldName ? `${source.brand} ${modernName} (formerly ${oldName})` : `${source.brand} ${modernName}`;
  
  // SEO FAQ Schema
  const faqSchema = topMatch ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": `What is the ${targetBrandName} equivalent to ${fullSourceName}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `The closest ${targetBrandName} match for ${fullSourceName} is ${topMatch.name} with a colour difference (\u0394E) of ${topMatch.delta_e}, making it a ${topMatch.band} drop-in replacement.`
      }
    }]
  } : null;

  return (
    <>
      {faqSchema && (
        <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      {/* div, not <main>: the root layout already renders the page inside a
          <main> with pb-nav-safe — nesting doubled both */}
      <div className="flex-1 bg-void-black text-white">
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
          <div className="mb-10 text-center">
            <div className="inline-block px-4 py-1.5 border border-gray-800 bg-charcoal/30 rounded-sm mb-8">
              <p className="text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs">Paint Conversion Chart</p>
            </div>
            
            <p className="text-brass uppercase tracking-widest text-sm md:text-base font-bold mb-3 drop-shadow-md">
              {source.brand}
            </p>
            
            <h1 className="text-5xl md:text-7xl gothic-text text-white mb-3 tracking-tight drop-shadow-lg">
              {modernName}
            </h1>
            
            {oldName && (
              <p className="text-gray-400 text-lg md:text-xl italic mb-6 font-serif">
                (Formerly {oldName})
              </p>
            )}
          </div>
          
          {/* CONDENSED SEO INTRO */}
          <div className="max-w-xl mx-auto mb-12 text-center text-gray-300 text-sm sm:text-base leading-relaxed">
            <p>
              Looking for a drop-in substitute for <strong>{fullSourceName}</strong>? We've scanned the <strong>{targetBrandName}</strong> range to find the closest visual matches based on &Delta;E accuracy.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center mb-16">
            <h2 className="text-2xl sm:text-3xl gothic-text text-brass uppercase tracking-widest border-b border-brass/40 pb-4 px-8 text-center drop-shadow-md">
              {targetBrandName} Alternatives
            </h2>
          </div>

          {topMatch ? (
            <>
              {/* PRIMARY MATCH */}
              <div className="mb-16 relative">
                <SwatchCompare
                  sourceColor={source.hex}
                  sourceName={modernName}
                  sourceBrand={source.brand}
                  targetColor={topMatch.hex}
                  targetName={topMatch.name}
                  targetBrand={targetBrandName}
                />
                <div className="flex justify-center -mt-12 relative z-20">
                  <DeltaEBadge deltaE={topMatch.delta_e} band={topMatch.band} />
                </div>
              </div>
              
              {/* ALTERNATIVE MATCHES */}
              {otherMatches.length > 0 && (
                <div className="mt-16 max-w-3xl mx-auto">
                  <h3 className="tech-text text-lg text-brass border-b border-brass/20 pb-3 mb-6 uppercase tracking-widest">Alternative Matches</h3>
                  <div className="space-y-3">
                    {otherMatches.map((m: any) => (
                      <div key={m.paint_id} className="flex items-center justify-between gap-2 bg-charcoal/40 border border-gray-800/80 p-3 sm:p-4 rounded-sm hover:bg-charcoal/60 transition-colors">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-600 shadow-inner flex-shrink-0" style={{ backgroundColor: m.hex }}></div>
                          <div className="min-w-0">
                            <p className="font-bold text-base sm:text-lg tracking-tight truncate">{m.name}</p>
                            <p className="text-[11px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">{targetBrandName}</p>
                          </div>
                        </div>
                        <DeltaEBadge deltaE={m.delta_e} band={m.band} className="scale-75 origin-right" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-red-950/20 border border-error p-8 text-center rounded-sm max-w-2xl mx-auto mt-12">
              <p className="tech-text text-error text-xl sm:text-2xl mb-4 tracking-widest uppercase">No Suitable Match Found</p>
              <p className="text-gray-300 text-sm sm:text-base">
                The cogitator could not find an equivalent for <strong>{fullSourceName}</strong> in the <strong>{targetBrandName}</strong> range that falls within acceptable variance (&Delta;E &lt; 30).
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
    </>
  );
}
