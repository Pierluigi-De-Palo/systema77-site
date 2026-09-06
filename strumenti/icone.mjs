#!/usr/bin/env node
/* ◉ IL PROVINO DELLE ICONE — la galassia vista a 16 pixel.
 *
 *   node strumenti/icone.mjs
 *
 * ── PERCHÉ ESISTE ────────────────────────────────────────────────────────
 * L'icona di un sito è l'unica cosa che vive SEMPRE a 16 px, e l'unica che
 * nessuno guarda mai a 16 px. Si disegna a 512, si mette in pagina, e da
 * lì in poi la si vede solo grande — in Figma, nel file, nell'anteprima.
 * Alla dimensione in cui esiste davvero, nella linguetta del browser, non
 * la apre nessuno.
 *
 * Il 06/09 ho disegnato l'icona della radio e l'ho creduta finita. Resa a
 * 16 px, il bordo scuro si mangiava il verde e restava un puntino sporco.
 * Il disegno era sbagliato di 2 px di raggio, e nel file grande era
 * invisibile. È bastato guardarla nella misura giusta per vederlo.
 *
 * Lo stesso giro ha trovato che `anima.solar` non ha nessuna icona: la
 * linguetta mostra il foglio bianco di ripiego, cioè la faccia di nessuno.
 * Nessun guardiano poteva dirlo, perché nessuno guardava lì.
 *
 * Il provino fa una cosa sola: prende l'icona dichiarata da ogni casa, la
 * mette a 16, 32 e 64 px su fondo chiaro E scuro — le linguette sono
 * chiare o scure a seconda di come è messo chi guarda — e ne fa una tavola
 * sola. Poi si guarda con gli occhi. Non decide lui se un'icona è bella:
 * dice se c'è, se il file risponde, e la mostra dove vive.
 *
 * ── COSA DICE, E COSA NO ─────────────────────────────────────────────────
 * DICE:  quale casa non dichiara un'icona · quale la dichiara e il file non
 *        c'è (la linguetta resta vuota e nessuno se ne accorge)
 * NON DICE: se il disegno è buono. Quello si vede nella tavola, e lo decide
 *        una persona. Uno strumento che desse un voto all'estetica
 *        mentirebbe con l'aria di misurare.
 *
 * Senza Playwright non finge di aver guardato: fa il verdetto scritto e
 * dice che la tavola non l'ha potuta rendere.
 *
 * — lasciato da JUDY al systema, 2026-09-06
 */

