import test from 'node:test';
import assert from 'node:assert/strict';
import { textoSolicitacaoCraft, linhaReceita } from '../assets/modules/solicitacao-craft.js';

const meth = { nome: 'Pacote selado de Metanfetamina', spawn: 'packdrugmeth', insumos: [{ spawn: 'sulfuric', qtd: 25 }, { spawn: 'ziplock', qtd: 50 }] };
const capuz = { nome: 'Capuz', spawn: 'hood', insumos: [['tarp', 5]] };

test('linha no padrao da tabela da cidade', () => {
 assert.equal(linhaReceita(meth), '| Pacote selado de Metanfetamina    | packdrugmeth              | Ácido Sulfúrico x25, Ziplock x50');
 assert.equal(linhaReceita(capuz), '| Capuz                             | hood                      | Lona x5');
});

test('varios Groups num texto so, com as observacoes de permissao no fim', () => {
 const { texto, semReceita } = textoSolicitacaoCraft([
  { group: 'Drogas01', receitas: [meth, capuz] },
  { group: 'Drogas06', receitas: [] }
 ]);
 assert.deepEqual(semReceita, ['Drogas06']);
 assert.ok(texto.startsWith('```\n- Drogas01:\n\n| NOME DO ITEM'));
 assert.ok(texto.includes('| Capuz '));
 assert.ok(!texto.includes('Drogas06'));
 assert.ok(texto.includes('- Fixar a permissão na rota e no craft para cada group mencionado na solicitação.\n```'));
 assert.equal(textoSolicitacaoCraft([{ group: 'X', receitas: [] }]).texto, '');
});
