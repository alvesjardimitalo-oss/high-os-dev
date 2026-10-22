import {ACOES_SOURCE,CATALOGO_SOURCE,calculateAction,defaultTeam,availableTeams,getRules,photoUrl,norm,priceOf} from './acoes-core.js?v=2';
import {RANKING_MODES,buildActionRankings} from './acoes-ranking.js?v=1';
import {makePriceReference,assessPriceChanges,analyzeDecision,applySheetPrizeOverrides,recommendedMaximum,DEFAULT_MANAGER_WIN_CHANCE} from './acoes-inteligencia.js?v=3';
import {buildManagementBoard,filterManagementEntries} from './acoes-gestao.js?v=1';
import {createActionWorkspace} from './acoes-workspace.js?v=1';

const el=id=>document.getElementById(id);
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(x):'A confirmar';
const percent=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:1}).format(x):'—';
let root,ready=false,actions=[],catalog=null,meta=null,selection='',localIndex=0;
let approveHandler=null,approvedThisSession=new Set();
let onReadReference=null,onSaveReference=null,onRejectAction=null,onReadDecisions=null,onReadSheet=null;
let reference=null,sheetOverrides=[],publishedActions=[],lastPriceRead=null,workspace=null;
const state={team:0,search:'',status:'ATIVAS',priceMode:'pista',kitMode:'oficial',priceShift:0,ammoUse:.25,accessConsumed:true,roi:.25,
 targetPerPlayer:20000,tolerance:.25,tax:.3,rankMode:'lucro-total',rankLimit:10,listLimit:24,quantities:{},prices:{},manualPayout:null,manualMaxPayout:null,teamPayout:'publicado',policeWaitMinutes:null,estimatedActionMinutes:null,winChance:DEFAULT_MANAGER_WIN_CHANCE,targetHourly:0};
const management={filter:'TODAS',sort:'PRIORIDADE',search:'',showAll:false,
 winChance:DEFAULT_MANAGER_WIN_CHANCE,policeWaitMinutes:null,estimatedActionMinutes:null};
const managementOptions=()=>({tax:state.tax,ammoUse:state.ammoUse,
 accessConsumed:state.accessConsumed,roi:state.roi,targetPerPlayer:state.targetPerPlayer,
 reference,winChance:null,policeWaitMinutes:null,
 estimatedActionMinutes:management.estimatedActionMinutes});
const action=()=>actions.find(a=>a.nome===selection);
const place=()=>action()?.locais?.[localIndex]||null;
const options=()=>({...state,location:place()});
const decision=()=>{
 const d=analyzeDecision(action(),catalog,{...options(),team:state.team,referenceTeam:defaultTeam(action()),reference});
 if(action()?.origemCadastro!=='OFICIAL')d.eligibleForSheet=false;
 return d;
};
const combinePublished=()=>workspace?workspace.merged(applySheetPrizeOverrides(publishedActions,sheetOverrides)):
 applySheetPrizeOverrides(publishedActions,sheetOverrides);
function repaintRegistry(){
 actions=combinePublished();
 if(!action())selection=actions.find(a=>a.status!=='inativo')?.nome||actions[0]?.nome||'';
 if(action())state.team=defaultTeam(action());
 render();
}
const payoutPair=(title,min,max,style='')=>
 '<div class="ap-recommend-pair '+style+'"><span class="ap-recommend-pair-title">'+safe(title)+'</span>'+
 '<div class="ap-recommend-pair-values">'+
 '<span><small>VALOR MÍNIMO</small><strong>'+safe(money(min))+'</strong></span>'+
 '<span><small>VALOR MÁXIMO</small><strong>'+safe(money(max))+'</strong></span>'+
 '</div></div>';
function renderApprovalPayoutRange(d){
 const node=el('apDecisionPayoutCompare');if(!node)return;
 const p=d.calc;
 const custom=Number.isFinite(state.manualPayout)&&state.manualPayout>0;
 const min=custom?state.manualPayout:d.recommendedMin;
 const max=custom?(Number.isFinite(state.manualMaxPayout)?state.manualMaxPayout:recommendedMaximum(p.min,p.max,min)):d.recommendedMax;
 node.innerHTML='<div class="ap-recommend-top"><b>CONFERÊNCIA DOS DOIS PRÊMIOS</b>'+
  '<span>'+safe(d.direction)+'</span></div>'+
  '<div class="ap-recommend-two-columns">'+
  payoutPair('ATUAIS • SUJO',p.min,p.max)+
  payoutPair(custom?'MANUAL • PROPOSTO':'RECOMENDADOS • SUJO',min,max,'ap-recommend-final')+
  '</div><p class="ap-row-muted">'+safe(p.team)+' invasor(es) / '+safe(p.rule?.policiais??'?')+' policiais • cooldown '+safe(action()?.cooldown_segundos?Math.ceil(action().cooldown_segundos/60)+' min':'não informado')+'. Mínimo e máximo podem ser definidos no cadastro ou manualmente para o Suricato; a planilha histórica pode calcular o máximo por fórmula.</p>';
}

const kpi=(label,value,style='',info='')=>'<div class="ap-kpi '+style+'"><small>'+safe(label)+'</small><strong>'+safe(value)+'</strong>'+(info?'<div class="ap-extra">'+safe(info)+'</div>':'')+'</div>';
const chip=s=>'<span class="ap-tag '+(['BUFF','NERF','REVISAR CUSTO','INSUMO SEM PREÇO','EQUIPE INVÁLIDA'].includes(s)?'warning':s==='MANTER'?'good':'')+'">'+safe(s)+'</span>';
function choose(name){
 selection=name;localIndex=0;state.prices={};state.quantities={};state.manualPayout=null;state.manualMaxPayout=null;
 state.team=defaultTeam(action());el('apManual').value='';el('apManualMax').value='';render();workspace?.openProfile();
}


