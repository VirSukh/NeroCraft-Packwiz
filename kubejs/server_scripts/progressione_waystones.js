// Teletrasporto (Waystones) e bussole di esplorazione legati alle ere.
//
// - La pietra di curvatura (waystones:warp_stone) richiede piastre di bronzo di
//   Modern Industrialization (era 2 Vapore). Essendo ingrediente di tutte le
//   waystone, sharestone e portstone, blocca da sola l'intera rete: le ricette
//   di quei blocchi restano originali.
// - Gli oggetti di teletrasporto che non usano la warp_stone (piastra di
//   curvatura, pergamene di curvatura, di ritorno e del portale) passano a
//   materiali di bronzo dell'era 2.
// - Explorer's Compass: le ragnatele diventano piastre d'acciaio (era 2-3).
// - Nature's Compass resta con la ricetta originale (era 1).
//
// Le ricette originali si rimuovono per id: il filtro per output non e' affidabile.

ServerEvents.recipes(event => {
  // --- Rimozione delle ricette originali ---
  event.remove({ id: 'waystones:warp_stone' })
  event.remove({ id: 'waystones:warp_plate' })
  event.remove({ id: 'waystones:warp_scroll' })
  event.remove({ id: 'waystones:return_scroll' })
  event.remove({ id: 'waystones:portal_scroll' })
  event.remove({ id: 'explorerscompass:explorers_compass' })

  // --- Era 2: pietra di curvatura con piastre di bronzo ---
  event.shaped('waystones:warp_stone', [
    'ABA',
    'ECE',
    'ABA'
  ], {
    A: 'minecraft:amethyst_shard',
    B: 'modern_industrialization:bronze_plate',
    E: 'minecraft:ender_pearl',
    C: '#c:gems/emerald'
  }).id('kubejs:waystones_warp_stone_era2')

  // --- Era 2: piastra di curvatura con mattoni placcati di bronzo ---
  event.shaped('waystones:warp_plate', [
    'SWS',
    'WFW',
    'SWS'
  ], {
    S: 'modern_industrialization:bronze_plated_bricks',
    W: 'waystones:warp_dust',
    F: 'waystones:dormant_shard'
  }).id('kubejs:waystones_warp_plate_era2')

  // --- Era 2: pergamene, pepite di bronzo al posto di quelle d'oro ---
  event.shaped('3x waystones:warp_scroll', [
    'NIN',
    'NEN',
    'PPP'
  ], {
    N: 'modern_industrialization:bronze_nugget',
    I: 'minecraft:ink_sac',
    E: 'minecraft:ender_pearl',
    P: 'minecraft:paper'
  }).id('kubejs:waystones_warp_scroll_era2')

  event.shaped('3x waystones:return_scroll', [
    'NIN',
    'PPP'
  ], {
    N: 'modern_industrialization:bronze_nugget',
    I: 'minecraft:ink_sac',
    P: 'minecraft:paper'
  }).id('kubejs:waystones_return_scroll_era2')

  event.shaped('3x waystones:portal_scroll', [
    'SIS',
    'NEN',
    'PPP'
  ], {
    S: 'minecraft:amethyst_shard',
    I: 'minecraft:ink_sac',
    N: 'modern_industrialization:bronze_nugget',
    E: 'minecraft:ender_pearl',
    P: 'minecraft:paper'
  }).id('kubejs:waystones_portal_scroll_era2')

  // --- Era 2-3: Explorer's Compass con piastre d'acciaio al posto delle ragnatele ---
  event.shaped('explorerscompass:explorerscompass', [
    'PSP',
    'SCS',
    'PSP'
  ], {
    P: 'modern_industrialization:steel_plate',
    S: 'minecraft:cracked_stone_bricks',
    C: 'minecraft:compass'
  }).id('kubejs:explorers_compass_era2')
})
