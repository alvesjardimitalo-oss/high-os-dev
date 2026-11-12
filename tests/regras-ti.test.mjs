import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/* O projeto Firebase high-os é dividido com o site italoinfotec.com.br.
   Publicar este arquivo SUBSTITUI as regras do site também: se faltar um
   bloco da TI, a loja da Karen ou o "Fale comigo" param na hora. */
const regras = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');

test('regras do site da TI continuam no arquivo do High OS', () => {
  for (const caminho of ['/ti/{document=**}', '/ti/base/leads/{leadId}', '/ti/base/metricasSite/{eventoId}',
    '/ti/base/rastreio/{rastreioId}', '/ti/base/vagas-bf/{vagaId}'])
    assert.ok(regras.includes('match ' + caminho), 'faltou o bloco ' + caminho);
  for (const fn of ['function tiDono', 'function tiVagaLivre', 'function tiVagaNova', 'function tiVagaCancelada'])
    assert.ok(regras.includes(fn), 'faltou ' + fn);
});

test('nenhuma colagem quebrada nas regras', () => {
  assert.equal((regras.match(/\{/g) || []).length, (regras.match(/\}/g) || []).length, 'chaves desbalanceadas');
  assert.equal((regras.match(/\(/g) || []).length, (regras.match(/\)/g) || []).length, 'parênteses desbalanceados');
  for (const [n, linha] of regras.split('\n').entries()) {
    const m = linha.match(/matches\('/);
    if (m) assert.match(linha, /matches\('[^']*'\)/, `regex sem fechar na linha ${n + 1}`);
  }
  assert.ok(/match \/\{document=\*\*\} \{\s*allow read, write: if false;/.test(regras), 'regra final fechada sumiu');
});
