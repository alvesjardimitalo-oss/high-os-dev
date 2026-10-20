/* HIGH OS DEV — sincronização segura da aba BLIPS COORDENADAS.
 * A planilha existente usa 11 quadros de 7 colunas por seção.
 * Nunca reutilizar um N/A que ainda contenha dados técnicos.
 * Não reordenar, mover ou apagar os quadros antigos.
 */
const SHEET_ID="1zs-LNN1XS8t9cYwHe4_6TMxRDIy6yS-cLv66Rx_K9C4";
const TAB_GID=2037219913;
const GROUP_COLS=Array.from({length:11},(_,i)=>6+i*7);
const TEMPLATE_START=33; // linha 34: Munição (modelo visual)
const TEMPLATE_ROWS=20;

function plain(v){return String(v==null?"":v).trim();}
function fold(v){
 return plain(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"");
}
function sector(f){
 const s=fold(f.segmento);
 const g=fold(f.group);
 if(s.includes("ARMA")||g.startsWith("ARMAS"))return ["ARMAS","Armas"];
 if(s.includes("MUNIC")||g.startsWith("MUNICAO"))return ["MUNICAO","Munição"];
 if(s.includes("DROG")||g.startsWith("DROGAS")||g==="MANICOMIO")return ["DROGAS","Drogas"];
 if(s.includes("LAVAG")||g.startsWith("LAVAGEM"))return ["LAVAGEM","Lavagem"];
 if(s.includes("DESMANC")||g.startsWith("DESMANCHE"))return ["DESMANCHE","Desmanche"];
 if(s.includes("ESTELION")||g.startsWith("ESTELIONATARIOS"))return ["ESTELIONATARIOS","Estelionatários"];
 if(s.includes("GALPAO")||g.startsWith("GALPAO"))return ["GALPOES","Galpões"];
 if(s.includes("CONTRABANDO")||g.startsWith("CONTRABANDO"))return ["CONTRABANDO","Contrabando"];
 if(s.includes("APOIO")||s.includes("MECAN")||s.includes("HOSPITAL")||g.startsWith("ILEGALMECHANIC")||g.startsWith("ILEGALMEDIC"))return ["APOIO","Apoio"];
 return [s||"OUTROS",plain(f.segmento)||"Outros"];
}
function cell(rows,r,c){return plain(rows[r]?.[c]);}
function first(...vs){return vs.map(plain).find(Boolean)||"";}
function pair(x){
 if(!x)return "";
 if(typeof x==="string")return plain(x);
 return [plain(x.blip||x.cds),plain(x.spawn)].filter(Boolean).join(" / ");
}
function joinPairs(items){return (items||[]).map(pair).filter(Boolean).join(" / ");}
function valuesFor(f){
 const b=f.beneficios||{};
 const t=f.perfilTecnico||{};
 const op=t.operacional||{};
 const gs=Array.isArray(op.garagens)?op.garagens:[];
 const garage=type=>gs.filter(g=>fold(g.tipo)===type);
 const fromExtra=t.estruturaExtra||{};
 const hei=Array.isArray(op.helipontos)?op.helipontos:[];
 return {
  GROUP:plain(f.group),
  LOCAL:first(op.localizacao?.nome,f.qg),
  PRODUTO:first(f.produto),
  COORDENADA:first(op.localizacao?.cdsPrincipal,f.cds),
  INICIARROTA:first(t.rota?.inicio,b.iniciarRota,b.rotaInicio,t.farm?.cds,b.farm),
  CRAFT:first(t.craft?.cds,b.craft),
  BARBEARIA:first(op.barbearia?.cds,b.barbearia),
  BAU:first(op.bau?.cds,b.bau,b.bauCds,fromExtra.bau),
  LOJADEROUPAS:first(op.roupas?.cds,b.lojaRoupas),
  GARAGEMVIPFAC:first(joinPairs(garage("FACCAO")),pair({blip:b.garagemVipBlip,spawn:b.garagemVipSpawn})),
  GARAGEMPUBLICA:first(joinPairs(garage("PUBLICA").concat(garage("PUBLICA2"))),pair({blip:b.garagemPublicaBlip,spawn:b.garagemPublicaSpawn})),
  GARAGEMDELUXE:first(joinPairs(garage("SERVICO")),b.garagemDeluxeBlip,b.garagemDeluxe),
  SHOPDELUXE:first(op.lojaFac?.cds,b.shopDeluxe),
  SHOPEXCLUSIVO:first(op.lojaFac?.cds,b.shopExclusivo,b.shopDeluxe),
  ACADEMIA:first(b.academia),
  BAR:first(op.bar?.cds,fromExtra.bar),
  HELIPONTO:first(joinPairs(hei),pair({blip:b.helipontoBlip,spawn:b.helipontoSpawn})),
  BLINDADOS:first(pair(op.blindados),b.blindados)
 };
}
async function sheets(url,token,method="GET",body){
 const opt={method,headers:{"Authorization":"Bearer "+token}};
 if(body!==undefined){opt.headers["Content-Type"]="application/json";opt.body=JSON.stringify(body);}
 const response=await fetch(url,opt);
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data?.error?.message||("Google Sheets HTTP "+response.status));
 return data;
}
function put(reqs,sheetId,row,col,val){
 reqs.push({updateCells:{start:{sheetId,rowIndex:row,columnIndex:col},
  rows:[{values:[{userEnteredValue:{stringValue:String(val)}}]}],fields:"userEnteredValue"}});
}
function sectionsIn(rows){
 const sections=[];
 for(let i=0;i<rows.length;i++){
  const name=cell(rows,i,4),key=fold(name);
  if(!["ARMAS","MUNICAO","DROGAS","LAVAGEM","DESMANCHE","EXTRA1","APOIO","ESTELIONATARIOS","GALPOES","CONTRABANDO","OUTROS"].includes(key))continue;
  const header=Array.from({length:20},(_,d)=>i+d).find(r=>GROUP_COLS.some(c=>fold(cell(rows,r,c-1))==="GROUP"));
  if(header===undefined)continue;
  sections.push({sector:key,title:name,sectionRow:i,headerRow:header,
   entries:GROUP_COLS.map(c=>({col:c,name:cell(rows,header,c)})),reserved:new Set()});
 }
 return sections;
}
function safeBlank(rows,sec,entry){
 if(fold(entry.name)!=="NA"&&plain(entry.name)!=="")return false;
 for(let r=sec.headerRow+1;r<Math.min(sec.headerRow+14,rows.length);r++){
  // A seção tem seis colunas de dados entre este Group e o próximo título.
  for(let c=entry.col;c<entry.col+6;c++){
   if(cell(rows,r,c))return false;
  }
 }
 return true;
}
function templateLabel(rows,entryRow,valueCol){
 const offset=entryRow-(TEMPLATE_START+3);
 const map={GROUP:"GROUP",LOCAL:"LOCAL",PRODUTO:"PRODUTO",INICIARROTA:"INICIAR ROTA",
 CRAFT:"CRAFT",BARBEARIA:"BARBEARIA",BAU:"BAU",LOJADEROUPAS:"LOJA DE ROUPAS",
 GARAGEMVIPFAC:"GARAGEM VIP FAC",GARAGEMPUBLICA:"GARAGEM PUBLICA",
 GARAGEMDELUXE:"GARAGEM DELUXE",SHOPDELUXE:"SHOP DELUXE",ACADEMIA:"ACADEMIA"};
 return Object.keys(map).find(k=>k===fold(map[k])&&offset===0)||"";
}
export async function syncBlipsCoordinates({token,groups=[],onlyMissing=false}={}){
 if(!token)throw new Error("Conecte o Google Sheets para sincronizar Blips e Coordenadas.");
 const list=[...new Map(groups.filter(g=>g&&plain(g.group)).map(g=>[fold(g.group),g])).values()];
 if(!list.length)return {created:0,updated:0,skipped:0};
 const root="https://sheets.googleapis.com/v4/spreadsheets/"+SHEET_ID;
 const meta=await sheets(root+"?fields=sheets.properties(sheetId,title,gridProperties)",token);
 const tab=(meta.sheets||[]).find(s=>Number(s.properties?.sheetId)===TAB_GID)?.properties;
 if(!tab)throw new Error("A aba BLIPS COORDENADAS não foi encontrada.");
 const a1="'"+String(tab.title).replace(/'/g,"''")+"'";
 const range=a1+"!A1:CD"+Math.min(tab.gridProperties?.rowCount||1006,1500);
 const data=await sheets(root+"/values/"+encodeURIComponent(range)+"?valueRenderOption=FORMATTED_VALUE",token);
 const rows=data.values||[];
 const sections=sectionsIn(rows);
 const requests=[];
 let created=0,updated=0,skipped=0;
 let nextStart=Math.max(rows.length+3,146);
 const occupiedAdded=new Set();
 const sectionBlocks=new Map();
 const findSector=key=>sections.filter(s=>s.sector===key);
 const planNewSection=(key,title)=>{
  let s=sectionBlocks.get(key);
  if(s&&s.reserved.size<GROUP_COLS.length)return s;
  const start=nextStart;nextStart+=TEMPLATE_ROWS+2;
  if(nextStart>=Number(tab.gridProperties?.rowCount||1006)){
   requests.push({appendDimension:{sheetId:TAB_GID,dimension:"ROWS",length:Math.max(150,nextStart-Number(tab.gridProperties?.rowCount||1006)+10)}});
  }
  requests.push({copyPaste:{
   source:{sheetId:TAB_GID,startRowIndex:TEMPLATE_START,endRowIndex:TEMPLATE_START+TEMPLATE_ROWS,startColumnIndex:4,endColumnIndex:82},
   destination:{sheetId:TAB_GID,startRowIndex:start,endRowIndex:start+TEMPLATE_ROWS,startColumnIndex:4,endColumnIndex:82},
   pasteType:"PASTE_NORMAL",pasteOrientation:"NORMAL"}});
  // Copia a aparência e a validação nativa; remove TODOS os dados da faixa copiada.
  GROUP_COLS.forEach(c=>requests.push({repeatCell:{
   range:{sheetId:TAB_GID,startRowIndex:start+3,endRowIndex:start+19,startColumnIndex:c,endColumnIndex:c+6},
   cell:{},fields:"userEnteredValue"}}));
  put(requests,TAB_GID,start,4,title);
  put(requests,TAB_GID,start,8,"0");
  s={sector:key,title,sectionRow:start,headerRow:start+3,
   entries:GROUP_COLS.map(c=>({col:c,name:""})),reserved:new Set(),newBlock:true};
  sections.push(s);
  sectionBlocks.set(key,s);
  return s;
 };
 for(const f of list){
  const key=fold(f.group),[sectorKey,title]=sector(f);
  const correct=findSector(sectorKey);
  let selected=null,isNew=false;
  // Primeiro tenta a ficha já existente NA categoria correta.
  for(const s of correct){
   const entry=s.entries.find(e=>fold(e.name)===key);
   if(entry){selected={s,entry};break;}
  }
  if(selected&&onlyMissing){skipped++;continue;}
  if(!selected){
   for(const s of correct){
    const entry=s.entries.find(e=>!s.reserved.has(e.col)&&(s.newBlock||safeBlank(rows,s,e)));
    if(entry){selected={s,entry};isNew=true;s.reserved.add(entry.col);break;}
   }
  }
  if(!selected){
   const s=planNewSection(sectorKey,title);
   const entry=s.entries.find(e=>!s.reserved.has(e.col));
   if(!entry)throw new Error("Sem espaço para Group "+f.group);
   s.reserved.add(entry.col);
   selected={s,entry};isNew=true;
  }
  const {s,entry}=selected;
  const fields=valuesFor(f),col=entry.col,header=s.headerRow;
  // Campos por rótulo, não por posição fixa: há diferenças entre os segmentos.
  for(let r=header;r<header+15;r++){
   const label=s.newBlock
    ? ["GROUP","LOCAL","PRODUTO","INICIAR ROTA","CRAFT","BARBEARIA","BAU","LOJA DE ROUPAS","GARAGEM VIP FAC","GARAGEM PUBLICA","GARAGEM DELUXE","SHOP DELUXE","ACADEMIA"][r-header]
    :cell(rows,r,col-1);
   const value=fields[fold(label)];
   if(!value)continue;
   const found=s.newBlock?"":first(...Array.from({length:6},(_,i)=>cell(rows,r,col+i)));
   const current=cell(rows,r,col);
   if(!isNew&&value===found)continue;
   if(!isNew&&onlyMissing)continue;
   const existingAnchor=!s.newBlock&&found
    ? Array.from({length:6},(_,i)=>col+i).find(c=>cell(rows,r,c))??col :col;
   put(requests,TAB_GID,r,existingAnchor,value);
  }
  if(s.newBlock)put(requests,TAB_GID,s.sectionRow,8,String(s.reserved.size));
  if(isNew){created++;entry.name=f.group;occupiedAdded.add(key);}else updated++;
 }
 if(requests.length){
  // Limite defensivo: uma falha não deve apagar a planilha preexistente.
  await sheets(root+":batchUpdate",token,"POST",{requests});
 }
 return {created,updated,skipped,groups:list.length,sectionsAdded:[...sectionBlocks.keys()]};
}
