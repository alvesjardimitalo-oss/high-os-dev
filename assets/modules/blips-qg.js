/* High OS - blips de cada QG da season.
   ---------------------------------------------------------------------
   A planilha traz TODAS as coordenadas planejadas do QG, mas na abertura
   da season a favela funciona so com o essencial (craft, iniciar rota e
   garagem publica). O resto e pedido depois, um blip por vez ou varios
   juntos, no modelo de solicitacao da cidade.

   Estados de um blip:
   - FUNCIONANDO: instalado na cidade; e o que vai para a ficha do Group.
   - SOLICITADO: pedido gerado e aguardando a cidade instalar.
   - PLANEJADO: tem coordenada, ainda nao foi pedido.
   - SEM_CDS: nao ha coordenada para pedir. */

export const ITENS_BLIP = [
 { id: 'farm', nome: 'Iniciar rota', campos: ['farm'] },
 { id: 'craft', nome: 'Craft', campos: ['craft'] },
 { id: 'garagemPublica', nome: 'Garagem Pública', campos: ['garagemPublicaBlip', 'garagemPublicaSpawn'], par: true },
 { id: 'garagemVip', nome: 'Garagem VIP', campos: ['garagemVipBlip', 'garagemVipSpawn'], par: true },
 { id: 'heliponto', nome: 'Heliponto', campos: ['helipontoBlip', 'helipontoSpawn'], par: true },
 { id: 'garagemBlindados', nome: 'Garagem de Blindados', campos: ['garagemBlindadosBlip', 'garagemBlindadosSpawn'], par: true },
 { id: 'bau', nome: 'Baú', campos: ['bau'] },
 { id: 'barbearia', nome: 'Barbearia', campos: ['barbearia'] },
 { id: 'lojaRoupas', nome: 'Loja de Roupas', campos: ['lojaRoupas'] },
 { id: 'tatuagem', nome: 'Tatuagem', campos: ['tatuagem'] },
 { id: 'shopDeluxe', nome: 'Shop Deluxe', campos: ['shopDeluxe'] },
 { id: 'shopExclusivo', nome: 'Shop Exclusivo', campos: ['shopExclusivo'] },
 { id: 'atm', nome: 'ATM', campos: ['atm'] },
 { id: 'arena', nome: 'Arena', campos: ['arena'] },
 { id: 'bar', nome: 'Bar', campos: ['bar'] },
 { id: 'telao', nome: 'Telão', campos: ['telaoCds'] }
];

/* O que funciona na abertura da season, para QG que ainda nao tem
   registro proprio de instalados. */
export const INSTALADOS_ABERTURA = ['farm', 'craft', 'garagemPublica'];

const txt = v => String(v == null ? '' : v).trim();

export function instaladosDe(q = {}) {
 return Array.isArray(q.instalados) ? q.instalados : INSTALADOS_ABERTURA;
}

export function temCds(q = {}, item) {
 return item.campos.some(c => txt(q.cds?.[c]));
}

export function estadoItem(q = {}, id) {
 const item = ITENS_BLIP.find(i => i.id === id);
 if (!item) return 'SEM_CDS';
 if (instaladosDe(q).includes(id)) return 'FUNCIONANDO';
 if (!temCds(q, item)) return 'SEM_CDS';
 if (q.solicitados && q.solicitados[id]) return 'SOLICITADO';
 return 'PLANEJADO';
}

export function linhaItem(q = {}, item) {
 const c = q.cds || {};
 if (item.par) {
  const [b, s] = item.campos.map(k => txt(c[k]));
  return `- Blip de ${item.nome}: Blip ${b || '—'} Spawn ${s || '—'}`;
 }
 return `- ${item.nome} ${txt(c[item.campos[0]]) || '—'}`;
}

