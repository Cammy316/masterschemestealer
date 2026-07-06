import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // Use Node.js runtime to read files
export const alt = 'Colour Match Representation';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

function getConversions() {
  const filePath = path.join(process.cwd(), 'lib', 'data', 'conversions.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

export default async function Image({
  params,
}: {
  params: Promise<{ conversionSlug: string }>;
}) {
  const resolvedParams = await params;
  const match = resolvedParams.conversionSlug.match(/^(.+)-to-(.+)$/);
  
  if (!match) {
    return new Response('Not Found', { status: 404 });
  }

  const [, fromSlug, toBrand] = match;
  const data = getConversions();
  const paintData = data.paints[fromSlug];

  if (!paintData) {
    return new Response('Not Found', { status: 404 });
  }

  const source = paintData.source;
  const targetBrandName = Object.keys(paintData.matches).find(
    (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === toBrand
  ) || toBrand;

  const matches = paintData.matches[targetBrandName] || [];
  const topMatch = matches[0];

  if (!topMatch) {
    return new Response('Not Found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '80px' }}>
          {/* Source Paint */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '300px',
              height: '300px',
              backgroundColor: source.hex,
              borderRadius: '16px',
              border: '4px solid #333',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }} />
            <h2 style={{ fontSize: '36px', marginTop: '24px', fontWeight: 'bold' }}>{source.brand}</h2>
            <p style={{ fontSize: '28px', color: '#a3a3a3', marginTop: '8px' }}>{source.name}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '64px', color: '#ffb800' }}>→</div>
            <div style={{ fontSize: '24px', marginTop: '16px', background: '#333', padding: '8px 16px', borderRadius: '24px', color: '#fff' }}>
              ΔE: {topMatch.delta_e}
            </div>
          </div>

          {/* Target Paint */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '300px',
              height: '300px',
              backgroundColor: topMatch.hex,
              borderRadius: '16px',
              border: '4px solid #ffb800',
              boxShadow: '0 10px 40px rgba(255, 184, 0, 0.2)',
            }} />
            <h2 style={{ fontSize: '36px', marginTop: '24px', fontWeight: 'bold' }}>{targetBrandName}</h2>
            <p style={{ fontSize: '28px', color: '#a3a3a3', marginTop: '8px' }}>{topMatch.name}</p>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: '40px', fontSize: '32px', color: '#666', letterSpacing: '4px', fontWeight: 'bold' }}>
          SCHEMESTEALER
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
