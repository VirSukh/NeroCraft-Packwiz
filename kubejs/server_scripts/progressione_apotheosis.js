// Apotheosis: collegamento alla progressione (Era 3 - Electric Blast Furnace).
//
// Limite verificato: nel registry_dump.json disponibile per questo pack non compare
// alcun ID di item/blocco/ricetta del namespace "apotheosis" (ne' dei moduli
// Apothic). Sono invece presenti mod e dipendenze nei manifest, ma questo non basta
// per dedurre un ID valido. Per questo motivo qui NON si usano:
//   - event.remove({ output: ... }) (rimuoverebbe ricette non correlate);
//   - ID apotheosis inventati;
//   - eventi AStages o eventi KubeJS non verificati.
//
// AStages non offre un gating affidabile dei moduli Apotheosis tramite una semplice
// ricetta: lo stage di server viene letto in progressione_stage.js, mentre Apotheosis
// non espone in questo dump una ricetta/crafting agganciabile. Il collegamento sicuro
// resta quindi documentato: Apotheosis va considerata contenuto avanzato dall'Era 3,
// ma nessuna ricetta esistente viene alterata finche' non sono disponibili ID reali
// verificati con `cerca`/registry_dump.json.
//
// Questo handler intenzionalmente non modifica il recipe manager. Mantenerlo come
// punto di integrazione evita di bloccare il caricamento e rende esplicito il limite.
ServerEvents.recipes(event => {
  console.info('[progressione_apotheosis] Apotheosis collegata all\'Era 3: nessun ID di ricetta verificato nel registry dump; nessuna ricetta modificata.')
})
