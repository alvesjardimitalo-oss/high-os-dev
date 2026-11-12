/* High OS - insercao dos Groups de uma season a partir da aba
   BLIPS COORDENADAS.
   ---------------------------------------------------------------------
   A planilha ja traz tudo: GROUP, LOCAL, PRODUTO e as coordenadas de
   cada QG. Esta rotina transforma isso em duas coisas no Firebase:

   1. o pacote da season (highos/data/seasons/{id}) com cada QG ja
      vinculado ao seu Group;
   2. a ficha de cada Group (highos/data/faccoes/{group}).

   Cuidados:
   - QG que ja esta gravado na season e reaproveitado (mesma chave), para
     nao perder edicao feita no painel. Coordenada vinda da planilha
     prevalece; campo vazio na planilha mantem o que o painel tem.
   - QG gravado que nao aparece mais na planilha NAO e apagado: fica
     listado para conferencia.
   - Ficha com o mesmo nome vinda de outra season (ex.: Armas01 da S2) e
     copiada para um arquivo ({season}__{group}) antes de a ficha da
     season nova ser criada limpa. Nada da season anterior se perde. */

import { parseQgCards, montarQgs, chaveQg } from './planilha-qgs.js';

const norm=v=>String(v==null?'':v).normalize('NFD').replace(/[̀-ͯ]/g,'')
 .replace(/\s+/g,' ').trim().toUpperCase();

/* Algumas celulas de LOCAL trazem a coordenada colada no nome
   ("FAVELA VIVE 1722.33, 1450.51, 117.98, 257.96"). Separamos as duas. */
const RE_CDS_FINAL=/\s*(-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?)?)\s*$/;
export function separarLocal(v=''){
 const t=String(v||'').trim();
 const m=t.match(RE_CDS_FINAL);
 if(!m)return {nome:t,cds:''};
 return {nome:t.slice(0,m.index).trim(),cds:m[1].replace(/\s+/g,'')};
}

/* Segmento oficial a partir do Group: o nome do Group manda, igual ao
   sincronizador da planilha. */
const SEGMENTOS=[
 ['ILEGALMECHANIC','Mecânica Ilegal'],['ILEGALMEDIC','Hospital Ilegal'],
 ['ARMAS','Armas'],['MUNICAO','Munição'],['LAVAGEM','Lavagem'],
 ['DESMANCHE','Desmanche'],['DROGAS','Drogas'],['ESTELIONATARIOS','Estelionatários'],
 ['GALPAO','Galpões'],['CONTRABANDO','Contrabando']
];
export function segmentoDoGroup(group='',setor=''){
 const g=norm(group).replace(/[^A-Z0-9]/g,'');
 for(const [p,nome] of SEGMENTOS)if(g.startsWith(p))return nome;
 const s=norm(setor);
 for(const [p,nome] of SEGMENTOS)if(s.replace(/[^A-Z]/g,'').startsWith(p))return nome;
 return String(setor||'').trim();
}

export function idArquivo(seasonAnterior,group){
 return `${String(seasonAnterior||'anterior').replace(/[^a-zA-Z0-9]/g,'')}__${group}`;
}

/* Le a grade da aba e devolve so os QGs com Group preenchido, ja com o
   LOCAL limpo. Os cartoes vazios (Setor 7, Setor 8...) ficam de fora. */
export function qgsDaGrade(grade=[]){
 const cards=parseQgCards(grade);
 const qgs=montarQgs(cards);
 return qgs.map(q=>{
  const {nome,cds}=separarLocal(q.local);
  const out={...q,local:nome,cds:{...q.cds}};
  if(cds&&!out.cds.local)out.cds.local=cds;
  return out;
 });
}

/* Monta o plano completo, sem gravar nada. Puro: recebe os dados ja
   lidos e devolve o que muda. */
