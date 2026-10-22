import {ACOES_SOURCE,CATALOGO_SOURCE,calculateAction,defaultTeam,availableTeams,getRules,photoUrl,norm} from './acoes-core.js?v=2';
import {RANKING_MODES,buildActionRankings} from './acoes-ranking.js?v=1';
import {makePriceReference,assessPriceChanges,analyzeDecision,applySheetPrizeOverrides} from './acoes-inteligencia.js?v=1';

const el=id=>document.getElementById(id);
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(x):'A confirmar';
const percent=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:1}).format(x):'—';
let root,ready=false,actions=[],catalog=null,meta=null,selection='',localIndex=0;
let approveHandler=null,approvedThisSession=new Set();
let onReadReference=null,onSaveReference=null,onRejectAction=null,onReadDecisions=null,onReadSheet=null;
let reference=null,sheetOverrides=[],publishedActions=[],lastPriceRead=null;
const state={team:0,search:'',status:'ATIVAS',priceMode:'pista',kitMode:'oficial',priceShift:0,ammoUse:.25,accessConsumed:true,roi:.25,
 targetPerPlayer:20000,tolerance:.25,tax:.3,rankMode:'lucro-total',rankLimit:10,quantities:{},prices:{},manualPayout:null,teamPayout:'publicado',policeWaitMinutes:null,estimatedActionMinutes:null,winChance:null,targetHourly:0};
