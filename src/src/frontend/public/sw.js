const CACHE_NAME = 'nagarajan-card-v2';

self.addEventListener('install', (e) => {
  const base = self.registration.scope;
  const urlsToCache = [base, base + 'index.html'];
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
