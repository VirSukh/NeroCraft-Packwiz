// Tooltip di progressione: spiegano in JEI (e nell'inventario) perché un oggetto
// non si crafta subito. Una riga per oggetto bloccato dagli script di progressione:
//   - progressione_main.js, progressione_razzi.js  (cancelli dei boss di Cataclysm)
//   - progressione_zaini.js, gettoni_zaino.js (Backpacked), progressione_waystones.js, progressione_aerei.js
//   - colonia_ricette.js, colonia_ricette_avanzate.js, ae2colonies_gating.js, progressione_ae2.js
//   - kubejs/data/kubejs/crafterrecipes/**  (oggetti fatti solo dalla colonia)
// Se cambia una ricetta in quegli script, va aggiornata anche la riga qui.
//
// API KubeJS 7 (verificata nel jar kubejs-neoforge-2101.7.2):
//   ItemEvents.modifyTooltips(event => event.add(<ingrediente>, [<Component>, ...]))
// L'ingrediente può essere un id o una lista di id.

// Nomi delle ere (CLAUDE.md, quests/era_1_fondazione.json). – = trattino lungo
const ERE = {
    1: 'Era 1 – Fondazione',
    2: 'Era 2 – Vapore',
    3: 'Era 3 – Elettricità',
    4: 'Era 4 – Era digitale',
    5: 'Era 5 – Spazio'
};

// "Si sblocca nell'Era N – Nome"
const sbloccaEra = n => Text.gold("Si sblocca nell'" + ERE[n]);

// Componenti e veicoli d'acciaio: gli script li collocano tra l'era 2 e l'era 3
const sbloccaAcciaio = () => Text.gold("Si sblocca con l'acciaio (Era 2–3)");

// "Richiede: <drop> (<boss>)" con i nomi tradotti dalla lingua del client
const richiedeBoss = (chiaveDrop, chiaveBoss) => Text.gray('Richiede: ')
    .append(Text.gold(Text.translate(chiaveDrop)))
    .append(Text.gray(' ('))
    .append(Text.red(Text.translate(chiaveBoss)))
    .append(Text.gray(')'));

// "Richiede: <oggetto della colonia> (<edificio> della colonia)"
const richiedeColonia = (nome, edificio) => Text.gray('Richiede: ')
    .append(Text.gold(nome))
    .append(Text.gray(' (' + edificio + ' della colonia)'));

// "Prodotto dal <edificio> della colonia (livello N)"
const prodottoColonia = (edificio, livello) =>
    Text.gold('Prodotto dal ' + edificio + ' della colonia (livello ' + livello + ')');

const nessunBanco = () => Text.gray('Nessuna ricetta da banco');

