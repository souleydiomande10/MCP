// ════════════════════════════════════════════════════════
// MARKET CENTER PLACE — Service Worker v2.0
// Stratégie : Cache First pour assets, Network First pour API
// ════════════════════════════════════════════════════════

const CACHE_NAME    = 'mcp-v2.0';
const STATIC_CACHE  = 'mcp-static-v2.0';
const API_CACHE     = 'mcp-api-v2.0';

// Assets à mettre en cache immédiatement
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/catalogue.html',
  '/connexion.html',
  '/panier.html',
  '/style.css',
  '/nav.css',
  '/mobile.css',
  '/components.js',
  '/script.js',
  '/ux-improvements.js',
  '/chatbot.js',
  '/manifest.json',
  '/offline.html',
];

// ── INSTALL : précache les assets critiques ──
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(PRECACHE_ASSETS.filter(function(url) {
        return !url.includes('gsap'); // GSAP depuis CDN seulement
      }));
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── ACTIVATE : nettoyer les anciens caches ──
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== STATIC_CACHE && key !== API_CACHE;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── FETCH : stratégie intelligente ──
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Ignorer les extensions Chrome et devtools
  if (url.protocol === 'chrome-extension:') return;

  // API → Network First avec fallback cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(API_CACHE).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(function() {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Assets statiques → Cache First
  if (
    url.pathname.match(/\.(css|js|woff2?|png|jpg|webp|svg|ico)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(STATIC_CACHE).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML → Network First avec fallback offline
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          var clone = response.clone();
          caches.open(STATIC_CACHE).then(function(cache) {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(function() {
          return caches.match(event.request)
            || caches.match('/offline.html')
            || caches.match('/index.html');
        })
    );
    return;
  }
});

// ── BACKGROUND SYNC ──
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

function syncCart() {
  // Synchroniser le panier local avec le serveur quand la connexion revient
  return self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      client.postMessage({ type: 'CART_SYNCED' });
    });
  });
}
