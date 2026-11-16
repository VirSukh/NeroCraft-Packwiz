// Zaino di Backpacked (MrCrayfish), al posto di Sophisticated Backpacks.
// Lo zaino e' uno solo (backpacked:backpack) e si crafta con la ricetta originale
// (cuoio + ferro + filo) gia' in era 1; e' anche ricompensa della quest ferro_e_rame.
// Non ci sono livelli da craftare: lo zaino cresce sbloccando slot e alloggiamenti
// dei potenziamenti con i gettoni backpacked:unlock_token, che non hanno ricette e
// si ottengono solo uccidendo i boss (vedi gettoni_zaino.js; costi nella config di Backpacked).
// La vecchia rimozione dell'omega di Sophisticated Storage non serve piu': la ricetta non esiste.

ServerEvents.recipes(event => {
  // Nessuna ricetta da aggiungere o togliere: il gettone non ha ricette nella mod.
})
