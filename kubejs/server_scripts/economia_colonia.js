// Economia della colonia: le tasse di War 'N Taxes (pagate in smeraldi) finanziano le
// costruzioni di ColonyAutopilot (pagate in ColonyBucks, Modalita Progressione): 16 smeraldi = 1 ColonyBuck.
// Cambio portato da 4:1 a 16:1 perche una sala di scambi coi villager produce smeraldi senza limite
// e a 4:1 rendeva gli edifici quasi gratuiti.
// Il tavolo ha 9 slot: la ricetta usa 1 blocco di smeraldo (9) + 7 smeraldi = esattamente 16.
// Giro: colonia ben gestita -> tasse in smeraldi -> ColonyBucks -> nuovi edifici -> piu tasse.
ServerEvents.recipes(event => {
  event.shapeless('colonyautopilot:colony_bucks', ['minecraft:emerald_block', '7x minecraft:emerald'])
    .id('kubejs:colony_bucks_da_smeraldi')
})
