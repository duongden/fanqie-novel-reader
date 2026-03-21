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
    const clientUA = context.request.headers.get('User-Agent');
    const origin = new URL(targetUrl).origin + '/';
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': clientUA || 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': origin,
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
