/* High OS - PENDÊNCIAS DA PLANILHA (18/11/2026)
 *
 * Regra: o High OS e o High OS Dev só LEEM as planilhas. Tudo que muda
 * no painel fica no Firebase; o painel compara com a planilha e lista o
 * que está diferente para o Ítalo atualizar à mão.
 *
 * Cada pendência é uma célula (ou um Group inteiro a adicionar):
 *  { origem, aba, sheetId, sheetGid, group, campo, celula,
 *    naPlanilha, noHighOS, tipo, obs, status }
 * status: PENDENTE | RESOLVIDA (a planilha passou a bater) | IGNORADA.
 */

export const ORIGENS = {
  BLIPS: 'BLIPS COORDENADAS',
  DOC_FACCOES: 'DOCUMENTO DAS FACÇÕES',
  VIP: 'BENEFICIOS FACÇÕES',
  ACAO: 'VALORES AÇÃO BLIPADA'
};

const fold = v => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');

export function normalizarValor(v) {
  return String(v ?? '').trim().replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ').toUpperCase();
}

/* Mesmo campo do mesmo Group na mesma aba = mesma pendência (não duplica). */
export function pendenciaId(p) {
  return [p.origem, p.group || '-', p.campo || '-'].map(fold).join('__').slice(0, 300);
}

/* Assinatura do pedido: se o valor esperado mudar, uma pendência IGNORADA volta. */
export function assinatura(p) {
  return normalizarValor(p.noHighOS) + '|' + normalizarValor(p.celula);
}

/* Decide o que gravar depois de uma conferência.
 *  existentes: pendências já salvas (com id e status)
 *  novas: diferenças encontradas agora
 *  escopo: { origem, groups } - o que esta conferência cobriu de verdade.
 * Pendência PENDENTE do escopo que não apareceu de novo => RESOLVIDA. */
export function planejarConferencia(existentes = [], novas = [], { origem, groups = null } = {}) {
  const porId = new Map(existentes.map(p => [p.id, p]));
  const cobertos = groups ? new Set(groups.map(fold)) : null;
  const vistos = new Set();
  const gravar = [], resolver = [];
  for (const n of novas) {
    const id = pendenciaId(n);
    if (vistos.has(id)) continue;
    vistos.add(id);
    const antiga = porId.get(id);
    const ass = assinatura(n);
    if (antiga?.status === 'IGNORADA' && antiga.assinatura === ass) continue;
    if (antiga?.status === 'PENDENTE' && antiga.assinatura === ass &&
        normalizarValor(antiga.naPlanilha) === normalizarValor(n.naPlanilha)) continue;
    gravar.push({ ...n, id, assinatura: ass, status: 'PENDENTE' });
  }
  for (const p of existentes) {
    if (p.status !== 'PENDENTE' || p.origem !== origem || vistos.has(p.id)) continue;
    if (cobertos && !cobertos.has(fold(p.group))) continue;
    resolver.push(p.id);
  }
  return { gravar, resolver };
}

/* Pendências de célula fixa (checklist VIP, BUFF/NERF): confere lendo a célula. */
export function resolvidasPorCelula(pendentes = [], valoresPorChave = new Map()) {
  return pendentes.filter(p => p.status === 'PENDENTE' && p.celula &&
    valoresPorChave.has(p.aba + '!' + p.celula) &&
    normalizarValor(valoresPorChave.get(p.aba + '!' + p.celula)) === normalizarValor(p.noHighOS))
    .map(p => p.id);
}

export function linkCelula(p) {
  if (!p.sheetId) return '';
  const base = 'https://docs.google.com/spreadsheets/d/' + p.sheetId + '/edit';
  const gid = Number.isFinite(Number(p.sheetGid)) && p.sheetGid !== null && p.sheetGid !== '' ? '#gid=' + p.sheetGid : '';
  return base + gid + (gid && p.celula ? '&range=' + p.celula : '');
}
