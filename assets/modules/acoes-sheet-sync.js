// Planeja uma atualização conservadora na ABA EXISTENTE de ações da planilha.
// Não realiza rede nem modifica dados. A folha original calcula os prêmios
// a partir de BUFF e NERF; nunca sobrescrevemos as fórmulas da premiação.
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase().replace(/\s+/g,' ');
const num=v=>{
 if(typeof v==='number')return Number.isFinite(v)?v:null;
 if(v==null)return null;
 const raw=String(v).trim().replace(/[R$\s]/g,'');
 if(!raw)return null;
 const normalized=raw.includes(',')?raw.replace(/\./g,'').replace(',','.'):raw;
 const value=Number(normalized);
 return Number.isFinite(value)?value:null;
};
const str=v=>String(v??'');
export function planApprovedActionSheetUpdate(rows,name,officialMin,proposedMin){
 const wanted=norm(name);
 if(!wanted||!Array.isArray(rows))throw Error('Dados ou nome de ação inválidos.');
 const candidates=[];
 for(let row=0;row<rows.length;row++){
  for(let col=0;col<(rows[row]||[]).length-1;col++){
   if(norm(rows[row]?.[col])==='ACOES'&&norm(rows[row]?.[col+1])===wanted){
    candidates.push({row,col});
   }
  }
 }
 if(candidates.length!==1)throw Error(candidates.length?'Esta ação aparece mais de uma vez na planilha. Revise os cadastros antes de atualizar.':'Ação não encontrada na aba VALORES AÇÃO BLIPADA.');
 const {row,col}=candidates[0];
 const match=label=>{
  const candidates=[];
  for(let k=row+1;k<Math.min(rows.length,row+17);k++)if(norm(rows[k]?.[col])===label)candidates.push(k);
  if(candidates.length!==1)throw Error('Campo '+label+' ausente ou duplicado para '+name+'.');
  return candidates[0];
 };
 const minRow=match('PREMIO MINIMO (SUJO)'),buffRow=match('BUFF'),nerfRow=match('NERF');
 const min=num(rows[minRow]?.[col+1]),buff=num(rows[buffRow]?.[col+1]),nerf=num(rows[nerfRow]?.[col+1]);
 if(min===null||buff===null||nerf===null)throw Error('Prêmio, BUFF ou NERF sem valor numérico válido.');
 if(!Number.isFinite(Number(officialMin))||Math.abs(min-Number(officialMin))>1.01)
  throw Error('O prêmio atual da planilha diverge do Mercado Negro. Sincronize os valores oficiais antes de aprovar qualquer ajuste.');
 const newMin=Number(proposedMin);
 if(!Number.isFinite(newMin)||newMin<0||newMin>1000000000)throw Error('Premiação proposta inválida ou fora do limite de segurança.');
 const delta=Math.round(newMin-min);
 if(delta===0)throw Error('O prêmio proposto não muda o valor atual.');
 const adjustment=Math.round(buff-nerf)+delta;
 const nextBuff=Math.max(0,adjustment),nextNerf=Math.max(0,-adjustment);
 return {
  name,sheetId:1276582880,
  sheetName:'VALORES AÇÃO BLIPADA',
  previousMin:min,proposedMin:newMin,delta,
  oldBuff:buff,oldNerf:nerf,nextBuff,nextNerf,
  buff:{rowIndex:buffRow,columnIndex:col+1},
  nerf:{rowIndex:nerfRow,columnIndex:col+1}
 };
}
