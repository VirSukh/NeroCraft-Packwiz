// casino_puntate.js - Limita cosa si puo' puntare nel casino' di MineVegas Casino (namespace roulettecasino).
//
// COME DECIDE LA MOD (letto dal bytecode di fr.minevegas.casino.CasinoBets, jar 1.1.2):
//   CasinoBets.accepts(stack):
//     1. lista "notBets" salvata nel mondo (Mano del croupier, SavedData roulettecasino_bet_rules) -> RIFIUTA
//     2. lista "bets" salvata nel mondo                                                         -> ACCETTA
//     3. altrimenti acceptsByTags(stack):
//        a. item nel tag #roulettecasino:not_bets  -> RIFIUTA (vince su tutto il resto)
//        b. item nel tag #roulettecasino:bets      -> ACCETTA (di default 18 item vanilla:
//           coal, copper, iron, gold, redstone, lapis, emerald, diamond, netherite e i loro blocchi)
//        c. item del namespace minecraft           -> RIFIUTA
//        d. "materiale automatico" (finishedWithBlock) -> ACCETTA. Un item di un'altra mod passa se
//           NON e' in una forma "grezza" (c:/forge: ores, raw_materials, nuggets, dusts e sottotag) e:
//           - sta in c:ingots/X o c:gems/X ed esiste un c:storage_blocks/X con almeno un item, oppure
//           - sta in c:storage_blocks/X ed esiste un c:ingots/X, c:gems/X o c:dusts/X, oppure
//           - sta in minecraft:coals e c:storage_blocks/<suo nome> esiste.
//           Riconosce anche i tag forge: e i vecchi nomi c:X_ingots / c:X_gems / c:X_blocks.
//        e. tutto il resto -> RIFIUTA
//   Le scelte fatte in gioco con la Mano del croupier vincono sui tag: questo script e' solo il default.
//
// COSA FA QUESTO SCRIPT:
//   - toglie da #roulettecasino:bets e mette in #roulettecasino:not_bets gli 11 item vanilla vietati
//     (blocchi, smeraldi, netherite);
//   - espande in id singoli (elenco esplicito TAG_MATERIALI, preso da registry_dump.json) i membri dei tag c:/forge: ingots, gems, dusts, storage_blocks,
//     raw_materials (tag padre e sottotag), dei vecchi nomi c:*_ingots/_gems/_blocks e di minecraft:coals,
//     e li mette in #roulettecasino:not_bets. Niente riferimenti #tag: altrimenti i 7 ammessi
//     (che stanno in c:ingots, c:gems ecc.) finirebbero esclusi anche loro.
//   Restano puntabili SOLO: carbone, lingotto di rame, ferro, oro, redstone, lapislazzuli, diamante.
//   Mettere in not_bets item che la mod non accetterebbe comunque (polveri, grezzi) non fa danni:
//   not_bets puo' solo togliere.

