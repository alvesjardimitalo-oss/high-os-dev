/**
 * Planejador econômico High OS — cálculo puro.
 * Premiações atuais já incorporam buff/nerf histórico; nunca somar de novo.
 * Os valores são exclusivamente da economia fictícia de FiveM / High RP.
 */
export const ACOES_SOURCE = 'https://alvesjardimitalo-oss.github.io/high-mercado-negro/data/acoes-blipadas.json';
export const CATALOGO_SOURCE = 'https://alvesjardimitalo-oss.github.io/high-mercado-negro/data/catalogo.json';
export const PHOTO_ROOT = 'https://alvesjardimitalo-oss.github.io/high-mercado-negro/assets/itens/';
export const norm = text => String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase();
const alias = Object.freeze({
 'ARMA PISTOLA':'PISTOLA T54',
 'ARMA SUB':'UZI',
 'ARMA FUZIL':'FAL',
 'MUNICAO PISTOLA (X100)':'PISTOLA 100X',
 'MUNICAO SUB (X200)':'SMG 200X',
 'MUNICAO FUZIL (X250)':'FUZIL 250X'
});
export const DEFAULT_WASH = .3;
export function numeric(v){
 if(v==null||typeof v==='boolean'||String(v).trim()==='')return null;
 const n=Number(v);
 return Number.isFinite(n)?n:null;
}
export function getRules(action,location=null){
 const rules=location?.regras_confronto?.length?location.regras_confronto:action?.regras_confronto||[];
 return rules.map(r=>({invasores:numeric(r.invasores),policiais:numeric(r.policiais),refens:numeric(r.refens)}))
 .filter(r=>Number.isInteger(r.invasores)&&r.invasores>0).sort((a,b)=>a.invasores-b.invasores);
}
export const availableTeams=(action,location)=>[...new Set(getRules(action,location).map(r=>r.invasores))];
export const defaultTeam=(action,location)=>availableTeams(action,location).at(-1)??Math.max(1,...(action?.itens||[]).map(i=>Number(i.quantidade)||0));
export function priceOf(name,catalog,mode='pista'){
 const lookup=alias[norm(name)]||name;
 if(norm(name)==='ARMA BRANCA')
  return {name,unit:mode==='pista'?975:null,source:'Planilha VALORES AÇÃO BLIPADA • preço de pista',missing:mode!=='pista'};
 const item=(catalog?.itens||[]).find(x=>norm(x.item)===norm(lookup)&&x.status==='ativo')
 ||(catalog?.itens||[]).find(x=>norm(x.item)===norm(lookup));
 // Itens desativados não podem subsidiar propostas de alteração de prêmios.
 // Mostrar seu último preço como atual ocultaria um insumo indisponível.
 const listedInactive=!!item&&item.status!=='ativo';
 const unit=listedInactive?null:numeric(item?.[mode]);
 return {name:item?.item||lookup,unit,
  source:listedInactive?'Item inativo no Mercado Negro':item?'Mercado Negro':'Não encontrado no catálogo',
  missing:unit===null,listedInactive};
}
function qtyFor(item,team,mode){
 const official=Math.max(0,Number(item?.quantidade)||0);
 if(mode!=='por-jogador'||/^PENDRIVE/i.test(norm(item?.nome)))return official;
 return team;
}
export function kitFor(action,catalog,{team,priceMode='pista',kitMode='por-jogador',quantities={},prices={},reuse=.0}={}){
 const nPlayers=Number(team)||defaultTeam(action);
 const recovery=Math.min(1,Math.max(0,numeric(reuse)??0));
 const lines=(action?.itens||[]).map((item,i)=>{
  const q=numeric(quantities[i]);
  const qty=q===null?qtyFor(item,nPlayers,kitMode):Math.max(0,Math.floor(q));
  const p=priceOf(item.nome,catalog,priceMode);
  const override=numeric(prices[i]);
  const unit=override===null?p.unit:Math.max(0,override);
  return {index:i,name:item.nome,qty,officialQty:Number(item.quantidade)||0,
   unit,total:unit===null?null:qty*unit,missing:unit===null,source:override!==null?'Ajustado na simulação':p.source,
   reference:p.name};
 });
 const missing=lines.filter(i=>i.missing).map(i=>i.name);
 const total=missing.length?null:lines.reduce((sum,l)=>sum+l.total,0);
 const official=numeric(action?.custo);
 return {lines,missing,total,official,comparison:total===null||official===null?null:total-official,
  // Contabilizar o kit integral é a hipótese conservadora; recuperação editável pelo gestor.
  effectiveCost:total===null?null:total*(1-recovery),recovery,
  baselineMismatch:kitMode==='oficial'&&total!==null&&official!==null&&Math.abs(total-official)>1};
}
export function calculateAction(action,catalog,opts={}){
 const location=opts.location||null;
 const allowed=availableTeams(action,location);
 const team=Number(opts.team)||defaultTeam(action,location);
 const rule=getRules(action,location).find(r=>r.invasores===team)||null;
 const teamValid=allowed.includes(team);
 const tax=Math.min(.99,Math.max(0,numeric(opts.tax)??DEFAULT_WASH));
 const targetPerPlayer=Math.max(0,numeric(opts.targetPerPlayer)??20000);
 const targetROI=Math.max(0,numeric(opts.roi)??.25);
 const tolerance=Math.max(0,numeric(opts.tolerance)??.25);
 const kit=kitFor(action,catalog,{...opts,team});
 const cost=kit.effectiveCost;
 const min=numeric(action?.premio_min), max=numeric(action?.premio_max);
 const netMin=min===null||cost===null?null:min*(1-tax)-cost;
 const netMax=max===null||cost===null?null:max*(1-tax)-cost;
 const perPlayer=netMin===null?null:netMin/team;
 const targetProfit=cost===null?null:Math.max(targetPerPlayer*team,cost*targetROI);
 const payoutNeeded=targetProfit===null?null:Math.ceil((cost+targetProfit)/(1-tax));
 const currentSpread=min>0&&max!==null?Math.max(0,max/min-1):.15;
 const payoutMax=payoutNeeded===null?null:Math.ceil(payoutNeeded*(1+currentSpread));
 const delta=payoutNeeded===null||min===null?null:payoutNeeded-min;
 const status=action?.status==='inativo'?'INATIVA':!teamValid?'EQUIPE INVÁLIDA':
   kit.missing.length?'INSUMO SEM PREÇO':kit.baselineMismatch?'REVISAR CUSTO':
   netMin===null?'SEM PREMIAÇÃO':
   netMin<targetProfit*.95?'BUFF':
   netMin>targetProfit*(1+tolerance)?'NERF':'MANTER';
 const proposedNet=payoutNeeded===null||cost===null?null:payoutNeeded*(1-tax)-cost;
 return {name:action?.nome,status,team,teamValid,allowed,rule,kit,tax,targetROI,targetPerPlayer,
  targetProfit,min,max,netMin,netMax,perPlayer,roi:netMin===null||!cost?null:netMin/cost,
  payoutNeeded,payoutMax,delta,proposedNet,proposedPerPlayer:proposedNet===null?null:proposedNet/team,
  buffIncluded:Number(action?.buff)||0,nerfIncluded:Number(action?.nerf)||0,
  payoutAdjustable:status==='BUFF'||status==='NERF'||status==='MANTER'};
}
export const photoUrl=(image)=>{
 if(!/^[\w.\-]+\.(?:webp|png|jpe?g)$/i.test(String(image||'')))return '';
 return PHOTO_ROOT+encodeURIComponent(image);
};
