const CACHE_NAME = 'shipping-calculator-v1.0.0';
const FILES_TO_CACHE = [
    './ShippingCalculator.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Service Worker: Caching files');
            return cache.addAll(FILES_TO_CACHE).catch(err => {
                console.error('Service Worker: Cache addAll failed:', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('Service Worker: Fetching from cache:', event.request.url);
                return response;
            }
            console.log('Service Worker: Fetching from network:', event.request.url);
            return fetch(event.request).catch(err => {
                console.error('Service Worker: Fetch failed:', err);
                throw err;
            });
        })
    );
});