ServerEvents.recipes(event => {
    
    // Il Sigillo NON ha piu' una ricetta da banco: lo produce solo il Fabbro della colonia.
    // Ricetta MineColonies: kubejs/data/kubejs/crafterrecipes/blacksmith/sigillo_gilda_ingegneri.json

    // Rimozione ricetta vanilla del Boiler a Vapore
    event.remove({ output: 'modern_industrialization:bronze_boiler' });
    
    // Nuova ricetta del Bronze Boiler vincolata al Sigillo
    event.shaped(
        'modern_industrialization:bronze_boiler',
        [
            'BBB',
            'BCB',
            'BXB'
        ],
        {
            B: 'modern_industrialization:bronze_plate',
            C: 'minecraft:copper_ingot',
            X: 'kubejs:sigillo_gilda_ingegneri' // Gate della Colonia
        }
    ).id('kubejs:progressione_bronze_boiler');

});