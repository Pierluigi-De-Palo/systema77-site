#!/usr/bin/env node
/* ◉ IL GIRO DELLA GALASSIA — tutte le case, un comando solo.
 *
 *   node strumenti/galassia.mjs
 *
 * ── PERCHÉ ESISTE ────────────────────────────────────────────────────────
 * Il 05/09 systema77.com diceva «radio in accordatura» e, nello stesso
 * momento, animagame.io diceva «Radio attiva» con un bottone «Sintonizzati»
 * verso un posto muto. Nessun guardiano l'ha visto: ognuno guarda la sua
 * casa, e una galassia si rompe FRA le case, non dentro.
 *
 * Il giro fa tre cose che un guardiano da solo non può fare:
 *   1. lancia il guardiano di ogni casa che ne ha uno, e riporta il verdetto;
 *   2. controlla le PORTE: da ogni casa si deve poter andare alle altre;
 *   3. confronta gli STATI dichiarati in pagina con il registro unico
 *      (stati-galassia.json): se la radio è spenta, nessuna casa può dire
 *      che è accesa, né linkarla.
 *
 * ── COME SI USA ──────────────────────────────────────────────────────────
 * Le case devono stare una accanto all'altra, clonate nella stessa cartella:
 *
 *   qualcosa/
 *     systema77-site/        ← il centro: il giro parte da qui
 *     animagame-site/
 *     cyberboomer-ninja-site/
 *     anima-solar-site/
 *     radio-anima-site/
 *
 * Una casa che non c'è viene DETTA, non fatta finta: «non clonata qui».
 * Zero dipendenze: gira con Node. I guardiani delle case decidono da soli
 * se hanno un browser; il giro ne riporta la parola.
 *
 * ── QUANDO QUALCOSA CAMBIA ───────────────────────────────────────────────
 * Si accende la radio? Si cambia `stati.radio.stato` nel registro, si
 * riaccendono le pagine, si rilancia il giro: se una casa è rimasta
 * indietro, lo dice lui. È l'ordine giusto: prima il registro, poi le case.
 *
 * — lasciato da JUDY al systema, 2026-09-05
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const QUI  = resolve(dirname(fileURLToPath(import.meta.url)), '..');   // systema77-site
const NIDO = resolve(QUI, '..');                                        // dove stanno le case
const REG  = JSON.parse(readFileSync(join(QUI, 'stati-galassia.json'), 'utf8'));

const G = { verde: '\x1b[32m', rosso: '\x1b[31m', giallo: '\x1b[33m', muto: '\x1b[2m', forte: '\x1b[1m', fine: '\x1b[0m' };
let guai = 0;
const ok    = (t, s) => console.log(`  ${G.verde}✓${G.fine} ${t}${s ? `\n      ${G.muto}${s}${G.fine}` : ''}`);
const male  = (t, s) => { guai++; console.log(`  ${G.rosso}✗${G.fine} ${t}${s ? `\n      ${G.muto}${s}${G.fine}` : ''}`); };
const nota  = (t) => console.log(`  ${G.muto}·${G.fine} ${t}`);
const titolo = (t) => console.log(`\n${G.forte}── ${t} ──${G.fine}`);

/* le pagine spedite di una casa: html, fuori da .git, node_modules e _sorgenti */
function pagine(dir) {
  const out = [];
  (function giu(d) {
    for (const n of readdirSync(d)) {
      if (n === '.git' || n === 'node_modules' || n === '_sorgenti' || n.startsWith('.')) continue;
      const p = join(d, n);
      if (statSync(p).isDirectory()) giu(p);
      else if (n.endsWith('.html')) out.push(p);
    }
  })(dir);
  return out;
}

