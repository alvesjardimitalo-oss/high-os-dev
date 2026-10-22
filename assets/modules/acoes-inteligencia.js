/** High OS Dev • inteligência auditável das ações FiveM.
 * O catálogo só publica UM prêmio por ação: escala por equipe é HIPÓTESE,
 * jamais um dado oficial. O risco requer estimativa explícita do gestor.
 */
import {calculateAction,defaultTeam,availableTeams,norm,numeric} from './acoes-core.js?v=2';
const round=v=>Math.round(v*100)/100;
export const DEFAULT_MANAGER_WIN_CHANCE=.4;
export function recommendedMaximum(currentMin,currentMax,recommendedMin){
 const min=numeric(currentMin),max=numeric(currentMax),next=numeric(recommendedMin);
 return min===null||max===null||next===null||min<=0||max<min||next<0?null:
  Math.ceil(next*(max/min));
}
const clamp=(v,min,max,fallback)=>{const n=numeric(v);return Math.max(min,Math.min(max,n===null?fallback:n));};
export function makePriceReference(catalog,createdAt=new Date().toISOString()){
 return {version:1,createdAt,items:(catalog?.itens||[]).map(i=>({
  item:String(i.item||''),status:String(i.status||''),
  pista:numeric(i.pista),parceria:numeric(i.parceria)
 })).filter(i=>i.item).sort((a,b)=>norm(a.item).localeCompare(norm(b.item)))};
}
export function referenceCatalog(reference){
 return {itens:Array.isArray(reference?.items)?reference.items:[]};
}
export function assessPriceChanges(actions,catalog,reference,{tax=.3,ammoUse=.25,accessConsumed=true}={}){
 if(!Array.isArray(reference?.items)||!reference.items.length)return {available:false,changes:[],changed:0,up:0,down:0};
 const previous=referenceCatalog(reference),changes=[];
 for(const a of actions||[]){
  if(a.status==='inativo')continue;
  const settings={team:defaultTeam(a),kitMode:'oficial',priceMode:'pista',tax,ammoUse,accessConsumed};
  const past=calculateAction(a,previous,settings),current=calculateAction(a,catalog,settings);
  if(!past.teamValid||!current.teamValid||past.kit.total===null||current.kit.total===null)continue;
  const difference=round(current.kit.total-past.kit.total);
  if(Math.abs(difference)<.01)continue;
  const detail=current.kit.lines.map((item,index)=>{
   const former=past.kit.lines[index];
   return {name:item.name,old:former.unit,new:item.unit,
    delta:item.unit===null||former.unit===null?null:round(item.unit-former.unit)};
  }).filter(item=>item.delta!==null&&Math.abs(item.delta)>.01);
  changes.push({name:a.nome,oldCost:past.kit.total,newCost:current.kit.total,difference,
   percent:past.kit.total>0?difference/past.kit.total:null,
   oldProfitPerMember:past.perPlayer,newProfitPerMember:current.perPlayer,
   deltaPerMember:past.perPlayer===null||current.perPlayer===null?null:round(current.perPlayer-past.perPlayer),
   team:settings.team,items:detail});
 }
 changes.sort((a,b)=>Math.abs(b.difference)-Math.abs(a.difference)||a.name.localeCompare(b.name));
 return {available:true,referenceDate:reference.createdAt,changes,changed:changes.length,
  up:changes.filter(x=>x.difference>0).length,down:changes.filter(x=>x.difference<0).length};
}
export function analyzeDecision(action,catalog,{
 team=defaultTeam(action),teamPayout='publicado',referenceTeam=defaultTeam(action),
 winChance=.4,policeWaitMinutes=null,estimatedActionMinutes=null,
 targetPerPlayer=20000,targetHourly=0,roi=.25,tolerance=.25,tax=.3,...kitOptions
}={}){
 const rawMin=numeric(action?.premio_min),rawMax=numeric(action?.premio_max);
 const allowed=availableTeams(action);
 const teamN=Math.floor(Number(team))||defaultTeam(action);
 const ref=Number(referenceTeam)||defaultTeam(action);
 const modeled=teamPayout==='proporcional'&&ref>0&&allowed.includes(teamN);
 const multiplier=modeled?teamN/ref:1;
 const working={...action,
  premio_min:rawMin===null?null:round(rawMin*multiplier),
  premio_max:rawMax===null?null:round(rawMax*multiplier)};
 const p=calculateAction(working,catalog,{...kitOptions,team:teamN,kitMode:kitOptions.kitMode||'oficial',
  priceMode:kitOptions.priceMode||'pista',targetPerPlayer,roi,tolerance,tax});
 const win=winChance==null||winChance===''?null:clamp(winChance,0,1,0);
 const wait=policeWaitMinutes==null||policeWaitMinutes===''?null:clamp(policeWaitMinutes,0,600,0);
 const duration=estimatedActionMinutes==null||estimatedActionMinutes===''?null:clamp(estimatedActionMinutes,0,600,0);
 const totalMinutes=wait===null||duration===null?null:wait+duration;
 const hourly=totalMinutes>0&&p.netMin!==null?round(p.netMin*60/totalMinutes/teamN):null;
 const expected=win===null||p.netMin===null||p.loss===null?null:round(win*p.netMin+(1-win)*p.loss);
 const breakEven=p.netMin===null||p.loss===null||p.netMin<=0?null:(-p.loss)/(p.netMin-p.loss);
 // A margem de retorno depende da probabilidade estimada, quando fornecida.
 // A chance NÃO é inventada a partir da quantidade de policiais.
 const roiTarget=Math.max(0,Number(roi)||0);
 const hourlyGoal=totalMinutes===null?0:Math.max(0,Number(targetHourly)||0)*teamN*totalMinutes/60;
 const target=Math.max(Math.max(0,Number(targetPerPlayer)||0)*teamN,
  (p.kit.total??0)*roiTarget,hourlyGoal);
 const riskTarget=win===null||win===0||p.kit.total===null?null:
  Math.ceil((p.kit.winCost+(target+(1-win)*p.kit.total)/win)/(1-p.tax));
 const suggested=win!==null?riskTarget:
  p.kit.winCost===null?null:Math.ceil((p.kit.winCost+target)/(1-p.tax));
 const valid=p.teamValid&&action?.status!=='inativo'&&!p.kit.missing.length&&
  p.kit.total!==null&&p.min!==null&&p.max!==null;
 const delta=suggested===null||p.min===null?null:suggested-p.min;
 const direction=!valid?'PENDENTE':delta===null?'PENDENTE':
  delta>Math.max(500,Math.abs(p.min)*.02)?'CONSIDERAR BUFF':
  delta< -Math.max(500,Math.abs(p.min)*.02)?'REVISAR NERF':'MANTER';
 // Exibe uma faixa recomendada legível, preservando o intervalo percentual
 // original como referência. O máximo continua indicativo: a planilha
 // calcula seus próprios prêmios e somente ela confirma o valor final.
 const recommendedMin=!valid?null:direction==='MANTER'?p.min:suggested;
 const recommendedMax=recommendedMaximum(p.min,p.max,recommendedMin);
 const recommendedDelta=recommendedMin===null?null:round(recommendedMin-p.min);
 const recommendedPercent=recommendedDelta===null||p.min<=0?null:recommendedDelta/p.min;
 const recommendedProfit=recommendedMin===null||p.kit.winCost===null?null:
   round(recommendedMin*(1-p.tax)-p.kit.winCost);
 const recommendedPerMember=recommendedProfit===null?null:round(recommendedProfit/teamN);
 const remarks=[];
 if(win===.4)remarks.push('Taxa de vitória de 40%: premissa de gestão em razão da desvantagem numérica diante da polícia; não é medição estatística.');
 if(modeled)remarks.push('Premiação por equipe calculada proporcionalmente; o catálogo NÃO confirma este valor.');
 if(!modeled&&allowed.length>1)remarks.push('O catálogo publica um prêmio único. Faixas diferentes de prêmio por equipe não foram informadas.');
 if(wait===null)remarks.push('A espera real pela polícia não foi informada.');
 if(duration===null)remarks.push('Informe a duração esperada; o tempo limite cadastrado não mede a duração real.');
 if(win===null)remarks.push('A chance de vitória não foi informada; a proposta NÃO considera o risco estatístico de derrota.');
 if(win!==null&&win!==.4)remarks.push('Chance de vitória configurada pela gestão: cenário hipotético, não estatística oficial.');
 if(!valid)remarks.push('Dados oficiais insuficientes; proposta de ajuste bloqueada.');
 if(direction==='CONSIDERAR BUFF')remarks.push('A meta configurada está acima do lucro projetado. Revisar aumento.');
 if(direction==='REVISAR NERF')remarks.push('A meta está abaixo do retorno projetado; risco e dificuldade exigem avaliação antes de reduzir.');
 return {calc:p,team:teamN,modeled,multiplier,officialMin:rawMin,officialMax:rawMax,
  winChance:win,wait,duration,totalMinutes,hourly,expected,breakEven,target,
  suggested,delta,direction,remarks,valid,recommendedMin,recommendedMax,recommendedDelta,recommendedPercent,
  recommendedProfit,recommendedPerMember,
  // Não aprovar prêmio proporcional hipotético ou critérios com insumos alterados.
  eligibleForSheet:valid&&!modeled&&!kitOptions.priceShift&&!Object.keys(kitOptions.quantities||{}).length&&
    !Object.keys(kitOptions.prices||{}).length};
}
export function applySheetPrizeOverrides(actions,prices){
 const map=new Map((prices||[]).map(p=>[norm(p.name),p]));
 return (actions||[]).map(a=>{
  const p=map.get(norm(a.nome));
  if(!p||!Number.isFinite(p.min)||!Number.isFinite(p.max))return a;
  return {...a,premio_min:p.min,premio_max:p.max,
   buff:Number.isFinite(p.buff)?p.buff:a.buff,
   nerf:Number.isFinite(p.nerf)?p.nerf:a.nerf,
   premioFonte:'Google Sheets'};
 });
}
