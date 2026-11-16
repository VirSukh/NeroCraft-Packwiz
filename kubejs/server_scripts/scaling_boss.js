// Scaling dei boss: diventano più forti a ogni uccisione e con le ere di progressione.
// Si gioca in cooperativa con una sola colonia, quindi il contatore è unico per tutto il server.
//
// Formule (k = uccisioni di quel tipo di boss da parte di giocatori, era = 1..5 dagli stage AStages):
//   vita  = vita base * (1 + min(0.15 * k, 1.50) + 0.20 * (era - 1))
//   danno = danno     * (1 + min(0.08 * k, 0.80) + 0.10 * (era - 1))
//
// Scelte tecniche (verificate sui jar):
// - La vita si cambia con setMaxHealth, che in KubeJS 7 chiama AttributeInstance.setBaseValue:
//   il valore base viene salvato nell'NBT del mob e sopravvive al salvataggio
//   (modifyAttribute invece usa un modificatore transitorio e si perderebbe).
// - EntityEvents.spawned scatta anche quando un chunk viene ricaricato: il calcolo si fa una sola
//   volta per entità, con un flag nel persistentData del boss.
// - Il danno si moltiplica in EntityEvents.beforeHurt guardando chi ha causato il danno
//   (source.getActual(), cioè getEntity() di Minecraft): così vale anche per proiettili, teschi del Wither e attacchi in
//   percentuale, e il moltiplicatore salvato nel boss resiste ai riavvii.
// - Le entità multiparte (Hydra, Ender Dragon) hanno le parti fuori dal registro delle entità:
//   qui si elencano solo le entità principali, quindi le parti non vengono mai toccate.

const BOSS_SCALATI = {
  // Cataclysm
  'cataclysm:ignis': 'Ignis',
  'cataclysm:the_harbinger': "L'Araldo",
  'cataclysm:ender_guardian': "Il Guardiano dell'End",
  'cataclysm:the_leviathan': 'Il Leviatano',
  'cataclysm:maledictus': 'Maledictus',
  'cataclysm:scylla': 'Scilla',
  'cataclysm:netherite_monstrosity': 'La Mostruosità di Netherite',
  'cataclysm:ancient_remnant': "Il Resto Antico",
  // Twilight Forest
  'twilightforest:naga': 'La Naga',
  'twilightforest:lich': 'Il Lich del Crepuscolo',
  'twilightforest:hydra': "L'Idra",
  'twilightforest:knight_phantom': 'Il Cavaliere Fantasma',
  'twilightforest:minoshroom': 'Il Minofungo',
  'twilightforest:alpha_yeti': "Lo Yeti Alfa",
  'twilightforest:snow_queen': 'La Regina delle Nevi',
  'twilightforest:ur_ghast': "L'Ur-Ghast",
  // Bosses of Mass Destruction
  'bosses_of_mass_destruction:lich': 'Il Lich della Notte',
  'bosses_of_mass_destruction:obsidilith': "L'Obsidilith",
  'bosses_of_mass_destruction:gauntlet': 'Il Guanto',
  'bosses_of_mass_destruction:void_blossom': 'Il Fiore del Vuoto',
  // Vanilla
  'minecraft:wither': 'Il Wither',
  'minecraft:ender_dragon': "L'Ender Dragon",
  'minecraft:warden': 'Il Warden',
  // Born in Chaos: a 30 di vita la fase a cavallo viene scartata (discard, niente morte) e
  // sostituita dalla fase a piedi, che e' quella che di solito muore. Entrambe si scalano.
  'born_in_chaos_v1:lord_pumpkinhead': 'Lord Zuccacapo',
  'born_in_chaos_v1:lord_pumpkinhead_withouta_horse': 'Lord Zuccacapo'
}

// Fasi dello stesso boss che condividono il contatore delle uccisioni
const BOSS_CONTATORE = {
  'born_in_chaos_v1:lord_pumpkinhead_withouta_horse': 'born_in_chaos_v1:lord_pumpkinhead'
}

function chiaveContatore(tipo) {
  return BOSS_CONTATORE[tipo] || tipo
}

const SCALING_FLAG = 'nerocraft_scaling_applicato'
const SCALING_DANNO = 'nerocraft_scaling_danno'
const SCALING_VITA_BASE = 'nerocraft_scaling_vita_base'
const PREFISSO_UCCISIONI = 'nerocraft_boss_uccisioni/'

// Holder degli attributi vanilla (net.minecraft è ammesso dal class filter di KubeJS 7)
const $Attributes = Java.loadClass('net.minecraft.world.entity.ai.attributes.Attributes')

