/** Painel inicial da Economia Ilegal. Simula, nunca publica ou altera premiações. */
import {calculateAction,defaultTeam,priceOf} from './acoes-core.js?v=5';
import {analyzeDecision} from './acoes-inteligencia.js?v=6';
import {LOOT_TABLES} from './roubos-loot-data.js?v=1';
import {makeLootPrices,houseSearchParts,invasionExpectation,lootKey} from './roubos-loot-core.js?v=3';
import {STOLEN_ITEMS_SNAPSHOT} from './economia-npc-seed.js?v=2';

export function createSimpleEconomyPanel({root,getActions,getCatalog,getRegistry,getReference,onOpenAction,onOpenHouse,onOpenNpc,onNewAction}){
 const nav=root.querySelector('.ap-economy-navigation');
 if(!nav)return {selectArea(){},refresh(){}};
 const panel=document.createElement('section');
 panel.className='ap-simple-control';
 panel.id='apSimpleControl';
 nav.after(panel);
 const money=x=>Number.isFinite(x)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(x):'Preço pendente';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
 const number=x=>x===''||x===null||x===undefined?null:Number.isFinite(Number(x))?Number(x):null;
 const isCore=a=>!['atm','registradora','casas'].includes(a?.tipo_acao);
 const state={area:'acoes',name:'',item:'',delta:0,durability:6,locations:15,safes:0,tax:30,preset:'atm-c4'};
 const houseItems=()=>{const saved=getRegistry()?.npcMarkets?.CASAS;return saved?.updatedAt||saved?.items?.length?saved.items:STOLEN_ITEMS_SNAPSHOT;};
 const items=()=>houseItems().filter(x=>number(x.precoSujo)!==null&&number(x.precoSujo)>=0);
 function selector(label,key,options){
  return '<label class="ap-simple-field"><span>'+esc(label)+'</span><select data-eco-field="'+key+'">'+options.map(([value,title])=>'<option value="'+esc(value)+'"'+(String(state[key])===String(value)?' selected':'')+'>'+esc(title)+'</option>').join('')+'</select></label>';
 }
 function input(label,key,{min=0,max=1000000,step=1}={}){
  return '<label class="ap-simple-field"><span>'+esc(label)+'</span><input data-eco-field="'+key+'" type="number" min="'+min+'" max="'+max+'" step="'+step+'" value="'+esc(state[key])+'"></label>';
 }
 function kpis(rows){return '<div class="ap-simple-stats">'+rows.map(([title,value])=>
  '<div class="ap-simple-stat"><small>'+esc(title)+'</small><strong>'+esc(value)+'</strong></div>').join('')+'</div>';}
 function payoutAdjustment(){return '<label class="ap-simple-field ap-simple-adjust"><span>Ajuste da recompensa • dinheiro sujo (R$)</span>'+
  '<input type="number" data-eco-field="delta" min="-100000000" max="100000000" step="100" value="'+esc(state.delta)+'"></label>'+
  '<div class="ap-simple-presets"><button type="button" data-eco-delta="-5000">− 5.000</button><button type="button" data-eco-delta="-1000">− 1.000</button><button type="button" data-eco-delta="0">Manter</button><button type="button" data-eco-delta="1000">+ 1.000</button><button type="button" data-eco-delta="5000">+ 5.000</button></div>';}
 function badge(delta){return delta>0?'<span class="ap-simple-tag ap-simple-buff">BUFF • simulação</span>':delta<0?'<span class="ap-simple-tag ap-simple-nerf">NERF • simulação</span>':'<span class="ap-simple-tag">Sem alteração</span>';}
 function button(id,label){return '<button type="button" class="ap-button" data-eco-open="'+id+'">'+esc(label)+'</button>';}
 function pricesForHouse(){
  const rows=items(),selected=rows.find(x=>(x.codigo||x.nome)===state.item)||rows[0],prices=makeLootPrices(houseItems()),newPrices=new Map(prices);
  if(selected){
   const proposed=Math.max(0,Number(selected.precoSujo)+state.delta);
   if(selected.codigo)newPrices.set(lootKey(selected.codigo),proposed);
   if(selected.nome)newPrices.set(lootKey(selected.nome),proposed);
  }
  return {rows,selected,prices,newPrices};
 }
 function house(){
  const {rows,selected,prices,newPrices}=pricesForHouse();
  if(selected&&!state.item)state.item=selected.codigo||selected.nome;
  const catalog=getCatalog(),unit=priceOf('LOCKPICK ++',catalog,'pista').unit,investment=unit===null?null:unit/state.durability;
  let base=null,next=null,err='';
  try{
   const parts=houseSearchParts(LOOT_TABLES,state.locations,state.safes);
   base=invasionExpectation(parts,prices,{lockpickUnit:investment,tax:state.tax/100});
   next=invasionExpectation(parts,newPrices,{lockpickUnit:investment,tax:state.tax/100});
  }catch(e){err=String(e?.message||e);}
  const rowsOptions=rows.map(x=>[x.codigo||x.nome,x.nome+' • '+money(Number(x.precoSujo))]);
  return '<div class="ap-simple-intro"><h3>Roubo de casas</h3><p>O que muda o lucro? O preço pago pelo NPC e os itens encontrados. A gazua ++ entra no custo por invasão.</p></div>'+
   '<div class="ap-simple-fields">'+selector('Qual item do NPC ajustar?','item',rowsOptions)+input('Quantas invasões rende a gazua ++?','durability',{min:1,max:100})+
   input('Locais vasculhados por casa','locations',{min:1,max:100})+input('Desses locais, quantos são cofres?','safes',{min:0,max:100})+
   input('Lavagem (%)','tax',{min:0,max:99})+'</div>'+
   payoutAdjustment()+badge(state.delta)+
   (selected?'<p class="ap-simple-change">Pagamento do item: <b>'+money(Number(selected.precoSujo))+'</b> → <b>'+money(Math.max(0,Number(selected.precoSujo)+state.delta))+'</b> sujos por unidade.</p>':
    '<p class="ap-hint">Cadastre os pagamentos do NPC para calcular o retorno por item.</p>')+
   (base&&next?kpis([['Custo por casa • gazua',money(investment)],['Receita média conhecida • sujo',money(base.knownGrossDirty)],
    ['Lucro médio atual • conhecido',money(base.knownProfit)],['Lucro após ajuste • conhecido',money(next.knownProfit)]])+
    '<p class="ap-simple-impact">Mudança estimada no lucro por casa: <b>'+money(base.knownProfit===null||next.knownProfit===null?null:next.knownProfit-base.knownProfit)+'</b>.</p>'+
    (!base.allPriced?'<p class="ap-hint">Existem itens sem preço cadastrado; o lucro exibido é parcial, não o lucro total.</p>':''):'<p class="ap-hint">'+esc(err||'Ainda não há dados suficientes para a projeção.')+'</p>')+
   '<p class="ap-row-muted">Projeção pela tabela de sorteio dos armários e cofres. O contador de itens já comprados pelo NPC NÃO altera a chance de loot. A mudança de preço é apenas simulada.</p>'+
   '<div class="ap-simple-actions">'+button('npc','Editar preços reais no NPC')+button('house','Ver loot e registrar uma casa')+'</div>';
 }
 const presetRows=[
  {id:'atm-c4',type:'atm',name:'ATM com C4',min:28000,max:34000,explosive:'C4'},
  {id:'atm-c4pp',type:'atm',name:'ATM com C4++',min:40000,max:48000,explosive:'C4 ++'},
  {id:'registradora',type:'registradora',name:'Caixinha / registradora',min:22500,max:26250,explosive:''}
 ];
 function actions(type){
  const all=(getActions()||[]).filter(a=>a.status!=='inativo'&&(type==='blipada'?isCore(a):a.tipo_acao===type));
  const action=all.find(a=>a.nome===state.name)||all[0]||null;
  const preset=presetRows.find(p=>p.id===state.preset&&p.type===type)||presetRows.find(p=>p.type===type);
  if(action&&state.name!==action.nome)state.name=action.nome;
  let min=null,max=null,calc=null,cost=null,loss=null,source='',recommendation=null;
  if(action){
   calc=calculateAction(action,getCatalog(),{team:defaultTeam(action),kitMode:'oficial',priceMode:'pista',tax:state.tax/100});
   recommendation=analyzeDecision(action,getCatalog(),{team:defaultTeam(action),kitMode:'oficial',priceMode:'pista',tax:state.tax/100,reference:getReference?.()});
   min=calc.min;max=calc.max;cost=calc.kit.winCost;loss=calc.loss;source='Cadastro da atividade';
  }else if(preset){
   min=preset.min;max=preset.max;
   cost=preset.explosive?priceOf(preset.explosive,getCatalog(),'pista').unit:0;
   source='Referência para simular • não publicada no Suricato';
  }
  const proposedMin=min===null?null:Math.max(1,min+state.delta);
  const proposedMax=max===null?null:Math.max(proposedMin,max+state.delta);
  state.preview={name:action?.nome||'',min:proposedMin,max:proposedMax,adjusted:state.delta!==0};
  const profit=x=>x===null||cost===null?null:x*(1-state.tax/100)-cost;
  const choices=all.length?selector('Escolha a atividade','name',all.map(a=>[a.nome,a.nome])):
   (type==='atm'?selector('Tipo de ATM','preset',presetRows.filter(x=>x.type==='atm').map(p=>[p.id,p.name])):'');
  const kind=type==='atm'?'Roubo de ATM':type==='registradora'?'Caixinha / registradora':'Ações blipadas';
  return '<div class="ap-simple-intro"><h3>'+kind+'</h3><p>'+
   (type==='blipada'?'Veja investimento, lucro da vitória e prejuízo na derrota. A probabilidade de vitória de 40% fica na análise de risco, não multiplica o buff.':
    'Para buff ou nerf, altere o pagamento mínimo e máximo. O custo vem do kit cadastrado e dos preços de pista do Mercado Negro.')+'</p></div>'+
   '<div class="ap-simple-fields">'+choices+input('Lavagem (%)','tax',{min:0,max:99})+'</div>'+
   payoutAdjustment()+badge(state.delta)+
   '<p class="ap-row-muted">Fonte: '+esc(source||'Nenhuma ação cadastrada')+'. Nenhuma simulação aplica mudança na cidade.</p>'+
   (min!==null&&max!==null?kpis([
    ['Prêmio atual • sujo',money(min)+' a '+money(max)],
    ['Prêmio simulado • sujo',money(proposedMin)+' a '+money(proposedMax)],
    [type==='blipada'?'Reposição ao vencer':'Custo por tentativa',money(cost)],
    ['Lucro mínimo atual',money(profit(min))],
    ['Lucro mínimo com ajuste',money(profit(proposedMin))],
    ['Lucro máximo com ajuste',money(profit(proposedMax))]
   ]):'<p class="ap-hint">Cadastre os prêmios e os itens necessários para calcular o lucro.</p>')+
   (type==='blipada'?'<p class="ap-simple-change">Investimento para montar o kit: <b>'+money(calc?.kit?.total??null)+'</b>. Prejuízo na derrota: <b>'+money(loss)+'</b>. Na vitória, descontamos apenas o que precisa ser consumido/reposto.</p>':
    '<p class="ap-simple-change">Se o custo de um item consumido subir R$ 1.000, manter o lucro com lavagem de '+state.tax+'% exige aproximadamente '+money(Math.ceil(1000/(1-state.tax/100)))+' a mais no pagamento sujo.</p>')+
   (cost===null?'<p class="ap-hint">Preço de insumo ausente. A simulação de lucro fica pendente até o Mercado Negro ou cadastro ser completado.</p>':'')+
   (recommendation?.valid?'<p class="ap-simple-impact">High OS recomenda: <b>'+money(recommendation.recommendedMin)+' a '+money(recommendation.recommendedMax)+'</b> sujos • '+esc(recommendation.direction)+'. '+(recommendation.hasComparison?'Comparação com a referência de preços salva.':'Sem variação de custo comprovada; manter prêmios atuais.')+'</p>':'')+
   '<p class="ap-row-muted">Ao abrir o perfil, os valores simulados são levados para a proposta sem aprovação automática.</p>'+ 
   '<div class="ap-simple-actions">'+(action?button('action','Abrir perfil e decisões'):button('new','Cadastrar esta atividade'))+
   (type==='blipada'?button('ranking','Ver rankings e alertas'):'')+'</div>';
 }
 function render(){
  if(!['roubados','atm','registradora','acoes'].includes(state.area)){panel.hidden=true;return;}
  panel.hidden=false;
  panel.innerHTML=state.area==='roubados'?house():actions(state.area==='acoes'?'blipada':state.area);
 }
 panel.addEventListener('input',e=>{
  const key=e.target.dataset.ecoField;if(!key||e.target.type!=='number')return;
  if(e.target.type==='number'){
   if(e.target.value===''||!e.target.validity.valid)return;
   const val=Number(e.target.value);
   if(!Number.isFinite(val))return;
   state[key]=val;
  }else state[key]=e.target.value;
  // Atualiza o cálculo; não move o foco enquanto o usuário digita.
  const focusKey=key,from=e.target,position=from.type==='number'?null:from.selectionStart;
  render();
  const target=panel.querySelector('[data-eco-field="'+focusKey+'"]');
  if(target){target.focus({preventScroll:true});if(position!==null&&target.setSelectionRange)target.setSelectionRange(position,position);}
 });
 panel.addEventListener('change',e=>{const key=e.target.dataset.ecoField;if(!key)return;state[key]=e.target.type==='number'?Number(e.target.value):e.target.value;if(key==='name'||key==='item'||key==='preset')state.delta=0;render();});
 panel.addEventListener('click',e=>{
  const delta=e.target.closest('[data-eco-delta]');
  if(delta){state.delta=Number(delta.dataset.ecoDelta)||0;render();return;}
  const go=e.target.closest('[data-eco-open]');if(!go)return;
  const kind=go.dataset.ecoOpen;
  if(kind==='npc')onOpenNpc?.();
  if(kind==='house')onOpenHouse?.();
  if(kind==='action')onOpenAction?.(state.preview?.name,state.preview?.adjusted?state.preview:null);
  if(kind==='new')onNewAction?.();
  if(kind==='ranking')root.querySelector('[data-ap-nav="ranking"]')?.click();
 });
 return {selectArea(area){if(area!==state.area){state.area=area;state.name='';state.delta=0;state.preset=area==='registradora'?'registradora':'atm-c4';}render();},
  refresh:render};
}
