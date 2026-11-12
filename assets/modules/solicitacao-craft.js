/* High OS - solicitacao de craft e rota no padrao da cidade.
   ---------------------------------------------------------------------
   As receitas ja moram no Group (perfilTecnico.craft.receitas). Daqui
   sai o texto que a cidade pede para cadastrar o craft e a rota de farm:
   um bloco por Group com nome do item, spawn e insumos, e no fim as
   observacoes fixas de permissao. Varios Groups podem ir juntos. */

/* Nome de exibicao dos insumos. O que nao estiver aqui sai pelo spawn. */
export const NOMES_INSUMO = {
 pistolbody: 'Corpo de Pistola', smgbody: 'Corpo de Sub', riflebody: 'Corpo de Rifle',
 sheetmetal: 'Chapa de Metal', dollar: 'Dólar', elastic: 'Elástico', rubber: 'Borracha',
 techtrash: 'Lixo Eletrônico', ziplock: 'Ziplock', weedbud: 'Bud de Maconha', kunk: 'Kunk',
 projectile: 'Projétil', gunpowder: 'Frasco de Pólvora', plastic: 'Plástico', explosives: 'Explosivos',
 misturaquimica: 'Mistura Química', electroniccomponents: 'Componentes Eletrônicos',
 washbleach: 'Alvejante', alcohol: 'Álcool', acetone: 'Acetona', sulfuric: 'Ácido Sulfúrico',
 acid: 'Ácido', tarp: 'Lona', fibrasin: 'Fibra Sintética', syringe: 'Seringa Universal',
 saline: 'Soro Fisiológico', paper: 'Papel', woodlog: 'Tora de Madeira',
 cartucho_de_tinta: 'Cartucho de Tinta', papel_de_dados_criptografados: 'Papel de dados criptografados'
};

const txt = v => String(v == null ? '' : v).trim();
const col = (v, n) => (txt(v) + ' '.repeat(n)).slice(0, Math.max(n, txt(v).length));

export function nomeInsumo(spawn, extra = {}) {
 return extra[spawn] || NOMES_INSUMO[spawn] || NOMES_INSUMO[String(spawn).toLowerCase()] || spawn;
}

export function linhaReceita(r = {}, extra = {}) {
 const ins = (r.insumos || []).map(i => {
  const spawn = Array.isArray(i) ? i[0] : i.spawn;
  const qtd = Array.isArray(i) ? i[1] : i.qtd;
  return `${nomeInsumo(spawn, extra)} x${qtd}`;
 }).join(', ');
 return `| ${col(r.nome, 33)} | ${col(r.spawn, 25)} | ${ins}`;
}

const CABECALHO = [
 '| NOME DO ITEM                      | SPAWN                     | INSUMOS E QUANTIDADES NECESSÁRIOS',
 '---------------------+-----------------------------------+---------------------------+--------------------------------------------------------'
];

/* grupos: [{group, receitas:[...]}] na ordem desejada. Groups sem
   receita ficam de fora (e sao devolvidos para o painel avisar). */
export function textoSolicitacaoCraft(grupos = [], extra = {}) {
 const com = grupos.filter(g => (g.receitas || []).length);
 if (!com.length) return { texto: '', semReceita: grupos.map(g => g.group) };
 const blocos = com.map(g => [`- ${txt(g.group)}:`, '', ...CABECALHO, ...g.receitas.map(r => linhaReceita(r, extra))].join('\n'));
 const texto = '```\n' + blocos.join('\n\n') + '\n\n' +
  '- Obs: Acima estão o nome do item, o spawn do item a ser craftado e a receita necessária para craftar; adicionar os insumos usados na rota de farm dos grupos mencionados acima.\n\n' +
  '- Fixar a permissão na rota e no craft para cada group mencionado na solicitação.\n```';
 return { texto, semReceita: grupos.filter(g => !(g.receitas || []).length).map(g => g.group) };
}