function renderManagement(){
 if(!catalog||!el('apManagementList'))return;
 const report=buildManagementBoard(actions,catalog,managementOptions());
 const k=report.stats;
 el('apManagementKpis').innerHTML=[
  kpi('Ações ativas',String(k.active),'gold',k.inactive+' inativas'),
  kpi('Revisão prioritária',String(k.revisao),k.revisao?'bad':'good','Inclui dados inconsistentes'),
  kpi('Dados pendentes',String(k.pendentes),k.pendentes?'bad':'good','Preço, prêmio ou equipe'),
  kpi('Afetadas por preços',report.hasReference?String(k.impactoPrecos):'Sem base',k.impactoPrecos?'gold':'','Variação desde a referência'),
  kpi('Lucro mediano por jogador',money(k.lucroMedianoMembro),k.lucroMedianoMembro<0?'bad':'good','Vitória com prêmio mínimo')
 ].join('');
 const results=filterManagementEntries(report.entries,{filter:management.filter,sort:management.sort,query:management.search});
 const pageRows=management.showAll?results:results.slice(0,8);
 const expand=el('apManageShowAll');
 if(expand){expand.hidden=results.length<=8;expand.textContent=management.showAll?'Mostrar apenas prioridades':'Ver todas ('+results.length+')';}
 el('apManagementList').innerHTML=pageRows.length?pageRows.map(item=>{
  const image=actionPhoto(item.action),tone=!item.valid||item.netMin<0?'urgent':item.priority>=3?'warn':'';
  const reason=item.reason.slice(0,2).join(' • ');
  return '<tr><td><span class="ap-management-action">'+
   (image?'<img src="'+safe(image)+'" loading="lazy" alt="">':'')+
   '<span><b>'+safe(item.nome)+'</b><small>'+safe(item.team)+' invasores'+
   (item.active?'':' • INATIVA')+'</small></span></span></td>'+
   '<td><span class="ap-management-diagnosis '+tone+'">'+safe(item.status)+'</span>'+
   '<small class="ap-management-reason" title="'+safe(item.reason.join(' • '))+'">'+safe(reason)+'</small></td>'+
   '<td>'+(item.cooldownMinutes===null?'A confirmar':safe(item.cooldownMinutes)+' min')+'</td>'+ 
   '<td>'+safe(money(item.capital))+'</td>'+
   '<td>'+safe(money(item.winCost))+'</td>'+
   '<td class="'+(item.netMin!==null&&item.netMin<0?'ap-negative':'ap-positive')+'">'+safe(money(item.netMin))+'</td>'+
   '<td class="'+(item.perPlayer!==null&&item.perPlayer<0?'ap-negative':'ap-positive')+'">'+safe(money(item.perPlayer))+'</td>'+
   '<td class="'+(item.expected!==null&&item.expected<0?'ap-negative':'')+'">'+
   (item.expected===null?'—':safe(money(item.expected)))+'</td>'+
   '<td class="'+(item.expectedMemberHour!==null&&item.expectedMemberHour<0?'ap-negative':'')+'">'+
   (item.expectedMemberHour===null?'—':safe(money(item.expectedMemberHour)))+'</td>'+
   '<td><button type="button" class="ap-management-open" data-ap-manage="'+safe(item.nome)+'">Analisar →</button></td></tr>';
 }).join(''):'<tr><td colspan="10" class="ap-row-muted">Nenhuma ação corresponde aos filtros atuais.</td></tr>';
 el('apManagementMethod').textContent=
  results.length+' ações exibidas • '+k.valid+' ativas com cenário calculável • '+k.emPrejuizo+
  ' com prejuízo na vitória • capital mediano '+money(k.capitalMediano)+
  '. '+report.conditions+' Cenários de risco são opcionais, hipotéticos e não incluem cooldown. '+
  (report.scenario.chance===null?'Sem chance informada, resultado esperado permanece indisponível. ':'')+
  'Chance padrão de vitória de 40% é uma premissa gerencial alterável, não taxa observada. Alertas de preço exigem referência salva; esta tela não publica buffs ou nerfs.';
 el('apManagementDate').textContent='Fonte: Mercado Negro'+
  (lastPriceRead?' • leitura '+new Date(lastPriceRead).toLocaleTimeString('pt-BR'):'')+
  (sheetOverrides.length?' • prêmios conferidos na planilha':' • prêmio do catálogo');
}

function refreshPriceAlerts(){
 if(!el('apPriceAlerts')||!catalog)return;
 const report=assessPriceChanges(actions,catalog,reference,{tax:state.tax,ammoUse:state.ammoUse,
  accessConsumed:state.accessConsumed});
 const intro=el('apPriceAlertIntro'),box=el('apPriceAlerts'),save=el('apSaveReference');
 if(save)save.hidden=!onSaveReference;
 if(!report.available){
  intro.textContent='Nenhuma referência anterior salva. Para detectar alterações reais, registre o catálogo atual uma única vez.';
  box.innerHTML='<p class="ap-hint">Sem referência histórica: nenhuma alta ou queda será inventada. A gestão pode guardar os preços atuais e compará-los nas próximas visitas.</p>';
 }else{
  intro.textContent='Comparado à referência da gestão de '+(new Date(report.referenceDate).toLocaleString('pt-BR')||'data não informada')+
   ' • '+report.up+' ações encareceram • '+report.down+' ficaram mais baratas.';
  box.innerHTML=report.changes.length?
   report.changes.slice(0,12).map(c=>
    '<button type="button" class="ap-price-alert" data-ap-action="'+safe(c.name)+'">'+
     '<span><b>'+safe(c.name)+'</b><small>'+c.team+' participantes • '+c.items.map(x=>safe(x.name)).slice(0,4).join(' / ')+'</small></span>'+
     '<span class="'+(c.difference>0?'ap-alert-up':'ap-alert-down')+'"><b>'+
      (c.difference>0?'+':'')+safe(money(c.difference))+'</b><small>'+
      (c.percent===null?'Variação não informada':percent(c.percent))+
      ' • '+(c.deltaPerMember===null?'verificar insumos':c.deltaPerMember<0?'lucro menor: avaliar compensação':c.deltaPerMember>0?'lucro maior: avaliar equilíbrio':'lucro preservado: revisar capital')+'</small>'+
      '<small>Lucro/membro: '+safe(money(c.oldProfitPerMember))+' → '+safe(money(c.newProfitPerMember))+'</small></span></button>'
   ).join(''):'<p class="ap-hint">Nenhuma alteração de custo encontrada desde a referência salva.</p>';
 }
 const pending=actions.filter(a=>a.premioFonte==='Google Sheets').length;
 const info=el('apPublicationStatus');
 if(info)info.textContent=pending?
   pending+' premiação(ões) conferida(s) na planilha. O Mercado Negro público pode estar desatualizado; publicação no GitHub é separada e não é feita automaticamente por esta tela.':
   'Prêmios carregados do catálogo público. Para conferir alterações recentes da planilha, use “Conferir prêmios na planilha”. Alterações aprovadas não publicam automaticamente no GitHub.';
 const read=el('apReadSheet');if(read)read.hidden=!onReadSheet;
}
async function saveReference(){
 if(!onSaveReference)return;
 if(!confirm('Salvar os preços atuais como referência compartilhada? Isso substitui a referência anterior e zera os alertas de variação para novas comparações.'))return;
 const status=el('apPriceAlertIntro');
 try{
  const snapshot=makePriceReference(catalog);
  const result=await onSaveReference(snapshot);
  if(!result?.saved)throw Error('O servidor não confirmou a gravação.');
  reference=snapshot;refreshPriceAlerts();renderManagement();
  status.textContent='Referência salva. Novas alterações de preço aparecerão aqui quando o módulo consultar o catálogo novamente.';
 }catch(e){status.textContent='Não foi possível salvar a referência: '+(e.message||String(e));}
}
async function refreshPriceCatalog(){
 const button=el('apRefreshPrices');if(button)button.disabled=true;
 try{
  const responses=await Promise.all([fetch(ACOES_SOURCE,{cache:'no-store'}),fetch(CATALOGO_SOURCE,{cache:'no-store'})]);
  if(responses.some(x=>!x.ok))throw Error('Fonte indisponível.');
  const data=await responses[0].json(),next=await responses[1].json();
  if(!Array.isArray(data.acoes)||!Array.isArray(next.itens))throw Error('Formato inválido.');
  publishedActions=data.acoes;actions=combinePublished();
  catalog=next;meta=data.meta||{};lastPriceRead=new Date().toISOString();
  if(!action())selection=actions.find(a=>a.status!=='inativo')?.nome||actions[0]?.nome||'';
  render();
  lastPriceRead=new Date().toISOString();
  el('apSource').textContent='Mercado Negro • catálogo consultado agora • '+catalog.itens.length+
   ' produtos • '+actions.length+' ações'+(sheetOverrides.length?' • prêmios da planilha sobrepostos':'');
 }catch(e){el('apPriceAlertIntro').textContent='Não foi possível atualizar o Mercado Negro: '+(e.message||String(e));}
 finally{if(button)button.disabled=false;}
}
async function refreshSheetPrizes(){
 if(!onReadSheet)return;
 const button=el('apReadSheet');button.disabled=true;
 try{
  const result=await onReadSheet();
  sheetOverrides=result.prizes||[];
  actions=combinePublished();
  render();
  el('apCopyStatus').textContent='Prêmios lidos diretamente da planilha às '+new Date(result.readAt).toLocaleTimeString('pt-BR')+
   '. Se divergirem do Mercado Negro público, a publicação do catálogo permanece pendente.';
 }catch(e){el('apCopyStatus').textContent='Erro ao conferir planilha: '+(e.message||String(e));}
 finally{button.disabled=false;}
}
async function showDecisionHistory(){
 if(!onReadDecisions)return;
 const box=el('apDecisionHistory');box.hidden=false;box.textContent='Consultando histórico...';
 try{
  const items=await onReadDecisions();
  box.innerHTML=items.length?items.map(d=>
   '<div class="ap-decision-history-line"><b>'+safe(d.decisao||d.tipo)+'</b> • '+safe(d.acao||'Referência de preços')+
   (d.data?' • '+safe(typeof d.data==='string'?new Date(d.data).toLocaleDateString('pt-BR'):'data no histórico'):'')+
   ' • '+safe(d.usuario)+(Number.isFinite(d.premioMinProposto)?' • proposta '+safe(money(d.premioMinAnterior))+' → '+safe(money(d.premioMinProposto)):'')+
   ' • '+safe(d.motivo||'Sem justificativa cadastrada')+'</div>'
  ).join(''):'<p class="ap-row-muted">Nenhuma decisão anterior encontrada.</p>';
 }catch(e){box.textContent='Histórico indisponível: '+(e.message||String(e));}
}

