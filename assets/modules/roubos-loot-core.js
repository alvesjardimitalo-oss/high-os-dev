/** Cálculo de loot do High RP. Não usa preço de compra nem preço de item quebrado como receita de item íntegro. */
const number=v=>v===''||v===null||v===undefined?null:Number.isFinite(Number(v))?Number(v):null;
export const lootKey=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase();
export function makeLootPrices(merchant=[]){
 const prices=new Map();
 for(const row of merchant){const value=number(row.precoSujo);if(value===null||value<0)continue;
  if(row.codigo)prices.set(lootKey(row.codigo),value);if(row.nome)prices.set(lootKey(row.nome),value);
 }
 return prices;
}
export function lootPrice(row,prices){
 if(row.codigo==='dirtydollar')return 1;
 return prices.get(lootKey(row.codigo))??prices.get(lootKey(row.nome))??null;
}
export function weightedLoot(table,prices,{chance=table.chance}={}){
 const pool=table.items.reduce((sum,x)=>sum+x.peso,0);
 if(!(pool>0))throw Error('Pool de loot inválido.');
 const gate=number(chance);if(gate!==null&&(gate<0||gate>1))throw Error('Chance inválida.');
 let low=0,high=0,unpricedWeight=0;
 const rows=table.items.map((row,index)=>{
  const probability=row.peso/pool,unit=lootPrice(row,prices);
  if(unit===null)unpricedWeight+=row.peso;else{low+=probability*row.min*unit;high+=probability*row.max*unit;}
  return {...row,index,probability,unit,expectedProbability:gate===null?null:probability*gate};
 });
 return {pool,rows,coverage:1-unpricedWeight/pool,complete:unpricedWeight===0||gate===0,conditionalLow:low,conditionalHigh:high,
  chance:gate,low:gate===null?null:low*gate,high:gate===null?null:high*gate,
  midpoint:gate===null?null:(low+high)*gate/2};
}
export function robberyProjection(parts,prices,{investment=null,tax=.3}={}){
 let low=0,high=0,complete=true,missingSetup=false;
 for(const part of parts){const draws=number(part.draws);
  if(draws===null||!Number.isInteger(draws)||draws<0||draws>1000){missingSetup=true;continue;}
  if(draws===0)continue;
  const result=weightedLoot(part.table,prices,{chance:part.chance??part.table.chance});
  if(result.chance===null){missingSetup=true;continue;}
  low+=draws*result.low;high+=draws*result.high;complete&&=result.complete;
 }
 const cost=number(investment),wash=number(tax);
 if(wash===null||wash<0||wash>=1)throw Error('Taxa de lavagem inválida.');
 const valid=!missingSetup&&complete&&cost!==null&&cost>=0;
 return {low,high,midpoint:(low+high)/2,complete,missingSetup,
  profit:valid?(low+high)/2*(1-wash)-cost:null,
  netLow:valid?low*(1-wash)-cost:null,netHigh:valid?high*(1-wash)-cost:null};
}
export function actualHouseRun(items,{directDirty=0,lockpickUnit=null,lockpickQuantity=1,tax=.3,minutes=null,label='Casa',outcome='concluido'}={}){
 const direct=number(directDirty),unit=number(lockpickUnit),qty=number(lockpickQuantity),wash=number(tax),duration=number(minutes);
 if(direct===null||direct<0||direct>1e10||unit===null||unit<0||unit>1e10||!Number.isInteger(qty)||qty<0||qty>100||wash===null||wash<0||wash>=1||duration!==null&&(duration<=0||duration>1440))throw Error('Confira dinheiro, gazuas, lavagem e duração.');
 if(!Array.isArray(items)||items.length>40)throw Error('Até 40 itens por roubo.');
 const products=items.map(x=>({nome:String(x.nome||'').trim().slice(0,100),codigo:String(x.codigo||'').slice(0,100),quantidade:number(x.quantidade),precoSujo:number(x.precoSujo)}));
 if(products.some(x=>!x.nome||!Number.isInteger(x.quantidade)||x.quantidade<1||x.quantidade>100000||x.precoSujo===null||x.precoSujo<0||x.precoSujo>1e10))throw Error('Todo item encontrado precisa de quantidade e preço de venda definidos.');
 const itemDirty=products.reduce((s,x)=>s+x.quantidade*x.precoSujo,0),grossDirty=direct+itemDirty,investment=unit*qty;
 return {label:String(label||'Casa').trim().slice(0,100),outcome:outcome==='fracasso'?'fracasso':'concluido',items:products,directDirty:direct,lockpickUnit:unit,lockpickQuantity:qty,tax:wash,minutes:duration,
  itemDirty,grossDirty,investment,netAfterWash:grossDirty*(1-wash),profit:grossDirty*(1-wash)-investment};
}
export function houseRunMetrics(runs=[]){
 const count=runs.length,totalProfit=runs.reduce((s,x)=>s+x.profit,0);
 const timed=runs.filter(x=>Number.isFinite(x.minutes)&&x.minutes>0),minutes=timed.reduce((s,x)=>s+x.minutes,0);
 return {count,totalProfit,average:count?totalProfit/count:null,
  hourly:minutes?timed.reduce((s,x)=>s+x.profit,0)*60/minutes:null,
  grossDirty:runs.reduce((s,x)=>s+x.grossDirty,0)};
}
