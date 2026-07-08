/* 電気図配置アプリ Service Worker — オフライン動作用（アプリシェルをキャッシュ） */
const CACHE = 'pluscad-denki-v0.9';
// 同一オリジンのアプリ資産。バージョンを上げると古いキャッシュは activate で破棄。
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './unit_prices.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './lib/dxf_jww/jww_writer.js',
  './lib/dxf_jww/jww_reader.js',
  './lib/dxf_jww/dxf_parser.js',
  './lib/dxf_jww/dxf_to_jww.js',
  './lib/dxf_jww/jww_to_dxf.js',
  './lib/dxf_jww/header_template.bin'
];

self.addEventListener('install', ev => {
  // 一部が欠けても入れられるよう個別に addAll（失敗は握りつぶす）
  ev.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(u => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', ev => {
  ev.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // ページ遷移（ナビゲーション）はオフライン時に index.html を返す
  if (req.mode === 'navigate') {
    ev.respondWith((async () => {
      try { return await fetch(req); }
      catch { return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error(); }
    })());
    return;
  }

  if (sameOrigin) {
    // 同一オリジン資産：キャッシュ優先＋裏で更新（stale-while-revalidate）
    ev.respondWith((async () => {
      const cached = await caches.match(req);
      const net = fetch(req).then(res => {
        if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => null);
      return cached || (await net) || Response.error();
    })());
  } else {
    // クロスオリジン（PDF.js CDN等）：ネット優先、成功時にキャッシュへ（次回オフラインでも使える）
    ev.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res && (res.ok || res.type === 'opaque')) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      } catch {
        return (await caches.match(req)) || Response.error();
      }
    })());
  }
});
