# SYSTEMA 77 — systema77.com

Il sito dell'agenzia. **AI Agent Service**: automazione con agenti AI,
produzione per terzi, ricerca e sviluppo. Più una casa editrice, un'officina
e un gioco.

## Le pagine

| file | cos'è |
|---|---|
| `index.html` | la home: il binario a **sei quadri**, uno per voce di menu più l'apertura |
| `servizi.html` | **automazione · produzione per terzi · ricerca e sviluppo** — e il contatto. È la pagina da cui arriva il lavoro |
| `editrice.html` | la casa editrice: i libri, lo shop, il controllo |
| `officina.html` | dove si fabbrica — porta alle tre stanze |
| `immagini.html` · `film.html` · `musica.html` | le tre stanze dell'officina |
| `progetti.html` | **solo ANIMA GAME**, e porta ad `animagame.io` |
| `chill.html` | **AURA** (accesa) · **radio** (accesa) · podcast |
| `divulgazione.html` | la porta verso `cyberboomer.ninja` — la divulgazione sta su un pianeta suo |
| `meteo.html` | AURA, il meteo. Vive già |
| `stile.css` · `s77.js` | il sistema. Un foglio, un file di comportamento |
| `storie.html` | rinvio: l'indirizzo vecchio porta alla casa editrice |
| `bilancia.html` | **staccata dal sito** — vedi sotto |

## Le regole della casa

1. **La regola tipografica**, e viene prima di tutte. Quattro caratteri, quattro mestieri:
   - **Anton** → l'annuncio. Solo titoli.
   - **Archivo Black** (`.claim`) → la promessa. Una riga, quella che deve restare in testa.
   - **Share Tech Mono** (`.etichetta`, `.stato`, `.riga-mono`) → **etichette e stati soltanto.**
     Mai una frase. Se supera sei parole non è un'etichetta: è una voce umana.
   - **Newsreader** (`.dice`) → la voce umana. Frasi vere, in minuscolo, che si leggono.

   **Il testo ha tre volumi, e il bianco è il più alto** (revisione 04/09 sera:
   «i testi sono tutti bianchi»). Il bianco era il default, quindi non voleva
   dire niente. Adesso:
   `.dice.forte` bianco e più grande — **una per blocco, mai due** ·
   `.dice` grigio chiaro, il corpo · `.dice.piccola` grigio muto, il dettaglio.

   **La pagina usa la larghezza che ha.** Contenitore a 1360px e blocchi in
   **due colonne** sopra i 1000px (`.due`): a sinistra chi parla, a destra cosa
   dice. La misura di lettura resta corta — quella non si allarga mai, righe
   lunghe si perdono — ma è la pagina a occupare lo spazio, non il paragrafo.

   **Semplificare vuol dire togliere.** Un paragrafo in più non si riscrive
   più corto: si cancella.

   Il 04/09 il Direttore ha scritto «i testi piccoli non si leggono» e
   «ridurrei tutti i testi a qualcosa per il pubblico, non nostro interno».
   Erano lo stesso problema: **tutto** il sito era scritto in mono maiuscolo
   spaziato, cioè col carattere delle etichette usato per fare i paragrafi.
   Quando l'unico stile disponibile è l'etichetta, si finisce a scrivere per
   sigle. `.dice` esiste per non farlo più.

2. **Niente numeri, clienti o prezzi inventati.** Non c'è un listino perché
   ogni lavoro è diverso, e si dice così invece di riempire con un finto.

3. **Diritti prima, sempre.** Quello che esce dall'officina è nostro o ha
   un'autorizzazione scritta *prima*. In pagina non compaiono nomi di opere,
   marchi o autori di altri — nemmeno come esempio di cosa sappiamo fare.

4. **Gli stati sono onesti.** «In allestimento» vuol dire in allestimento.
   Una sala vuota non si annuncia aperta.

5. **Un indirizzo non si rompe.** Se una pagina cambia nome, la vecchia resta
   e rinvia (vedi `storie.html`).

## La galassia

SYSTEMA 77 è il centro; intorno ci sono altri pianeti, ognuno col suo indirizzo.
Il componente `.galassia` è la mappa, e sta **sul piede di ogni pagina**: da
qualunque punto del sito si vede dove si può andare.

**Il colore è l'indirizzo, non una decorazione:**

| colore | vuol dire |
|---|---|
| **giallo** | si resta qui, su `systema77.com` |
| verde · magenta · ciano | è un altro pianeta, e sotto c'è scritto quale |

I pianeti di oggi: `animagame.io` (il gioco), `cyberboomer.ninja` (la
divulgazione), `radio-anima.pages.dev` (la radio). Quando se ne aggiunge uno,
si tocca solo la lista `FUORI` nel generatore e la mappa si aggiorna ovunque.

## Gli stati accesi

`chill.html` dà **AURA** e **la radio** per accese. AURA è verificata (vive in
`meteo.html`). La radio è accesa **sulla parola del Direttore del 04/09**, non
su un collaudo: da questo ambiente `radio-anima.pages.dev` non è raggiungibile.
Se il link non suona, si torna a «in accordatura» cambiando una riga.

## Il telefono in verticale

Fino al 03/09 chi apriva il sito col telefono in piedi trovava un cartello a
tutto schermo — «GIRA IL TELEFONO» — prima di qualsiasi contenuto. Il link
adesso si diffonde, e un link condiviso si apre col telefono in mano.

Da oggi: **in verticale il sito si apre e basta**, coi sei quadri in colonna,
stesso contenuto per intero. L'invito a girare resta, ma è una striscia in
fondo alla home che si chiude con una ×. Chi gira il telefono ritrova il
binario esattamente com'era: l'artificio non è stato toccato, è stata tolta
la porta chiusa che gli stava davanti.

## La bilancia

`bilancia.html` è **staccata dal sito**: nessun link ci arriva, sta fuori da
`sitemap.xml` ed è `noindex`. Ordine del Direttore del 04/09: «la bilancia, per
me, resta per il momento qualcosa all'interno di animagame». Il file non è
stato cancellato — aspetta di trovare casa in `animagame-site`.
Portava anche in chiaro un nome preso da un videogioco altrui: è stato tolto
dal titolo e dalle scritte, per la stessa cautela già decisa su ANIMA GAME.

— creato da D.R.A.G.O. 2026-07-28 · riscritture JUDY 2026-08-08 ·
  **v1 operativa, JUDY 2026-09-04**
