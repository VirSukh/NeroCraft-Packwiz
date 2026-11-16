// Gate del ME Architect's Cutter (AE2Colonies): richiede il Pannello Termoisolante
// del Tagliapietre della colonia e componenti di Modern Industrialization.
ServerEvents.recipes(event => {
    event.remove({ output: 'ae2colonies:me_architects_cutter' });

    event.shaped('ae2colonies:me_architects_cutter', [
        'PEP',
        'FCF',
        'PMP'
    ], {
        P: 'kubejs:pannello_termoisolante_composito',   // Gate Tagliapietre (colonia)
        E: 'ae2:engineering_processor',
        F: 'ae2:fluix_crystal',
        C: 'domum_ornamentum:architectscutter',         // Architect's Cutter base
        M: 'modern_industrialization:electronic_circuit' // Componente MI
    }).id('kubejs:gate_ae2colonies_me_architects_cutter');
});