ServerEvents.tags('item', event => {
    const NOT_BETS = 'roulettecasino:not_bets';
    const BETS = 'roulettecasino:bets';

    const AMMESSI = [
        'minecraft:coal',
        'minecraft:copper_ingot',
        'minecraft:iron_ingot',
        'minecraft:gold_ingot',
        'minecraft:redstone',
        'minecraft:lapis_lazuli',
        'minecraft:diamond'
    ];

    const VANILLA_VIETATI = [
        'minecraft:diamond_block',
        'minecraft:netherite_ingot',
        'minecraft:netherite_block',
        'minecraft:emerald',
        'minecraft:emerald_block',
        'minecraft:coal_block',
        'minecraft:copper_block',
        'minecraft:iron_block',
        'minecraft:gold_block',
        'minecraft:redstone_block',
        'minecraft:lapis_block'
    ];

    // Forme di materiale che la mod (o il task) considera: tag padre "c:ingots" e sottotag "c:ingots/x".
    const FORME = ['ingots', 'gems', 'dusts', 'storage_blocks', 'raw_materials'];

    const ammessi = {};
    AMMESSI.forEach(id => { ammessi[id] = true; });

    // Decide se un tag (stringa "namespace:path") va espanso.
    const daEspandere = tagId => {
        const sep = tagId.indexOf(':');
        if (sep < 0) return false;
        const ns = tagId.substring(0, sep);
        const path = tagId.substring(sep + 1);
        if (tagId === 'minecraft:coals') return true;
        if (ns !== 'c' && ns !== 'forge') return false;
        let ok = false;
        FORME.forEach(forma => {
            if (path === forma || path.indexOf(forma + '/') === 0) ok = true;
        });
        // vecchi nomi senza slash: c:steel_ingots, c:ruby_gems, c:steel_blocks
        if (!ok && path.indexOf('/') < 0 && /_(ingots|gems|blocks)$/.test(path)
            && path !== 'glass_blocks' && path !== 'budding_blocks') {
            ok = true;
        }
        return ok;
    };

    // 1) Elenco ESPLICITO dei tag da espandere, preso da registry_dump.json (item_tags):
    //    c:/forge: ingots, gems, dusts, storage_blocks, raw_materials (padri e sottotag),
    //    vecchi nomi c:*_ingots/_gems/_blocks e minecraft:coals. In KubeJS 7 la mappa event.tags
    //    non si e' rivelata leggibile da Rhino, quindi l'elenco e' scritto qui.
    //    Se si aggiungono mod con nuovi materiali, rigenerare questo elenco dal dump.
    const TAG_MATERIALI = [
        'c:dusts',
        'c:dusts/aluminum',
        'c:dusts/annealed_copper',
        'c:dusts/antimony',
        'c:dusts/battery_alloy',
        'c:dusts/bauxite',
        'c:dusts/beryllium',
        'c:dusts/brick',
        'c:dusts/bronze',
        'c:dusts/cadmium',
        'c:dusts/calorite',
        'c:dusts/carbon',
        'c:dusts/certus_quartz',
        'c:dusts/chromium',
        'c:dusts/coal',
        'c:dusts/coke',
        'c:dusts/copper',
        'c:dusts/cupronickel',
        'c:dusts/desh',
        'c:dusts/diamond',
        'c:dusts/electrum',
        'c:dusts/emerald',
        'c:dusts/ender_pearl',
        'c:dusts/entro',
        'c:dusts/fire_clay',
        'c:dusts/fluix',
        'c:dusts/glowstone',
        'c:dusts/gold',
        'c:dusts/granite',
        'c:dusts/he_mox',
        'c:dusts/he_uranium',
        'c:dusts/invar',
        'c:dusts/iridium',
        'c:dusts/iron',
        'c:dusts/kanthal',
        'c:dusts/lapis',
        'c:dusts/le_mox',
        'c:dusts/le_uranium',
        'c:dusts/lead',
        'c:dusts/lignite_coal',
        'c:dusts/manganese',
        'c:dusts/monazite',
        'c:dusts/neodymium',
        'c:dusts/netherite',
        'c:dusts/nickel',
        'c:dusts/ostrum',
        'c:dusts/platinum',
        'c:dusts/plutonium',
        'c:dusts/quartz',
        'c:dusts/redstone',
        'c:dusts/ruby',
        'c:dusts/salt',
        'c:dusts/silicon',
        'c:dusts/silver',
        'c:dusts/sky_stone',
        'c:dusts/sodium',
        'c:dusts/soldering_alloy',
        'c:dusts/stainless_steel',
        'c:dusts/steel',
        'c:dusts/sulfur',
        'c:dusts/superconductor',
        'c:dusts/tin',
        'c:dusts/titanium',
        'c:dusts/tungsten',
        'c:dusts/uranium',
        'c:dusts/uranium_235',
        'c:dusts/uranium_238',
        'c:dusts/yttrium',
        'c:gems',
        'c:gems/amber_crystal',
        'c:gems/amethyst',
        'c:gems/carminite',
        'c:gems/certus_quartz',
        'c:gems/cobalt_crystal',
        'c:gems/diamond',
        'c:gems/ember_crystal',
        'c:gems/emerald',
        'c:gems/entro',
        'c:gems/fluix',
        'c:gems/frost_crystal',
        'c:gems/halo_crystal',
        'c:gems/lapis',
        'c:gems/lignite_coal',
        'c:gems/prismarine',
        'c:gems/quartz',
        'c:gems/rose_crystal',
        'c:gems/tide_crystal',
        'c:ingots',
        'c:ingots/abyssium',
        'c:ingots/albedon',
        'c:ingots/aluminum',
        'c:ingots/annealed_copper',
        'c:ingots/antimony',
        'c:ingots/aurorium',
        'c:ingots/azurane',
        'c:ingots/battery_alloy',
        'c:ingots/beryllium',
        'c:ingots/blastproof_alloy',
        'c:ingots/bronze',
        'c:ingots/cadmium',
        'c:ingots/calorite',
        'c:ingots/cassinium',
        'c:ingots/chasmal',
        'c:ingots/chromium',
        'c:ingots/copper',
        'c:ingots/cordium',
        'c:ingots/cupronickel',
        'c:ingots/desh',
        'c:ingots/electrum',
        'c:ingots/eonyx',
        'c:ingots/ferrolith',
        'c:ingots/fiery',
        'c:ingots/gold',
        'c:ingots/he_mox',
        'c:ingots/he_uranium',
        'c:ingots/helionite',
        'c:ingots/igneum',
        'c:ingots/infused_entro',
        'c:ingots/invar',
        'c:ingots/iridium',
        'c:ingots/iron',
        'c:ingots/ironwood',
        'c:ingots/kanthal',
        'c:ingots/knightmetal',
        'c:ingots/le_mox',
        'c:ingots/le_uranium',
        'c:ingots/lead',
        'c:ingots/mordrine',
        'c:ingots/mosaicon',
        'c:ingots/netherite',
        'c:ingots/nickel',
        'c:ingots/nitralis',
        'c:ingots/nivalum',
        'c:ingots/obscurex',
        'c:ingots/ostrum',
        'c:ingots/pallorite',
        'c:ingots/platinum',
        'c:ingots/plutonium',
        'c:ingots/shardex',
        'c:ingots/silicon',
        'c:ingots/silver',
        'c:ingots/sky_bronze',
        'c:ingots/sky_osmium',
        'c:ingots/sky_steel',
        'c:ingots/stainless_steel',
        'c:ingots/steel',
        'c:ingots/steeleaf',
        'c:ingots/stormium',
        'c:ingots/superconductor',
        'c:ingots/tempestine',
        'c:ingots/tholinar',
        'c:ingots/tin',
        'c:ingots/titanium',
        'c:ingots/tungsten',
        'c:ingots/umbrite',
        'c:ingots/uranium',
        'c:ingots/uranium_235',
        'c:ingots/uranium_238',
        'c:ingots/vesperine',
        'c:ingots/wrought_iron',
        'c:raw_materials',
        'c:raw_materials/abyssium',
        'c:raw_materials/albedon',
        'c:raw_materials/antimony',
        'c:raw_materials/aurorium',
        'c:raw_materials/azurane',
        'c:raw_materials/calorite',
        'c:raw_materials/cassinium',
        'c:raw_materials/chasmal',
        'c:raw_materials/copper',
        'c:raw_materials/cordium',
        'c:raw_materials/desh',
        'c:raw_materials/eonyx',
        'c:raw_materials/ferrolith',
        'c:raw_materials/gold',
        'c:raw_materials/helionite',
        'c:raw_materials/igneum',
        'c:raw_materials/iridium',
        'c:raw_materials/iron',
        'c:raw_materials/ironwood',
        'c:raw_materials/knightmetal',
        'c:raw_materials/lead',
        'c:raw_materials/mordrine',
        'c:raw_materials/mosaicon',
        'c:raw_materials/nickel',
        'c:raw_materials/nitralis',
        'c:raw_materials/nivalum',
        'c:raw_materials/obscurex',
        'c:raw_materials/ostrum',
        'c:raw_materials/pallorite',
        'c:raw_materials/platinum',
        'c:raw_materials/shardex',
        'c:raw_materials/silver',
        'c:raw_materials/stormium',
        'c:raw_materials/tempestine',
        'c:raw_materials/tholinar',
        'c:raw_materials/tin',
        'c:raw_materials/titanium',
        'c:raw_materials/tungsten',
        'c:raw_materials/umbrite',
        'c:raw_materials/uranium',
        'c:raw_materials/vesperine',
        'c:storage_blocks',
        'c:storage_blocks/abyssium',
        'c:storage_blocks/albedon',
        'c:storage_blocks/allium',
        'c:storage_blocks/aluminum',
        'c:storage_blocks/annealed_copper',
        'c:storage_blocks/antimony',
        'c:storage_blocks/arctic_fur',
        'c:storage_blocks/aurorium',
        'c:storage_blocks/azurane',
        'c:storage_blocks/battery_alloy',
        'c:storage_blocks/bauxite',
        'c:storage_blocks/beetroot',
        'c:storage_blocks/beryllium',
        'c:storage_blocks/bone_meal',
        'c:storage_blocks/bronze',
        'c:storage_blocks/bullet_pepper',
        'c:storage_blocks/cabbage',
        'c:storage_blocks/calorite',
        'c:storage_blocks/carminite',
        'c:storage_blocks/carrot',
        'c:storage_blocks/cassinium',
        'c:storage_blocks/certus_quartz',
        'c:storage_blocks/chasmal',
        'c:storage_blocks/chorus_fruit',
        'c:storage_blocks/chromium',
        'c:storage_blocks/coal',
        'c:storage_blocks/coke',
        'c:storage_blocks/copper',
        'c:storage_blocks/cordium',
        'c:storage_blocks/cupronickel',
        'c:storage_blocks/desh',
        'c:storage_blocks/diamond',
        'c:storage_blocks/dried_kelp',
        'c:storage_blocks/electrum',
        'c:storage_blocks/emerald',
        'c:storage_blocks/entro',
        'c:storage_blocks/eonyx',
        'c:storage_blocks/ferrolith',
        'c:storage_blocks/fiery',
        'c:storage_blocks/gold',
        'c:storage_blocks/he_mox',
        'c:storage_blocks/he_uranium',
        'c:storage_blocks/helionite',
        'c:storage_blocks/igneum',
        'c:storage_blocks/invar',
        'c:storage_blocks/iridium',
        'c:storage_blocks/iron',
        'c:storage_blocks/ironwood',
        'c:storage_blocks/kanthal',
        'c:storage_blocks/knightmetal',
        'c:storage_blocks/lapis',
        'c:storage_blocks/le_mox',
        'c:storage_blocks/le_uranium',
        'c:storage_blocks/lead',
        'c:storage_blocks/lignite_coal',
        'c:storage_blocks/monazite',
        'c:storage_blocks/mordrine',
        'c:storage_blocks/mosaicon',
        'c:storage_blocks/neodymium',
        'c:storage_blocks/netherite',
        'c:storage_blocks/nickel',
        'c:storage_blocks/nitralis',
        'c:storage_blocks/nivalum',
        'c:storage_blocks/obscurex',
        'c:storage_blocks/onion',
        'c:storage_blocks/ostrum',
        'c:storage_blocks/pallorite',
        'c:storage_blocks/pink_allium',
        'c:storage_blocks/platinum',
        'c:storage_blocks/plutonium',
        'c:storage_blocks/potato',
        'c:storage_blocks/raw_abyssium',
        'c:storage_blocks/raw_albedon',
        'c:storage_blocks/raw_antimony',
        'c:storage_blocks/raw_aurorium',
        'c:storage_blocks/raw_azurane',
        'c:storage_blocks/raw_calorite',
        'c:storage_blocks/raw_cassinium',
        'c:storage_blocks/raw_chasmal',
        'c:storage_blocks/raw_copper',
        'c:storage_blocks/raw_cordium',
        'c:storage_blocks/raw_desh',
        'c:storage_blocks/raw_eonyx',
        'c:storage_blocks/raw_ferrolith',
        'c:storage_blocks/raw_gold',
        'c:storage_blocks/raw_helionite',
        'c:storage_blocks/raw_igneum',
        'c:storage_blocks/raw_iridium',
        'c:storage_blocks/raw_iron',
        'c:storage_blocks/raw_lead',
        'c:storage_blocks/raw_mordrine',
        'c:storage_blocks/raw_mosaicon',
        'c:storage_blocks/raw_nickel',
        'c:storage_blocks/raw_nitralis',
        'c:storage_blocks/raw_nivalum',
        'c:storage_blocks/raw_obscurex',
        'c:storage_blocks/raw_ostrum',
        'c:storage_blocks/raw_pallorite',
        'c:storage_blocks/raw_platinum',
        'c:storage_blocks/raw_shardex',
        'c:storage_blocks/raw_silver',
        'c:storage_blocks/raw_stormium',
        'c:storage_blocks/raw_tempestine',
        'c:storage_blocks/raw_tholinar',
        'c:storage_blocks/raw_tin',
        'c:storage_blocks/raw_titanium',
        'c:storage_blocks/raw_tungsten',
        'c:storage_blocks/raw_umbrite',
        'c:storage_blocks/raw_uranium',
        'c:storage_blocks/raw_vesperine',
        'c:storage_blocks/redstone',
        'c:storage_blocks/rice',
        'c:storage_blocks/rice_panicle',
        'c:storage_blocks/rose',
        'c:storage_blocks/salt',
        'c:storage_blocks/shardex',
        'c:storage_blocks/silicon',
        'c:storage_blocks/silver',
        'c:storage_blocks/sky_bronze',
        'c:storage_blocks/sky_osmium',
        'c:storage_blocks/sky_steel',
        'c:storage_blocks/slime',
        'c:storage_blocks/sodium',
        'c:storage_blocks/soldering_alloy',
        'c:storage_blocks/stainless_steel',
        'c:storage_blocks/steel',
        'c:storage_blocks/steeleaf',
        'c:storage_blocks/stormium',
        'c:storage_blocks/straw',
        'c:storage_blocks/sulfur',
        'c:storage_blocks/tempestine',
        'c:storage_blocks/tholinar',
        'c:storage_blocks/tin',
        'c:storage_blocks/titanium',
        'c:storage_blocks/tomato',
        'c:storage_blocks/tungsten',
        'c:storage_blocks/umbrite',
        'c:storage_blocks/uranium',
        'c:storage_blocks/uranium_235',
        'c:storage_blocks/uranium_238',
        'c:storage_blocks/vesperine',
        'c:storage_blocks/wheat',
        'c:storage_blocks/white_allium',
        'c:storage_blocks/yttrium',
        'minecraft:coals'
    ];

    const vietati = {};
    VANILLA_VIETATI.forEach(idVanilla => { vietati[idVanilla] = true; });

    // Gli item vanilla sono gia' rifiutati dalla mod se non sono in bets:
    // si escludono solo quelli delle altre mod (piu' gli 11 vanilla gia' in elenco).
    const segnaMembro = membro => {
        const idMembro = String(membro);
        if (idMembro.indexOf('minecraft:') !== 0 && !ammessi[idMembro]) {
            vietati[idMembro] = true;
        }
    };

    // Rhino: una dichiarazione (const/let) dentro un blocco try di una funzione chiamata piu'
    // volte da' "redeclaration of var" dalla seconda chiamata. Qui nessuna dichiarazione sta nel try.
    const segnaTag = idsDelTag => {
        idsDelTag.forEach(membro => segnaMembro(membro));
        return 1;
    };

    let tagLetti = 0;
    TAG_MATERIALI.forEach(tagId => {
        if (!daEspandere(tagId)) return;
        try {
            tagLetti += segnaTag(event.get(tagId).getObjectIds());
        } catch (errTag) {
            console.error(`[casino_puntate] errore leggendo il tag ${tagId}: ${errTag}`);
        }
    });
    if (tagLetti === 0) {
        console.error('[casino_puntate] nessun tag letto: i materiali delle altre mod restano puntabili!');
    }

    const elenco = Object.keys(vietati).filter(id => !ammessi[id]);

    // 2) Gli 11 vanilla escono anche da bets (not_bets vince comunque, ma cosi' la lista e' pulita).
    VANILLA_VIETATI.forEach(id => {
        try {
            event.remove(BETS, id);
        } catch (err) {
            console.error(`[casino_puntate] impossibile togliere ${id} da ${BETS}: ${err}`);
        }
    });

    // 3) Tutto il resto in not_bets, un id alla volta per non perdere l'intero blocco per un errore.
    let aggiunti = 0;
    elenco.forEach(id => {
        try {
            event.add(NOT_BETS, id);
            aggiunti++;
        } catch (err) {
            console.error(`[casino_puntate] impossibile aggiungere ${id} a ${NOT_BETS}: ${err}`);
        }
    });

    // Sicurezza: nessuno dei 7 ammessi deve stare in not_bets (es. aggiunto da un datapack).
    AMMESSI.forEach(id => {
        try {
            event.remove(NOT_BETS, id);
        } catch (err) {
            console.error(`[casino_puntate] impossibile togliere ${id} da ${NOT_BETS}: ${err}`);
        }
    });

    console.info(`[casino_puntate] tag letti: ${tagLetti}, item esclusi dal casino': ${aggiunti}`);
});
