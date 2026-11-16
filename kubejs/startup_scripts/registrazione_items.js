StartupEvents.registry('item', event => {
    // Tier 1: Sigillo della Gilda (Gate Vapore / Colonia)
    event.create('sigillo_gilda_ingegneri')
        .displayName('Sigillo della Gilda degli Ingegneri')
        .tooltip('§7Prova di artigianato autorizzato dalla Colonia.')
        .tooltip('§cRichiesto per i macchinari a vapore di Modern Industrialization.')
        .texture('kubejs:item/sigillo_gilda');

    // Tier 2: Nucleo di Processo Meccanico (Gate Elettricità / Colonia)
    event.create('nucleo_meccanico_colonia')
        .displayName('Nucleo di Processo Meccanico')
        .tooltip('§7Assemblato con precisione dal Meccanico della Colonia (Livello 3).')
        .tooltip('§cRichiesto per le reti Applied Energistics 2.')
        .texture('kubejs:item/nucleo_meccanico');

    // Componente Falegname: Telaio Strutturale Rinforzato
    event.create('telaio_strutturale_rinforzato')
        .displayName('Telaio Strutturale Rinforzato')
        .tooltip('§7Prodotto esclusivamente dal Falegname della Colonia (Liv. 2+).')
        .tooltip('§cNecessario per i Macchinari Avanzati e gli Assemblatori.')
        .texture('kubejs:item/telaio_rinforzato');

    // Componente Tagliapietre: Pannello Termoisolante Composito
    event.create('pannello_termoisolante_composito')
        .displayName('Pannello Termoisolante Composito')
        .tooltip('§7Prodotto esclusivamente dal Tagliapietre della Colonia (Liv. 3+).')
        .tooltip('§cNecessario per macchinari a temperature estreme.')
        .texture('kubejs:item/pannello_termoisolante');

    // Polveri dei minerali spaziali di Ad Astra (prodotte dal Maceratore di MI)
    event.create('desh_dust').displayName('Polvere di Desh').texture('kubejs:item/desh_dust');
    event.create('ostrum_dust').displayName('Polvere di Ostrum').texture('kubejs:item/ostrum_dust');
    event.create('calorite_dust').displayName('Polvere di Calorite').texture('kubejs:item/calorite_dust');
});