/* Texto no padrao de solicitacao da cidade (bloco de codigo do Discord). */
export function textoSolicitacao(q = {}, ids = []) {
 const itens = ITENS_BLIP.filter(i => ids.includes(i.id) && temCds(q, i));
 if (!itens.length) return '';
 const linhas = [
  'Assunto',
  '',
  '- Inclusão / Alteração de blips de uma organização',
  '',
  'Solicitação',
  '',
  '- Inserir / Alterar os blips das coordenadas abaixo:',
  '',
  ...itens.flatMap(i => [linhaItem(q, i), '']),
  `- Permissão: ${txt(q.group) || '—'}`
 ];
 return '```\n' + linhas.join('\n') + '\n```';
}

/* Ficha do Group so com o que esta FUNCIONANDO. Preserva o resto do
   perfil (receitas do craft, telao ja configurado, uniforme...). */
export function fichaFuncionando(q = {}, { beneficios = {}, perfilTecnico = {} } = {}) {
 const inst = new Set(instaladosDe(q));
 const c = q.cds || {};
 const v = k => txt(c[k]);
 const ligado = id => inst.has(id);

 const camposItens = new Set(ITENS_BLIP.flatMap(i => i.campos));
 const ben = {};
 for (const [k, val] of Object.entries(beneficios || {})) if (!camposItens.has(k)) ben[k] = val;
 for (const item of ITENS_BLIP) if (ligado(item.id)) for (const k of item.campos) if (v(k)) ben[k] = v(k);

 const p = JSON.parse(JSON.stringify(perfilTecnico || {}));
 const op = p.operacional || {};
 const um = (id, campo) => ({ ...(op[id] || {}), cds: '' });
 p.craft = { ...(p.craft || {}), cds: ligado('craft') ? v('craft') : '' };
 p.farm = { ...(p.farm || {}), cds: ligado('farm') ? v('farm') : '' };
 const gar = [];
 if (ligado('garagemPublica')) gar.push({ tipo: 'PUBLICA', blip: v('garagemPublicaBlip'), spawn: v('garagemPublicaSpawn'), veiculos: '', vagas: '' });
 if (ligado('garagemVip')) gar.push({ tipo: 'FACCAO', blip: v('garagemVipBlip'), spawn: v('garagemVipSpawn'), veiculos: '', vagas: '' });
 const simples = (chave, id, campo) => (ligado(id) ? { ...(op[chave] || {}), cds: v(campo) } : um(chave));
 p.operacional = {
  ...op,
  localizacao: { nome: txt(q.local), cdsPrincipal: v('local') || v('farm') },
  bau: simples('bau', 'bau', 'bau'),
  barbearia: simples('barbearia', 'barbearia', 'barbearia'),
  roupas: simples('roupas', 'lojaRoupas', 'lojaRoupas'),
  tatuagem: simples('tatuagem', 'tatuagem', 'tatuagem'),
  arena: simples('arena', 'arena', 'arena'),
  bar: simples('bar', 'bar', 'bar'),
  lojaFac: ligado('shopExclusivo') ? { ...(op.lojaFac || {}), cds: v('shopExclusivo') }
   : ligado('shopDeluxe') ? { ...(op.lojaFac || {}), cds: v('shopDeluxe') } : um('lojaFac'),
  garagens: gar,
  helipontos: ligado('heliponto') ? [{ blip: v('helipontoBlip'), spawn: v('helipontoSpawn') }] : [],
  blindados: ligado('garagemBlindados')
   ? { ...(op.blindados || {}), blip: v('garagemBlindadosBlip'), spawn: v('garagemBlindadosSpawn') }
   : { vagas: '', blip: '', spawn: '', veiculos: '' },
  /* telao tem modelo, postit e caixas que nao vem da planilha: so liga a
     cds quando instalado e nunca apaga um telao ja configurado. */
  telao: ligado('telao') ? { ...(op.telao || {}), ativo: true, cds: v('telaoCds') } : (op.telao || { ativo: false, cds: '' })
 };
 return { beneficios: ben, perfilTecnico: p, cds: v('local') || v('farm') };
}
