import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

/**
 * Site-wide Open Graph card (FW-25). Every page except blog posts had no `og:image` at all
 * while `twitter:card` was `summary_large_image`, so shares rendered as an empty box.
 *
 * Drawn rather than photographed on purpose: the facility photography is the subject of
 * FW-13/FW-40 and is not yet something to lead a share preview with. This is also ~30 KB
 * instead of the ~900 KB the facility JPEGs weigh.
 */
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#20303c',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 3, background: '#b29063' }} />
          <div
            style={{
              color: '#c8ad86',
              fontSize: 24,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Weatherford, Texas
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#ffffff', fontSize: 74, lineHeight: 1.1, letterSpacing: -1 }}>
            {site.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 34, marginTop: 22 }}>
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            borderTop: '1px solid rgba(255,255,255,0.16)',
            paddingTop: 28,
          }}
        >
          <div style={{ color: '#6a97bd', fontSize: 30 }}>{site.phone.display}</div>
          <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 30 }}>·</div>
          <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 30 }}>{site.hours}</div>
        </div>
      </div>
    ),
    size,
  );
}
