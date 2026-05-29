const CACHE_NAME = 'gamesms-engine-v3';

// Seznam souborů, které chceme trvale uložit do mezipaměti (offline cache)
const ASSETS_TO_CACHE = [
    './',
    './room1.html',
    './style.css',
    './script.js',
    './ruka.png',
    './bg1.png',
    './bg2.png',
    './bg3.png',
    './video1.mp4',
    './video2.mp4',
    './video3.mp4',
    './audio/uvod.mp3',
    './audio/vanice.mp3', // Přidáno audio
    './audio/song1.mp3',
    './audio/song2.mp3',
    './audio/song3.mp3'
];

// 1. INSTALACE: Stáhne a uloží všechny základní soubory do cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Ukládám herní soubory do mezipaměti');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting()) // Vynutí okamžitou aktivaci nové verze
    );
});

// 2. AKTIVACE: Vyčistí staré verze cache, pokud engine v budoucnu aktualizuješ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Mažu starou mezipaměť:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. FETCH (CHYTRÁ STRATEGIE): 
// Pro videa a velké soubory zkusí nejdřív síť, a když je offline, vezme je z cache.
// Pro statické soubory (skripty, styly) bere rovnou cache, ať je hra blesková.
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Strategie pro videa a kapitoly (.mp4, .js), které se mohou měnit nebo stahovat za běhu
    if (url.pathname.endsWith('.mp4') || url.pathname.includes('story')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Pokud síť funguje, uložíme si kopii do cache pro příště
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Pokud síť selže (jsme offline), načteme soubor z cache
                    return caches.match(event.request);
                })
        );
    } else {
        // Standardní strategie: Nejdřív Cache, když chybí, tak Síť (ideální pro styl, ruka.png atd.)
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((response) => {
                    // Volitelně uložíme nově objevený soubor do cache
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                });
            })
        );
    }
});