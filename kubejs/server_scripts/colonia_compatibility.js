// MineColonies Compatibility addon: il suo "ME Terminal for Colonist" collega magazzino e AE2,
// ma lo fa gia AE2Colonies (si agganciano agli stessi metodi del magazzino e del corriere).
// Per evitare doppioni e comportamenti strani, il terminale dell'addon non si crafta.
ServerEvents.recipes(event => {
  event.remove({ id: 'minecolonies_compatibility:crafting/citizen_terminal' })
})
