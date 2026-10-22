/**
 * HIGH OS • cadastro interno de ações.
 * Mantém a fonte pública do Mercado Negro intacta. Ações cadastradas e
 * ajustes internos são sobrepostos no planejador e identificados como tais.
 */
export const normalizeActionName=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toUpperCase();
const finite=value=>value!==''&&value!==null&&Number.isFinite(Number(value))?Number(value):null;
export function blankAction(){
 return {nome:'',tipo_acao:'blipada',status:'ativo',premio_min:0,premio_max:0,
  cooldown_segundos:0,regras_confronto:[{invasores:1,policiais:0,refens:0}],
  itens:[],locais:[]};
}
export function cleanActionEntry(input,{oldName='',published=[],managed=[]}={}){
 const nome=String(input?.nome??'').trim().replace(/\s+/g,' ');
 if(nome.length<3||nome.length>100)throw Error('Informe um nome entre 3 e 100 caracteres.');
 const key=normalizeActionName(nome),oldKey=normalizeActionName(oldName);
 const occupied=[...published,...managed].find(a=>normalizeActionName(a.nome)===key);
 if(occupied&&key!==oldKey)throw Error('Já existe outra ação com este nome.');
 const min=finite(input.premio_min),max=finite(input.premio_max);
 if(min===null||min<=0||max===null||max<min||max>1e12)
  throw Error('Informe prêmios mínimo e máximo válidos. O máximo não pode ser inferior ao mínimo.');
 const status=String(input.status)==='inativo'?'inativo':'ativo';
 const rules=(Array.isArray(input.regras_confronto)?input.regras_confronto:[]).map(row=>({
  invasores:finite(row.invasores),policiais:finite(row.policiais),refens:finite(row.refens)??0
 }));
 if(!rules.length||rules.length>20||rules.some(r=>!Number.isInteger(r.invasores)||r.invasores<1||r.invasores>100||
   !Number.isInteger(r.policiais)||r.policiais<0||r.policiais>100||
   !Number.isInteger(r.refens)||r.refens<0||r.refens>100))
  throw Error('Informe de 1 a 20 equipes com quantidades válidas de invasores e policiais.');
 if(new Set(rules.map(r=>r.invasores)).size!==rules.length)
  throw Error('As equipes não podem repetir a quantidade de invasores.');
 const itens=(Array.isArray(input.itens)?input.itens:[]).map(row=>({
  nome:String(row.nome??'').trim(),quantidade:finite(row.quantidade),
  categoria_item:['arma','municao','colete','acesso','consumivel'].includes(row.categoria_item)?row.categoria_item:null,
  preco_unitario:finite(row.preco_unitario)
 }));
 if(itens.length>60||itens.some(it=>!it.nome||it.nome.length>100||
  !Number.isInteger(it.quantidade)||it.quantidade<1||it.quantidade>10000||
  it.preco_unitario!==null&&(it.preco_unitario<0||it.preco_unitario>1e12)))
  throw Error('Cadastre até 60 itens com quantidades e preços válidos. O kit vazio é permitido para ações sem insumos.');
 const cooldown=finite(input.cooldown_segundos)??0;
 if(cooldown<0||cooldown>86400||!Number.isInteger(cooldown))
  throw Error('Tempo de espera inválido.');
 const tipo_acao=['blipada','atm','registradora','outros'].includes(input.tipo_acao)?input.tipo_acao:'blipada';
 return {...input,nome,tipo_acao,status,premio_min:min,premio_max:max,cooldown_segundos:cooldown,
  itens,regras_confronto:rules,
  locais:Array.isArray(input.locais)?input.locais.slice(0,50):[]};
}
export function cleanRegistry(raw){
 const data=raw&&typeof raw==='object'?raw:{};
 const entries=data.entries&&typeof data.entries==='object'&&!Array.isArray(data.entries)?data.entries:{};
 const hidden=data.hidden&&typeof data.hidden==='object'&&!Array.isArray(data.hidden)?data.hidden:{};
 return {revision:Math.max(0,Number(data.revision)||0),entries:{...entries},hidden:{...hidden}};
}
export function mergeActionRegistry(official,raw){
 const registry=cleanRegistry(raw),byKey=new Map();
 for(const a of Array.isArray(official)?official:[]){
  const key=normalizeActionName(a.nome);
  if(key&&!registry.hidden[key])byKey.set(key,{...a,origemCadastro:'OFICIAL'});
 }
 for(const [key,a] of Object.entries(registry.entries)){
  const target=normalizeActionName(a?.nome||key);
  if(!target||registry.hidden[target])continue;
  const officialEntry=(official||[]).some(x=>normalizeActionName(x.nome)===target);
  byKey.set(target,{...a,origemCadastro:officialEntry?'AJUSTE INTERNO':'PERSONALIZADA'});
 }
 return [...byKey.values()].sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
}
export function applyRegistryMutation(raw,{kind,entry,name,oldName},official=[]){
 const current=cleanRegistry(raw),entries={...current.entries},hidden={...current.hidden};
 const officialNames=new Set((official||[]).map(a=>normalizeActionName(a.nome)));
 const key=normalizeActionName(name||oldName||entry?.nome);
 if(kind==='save'){
  const prepared=cleanActionEntry(entry,{oldName,managed:Object.values(entries),published:official});
  const nextKey=normalizeActionName(prepared.nome);
  const previousKey=normalizeActionName(oldName);
  if(previousKey&&previousKey!==nextKey){
   if(officialNames.has(previousKey))throw Error('O nome de uma ação oficial não pode ser modificado; crie outra ação.');
   delete entries[previousKey];
  }
  entries[nextKey]=prepared;
  delete hidden[nextKey];
 }else if(kind==='archive'){
  if(!key||!officialNames.has(key))throw Error('Somente uma ação oficial pode ser arquivada.');
  hidden[key]=true;
 }else if(kind==='restore'){
  if(!hidden[key])throw Error('Esta ação não está arquivada.');
  delete hidden[key];
 }else if(kind==='delete'){
  if(!entries[key])throw Error('O cadastro interno não foi encontrado.');
  delete entries[key];delete hidden[key];
 }else throw Error('Operação de cadastro inválida.');
 return {...current,revision:current.revision+1,entries,hidden};
}
