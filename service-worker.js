const CACHE_NAME = 'pwa-v2'; // Atualizado de v1 para v2

self.addEventListener('install', event => {
    console.log('Service Worker instalando.');
    self.skipWaiting(); 
});

self.addEventListener('activate', event => {
    console.log('Service Worker ativado.');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName); 
                    }
                })
            );
        })
    );
});

// Monitora as requisições e serve do cache se estiver offline
self.addEventListener('fetch', event => {
    console.log('Requisição de fetch para:', event.request.url);
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se o arquivo estiver no cache, devolve ele. Se não,
                //  busca na rede.
                return response || fetch(event.request);
            }).catch(() => {
                // Opcional: Se a rede falhar e não estiver no cache, você pode retornar uma página offline aqui
                console.log('Usuário está offline e o recurso não estava no cache.');
            })
    );
});