// Uccisioni di un tipo di boss (persistentData del server, salvato con il mondo)
function uccisioniBoss(server, tipo) {
  return server.persistentData.getInt(PREFISSO_UCCISIONI + chiaveContatore(tipo))
}

// Era corrente dagli stage di server di AStages (era_2..era_5); senza stage si è nell'era 1.
// Firma verificata nel jar: KubeJSServerUtils.serverHasStage(String, MinecraftServer).
function eraCorrente(server) {
  let era = 1
  try {
    ;[5, 4, 3, 2].forEach(n => {
      if (era === 1 && AStages.serverHasStage('era_' + n, server)) era = n
    })
  } catch (err) {
    console.warn('[scaling_boss] lettura stage AStages fallita: ' + err)
  }
  return era
}

// true se c'è un giocatore vivo nella stessa dimensione entro 64 blocchi (stessa regola dei gettoni)
function giocatoreVicinoAlBoss(server, entity) {
  let vicino = false
  server.players.forEach(p => {
    if (vicino) return
    if (!p.isAlive()) return
    if (p.level !== entity.level) return
    if (p.distanceToSqr(entity) <= 64 * 64) vicino = true
  })
  return vicino
}

// Conta le uccisioni fatte da giocatori (anche con proiettili) e quelle fatte da cani, guardie
// della colonia o evocazioni mentre un giocatore è entro 64 blocchi: altrimenti basterebbe far
// finire il boss a un alleato per avere drop e gettoni senza che diventi più forte.
EntityEvents.death(event => {
  const entity = event.entity
  const tipo = String(entity.type)
  if (!BOSS_SCALATI[tipo]) return
  const server = entity.server
  if (server == null) return
  if (event.source.player == null && !giocatoreVicinoAlBoss(server, entity)) return
  const nuove = uccisioniBoss(server, tipo) + 1
  server.persistentData.putInt(PREFISSO_UCCISIONI + chiaveContatore(tipo), nuove)
  console.info('[scaling_boss] ' + tipo + ' ucciso, uccisioni totali: ' + nuove)
})

// Allo spawn (una sola volta per entità) si fissano vita e moltiplicatore di danno
EntityEvents.spawned(event => {
  const entity = event.entity
  const tipo = String(entity.type)
  const nome = BOSS_SCALATI[tipo]
  if (!nome) return
  if (event.level.isClientSide()) return
  if (!entity.isLiving()) return
  const dati = entity.persistentData
  if (dati.getBoolean(SCALING_FLAG)) return
  dati.putBoolean(SCALING_FLAG, true)

  const server = entity.server
  if (server == null) return
  const uccisioni = uccisioniBoss(server, tipo)
  const era = eraCorrente(server)

  const moltVita = 1 + Math.min(0.15 * uccisioni, 1.5) + 0.20 * (era - 1)
  const moltDanno = 1 + Math.min(0.08 * uccisioni, 0.8) + 0.10 * (era - 1)
  dati.putDouble(SCALING_DANNO, moltDanno)
  if (moltVita <= 1 && moltDanno <= 1) return

  // Valore base (senza modificatori), così i modificatori di altre mod non vengono moltiplicati
  const vitaBase = entity.getAttributeBaseValue($Attributes.MAX_HEALTH)
  dati.putDouble(SCALING_VITA_BASE, vitaBase)
  // setMaxHealth = setBaseValue sull'attributo vita massima: viene salvato nell'NBT
  entity.setMaxHealth(vitaBase * moltVita)
  entity.setHealth(entity.getMaxHealth())

  const testo = nome + ' è più forte: uccisioni ' + uccisioni + ', era ' + era +
    ' (vita x' + moltVita.toFixed(2) + ', danno x' + moltDanno.toFixed(2) + ')'
  server.tell(Text.of(testo).gold())
  console.info('[scaling_boss] ' + tipo + ': vita ' + vitaBase + ' -> ' + entity.getMaxHealth() +
    ', danno x' + moltDanno.toFixed(2))
})

// Moltiplica il danno inflitto da un boss scalato (attacchi diretti e proiettili)
EntityEvents.beforeHurt(event => {
  const attaccante = event.source.getActual() // KubeJS 7 rimappa getEntity() in getActual() (RemapForJS in DamageSourceMixin)
  if (attaccante == null) return
  if (!BOSS_SCALATI[String(attaccante.type)]) return
  const molt = attaccante.persistentData.getDouble(SCALING_DANNO)
  if (!(molt > 1)) return
  event.setDamage(event.getDamage() * molt)
})
