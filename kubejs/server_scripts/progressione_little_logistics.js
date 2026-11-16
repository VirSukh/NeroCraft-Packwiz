// Progressione di Little Logistics.
//
// Le ricette originali vengono sostituite con versioni che richiedono il
// rispettivo oggetto-cancello dell'era. In questo modo la ricetta non è
// aggirabile prima dello stage: il Bronze Boiler sblocca l'Era 2 e l'EBF
// sblocca l'Era 3. Nessun veicolo a energia, vacuum barge o chunk loader è
// incluso nella progressione.
ServerEvents.recipes(event => {
    // Little Logistics usa ricette vanilla con id nel proprio namespace.
    // La rimozione per output non è sufficiente per alcuni contenuti beta.
    event.remove({ id: 'littlelogistics:barge' });
    event.remove({ id: 'littlelogistics:barrel_barge' });
    event.remove({ id: 'littlelogistics:docking_station' });
    event.remove({ id: 'littlelogistics:fishing_barge' });
    event.remove({ id: 'littlelogistics:fluid_barge' });
    event.remove({ id: 'littlelogistics:seater_barge' });
    event.remove({ id: 'littlelogistics:tug' });
    event.remove({ id: 'littlelogistics:tug_route' });
    event.remove({ id: 'littlelogistics:vessel_detector' });
    event.remove({ id: 'littlelogistics:barrel_car' });
    event.remove({ id: 'littlelogistics:chest_car' });
    event.remove({ id: 'littlelogistics:conductors_wrench' });
    event.remove({ id: 'littlelogistics:fluid_car' });
    event.remove({ id: 'littlelogistics:locomotive_route' });
    event.remove({ id: 'littlelogistics:seater_car' });
    event.remove({ id: 'littlelogistics:steam_locomotive' });
    event.remove({ id: 'littlelogistics:switch_rail' });
    event.remove({ id: 'littlelogistics:tee_junction_rail' });
    event.remove({ id: 'littlelogistics:junction_rail' });
    event.remove({ id: 'littlelogistics:automatic_switch_rail' });
    event.remove({ id: 'littlelogistics:automatic_tee_junction_rail' });

    // ERA 2: acqua / vapore. B = gate dell'Era 2.
    event.shaped('littlelogistics:tug', [
        ' I ',
        'PFP',
        'IIG'
    ], {
        I: '#c:ingots/iron',
        P: 'minecraft:piston',
        F: 'minecraft:furnace',
        G: 'modern_industrialization:bronze_boiler'
    }).id('kubejs:little_logistics_era2_tug');

    event.shaped('littlelogistics:barge', [
        'SBS',
        'III',
        ' G '
    ], {
        S: 'minecraft:stick',
        B: 'minecraft:chest',
        I: '#c:ingots/iron',
        G: 'modern_industrialization:bronze_boiler'
    }).id('kubejs:little_logistics_era2_barge');

    event.shaped('littlelogistics:barrel_barge', [
        'SBS',
        'III',
        ' G '
    ], {
        S: 'minecraft:stick',
        B: 'minecraft:barrel',
        I: '#c:ingots/iron',
        G: 'modern_industrialization:bronze_boiler'
    }).id('kubejs:little_logistics_era2_barrel_barge');

    event.shaped('littlelogistics:fishing_barge', [
        'FFF',
        'III',
        ' B '
    ], {
        F: 'minecraft:fishing_rod',
        I: '#c:ingots/iron',
        B: 'modern_industrialization:bronze_boiler'
    }).id('kubejs:little_logistics_era2_fishing_barge');

    event.shaped('littlelogistics:fluid_barge', [
        'G G',
        ' G ',
        'IIB'
    ], {
        G: 'minecraft:glass',
        I: '#c:ingots/iron',
        B: 'modern_industrialization:bronze_boiler'
    }).id('kubejs:little_logistics_era2_fluid_barge');

    event.shaped('littlelogistics:seater_barge', [
        'SBS',
        'III',
        ' W '
    ], {
        S: '#minecraft:signs',
        B: 'modern_industrialization:bronze_boiler',
        I: '#c:ingots/iron',
        W: '#minecraft:wooden_stairs'
    }).id('kubejs:little_logistics_era2_seater_barge');

    event.shaped('littlelogistics:docking_station', [
        'I_I',
        'IBI',
        'I#I'
    ], {
        I: '#c:ingots/iron',
        _: '#c:stones',
        B: 'modern_industrialization:bronze_boiler',
        '#': 'littlelogistics:spring'
    }).id('kubejs:little_logistics_era2_docking_station');

    event.shaped('littlelogistics:tug_route', [
        ' R ',
        'NTN',
        ' B '
    ], {
        R: 'minecraft:redstone',
        N: '#c:nuggets/iron',
        T: 'littlelogistics:transmitter_component',
        B: 'modern_industrialization:bronze_boiler'
    }).id('kubejs:little_logistics_era2_tug_route');

    event.shaped('littlelogistics:vessel_detector', [
        'SBS',
        'STS',
        'SRS'
    ], {
        S: '#c:stones',
        B: 'modern_industrialization:bronze_boiler',
        T: 'littlelogistics:spring',
        R: 'minecraft:redstone_torch'
    }).id('kubejs:little_logistics_era2_vessel_detector');

    // ERA 3: ferrovia / elettricità. E = gate dell'Era 3.
    event.shaped('littlelogistics:seater_car', [
        '   ',
        'PPP',
        'I E'
    ], {
        P: '#minecraft:planks',
        I: '#c:ingots/iron',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_seater_car');

    event.shaped('littlelogistics:steam_locomotive', [
        ' I ',
        'PFE',
        'IWI'
    ], {
        I: '#c:ingots/iron',
        P: 'minecraft:piston',
        F: 'minecraft:furnace',
        E: 'modern_industrialization:electric_blast_furnace',
        W: 'littlelogistics:seater_car'
    }).id('kubejs:little_logistics_era3_steam_locomotive');

    event.shaped('littlelogistics:locomotive_route', [
        ' N ',
        'RER',
        'NTN'
    ], {
        N: '#c:nuggets/iron',
        R: 'minecraft:redstone',
        E: 'modern_industrialization:electric_blast_furnace',
        T: 'littlelogistics:transmitter_component'
    }).id('kubejs:little_logistics_era3_locomotive_route');

    event.shaped('littlelogistics:chest_car', [
        '   ',
        ' C ',
        ' WE'
    ], {
        C: 'minecraft:chest',
        W: 'littlelogistics:seater_car',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_chest_car');

    event.shaped('littlelogistics:barrel_car', [
        '   ',
        ' B ',
        'WE '
    ], {
        B: 'minecraft:barrel',
        W: 'littlelogistics:seater_car',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_barrel_car');

    event.shaped('littlelogistics:fluid_car', [
        'G G',
        ' G ',
        ' WE'
    ], {
        G: 'minecraft:glass',
        W: 'littlelogistics:seater_car',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_fluid_car');

    event.shaped('littlelogistics:switch_rail', [
        'R E',
        'RR ',
        'R  '
    ], {
        R: 'minecraft:rail',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_switch_rail');

    event.shaped('littlelogistics:tee_junction_rail', [
        'RRR',
        ' E '
    ], {
        R: 'minecraft:rail',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_tee_junction_rail');

    event.shaped('littlelogistics:junction_rail', [
        ' R ',
        'RER',
        ' R '
    ], {
        R: 'minecraft:rail',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_junction_rail');

    event.shaped('littlelogistics:automatic_switch_rail', [
        'RCE',
        '   ',
        '   '
    ], {
        R: 'littlelogistics:switch_rail',
        C: 'littlelogistics:receiver_component',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_automatic_switch_rail');

    event.shaped('littlelogistics:automatic_tee_junction_rail', [
        'RCE',
        '   ',
        '   '
    ], {
        R: 'littlelogistics:tee_junction_rail',
        C: 'littlelogistics:receiver_component',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_automatic_tee_junction_rail');

    event.shaped('littlelogistics:conductors_wrench', [
        '  S',
        'IR ',
        'IE '
    ], {
        I: '#c:ingots/iron',
        S: 'littlelogistics:spring',
        R: 'minecraft:red_dye',
        E: 'modern_industrialization:electric_blast_furnace'
    }).id('kubejs:little_logistics_era3_conductors_wrench');
});
