import { API_OPTIONS } from '../src/utils/constants.js';

/** Allowed upstream bases to prevent open proxy abuse */
const ALLOWED_BASES = API_OPTIONS.map((opt) => opt.value);

function isAllowedUrl(url) {
  return ALLOWED_BASES.some((base) => url === base || url.startsWith(base + '/'));
}

export async function onRequestGet(context) {
  const targetUrl = context.request.headers.get('X-Target-URL');
  if (!targetUrl || !isAllowedUrl(targetUrl)) {
    return new Response('Bad Request', { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': context.request.headers.get('User-Agent') || 'FanqieTC/1.0',
      },
    });
    const body = await res.arrayBuffer();
    return new Response(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
