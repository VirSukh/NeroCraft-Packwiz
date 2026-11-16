// War 'n Nobility: /renounce fa diventare il vassallo NEMICO di tutte le colonie del suo signore.
// Giocando tutti nella stessa colonia sarebbe un disastro (guardie che attaccano un compagno),
// quindi il comando e bloccato.
ServerEvents.command(event => {
  const nome = String(event.commandName || '').toLowerCase()
  if (nome === 'renounce') {
    event.cancel()
    try {
      const p = event.parseResults.context.source.player
      if (p) p.tell(Text.of('/renounce è disattivato su NeroCraft: giocate tutti nella stessa colonia.').red())
    } catch (e) {}
    console.info('[blocca_renounce] /renounce bloccato')
  }
})
