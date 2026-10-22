import {LOOT_TABLES} from './roubos-loot-data.js?v=1';
import {STOLEN_ITEMS_SNAPSHOT} from './economia-npc-seed.js?v=2';
import {makeLootPrices,lootPrice,weightedLoot,robberyProjection,actualHouseRun,houseRunMetrics,lootKey} from './roubos-loot-core.js?v=1';
import {priceOf} from './acoes-core.js?v=5';

export function createHouseWorkbench({root,getRegistry,getCatalog,canEdit,onSave}){
 const host=root.querySelector('#apHouseWorkbench');if(!host)return {refresh(){}};
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=v=>Number.isFinite(v)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(v):'Pendente';
 const pct=v=>new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:2}).format(v);
 const state={mode:'casas',stage:'projecao',safeDraws:'',wardrobeDraws:'',trunkDraws:'',trunkChance:'',unit:'',qty:1,tax:30,direct:0,minutes:'',label:'',outcome:'concluido',extra:0};
 const found=new Map(),overrides=new Map();let busy=false;
 const $=id=>host.querySelector('#'+id);
 const merchant=()=>{const saved=getRegistry()?.npcMarkets?.CASAS;return saved?.updatedAt||saved?.items?.length?saved.items:STOLEN_ITEMS_SNAPSHOT;};
 const sources=()=>state.mode==='casas'?[LOOT_TABLES.cofre,LOOT_TABLES.armario]:[state.mode==='npc'?LOOT_TABLES.npc:LOOT_TABLES.portamalas];
 const houseItems=()=>[...new Map([...LOOT_TABLES.cofre.items,...LOOT_TABLES.armario.items].filter(x=>x.codigo!=='dirtydollar').map(x=>[x.codigo,x])).values()];
 function prices(){const result=makeLootPrices(merchant());for(const [key,value] of overrides){const row=houseItems().find(x=>x.codigo===key);result.delete(lootKey(key));if(row)result.delete(lootKey(row.nome));if(value!==''&&Number.isFinite(Number(value))&&Number(value)>=0)result.set(lootKey(key),Number(value));}return result;}
 const costUnit=()=>state.unit===''?priceOf('LOCKPICK ++',getCatalog(),'pista').unit:Number(state.unit);
 const field=(label,id,value,extra='')=>'<label class="ap-field">'+label+'<input id="'+id+'" value="'+esc(value)+'" '+extra+'></label>';
 const kpis=rows=>'<div class="ap-management-kpis">'+rows.map(([label,value])=>'<div class="ap-kpi"><small>'+esc(label)+'</small><strong>'+esc(value)+'</strong></div>').join('')+'</div>';
 function render(){
  const p=prices(),items=houseItems();host.dataset.hlStage=state.stage;
  host.innerHTML='<nav class="ap-navigation" aria-label="Atividade de roubo">'+[['casas','Roubo de Casas'],['npc','Loot de NPC'],['portamalas','Porta-malas']].map(([key,label])=>'<button type="button" data-hl-mode="'+key+'" '+(state.mode===key?'aria-current="page"':'')+'>'+label+'</button>').join('')+'</nav>'+
   '<nav class="ap-navigation" aria-label="Seções do rendimento">'+[['projecao','Projeção'],...(state.mode==='casas'?[['registro','Registrar tentativa'],['historico','Resultados por casa']]:[]),['config','Configuração de loot']].map(([key,label])=>'<button type="button" data-hl-stage-nav="'+key+'" '+(state.stage===key?'aria-current="page"':'')+'>'+label+'</button>').join('')+'</nav>'+
   '<h3>'+({casas:'Quanto rende um roubo de casa?',npc:'Loot de NPC • assalto a mão armada',portamalas:'Loot de porta-malas'})[state.mode]+'</h3>'+
   '<p class="ap-sub">'+(state.mode==='casas'?'Entrada com gazua ++ → busca em cofres e armários → venda dos itens → lavagem → lucro por casa.':'Atividade cadastrada separadamente das casas; o loot de NPC não é a tabela do comerciante.')+'</p>'+
   '<div class="ap-filter-row ap-hl-parameters">'+(state.mode==='casas'?field('Sorteios de cofre por casa','hl-safeDraws',state.safeDraws,'type="number" min="0" max="1000" step="1" placeholder="A informar"')+field('Sorteios de armário por casa','hl-wardrobeDraws',state.wardrobeDraws,'type="number" min="0" max="1000" step="1" placeholder="A informar"')+field('Preço da gazua ++ • pista','hl-unit',state.unit,'type="number" min="0" step="0.01" placeholder="'+esc(money(costUnit()))+'"')+field('Gazuas ++ consumidas','hl-qty',state.qty,'type="number" min="0" max="100" step="1"'):
    (state.mode==='npc'?'<p class="ap-hint">A configuração informa 1 item sorteado por roubo. Pool de 1.528 pontos.</p>':field('Sorteios por roubo','hl-trunkDraws',state.trunkDraws,'type="number" min="0" max="1000" step="1" placeholder="A informar"')+field('Chance de render loot (%)','hl-trunkChance',state.trunkChance,'type="number" min="0" max="100" placeholder="Não visível na imagem"'))+field('Custo da tentativa','hl-extra',state.extra,'type="number" min="0" step="0.01"'))+
    field('Lavagem (%)','hl-tax',state.tax,'type="number" min="0" max="99" step="0.1"')+'</div>'+
   '<div id="hlProjection" data-hl-stage="projecao" aria-live="polite"></div>'+
   (state.mode==='casas'?'<div data-hl-stage="registro"><p class="ap-hint">As imagens não informam quantos sorteios uma casa executa. Informe os dois totais, inclusive zero onde não houver busca. A chance de render loot é 67,5% no cofre e 77,5% no armário.</p><h3>Registrar uma tentativa de roubo de casa</h3><p class="ap-sub">Preencha os itens efetivamente recuperados. O dinheiro direto é separado da venda ao comerciante. Preços informados aqui são usados nesta análise; o preço oficial do NPC permanece no cadastro da etapa final.</p><div class="ap-filter-row">'+field('Casa / identificação','hl-label',state.label,'maxlength="100" placeholder="Ex.: Casa 01"')+field('Dinheiro sujo encontrado diretamente','hl-direct',state.direct,'type="number" min="0" step="1"')+field('Tempo total (minutos)','hl-minutes',state.minutes,'type="number" min="0.1" max="1440" step="0.1" placeholder="Opcional"')+'<label class="ap-field">Resultado<select id="hl-outcome"><option value="concluido" '+(state.outcome==='concluido'?'selected':'')+'>Concluído</option><option value="fracasso" '+(state.outcome==='fracasso'?'selected':'')+'>Fracasso / perda</option></select></label></div><div class="ap-table-scroll"><table class="ap-management-table"><thead><tr><th>LOOT DA CASA</th><th>QUANTIDADE RECUPERADA</th><th>PREÇO DE VENDA UNITÁRIO • SUJO</th></tr></thead><tbody>'+items.map(x=>{const value=overrides.has(x.codigo)?overrides.get(x.codigo):lootPrice(x,p);return '<tr><td>'+esc(x.nome)+'<small class="ap-row-muted"> '+esc(x.codigo)+'</small></td><td><input class="ap-table-input" type="number" min="0" max="100000" step="1" data-hl-quantity="'+esc(x.codigo)+'" value="'+esc(found.get(x.codigo)||0)+'" aria-label="Quantidade de '+esc(x.nome)+'"></td><td><input class="ap-table-input" type="number" min="0" step="0.01" data-hl-price="'+esc(x.codigo)+'" value="'+esc(value??'')+'" placeholder="Preço não cadastrado" aria-label="Preço de '+esc(x.nome)+'"></td></tr>';}).join('')+'</tbody></table></div><div id="hlActual" aria-live="polite"></div><div class="ap-actions"><button type="button" class="ap-button primary" id="hlSave" '+(!canEdit()||busy?'disabled':'')+'>Registrar tentativa e resultado</button></div></div><div id="hlHistory" data-hl-stage="historico"></div><p id="hlMessage" class="ap-row-muted"></p>':'')+
   '<details class="ap-loot-catalog" data-hl-stage="config" open><summary>Configuração cadastrada de loot • '+sources().reduce((n,x)=>n+x.items.length,0)+' entradas</summary><div id="hlTables"></div></details>';
  summarize();
 }
 function actual(){
  for(const value of found.values())if(value===''||!Number.isInteger(Number(value))||Number(value)<0||Number(value)>100000)throw Error('Informe quantidades inteiras entre 0 e 100.000.');
  const p=prices();const items=houseItems().filter(x=>Number(found.get(x.codigo))>0).map(x=>({...x,quantidade:Number(found.get(x.codigo)),precoSujo:lootPrice(x,p)}));
  return actualHouseRun(items,{directDirty:state.direct,lockpickUnit:costUnit(),lockpickQuantity:state.qty,tax:Number(state.tax)/100,minutes:state.minutes,label:state.label,outcome:state.outcome});
 }
 function summarize(){
  const p=prices(),sourcesNow=sources();
  const parts=state.mode==='casas'?[{table:LOOT_TABLES.cofre,draws:state.safeDraws},{table:LOOT_TABLES.armario,draws:state.wardrobeDraws}]:[{table:sourcesNow[0],draws:state.mode==='npc'?1:state.trunkDraws,chance:state.mode==='npc'?1:state.trunkChance===''?null:Number(state.trunkChance)/100}];
  const unit=costUnit();const cost=state.mode==='casas'?(unit===null||state.qty===''||!Number.isInteger(Number(state.qty))||Number(state.qty)<0?null:unit*Number(state.qty)):Number(state.extra);
  try{
   const projection=robberyProjection(parts,p,{investment:cost,tax:Number(state.tax)/100});
   $('hlProjection').innerHTML=(projection.missingSetup?'<p class="ap-hint">Informe os sorteios por tentativa. As imagens não mostram o total de buscas de uma casa; no porta-malas também falta a chance de render loot.</p>':'')+kpis([['Receita ponderada • quantidades mínimas',projection.missingSetup?'Informe os sorteios':money(projection.low)],['Receita ponderada • quantidades máximas',projection.missingSetup?'Informe os sorteios':money(projection.high)],['Lucro ponderado por tentativa',money(projection.profit)]])+(!projection.complete?'<p class="ap-hint warn">Projeção parcial: há loot sem preço de venda. Esses itens não são tratados como receita zero e o lucro total fica pendente. Cadastre os valores na etapa final ou informe os preços na análise.</p>':'')+'<p class="ap-row-muted">Pesos normalizados pelo pool; chance de render aplicada uma vez. As faixas são médias ponderadas, não prêmios mínimo/máximo garantidos. O ponto médio usa a média das quantidades; a distribuição dentro da faixa não está informada.</p>';
  }catch(e){$('hlProjection').textContent=e.message;}
  $('hlTables').innerHTML=sourcesNow.map(table=>{const result=weightedLoot(table,p);return '<h4>'+esc(table.nome)+' • '+table.items.length+' entradas • pool '+result.pool+'</h4><p class="ap-row-muted">'+(table.chance===null?'Chance de render: não informada':('Chance de render: '+pct(table.chance)))+' • Preços conhecidos: '+pct(result.coverage)+' do peso do pool. Entradas repetidas preservadas.</p><div class="ap-table-scroll"><table class="ap-management-table"><thead><tr><th>ITEM / CÓDIGO</th><th>PESO</th><th>CHANCE NO SORTEIO</th><th>QUANTIDADE</th><th>VENDA UNITÁRIA (SUJO)</th></tr></thead><tbody>'+result.rows.map(x=>'<tr><td>'+esc(x.nome)+' <small>'+esc(x.codigo)+'</small></td><td>'+x.peso+'</td><td>'+pct(x.probability)+'</td><td>'+x.min+'–'+x.max+'</td><td>'+money(x.unit)+'</td></tr>').join('')+'</tbody></table></div>';}).join('');
  if(state.mode!=='casas')return;
  try{const result=actual();$('hlActual').innerHTML=kpis([['Dinheiro direto + venda dos itens',money(result.grossDirty)],['Receita após lavagem',money(result.netAfterWash)],['Custo das gazuas ++',money(result.investment)],['Lucro / prejuízo desta casa',money(result.profit)]]);}
  catch(e){$('hlActual').textContent=e.message;}
  const runs=getRegistry()?.houseRuns||[],stats=houseRunMetrics(runs);
  $('hlHistory').innerHTML='<h3>Rendimento observado por casa</h3>'+kpis([['Tentativas registradas',stats.count],['Lucro médio por tentativa',money(stats.average)],['Lucro por hora • tentativas cronometradas',money(stats.hourly)],['Dinheiro sujo das tentativas',money(stats.grossDirty)]])+'<p class="ap-row-muted">Histórico das últimas 50 tentativas. Inclui fracassos e custos. Preços e resultados são congelados por registro, sem recalcular vendas antigas por preços novos.</p><div class="ap-table-scroll"><table class="ap-management-table"><thead><tr><th>REGISTRO</th><th>RESULTADO</th><th>RECEITA SUJA</th><th>CUSTO</th><th>LUCRO</th></tr></thead><tbody>'+runs.slice().reverse().map(x=>'<tr><td>'+esc(x.label)+'<small> '+esc(new Date(x.at).toLocaleString('pt-BR'))+'</small></td><td>'+esc(x.outcome)+'</td><td>'+money(x.grossDirty)+'</td><td>'+money(x.investment)+'</td><td>'+money(x.profit)+'</td></tr>').join('')+'</tbody></table></div>';
 }
 host.addEventListener('input',e=>{
  const target=e.target;
  if(target.dataset.hlQuantity)found.set(target.dataset.hlQuantity,target.value);
  else if(target.dataset.hlPrice)overrides.set(target.dataset.hlPrice,target.value);
  else if(target.id?.startsWith('hl-'))state[target.id.slice(3)]=target.value;
  summarize();
 });
 host.addEventListener('change',e=>{if(e.target.id==='hl-outcome'){state.outcome=e.target.value;summarize();}});
 host.addEventListener('click',async e=>{
  const stage=e.target.closest('[data-hl-stage-nav]');if(stage){state.stage=stage.dataset.hlStageNav;host.dataset.hlStage=state.stage;host.querySelectorAll('[data-hl-stage-nav]').forEach(button=>{if(button===stage)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});return;}
  const mode=e.target.closest('[data-hl-mode]');if(mode){state.mode=mode.dataset.hlMode;state.stage='projecao';render();return;}
  if(!e.target.closest('#hlSave')||busy||!canEdit())return;
  busy=true;const button=$('hlSave');button.disabled=true;
  try{const entry=actual();await onSave(entry);found.clear();state.direct=0;state.label='';state.minutes='';state.stage='historico';render();if($('hlMessage'))$('hlMessage').textContent='Tentativa registrada com receita, custo, preços e lucro preservados.';}
  catch(err){if($('hlMessage'))$('hlMessage').textContent='Não foi possível registrar: '+err.message;}
  finally{busy=false;if($('hlSave'))$('hlSave').disabled=!canEdit();}
 });
 render();return {refresh:render};
}
