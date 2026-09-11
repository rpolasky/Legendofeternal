// Legend of Eternal - offline service worker
//
// The whole game is one self-contained HTML file (all art/audio/logic
// inline), so there's very little to cache: just that file plus the PWA
// shell (manifest + icons). Bump CACHE_VERSION any time you ship an
// updated index.html so installed devices pick up the new build instead
// of continuing to serve the stale cached copy.
const CACHE_VERSION = 'legend-of-eternal-v184';
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
    './assets/monsters/goblin_scout.png',
    './assets/monsters/goblin_warrior.png',
    './assets/monsters/orc_basic.png',
    './assets/monsters/orc_shaman.png',
    './assets/monsters/bandit.png',
    './assets/monsters/camel_rider.png',
    './assets/monsters/giant_rat.png',
    './assets/monsters/skeleton_new.png',
    './assets/monsters/zombie_new.png',
    './assets/monsters/ghoul_new.png',
    './assets/monsters/mummy_mob.png',
    './assets/monsters/wraith.png',
    './assets/monsters/shadow_stalker.png',
    './assets/monsters/djinn.png',
    './assets/monsters/sand_golem.png',

    // v175 reskins/additions - Free Foes by Low + Holder's Animated
    // Battlers (both free) + one dragon-pack boss reskin. See
    // MONSTER_NAME_IMAGE_OVERRIDE in index.html for exactly which monster
    // uses which of these.
    './assets/monsters/goblin_ff.png',
    './assets/monsters/skeleton_ff.png',
    './assets/monsters/wolf_ff.png',
    './assets/monsters/giant_rat_ff.png',
    './assets/monsters/zombie_ff.png',
    './assets/monsters/slime_ff.png',
    './assets/monsters/djinn_holder.png',
    './assets/monsters/hobgob_holder.png',
    './assets/monsters/ancient_dragon_new.png',
    './assets/monsters/ice_demon_dragon.png',

    // v179 - real animated battler sheets for the same six reskins above
    // (Free Foes' actual RPG Maker MV/MZ format sheets, not the single
    // frame placeholders). Those single-frame files stay in the cache
    // list too, deliberately - they're the automatic fallback if a sheet
    // somehow fails to load.
    './assets/monsters/goblin_sheet.png',
    './assets/monsters/skeleton_sheet.png',
    './assets/monsters/wolf_sheet.png',
    './assets/monsters/giant_rat_sheet.png',
    './assets/monsters/zombie_sheet.png',
    './assets/monsters/slime_sheet.png',
    './assets/heroes/warrior.png',
    './assets/heroes/mage.png',
    './assets/heroes/paladin.png',

    // v176 - real animated battle sprites (Holder's Animated Battlers,
    // free) for the battle-screen avatar specifically. Separate from the
    // three walk-cycle sheets above, which stay in use for the overworld/
    // menu/spell-detail portraits.
    './assets/heroes/warrior_battler.png',
    './assets/heroes/mage_battler.png',
    './assets/heroes/paladin_battler.png',

    // v178 - layered weapon sheets (same free pack), so the actor
    // actually appears to be holding/swinging their weapon in battle.
    './assets/heroes/warrior_weapon.png',
    './assets/heroes/warrior_weapon_above.png',
    './assets/heroes/mage_weapon.png',
    './assets/heroes/mage_weapon_above.png',
    './assets/heroes/paladin_weapon.png',
    './assets/heroes/paladin_weapon_above.png',
    './assets/npcs/oratio.png',

    // v182 - real walking-sprite NPCs (Low's free 8-directional
    //     character sheets) for the generic town/world-map NPC pool.
    './assets/npcs_walkers/npc_actor1-1.png',
    './assets/npcs_walkers/npc_actor1-2.png',
    './assets/npcs_walkers/npc_actor1-3.png',
    './assets/npcs_walkers/npc_actor1-4.png',
    './assets/npcs_walkers/npc_actor1-5.png',
    './assets/npcs_walkers/npc_actor1-6.png',
    './assets/npcs_walkers/npc_actor1-7.png',
    './assets/npcs_walkers/npc_actor1-8.png',
    './assets/npcs_walkers/npc_actor2-1.png',
    './assets/npcs_walkers/npc_actor2-2.png',
    './assets/npcs_walkers/npc_actor2-6.png',
    './assets/npcs_walkers/npc_actor2-8.png',
    './assets/npcs_walkers/npc_actor_2-4.png',
    './assets/npcs_walkers/npc_actor3-2.png',
    './assets/npcs_walkers/npc_actor3-6.png',
    './assets/npcs_walkers/npc_actor_3-5.png',
    './assets/npcs_walkers/npc_actor_3-7.png',
    './assets/npcs_walkers/npc_people1-3.png',
    './assets/npcs_walkers/npc_people1-4.png',
    './assets/npcs_walkers/npc_people1-5.png',
    './assets/npcs_walkers/npc_people1-6.png',
    './assets/npcs_walkers/npc_people1-7.png',
    './assets/npcs_walkers/npc_people1-8.png',
    './assets/npcs_walkers/npc_people2-2.png',
    './assets/npcs_walkers/npc_people2-6.png',
    './assets/npcs_walkers/npc_people2-8.png',
    './assets/npcs_walkers/npc_people3-7.png',
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
    './assets/ui/title-bg.jpg',

    // --- Additional world/town tile art referenced dynamically (built up
    // from name fragments in JS, so the earlier per-file grep audit missed
    // them) - added here after discovering the pre-cache list had fallen
    // behind several sessions' worth of new assets. ---
    './assets/tiles/ashlands_a1.png',
    './assets/tiles/ashlands_a2.png',
    './assets/tiles/ashlands_b.png',
    './assets/tiles/beach_a1.png',
    './assets/tiles/dd_castle_wall.png',
    './assets/tiles/dd_crystal.png',
    './assets/tiles/dd_rubble_strip.png',
    './assets/tiles/dead_tree.png',
    './assets/tiles/desert_palm.png',
    './assets/tiles/desert_rockspike.png',
    './assets/tiles/dt2_axe.png',
    './assets/tiles/dt2_cave.png',
    './assets/tiles/dt2_sword.png',
    './assets/tiles/forest_trees.png',
    './assets/town/village_bridge.png',
    './assets/town/village_church_full.png',
    './assets/town/village_fence.png',
    './assets/town/village_grass.png',
    './assets/town/village_house1_full.png',
    './assets/town/village_house2_full.png',
    './assets/town/village_tree.png',
    './assets/town/village_wallband1.png',
    './assets/town/village_wallband2.png',

    // --- Battle backdrops ---
    './assets/battle/bg_desert.jpg',
    './assets/battle/bg_dungeon.jpg',
    './assets/battle/bg_grass.jpg',
    './assets/battle/bg_volcanic.jpg',

    // --- Dual Tech / Limit Break name-card banners (see DUAL_TECH_PAIRS/
    // LIMIT_BREAK_BANNER_COLORS in index.html) ---
    './assets/battle/dualtech_blade_spellfire.png',
    './assets/battle/dualtech_twin_blades_dawn.png',
    './assets/battle/dualtech_hymn_storm.png',
    './assets/battle/limitbreak_banner.png',

    // --- Shop screen backdrops ---
    './assets/shops/shop.jpg',
    './assets/shops/combine_shop.jpg',
    './assets/shops/hall.jpg',

    // --- Character-screen (Equipment tab) backdrops ---
    './assets/equipment/warrior.jpg',
    './assets/equipment/mage.jpg',
    './assets/equipment/paladin.jpg',
    './assets/equipment/party_bg.jpg',
    './assets/equipment/scroll.jpg',

    // --- JRPG dialogue scene: portrait art (heroes, named NPCs, generic
    // townsfolk archetypes, story bosses) ---
    './assets/dialogue/portraits/warrior.png',
    './assets/dialogue/portraits/mage.png',
    './assets/dialogue/portraits/paladin.png',
    './assets/dialogue/portraits/king.png',
    './assets/dialogue/portraits/queen_seraphina.png',
    './assets/dialogue/portraits/wren.png',
    './assets/dialogue/portraits/master_aldous.png',
    './assets/dialogue/portraits/nessa.png',
    './assets/dialogue/portraits/mora.png',
    './assets/dialogue/portraits/sable.png',
    './assets/dialogue/portraits/guildmaster.png',
    './assets/dialogue/portraits/merchant.png',
    './assets/dialogue/portraits/villager.png',
    './assets/dialogue/portraits/blacksmith.png',
    './assets/dialogue/portraits/wizard.png',
    './assets/dialogue/portraits/explorer.png',
    './assets/dialogue/portraits/soldier.png',
    './assets/dialogue/portraits/elder.png',
    './assets/dialogue/portraits/priest.png',
    './assets/dialogue/portraits/bard.png',
    './assets/dialogue/portraits/goblinking.png',
    './assets/dialogue/portraits/dreadknight.png',
    './assets/dialogue/portraits/mummylord.png',
    './assets/dialogue/portraits/voraxis.png',

    // --- JRPG dialogue scene: 16:9 backdrops ---
    './assets/dialogue/bg/brighthollow_castle.jpg',
    './assets/dialogue/bg/brighthollow_courtyard.jpg',
    './assets/dialogue/bg/guild_hall.jpg',
    './assets/dialogue/bg/temple.jpg',
    './assets/dialogue/bg/library.jpg',
    './assets/dialogue/bg/wizard_tower.jpg',
    './assets/dialogue/bg/town.jpg',
    './assets/dialogue/bg/whispering_woods.jpg',
    './assets/dialogue/bg/garden_shrine.jpg',
    './assets/dialogue/bg/forest_shrine.jpg',
    './assets/dialogue/bg/shop_interior.jpg',

    // --- Treasure reveal popup art ---
    './assets/treasure/chest_reveal.png',
    './assets/treasure/vault_reveal.png',

    // --- Real licensed music/SFX (replaces procedural chiptune for these
    // cues; overworld/town/dungeon loops and the two battle themes are all
    // real audio files now, plus one victory/save chime) ---
    './assets/audio/overworld.mp3',
    './assets/audio/town.mp3',
    './assets/audio/dungeon.mp3',
    './assets/audio/battle.mp3',
    './assets/audio/boss.mp3',
    './assets/audio/victory.mp3',

    // --- Pre-generated Kokoro neural-voice lines (see
    //     voice_batch_generator.html) - every static dialogue line that
    //     got baked into a real audio file, so first-ever offline play
    //     doesn't depend on having heard a given line online first. ---
    './assets/voices/elder/5p6qhy.wav',
    './assets/voices/elder/7dtfjw.wav',
    './assets/voices/elder/l8iu4j.wav',
    './assets/voices/soldier/qa4xbw.wav',
    './assets/voices/soldier/1yb43c8.wav',
    './assets/voices/soldier/1ecsnu0.wav',
    './assets/voices/soldier/1mev6gd.wav',
    './assets/voices/soldier/11p6wx9.wav',
    './assets/voices/soldier/s7j39y.wav',
    './assets/voices/soldier/1kcy8g7.wav',
    './assets/voices/soldier/1xt6of6.wav',
    './assets/voices/soldier/1a31gg1.wav',
    './assets/voices/wizard/1ya0bmt.wav',
    './assets/voices/wizard/1b4nv3g.wav',
    './assets/voices/wizard/1rtp9s4.wav',
    './assets/voices/merchant/438mmv.wav',
    './assets/voices/merchant/1z0egn9.wav',
    './assets/voices/merchant/ktj1j5.wav',
    './assets/voices/priest/bt0vzf.wav',
    './assets/voices/priest/1457uq9.wav',
    './assets/voices/priest/1akw6jw.wav',
    './assets/voices/villager/jjhyz5.wav',
    './assets/voices/villager/1yr1071.wav',
    './assets/voices/villager/130h1je.wav',
    './assets/voices/elder/6y1kv7.wav',
    './assets/voices/elder/1tjtzer.wav',
    './assets/voices/elder/wk71vn.wav',
    './assets/voices/villager/1uixzm9.wav',
    './assets/voices/villager/1srf65n.wav',
    './assets/voices/villager/1ss9t36.wav',
    './assets/voices/soldier/15tj62s.wav',
    './assets/voices/soldier/mwoi5d.wav',
    './assets/voices/soldier/n22zol.wav',
    './assets/voices/villager/1b77761.wav',
    './assets/voices/villager/1gdgtgg.wav',
    './assets/voices/villager/14mh0fr.wav',
    './assets/voices/wizard/s9vlfi.wav',
    './assets/voices/wizard/1sv8iy9.wav',
    './assets/voices/wizard/1xy0qwt.wav',
    './assets/voices/soldier/szjyue.wav',
    './assets/voices/soldier/iihckk.wav',
    './assets/voices/soldier/xmajnf.wav',
    './assets/voices/wizard/1fabnrk.wav',
    './assets/voices/wizard/1fdnq4w.wav',
    './assets/voices/wizard/1rvpvn4.wav',
    './assets/voices/wizard/wvj8be.wav',
    './assets/voices/wizard/1k3of5u.wav',
    './assets/voices/wizard/16ohr3d.wav',
    './assets/voices/wizard/fv31p3.wav',
    './assets/voices/wizard/1cft956.wav',
    './assets/voices/wizard/2chib5.wav',
    './assets/voices/wizard/1bu5b4o.wav',
    './assets/voices/wizard/248bf5.wav',
    './assets/voices/wizard/drq65k.wav',
    './assets/voices/wizard/f0k2oh.wav',
    './assets/voices/wizard/1ftv5w7.wav',
    './assets/voices/wizard/1vescog.wav',
    './assets/voices/wizard/a87gy9.wav',
    './assets/voices/wizard/1j23t33.wav',
    './assets/voices/wizard/4mw7rs.wav',
    './assets/voices/wizard/1g1mwno.wav',
];

self.addEventListener('install', (event) => {
    // cache.addAll() is all-or-nothing - if even one URL in CORE_ASSETS
    // 404s (a typo, a renamed folder, an asset that hasn't been pushed
    // yet), the ENTIRE install fails silently and nothing at all gets
    // pre-cached, not just the one bad entry. With this list now spanning
    // many sessions' worth of additions, caching each asset individually
    // (and just warning + moving on for whichever one fails) means one bad
    // path degrades gracefully instead of taking offline support down
    // with it - a failed entry still works fine online via the normal
    // fetch handler below, it just won't be pre-cached for offline use.
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => Promise.allSettled(
                CORE_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn('[SW] Failed to pre-cache (will still work online):', url, err);
                    })
                )
            ))
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
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            // Not pre-cached (either it's genuinely new, or it was one of
            // the entries install's Promise.allSettled above had to skip) -
            // fetch it, then stash a copy for next time so a single online
            // visit is enough to make everything the player has actually
            // seen available offline afterward, rather than only ever
            // working offline for whatever happened to be in CORE_ASSETS
            // at build time.
            return fetch(event.request).then((response) => {
                if (response && response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
                }
                return response;
            });
        })
    );
});