ItemEvents.modifyTooltips(event => {

    // ------------------------------------------------------------------
    // 1. OGGETTI DELLA COLONIA (crafterrecipes di MineColonies)
    // ------------------------------------------------------------------
    // blacksmith/sigillo_gilda_ingegneri.json: nessun min-building-level -> livello 1
    event.add('kubejs:sigillo_gilda_ingegneri', [prodottoColonia('Fabbro', 1), nessunBanco()]);
    // mechanic/nucleo_meccanico_colonia.json: min-building-level 3
    event.add('kubejs:nucleo_meccanico_colonia', [prodottoColonia('Meccanico', 3), nessunBanco()]);
    // sawmill/telaio_strutturale_rinforzato.json: min-building-level 2
    event.add('kubejs:telaio_strutturale_rinforzato', [prodottoColonia('Falegname', 2), nessunBanco()]);
    // stonemason/pannello_termoisolante_composito.json: min-building-level 3
    event.add('kubejs:pannello_termoisolante_composito', [prodottoColonia('Tagliapietre', 3), nessunBanco()]);

    // ------------------------------------------------------------------
    // 2. MACCHINE CHE RICHIEDONO GLI OGGETTI DELLA COLONIA
    // ------------------------------------------------------------------
    // colonia_ricette.js: caldaia di bronzo = cancello dell'era 1
    event.add('modern_industrialization:bronze_boiler', [
        Text.gold("Cancello dell'" + ERE[1]),
        richiedeColonia('Sigillo della Gilda degli Ingegneri', 'Fabbro')
    ]);
    // colonia_ricette_avanzate.js
    event.add('modern_industrialization:advanced_machine_casing', [
        richiedeColonia('Telaio Strutturale Rinforzato', 'Falegname')
    ]);
    event.add('modern_industrialization:highly_advanced_machine_casing', [
        richiedeColonia('Pannello Termoisolante Composito', 'Tagliapietre')
    ]);
    // ae2colonies_gating.js
    event.add('ae2colonies:me_architects_cutter', [
        sbloccaEra(4),
        richiedeColonia('Pannello Termoisolante Composito', 'Tagliapietre')
    ]);

    // ------------------------------------------------------------------
    // 3. CANCELLI DEI BOSS DI CATACLYSM (progressione_main.js, progressione_razzi.js)
    // ------------------------------------------------------------------
    event.add('modern_industrialization:electric_blast_furnace', [
        sbloccaEra(3),
        richiedeBoss('item.cataclysm.ignitium_ingot', 'entity.cataclysm.ignis')
    ]);
    // progressione_ae2.js: l'Inscriber chiede il circuito elettronico (alluminio -> EBF)
    event.add('ae2:inscriber', [
        sbloccaEra(3),
        Text.gray('Richiede: ').append(Text.gold('Circuito Elettronico')).append(Text.gray(' (Modern Industrialization)'))
    ]);
    event.add(['ae2:logic_processor', 'ae2:calculation_processor', 'ae2:engineering_processor'], [
        Text.gray("Si fa solo con l'Inscriber")
    ]);
    event.add('ae2:controller', [
        sbloccaEra(4),
        richiedeBoss('item.cataclysm.monstrous_horn', 'entity.cataclysm.netherite_monstrosity'),
        richiedeColonia('Nucleo di Processo Meccanico', 'Meccanico')
    ]);
    event.add('ad_astra:tier_1_rocket', [
        sbloccaEra(5),
        richiedeBoss('item.cataclysm.witherite_ingot', 'entity.cataclysm.the_harbinger'),
        Text.gray("Si assembla nell'Assemblatore di Modern Industrialization")
    ]);
    event.add('ad_astra:tier_2_rocket', [
        sbloccaEra(5),
        richiedeBoss('item.cataclysm.tidal_claws', 'entity.cataclysm.the_leviathan')
    ]);
    event.add('ad_astra:tier_3_rocket', [
        sbloccaEra(5),
        richiedeBoss('item.cataclysm.remnant_skull', 'entity.cataclysm.ancient_remnant')
    ]);
    event.add('ad_astra:tier_4_rocket', [
        sbloccaEra(5),
        richiedeBoss('item.cataclysm.cursium_ingot', 'entity.cataclysm.maledictus')
    ]);

    // ------------------------------------------------------------------
    // 4. ZAINI (progressione_zaini.js, gettoni_zaino.js): Backpacked, uno zaino solo
    // ------------------------------------------------------------------
    event.add('backpacked:backpack', [Text.gray('Gli slot e gli alloggiamenti si sbloccano con i gettoni dello zaino')]);
    event.add('backpacked:unlock_token', [
        Text.gold('Si ottiene uccidendo i boss'),
        Text.gray("3 alla prima uccisione di ogni boss, 1 alle successive"),
        Text.red("Legato a chi lo riceve: non si puo' scambiare")
    ]);

    // ------------------------------------------------------------------
    // 5. TELETRASPORTO E BUSSOLE (progressione_waystones.js)
    // ------------------------------------------------------------------
    // Oggetti con ricetta riscritta in bronzo
    event.add([
        'waystones:warp_stone',
        'waystones:warp_plate',
        'waystones:warp_scroll',
        'waystones:return_scroll',
        'waystones:portal_scroll'
    ], [sbloccaEra(2), Text.gray('Richiede: bronzo')]);

    // Waystone, sharestone e portstone: ricetta originale, ma tutte usano la pietra di curvatura
    event.add([
        'waystones:waystone',
        'waystones:mossy_waystone',
        'waystones:sandy_waystone',
        'waystones:blackstone_waystone',
        'waystones:deepslate_waystone',
        'waystones:end_stone_waystone',
        'waystones:mud_bricks_waystone',
        'waystones:prismarine_waystone',
        'waystones:purpur_waystone',
        'waystones:red_nether_bricks_waystone',
        'waystones:black_sharestone',
        'waystones:blue_sharestone',
        'waystones:brown_sharestone',
        'waystones:cyan_sharestone',
        'waystones:gray_sharestone',
        'waystones:green_sharestone',
        'waystones:light_blue_sharestone',
        'waystones:light_gray_sharestone',
        'waystones:lime_sharestone',
        'waystones:magenta_sharestone',
        'waystones:orange_sharestone',
        'waystones:pink_sharestone',
        'waystones:purple_sharestone',
        'waystones:red_sharestone',
        'waystones:yellow_sharestone',
        'waystones:black_portstone',
        'waystones:blue_portstone',
        'waystones:brown_portstone',
        'waystones:cyan_portstone',
        'waystones:gray_portstone',
        'waystones:green_portstone',
        'waystones:light_blue_portstone',
        'waystones:light_gray_portstone',
        'waystones:lime_portstone',
        'waystones:magenta_portstone',
        'waystones:orange_portstone',
        'waystones:pink_portstone',
        'waystones:purple_portstone',
        'waystones:red_portstone',
        'waystones:white_portstone',
        'waystones:yellow_portstone'
    ], [sbloccaEra(2), Text.gray('Richiede: Pietra di curvatura (bronzo)')]);

    event.add('explorerscompass:explorerscompass', [sbloccaAcciaio(), Text.gray("Richiede: piastre d'acciaio")]);

    // ------------------------------------------------------------------
    // 6. IMMERSIVE AIRCRAFT (progressione_aerei.js)
    // ------------------------------------------------------------------
    // Era 2: componenti di bronzo e veicoli che usano solo quelli
    event.add([
        'immersive_aircraft:hull',
        'immersive_aircraft:propeller',
        'immersive_aircraft:engine'
    ], [sbloccaEra(2), Text.gray('Richiede: bronzo')]);
    event.add([
        'immersive_aircraft:airship',
        'immersive_aircraft:gyrodyne',
        'immersive_aircraft:quadrocopter'
    ], [sbloccaEra(2), Text.gray('Richiede: componenti di bronzo')]);

    // Era 2-3: componenti d'acciaio e veicoli che li richiedono
    event.add([
        'immersive_aircraft:enhanced_propeller',
        'immersive_aircraft:steel_boiler',
        'immersive_aircraft:eco_engine',
        'immersive_aircraft:nether_engine',
        'immersive_aircraft:industrial_gears',
        'immersive_aircraft:hull_reinforcement',
        'immersive_aircraft:biplane',
        'immersive_aircraft:cargo_airship'
    ], [sbloccaAcciaio(), Text.gray("Richiede: piastre d'acciaio")]);
    event.add([
        'immersive_aircraft:bamboo_hopper',
        'immersive_aircraft:warship'
    ], [sbloccaAcciaio(), Text.gray("Richiede: componenti d'acciaio")]);
});
