// Scherzi vocali tra amici: una voce (Diego) legge una frase su un giocatore,
// ma solo se quel giocatore e online. La sentono tutti e il testo compare in chat.
// Parte a caso ogni 20-40 minuti; gli operatori possono farla partire con /scherzo [bersaglio].
// Le frasi sono qui sotto, tra FRASI-INIZIO e FRASI-FINE (generate da tools/genera_scherzi.py).

// FRASI-INIZIO (generato da tools/genera_scherzi.py)
const SCHERZI_FRASI = [
 {
  "id": "bruno_01",
  "bersaglio": "bruno",
  "testo": "Bruno ha craftato aria e l'ha messa in vetrina."
 },
 {
  "id": "polpo_02",
  "bersaglio": "polpo",
  "testo": "Polpo muore di fame con 64 bistecche cotte nell'inventario."
 },
 {
  "id": "vitta_03",
  "bersaglio": "vitta",
  "testo": "Vitta ha messo il portale sotto casa... per la quinta volta."
 },
 {
  "id": "taddei_04",
  "bersaglio": "taddei",
  "testo": "Taddei ha rotto il server e ha pure negato."
 },
 {
  "id": "cima_05",
  "bersaglio": "cima",
  "testo": "Cima si è dato fuoco da solo e ha biasimato il lag."
 },
 {
  "id": "fabio_06",
  "bersaglio": "fabio",
  "testo": "Fabio ha craftato la legna con la legna. Poi l'ha celebrato."
 },
 {
  "id": "bruno_07",
  "bersaglio": "bruno",
  "testo": "Bruno: 0 diamanti, 100 scuse, 0 neuroni funzionanti."
 },
 {
  "id": "polpo_08",
  "bersaglio": "polpo",
  "testo": "Polpo ha perso il set full netherite... e ha chiesto \"dove l'ho messo?\"."
 },
 {
  "id": "vitta_09",
  "bersaglio": "vitta",
  "testo": "Vitta chiama ancora \"quella cosa viola\" l'AE2. Vergogna eterna."
 },
 {
  "id": "taddei_10",
  "bersaglio": "taddei",
  "testo": "Taddei ha afkato nel void e ha scritto \"ragazzi aiuto\"."
 },
 {
  "id": "cima_11",
  "bersaglio": "cima",
  "testo": "Cima è il motivo per cui esiste il backup, il rollback e la terapia."
 },
 {
  "id": "fabio_12",
  "bersaglio": "fabio",
  "testo": "Fabio ha messo la lava nel sistema idrico. Poi si è lamentato dell'acqua."
 },
 {
  "id": "bruno_13",
  "bersaglio": "bruno",
  "testo": "Bruno è il boss finale della stupidità. Difficoltà: disperazione."
 },
 {
  "id": "polpo_14",
  "bersaglio": "polpo",
  "testo": "Polpo ha craftato il secchio pieno di lava... e l'ha bevuto mentalmente."
 },
 {
  "id": "vitta_15",
  "bersaglio": "vitta",
  "testo": "Vitta ha usato il piccone di legno sul bedrock per mezz'ora."
 },
 {
  "id": "taddei_16",
  "bersaglio": "taddei",
  "testo": "Taddei ha dato fire aspect alla spada di legno. Genio tattico."
 },
 {
  "id": "cima_17",
  "bersaglio": "cima",
  "testo": "Cima ha costruito la base nel Nether di giorno. Poi è morto."
 },
 {
  "id": "fabio_18",
  "bersaglio": "fabio",
  "testo": "Fabio ha messo il letto nel void. Poi ha chiesto \"perché muoio?\"."
 },
 {
  "id": "bruno_19",
  "bersaglio": "bruno",
  "testo": "Bruno ha bisogno di un tutorial per aprire l'inventario."
 },
 {
  "id": "polpo_20",
  "bersaglio": "polpo",
  "testo": "Polpo ha più morti che blocchi piazzati in tutta la stagione."
 },
 {
  "id": "vitta_21",
  "bersaglio": "vitta",
  "testo": "Vitta è il motivo per cui i villager si suicidano a vista."
 },
 {
  "id": "taddei_22",
  "bersaglio": "taddei",
  "testo": "Taddei ha craftato l'incudine... e ci è cascato sopra due volte."
 },
 {
  "id": "cima_23",
  "bersaglio": "cima",
  "testo": "Cima ha messo il forno di legno. Poi si è sorpreso che bruciasse."
 },
 {
  "id": "fabio_24",
  "bersaglio": "fabio",
  "testo": "Fabio ha usato la pala per minare il diamante. E ha pure sorriso."
 },
 {
  "id": "bruno_25",
  "bersaglio": "bruno",
  "testo": "Bruno è così scarso che i creeper si suicidano per pietà."
 },
 {
  "id": "polpo_26",
  "bersaglio": "polpo",
  "testo": "Polpo ha craftato l'armatura di cuoio... al giorno 47."
 },
 {
  "id": "vitta_27",
  "bersaglio": "vitta",
  "testo": "Vitta ha messo la cassa singola e l'ha chiamata \"magazzino\"."
 },
 {
  "id": "taddei_28",
  "bersaglio": "taddei",
  "testo": "Taddei ha usato lo scudo... al contrario."
 },
 {
  "id": "cima_29",
  "bersaglio": "cima",
  "testo": "Cima ha minato il bedrock con le mani. Per \"vedere se funzionava\"."
 },
 {
  "id": "fabio_30",
  "bersaglio": "fabio",
  "testo": "Fabio ha craftato la spada di legno... con l'incudine."
 }
]
// FRASI-FINE

