import test from 'node:test';
import assert from 'node:assert/strict';
import { estadoItem, textoSolicitacao, fichaFuncionando, instaladosDe } from '../assets/modules/blips-qg.js';

const qg = {
 group: 'Armas01', local: 'FAVELA DA BARRAGEM',
 cds: {
  farm: '1,1,1', craft: '2,2,2', garagemPublicaBlip: '3,3,3', garagemPublicaSpawn: '4,4,4',
  garagemVipBlip: '5,5,5', garagemVipSpawn: '6,6,6', helipontoBlip: '7,7,7', helipontoSpawn: '8,8,8',
  barbearia: '9,9,9', bar: '10,10,10'
 }
};

test('abertura: craft, rota e garagem publica funcionando; resto planejado ou sem cds', () => {
 assert.deepEqual(instaladosDe(qg), ['farm', 'craft', 'garagemPublica']);
 assert.equal(estadoItem(qg, 'garagemPublica'), 'FUNCIONANDO');
 assert.equal(estadoItem(qg, 'garagemVip'), 'PLANEJADO');
 assert.equal(estadoItem(qg, 'bau'), 'SEM_CDS');
 assert.equal(estadoItem({ ...qg, solicitados: { bar: '2026-11-12' } }, 'bar'), 'SOLICITADO');
});

test('texto no padrao da cidade', () => {
 const t = textoSolicitacao(qg, ['garagemVip', 'heliponto', 'bar', 'bau']);
 assert.equal(t, [
  '```',
  'Assunto', '',
  '- Inclusão / Alteração de blips de uma organização', '',
  'Solicitação', '',
  '- Inserir / Alterar os blips das coordenadas abaixo:', '',
  '- Blip de Garagem VIP: Blip 5,5,5 Spawn 6,6,6', '',
  '- Blip de Heliponto: Blip 7,7,7 Spawn 8,8,8', '',
  '- Bar 10,10,10', '',
  '- Permissão: Armas01',
  '```'
 ].join('\n'));
 assert.equal(textoSolicitacao(qg, ['bau']), '', 'sem cds nao gera');
});

test('ficha leva so o que funciona e preserva receitas e telao', () => {
 const f = fichaFuncionando(qg, {
  beneficios: { garagemVipBlip: 'velho', rotaExclusiva: false },
  perfilTecnico: { craft: { receitas: [1, 2] }, operacional: { telao: { modelo: 'x', cds: '9' } } }
 });
 assert.equal(f.beneficios.garagemPublicaBlip, '3,3,3');
 assert.equal(f.beneficios.garagemVipBlip, undefined, 'VIP nao instalada sai da ficha');
 assert.equal(f.beneficios.rotaExclusiva, false, 'beneficio que nao e blip fica');
 assert.deepEqual(f.perfilTecnico.craft, { receitas: [1, 2], cds: '2,2,2' });
 assert.equal(f.perfilTecnico.operacional.garagens.length, 1);
 assert.deepEqual(f.perfilTecnico.operacional.helipontos, []);
 assert.equal(f.perfilTecnico.operacional.telao.modelo, 'x');
 assert.equal(f.cds, '1,1,1');
 const g = fichaFuncionando({ ...qg, instalados: ['farm', 'craft', 'garagemPublica', 'garagemVip'] });
 assert.equal(g.perfilTecnico.operacional.garagens.length, 2);
});