function rankFormat(mode,value){
 return mode.unit==='percent'?percent(value):money(value);
}
function actionPhoto(a){
 return photoUrl(a?.locais?.find(l=>l.imagem)?.imagem||a?.imagem);
}
function rankBoard(){
 if(!catalog||!actions.length||!el('apRankingResults'))return;
 // Ranking oficial comparável: os ajustes temporários feitos no formulário
 // de uma ação não modificam a posição dos demais participantes.
 const report=buildActionRankings(actions,catalog,{tax:state.tax,ammoUse:state.ammoUse,
  accessConsumed:state.accessConsumed});
 const mode=RANKING_MODES.find(m=>m.id===state.rankMode)||RANKING_MODES[0];
 const rows=report.rankings[mode.id]||[];
 el('apRankingTabs').innerHTML=RANKING_MODES.map(m=>
  '<button type="button" class="ap-rank-tab" data-ap-rank="'+safe(m.id)+'" aria-pressed="'+(state.rankMode===m.id)+'">'+safe(m.title)+'</button>'
 ).join('');
 const featured=[
  ['lucro-total','Maior lucro total'],
  ['lucro-membro','Maior lucro por pessoa'],
  ['rentabilidade','Maior retorno percentual'],
  ['investimento','Maior capital necessário']
 ];
 el('apRankingHighlights').innerHTML=featured.map(([key,title])=>{
  const m=RANKING_MODES.find(x=>x.id===key),top=report.rankings[key]?.[0];
  if(!top)return '<div class="ap-rank-feature"><small>'+safe(title)+'</small><strong>Sem dados</strong></div>';
  return '<button type="button" class="ap-rank-feature" data-ap-ranked="'+safe(top.action.nome)+'" title="Abrir os detalhes de '+safe(top.action.nome)+'">'+
   '<small>'+safe(title)+'</small><strong>'+safe(rankFormat(m,top.value))+'</strong>'+
   '<span>'+safe(top.action.nome)+'</span><span class="ap-rank-mini">'+top.calc.team+' invasores</span></button>';
 }).join('');
 const limited=rows.slice(0,state.rankLimit);
 el('apRankingResults').innerHTML=limited.length?
  '<div class="ap-ranking-result-head"><strong>'+safe(mode.label)+'</strong><span>'+rows.length+
  ' ações comparáveis · '+(report.excluded.length?' '+report.excluded.length+' excluídas':'Nenhuma pendência')+'</span></div>'+
  '<div class="ap-ranking-list">'+limited.map(item=>{
    const a=item.action,p=item.calc,image=actionPhoto(a);
    return '<button type="button" class="ap-ranking-row" data-ap-ranked="'+safe(a.nome)+'" aria-label="Posição '+item.position+'. Abrir '+safe(a.nome)+'">'+
     '<span class="ap-rank-number">#'+item.position+'</span>'+
     (image?'<img class="ap-rank-thumb" src="'+safe(image)+'" alt="" loading="lazy">':'<span class="ap-rank-thumb ap-rank-no-photo">▣</span>')+
     '<span class="ap-rank-name"><b>'+safe(a.nome)+'</b><small>'+p.team+' invasores · Prêmio mínimo '+safe(money(p.min))+
     (p.kit.baselineMismatch?' · Custo divergente':'')+'</small></span>'+
     '<span class="ap-rank-value"><strong>'+safe(rankFormat(mode,item.value))+'</strong><small>'+
       (mode.id==='investimento'?'Risco na derrota: '+money(p.kit.lossCost):
         'Lucro por jogador: '+money(p.perPlayer))+'</small></span></button>';
  }).join('')+'</div>':
  '<div class="ap-hint warn">Ainda não há ações com prêmio, equipe válida e preço de todos os itens. Ações inativas ou com preços pendentes ficam fora do ranking.</div>';
 el('apRankingMethod').textContent=
  'Critério: preço publicado de pista (sem variação simulada), quantidades oficiais, maior equipe permitida, prêmio mínimo e lavagem de '+
  Math.round(state.tax*100)+'%; munição gasta '+Math.round(state.ammoUse*100)+'%; pendrive '+
  (state.accessConsumed?'consumido':'reutilizável')+
  '. Rentabilidade = lucro mínimo na vitória ÷ capital integral. Excluídas '+report.excluded.length+
  ' ações inativas, sem preço, prêmio ou equipe válida. Não é previsão de lucro esperado: espera policial, dificuldade, derrotas e cooldown não são ponderados.';
 const source=el('apRankingDate');
 if(source)source.textContent=report.included.length+' ações classificadas · preços consultados ao abrir a página';
}

function showMainRecommendation(d){
 const panel=el('apSuggestedMain');if(!panel)return;
 const p=d.calc;
 if(!d.valid||!Number.isFinite(d.recommendedMin)){
  panel.className='ap-recommend-main ap-recommend-pending';
  panel.innerHTML='<div class="ap-recommend-top"><span>GESTÃO ECONÔMICA</span><strong>DADOS PENDENTES</strong></div><p>Conferir preço dos insumos, kit, regras de invasores e prêmios cadastrados.</p>';
  return;
 }
 panel.className='ap-recommend-main '+(d.direction==='CONSIDERAR BUFF'?'ap-recommend-buff':
  d.direction==='CONSIDERAR REDUÇÃO'?'ap-recommend-nerf':'ap-recommend-maintain');
 panel.innerHTML='<div class="ap-recommend-top"><span>FAIXA DE PAGAMENTO • SURICATO ROUBOS</span>'+chip(d.direction)+'</div>'+
  '<div class="ap-recommend-compare">'+
  payoutPair('ATUAL APROVADO • SUJO',p.min,p.max)+
  '<span class="ap-recommend-arrow" aria-hidden="true">→</span>'+
  payoutPair('APÓS IMPACTO DE PREÇOS • SUJO',d.recommendedMin,d.recommendedMax,'ap-recommend-final')+'</div>'+
  '<div class="ap-recommend-band">'+
  '<span><b>Capital para iniciar:</b> '+safe(money(p.kit.total))+'</span>'+
  '<span><b>Custo consumido/reposto:</b> '+safe(money(p.kit.winCost))+'</span>'+
  '<span><b>Variação no capital:</b> '+safe(money(d.deltaCapital))+'</span>'+
  '<span><b>Variação na reposição:</b> '+safe(money(d.deltaReplacement))+'</span>'+
  '<span><b>Lucro mínimo na vitória:</b> '+safe(money(p.netMin))+'</span>'+
  '<span><b>Cooldown:</b> '+safe(action()?.cooldown_segundos?Math.ceil(action().cooldown_segundos/60)+' min':'não informado')+'</span></div>'+
  '<div class="ap-recommend-foot"><small>'+safe(d.hasComparison?(d.isSimulation?'Simulação; não publicar valores até confirmar o preço.':'Comparação com preços de referência.'):'Sem referência salva: preservar mínimo e máximo atuais.')+
  ' A gestão decide se o impacto justifica ajuste. Nenhum prêmio muda automaticamente.</small>'+
  '<button type="button" class="ap-button ap-recommend-details" id="apOpenStrategy">Analisar custos e configurar Suricato</button></div>';
}

