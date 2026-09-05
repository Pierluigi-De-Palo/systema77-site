/* ◉ SYSTEMA 77 — i due comportamenti del sito, in un file solo.
 *
 * Prima del 04/09 questo stesso codice stava copiato dentro ogni pagina, in
 * nove copie che avevano gia' cominciato a divergere: la home aveva il binario
 * e la via d'uscita, le altre solo la via d'uscita, e una correzione andava
 * fatta nove volte. Adesso e' uno.
 *
 * 1 · IL BINARIO — lo scroll verso il basso corre verso destra.
 *     Idea del Direttore (08/08): «siamo nel 2077 e dobbiamo creare artifici».
 *     Pagina alta N schermi, viewport sticky, la pista trasla in X in
 *     proporzione allo scroll Y. Scrollbar nativa, nessun wheel-hijack,
 *     zero librerie.
 *
 * 2 · L'INVITO A GIRARE IL TELEFONO — una striscia, non un muro.
 *     Fino al 03/09 il telefono in verticale trovava un cartello a tutto
 *     schermo PRIMA del sito. Il Direttore sta per diffondere il link, e un
 *     link condiviso si apre col telefono in mano: la prima cosa che vedeva
 *     uno sconosciuto era un ordine. Adesso il sito si apre e basta (i quadri
 *     si impilano, via CSS) e l'invito e' una striscia che si chiude.
 *     Compare solo dove il binario esiste davvero — cioe' in home: dire
 *     «gira il telefono» su una pagina che e' gia' un documento sarebbe
 *     chiedere una cosa che non serve a niente.
 */
(function () {
  'use strict';

  var IMPILATO = '(orientation: portrait) and (max-width: 720px)';  // = stile.css

  /* ── 1 · il binario ─────────────────────────────────────────────── */
  var alt = document.getElementById('binarioAlt');
  var corsa = document.getElementById('corsa');

  if (alt && corsa) {
    var mq = window.matchMedia(IMPILATO);

    function misura() {
      // in colonna la pagina cresce da sola: l'altezza fissa la strozzerebbe
      if (mq.matches) { alt.style.height = ''; return; }
      // clientWidth e NON innerWidth: innerWidth conta anche la barra di
      // scorrimento, e la corsa non e' larga quanto la barra. Con innerWidth
      // la pista si fermava una quindicina di pixel prima del traguardo.
      var extra = corsa.scrollWidth - alt.clientWidth;
      alt.style.height = (window.innerHeight + Math.max(0, extra)) + 'px';
    }

    function muovi() {
      if (mq.matches) { corsa.style.transform = ''; return; }
      var r = alt.getBoundingClientRect();
      var extra = corsa.scrollWidth - alt.clientWidth;
      var y = Math.min(Math.max(-r.top, 0), Math.max(0, extra));
      corsa.style.transform = 'translateX(-' + y + 'px)';
    }

    function ritara() { misura(); muovi(); }

    window.addEventListener('scroll', muovi, { passive: true });
    window.addEventListener('resize', ritara);
    window.addEventListener('orientationchange', function () { setTimeout(ritara, 60); });
    window.addEventListener('load', ritara);
    if (mq.addEventListener) mq.addEventListener('change', ritara);
    else if (mq.addListener) mq.addListener(ritara);
    ritara();
    setTimeout(ritara, 350);   // font e impaginazione tardivi
    // I font arrivano dopo: senza questo la pista resta misurata sul ripiego.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ritara);
  }

  /* ── 2 · l'invito a girare ──────────────────────────────────────── */
  var strip = document.getElementById('suggerimento');
  if (!strip) return;

  var CHIAVE = 's77-suggerimento-chiuso';
  try {
    if (sessionStorage.getItem(CHIAVE) === '1') {
      document.documentElement.classList.add('senza-suggerimento');
    }
  } catch (e) { /* niente magazzino: la striscia ricompare, e non è un guasto */ }

  var chiudi = document.getElementById('chiudiSuggerimento');
  if (chiudi) {
    chiudi.addEventListener('click', function () {
      document.documentElement.classList.add('senza-suggerimento');
      try { sessionStorage.setItem(CHIAVE, '1'); } catch (e) {}
    });
  }
})();
