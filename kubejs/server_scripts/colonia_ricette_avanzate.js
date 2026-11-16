ServerEvents.recipes(event => {

    // 1-2. Telaio (Falegname liv. 2+) e Pannello (Tagliapietre liv. 3+) NON hanno piu' ricette
    // da banco: li producono solo i lavoratori della colonia. Ricette MineColonies:
    //   kubejs/data/kubejs/crafterrecipes/sawmill/telaio_strutturale_rinforzato.json
    //   kubejs/data/kubejs/crafterrecipes/stonemason/pannello_termoisolante_composito.json

    // 3. Machine Casing Avanzato (Gate Falegname)
    event.remove({ output: 'modern_industrialization:advanced_machine_casing' });
    
    event.shaped(
        'modern_industrialization:advanced_machine_casing',
        [
            'SCS',
            'TFT',
            'SCS'
        ],
        {
            S: 'modern_industrialization:steel_plate',
            C: 'modern_industrialization:analog_circuit',
            T: 'modern_industrialization:tin_cable',
            F: 'kubejs:telaio_strutturale_rinforzato'
        }
    ).id('kubejs:progressione_advanced_casing');

    // 4. Machine Casing Termoisolante (Gate Tagliapietre)
    event.remove({ output: 'modern_industrialization:highly_advanced_machine_casing' });

    event.shaped(
        'modern_industrialization:highly_advanced_machine_casing',
        [
            'RPR',
            'PXP',
            'RPR'
        ],
        {
            R: 'modern_industrialization:titanium_plate',
            P: 'kubejs:pannello_termoisolante_composito',
            X: 'modern_industrialization:electronic_circuit'
        }
    ).id('kubejs:progressione_highly_advanced_casing');

});