function actionsList(){
 if(!root)return;
 const q=norm(state.search);
 const results=actions.filter(a=>{
  const match=!q||norm(a.nome).includes(q)||(a.locais||[]).some(l=>norm(l.descricao||l.nome).includes(q));
  if(!match)return false;
  if(state.status==='ATIVAS'&&a.status==='inativo')return false;
  if(state.status==='REVISAR'){
   const r=calculateAction(a,catalog,{team:defaultTeam(a),kitMode:'oficial',priceMode:state.priceMode,priceShift:state.priceShift});
   return r.kit.missing.length>0||r.kit.baselineMismatch;
  }
  return true;
 });
 const visible=results.slice(0,state.listLimit);
 el('apActionCount').textContent=visible.length+' exibidas de '+results.length+' resultados ('+actions.length+' cadastradas)';
 const more=el('apCatalogMore');
 if(more){more.hidden=visible.length>=results.length;more.textContent='Carregar mais ('+(results.length-visible.length)+' restantes)';}
 el('apActionList').innerHTML=visible.map(a=>{
  const d=analyzeDecision(a,catalog,{team:defaultTeam(a),referenceTeam:defaultTeam(a),
   kitMode:'oficial',priceMode:'pista',tax:state.tax,
   ammoUse:state.ammoUse,accessConsumed:state.accessConsumed,
   targetPerPlayer:state.targetPerPlayer,roi:state.roi,tolerance:state.tolerance,
   reference});
  const p=d.calc;
  const match=d.valid&&Number.isFinite(d.recommendedMin)?
   'MÍNIMO '+money(d.recommendedMin)+' · '+(d.recommendedDelta===0?'MANTER':
     (d.recommendedDelta>0?'+':'−')+money(Math.abs(d.recommendedDelta)))+
   ' · '+d.direction:
   'SUGESTÃO PENDENTE · '+(p.kit.missing.length?'insumos sem preço':'dados incompletos');
  return '<button type="button" class="ap-choice" data-ap-action="'+safe(a.nome)+'" aria-pressed="'+(a.nome===selection?'true':'false')+'">'+
   '<span class="ap-choice-main"><b>'+safe(a.nome)+'</b><small>'+safe(p.team)+' invasores · '+(a.status==='inativo'?'Inativa': 'Prêmio '+money(p.min)+' a '+money(p.max))+'</small>'+
   '<small class="ap-choice-result">'+safe(match)+'</small></span></button>';
 }).join('')||'<p class="ap-row-muted">Nenhuma ação encontrada.</p>';
}
function photosAndRules(){
 const a=action();if(!a)return;
 el('apActionTitle').textContent=a.nome;
 const localList=a.locais?.length?a.locais:[{nome:a.nome,imagem:a.imagem||'',descricao:a.localizacao||''}];
 el('apPhotos').innerHTML='<div class="ap-photogrid">'+localList.map((l,i)=>{
  const image=photoUrl(l.imagem||a.imagem);
  return '<button type="button" class="ap-photo" data-ap-local="'+i+'" aria-pressed="'+(i===localIndex)+'" title="'+safe(l.descricao||l.nome)+'">'+
   (image?'<img src="'+safe(image)+'" alt="'+safe(l.descricao||l.nome)+'" loading="lazy">':'<span>Sem foto cadastrada</span>')+
   '<span>'+safe(l.descricao||l.nome||a.nome)+(i===localIndex?' • SELECIONADO':'')+'</span></button>';
 }).join('')+'</div>';
 const p=calculateAction(a,catalog,options()),r=p.rule;
 const facts=[
  ['Invasores',p.allowed.join(' / ')||'A confirmar'],
  ['Policiais',r?.policiais??place()?.policiais_minimos??a.policiais_minimos??'A confirmar'],
  ['Reféns',r?.refens??'A confirmar'],
  ['Pendrive',a.pendrive_exigido||(a.itens||[]).find(i=>/^PENDRIVE/i.test(i.nome))?.nome||'A confirmar'],
  ['Cooldown',a.cooldown_segundos?Math.ceil(a.cooldown_segundos/60)+' min':'A confirmar'],
  ['Duração limite',a.tempo_maximo_minutos?a.tempo_maximo_minutos+' min':'A confirmar']
 ];
 el('apReq').innerHTML='<div class="ap-facts">'+facts.map(([name,value])=>
  '<span class="ap-fact"><b>'+safe(name)+':</b> '+safe(value)+'</span>'
 ).join('')+'</div>';
}
function teamOptions(){
 const ts=availableTeams(action(),place());
 if(!ts.includes(Number(state.team)))state.team=ts.at(-1)||defaultTeam(action(),place());
 el('apTeam').innerHTML=ts.length?ts.map(n=>'<option value="'+n+'"'+(n===Number(state.team)?' selected':'')+'>'+n+' invasores</option>').join(''):
  '<option value="'+state.team+'">Sem tabela de equipes</option>';
}
const categoryLabel={arma:'Arma • fica na vitória',municao:'Munição • repõe o gasto',
 colete:'Colete • uso único',acesso:'Acesso • consumido',consumivel:'Insumo • consumido'};
