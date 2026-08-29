// Legend of Eternal - offline service worker
//
// The whole game is one self-contained HTML file (all art/audio/logic
// inline), so there's very little to cache: just that file plus the PWA
// shell (manifest + icons). Bump CACHE_VERSION any time you ship an
// updated index.html so installed devices pick up the new build instead
// of continuing to serve the stale cached copy.
const CACHE_VERSION = 'legend-of-eternal-v63';
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-512-maskable.png',
    './assets/tiles/dungeon.png',
    './assets/tiles/town.png',
    './assets/items/armor_leather.png',
    './assets/items/axe.png',
    './assets/items/axe_great.png',
    './assets/items/bone.png',
    './assets/items/boots.png',
    './assets/items/bow.png',
    './assets/items/claw.png',
    './assets/items/dagger.png',
    './assets/items/essence.png',
    './assets/items/fang.png',
    './assets/items/hammer.png',
    './assets/items/hammer_great.png',
    './assets/items/helm.png',
    './assets/items/material_generic.png',
    './assets/items/pants.png',
    './assets/items/ring.png',
    './assets/items/robe.png',
    './assets/items/robe_ornate.png',
    './assets/items/shield.png',
    './assets/items/shield_ornate.png',
    './assets/items/staff.png',
    './assets/items/staff_ornate.png',
    './assets/items/sword.png',
    './assets/items/sword_magic.png',
    './assets/items/vial.png',
    './assets/monsters/spider.png',
    './assets/monsters/construct.png',
    './assets/monsters/demon.png',
    './assets/monsters/goblinoid.png',
    './assets/monsters/knight.png',
    './assets/monsters/beast.png',
    './assets/monsters/worm.png',
    './assets/monsters/scorpion.png',
    './assets/monsters/undead.png',
    './assets/monsters/spirit.png',
    './assets/monsters/elemental.png',
    './assets/monsters/dragon.png',
    './assets/monsters/goblin_king.png',
    './assets/monsters/mummy_lord.png',
    './assets/monsters/chaos_lord.png',
    './assets/monsters/human.png',
    './assets/monsters/wolf.png',
    './assets/monsters/ice_elemental.png',
    './assets/heroes/warrior.png',
    './assets/heroes/mage.png',
    './assets/heroes/paladin.png',
    './assets/npcs/oratio.png',
    './assets/npcs/ouzo.png',
    './assets/npcs/ley.png',
    './assets/npcs/prime.png',
    './assets/npcs/linail.png',
    './assets/tiles/nature.png',
    './assets/tiles/ashlands.png',
    './assets/tiles/desert.png',
    './assets/town/door.png',
    './assets/town/window.png',
    './assets/town/roof.png',
    './assets/town/castle_wall.png',
    './assets/town/castle_door.png',
    './assets/town/castle_window.png',
    './assets/town/fountain.png',
    './assets/town/fence.png',
    './assets/items/tome.png',
    './assets/ui/title-bg.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Network-first for the core HTML (so playing online always gets the latest
// build and only falls back to the cached copy when offline), cache-first
// for everything else (icons/manifest rarely change).
//
// The fetch() below previously had no explicit cache mode, which meant it
// inherited the request's default caching behavior - the browser's own HTTP
// cache (a completely separate layer from this file's Cache Storage API
// usage) could silently satisfy it with a stale locally-cached response
// without a real network round-trip, if index.html was served with any
// Cache-Control/ETag headers that let the browser consider a cached copy
// still "fresh". That made this *look* network-first in the code while
// actually still serving stale HTML on some hosts/browsers - a real device
// could sit on an old build indefinitely despite CACHE_VERSION bumps and
// despite this code appearing to always hit the network. `cache: 'reload'`
// forces the browser to bypass its HTTP cache and actually ask the network
// for a fresh copy (still storing/validating against that cache for future
// conditional requests), while the .catch() below still falls back to the
// Cache Storage copy exactly as before when genuinely offline.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const isCoreDoc = event.request.mode === 'navigate' || event.request.url.endsWith('index.html');

    if (isCoreDoc) {
        event.respondWith(
            fetch(event.request, { cache: 'reload' })
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(event.request).then((r) => r || caches.match('./index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
