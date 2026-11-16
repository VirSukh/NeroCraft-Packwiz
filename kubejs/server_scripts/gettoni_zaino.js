// Gettoni dello zaino (Backpacked): backpacked:unlock_token non ha ricette, si ottiene solo dai boss.
// Slot, alloggiamenti dei potenziamenti e zaino indossabile si pagano con i gettoni (config di Backpacked).
//
// - Morte di un boss (lista copiata da scaling_boss.js): ogni giocatore vivo nella stessa dimensione
//   entro 64 blocchi riceve 3 gettoni alla prima uccisione di quel tipo di boss, 1 alle successive.
//   Conteggio nel persistentData del giocatore. Mai a terra: se l'inventario e' pieno i gettoni
//   restano in sospeso e vengono ridati appena c'e' spazio (controllo ogni 5 secondi e al login).
// - Ogni gettone e' legato al proprietario (custom data con l'UUID). Un gettone senza proprietario
//   (es. /give) si lega al primo giocatore che lo ha in inventario.
// - Il lancio di un gettone e' annullato e il gettone torna in inventario.
// - Un gettone di un altro giocatore viene tolto e restituito al proprietario; se e' offline resta
//   nel persistentData del server e gli viene ridato al login.
// Scritto in modo difensivo: valida non prova gli eventi a runtime.

const GETTONE_BOSS = [
  'cataclysm:ignis', 'cataclysm:the_harbinger', 'cataclysm:ender_guardian', 'cataclysm:the_leviathan',
  'cataclysm:maledictus', 'cataclysm:scylla', 'cataclysm:netherite_monstrosity', 'cataclysm:ancient_remnant',
  'twilightforest:naga', 'twilightforest:lich', 'twilightforest:hydra', 'twilightforest:knight_phantom',
  'twilightforest:minoshroom', 'twilightforest:alpha_yeti', 'twilightforest:snow_queen', 'twilightforest:ur_ghast',
  'bosses_of_mass_destruction:lich', 'bosses_of_mass_destruction:obsidilith', 'bosses_of_mass_destruction:gauntlet',
  'bosses_of_mass_destruction:void_blossom',
  'minecraft:wither', 'minecraft:ender_dragon', 'minecraft:warden',
  // Lord Pumpkinhead: due fasi (entita' diverse); muore una sola delle due, quindi niente doppio premio
  'born_in_chaos_v1:lord_pumpkinhead', 'born_in_chaos_v1:lord_pumpkinhead_withouta_horse'
]

// Fasi dello stesso boss: "prima uccisione" contata una volta sola
const GETTONE_CONTATORE = {
  'born_in_chaos_v1:lord_pumpkinhead_withouta_horse': 'born_in_chaos_v1:lord_pumpkinhead'
}

const GETTONE_ID = 'backpacked:unlock_token'
const GETTONE_CHIAVE = 'nerocraft_proprietario'
const GETTONE_NOME = 'nerocraft_proprietario_nome'
const GETTONE_UCCISIONI = 'nerocraft_gettoni_uccisioni/'
const GETTONE_PENDENTI = 'nerocraft_gettoni_pendenti'
const GETTONE_SERVER = 'nerocraft_gettoni_da_restituire'

const $DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
const $CustomData = Java.loadClass('net.minecraft.world.item.component.CustomData')
const $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')

function gettoneProprietario(stack) {
  try {
    const cd = stack.get($DataComponents.CUSTOM_DATA)
    if (cd == null) return null
    const tag = cd.copyTag()
    if (!tag.contains(GETTONE_CHIAVE)) return null
    return String(tag.getString(GETTONE_CHIAVE))
  } catch (err) {
    console.warn('[gettoni_zaino] lettura proprietario fallita: ' + err)
    return null
  }
}

function gettoneLega(stack, player) {
  let tag = new $CompoundTag()
  try {
    const cd = stack.get($DataComponents.CUSTOM_DATA)
    if (cd != null) tag = cd.copyTag()
  } catch (err) { }
  tag.putString(GETTONE_CHIAVE, String(player.uuid))
  tag.putString(GETTONE_NOME, String(player.username))
  stack.set($DataComponents.CUSTOM_DATA, $CustomData.of(tag))
}

// Prova a mettere n gettoni legati nell'inventario; restituisce quanti non ci stavano
function gettoneDai(player, n) {
  if (n <= 0) return 0
  try {
    const stack = Item.of(GETTONE_ID, n)
    gettoneLega(stack, player)
    player.inventory.add(stack)
    return stack.isEmpty() ? 0 : stack.getCount()
  } catch (err) {
    console.warn('[gettoni_zaino] consegna gettoni fallita: ' + err)
    return n
  }
}

function gettoneConsegna(player, n) {
  const avanzo = gettoneDai(player, n)
  if (avanzo > 0) {
    const dati = player.persistentData
    dati.putInt(GETTONE_PENDENTI, dati.getInt(GETTONE_PENDENTI) + avanzo)
    player.tell(Text.of('Inventario pieno: ' + avanzo + ' gettoni dello zaino ti saranno dati appena liberi spazio.').yellow())
  }
  return n - avanzo
}

