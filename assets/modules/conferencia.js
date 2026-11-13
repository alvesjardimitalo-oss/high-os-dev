/* High OS - Conferência básica dos QGs e webhooks dos baús.
   ---------------------------------------------------------------------
   Antes isso vivia na planilha "Documento das facções do Ilegal"
   (aba Conferencia Basica) e numa planilha privada de webhooks. Agora:

   - a conferência (craft, rota, baú, garagem pública, pendência) fica
     no próprio QG da season, junto das coordenadas;
   - os webhooks ficam em highos/data/webhooks_baus/{GROUP}, que só
     ADMIN lê (webhook é senha de canal: quem tem o link posta lá).

   Cada Group tem 2 baús: o geral (nome do Group, ex.: Armas01) e o
   admin (Armas01Admin). Cada baú posta em 2 Discords: o do Ilegal e o
   de logs da High. Logo, 4 webhooks por Group.

   O teste roda NO NAVEGADOR de quem clica: o Discord bloqueia consultas
   em rajada que saem de servidores (Google, etc.), mas aceita as da
   internet do usuário. Só CONSULTA (GET): nada é postado nos canais. */

export const ITENS_CONF = [
 { id: 'craft', nome: 'Craft' },
 { id: 'rota', nome: 'Rota' },
 { id: 'bau', nome: 'Baú' },
 { id: 'garagemPublica', nome: 'Garagem pública' }
];
export const OPCOES_CONF = ['OK', 'X', 'SOLICITADO'];

export const CAMPOS_WEBHOOK = [
 { id: 'ilegalGeral', nome: 'Ilegal (geral)', bau: 'geral', servidor: 'ILEGAL' },
 { id: 'logsGeral', nome: 'Logs High (geral)', bau: 'geral', servidor: 'LOGS' },
 { id: 'ilegalAdmin', nome: 'Ilegal (admin)', bau: 'admin', servidor: 'ILEGAL' },
 { id: 'logsAdmin', nome: 'Logs High (admin)', bau: 'admin', servidor: 'LOGS' }
];

export const WEBHOOK_RE = /^https:\/\/(canary\.|ptb\.)?discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;

const txt = v => String(v == null ? '' : v).trim();
const up = v => txt(v).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

/* ARMAS01 -> Armas01 / ILEGALMECHANIC01 -> IlegalMechanic01 (nome do baú na cidade) */
export function nomeBau(group) {
 const g = up(group);
 if (!g) return '';
 const m = g.match(/^ILEGAL(MECHANIC|MEDIC)(\d+)$/);
 if (m) return 'Ilegal' + m[1][0] + m[1].slice(1).toLowerCase() + m[2];
 return g[0] + g.slice(1).toLowerCase();
}
export const nomesBaus = group => ({ geral: nomeBau(group), admin: nomeBau(group) ? nomeBau(group) + 'Admin' : '' });

export function conferenciaDe(q = {}) {
 const c = q.conferencia || {};
 return {
  conferido: c.conferido === 'SIM' ? 'SIM' : 'NÃO',
  craft: c.craft || '', rota: c.rota || '', bau: c.bau || '', garagemPublica: c.garagemPublica || '',
  pendencia: c.pendencia || ''
 };
}

/* Quantos dos 4 webhooks estão no formato certo */
export function contarWebhooks(w = {}) {
 return CAMPOS_WEBHOOK.filter(c => WEBHOOK_RE.test(txt(w[c.id]))).length;
}

/* Onde cada link aparece: { url: [{group, campo}] } (link limpo de espaços) */
export function indiceWebhooks(todos = {}) {
 const idx = {};
 for (const [group, w] of Object.entries(todos)) for (const c of CAMPOS_WEBHOOK) {
  const u = txt(w?.[c.id]);
  if (u) (idx[u] = idx[u] || []).push({ group, campo: c.id });
 }
 return idx;
}

/* "Armas03 (Ilegal) = Armas03Admin (Ilegal)" — onde mais o link deste campo está colado */
export function repetidoEm(group, campo, url, idx) {
 const u = txt(url);
 if (!u || !idx[u]) return [];
 return idx[u].filter(x => !(x.group === group && x.campo === campo)).map(x => {
  const c = CAMPOS_WEBHOOK.find(k => k.id === x.campo);
  const b = nomesBaus(x.group);
  return `${c.bau === 'admin' ? b.admin : b.geral} (${c.servidor === 'ILEGAL' ? 'Ilegal' : 'Logs High'})`;
 });
}