export function planejar({qgsPlanilha=[],qgsSalvos=[],faccoes=[],seasonId='s3',seasonAnterior='s2'}){
 const comGroup=qgsPlanilha.filter(q=>String(q.group||'').trim());
 const semGroupPlanilha=qgsPlanilha.filter(q=>!String(q.group||'').trim());

 /* Groups repetidos na planilha: o segundo nao entra, vai para aviso. */
 const vistos=new Set(), repetidos=[];
 const unicos=[];
 for(const q of comGroup){
  const g=norm(q.group);
  if(vistos.has(g)){repetidos.push(q.group);continue}
  vistos.add(g); unicos.push(q);
 }

 const salvos=[...qgsSalvos];
 const usados=new Set();
 const acharSalvo=q=>{
  const tentativas=[
   s=>norm(s.group)&&norm(s.group)===norm(q.group),
   s=>norm(separarLocal(s.local).nome)&&norm(separarLocal(s.local).nome)===norm(q.local),
   s=>s.origem&&q.origem&&s.origem.linha===q.origem.linha&&s.origem.coluna===q.origem.coluna
  ];
  for(const t of tentativas){
   const i=salvos.findIndex((s,idx)=>!usados.has(idx)&&t(s));
   if(i>=0){usados.add(i);return salvos[i]}
  }
  return null;
 };

 const qgsFinal=[], qgsNovos=[], qgsAtualizados=[];
 for(const q of unicos){
  const s=acharSalvo(q);
  const group=String(q.group).trim();
  const setor=segmentoDoGroup(group,q.setor);
  if(s){
   const cds={...(s.cds||{})};
   for(const [k,v] of Object.entries(q.cds||{}))if(String(v||'').trim())cds[k]=String(v).trim();
   const reg={...s,group,local:q.local||s.local||'',produto:q.produto||s.produto||'',
    setor:s.setor||setor,vinculado:true,origem:q.origem,avisos:q.avisos||[],cds};
   qgsFinal.push(reg); qgsAtualizados.push(reg);
  }else{
   const reg={...q,group,setor:q.setor||setor,vinculado:true,chave:chaveQg({campos:{group},linha:q.origem?.linha,coluna:q.origem?.coluna})};
   qgsFinal.push(reg); qgsNovos.push(reg);
  }
 }
 /* QGs salvos que a planilha nao tem mais: ficam como estao. */
 const foraDaPlanilha=salvos.filter((s,idx)=>!usados.has(idx));
 for(const s of foraDaPlanilha)qgsFinal.push(s);

 /* chaves unicas */
 const chaves=new Set();
 for(const q of qgsFinal){
  let c=q.chave||chaveQg({campos:{group:q.group,local:q.local}});
  let k=2; const base=c;
  while(chaves.has(c))c=base+'_'+(k++);
  q.chave=c; chaves.add(c);
 }

 /* fichas */
 const porId=new Map(faccoes.map(f=>[String(f.id||f.group),f]));
 const criar=[], arquivar=[], atualizar=[];
 for(const q of qgsFinal){
  if(!q.vinculado||!q.group)continue;
  const g=q.group;
  const existente=porId.get(g)||faccoes.find(f=>norm(f.group)===norm(g)&&!f.arquivadoSeason);
  const ficha=fichaNova(q,seasonId);
  if(!existente){criar.push(ficha);continue}
  if(String(existente.seasonId||'')===seasonId){
   atualizar.push({id:existente.id||g,patch:patchFicha(q,existente)});
   continue;
  }
  const origemSeason=existente.seasonId||seasonAnterior;
  const idArq=idArquivo(origemSeason,g);
  const {id:_id,...dados}=existente;
  arquivar.push({de:existente.id||g,para:idArq,dados:{...dados,
   group:idArq,groupOriginal:existente.group||g,
   arquivadoSeason:origemSeason,arquivadoPorSeason:seasonId}});
  criar.push(ficha);
 }

 return {qgsFinal,qgsNovos,qgsAtualizados,foraDaPlanilha,semGroupPlanilha,repetidos,criar,arquivar,atualizar};
}

/* A ficha nasce no mesmo formato do VINCULAR GROUP da tela de QGs,
   ja com as coordenadas da planilha nos beneficios - e de la que o
   sincronizador e as solicitacoes leem. */
function beneficiosDe(q){
 const c=q.cds||{};
 const b={};
 for(const k of ['craft','bau','barbearia','lojaRoupas','tatuagem','garagemVipBlip','garagemVipSpawn',
  'garagemPublicaBlip','garagemPublicaSpawn','helipontoBlip','helipontoSpawn',
  'garagemBlindadosBlip','garagemBlindadosSpawn','shopDeluxe','shopExclusivo','academia','atm','arena','bar','telaoCds'])
  if(String(c[k]||'').trim())b[k]=String(c[k]).trim();
 return b;
}
export function fichaNova(q,seasonId){
 return {
  group:q.group, segmento:segmentoDoGroup(q.group,q.setor), qg:q.local||'', produto:q.produto||'',
  cds:q.cds?.local||q.cds?.farm||'',
  status:'INATIVA', faccao:'', lider:'', staff:'',
  seasonId, qgChave:q.chave,
  beneficios:beneficiosDe(q)
 };
}
function patchFicha(q,existente){
 return {
  segmento:existente.segmento||segmentoDoGroup(q.group,q.setor),
  qg:q.local||existente.qg||'', produto:q.produto||existente.produto||'',
  qgChave:q.chave,
  beneficios:{...(existente.beneficios||{}),...beneficiosDe(q)}
 };
}

export function resumoPlano(p){
 return {
  groups:p.qgsFinal.filter(q=>q.vinculado).length,
  qgsNovos:p.qgsNovos.length,
  qgsAtualizados:p.qgsAtualizados.length,
  foraDaPlanilha:p.foraDaPlanilha.length,
  fichasNovas:p.criar.length,
  fichasArquivadas:p.arquivar.length,
  fichasAtualizadas:p.atualizar.length,
  repetidos:p.repetidos.length
 };
}
