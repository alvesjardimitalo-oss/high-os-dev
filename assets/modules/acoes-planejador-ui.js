import {ACOES_SOURCE,CATALOGO_SOURCE,calculateAction,defaultTeam,availableTeams,getRules,photoUrl,norm} from './acoes-core.js?v=2';

const el=id=>document.getElementById(id);
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(x):'A confirmar';
const percent=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:1}).format(x):'—';
let root,ready=false,actions=[],catalog=null,meta=null,selection='',localIndex=0;
let approveHandler=null,approvedThisSession=new Set();
const state={team:0,search:'',status:'ATIVAS',priceMode:'pista',kitMode:'por-jogador',priceShift:0,ammoUse:.25,roi:.25,
 targetPerPlayer:20000,tolerance:.25,tax:.3,quantities:{},prices:{},manualPayout:null};
const action=()=>actions.find(a=>a.nome===selection);
const place=()=>action()?.locais?.[localIndex]||null;
const options=()=>({...state,location:place()});
const kpi=(label,value,style='',info='')=>'<div class="ap-kpi '+style+'"><small>'+safe(label)+'</small><strong>'+safe(value)+'</strong>'+(info?'<div class="ap-extra">'+safe(info)+'</div>':'')+'</div>';
const chip=s=>'<span class="ap-tag '+(['BUFF','NERF','REVISAR CUSTO','INSUMO SEM PREÇO','EQUIPE INVÁLIDA'].includes(s)?'warning':s==='MANTER'?'good':'')+'">'+safe(s)+'</span>';
function choose(name){
 selection=name;localIndex=0;state.prices={};state.quantities={};state.manualPayout=null;
 state.team=defaultTeam(action());el('apManual').value='';render();
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
   priceShift:state.priceShift,ammoUse:state.ammoUse,tax:state.tax});
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
  safe(categoryLabel[l.category]||l.category)+' · '+safe(l.source)+'</span></td>'+
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
 warning.textContent=warns.join(' ')||'Na vitória, armas e munições não utilizadas permanecem com a facção. Coletes e pendrives são consumidos. Na derrota, todo o kit é perdido.';
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
 actionsList();teamOptions();photosAndRules();kitTable();summary();
}
async function copyProposal(){
 const a=action(),p=calculateAction(a,catalog,options());
 if(!p.payoutAdjustable)return;
 const text=['HIGH ROLEPLAY — PROPOSTA DE BUFF / NERF',
 'AÇÃO: '+a.nome,'AVALIAÇÃO: '+p.status,
 'INVASORES: '+p.team+' / POLICIAIS: '+(p.rule?.policiais??'Não informado')+' / REFÉNS: '+(p.rule?.refens??'Não informado'),
 'CUSTO DO KIT ('+state.kitMode+'): '+money(p.kit.total),
 'LAVAGEM: '+percent(p.tax),
 'PRÊMIOS ATUAIS (SUJO): '+money(p.min)+' a '+money(p.max),
 'LUCRO LÍQUIDO ATUAL: '+money(p.netMin)+' a '+money(p.netMax),
 'LUCRO ATUAL POR JOGADOR (MÍN): '+money(p.perPlayer),
 'META POR JOGADOR: '+money(p.targetPerPlayer)+' / META ROI: '+percent(p.targetROI),
 'NOVO PRÊMIO MÍN SUGERIDO: '+money(p.payoutNeeded),
 'NOVO PRÊMIO MÁX SUGERIDO: '+money(p.payoutMax),
 'DIFERENÇA (BUFF/NERF): '+(p.delta>=0?'+':'−')+money(Math.abs(p.delta)),
 'CUSTOS: '+p.kit.lines.map(i=>i.name+' x'+i.qty+' = '+money(i.total)).join(' / '),
 'Os buffs históricos já constam dos prêmios atuais; NÃO reaplicar.',
 'NÃO APLICA AUTOMATICAMENTE AO JOGO NEM À PLANILHA.'].join('\n');
 const status=el('apCopyStatus');
 try{await navigator.clipboard.writeText(text);status.textContent='Proposta copiada. Revisão e aprovação necessárias antes de alterar prêmio oficial.';}
 catch{status.textContent='Clipboard indisponível. Copie esta análise em um navegador seguro com HTTPS.';}
}
async function approveProposal(){
 if(!approveHandler)return;
 const a=action(),p=calculateAction(a,catalog,options());
 if(!['BUFF','NERF'].includes(p.status)||approvedThisSession.has(a.nome))return;
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
 const headers=['Ação','Status','Invasores','Policiais mínimos','Custo simulado','Custo oficial','Prêmio atual min','Prêmio atual max','Lucro líquido min','Lucro por invasor','Meta individual','Meta ROI','Sugerido min','Sugerido max','Buff/nerf','Avaliação','Pendências'];
 const rows=actions.map(a=>{
  const p=calculateAction(a,catalog,{...options(),team:defaultTeam(a),location:null,quantities:{},prices:{}});
  return [a.nome,a.status,p.team,p.rule?.policiais??'',p.kit.total,p.kit.official,p.min,p.max,p.netMin,p.perPlayer,p.targetPerPlayer,p.targetROI,p.payoutNeeded,p.payoutMax,p.delta,p.status,p.kit.missing.join(' / ')];
 });
 const body='\ufeff'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([body],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='analise-buff-nerf-high-os.csv';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function listeners(){
 root.addEventListener('click',ev=>{
  const a=ev.target.closest('[data-ap-action]');
  if(a){choose(a.dataset.apAction);return;}
  const l=ev.target.closest('[data-ap-local]');
  if(l){localIndex=Number(l.dataset.apLocal)||0;state.quantities={};state.prices={};render();return;}
  const team=ev.target.closest('[data-ap-team]');
  if(team){state.team=Number(team.dataset.apTeam);state.quantities={};render();return;}
  if(ev.target.closest('#apCopy'))copyProposal();
  if(ev.target.closest('#apApprove'))approveProposal();
  if(ev.target.closest('#apExport'))exportAnalysis();
 });
 root.addEventListener('input',ev=>{
  const target=ev.target;
  if(target.id==='apSearch'){state.search=target.value;actionsList();return;}
  const indexQty=target.dataset.apQty;
  const indexPrice=target.dataset.apPrice;
  if(indexQty!==undefined||indexPrice!==undefined){
   const id=Number(indexQty??indexPrice);
   const field=indexQty!==undefined?'quantities':'prices';
   if(target.value===''||!Number.isFinite(Number(target.value)))delete state[field][id];
   else state[field][id]=Math.max(0,Number(target.value));
   const p=calculateAction(action(),catalog,options());
   const tr=target.closest('tr');
   if(tr)tr.lastElementChild.textContent=money(p.kit.lines[id]?.total);
   el('apTotal').textContent=money(p.kit.total);
   summary();return;
  }
  const fields={
   apReuse:['reuse',.01],apProfitGoal:['targetPerPlayer',1],
   apRoiGoal:['roi',.01],apTolerance:['tolerance',.01],
   apTax:['tax',.01],apManual:['manualPayout',1]
  };
  const f=fields[target.id];if(!f)return;
  if(target.value===''){if(target.id==='apManual')state.manualPayout=null;}
  else state[f[0]]=Math.max(0,Number(target.value)||0)*f[1];
  summary();
 });
 root.addEventListener('change',ev=>{
  const e=ev.target;
  if(e.id==='apStatusFilter'){state.status=e.value;actionsList();}
  else if(e.id==='apPriceMode'){state.priceMode=e.value;state.prices={};render();}
  else if(e.id==='apKitMode'){state.kitMode=e.value;state.quantities={};render();}
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
