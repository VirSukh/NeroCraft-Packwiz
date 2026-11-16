// Progressione di Immersive Aircraft: nessun aereo prima dell'era 2 (Vapore, MI bronzo/vapore).
//
// RIEPILOGO (cosa richiede cosa)
// Componenti riscritti, ERA 2 - BRONZO (collo di bottiglia di tutti i veicoli):
//   - hull (scafo)        : tronchi + 3 bronze_plate (al posto dei lingotti di ferro)
//   - propeller (elica)   : 4 bronze_plate + bronze_rotor
//   - engine (motore)     : boiler + altoforno + 2 pistoni + 2 bronze_plate + bronze_gear
// Componenti riscritti, ERA 2-3 - ACCIAIO:
//   - enhanced_propeller  : propeller + 4 steel_plate
//   - steel_boiler        : boiler + altoforno + 6 steel_plate
//   - eco_engine          : engine + oro + slime + 3 steel_plate (al posto dei mattoni)
//   - nether_engine       : engine + netherite + blaze + magma + 3 steel_plate (al posto dei mattoni del Nether)
//   - industrial_gears    : steel_gear + steel_plate + rame + leva
//   - hull_reinforcement  : 3 hull + 6 steel_plate
// Veicoli:
//   - airship       (originale) : sail + hull + engine           -> BRONZO
//   - gyrodyne      (originale) : sail + hull + propeller        -> BRONZO
//   - quadrocopter  (originale) : engine + propeller + bambu     -> BRONZO
//   - biplane       (RISCRITTO) : 3 hull + engine + propeller + 4 steel_plate + steel_gear -> ACCIAIO
//   - bamboo_hopper (originale) : biplane + hull + engine        -> ACCIAIO (tramite il biplano)
//   - cargo_airship (RISCRITTO) : airship + hull + 2 casse + 2 steel_plate                 -> ACCIAIO
//   - warship       (originale) : cargo_airship + industrial_gears + engine + ... -> ACCIAIO
// Le altre ricette della mod (sail, boiler, gyroscope, armi, telescopio, ecc.) restano originali:
// senza un veicolo non servono a nulla.
ServerEvents.recipes(event => {

    // 1. RIMOZIONE DELLE ORIGINALI PER ID (presenti in registry_dump.json, sezione recipe_ids)
    const da_rimuovere = [
        'immersive_aircraft:hull',
        'immersive_aircraft:propeller',
        'immersive_aircraft:engine',
        'immersive_aircraft:enhanced_propeller',
        'immersive_aircraft:steel_boiler',
        'immersive_aircraft:eco_engine',
        'immersive_aircraft:nether_engine',
        'immersive_aircraft:industrial_gears',
        'immersive_aircraft:hull_reinforcement',
        'immersive_aircraft:biplane',
        'immersive_aircraft:cargo_airship'
    ];
    da_rimuovere.forEach(id => {
        event.remove({ id: id });
    });

    // 2. COMPONENTI DI BRONZO (era 2)

    // Scafo: il ferro diventa piastra di bronzo
    event.shaped('immersive_aircraft:hull', [
        'LLL',
        'BBB',
        'LLL'
    ], {
        L: '#minecraft:logs',
        B: 'modern_industrialization:bronze_plate'
    }).id('kubejs:aerei_hull_bronzo');

    // Elica: piastre e rotore di bronzo
    event.shaped('immersive_aircraft:propeller', [
        'BB ',
        ' R ',
        ' BB'
    ], {
        B: 'modern_industrialization:bronze_plate',
        R: 'modern_industrialization:bronze_rotor'
    }).id('kubejs:aerei_propeller_bronzo');

    // Motore: il ciottolo diventa piastra e ingranaggio di bronzo
    event.shaped('immersive_aircraft:engine', [
        ' G ',
        'PFP',
        'BIB'
    ], {
        G: 'modern_industrialization:bronze_gear',
        P: 'minecraft:piston',
        F: 'minecraft:blast_furnace',
        B: 'modern_industrialization:bronze_plate',
        I: 'immersive_aircraft:boiler'
    }).id('kubejs:aerei_engine_bronzo');

    // 3. COMPONENTI D'ACCIAIO (era 2-3)

    event.shaped('immersive_aircraft:enhanced_propeller', [
        'SS ',
        ' P ',
        ' SS'
    ], {
        S: 'modern_industrialization:steel_plate',
        P: 'immersive_aircraft:propeller'
    }).id('kubejs:aerei_enhanced_propeller_acciaio');

    event.shaped('immersive_aircraft:steel_boiler', [
        'SSS',
        'SBS',
        'SFS'
    ], {
        S: 'modern_industrialization:steel_plate',
        B: 'immersive_aircraft:boiler',
        F: 'minecraft:blast_furnace'
    }).id('kubejs:aerei_steel_boiler_acciaio');

    event.shaped('immersive_aircraft:eco_engine', [
        'CNC',
        'NEN',
        'SSS'
    ], {
        C: 'minecraft:slime_ball',
        N: 'minecraft:gold_ingot',
        E: 'immersive_aircraft:engine',
        S: 'modern_industrialization:steel_plate'
    }).id('kubejs:aerei_eco_engine_acciaio');

    event.shaped('immersive_aircraft:nether_engine', [
        'CNC',
        'BEB',
        'SSS'
    ], {
        C: 'minecraft:magma_cream',
        N: 'minecraft:netherite_ingot',
        B: 'minecraft:blaze_rod',
        E: 'immersive_aircraft:engine',
        S: 'modern_industrialization:steel_plate'
    }).id('kubejs:aerei_nether_engine_acciaio');

    event.shaped('immersive_aircraft:industrial_gears', [
        ' SS',
        'CLG',
        'CC '
    ], {
        S: 'modern_industrialization:steel_plate',
        G: 'modern_industrialization:steel_gear',
        C: 'minecraft:copper_ingot',
        L: 'minecraft:lever'
    }).id('kubejs:aerei_industrial_gears_acciaio');

    event.shaped('immersive_aircraft:hull_reinforcement', [
        'SSS',
        'HHH',
        'SSS'
    ], {
        S: 'modern_industrialization:steel_plate',
        H: 'immersive_aircraft:hull'
    }).id('kubejs:aerei_hull_reinforcement_acciaio');

    // 4. VEICOLI D'ACCIAIO

    // Biplano: alla ricetta originale (3 scafi, motore, elica) si aggiunge l'acciaio
    event.shaped('immersive_aircraft:biplane', [
        'SHS',
        'HEP',
        'SHG'
    ], {
        S: 'modern_industrialization:steel_plate',
        G: 'modern_industrialization:steel_gear',
        H: 'immersive_aircraft:hull',
        E: 'immersive_aircraft:engine',
        P: 'immersive_aircraft:propeller'
    }).id('kubejs:aerei_biplane_acciaio');

    // Dirigibile da carico: piastre d'acciaio nella riga vuota della ricetta originale
    event.shaped('immersive_aircraft:cargo_airship', [
        'CAC',
        'CHC',
        'S S'
    ], {
        A: 'immersive_aircraft:airship',
        C: 'minecraft:chest',
        H: 'immersive_aircraft:hull',
        S: 'modern_industrialization:steel_plate'
    }).id('kubejs:aerei_cargo_airship_acciaio');
});