function kitTable(){
 const p=calculateAction(action(),catalog,options());
 el('apKitRows').innerHTML=p.kit.lines.map(l=>
  '<tr><td><span class="ap-item-name">'+safe(l.name)+'</span><span class="ap-item-source">'+
  safe(l.category==='acesso'&&!state.accessConsumed?'Acesso • reutilizável':categoryLabel[l.category]||l.category)+' · '+safe(l.source)+'</span></td>'+
  '<td><input class="ap-table-input" aria-label="Quantidade de '+safe(l.name)+'" type="number" min="0" max="500" step="1" data-ap-qty="'+l.index+'" value="'+safe(l.qty)+'"></td>'+
  '<td><input class="ap-table-input" aria-label="Preço base de '+safe(l.name)+'" type="number" min="0" step="1" data-ap-price="'+l.index+'" placeholder="Sem preço" value="'+safe(l.baseUnit??'')+'">'+
  (p.kit.priceShift?'<span class="ap-item-source">Com variação: '+safe(money(l.unit))+'</span>':'')+'</td>'+
  '<td>'+safe(money(l.total))+'</td><td class="'+(l.winCost===0?'ap-positive':'')+'">'+
  (l.missing?'A confirmar':l.winCost===0?'Mantém':safe(money(l.winCost)))+'</td></tr>'
 ).join('');
 el('apTotal').textContent=money(p.kit.total);
 el('apWinCostTotal').textContent=money(p.kit.winCost);
}
function scenarios(){
 const rules=getRules(action(),place());
 if(!rules.length){el('apScenarios').innerHTML='<p class="ap-row-muted">Nenhuma faixa de invasores publicada.</p>';return;}
 const body=rules.map(r=>{
  const p=analyzeDecision(action(),catalog,{...options(),team:r.invasores,quantities:{},prices:{},referenceTeam:defaultTeam(action())}).calc;
  return '<tr class="'+(r.invasores===Number(state.team)?'ap-scenario-active':'')+'">'+
   '<td><button type="button" class="ap-button" data-ap-team="'+r.invasores+'">'+r.invasores+'</button></td>'+
   '<td>'+safe(r.policiais??'—')+'</td><td>'+safe(money(p.kit.total))+'</td>'+
   '<td>'+safe(money(p.kit.winCost))+'</td>'+
   '<td class="ap-positive">'+safe(money(p.netMin))+'</td>'+
   '<td class="ap-negative">'+safe(money(p.loss))+'</td>'+
   '<td>'+safe(money(p.perPlayer))+'</td></tr>';
 }).join('');
 el('apScenarios').innerHTML='<table><thead><tr><th>INVASORES</th><th>POLICIAIS</th><th>CAPITAL INICIAL</th><th>REPOSIÇÃO NA VITÓRIA</th><th>LUCRO NA VITÓRIA (MÍN.)</th><th>PREJUÍZO NA DERROTA</th><th>LUCRO / JOGADOR</th></tr></thead><tbody>'+body+'</tbody></table>'+
 '<p class="ap-row-muted">Comparação com os kits padrão para cada equipe; ajustes manuais de itens não são aplicados à matriz.</p>';
}
function summary(){
 const a=action();if(!a)return;
 const d=decision(),p=d.calc;
 showMainRecommendation(d);
 renderApprovalPayoutRange(d);
 el('apActionStatus').innerHTML=chip(a.status==='inativo'?'INATIVA':d.direction);
 el('apKitComputed').textContent='Kit cadastrado na fonte: '+money(p.kit.official)+' • Capital simulado: '+money(p.kit.total);
 const warns=[];
 if(!p.teamValid)warns.push('Equipe não prevista nas regras de invasores.');
 if(p.kit.missing.length)warns.push('Preço ausente: '+p.kit.missing.join(', ')+'. O resultado fica pendente até informar os valores.');
 if(state.kitMode==='oficial'&&!state.priceShift&&state.priceMode==='pista'&&
   !Object.keys(state.prices).length&&p.kit.comparison!==null&&Math.abs(p.kit.comparison)>1)
  warns.push('Kit cadastrado diverge do preço atual em '+money(p.kit.comparison)+'.');
 if(state.kitMode==='oficial'&&p.kit.lines.some(i=>i.category==='arma'&&i.qty<p.team))
  warns.push('Algumas armas cadastradas são insuficientes para o número de jogadores.');
 if(state.priceShift)warns.push('Alta/queda de preço é hipotética e não altera o catálogo oficial.');
 if(d.modeled)warns.push('PRÊMIO PROPORCIONAL SIMULADO: valor NÃO oficial. Retorne ao prêmio publicado antes de qualquer aprovação.');
 const warning=el('apWarnings');warning.className='ap-hint'+(warns.length?' warn':'');
 warning.textContent=warns.join(' ')||'Na vitória, armas e munições não utilizadas permanecem com a facção. Coletes são de uso único. O consumo de pendrives é configurável. Na derrota, todo o kit é perdido.';
 const cs=v=>v===null?'':v>=0?'good':'bad';
 el('apQuickMetrics').innerHTML=[
  kpi('Prêmio atual (sujo)',money(p.min)+' a '+money(p.max),'gold'),
  kpi('Capital necessário',money(p.kit.total)),
  kpi('Custo para repor após vitória',money(p.kit.winCost)),
  kpi('Prejuízo na derrota',money(p.loss),'bad')
 ].join('');
 el('apOutcome').innerHTML=
  '<div class="ap-outcome ap-win"><div class="ap-outcome-heading"><b>✓ VITÓRIA</b><small>Armas preservadas</small></div>'+
  '<strong>'+safe(money(p.netMin))+' <span>a</span> '+safe(money(p.netMax))+'</strong>'+
  '<p>Lucro da facção após lavagem e reposições</p><div class="ap-outcome-meta">'+
  '<span>Repor: <b>'+safe(money(p.kit.winCost))+'</b></span>'+
  '<span>Kit mantido: <b>'+safe(money(p.kit.retained))+'</b></span></div></div>'+
  '<div class="ap-outcome ap-lose"><div class="ap-outcome-heading"><b>✕ DERROTA</b><small>Sem prêmio</small></div>'+
  '<strong>'+safe(money(p.loss))+'</strong><p>Todo o kit é perdido</p>'+
  '<div class="ap-outcome-meta"><span>Armas, munição, coletes e acesso: <b>perdidos</b></span></div></div>';
 el('apCurrentMetrics').innerHTML=[
  kpi('Prêmio mínimo após lavagem',money(p.min===null?null:p.min*(1-p.tax))),
  kpi('Prêmio máximo após lavagem',money(p.max===null?null:p.max*(1-p.tax))),
  kpi('Armas mantidas',money(p.kit.weapons),'good'),
  kpi('Reposição de munição',money(p.kit.ammoReplacement)),
  kpi('Coletes consumidos',money(p.kit.armors)),
  kpi('Pendrives/acesso',money(p.kit.access)),
  kpi('Lucro mínimo por jogador ao vencer',money(p.perPlayer),cs(p.perPlayer)),
  kpi('Saldo no caixa após comprar o kit e vencer pela primeira vez',money(p.firstRunNetMin),cs(p.firstRunNetMin))
 ].join('');
 el('apGoals').innerHTML=[
  kpi('Meta de lucro total na vitória',money(p.targetProfit),'gold','Meta individual ou ROI sobre kit completo'),
  kpi('Prêmio mínimo recomendado (sujo)',money(d.recommendedMin),'gold'),
  kpi('Prêmio máximo recomendado (estimado)',money(d.recommendedMax)),
  kpi('Diferença recomendada',d.recommendedDelta===null?'A confirmar':
   (d.recommendedDelta>=0?'+':'−')+money(Math.abs(d.recommendedDelta)),
   d.recommendedDelta===null?'':d.recommendedDelta>0?'good':d.recommendedDelta<0?'bad':''),
  kpi('Lucro na vitória com proposta',money(d.recommendedProfit),cs(d.recommendedProfit)),
  kpi('Lucro por jogador com proposta',money(d.recommendedPerMember),cs(d.recommendedPerMember)),
  kpi('ROI alvo sobre kit inteiro',percent(p.targetROI)),
  kpi('ROI atual na vitória',percent(p.roi))
 ].join('');
 const risk=el('apIntelligenceResult');
 risk.innerHTML=[
  kpi('Decisão sugerida',d.direction,'gold'),
  kpi('Prêmio recomendado',money(d.recommendedMin),'gold'),
  kpi('Lucro se vencer (atual)',money(p.netMin),cs(p.netMin)),
  kpi('Prejuízo se perder (atual)',money(p.loss),'bad'),
  kpi('Taxa mínima de vitória para empatar',percent(d.breakEven)),
  kpi('Prêmio teórico para empatar com risco (NÃO é sugestão)',money(d.riskBreakEvenMin)),
  kpi('Resultado esperado atual',money(d.expected),cs(d.expected)),
  kpi('Resultado esperado após sugestão',money(d.recommendedExpected),cs(d.recommendedExpected)),
  kpi('Lucro mínimo/jogador/hora',money(d.hourly),d.hourly===null?'':d.hourly>=0?'good':'bad'),
  kpi('Tempo total estimado',d.totalMinutes===null?'Não informado':d.totalMinutes+' min')
 ].join('')+'<p class="ap-row-muted">'+d.remarks.map(safe).join(' ')+'</p>';
 const out=el('apResult');out.className='ap-result'+(d.direction==='CONSIDERAR BUFF'?' warning':'');
 out.innerHTML='<strong>'+safe(d.direction)+'</strong><span>'+safe(
  'Lucro ao vencer: '+money(p.netMin)+' • prejuízo ao perder: '+money(p.loss)+
  ' • resultado esperado atual: '+money(d.expected)+' • com proposta: '+money(d.recommendedExpected)+
  '. Sugestão moderada: não garante eliminar todo o risco. A decisão final é da gestão.')+'</span>';
 el('apProposal').textContent='Cenário: '+p.team+' jogadores • prêmio '+(d.modeled?'HIPOTÉTICO proporcional':'publicado')+
  ' • lavado '+percent(p.tax)+' • capital '+money(p.kit.total)+
  ' • reposição '+money(p.kit.winCost)+' • perda total ao ser derrotado '+money(p.kit.lossCost)+
  '. Chance de vitória configurada: '+(d.winChance===null?'não informada':percent(d.winChance))+'; é premissa de gestão, não estatística real.';
 const alternative=el('apManualOutcome');
 if(state.manualPayout!=null&&Number.isFinite(state.manualPayout))renderApprovalPayoutRange(d);
 alternative.textContent=state.manualPayout===null?'Insira outro prêmio para estimar a vitória.':
  p.kit.winCost===null?'Algum preço está pendente.':
  'Com mínimo '+money(state.manualPayout)+' e máximo estimado '+money(recommendedMaximum(p.min,p.max,state.manualPayout))+
  ' sujo, lucro na vitória de '+
  money(state.manualPayout*(1-p.tax)-p.kit.winCost)+' ('+
  money((state.manualPayout*(1-p.tax)-p.kit.winCost)/p.team)+' por jogador). Prejuízo na derrota: '+money(p.loss)+'.';
 el('apCopy').disabled=!d.valid;
 const saveAllowed=!!approveHandler&&d.eligibleForSheet&&!approvedThisSession.has(a.nome);
 for(const [id,available] of [
  ['apApprove',saveAllowed&&Number.isFinite(d.recommendedMin)&&Math.abs(d.recommendedMin-p.min)>1],
  ['apApproveManual',saveAllowed&&Number.isFinite(state.manualPayout)&&state.manualPayout>0&&Math.abs(state.manualPayout-p.min)>1],
  ['apReject',!!onRejectAction&&d.valid]
 ]){
  const button=el(id);if(button){
   button.hidden=(id==='apReject'?!onRejectAction:!approveHandler);
   button.disabled=!available;
   button.title=!d.eligibleForSheet?'Só é possível aprovar o prêmio publicado, sem ajustes hipotéticos no kit ou nos insumos.':
    'A alteração na planilha exige confirmação específica.';
  }
 }
 scenarios();
}
function render(){
 actionsList();renderManagement();rankBoard();refreshPriceAlerts();
 if(action()){teamOptions();photosAndRules();kitTable();summary();}
 workspace?.paint();
}
async function copyProposal(){
 const a=action(),d=decision(),p=d.calc;
 if(!d.valid)return;
 const text=['HIGH ROLEPLAY — ANÁLISE ECONÔMICA DE AÇÃO',
 'AÇÃO: '+a.nome,'AVALIAÇÃO: '+p.status,
 'JOGADORES: '+p.team+' / POLICIAIS: '+(p.rule?.policiais??'Não informado'),
 'PREÇOS: '+state.priceMode+' / ALTERAÇÃO HIPOTÉTICA: '+Math.round(state.priceShift*100)+'%',
 'CONSUMO DE MUNIÇÃO: '+Math.round(state.ammoUse*100)+'% (reposição em pacotes inteiros)',
 'CAPITAL PARA MONTAR O KIT: '+money(p.kit.total),
 'ARMA(S) PRESERVADA(S) EM VITÓRIA: '+money(p.kit.weapons),
 'REPOSIÇÃO APÓS VITÓRIA: '+money(p.kit.winCost),
 'PERDA DO KIT NA DERROTA: '+money(p.kit.lossCost),
 'PRÊMIO ATUAL (SUJO): '+money(p.min)+' a '+money(p.max),
 'LAVAGEM: '+percent(p.tax),
 'LUCRO SE VENCER: '+money(p.netMin)+' a '+money(p.netMax),
 'LUCRO POR JOGADOR SE VENCER: '+money(p.perPlayer),
 'SALDO NO CAIXA AO VENCER NA PRIMEIRA AÇÃO COM KIT NOVO: '+money(p.firstRunNetMin),
 'PREJUÍZO SE PERDER: '+money(p.loss)+' (sem prêmio; equipamento perdido)',
 'META POR JOGADOR: '+money(p.targetPerPlayer)+' / META ROI DO KIT: '+percent(p.targetROI),
 'RESULTADO ESPERADO ATUAL (CHANCE GERENCIAL): '+money(d.expected),
 'RESULTADO ESPERADO APÓS PROPOSTA: '+money(d.recommendedExpected),
 'PONTO DE EQUILÍBRIO TEÓRICO, NÃO SUGESTÃO: '+money(d.riskBreakEvenMin),
 'PRÊMIO MÍNIMO RECOMENDADO (AJUSTE MODERADO): '+money(d.recommendedMin),
 'PRÊMIO MÁXIMO INDICATIVO: '+money(d.recommendedMax),
 'PRÊMIO MÁXIMO PUBLICADO: '+money(p.max),
 'KIT: '+p.kit.lines.map(i=>i.name+' x'+i.qty+' (investimento '+money(i.total)+', repor '+money(i.winCost)+')').join(' / '),
 'Hipóteses: pendrive '+(state.accessConsumed?'consumido':'reutilizável')+', colete de uso único, armas preservadas na vitória e chance de vitória '+(d.winChance===null?'não informada':percent(d.winChance))+' (premissa, não dado observado).',
 'DECISÃO: '+d.direction,'RISCO: chance '+(d.winChance===null?'não informada':percent(d.winChance))+' | espera '+(d.wait===null?'não informada':d.wait+' min'),
 'AVISO: se prêmio proporcional for selecionado, o valor é hipotético, não oficial.',
 'Premiações atuais já incluem buffs/nerfs existentes. Nenhuma mudança automática no jogo.'].join('\n');
 const status=el('apCopyStatus');
 try{await navigator.clipboard.writeText(text);status.textContent='Análise copiada. Verifique os cenários antes de qualquer alteração oficial.';}
 catch{status.textContent='Área de transferência indisponível no navegador.';}
}
async function approveProposal(mode='sugestao'){
 if(!approveHandler)return;
 const a=action(),d=decision(),p=d.calc;
 const manual=mode==='manual',value=manual?state.manualPayout:d.recommendedMin;
 const proposedMax=manual?recommendedMaximum(p.min,p.max,value):d.recommendedMax;
 if(!d.eligibleForSheet||approvedThisSession.has(a.nome)||!Number.isFinite(value)||
    !Number.isFinite(proposedMax)||proposedMax<value||value<=0||Math.abs(value-p.min)<=1){
  el('apCopyStatus').textContent='Prêmio inválido ou cenário hipotético. Restaure os preços e o prêmio publicados antes de aprovar.';
  return;
 }
 const buttons=[el('apApprove'),el('apApproveManual'),el('apReject')].filter(Boolean);
 buttons.forEach(x=>x.disabled=true);
 const message=el('apCopyStatus'),reason=el('apDecisionReason')?.value?.trim()||'';
 message.textContent='Conferindo células, fórmulas e premiação oficial da planilha...';
 try{
  const result=await approveHandler({name:a.nome,officialMin:p.min,officialMax:p.max,
   proposedMin:value,proposedMax,team:p.team,cost:p.kit.total,tax:p.tax,winChance:d.winChance,reason,
   source:manual?'manual':'sugestao'});
  if(result?.cancelled){message.textContent='Aprovação cancelada. Nada foi alterado.';return;}
  if(!result?.updated)throw Error('A planilha não confirmou a alteração.');
  approvedThisSession.add(a.nome);
  if(result.verified&&Number.isFinite(result.actualMin)&&Number.isFinite(result.actualMax)){
   const record={name:a.nome,min:result.actualMin,max:result.actualMax,
    buff:result.actualBuff,nerf:result.actualNerf};
   sheetOverrides=sheetOverrides.filter(x=>norm(x.name)!==norm(a.nome)).concat([record]);
   actions=combinePublished();
   render();
  }
  message.textContent=result.verified?
   'Planilha atualizada. Mínimo confirmado '+money(result.actualMin)+
   ' • máximo calculado '+money(result.actualMax)+'. '+
   (result.verifiedMaximum?'Máximo conforme estimativa. ':
    'ATENÇÃO: máximo calculado difere da estimativa '+money(result.estimatedMax)+'. ')+
   (result.audited?'Histórico registrado. ':'Auditoria pendente. ')+
   'O GitHub/Mercado Negro não foi republicado automaticamente.':
   'BUFF/NERF gravado, mas o mínimo calculado não corresponde à proposta. Confira a planilha antes de qualquer nova aprovação.';
  refreshPriceAlerts();
 }catch(error){message.textContent='SEM CONFIRMAÇÃO DE AJUSTE: '+(error?.message||String(error));}
 finally{summary();}
}
async function rejectProposal(){
 if(!onRejectAction)return;
 const a=action(),d=decision();
 const reason=el('apDecisionReason')?.value?.trim();
 if(!reason){el('apCopyStatus').textContent='Para recusar, informe o motivo no campo “Motivo da decisão”.';return;}
 const amount=Number.isFinite(state.manualPayout)&&state.manualPayout>0?state.manualPayout:d.suggested;
 if(!Number.isFinite(amount)||!d.valid)return;
 if(!confirm('Registrar recusa da proposta de '+a.nome+'? Isso NÃO modifica a premiação.'))return;
 const btn=el('apReject');btn.disabled=true;
 try{
  const result=await onRejectAction({name:a.nome,oldMin:d.calc.min,newMin:amount,
   reason,team:d.team,source:state.manualPayout!=null?'manual':'sugestao'});
  if(!result?.recorded)throw Error('Histórico não confirmado.');
  el('apCopyStatus').textContent='Proposta recusada e registrada. Nenhum valor da planilha foi alterado.';
 }catch(e){el('apCopyStatus').textContent='Falha ao registrar recusa: '+(e.message||String(e));}
 finally{btn.disabled=false;}
}
function csvCell(v){return '"'+String(v??'').replaceAll('"','""')+'"';}
function exportManagement(){
 if(!catalog||!actions.length)return;
 const board=buildManagementBoard(actions,catalog,managementOptions());
 const headers=['Ação','Situação','Equipe','Prioridade','Pendências e critérios','Capital inicial',
  'Custo reposição vitória','Prêmio mínimo sujo','Lucro mínimo vitória','Lucro mínimo por jogador',
  'Prejuízo derrota','Resultado esperado hipotético','Resultado esperado por jogador/hora',
  'Variação do capital desde referência','Variação do lucro por jogador desde referência',
  'Chance de vitória simulada (%)','Espera da polícia (min)','Duração da ação (min)'];
 const rows=board.entries.map(x=>[x.nome,x.status,x.team,x.priority,x.reason.join(' / '),
  x.capital,x.winCost,x.calc.min,x.netMin,x.perPlayer,x.loss,
  x.expected,x.expectedMemberHour,x.change?.difference??'',x.change?.deltaPerMember??'',
  management.winChance===null?'':management.winChance*100,
  management.policeWaitMinutes??'',management.estimatedActionMinutes??'']);
 const csv='\ufeff'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='high-os-carteira-acoes.csv';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function exportAnalysis(){
 const headers=['Ação','Situação','Invasores','Policiais','Preço de compra','Variação dos preços','Consumo de munição',
  'Capital inicial','Repor após vitória','Armas mantidas','Kit conservado','Prêmio mínimo sujo','Prêmio máximo sujo',
  'Lucro mínimo na vitória','Lucro máximo na vitória','Lucro por jogador','Saldo em caixa primeira vitória','Prejuízo na derrota',
  'Prêmio sugerido min','Prêmio sugerido max','Avaliação','Pendências'];
 const rows=actions.map(a=>{
  const d=analyzeDecision(a,catalog,{...options(),team:defaultTeam(a),referenceTeam:defaultTeam(a),
   location:null,kitMode:'oficial',priceMode:state.priceMode,quantities:{},prices:{},
   winChance:state.winChance});
  const p=d.calc;
  return [a.nome,a.status,p.team,p.rule?.policiais??'',state.priceMode,state.priceShift,state.ammoUse,
   p.kit.total,p.kit.winCost,p.kit.weapons,p.kit.retained,p.min,p.max,p.netMin,p.netMax,p.perPlayer,
   p.firstRunNetMin,p.loss,d.recommendedMin,d.recommendedMax,d.direction,p.kit.missing.join(' / ')];
 });
 const body='\ufeff'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([body],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='acoes-high-os-vitoria-derrota.csv';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function listeners(){
 root.addEventListener('click',ev=>{
  if(ev.target.closest('#apOpenStrategy')){workspace?.openSuggestion();return;}
  const manage=ev.target.closest('[data-ap-manage]');
  if(manage){choose(manage.dataset.apManage);return;}
  const ranked=ev.target.closest('[data-ap-ranked]');
  if(ranked){choose(ranked.dataset.apRanked);return;}
  const rank=ev.target.closest('[data-ap-rank]');
  if(rank){state.rankMode=rank.dataset.apRank;rankBoard();return;}
  const a=ev.target.closest('[data-ap-action]');
  if(a){choose(a.dataset.apAction);return;}
  const l=ev.target.closest('[data-ap-local]');
  if(l){localIndex=Number(l.dataset.apLocal)||0;state.quantities={};state.prices={};render();return;}
  const team=ev.target.closest('[data-ap-team]');
  if(team){state.team=Number(team.dataset.apTeam);state.quantities={};render();return;}
  const preset=ev.target.closest('[data-ap-shift]');
  if(preset){state.priceShift=Number(preset.dataset.apShift)/100;el('apPriceShift').value=Math.round(state.priceShift*100);render();return;}
  if(ev.target.closest('#apCopy'))copyProposal();
  if(ev.target.closest('#apApproveManual')){approveProposal('manual');return;}
  if(ev.target.closest('#apApprove')){approveProposal('sugestao');return;}
  if(ev.target.closest('#apReject')){rejectProposal();return;}
  if(ev.target.closest('#apSaveReference')){saveReference();return;}
  if(ev.target.closest('#apRefreshPrices')){refreshPriceCatalog();return;}
  if(ev.target.closest('#apReadSheet')){refreshSheetPrizes();return;}
  if(ev.target.closest('#apHistory')){showDecisionHistory();return;}
  if(ev.target.closest('#apManageShowAll')){management.showAll=!management.showAll;renderManagement();return;}
  if(ev.target.closest('#apCatalogMore')){state.listLimit+=24;actionsList();return;}
  if(ev.target.closest('#apExport'))exportAnalysis();
  if(ev.target.closest('#apManagementExport'))exportManagement();
 });
 root.addEventListener('input',ev=>{
  const target=ev.target;
  if(target.id==='apSearch'){state.search=target.value;state.listLimit=24;actionsList();return;}
  if(target.id==='apManagementSearch'){management.search=target.value;management.showAll=false;renderManagement();return;}
  const riskMap={apPortfolioWinChance:['winChance',.01],apPortfolioPoliceWait:['policeWaitMinutes',1],
   apPortfolioDuration:['estimatedActionMinutes',1]};
  const risk=riskMap[target.id];
  if(risk){
   const max=risk[0]==='winChance'?100:600;
   const val=target.value===''?null:Number(target.value);
   management[risk[0]]=val===null||!Number.isFinite(val)?null:Math.max(0,Math.min(max,val))*risk[1];
   renderManagement();return;
  }
  const indexQty=target.dataset.apQty,indexPrice=target.dataset.apPrice;
  if(indexQty!==undefined||indexPrice!==undefined){
   const id=Number(indexQty??indexPrice);
   const field=indexQty!==undefined?'quantities':'prices';
   if(target.value===''||!Number.isFinite(Number(target.value)))delete state[field][id];
   else state[field][id]=Math.max(0,Number(target.value));
   const p=calculateAction(action(),catalog,options()),row=target.closest('tr');
   if(row){
    row.cells[3].textContent=money(p.kit.lines[id]?.total);
    row.cells[4].textContent=p.kit.lines[id]?.missing?'A confirmar':p.kit.lines[id]?.winCost===0?'Mantém':money(p.kit.lines[id]?.winCost);
   }
   el('apTotal').textContent=money(p.kit.total);
   el('apWinCostTotal').textContent=money(p.kit.winCost);
   actionsList();summary();return;
  }
  if(target.id==='apPriceShift'||target.id==='apAmmoUse'){
   const v=Number(target.value);
   if(target.value!==''&&Number.isFinite(v)){
    if(target.id==='apPriceShift')state.priceShift=Math.max(-.9,Math.min(3,v/100));
    else state.ammoUse=Math.max(0,Math.min(1,v/100));
    render();
   }
   return;
  }
  const fields={apProfitGoal:['targetPerPlayer',1],apRoiGoal:['roi',.01],
   apTolerance:['tolerance',.01],apTax:['tax',.01],apManual:['manualPayout',1],
   apPoliceWait:['policeWaitMinutes',1],apActionDuration:['estimatedActionMinutes',1],
   apWinChance:['winChance',.01],apHourlyTarget:['targetHourly',1]};
  const f=fields[target.id];if(!f)return;
  if(target.value===''){
   if(['apManual','apPoliceWait','apActionDuration','apWinChance'].includes(target.id))state[f[0]]=null;
  }else{
   const v=Number(target.value);
   if(Number.isFinite(v))state[f[0]]=Math.max(0,v)*f[1];
  }
  if(target.id==='apTax')actionsList();
  if(target.id==='apTax')rankBoard();
  if(['apTax','apProfitGoal','apRoiGoal'].includes(target.id))renderManagement();
  summary();
 });
 root.addEventListener('change',ev=>{
  const e=ev.target;
  if(e.id==='apManagementFilter'){management.filter=e.value;management.showAll=false;renderManagement();}
  else if(e.id==='apManagementSort'){management.sort=e.value;management.showAll=false;renderManagement();}
  else if(e.id==='apStatusFilter'){state.status=e.value;state.listLimit=24;actionsList();}
  else if(e.id==='apRankingLimit'){state.rankLimit=Number(e.value)||10;rankBoard();}
  else if(e.id==='apPriceMode'){state.priceMode=e.value;state.prices={};render();}
  else if(e.id==='apKitMode'){state.kitMode=e.value;state.quantities={};render();}
  else if(e.id==='apAccessMode'){state.accessConsumed=e.value==='consumido';render();}
  else if(e.id==='apTeam'){state.team=Number(e.value);state.quantities={};render();}
  else if(e.id==='apTeamPayout'){state.teamPayout=e.value;render();}
 });
}
export async function mountActionPlanner({onApproveAction=null,onReadReference:readReference=null,
 onSaveReference:savePriceReference=null,onRejectAction:rejectAction=null,
 onReadDecisions:readDecisions=null,onReadSheet:readSheet=null,
 onReadRegistry:readRegistry=null,onMutateRegistry:mutateRegistry=null}={}){
 approveHandler=onApproveAction;
 onReadReference=readReference;onSaveReference=savePriceReference;
 onRejectAction=rejectAction;onReadDecisions=readDecisions;onReadSheet=readSheet;
 root=el('actionEconomyPlanner');if(!root)return;
 if(!workspace)workspace=createActionWorkspace({root,
  getActions:()=>actions,getPublished:()=>publishedActions,getCatalog:()=>catalog,
  getSelected:()=>selection,select:name=>choose(name),refresh:repaintRegistry,
  onReadRegistry:readRegistry,onMutateRegistry:mutateRegistry});
 if(ready){
  if(onReadReference){try{reference=await onReadReference();}catch(e){console.warn('[AÇÕES] Referência indisponível',e);}}
  await refreshPriceCatalog();return;
 }
 ready=true;
 try{
  const responses=await Promise.all([fetch(ACOES_SOURCE,{cache:'no-store'}),fetch(CATALOGO_SOURCE,{cache:'no-store'})]);
  if(responses.some(r=>!r.ok))throw Error('Falha ao consultar o Mercado Negro. HTTP: '+responses.map(r=>r.status).join(' / '));
  const [data,prices]=await Promise.all(responses.map(r=>r.json()));
  if(!Array.isArray(data.acoes)||!data.acoes.length||!Array.isArray(prices.itens))throw Error('Formato de dados inválido ou incompleto.');
  publishedActions=data.acoes;catalog=prices;meta=data.meta||{};
  await workspace.load();actions=combinePublished();
  lastPriceRead=new Date().toISOString();
  if(onReadReference){
   try{reference=await onReadReference();}
   catch(e){console.warn('[AÇÕES] Referência de preço indisponível:',e)}
  }
  const publishedWash=Number(meta.taxa_lavagem);
  state.tax=Number.isFinite(publishedWash)&&publishedWash>=0&&publishedWash<1?publishedWash:.3;
  el('apTax').value=Math.round(state.tax*100);
  selection=actions.find(a=>a.status!=='inativo')?.nome||actions[0]?.nome||'';
  state.team=action()?defaultTeam(action()):0;
  el('apSource').textContent='Mercado Negro — '+actions.length+' ações carregadas • preços publicados em '+(catalog.meta?.atualizado_em||'data não informada')+' • dados oficiais não modificados';
  listeners();render();
 }catch(err){
  ready=false;
  root.innerHTML='<div class="ap-error"><b>Não foi possível carregar os dados do Mercado Negro.</b><p>'+safe(err?.message||err)+'</p><button type="button" class="ap-button" id="apRetry">Tentar novamente</button></div>';
  root.querySelector('#apRetry')?.addEventListener('click',()=>{location.reload();});
 }
}
