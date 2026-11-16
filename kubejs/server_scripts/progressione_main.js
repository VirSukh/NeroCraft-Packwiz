ServerEvents.recipes(event => {
    
    // 1. RIMOZIONE DELLE RICETTE VANILLA DI TESTA
    const macchine_da_bloccare = [
        'modern_industrialization:electric_blast_furnace', // Gate Elettrico (Ignis)
        'ae2:controller',                                  // Gate Logistica (Netherite Monstrosity)
        'ad_astra:tier_1_rocket'                           // Gate Spaziale (The Harbinger)
    ];

    macchine_da_bloccare.forEach(macchina => {
        event.remove({ output: macchina });
    });

    // 2. FORNACE ELETTRICA (EBF) -> Drop di Ignis (Cataclysm)
    event.shaped(
        'modern_industrialization:electric_blast_furnace',
        [
            'ABA',
            'BCB',
            'ABA'
        ],
        {
            A: 'modern_industrialization:fire_clay_brick',
            B: 'modern_industrialization:steel_machine_casing',
            C: 'cataclysm:ignitium_ingot' // Drop fuso del boss Ignis nel Nether
        }
    ).id('kubejs:progressione_ebf');

    // 3. ME CONTROLLER (AE2) -> Drop della Netherite Monstrosity (Cataclysm) + Nucleo di Processo Meccanico (Colonia)
    event.shaped(
        'ae2:controller',
        [
            'ABA',
            'CDC',
            'AEA'
        ],
        {
            A: 'ae2:smooth_sky_stone_block',
            B: 'ae2:fluix_crystal',
            E: 'kubejs:nucleo_meccanico_colonia', // Nucleo del Meccanico della Colonia (Liv. 3)
            C: 'modern_industrialization:electronic_circuit',
            D: 'cataclysm:monstrous_horn' // Corno della Netherite Monstrosity
        }
    ).id('kubejs:progressione_ae2_controller');

    // 4. RAZZO TIER 1 -> Assemblatore Multiblock MI + Drop di The Harbinger (Cataclysm)
    event.recipes.modern_industrialization.assembler(8, 200) // 8 EU/t, 200 tick di processo
        .itemIn('ad_astra:engine_frame')
        .itemIn('4x modern_industrialization:steel_plate')
        .itemIn('4x ad_astra:rocket_fin')
        .itemIn('cataclysm:witherite_ingot') // Drop The Harbinger
        .itemOut('ad_astra:tier_1_rocket')
        .id('kubejs:progressione_razzo_tier_1');

});