// Progressione a ere con gli stage di server di AStages (condivisi da tutta la squadra).
//
// Stage: era_2, era_3, era_4, era_5. Nessuno stage = era 1.
// Uno stage si sblocca la prima volta che QUALSIASI giocatore ottiene l'oggetto cancello
// (entra nell'inventario o viene craftato). Le ere sono cumulative: sbloccare l'era 4
// sblocca anche la 2 e la 3 se mancavano (per esempio un oggetto dato da un admin).
//
// API verificate nei jar in mods/:
// - AStages 2.5.3, binding 'AStages' = KubeJSServerUtils:
//   addStageToServer(String, MinecraftServer), removeStageFromServer(String, MinecraftServer),
//   serverHasStage(String, MinecraftServer).
//   NB: AStageEvents.added/removed sono eventi di GIOCATORE (StageAddedPlayerEvent): per gli
//   stage di server non scattano, quindi l'annuncio in chat lo fa direttamente questo script.
// - KubeJS 7.2: PlayerEvents.inventoryChanged accetta come target l'id dell'item
//   (supportsTarget(ItemEvents.TARGET)); ItemEvents.crafted come rinforzo.
// - FTB Ultimine 2101.1.15: FTBUltimine.setPermissionOverride(Predicate<Player>) è statico e
//   pubblico; FTBUltimine.canUltimine lo consulta e, se restituisce false, blockBroken lascia
//   rompere solo il blocco singolo (CanUltimineResult.NO_PERMISSION).

const STAGE_ERE = [
  { n: 2, stage: 'era_2', item: 'modern_industrialization:bronze_boiler', nome: 'Era 2 – Vapore' },
  { n: 3, stage: 'era_3', item: 'modern_industrialization:electric_blast_furnace', nome: 'Era 3 – Elettricità' },
  { n: 4, stage: 'era_4', item: 'ae2:controller', nome: 'Era 4 – Rete Digitale' },
  { n: 5, stage: 'era_5', item: 'ad_astra:tier_1_rocket', nome: 'Era 5 – Spazio' }
]

// true se lo stage di server è presente (errori di AStages => false, con avviso nel log)
function stageEraHa(server, stage) {
  try {
    return AStages.serverHasStage(stage, server) == true
  } catch (err) {
    console.warn('[progressione_stage] lettura stage ' + stage + ' fallita: ' + err)
    return false
  }
}

// Era corrente (1..5): la più alta tra quelle sbloccate
function stageEraCorrente(server) {
  let era = 1
  STAGE_ERE.forEach(e => {
    if (stageEraHa(server, e.stage)) era = e.n
  })
  return era
}

// Annuncio a tutti i giocatori collegati
function stageEraAnnuncia(server, e, chi) {
  server.tell(Text.of('La squadra è entrata nell\'' + e.nome + '!').gold().bold())
  if (chi) server.tell(Text.of('Merito di ' + chi + '.').yellow())
  if (e.n === 2) server.tell(Text.of('FTB Ultimine è ora attivo per tutti.').green())
}

// Sblocca l'era n e tutte le precedenti mancanti. Annuncia solo quelle nuove.
function stageEraSblocca(server, n, chi) {
  STAGE_ERE.forEach(e => {
    if (e.n > n) return
    if (stageEraHa(server, e.stage)) return
    AStages.addStageToServer(e.stage, server)
    console.info('[progressione_stage] sbloccato ' + e.stage + (chi ? ' da ' + chi : ''))
    stageEraAnnuncia(server, e, chi)
  })
}

// Imposta esattamente l'era n (solo per test da operatore): toglie le ere successive
function stageEraImposta(server, n) {
  STAGE_ERE.forEach(e => {
    if (e.n <= n) {
      if (!stageEraHa(server, e.stage)) AStages.addStageToServer(e.stage, server)
    } else if (stageEraHa(server, e.stage)) {
      AStages.removeStageFromServer(e.stage, server)
    }
  })
}

// --- Rilevamento degli oggetti cancello ---
STAGE_ERE.forEach(e => {
  PlayerEvents.inventoryChanged(e.item, event => {
    const player = event.player
    if (!player) return
    const server = player.server
    if (stageEraHa(server, e.stage)) return
    stageEraSblocca(server, e.n, player.username)
  })

  ItemEvents.crafted(e.item, event => {
    const player = event.player
    if (!player) return
    const server = player.server
    if (stageEraHa(server, e.stage)) return
    stageEraSblocca(server, e.n, player.username)
  })
})

// --- FTB Ultimine solo dall'era 2 ---
// Il predicato sostituisce quello di default (sempre true). FTB Ranks non è installato,
// quindi nessun'altra mod lo sovrascrive. A ogni /reload lo script lo reimposta.
try {
  Java.loadClass('dev.ftb.mods.ftbultimine.FTBUltimine').setPermissionOverride(player => {
    try {
      const server = player.server
      if (!server) return true
      return stageEraHa(server, 'era_2')
    } catch (err) {
      // In caso di errore non si blocca il gioco: Ultimine resta permesso
      return true
    }
  })
  console.info('[progressione_stage] FTB Ultimine vincolato allo stage era_2')
} catch (err) {
  console.error('[progressione_stage] impossibile vincolare FTB Ultimine: ' + err)
}

// Avviso al giocatore che tiene premuto il tasto Ultimine prima dell'era 2
// (il blocco singolo si rompe comunque; il messaggio spiega perché non scavano gli altri).
BlockEvents.broken(event => {
  const player = event.player
  if (!player) return
  if (stageEraHa(player.server, 'era_2')) return
  try {
    const dati = Java.loadClass('dev.ftb.mods.ftbultimine.FTBUltimine').getInstance().getOrCreatePlayerData(player)
    if (dati.isPressed()) {
      player.displayClientMessage(Text.of('Ultimine si sblocca nell\'Era 2 (Bronze Boiler).').red(), true)
    }
  } catch (err) {
    // solo un avviso: se fallisce non serve fare altro
  }
})

// --- Comando /era (operatori) ---
ServerEvents.commandRegistry(event => {
  const { commands: Commands } = event

  const mostra = ctx => {
    const server = ctx.source.server
    const sbloccate = []
    STAGE_ERE.forEach(e => {
      if (stageEraHa(server, e.stage)) sbloccate.push(e.nome)
    })
    ctx.source.sendSystemMessage(Text.of('Era corrente: ' + stageEraCorrente(server)).gold())
    ctx.source.sendSystemMessage(Text.of(sbloccate.length > 0
      ? 'Ere sbloccate: ' + sbloccate.join(', ')
      : 'Nessuna era sbloccata oltre l\'Era 1.').yellow())
    return 1
  }

  let imposta = Commands.literal('imposta')
  ;[1, 2, 3, 4, 5].forEach(n => {
    imposta = imposta.then(Commands.literal(String(n)).executes(ctx => {
      stageEraImposta(ctx.source.server, n)
      ctx.source.sendSystemMessage(Text.of('Era impostata a ' + n + '.').green())
      return 1
    }))
  })

  event.register(Commands.literal('era')
    .requires(s => s.hasPermission(2))
    .executes(mostra)
    .then(imposta))
})
