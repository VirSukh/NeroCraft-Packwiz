// Biocombustibili: le bevande fermentate di Brewin' And Chewin' e il riso di Farmer's Delight
// entrano nella filiera di Modern Industrialization (etanolo -> biodiesel già previsto da MI).
// Nota: sostituisce la versione basata su Vinery/Bakery, rimosse dal modpack.
ServerEvents.recipes(event => {

    // Bevanda fermentata -> 250 mB di etanolo + boccale restituito (Centrifuga, 8 EU/t, 5 s)
    const bevande_fermentate = [
        'beer', 'mead', 'rice_wine', 'vodka', 'pale_jane',
        'saccharine_rum', 'red_rum', 'steel_toe_stout', 'strongroot_ale'
    ];

    bevande_fermentate.forEach(bevanda => {
        event.recipes.modern_industrialization.centrifuge(8, 100)
            .itemIn(`brewinandchewin:${bevanda}`)
            .fluidOut(Fluid.of('modern_industrialization:ethanol', 250))
            .itemOut('brewinandchewin:tankard')
            .id(`kubejs:etanolo_da_${bevanda}`);
    });

    // Riso + acqua -> soluzione zuccherina (Mixer, 2 EU/t, 5 s), base per la fermentazione MI
    event.recipes.modern_industrialization.mixer(2, 100)
        .itemIn('4x farmersdelight:rice')
        .fluidIn('1000x minecraft:water')
        .fluidOut(Fluid.of('modern_industrialization:sugar_solution', 1000))
        .id('kubejs:soluzione_zuccherina_da_riso');
});