/* il testo che una persona legge: via commenti, script, stile, tag */
function visibile(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

/* i link href="https://…" di una pagina, senza i commenti */
function linkFuori(html) {
  const senza = html.replace(/<!--[\s\S]*?-->/g, '');
  return [...senza.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => m[1]);
}

console.log(`\n${G.forte}◉ IL GIRO DELLA GALASSIA${G.fine} ${G.muto}— registro del ${REG.aggiornato}${G.fine}`);

/* ═══ 1 · le case, e il loro guardiano ═════════════════════════════════ */
titolo('1 · le case');
const case_ = {};   // dominio → { dir, pagine }
for (const [dominio, casa] of Object.entries(REG.case)) {
  // Una casa può vivere senza repo: la radio si pubblica per caricamento
  // diretto e la sua sorgente sta fuori da git (vedi il registro). Cercarle
  // una cartella qui vorrebbe dire contare le pagine di qualcun altro.
  if (!casa.repo) { nota(`${dominio} — nessun repo (${casa.voce})`); continue; }
  const dir = join(NIDO, casa.repo);
  if (!existsSync(dir)) { nota(`${dominio} — ${casa.repo} non clonata qui: saltata`); continue; }
  const pg = pagine(dir);
  case_[dominio] = { dir, pagine: pg, repo: casa.repo };
  if (!pg.length) { nota(`${dominio} — ${casa.repo} è vuota (${casa.voce})`); continue; }

  if (!casa.guardiano) { nota(`${dominio} — ${pg.length} pagine, nessun guardiano (${casa.voce})`); continue; }
  const g = join(dir, casa.guardiano);
  if (!existsSync(g)) { male(`${dominio} — il registro promette ${casa.guardiano}, ma non c'è`); continue; }

  const r = spawnSync(process.execPath, [g], { cwd: dir, encoding: 'utf8', env: process.env, timeout: 600000 });
  const righe = (r.stdout || '').replace(/\x1b\[[0-9;]*m/g, '').trim().split('\n');
  const ultima = righe.filter(x => x.trim()).slice(-2).join(' · ').trim();
  if (r.status === 0) ok(`${dominio} — il guardiano è verde`, ultima);
  else male(`${dominio} — il guardiano è rosso (uscita ${r.status})`, righe.filter(x => /✗/.test(x)).slice(0, 4).join(' · ') || ultima);
}

/* ═══ 2 · le porte fra le case ═════════════════════════════════════════ */
titolo('2 · le porte');
for (const [repo, dove] of Object.entries(REG.porte)) {
  if (repo === '_') continue;
  const casa = Object.values(case_).find(c => c.repo === repo);
  if (!casa) { nota(`${repo} non clonata qui: porte non controllate`); continue; }
  const tutti = new Set();
  for (const p of casa.pagine) for (const u of linkFuori(readFileSync(p, 'utf8'))) {
    try { tutti.add(new URL(u).host.replace(/^www\./, '')); } catch { /* non è un url */ }
  }
  const mancano = dove.filter(d => !tutti.has(d));
  if (mancano.length) male(`da ${repo} non si arriva a ${mancano.join(', ')}`, 'una casa senza porte verso le altre è un vicolo cieco');
  else ok(`da ${repo} si va a ${dove.join(', ')}`);
}

/* ═══ 3 · gli stati, uguali in tutte le case ═══════════════════════════ */
titolo('3 · gli stati dichiarati');
for (const [nome, s] of Object.entries(REG.stati)) {
  if (nome === '_') continue;
  const regole = s['se_' + s.stato.replace(/\s+/g, '_')];
  if (!regole) { nota(`${nome}: ${s.stato} — nessuna regola da controllare`); continue; }
  const testo = regole.vietato_testo ? new RegExp(regole.vietato_testo, 'i') : null;
  const link  = regole.vietato_link ? new RegExp(regole.vietato_link, 'i') : null;
  const colpe = [];
  for (const [dominio, casa] of Object.entries(case_)) {
    for (const p of casa.pagine) {
      const html = readFileSync(p, 'utf8');
      const rel = `${dominio}/${relative(casa.dir, p)}`;
      if (link) for (const u of linkFuori(html)) if (link.test(u)) { colpe.push(`${rel} linka ${u}`); break; }
      if (testo) { const m = visibile(html).match(testo); if (m) colpe.push(`${rel} dice «${m[0].trim().slice(0, 60)}»`); }
    }
  }
  if (colpe.length) male(`${nome} è ${s.stato}, ma qualcuno dice altro`, colpe.slice(0, 6).join('\n      '));
  else ok(`${nome}: ${s.stato} — tutte le case dicono lo stesso`, s.perche);
}

/* ═══ il verdetto ══════════════════════════════════════════════════════ */
console.log();
if (guai) {
  console.log(`${G.rosso}${G.forte}✗ ${guai} ${guai === 1 ? 'cosa' : 'cose'} da sistemare nella galassia.${G.fine}\n`);
  process.exit(1);
}
console.log(`${G.verde}${G.forte}✓ La galassia dice una cosa sola.${G.fine}`);
console.log(`${G.muto}  Restano le promesse della sezione 6 di ogni casa: quelle le apre una persona.${G.fine}\n`);
