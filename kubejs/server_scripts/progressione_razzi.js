// Gate spaziale avanzato: i razzi Tier 2, 3 e 4 richiedono un drop dei boss di Cataclysm;
// i razzi Tier 5-10 di Ad Astra Planets un drop di Bosses of Mass Destruction o di Cataclysm.
// Le ricette restano quelle originali di Ad Astra (NASA Workbench, 14 slot):
// cambia solo il primo slot dei blocchi dello scafo (indice 1), sostituito dal drop.
ServerEvents.recipes(event => {

    // 1. RIMOZIONE DELLE RICETTE ORIGINALI (per output: copre anche eventuali alternative)
    const razzi_da_bloccare = [
        'ad_astra:tier_2_rocket', // Gate Leviathan
        'ad_astra:tier_3_rocket', // Gate Ancient Remnant
        'ad_astra:tier_4_rocket'  // Gate Maledictus
    ];

    razzi_da_bloccare.forEach(razzo => {
        event.remove({ output: razzo });
    });

    // Il filtro per output non aggancia il tipo di ricetta della NASA Workbench (verificato
    // sul server: le ricette originali restavano). Vanno rimosse per id, Tier 1 compreso.
    event.remove({ id: 'ad_astra:nasa_workbench/tier_1_rocket_from_nasa_workbench' });
    event.remove({ id: 'ad_astra:nasa_workbench/tier_2_rocket_from_nasa_workbench' });
    event.remove({ id: 'ad_astra:nasa_workbench/tier_3_rocket_from_nasa_workbench' });
    event.remove({ id: 'ad_astra:nasa_workbench/tier_4_rocket_from_nasa_workbench' });

    // Stessa struttura della ricetta originale di Ad Astra, con il drop al posto del primo blocco
    const ricettaRazzo = (output, blocchi, serbatoio, motore, drop) => {
        return {
            type: 'ad_astra:nasa_workbench',
            ingredients: [
                { item: 'ad_astra:rocket_nose_cone' },
                { item: drop },                     // slot sostituito: era un blocco dello scafo
                { tag: blocchi },
                { tag: blocchi },
                { tag: blocchi },
                { tag: blocchi },
                { tag: blocchi },
                { item: 'ad_astra:rocket_fin' },
                { item: serbatoio },
                { item: serbatoio },
                { item: 'ad_astra:rocket_fin' },
                { item: 'ad_astra:rocket_fin' },
                { item: motore },
                { item: 'ad_astra:rocket_fin' }
            ],
            result: {
                count: 1,
                id: output
            }
        };
    };

    // 2. RAZZO TIER 2 -> Drop del Leviathan (Cataclysm)
    event.custom(ricettaRazzo(
        'ad_astra:tier_2_rocket', 'ad_astra:desh_blocks', 'ad_astra:desh_tank', 'ad_astra:desh_engine',
        'cataclysm:tidal_claws'
    )).id('kubejs:progressione_razzo_tier_2');

    // 3. RAZZO TIER 3 -> Drop dell'Ancient Remnant (Cataclysm)
    event.custom(ricettaRazzo(
        'ad_astra:tier_3_rocket', 'ad_astra:ostrum_blocks', 'ad_astra:ostrum_tank', 'ad_astra:ostrum_engine',
        'cataclysm:remnant_skull'
    )).id('kubejs:progressione_razzo_tier_3');

    // 4. RAZZO TIER 4 -> Drop di Maledictus (Cataclysm)
    event.custom(ricettaRazzo(
        'ad_astra:tier_4_rocket', 'ad_astra:calorite_blocks', 'ad_astra:calorite_tank', 'ad_astra:calorite_engine',
        'cataclysm:cursium_ingot'
    )).id('kubejs:progressione_razzo_tier_4');

    // ------------------------------------------------------------------
    // RAZZI TIER 5-10 (Ad Astra Planets, modid adastraplanets)
    // Le ricette originali usano due banchi diversi della stessa mod:
    //   T5-T7  -> adastraplanets:advanced_nasa_workbench
    //   T8-T10 -> adastraplanets:stellar_nasa_workbench
    // Stessa disposizione a 14 slot della NASA Workbench di Ad Astra: anche qui
    // il drop del boss prende il posto del primo blocco dello scafo (indice 1).
    // ------------------------------------------------------------------

    // Rimozione delle originali per id (il filtro per output non aggancia questi tipi custom)
    // (scritte una per riga: il controllo degli id riconosce le rimozioni solo nella forma { id: '...' })
    event.remove({ id: 'adastraplanets:advanced_nasa_workbench/tier_5_rocket' });
    event.remove({ id: 'adastraplanets:advanced_nasa_workbench/tier_6_rocket' });
    event.remove({ id: 'adastraplanets:advanced_nasa_workbench/tier_7_rocket' });
    event.remove({ id: 'adastraplanets:stellar_nasa_workbench/tier_8_rocket' });
    event.remove({ id: 'adastraplanets:stellar_nasa_workbench/tier_9_rocket' });
    event.remove({ id: 'adastraplanets:stellar_nasa_workbench/tier_10_rocket' });

    // Ricetta dei razzi di Ad Astra Planets: ogni parte ha un materiale proprio
    // (ogiva, blocchi, alette, serbatoio, motore), quindi tutto e' parametrico.
    const ricettaRazzoPlanets = (tipo, output, ogiva, blocchi, aletta, serbatoio, motore, drop) => {
        return {
            type: tipo,
            ingredients: [
                { item: ogiva },
                { item: drop },                     // slot sostituito: era un blocco dello scafo
                { tag: blocchi },
                { tag: blocchi },
                { tag: blocchi },
                { tag: blocchi },
                { tag: blocchi },
                { item: aletta },
                { item: serbatoio },
                { item: serbatoio },
                { item: aletta },
                { item: aletta },
                { item: motore },
                { item: aletta }
            ],
            result: {
                count: 1,
                id: output
            }
        };
    };

    // 5. RAZZO TIER 5 -> Drop del Night Lich (Bosses of Mass Destruction)
    event.custom(ricettaRazzoPlanets(
        'adastraplanets:advanced_nasa_workbench', 'adastraplanets:tier_5_rocket',
        'adastraplanets:pallorite_nose_cone', 'c:storage_blocks/helionite', 'adastraplanets:umbrite_fin',
        'adastraplanets:umbrite_tank', 'adastraplanets:helionite_engine',
        'bosses_of_mass_destruction:ancient_anima'
    )).id('kubejs:razzo_t5');

    // 6. RAZZO TIER 6 -> Drop del Nether Gauntlet (Bosses of Mass Destruction)
    event.custom(ricettaRazzoPlanets(
        'adastraplanets:advanced_nasa_workbench', 'adastraplanets:tier_6_rocket',
        'adastraplanets:eonyx_nose_cone', 'c:storage_blocks/aurorium', 'adastraplanets:igneum_fin',
        'adastraplanets:abyssium_tank', 'adastraplanets:stormium_engine',
        'bosses_of_mass_destruction:blazing_eye'
    )).id('kubejs:razzo_t6');

    // 7. RAZZO TIER 7 -> Drop dell'Ender Guardian (Cataclysm)
    event.custom(ricettaRazzoPlanets(
        'adastraplanets:advanced_nasa_workbench', 'adastraplanets:tier_7_rocket',
        'adastraplanets:ferrolith_nose_cone', 'c:storage_blocks/cassinium', 'adastraplanets:vesperine_fin',
        'adastraplanets:nivalum_tank', 'adastraplanets:tholinar_engine',
        'cataclysm:gauntlet_of_guard'
    )).id('kubejs:razzo_t7');

    // 8. RAZZO TIER 8 -> Drop del Void Blossom (Bosses of Mass Destruction)
    event.custom(ricettaRazzoPlanets(
        'adastraplanets:stellar_nasa_workbench', 'adastraplanets:tier_8_rocket',
        'adastraplanets:mosaicon_nose_cone', 'c:storage_blocks/azurane', 'adastraplanets:obscurex_fin',
        'adastraplanets:chasmal_tank', 'adastraplanets:azurane_engine',
        'bosses_of_mass_destruction:void_thorn'
    )).id('kubejs:razzo_t8');

    // 9. RAZZO TIER 9 -> Drop dell'Obsidilith (Bosses of Mass Destruction)
    event.custom(ricettaRazzoPlanets(
        'adastraplanets:stellar_nasa_workbench', 'adastraplanets:tier_9_rocket',
        'adastraplanets:nitralis_nose_cone', 'c:storage_blocks/tempestine', 'adastraplanets:nitralis_fin',
        'adastraplanets:tempestine_tank', 'adastraplanets:tempestine_engine',
        'bosses_of_mass_destruction:obsidian_heart'
    )).id('kubejs:razzo_t9');

    // 10. RAZZO TIER 10 -> Drop di Scylla (Cataclysm)
    event.custom(ricettaRazzoPlanets(
        'adastraplanets:stellar_nasa_workbench', 'adastraplanets:tier_10_rocket',
        'adastraplanets:mordrine_nose_cone', 'c:storage_blocks/cordium', 'adastraplanets:mordrine_fin',
        'adastraplanets:cordium_tank', 'adastraplanets:cordium_engine',
        'cataclysm:essence_of_the_storm'
    )).id('kubejs:razzo_t10');

});