function gettoneSvuotaPendenti(player) {
  const dati = player.persistentData
  const n = dati.getInt(GETTONE_PENDENTI)
  if (n <= 0) return
  const avanzo = gettoneDai(player, n)
  dati.putInt(GETTONE_PENDENTI, avanzo)
  if (avanzo < n) player.tell(Text.of('Hai ricevuto ' + (n - avanzo) + ' gettoni dello zaino in sospeso.').green())
}

function gettoneTrovaGiocatore(server, uuid) {
  let trovato = null
  server.players.forEach(p => { if (trovato == null && String(p.uuid) === uuid) trovato = p })
  return trovato
}

// Restituisce n gettoni al proprietario (online: inventario o pendenti; offline: dati del server)
function gettoneRestituisci(server, uuid, n) {
  const proprietario = gettoneTrovaGiocatore(server, uuid)
  if (proprietario != null) {
    gettoneConsegna(proprietario, n)
    proprietario.tell(Text.of('Ti sono tornati ' + n + ' gettoni dello zaino.').green())
    return
  }
  const dati = server.persistentData
  let tag = dati.getCompound(GETTONE_SERVER)
  tag.putInt(uuid, tag.getInt(uuid) + n)
  dati.put(GETTONE_SERVER, tag)
}

// 1. Morte di un boss
EntityEvents.death(event => {
  try {
    const boss = event.entity
    const tipo = String(boss.type)
    if (GETTONE_BOSS.indexOf(tipo) < 0) return
    const server = boss.server
    if (server == null) return
    const nomeBoss = boss.getDisplayName().getString()
    server.players.forEach(p => {
      if (!p.isAlive()) return
      if (p.level !== boss.level) return
      if (p.distanceToSqr(boss) > 64 * 64) return
      const dati = p.persistentData
      const chiave = GETTONE_UCCISIONI + (GETTONE_CONTATORE[tipo] || tipo)
      const uccisioni = dati.getInt(chiave)
      const n = uccisioni === 0 ? 3 : 1
      dati.putInt(chiave, uccisioni + 1)
      gettoneConsegna(p, n)
      p.tell(Text.of((uccisioni === 0 ? 'Prima vittoria contro ' : 'Vittoria contro ') + nomeBoss +
        ': ricevi ' + n + (n === 1 ? ' gettone' : ' gettoni') + ' dello zaino.').gold())
    })
  } catch (err) {
    console.warn('[gettoni_zaino] premio boss fallito: ' + err)
  }
})

// 2. Legame e restituzione al proprietario
PlayerEvents.inventoryChanged(event => {
  try {
    const stack = event.item
    if (stack == null || stack.isEmpty() || String(stack.id) !== GETTONE_ID) return
    const player = event.player
    const proprietario = gettoneProprietario(stack)
    if (proprietario == null) {
      gettoneLega(stack, player)
      return
    }
    if (proprietario === String(player.uuid)) return
    const n = stack.getCount()
    stack.setCount(0)
    gettoneRestituisci(player.server, proprietario, n)
    player.tell(Text.of('Quei gettoni dello zaino non sono tuoi: sono tornati al proprietario.').red())
  } catch (err) {
    console.warn('[gettoni_zaino] controllo inventario fallito: ' + err)
  }
})

// 3. Lancio annullato: il gettone torna in inventario
// NB: event.cancel() lancia EventExit (KubeEvent.cancel throws EventExit): deve stare FUORI dal
// try/catch, altrimenti il catch lo inghiotte, il lancio non e' annullato e il gettone si duplica.
ItemEvents.dropped(event => {
  let annulla = false
  try {
    const stack = event.item
    if (stack == null || String(stack.id) !== GETTONE_ID) return
    const player = event.player
    const copia = stack.copy()
    player.inventory.add(copia)
    if (!copia.isEmpty()) {
      const dati = player.persistentData
      dati.putInt(GETTONE_PENDENTI, dati.getInt(GETTONE_PENDENTI) + copia.getCount())
    }
    player.tell(Text.of('I gettoni dello zaino non si possono lanciare.').red())
    annulla = true
  } catch (err) {
    console.warn('[gettoni_zaino] annullamento lancio fallito: ' + err)
  }
  if (annulla) event.cancel()
})

// 4. Login: gettoni restituiti mentre era offline e gettoni in sospeso
PlayerEvents.loggedIn(event => {
  try {
    const player = event.player
    const uuid = String(player.uuid)
    const dati = player.server.persistentData
    const tag = dati.getCompound(GETTONE_SERVER)
    const n = tag.getInt(uuid)
    if (n > 0) {
      tag.remove(uuid)
      dati.put(GETTONE_SERVER, tag)
      player.persistentData.putInt(GETTONE_PENDENTI, player.persistentData.getInt(GETTONE_PENDENTI) + n)
      player.tell(Text.of('Mentre eri via ti sono stati restituiti ' + n + ' gettoni dello zaino.').green())
    }
    gettoneSvuotaPendenti(player)
  } catch (err) {
    console.warn('[gettoni_zaino] login fallito: ' + err)
  }
})

// 5. Ogni 5 secondi riprova a consegnare i gettoni in sospeso
PlayerEvents.tick(event => {
  const player = event.player
  if (player.age % 100 !== 0) return
  try {
    if (player.persistentData.getInt(GETTONE_PENDENTI) > 0) gettoneSvuotaPendenti(player)
  } catch (err) {
    console.warn('[gettoni_zaino] consegna in sospeso fallita: ' + err)
  }
})
