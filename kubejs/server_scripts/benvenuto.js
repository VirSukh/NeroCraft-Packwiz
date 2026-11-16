// Kit di partenza di NeroCraft e regole del server per la cooperativa.
// Il kit si riceve una sola volta per giocatore (flag in persistentData).
// Cibo, torce e letto arrivano dalla prima quest ("benvenuto"), quindi qui non si ripetono.

const PAGINE_BENVENUTO = [
  '§5§lNeroCraft§r\n§8Colonia · Industria · Spazio§r\n\nBenvenuto, viaggiatore.\n\nQuesto libro ti spiega in breve come si gioca. Tienilo: puoi rileggerlo quando vuoi.',
  '§5§lSi gioca insieme§r\n\nC\'è una sola colonia ed è di tutti.\n\nDividetevi i compiti: chi esplora, chi costruisce, chi combatte e chi fa girare le macchine. Le quest avanzano per tutta la squadra.',
  '§5§lLe ere§r\n\n1. Fondazione\n2. Vapore\n3. Elettricità\n4. Era digitale\n5. Spazio\n\nMolti oggetti si sbloccano solo nell\'era giusta o dopo un boss: passa il mouse sopra un oggetto per sapere cosa serve.',
  '§5§lIl libro delle quest§r\n\nApri il libro delle quest per sapere sempre cosa fare. La prima quest ti regala cibo, torce e un letto.\n\nLa colonia viene fondata da sola attorno al Municipio: è la casa di tutti.',
  '§5§lAttenzione§r\n\nI mostri salgono di livello scendendo in profondità, con le ore di gioco e sui pianeti lontani.\n\nI boss diventano più forti ogni volta che li sconfiggete.\n\nSe muori lasci un cadavere con le tue cose: torna a prenderle.',
  '§5§lStrumenti utili§r\n\nJ  mappa\nB  punto di riferimento\nShift + clic destro a mani vuote: prendi in braccio casse e animali\n\nLa Bussola della Natura trova i biomi. Il sacco a pelo ti fa dormire lontano da casa.',
  '\n\n\n§8Che la colonia prosperi\ne le stelle vi attendano.§r\n\n\n§5NeroCraft§r'
]

// Stringa SNBT tra apici singoli
const snbt = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"

function libroBenvenuto() {
  const pagine = PAGINE_BENVENUTO.map(p => snbt(JSON.stringify({ text: p }))).join(',')
  return 'minecraft:written_book[minecraft:written_book_content={title:"Benvenuto in NeroCraft",author:"NeroCraft",pages:[' + pagine + ']}]'
}

PlayerEvents.loggedIn(event => {
  const player = event.player
  if (player.persistentData.getBoolean('nerocraft_kit')) return
  player.persistentData.putBoolean('nerocraft_kit', true)
  player.give(Item.of(libroBenvenuto()))
  player.give('ftbquests:book')
  player.give('naturescompass:naturescompass')
  player.give('comforts:sleeping_bag_purple')
  player.tell(Text.of('Benvenuto in NeroCraft! Leggi il libro di benvenuto.').darkPurple())
})

// Cooperativa: basta che dorma metà dei giocatori online per far passare la notte
ServerEvents.loaded(event => {
  event.server.runCommandSilent('gamerule playersSleepingPercentage 50')
})
