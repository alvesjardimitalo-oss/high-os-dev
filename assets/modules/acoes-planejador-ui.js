import {ACOES_SOURCE,CATALOGO_SOURCE,calculateAction,defaultTeam,availableTeams,getRules,photoUrl,norm} from './acoes-core.js?v=1';

const el=id=>document.getElementById(id);
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(x):'A confirmar';
const percent=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:1}).format(x):'—';
let root,ready=false,actions=[],catalog=null,meta=null,selection='',localIndex=0;
const state={team:0,search:'',status:'ATIVAS',priceMode:'pista',kitMode:'por-jogador',reuse:0,roi:.25,
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
   const r=calculateAction(a,catalog,{team:defaultTeam(a),kitMode:'oficial'});
   return r.kit.missing.length>0||r.kit.baselineMismatch;
  }
  return true;
 });
 el('apActionCount').textContent=results.length+' / '+actions.length;
 el('apActionList').innerHTML=results.map(a=>
  '<button type="button" class="ap-choice" data-ap-action="'+safe(a.nome)+'" aria-pressed="'+(a.nome===selection?'true':'false')+'">'+
   '<span><b>'+safe(a.nome)+'</b><small>'+safe(availableTeams(a).join(' / ')||'Equipe pendente')+' invasores</small></span>'+
   '<em>'+safe(a.status==='inativo'?'INATIVA':money(a.premio_min))+'</em></button>'
 ).join('')||'<p class="ap-row-muted">Nenhuma ação encontrada.</p>';
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
function kitTable(){
 const p=calculateAction(action(),catalog,options());
 el('apKitRows').innerHTML=p.kit.lines.map(l=>
  '<tr><td><span class="ap-item-name">'+safe(l.name)+'</span><span class="ap-item-source">'+safe(l.source)+' · Qtd. original '+l.officialQty+'</span></td>'+
  '<td><input class="ap-table-input" type="number" min="0" max="500" step="1" data-ap-qty="'+l.index+'" value="'+safe(l.qty)+'"></td>'+
  '<td><input class="ap-table-input" type="number" min="0" step="1" data-ap-price="'+l.index+'" placeholder="Sem preço" value="'+safe(l.unit??'')+'"></td>'+
  '<td>'+safe(money(l.total))+'</td></tr>'
 ).join('');
 el('apTotal').textContent=money(p.kit.total);
}
function scenarios(){
 const rules=getRules(action(),place());
 if(!rules.length){el('apScenarios').innerHTML='<p class="ap-row-muted">Nenhuma faixa de invasores publicada.</p>';return;}
 const body=rules.map(r=>{
  // A matriz compara equipes em condições iguais, com kit calculado para cada tamanho.
  const p=calculateAction(action(),catalog,{...options(),team:r.invasores,quantities:{},prices:{}});
  return '<tr class="'+(r.invasores===Number(state.team)?'ap-scenario-active':'')+'">'+
   '<td><button type="button" class="ap-button" data-ap-team="'+r.invasores+'">'+r.invasores+'</button></td>'+
   '<td>'+safe(r.policiais??'—')+'</td><td>'+safe(money(p.kit.total))+'</td>'+
   '<td>'+safe(money(p.netMin))+'</td><td>'+safe(money(p.perPlayer))+'</td>'+
   '<td>'+safe(money(p.payoutNeeded))+'</td><td>'+safe(p.status)+'</td></tr>';
 }).join('');
 el('apScenarios').innerHTML='<table><thead><tr><th>INVASORES</th><th>POLICIAIS</th><th>INVESTIMENTO</th><th>LUCRO TOTAL</th><th>LUCRO / PESSOA</th><th>PAGAR (SUJO)</th><th>SUGESTÃO</th></tr></thead><tbody>'+body+'</tbody></table>'+
 '<p class="ap-row-muted">Nesta comparação são usadas quantidades padrão por equipe, sem ajustes manuais temporários.</p>';
}
function summary(){
 const a=action();if(!a)return;
 const p=calculateAction(a,catalog,options());
 el('apActionStatus').innerHTML=chip(a.status==='inativo'?'INATIVA':p.status);
 el('apKitComputed').textContent='Custo oficial publicado: '+money(p.kit.official)+' • Custo simulado: '+money(p.kit.total);
 const warns=[];
 if(!p.teamValid)warns.push('Equipe selecionada não prevista nas regras de invasores.');
 if(p.kit.missing.length)warns.push('Preço ausente: '+p.kit.missing.join(', ')+'. Não recomendamos alterar prêmios com esse insumo pendente.');
 if(p.kit.comparison!==null&&Math.abs(p.kit.comparison)>1)
  warns.push('Diferença do kit oficial: '+money(p.kit.comparison)+'. Verifique o tamanho da equipe e os itens publicados.');
 if(state.kitMode==='oficial'){
  const missingGear=p.kit.lines.filter(i=>!/^PENDRIVE/i.test(i.name)&&i.qty<p.team);
  if(missingGear.length)warns.push('Kit cadastrado com menos unidades que jogadores: '+missingGear.map(i=>i.name+' '+i.qty+'/'+p.team).join('; ')+'.');
 }
 const warning=el('apWarnings');warning.className='ap-hint'+(warns.length?' warn':'');
 warning.textContent=warns.join(' ')||'Modo "1 kit por jogador": dimensionamento hipotético para custear cada invasor. Modo oficial: preserva as quantidades cadastradas.';
 el('apCurrentMetrics').innerHTML=[
  kpi('Prêmio mínimo atual (sujo)',money(p.min),'','Buff aprovado já incluso: '+money(p.buffIncluded)),
  kpi('Prêmio máximo atual (sujo)',money(p.max)),
  kpi('Recebido após lavagem',money(p.min===null?null:p.min*(1-p.tax)),''),
  kpi('Investimento total no kit',money(p.kit.total),'gold'),
  kpi('Lucro líquido mínimo total',money(p.netMin),p.netMin!==null?(p.netMin>=0?'good':'bad'):''),
  kpi('Lucro líquido máximo total',money(p.netMax),p.netMax!==null?(p.netMax>=0?'good':'bad'):''),
  kpi('Lucro mínimo por invasor',money(p.perPlayer),p.perPlayer!==null?(p.perPlayer>=0?'good':'bad'):''),
  kpi('ROI líquido mínimo',percent(p.roi))
 ].join('');
 el('apGoals').innerHTML=[
  kpi('Meta líquida total',money(p.targetProfit),'gold','Maior entre lucro individual e ROI'),
  kpi('Prêmio mínimo proposto (sujo)',money(p.payoutNeeded),'gold'),
  kpi('Prêmio máximo proposto (sujo)',money(p.payoutMax)),
  kpi('Buff / nerf a aplicar',p.delta===null?'A confirmar':(p.delta>=0?'+':'−')+money(Math.abs(p.delta)),p.delta===null?'':p.delta>=0?'good':'bad'),
  kpi('Lucro após proposta',money(p.proposedNet),'good'),
  kpi('Lucro por pessoa após proposta',money(p.proposedPerPlayer),'good'),
  kpi('Lucro alvo por pessoa',money(p.targetPerPlayer)),
  kpi('ROI alvo',percent(p.targetROI))
 ].join('');
 const message=p.status==='BUFF'?'O lucro atual está abaixo da meta. Estudar aumento do prêmio.':
  p.status==='NERF'?'O lucro atual supera a meta além da tolerância. Estudar redução do prêmio.':
  p.status==='MANTER'?'O valor atual está dentro da faixa de lucro configurada.':
  'A proposta depende da conferência dos insumos e regras da ação.';
 const out=el('apResult');out.className='ap-result'+(['BUFF','NERF'].includes(p.status)?' warning':'');
 out.innerHTML='<strong>'+safe(p.status)+'</strong><span>'+safe(message)+'</span>';
 el('apProposal').textContent='Cenário: '+p.team+' invasores, '+(p.rule?.policiais??'N/D')+' policiais, lavagem '+percent(p.tax)+', custo do kit '+money(p.kit.total)+'. Prêmio recomendado resulta da maior meta entre lucro por jogador e ROI, sem reaplicar buffs anteriores.';
 const alternative=el('apManualOutcome');
 alternative.textContent=state.manualPayout===null?'Teste um prêmio alternativo para comparar o retorno individual.':
  p.kit.effectiveCost===null?'Preço de algum item ainda pendente.':
  'Com '+money(state.manualPayout)+' sujo, lucro líquido total de '+
   money(state.manualPayout*(1-p.tax)-p.kit.effectiveCost)+' ('+money((state.manualPayout*(1-p.tax)-p.kit.effectiveCost)/p.team)+' por invasor).';
 el('apCopy').disabled=!p.payoutAdjustable;
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
export async function mountActionPlanner(){
 root=el('actionEconomyPlanner');if(!root||ready)return;
 ready=true;
 try{
  const responses=await Promise.all([fetch(ACOES_SOURCE,{cache:'no-store'}),fetch(CATALOGO_SOURCE,{cache:'no-store'})]);
  if(responses.some(r=>!r.ok))throw Error('Falha ao consultar o Mercado Negro. HTTP: '+responses.map(r=>r.status).join(' / '));
  const [data,prices]=await Promise.all(responses.map(r=>r.json()));
  if(!Array.isArray(data.acoes)||!data.acoes.length||!Array.isArray(prices.itens))throw Error('Formato de dados inválido ou incompleto.');
  actions=data.acoes;catalog=prices;meta=data.meta||{};
  state.tax=Number(meta.taxa_lavagem)===.3?.3:.3;
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
