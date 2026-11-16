// L'acciaio si fa solo con la via a vapore di Modern Industrialization (era 2):
// forno a coke -> polvere d'acciaio grezza -> altoforno a vapore.
// L'altoforno di Ad Astra (etrionic blast furnace) è craftabile già in era 1 e con
// questa ricetta trasformava ferro + carbone in acciaio, saltando tutta l'era 2.
// Le altre ricette di Ad Astra che usano l'acciaio restano: AlmostUnified unifica
// l'acciaio su quello di Modern Industrialization.

ServerEvents.recipes(event => {
  event.remove({ id: 'ad_astra:alloying/steel_ingot_from_alloying_iron_ingot_and_barrier' })
})
