// Spawn dei mob nuovi legati alle ere (report reports/mob_ostili_ai.json).
//
// Prima dell'era indicata lo spawn NATURALE di questi mob viene annullato. Uova, /summon,
// spawner, strutture, conversioni ed evocazioni (MOB_SUMMONED, es. la lanterna di Lord
// Pumpkinhead) restano permessi: si filtra solo per MobSpawnType NATURAL e CHUNK_GENERATION.
//
// Quale era conta: gli stage delle ere sono stage di SERVER di AStages (progressione_stage.js li
// sblocca per tutti la prima volta che un giocatore qualsiasi ottiene l'oggetto cancello).
// Si gioca in cooperativa con una sola colonia, quindi l'era e' della squadra intera: non si
// guarda il giocatore piu' vicino. Cosi' un giocatore rimasto indietro non trova un mondo
// "piu' facile" dei compagni e chi esplora da solo non sblocca i bruti prima del gruppo.
//
// API verificate nel jar kubejs-neoforge-2101.7.2-build.381:
// - EntityEvents.checkSpawn (TargetedEventHandler per id di entita', hasResult) e' agganciato a
//   NeoForge FinalizeSpawnEvent. event.cancel() => setSpawnCancelled(true) + setCanceled(true):
//   il mob non entra nel mondo. Il listener KubeJS scatta solo se il livello e' un ServerLevel.
// - CheckLivingEntitySpawnKubeEvent.getType() restituisce la MobSpawnType; getLevel() il livello.
// - AStages.serverHasStage(String, MinecraftServer) come in progressione_stage.js.
// Gli spawn naturali dei mostri avvengono solo nel tick (NATURAL); CHUNK_GENERATION e' incluso
// per sicurezza ma con un WorldGenRegion il listener di KubeJS non viene nemmeno chiamato.

const SPAWN_ERE_MOB = [
  // Mutants and Zombies: bruti
  { id: 'mutantszombies:zombie_brute', era: 2 },
  { id: 'mutantszombies:mutant_brute', era: 3 },
  // Born in Chaos: miniboss
  { id: 'born_in_chaos_v1:supreme_bonescaller', era: 2 },
  { id: 'born_in_chaos_v1:lifestealer', era: 2 },
  { id: 'born_in_chaos_v1:mother_spider', era: 2 },
  { id: 'born_in_chaos_v1:fallen_chaos_knight', era: 2 },
  { id: 'born_in_chaos_v1:dire_hound_leader', era: 2 },
  { id: 'born_in_chaos_v1:nightmare_stalker', era: 2 },
  { id: 'born_in_chaos_v1:missioner', era: 2 },
  { id: 'born_in_chaos_v1:krampus', era: 2 },
  { id: 'born_in_chaos_v1:sir_pumpkinhead', era: 2 },
  // Lord Pumpkinhead non ha spawn naturale (si evoca): la voce e' qui solo per coerenza
  { id: 'born_in_chaos_v1:lord_pumpkinhead', era: 2 }
]

const SPAWN_ERE_TIPI_NATURALI = ['NATURAL', 'CHUNK_GENERATION']

// true se la squadra (stage di server) ha raggiunto l'era n. Era 1 = sempre.
// In caso di errore di AStages si lascia spawnare (meglio un mob in piu' che un mondo rotto).
function spawnEreRaggiunta(server, n) {
  if (n <= 1) return true
  try {
    for (let k = n; k <= 5; k++) {
      if (AStages.serverHasStage('era_' + k, server) == true) return true
    }
    return false
  } catch (err) {
    console.warn('[spawn_ere] lettura stage AStages fallita: ' + err)
    return true
  }
}

function spawnEreTipo(event) {
  try {
    const t = event.getType()
    if (t == null) return ''
    return String(t.name ? t.name() : t)
  } catch (err) {
    return ''
  }
}

// true se lo spawn va annullato. Ogni errore => false (si lascia spawnare).
function spawnEreDaBloccare(event, voce) {
  try {
    const tipo = spawnEreTipo(event)
    if (SPAWN_ERE_TIPI_NATURALI.indexOf(tipo) < 0) return false
    const level = event.getLevel()
    if (level == null || level.isClientSide()) return false
    const server = level.getServer()
    if (server == null) return false
    return !spawnEreRaggiunta(server, voce.era)
  } catch (err) {
    console.warn('[spawn_ere] controllo spawn di ' + voce.id + ' fallito: ' + err)
    return false
  }
}

// event.cancel() lancia EventExit (KubeEvent.cancel throws EventExit): va chiamato FUORI da
// qualsiasi try/catch, altrimenti il catch lo inghiotte e lo spawn non viene annullato.
SPAWN_ERE_MOB.forEach(voce => {
  EntityEvents.checkSpawn(voce.id, event => {
    if (spawnEreDaBloccare(event, voce)) event.cancel()
  })
})
