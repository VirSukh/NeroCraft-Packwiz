// Naturalist Delight 0.2: la sua ricetta di cottura delle strisce di carne selvatica
// usa il vecchio formato e non si carica. La rifacciamo con lo stesso risultato.
ServerEvents.recipes(event => {
  event.smelting('farmerd_naturalist_compat:bushmeat_strips_cooked', 'farmerd_naturalist_compat:bushmeat_strips').xp(0.35).id('kubejs:strisce_carne_selvatica_fornace')
  event.smoking('farmerd_naturalist_compat:bushmeat_strips_cooked', 'farmerd_naturalist_compat:bushmeat_strips').xp(0.35).id('kubejs:strisce_carne_selvatica_affumicatore')
  event.campfireCooking('farmerd_naturalist_compat:bushmeat_strips_cooked', 'farmerd_naturalist_compat:bushmeat_strips').xp(0.35).id('kubejs:strisce_carne_selvatica_falo')
})
