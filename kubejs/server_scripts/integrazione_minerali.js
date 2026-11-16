// Minerali spaziali di Ad Astra nella filiera di Modern Industrialization:
// grezzo -> 2 polveri (Maceratore) -> lingotto (Electric Blast Furnace).
// Le polveri sono item custom registrati in startup_scripts/registrazione_items.js.
ServerEvents.tags('item', event => {
    ['desh', 'ostrum', 'calorite'].forEach(nome => {
        event.add(`c:dusts/${nome}`, `kubejs:${nome}_dust`);
        event.add('c:dusts', `kubejs:${nome}_dust`);
    });
});

ServerEvents.recipes(event => {

    const minerali_spaziali = [
        { name: 'desh', voltage: 8, time: 200 },     // Tier 1 Spaziale (Luna)
        { name: 'ostrum', voltage: 16, time: 300 },  // Tier 2 Spaziale (Marte)
        { name: 'calorite', voltage: 32, time: 400 } // Tier 3 Spaziale (Venere/Glacio)
    ];

    minerali_spaziali.forEach(minerale => {

        // Macerazione: minerale grezzo -> 2x polvere per raddoppio resa
        event.recipes.modern_industrialization.macerator(minerale.voltage, minerale.time)
            .itemIn(`#c:raw_materials/${minerale.name}`)
            .itemOut(`2x kubejs:${minerale.name}_dust`)
            .id(`kubejs:macerate_raw_${minerale.name}`);

        // Fusione: polvere -> lingotto (Electric Blast Furnace, tipo ricetta 'blast_furnace')
        event.recipes.modern_industrialization.blast_furnace(minerale.voltage, minerale.time)
            .itemIn(`kubejs:${minerale.name}_dust`)
            .itemOut(`ad_astra:${minerale.name}_ingot`)
            .id(`kubejs:smelt_dust_${minerale.name}`);
    });

});
