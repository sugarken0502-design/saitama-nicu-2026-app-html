// NWS 採点アプリ：オフラインで動かすためのキャッシュ。患者データは扱わない（記録はタブレットのブラウザ内にのみ保存）。
const CACHE = 'nws6-app-v1.0.3';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') { e.respondWith(caches.match('./index.html').then((r) => r || fetch(req))); return; }
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
