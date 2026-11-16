// Drop per livello (Dynamic Difficulty) legati alle ere della squadra.
//
// kubejs/data/dynamic_difficulty/loot_table/inject/level_based_drops.json aggiunge drop ai mob in
// base al loro livello, che sale con le ore di gioco e non con la tecnologia. Qui si tolgono dai
// drop dei mob normali i materiali delle ere successive finche' la squadra non vi e' entrata.
// Al posto dell'item tolto non si da' nulla.
//
// Le ere sono stage di SERVER di AStages (era_2..era_5, sbloccati da progressione_stage.js):
// si gioca in cooperativa con una sola colonia, quindi conta l'era della squadra intera.
//
// Esclusi: giocatori (la loro morte passa dallo stesso evento: non si toccano i loro oggetti) e
// boss (lista copiata da scaling_boss.js / gettoni_zaino.js: la loro loot propria resta intatta).
//
// API verificate nel jar kubejs-neoforge-2101.7.2-build.381:
// - EntityEvents.drops (ENTITY_DROPS, TargetedEventHandler per tipo di entita') ->
//   LivingEntityDropsKubeEvent: getEntity(), getSource(), getDrops() = List<ItemEntity>.
//   getDrops() e' una copia; KubeJSEntityEventHandler.livingDrops, dopo il post, svuota i drop
//   di NeoForge (LivingDropsEvent) e ci rimette la lista modificata: basta togliere da quella.
// - AStages 2.5.3: AStages.serverHasStage(String, MinecraftServer), come negli altri script.
//   AStages non registra loot condition (solo un global loot modifier con restrizioni proprie),
//   quindi non si puo' mettere una condizione per stage nel JSON della loot table.

const DROP_ERE_ITEM = {
  'ae2:certus_quartz_crystal': 3,
  'ae2:fluix_crystal': 3,
  'modern_industrialization:raw_titanium': 4,
  'modern_industrialization:raw_tungsten': 4,
  'modern_industrialization:raw_platinum': 4,
  'modern_industrialization:raw_iridium': 4,
  'ad_astra:raw_desh': 5,
  'ad_astra:raw_ostrum': 5,
  'ad_astra:raw_calorite': 5
}

const DROP_ERE_BOSS = [
  'cataclysm:ignis', 'cataclysm:the_harbinger', 'cataclysm:ender_guardian', 'cataclysm:the_leviathan',
  'cataclysm:maledictus', 'cataclysm:scylla', 'cataclysm:netherite_monstrosity', 'cataclysm:ancient_remnant',
  'twilightforest:naga', 'twilightforest:lich', 'twilightforest:hydra', 'twilightforest:knight_phantom',
  'twilightforest:minoshroom', 'twilightforest:alpha_yeti', 'twilightforest:snow_queen', 'twilightforest:ur_ghast',
  'bosses_of_mass_destruction:lich', 'bosses_of_mass_destruction:obsidilith', 'bosses_of_mass_destruction:gauntlet',
  'bosses_of_mass_destruction:void_blossom',
  'minecraft:wither', 'minecraft:ender_dragon', 'minecraft:warden',
  'born_in_chaos_v1:lord_pumpkinhead', 'born_in_chaos_v1:lord_pumpkinhead_withouta_horse'
]

// Era della squadra (1..5) dagli stage di server. Ere cumulative: basta lo stage piu' alto.
// In caso di errore di AStages si resta all'era 1 (i materiali avanzati vengono tolti:
// meglio un drop in meno che un cancello aggirato).
function dropEreEraSquadra(server) {
  let era = 1
  try {
    ;[5, 4, 3, 2].forEach(n => {
      if (era === 1 && AStages.serverHasStage('era_' + n, server) == true) era = n
    })
  } catch (err) {
    console.warn('[drop_livelli_ere] lettura stage AStages fallita: ' + err)
  }
  return era
}

// Toglie dalla lista dei drop gli item delle ere non ancora raggiunte (solo mob normali)
function dropEreFiltra(event) {
  const entity = event.getEntity()
  if (entity == null) return
  if (entity.isPlayer()) return
  const tipo = String(entity.type)
  if (DROP_ERE_BOSS.indexOf(tipo) >= 0) return
  const server = entity.server
  if (server == null) return

  const drops = event.getDrops()
  if (drops == null || drops.isEmpty()) return

  // Si legge l'era solo se tra i drop c'e' almeno un item legato a un'era
  let serve = false
  drops.forEach(d => {
    if (serve || d == null) return
    if (DROP_ERE_ITEM[String(d.item.id)]) serve = true
  })
  if (!serve) return

  const era = dropEreEraSquadra(server)
  drops.removeIf(d => {
    if (d == null) return false
    const richiesta = DROP_ERE_ITEM[String(d.item.id)]
    return richiesta != null && era < richiesta
  })
}

// Niente cancel: si modifica solo la lista. In caso di errore i drop restano invariati.
EntityEvents.drops(event => {
  try {
    dropEreFiltra(event)
  } catch (err) {
    console.warn('[drop_livelli_ere] filtro dei drop fallito: ' + err)
  }
})
