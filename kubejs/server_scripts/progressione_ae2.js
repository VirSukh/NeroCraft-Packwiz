// Progressione di AE2: niente rete digitale prima dell'Era 3 – Elettricità.
// Senza Inscriber non si fanno i processori (logic/calculation/engineering),
// e senza processori non si fanno terminali, drive, componenti delle celle,
// unità di crafting, pattern provider ne' le macchine di ExtendedAE.
//
// 1. Inscriber: ricetta originale (data/ae2/recipe/network/blocks/inscribers.json,
//    ferro + pistoni + rame) con un Circuito Elettronico di Modern Industrialization
//    al centro. Il circuito richiede piastre di alluminio -> EBF -> Era 3.
// 2. Aggiramento chiuso: Modern Industrialization assembla i processori
//    nell'Assembler (macchina elettrica LV, ottenibile prima dell'EBF) partendo
//    dai circuiti stampati, che il Packer (età del vapore) produce con le press
//    trovate nei meteoriti. Si tolgono le tre ricette di assemblaggio; le ricette
//    del Packer restano (danno solo componenti intermedi, serve comunque l'Inscriber).
ServerEvents.recipes(event => {

    // --- 1. Inscriber ---
    event.remove({ id: 'ae2:network/blocks/inscribers' });

    event.shaped('ae2:inscriber', [
        'aba',
        'cMa',
        'aba'
    ], {
        a: '#c:ingots/iron',
        b: 'minecraft:piston',
        c: '#c:ingots/copper',
        M: 'modern_industrialization:electronic_circuit' // Era 3: alluminio dall'EBF
    }).id('kubejs:progressione_ae2_inscriber');

    // --- 2. Processori AE2 dall'Assembler di Modern Industrialization ---
    [
        'modern_industrialization:compat/ae2/logic_processor',
        'modern_industrialization:compat/ae2/calculation_processor',
        'modern_industrialization:compat/ae2/engineering_processor'
    ].forEach(id => {
        event.remove({ id: id });
    });
});
