/*
self.addEventListener('install', (event) => {
    console.log('Inside the install handler:', event);
  });

  self.addEventListener('activate', (event) => {
    console.log('Inside the activate handler:', event);
  });
  
  self.addEventListener(fetch, (event) => {
    console.log('Inside the fetch handler:', event);
  });
  
  js');
*/

// Files to cache
const cacheName = 'rpn-desk-cache';
const contentToCache = [
  './ help.html',
  './index.hrml',
  './manifest.json',
  './register-sw.js',
  './rpn-code.js',
  './service-worker.js',
  './style-rpn.css',
  './images/rpn-16',
];

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(appShellFiles);
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })(),
  );
});
