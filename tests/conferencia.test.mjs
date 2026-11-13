import test from 'node:test';
import assert from 'node:assert/strict';
import * as c from '../assets/modules/conferencia.js';

const W = n => `https://discord.com/api/webhooks/${n}/tok_${n}`;

test('nome dos baus como a cidade usa', () => {
 assert.deepEqual(c.nomesBaus('ARMAS01'), { geral: 'Armas01', admin: 'Armas01Admin' });
 assert.deepEqual(c.nomesBaus('ILEGALMECHANIC02'), { geral: 'IlegalMechanic02', admin: 'IlegalMechanic02Admin' });
 assert.equal(c.nomeBau('ilegalmedic01'), 'IlegalMedic01');
});

test('repetido aponta onde o link ja esta', () => {
 const todos = { ARMAS03: { ilegalGeral: W(1), logsGeral: W(2), ilegalAdmin: W(1), logsAdmin: W(3) } };
 const idx = c.indiceWebhooks(todos);
 assert.deepEqual(c.repetidoEm('ARMAS03', 'ilegalGeral', W(1), idx), ['Armas03Admin (Ilegal)']);
 const erros = c.validarWebhooks('ARMAS04', { ilegalGeral: W(2), logsGeral: 'x' }, todos);
 assert.equal(erros.length, 2);
 assert.match(erros[0], /já está em Armas03 \(Logs High\)/);
 assert.match(erros[1], /não é um link/);
});

test('avaliacao do teste', () => {
 const w = { ilegalGeral: W(1), logsGeral: W(2), ilegalAdmin: W(3), logsAdmin: W(4) };
 const ok = { status: 200, corpo: {} };
 const resp = { [W(1)]: { status: 200, corpo: { guild_id: 'I', channel_id: 'a' } }, [W(2)]: { status: 200, corpo: { guild_id: 'L', channel_id: 'b' } },
  [W(3)]: { status: 200, corpo: { guild_id: 'I', channel_id: 'c' } }, [W(4)]: ok };
 assert.equal(c.avaliarTeste('ARMAS01', w, resp, c.indiceWebhooks({ ARMAS01: w })).texto, 'OK · 4/4 funcionando');
 resp[W(3)] = { status: 404, corpo: {} };
 resp[W(2)] = { status: 200, corpo: { guild_id: 'I', channel_id: 'b' } };
 const r = c.avaliarTeste('ARMAS01', w, resp, c.indiceWebhooks({ ARMAS01: w }));
 assert.match(r.texto, /Ilegal \(admin\): webhook apagado/);
 assert.match(r.texto, /MESMO servidor/);
 assert.equal(c.avaliarTeste('X', {}, {}, {}).texto, '');
});

test('consulta respeita o espere do Discord', async () => {
 let n = 0;
 const fetchFn = async () => (++n < 3 ? { status: 429, json: async () => ({ retry_after: 0.01 }) } : { status: 200, json: async () => ({ id: '1' }) });
 const r = await c.consultarWebhook(W(1), { fetchFn, dormir: async () => {} });
 assert.equal(r.status, 200); assert.equal(n, 3);
});

test('leitura das planilhas', () => {
 const conf = c.conferenciaDaPlanilha([['SEGMENTO', 'GROUP', 'QG', 'CONFERIDO', 'CRAFT', 'ROTA', 'BAÚ', 'GARAGEM PÚBLICA', 'PENDÊNCIA'],
  ['ARMAS', 'ARMAS04', 'X', 'NÃO', 'OK!', 'OK', 'OK', 'X', 'mapa novo']]);
 assert.deepEqual(conf.ARMAS04, { conferido: 'NÃO', craft: 'OK', rota: 'OK', bau: 'OK', garagemPublica: 'X', pendencia: 'mapa novo' });
 const wh = c.webhooksDaPlanilha([['SEG', 'GROUP'], ['ARMAS', 'ARMAS01', 'Armas01', W(1), W(2), 'Armas01Admin', W(3), W(4)]]);
 assert.deepEqual(wh.ARMAS01, { ilegalGeral: W(1), logsGeral: W(2), ilegalAdmin: W(3), logsAdmin: W(4) });
});