const action=()=>actions.find(a=>a.nome===selection);
const place=()=>action()?.locais?.[localIndex]||null;
const options=()=>({...state,location:place()});
const decision=()=>analyzeDecision(action(),catalog,{...options(),team:state.team,referenceTeam:defaultTeam(action())});
const kpi=(label,value,style='',info='')=>'<div class="ap-kpi '+style+'"><small>'+safe(label)+'</small><strong>'+safe(value)+'</strong>'+(info?'<div class="ap-extra">'+safe(info)+'</div>':'')+'</div>';
const chip=s=>'<span class="ap-tag '+(['BUFF','NERF','REVISAR CUSTO','INSUMO SEM PREÇO','EQUIPE INVÁLIDA'].includes(s)?'warning':s==='MANTER'?'good':'')+'">'+safe(s)+'</span>';
function choose(name){
 selection=name;localIndex=0;state.prices={};state.quantities={};state.manualPayout=null;
 state.team=defaultTeam(action());el('apManual').value='';render();
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
      ' • '+(c.difference>0?'considerar revisão de buff':'considerar revisão de nerf')+'</small>'+
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
  reference=snapshot;refreshPriceAlerts();
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
  publishedActions=data.acoes;actions=applySheetPrizeOverrides(publishedActions,sheetOverrides);
  catalog=next;meta=data.meta||{};
  if(!action())selection=actions.find(a=>a.status!=='inativo')?.nome||actions[0]?.nome||'';
  if(action())render();
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
  actions=applySheetPrizeOverrides(publishedActions,sheetOverrides);
  if(action())render();
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
   ' • '+safe(d.usuario)+' • '+safe(d.motivo||'Sem justificativa cadastrada')+'</div>'
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
 el('apActionCount').textContent=results.length+' de '+actions.length+' ações';
 el('apActionList').innerHTML=results.map(a=>{
  const p=calculateAction(a,catalog,{team:defaultTeam(a),kitMode:state.kitMode,priceMode:state.priceMode,
   priceShift:state.priceShift,ammoUse:state.ammoUse,accessConsumed:state.accessConsumed,tax:state.tax});
  const match=p.kit.missing.length?'Custos pendentes':
   'Vitória '+money(p.netMin)+' · Derrota '+money(p.loss);
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
  const p=calculateAction(action(),catalog,{...options(),team:r.invasores,quantities:{},prices:{}});
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
 const p=calculateAction(a,catalog,options());
 el('apActionStatus').innerHTML=chip(a.status==='inativo'?'INATIVA':p.status);
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
  kpi('Prêmio mínimo proposto (sujo)',money(p.payoutNeeded),'gold'),
  kpi('Prêmio máximo proposto (sujo)',money(p.payoutMax)),
  kpi('Diferença sugerida',p.delta===null?'A confirmar':(p.delta>=0?'+':'−')+money(Math.abs(p.delta)),p.delta===null?'':p.delta>=0?'good':'bad'),
  kpi('Lucro na vitória com proposta',money(p.proposedNet),cs(p.proposedNet)),
  kpi('Lucro por jogador com proposta',money(p.proposedPerPlayer),cs(p.proposedPerPlayer)),
  kpi('ROI alvo sobre kit inteiro',percent(p.targetROI)),
  kpi('ROI atual na vitória',percent(p.roi))
 ].join('');
 const message=p.status==='BUFF'?'Lucro na vitória abaixo da meta: considerar aumento.':
  p.status==='NERF'?'Lucro na vitória acima da meta: considerar redução.':
  p.status==='MANTER'?'Lucro na vitória dentro da meta.':'Revisar regras, preços e quantidades antes de propor ajustes.';
 const out=el('apResult');out.className='ap-result'+(['BUFF','NERF'].includes(p.status)?' warning':'');
 out.innerHTML='<strong>'+safe(p.status)+'</strong><span>'+safe(message)+'</span>';
 el('apProposal').textContent='Cenário: '+p.team+' jogadores • lavagem '+percent(p.tax)+
  ' • capital '+money(p.kit.total)+' • repõe se vencer '+money(p.kit.winCost)+
  ' • perde se derrotado '+money(p.kit.lossCost)+'. A proposta considera o lucro da vitória, sem estimar chance de derrota. Buffs passados já estão incluídos.';
 const alternative=el('apManualOutcome');
 alternative.textContent=state.manualPayout===null?'Insira outro prêmio para estimar a vitória.':
  p.kit.winCost===null?'Algum preço está pendente.':
  'Com '+money(state.manualPayout)+' sujo, lucro na vitória de '+
  money(state.manualPayout*(1-p.tax)-p.kit.winCost)+' ('+
  money((state.manualPayout*(1-p.tax)-p.kit.winCost)/p.team)+' por jogador). Prejuízo na derrota: '+money(p.loss)+'.';
 el('apCopy').disabled=!p.payoutAdjustable;
 const hypothetical=state.priceShift!==0||Object.keys(state.prices).length>0||Object.keys(state.quantities).length>0;
 const sync=el('apApprove');if(sync){
  sync.hidden=!approveHandler;
  sync.disabled=!approveHandler||!['BUFF','NERF'].includes(p.status)||hypothetical||approvedThisSession.has(a.nome);
  sync.title=hypothetical?'Remova ajustes hipotéticos para sincronizar a planilha.':'Exige confirmação antes de escrever.';
 }
 scenarios();
}
function render(){
 if(!action())return;
 actionsList();rankBoard();refreshPriceAlerts();teamOptions();photosAndRules();kitTable();summary();
}
async function copyProposal(){
 const a=action(),p=calculateAction(a,catalog,options());
 if(!p.payoutAdjustable)return;
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
 'PRÊMIO MÍNIMO SUGERIDO: '+money(p.payoutNeeded),
 'PRÊMIO MÁXIMO SUGERIDO: '+money(p.payoutMax),
 'KIT: '+p.kit.lines.map(i=>i.name+' x'+i.qty+' (investimento '+money(i.total)+', repor '+money(i.winCost)+')').join(' / '),
 'Hipóteses: pendrive '+(state.accessConsumed?'consumido':'reutilizável')+', colete de uso único e armas preservadas na vitória. Não há cálculo de chance de derrota.',
 'Premiações atuais já incluem buffs/nerfs existentes. Nenhuma mudança automática no jogo.'].join('\n');
 const status=el('apCopyStatus');
 try{await navigator.clipboard.writeText(text);status.textContent='Análise copiada. Verifique os cenários antes de qualquer alteração oficial.';}
 catch{status.textContent='Área de transferência indisponível no navegador.';}
}
async function approveProposal(){
 if(!approveHandler)return;
 const a=action(),p=calculateAction(a,catalog,options());
 if(!['BUFF','NERF'].includes(p.status)||approvedThisSession.has(a.nome)||state.priceShift!==0||Object.keys(state.prices).length||Object.keys(state.quantities).length)return;
 const button=el('apApprove'),message=el('apCopyStatus');
 button.disabled=true;message.textContent='Verificando a aba original e aguardando aprovação segura...';
 try{
  const result=await approveHandler({name:a.nome,officialMin:p.min,proposedMin:p.payoutNeeded,
    team:p.team,cost:p.kit.total,tax:p.tax});
  if(result?.cancelled){message.textContent='Aprovação cancelada. Nenhuma célula foi alterada.';return;}
  if(!result?.updated)throw Error('A sincronização não confirmou a alteração.');
  approvedThisSession.add(a.nome);
  message.textContent='BUFF/NERF atualizado na aba original. '+(result.verified?'Prêmio conferido.':'Confira o resultado da fórmula no Google Sheets.')+
    (result.audited?' Auditoria registrada no High OS.':' Histórico do High OS pendente.');
 }catch(error){
  message.textContent='NÃO SINCRONIZADO: '+(error?.message||String(error));
 }finally{button.disabled=approvedThisSession.has(a.nome)||!['BUFF','NERF'].includes(p.status);}
}
function csvCell(v){return '"'+String(v??'').replaceAll('"','""')+'"';}
function exportAnalysis(){
 const headers=['Ação','Situação','Invasores','Policiais','Preço de compra','Variação dos preços','Consumo de munição',
  'Capital inicial','Repor após vitória','Armas mantidas','Kit conservado','Prêmio mínimo sujo','Prêmio máximo sujo',
  'Lucro mínimo na vitória','Lucro máximo na vitória','Lucro por jogador','Saldo em caixa primeira vitória','Prejuízo na derrota',
  'Prêmio sugerido min','Prêmio sugerido max','Avaliação','Pendências'];
 const rows=actions.map(a=>{
  const p=calculateAction(a,catalog,{...options(),team:defaultTeam(a),location:null,quantities:{},prices:{}});
  return [a.nome,a.status,p.team,p.rule?.policiais??'',state.priceMode,state.priceShift,state.ammoUse,
   p.kit.total,p.kit.winCost,p.kit.weapons,p.kit.retained,p.min,p.max,p.netMin,p.netMax,p.perPlayer,
   p.firstRunNetMin,p.loss,p.payoutNeeded,p.payoutMax,p.status,p.kit.missing.join(' / ')];
 });
 const body='\ufeff'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([body],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='acoes-high-os-vitoria-derrota.csv';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function listeners(){
 root.addEventListener('click',ev=>{
  const ranked=ev.target.closest('[data-ap-ranked]');
  if(ranked){choose(ranked.dataset.apRanked);el('apActionTitle')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
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
  if(ev.target.closest('#apApprove'))approveProposal();
  if(ev.target.closest('#apExport'))exportAnalysis();
 });
 root.addEventListener('input',ev=>{
  const target=ev.target;
  if(target.id==='apSearch'){state.search=target.value;actionsList();return;}
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
   apTolerance:['tolerance',.01],apTax:['tax',.01],apManual:['manualPayout',1]};
  const f=fields[target.id];if(!f)return;
  if(target.value===''){if(target.id==='apManual')state.manualPayout=null;}
  else state[f[0]]=Math.max(0,Number(target.value)||0)*f[1];
  if(target.id==='apTax')actionsList();
  if(target.id==='apTax')rankBoard();
  summary();
 });
 root.addEventListener('change',ev=>{
  const e=ev.target;
  if(e.id==='apStatusFilter'){state.status=e.value;actionsList();}
  else if(e.id==='apRankingLimit'){state.rankLimit=Number(e.value)||10;rankBoard();}
  else if(e.id==='apPriceMode'){state.priceMode=e.value;state.prices={};render();}
  else if(e.id==='apKitMode'){state.kitMode=e.value;state.quantities={};render();}
  else if(e.id==='apAccessMode'){state.accessConsumed=e.value==='consumido';render();}
  else if(e.id==='apTeam'){state.team=Number(e.value);state.quantities={};render();}
 });
}
export async function mountActionPlanner({onApproveAction=null}={}){
 approveHandler=onApproveAction;
 root=el('actionEconomyPlanner');if(!root||ready)return;
 ready=true;
 try{
  const responses=await Promise.all([fetch(ACOES_SOURCE,{cache:'no-store'}),fetch(CATALOGO_SOURCE,{cache:'no-store'})]);
  if(responses.some(r=>!r.ok))throw Error('Falha ao consultar o Mercado Negro. HTTP: '+responses.map(r=>r.status).join(' / '));
  const [data,prices]=await Promise.all(responses.map(r=>r.json()));
  if(!Array.isArray(data.acoes)||!data.acoes.length||!Array.isArray(prices.itens))throw Error('Formato de dados inválido ou incompleto.');
  actions=data.acoes;catalog=prices;meta=data.meta||{};
  const publishedWash=Number(meta.taxa_lavagem);
  state.tax=Number.isFinite(publishedWash)&&publishedWash>=0&&publishedWash<1?publishedWash:.3;
  el('apTax').value=Math.round(state.tax*100);
  selection=actions.find(a=>a.status!=='inativo')?.nome||actions[0].nome;
  state.team=defaultTeam(action());
  el('apSource').textContent='Mercado Negro — '+actions.length+' ações carregadas • preços publicados em '+(catalog.meta?.atualizado_em||'data não informada')+' • dados oficiais não modificados';
  listeners();render();
 }catch(err){
  ready=false;
  root.innerHTML='<div class="ap-error"><b>Não foi possível carregar os dados do Mercado Negro.</b><p>'+safe(err?.message||err)+'</p><button type="button" class="ap-button" id="apRetry">Tentar novamente</button></div>';
  root.querySelector('#apRetry')?.addEventListener('click',()=>{location.reload();});
 }
}