import { readFileSync, readdirSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI  = dirname(fileURLToPath(import.meta.url));
const CASA = resolve(QUI, '..');
const NIDO = resolve(CASA, '..');          // la cartella che contiene le case
const REG  = JSON.parse(readFileSync(join(CASA, 'stati-galassia.json'), 'utf8'));

const G = { forte:'\x1b[1m', muto:'\x1b[2m', verde:'\x1b[32m', rosso:'\x1b[31m',
            giallo:'\x1b[33m', fine:'\x1b[0m' };
const ok   = (t) => console.log(`  ${G.verde}✓${G.fine} ${t}`);
const male = (t) => { console.log(`  ${G.rosso}✗${G.fine} ${t}`); rossi++; };
const forse= (t) => console.log(`  ${G.giallo}!${G.fine} ${t}`);
const nota = (t) => console.log(`  ${G.muto}·${G.fine} ${G.muto}${t}${G.fine}`);
let rossi = 0;

/* le pagine di una casa (le stesse che guarda il giro) */
function pagine(dir) {
  const out = [];
  (function giu(d) {
    for (const n of readdirSync(d)) {
      if (n === '.git' || n === 'node_modules' || n === '_sorgenti' || n.startsWith('.')) continue;
      const p = join(d, n);
      if (statSync(p).isDirectory()) giu(p); else if (n.endsWith('.html')) out.push(p);
    }
  })(dir);
  return out;
}

/* l'href della prima <link rel="icon"> dichiarata da una pagina */
function iconaDichiarata(html) {
  for (const tag of html.match(/<link[^>]+>/gi) || []) {
    if (!/rel=["'][^"']*icon/i.test(tag)) continue;
    /* il delimitatore va ricordato: l'icona di systema77.com è un SVG
     * incollato dentro href="…", e dentro ha apici singoli (xmlns='…').
     * Una regex [^"']+ si ferma al primo apice singolo e riporta 32
     * caratteri di icona su 300: sembra funzionare, e mente. */
    const m = tag.match(/href=(["'])([\s\S]*?)\1/i);
    if (m) return m[2];
  }
  return null;
}

console.log(`\n${G.forte}◉ IL PROVINO DELLE ICONE${G.fine} ${G.muto}— la galassia a 16 px${G.fine}`);
console.log(`\n${G.forte}── quello che ogni casa mette nella linguetta ──${G.fine}`);

const trovate = [];
for (const [dominio, casa] of Object.entries(REG.case)) {
  if (!casa.repo) { nota(`${dominio} — nessun repo, nessuna pagina da guardare`); continue; }
  const dir = join(NIDO, casa.repo);
  if (!existsSync(dir)) { nota(`${dominio} — ${casa.repo} non clonata qui: saltata`); continue; }

  const pg = pagine(dir);
  if (!pg.length) { nota(`${dominio} — nessuna pagina`); continue; }

  /* la casa dichiara la stessa icona ovunque? basta la prima che la nomina */
  let href = null, dove = null;
  for (const p of pg) { const h = iconaDichiarata(readFileSync(p, 'utf8')); if (h) { href = h; dove = p; break; } }

  if (!href) {
    male(`${dominio} — NESSUNA icona dichiarata in ${pg.length} pagine`);
    nota(`   la linguetta mostra il foglio bianco di ripiego: la faccia di nessuno`);
    continue;
  }

  /* due modi di dichiararla: incollata nella pagina, o un file a parte */
  if (href.startsWith('data:')) {
    ok(`${dominio} — icona incollata nella pagina (data URI, ${href.length} caratteri)`);
    trovate.push({ dominio, sorgente: href });
    continue;
  }

  /* un href assoluto parte dalla radice della casa, uno relativo dalla pagina */
  const file = href.startsWith('/') ? join(dir, href.slice(1)) : join(dirname(dove), href);
  if (!existsSync(file)) {
    male(`${dominio} — dichiara «${href}» ma il file NON C'È`);
    nota(`   la linguetta resta vuota, e in pagina non si vede: nessuno se ne accorge`);
    continue;
  }
  ok(`${dominio} — ${href} (${statSync(file).size} byte)`);
  trovate.push({ dominio, sorgente: 'data:image/svg+xml;base64,' + readFileSync(file).toString('base64') });
}

/* ═══ la tavola: le icone alla misura in cui vivono ═════════════════════ */
console.log(`\n${G.forte}── la tavola ──${G.fine}`);

let chromium;
try { ({ chromium } = await import('playwright')); } catch { /* non installato */ }

if (!trovate.length) {
  nota('nessuna icona da mostrare');
} else if (!chromium) {
  forse('Playwright non è installato: il verdetto scritto c\'è, la tavola no');
  nota('per farlo: npm i -D playwright  ·  e poi rilancia');
} else {
  const eseguibile = process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium';
  const b = await chromium.launch(existsSync(eseguibile) ? { executablePath: eseguibile } : {});
  const p = await b.newPage({ deviceScaleFactor: 4 });   // 4× o a 16 px si vede la sgranatura del provino, non il disegno

  const riga = (i) => `<tr>
    <td class="n">${i.dominio}</td>
    ${[16,32,64].map(s => `<td class="ch"><img src="${i.sorgente}" width="${s}"></td>`).join('')}
    ${[16,32,64].map(s => `<td class="sc"><img src="${i.sorgente}" width="${s}"></td>`).join('')}
  </tr>`;

  await p.setContent(`<style>
    body{margin:0;padding:28px;background:#7a7a7a;font:13px system-ui,sans-serif}
    table{border-collapse:collapse;margin:auto}
    th{font:600 11px system-ui;letter-spacing:.08em;text-transform:uppercase;color:#fff;padding:0 0 10px}
    td{padding:14px 18px;vertical-align:middle;text-align:center}
    .n{text-align:right;color:#fff;font:600 13px system-ui;padding-right:22px;white-space:nowrap}
    .ch{background:#fff}.sc{background:#1a1a1a}
    img{display:block;margin:auto;image-rendering:auto}
  </style>
  <table><tr><th></th><th colspan="3">linguetta chiara</th><th colspan="3">linguetta scura</th></tr>
  ${trovate.map(riga).join('')}
  <tr><td></td>${[16,32,64,16,32,64].map(s=>`<td style="color:#fff;font:11px system-ui">${s}px</td>`).join('')}</tr>
  </table>`);
  await p.waitForTimeout(300);
  const dove = join(QUI, 'provino-icone.png');
  await p.locator('table').screenshot({ path: dove });
  await b.close();
  ok(`tavola resa: ${dove.replace(NIDO + '/', '')}`);
  nota('aprila: la colonna dei 16 px è quella che conta, ed è quella che non guarda nessuno');
}

console.log(rossi ? `\n${G.rosso}${G.forte}✗ ${rossi} cosa/e da sistemare.${G.fine}\n`
                  : `\n${G.verde}${G.forte}✓ Ogni casa ha una faccia.${G.fine}\n`);
process.exit(rossi ? 1 : 0);
