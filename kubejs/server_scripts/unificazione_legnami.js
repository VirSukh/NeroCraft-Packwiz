ServerEvents.tags('block', event => {
    // Aggiunge tutti i tronchi, legni e assi di Oh The Biomes We've Gone alla tag comune c:woods
    event.add('c:woods', /^biomeswevegone:.*_log$/);
    event.add('c:woods', /^biomeswevegone:.*_wood$/);
    event.add('c:woods', /^biomeswevegone:.*_planks$/);
});

ServerEvents.tags('item', event => {
    event.add('c:woods', /^biomeswevegone:.*_log$/);
    event.add('c:woods', /^biomeswevegone:.*_wood$/);
    event.add('c:woods', /^biomeswevegone:.*_planks$/);
});