/* Validação ao salvar: formato e repetição em qualquer outro baú */
export function validarWebhooks(group, w = {}, todos = {}) {
 const outros = { ...todos };
 delete outros[group];
 const idx = indiceWebhooks({ ...outros, [group]: w });
 const erros = [];
 for (const c of CAMPOS_WEBHOOK) {
  const u = txt(w[c.id]);
  if (!u) continue;
  if (!WEBHOOK_RE.test(u)) { erros.push(`${c.nome}: não é um link de webhook do Discord`); continue; }
  const rep = repetidoEm(group, c.id, u, idx);
  if (rep.length) erros.push(`${c.nome}: já está em ${rep.join(', ')}`);
 }
 return erros;
}

/* Resultado do teste de um Group a partir das respostas do Discord.
   resp: { url: {status, corpo} } */
export function avaliarTeste(group, w = {}, resp = {}, idx = {}) {
 const prob = [], guilds = { ILEGAL: new Set(), LOGS: new Set() }, canais = {};
 let preenchidos = 0;
 for (const c of CAMPOS_WEBHOOK) {
  const u = txt(w[c.id]);
  if (!u) { prob.push(c.nome + ': vazio'); continue; }
  preenchidos++;
  if (!WEBHOOK_RE.test(u)) { prob.push(c.nome + ': link fora do padrão'); continue; }
  const rep = repetidoEm(group, c.id, u, idx);
  if (rep.length) prob.push(`${c.nome}: repetido em ${rep.join(', ')}`);
  const r = resp[u];
  if (!r) { prob.push(c.nome + ': não testado'); continue; }
  if (r.status === 200) {
   if (r.corpo?.guild_id) guilds[c.servidor].add(r.corpo.guild_id);
   if (r.corpo?.channel_id) (canais[r.corpo.channel_id] = canais[r.corpo.channel_id] || []).push(c.nome);
  } else if (r.status === 401 || r.status === 404) prob.push(c.nome + ': webhook apagado ou inválido');
  else if (r.status === 429) prob.push(c.nome + ': Discord pediu para esperar, teste de novo');
  else prob.push(c.nome + ': sem resposta do Discord' + (r.status ? ` (HTTP ${r.status})` : ''));
 }
 guilds.ILEGAL.forEach(g => { if (guilds.LOGS.has(g)) prob.push('Ilegal e Logs High no MESMO servidor (coluna trocada?)'); });
 Object.values(canais).forEach(n => { if (n.length > 1) prob.push(n.join(' e ') + ' no mesmo canal'); });
 if (!preenchidos) return { ok: false, texto: '' };
 return prob.length ? { ok: false, texto: 'FALHOU · ' + prob.join(' / ') } : { ok: true, texto: 'OK · 4/4 funcionando' };
}

/* Consulta um webhook (GET) respeitando o "espere" do Discord */
export async function consultarWebhook(url, { fetchFn = globalThis.fetch, dormir = ms => new Promise(r => setTimeout(r, ms)), tentativas = 6 } = {}) {
 for (let t = 0; t < tentativas; t++) {
  try {
   const r = await fetchFn(url, { method: 'GET' });
   let corpo = {};
   try { corpo = await r.json(); } catch (e) {}
   if (r.status === 429) { await dormir(Math.min(10000, (Number(corpo.retry_after) || 2) * 1000) + 300); continue; }
   return { status: r.status, corpo };
  } catch (e) { await dormir(1500); }
 }
 return { status: 0, corpo: {} };
}

/* Lê a aba "Conferencia Basica" da planilha (A:I) -> { GROUP: conferencia } */
export function conferenciaDaPlanilha(linhas = []) {
 const out = {};
 const cab = (linhas[0] || []).map(up);
 const col = nome => cab.findIndex(c => c.startsWith(nome));
 const i = { group: col('GROUP'), conf: col('CONFERIDO'), craft: col('CRAFT'), rota: col('ROTA'), bau: col('BAU'), gar: col('GARAGEM'), pend: col('PENDENCIA') };
 const st = v => { const s = up(v); return s === 'OK!' ? 'OK' : (OPCOES_CONF.includes(s) ? s : ''); };
 for (const l of linhas.slice(1)) {
  const g = up(l[i.group]);
  if (!g) continue;
  out[g] = { conferido: up(l[i.conf]) === 'SIM' ? 'SIM' : 'NÃO', craft: st(l[i.craft]), rota: st(l[i.rota]), bau: st(l[i.bau]),
   garagemPublica: st(l[i.gar]), pendencia: txt(l[i.pend]) };
 }
 return out;
}

/* Lê a aba "Webhooks dos Baús" (B=Group, D,E,G,H=links) -> { GROUP: webhooks } */
export function webhooksDaPlanilha(linhas = []) {
 const out = {};
 for (const l of linhas.slice(1)) {
  const g = up(l[1]);
  if (!g) continue;
  out[g] = { ilegalGeral: txt(l[3]), logsGeral: txt(l[4]), ilegalAdmin: txt(l[6]), logsAdmin: txt(l[7]) };
 }
 return out;
}