// Bersaglio -> parti del nome Minecraft che lo riconoscono (senza maiuscole, numeri ignorati)
const SCHERZI_NOMI = {
  polpo: ['polponanni', 'polpo'],
  taddei: ['blank'],
  bruno: ['brunelloz'],
  vitta: ['vitta'],
  cima: ['yamiswantt'],
  fabio: []            // nome Minecraft ancora da sapere
}
const SCHERZI_MIN_TICK = 20 * 60 * 20   // 20 minuti
const SCHERZI_MAX_TICK = 20 * 60 * 40   // 40 minuti

let scherziProssimo = -1
let scherziUltimo = ''

function scherziOnline(server) {
  const presenti = {}
  server.players.forEach(p => {
    const nome = String(p.username).toLowerCase().replace(/[0-9_]+$/, '')
    Object.keys(SCHERZI_NOMI).forEach(b => {
      SCHERZI_NOMI[b].forEach(parte => { if (nome.indexOf(parte) >= 0) presenti[b] = true })
    })
  })
  return presenti
}

function scherziEsegui(server, soloBersaglio) {
  const frasi = SCHERZI_FRASI
  const presenti = scherziOnline(server)
  let candidate = frasi.filter(f => presenti[f.bersaglio] && f.id !== scherziUltimo)
  if (soloBersaglio) candidate = candidate.filter(f => f.bersaglio === soloBersaglio)
  if (candidate.length === 0) return false
  const f = candidate[Math.floor(Math.random() * candidate.length)]
  scherziUltimo = f.id
  server.players.forEach(p => {
    server.runCommandSilent(`execute as ${p.username} at @s run playsound nerocraft:scherzi.${f.id} voice @s ~ ~ ~ 1 1`)
    p.tell(Text.of('Una voce misteriosa: ').darkGray().append(Text.of(f.testo).gray().italic()))
  })
  return true
}

ServerEvents.tick(event => {
  const server = event.server
  if (server.tickCount % 20 !== 0) return
  if (scherziProssimo < 0) {
    scherziProssimo = server.tickCount + SCHERZI_MIN_TICK + Math.floor(Math.random() * (SCHERZI_MAX_TICK - SCHERZI_MIN_TICK))
    return
  }
  if (server.tickCount >= scherziProssimo) {
    scherziProssimo = -1
    if (server.players.size() > 0) scherziEsegui(server, null)
  }
})

ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event
  event.register(Commands.literal('scherzo')
    .requires(s => s.hasPermission(2))
    .executes(ctx => {
      if (!scherziEsegui(ctx.source.server, null)) ctx.source.sendSystemMessage(Text.of('Nessun bersaglio online.'))
      return 1
    })
    .then(Commands.argument('bersaglio', Arguments.WORD.create(event))
      .executes(ctx => {
        const b = String(Arguments.WORD.getResult(ctx, 'bersaglio')).toLowerCase()
        if (!scherziEsegui(ctx.source.server, b)) ctx.source.sendSystemMessage(Text.of('Nessuna frase su "' + b + '" con lui online.'))
        return 1
      })))
})
