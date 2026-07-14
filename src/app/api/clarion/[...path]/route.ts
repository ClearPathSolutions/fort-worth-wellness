import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Same-origin proxy for ClarionLabs' PUBLIC read endpoints (the blog embed).
 *
 * Why this exists: Clarion's blog feed (`/blog/public/feed`, `/blog/public/post`)
 * returns 200 but omits the `Access-Control-Allow-Origin` header, so the browser
 * CORS-blocks the embed's direct fetch. Routing those GETs through this
 * same-origin proxy sidesteps CORS entirely (server-to-server has no CORS), and
 * we forward the deployment origin + a browser UA so Clarion serves the data.
 *
 * Locked to Clarion's read-only public blog paths — not an open proxy.
 */
const CLARION_API = 'https://api.clarionlabs.ai';
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const ALLOWED = [/^blog\/public\//];

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const path = (params.path || []).join('/');
  if (!ALLOWED.some((re) => re.test(path))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const search = new URL(req.url).search;
  const host = req.headers.get('host') || 'fort-worth-wellness.vercel.app';
  const origin = req.headers.get('origin') || `https://${host}`;

  try {
    const upstream = await fetch(`${CLARION_API}/${path}${search}`, {
      headers: {
        'User-Agent': req.headers.get('user-agent') || BROWSER_UA,
        Origin: origin,
        Accept: 'application/json',
      },
    });
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'Cache-Control': 'public, max-age=120, s-maxage=300',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Upstream unavailable' }, { status: 502 });
  }
}
