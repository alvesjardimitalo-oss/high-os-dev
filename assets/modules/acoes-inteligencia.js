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
 // A probabilidade serve para comparar ganho na vitória com perda integral na derrota.
 // Não impor que CADA vitória pague todas as derrotas E uma meta adicional de lucro:
 // isso inflava artificialmente os prêmios quando a chance gerencial era de 40%.
 const roiTarget=Math.max(0,Number(roi)||0);
 const hourlyGoal=totalMinutes===null?0:Math.max(0,Number(targetHourly)||0)*teamN*totalMinutes/60;
 const target=Math.max(Math.max(0,Number(targetPerPlayer)||0)*teamN,
  (p.kit.total??0)*roiTarget,hourlyGoal);
 const payoutForWinTarget=p.kit.winCost===null?null:
  Math.ceil((p.kit.winCost+target)/(1-p.tax));
 // Ponto de equilíbrio matemático é informação GERENCIAL, não aumento automático.
 const riskBreakEvenMin=win===null||win<=0||p.kit.total===null||p.kit.winCost===null?null:
  Math.ceil((p.kit.winCost+(1-win)*p.kit.total/win)/(1-p.tax));
 const valid=p.teamValid&&action?.status!=='inativo'&&!p.kit.missing.length&&
  p.kit.total!==null&&p.min!==null&&p.min>0&&p.max!==null&&p.max>=p.min;
 // Revisão gradual: no máximo 10% do prêmio atual OU 25% do capital do kit.
 // É um teto para a sugestão (não um aumento mínimo). Não altera o prêmio oficial.
 const maxBuffStep=valid?Math.max(1,Math.floor(Math.min(p.min*.10,p.kit.total*.25))):null;
 const maxNerfStep=valid?Math.max(1,Math.floor(Math.min(p.min*.05,p.kit.total*.12))):null;
 const threshold=valid?Math.max(500,p.min*.02):null;
 const winTargetGap=payoutForWinTarget===null||p.min===null?null:payoutForWinTarget-p.min;
 const riskGap=riskBreakEvenMin===null||p.min===null?null:riskBreakEvenMin-p.min;
 // Corrige insuficiência real de lucro na vitória e examina risco negativo.
 // Nunca adicionar a meta de lucro ao ponto de equilíbrio de risco.
 const needed=valid?Math.max(p.min,payoutForWinTarget??p.min,riskBreakEvenMin??p.min):null;
 let suggested=valid?Math.ceil(Math.min(needed,p.min+maxBuffStep)):null;
 let direction=!valid?'PENDENTE':'MANTER';
 if(valid&&suggested-p.min>threshold)direction='CONSIDERAR BUFF';
 else if(valid){suggested=p.min;}
 // Nerf excepcional: apenas com grande folga de lucro E de risco.
 // Não punir ação difícil simplesmente porque o lucro na vitória é positivo.
 const surplus=valid&&win!==null&&expected!==null&&
  expected>p.kit.total*.5&&p.netMin>Math.max(target*2,p.kit.total*1.5);
 if(direction==='MANTER'&&surplus){
  const safeFloor=Math.max(payoutForWinTarget??0,riskBreakEvenMin??0);
  const candidate=Math.floor(Math.max(safeFloor,p.min-maxNerfStep));
  if(p.min-candidate>threshold){suggested=candidate;direction='REVISAR NERF';}
 }
 const delta=suggested===null||p.min===null?null:suggested-p.min;
 const recommendedMin=suggested;
 const recommendedMax=recommendedMaximum(p.min,p.max,recommendedMin);
 const recommendedDelta=recommendedMin===null?null:round(recommendedMin-p.min);
 const recommendedPercent=recommendedDelta===null||p.min<=0?null:recommendedDelta/p.min;
 const recommendedProfit=recommendedMin===null||p.kit.winCost===null?null:
   round(recommendedMin*(1-p.tax)-p.kit.winCost);
 const recommendedPerMember=recommendedProfit===null?null:round(recommendedProfit/teamN);
 const recommendedExpected=win===null||recommendedProfit===null||p.loss===null?null:
   round(win*recommendedProfit+(1-win)*p.loss);
 const riskNeedsReview=expected!==null&&expected<0;
 const remarks=[];
 if(win===.4)remarks.push('Taxa de vitória de 40%: premissa de gestão em razão da desvantagem numérica diante da polícia; não é medição estatística.');
 if(modeled)remarks.push('Premiação por equipe calculada proporcionalmente; o catálogo NÃO confirma este valor.');
 if(!modeled&&allowed.length>1)remarks.push('O catálogo publica um prêmio único. Faixas diferentes de prêmio por equipe não foram informadas.');
 if(wait===null)remarks.push('A espera real pela polícia não foi informada.');
 if(duration===null)remarks.push('Informe a duração esperada; o tempo limite cadastrado não mede a duração real.');
 if(win===null)remarks.push('A chance de vitória não foi informada; a proposta NÃO considera o risco estatístico de derrota.');
 if(win!==null&&win!==.4)remarks.push('Chance de vitória configurada pela gestão: cenário hipotético, não estatística oficial.');
 if(!valid)remarks.push('Dados oficiais insuficientes; proposta de ajuste bloqueada.');
 if(direction==='CONSIDERAR BUFF')remarks.push('A sugestão é moderada e limitada por revisão, considerando lucro na vitória e capital integral perdido na derrota.');
 if(direction==='REVISAR NERF')remarks.push('Margens muito acima da meta e risco favorável permitem estudar redução moderada; não é ajuste automático.');
 if(riskNeedsReview)remarks.push('Resultado esperado negativo no cenário de chance informada; a sugestão gradual pode NÃO atingir o equilíbrio. Não compensar todas as derrotas com um buff gigante.');
 if(win!==null&&riskBreakEvenMin!==null)remarks.push('Prêmio teórico de equilíbrio de risco: '+Math.ceil(riskBreakEvenMin).toLocaleString('pt-BR')+' sujo; apenas referência, não recomendação.');
 if(valid)remarks.push('Limites por revisão: buff até 10% do prêmio e 25% do capital; nerf até 5% do prêmio e 12% do capital.');
 return {calc:p,team:teamN,modeled,multiplier,officialMin:rawMin,officialMax:rawMax,
  winChance:win,wait,duration,totalMinutes,hourly,expected,breakEven,target,
  suggested,delta,direction,remarks,valid,recommendedMin,recommendedMax,recommendedDelta,recommendedPercent,
  recommendedProfit,recommendedPerMember,recommendedExpected,riskBreakEvenMin,payoutForWinTarget,
  winTargetGap,riskGap,maxBuffStep,maxNerfStep,riskNeedsReview,
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
