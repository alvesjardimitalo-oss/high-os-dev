/* HIGH OS DEV — sincronização segura da aba BLIPS COORDENADAS.
 * A planilha existente usa 11 quadros de 7 colunas por seção.
 * Nunca reutilizar um N/A que ainda contenha dados técnicos.
 * Não reordenar, mover ou apagar os quadros antigos.
 */
const SHEET_ID="1zs-LNN1XS8t9cYwHe4_6TMxRDIy6yS-cLv66Rx_K9C4";
// A aba foi recriada na Season 3 e o gid mudou (era 2037219913). Procuramos
// pelo gid atual, depois pelo antigo e, por fim, pelo NOME da aba.
const TAB_GIDS=[1571924835,2037219913];
const TAB_TITLE="BLIPS COORDENADAS";
const GROUP_COLS=Array.from({length:11},(_,i)=>6+i*7);
// Campos podem chegar a 45+ linhas após ampliação do quadro.
const MAX_FIELDS_SCAN=90;

function plain(v){if(v==null||typeof v==="boolean"||typeof v==="object")return "";return String(v).trim();}
function fold(v){
 return plain(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"");
}
function sector(f){
 const s=fold(f.segmento);
 const g=fold(f.group);
 // O identificador canônico do Group prevalece sobre o segmento editável.
 // Um cadastro com segmento desatualizado não deve colocar a ficha na aba errada.
 if(g==="MANICOMIO")return ["DROGAS","Drogas"];
 // Segmentos criados pela gestão prevalecem sobre o agrupamento legado APOIO.
 if(s==="MECANICAILEGAL"||s==="MECANICAILLEGAL")return ["MECANICAILEGAL","Mecânica Ilegal"];
 if(s==="HOSPITALILEGAL")return ["HOSPITALILEGAL","Hospital Ilegal"];
 if(g.startsWith("ILEGALMECHANIC"))return ["MECANICAILEGAL","Mecânica Ilegal"];
 if(g.startsWith("ILEGALMEDIC"))return ["HOSPITALILEGAL","Hospital Ilegal"];
 const byGroup=[
  ["ARMAS","ARMAS","Armas"],["MUNICAO","MUNICAO","Munição"],
  ["DROGAS","DROGAS","Drogas"],["LAVAGEM","LAVAGEM","Lavagem"],
  ["DESMANCHE","DESMANCHE","Desmanche"],
  ["ESTELIONATARIOS","ESTELIONATARIOS","Estelionatários"],
  ["GALPAO","GALPOES","Galpões"],["CONTRABANDO","CONTRABANDO","Contrabando"]
 ];
 for(const [prefix,key,title] of byGroup){
  if(g.startsWith(prefix))return [key,title];
 }
 if(s.includes("ARMA"))return ["ARMAS","Armas"];
 if(s.includes("MUNIC"))return ["MUNICAO","Munição"];
 if(s.includes("DROG"))return ["DROGAS","Drogas"];
 if(s.includes("LAVAG"))return ["LAVAGEM","Lavagem"];
 if(s.includes("DESMANC"))return ["DESMANCHE","Desmanche"];
 if(s.includes("ESTELION"))return ["ESTELIONATARIOS","Estelionatários"];
 if(s.includes("GALPAO"))return ["GALPOES","Galpões"];
 if(s.includes("CONTRABANDO"))return ["CONTRABANDO","Contrabando"];
 if(s.includes("MECAN"))return ["MECANICAILEGAL","Mecânica Ilegal"];
 if(s.includes("HOSPITAL"))return ["HOSPITALILEGAL","Hospital Ilegal"];
 if(s.includes("APOIO"))return ["APOIO","Apoio"];
 return [s||"OUTROS",plain(f.segmento)||"Outros"];
}
function cell(rows,r,c){return plain(rows[r]?.[c]);}
function first(...vs){return vs.map(plain).find(Boolean)||"";}
function pair(x){
 if(!x)return "";
 if(typeof x==="string")return plain(x);
 return [plain(x.blip||x.cds)?"BLIP: "+plain(x.blip||x.cds):"",plain(x.spawn)?"SPAWN: "+plain(x.spawn):""].filter(Boolean).join("\n");
}
function joinPairs(items){return (items||[]).map(pair).filter(Boolean).join("\n\n");}
export function valuesFor(f){
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
  CRAFT:first(t.craft?.cds,b.craft),
  BARBEARIA:first(op.barbearia?.cds,b.barbearia),
  BAU:first(op.bau?.cds,b.bau,b.bauCds,fromExtra.bau,f.perfilFonte?.BAU),
  LOJADEROUPAS:first(op.roupas?.cds,b.lojaRoupas,f.perfilFonte?.["LOJA DE ROUPAS"]),
  GARAGEMVIPFAC:first(joinPairs(garage("FACCAO")),pair({blip:b.garagemVipBlip,spawn:b.garagemVipSpawn})),
  GARAGEMPUBLICA:first(joinPairs(garage("PUBLICA").concat(garage("PUBLICA2"))),pair({blip:b.garagemPublicaBlip,spawn:b.garagemPublicaSpawn})),
  GARAGEMDELUXE:first(joinPairs(garage("SERVICO").concat(garage("DELUXE"))),pair({blip:b.garagemDeluxeBlip,spawn:b.garagemDeluxeSpawn}),b.garagemDeluxe,f.perfilFonte?.["GARAGEM DELUXE"]),
  SHOPDELUXE:first(op.lojaFac?.cds,b.shopDeluxe,f.perfilFonte?.["SHOP DELUXE"]),
  SHOPEXCLUSIVO:first(op.lojaFac?.cds,b.shopExclusivo,b.shopDeluxe),
  ACADEMIA:first(b.academia),
  BAR:first(op.bar?.cds,fromExtra.bar),
  HELIPONTO:first(joinPairs(hei),pair({blip:b.helipontoBlip,spawn:b.helipontoSpawn})),
  BLINDADOS:first(joinPairs(Array.isArray(op.blindados)?op.blindados:[op.blindados]),b.blindados),
  FARM:first(t.farm?.cds,b.farm,b.iniciarFarm),
  INICIARFARM:first(t.farm?.cds,b.farm,b.iniciarFarm),
  GARAGEMPUBLICA2:first(joinPairs(garage("PUBLICA2")),pair({blip:b.garagemPublica2Blip,spawn:b.garagemPublica2Spawn})),
  TATUAGEM:first(op.tatuagem?.cds,b.tatuagem),
  ATM:first(b.atm),
  ARENA:first(b.arena),
  TELAO:first(op.telao?.cds,b.telaoCds),
  TELAOMODELO:first(op.telao?.modelo,b.telaoNome),
  TELAOPOSTIT:first(op.telao?.postit,b.telaoPostit),
  TELAOCAIXA1:first(op.telao?.sons?.[0],b.telaoCaixa1),
  TELAOCAIXA2:first(op.telao?.sons?.[1],b.telaoCaixa2),
  TELAOCAIXA3:first(op.telao?.sons?.[2],b.telaoCaixa3),
  TELAOCAIXA4:first(op.telao?.sons?.[3],b.telaoCaixa4),
  /* Benefícios e rota exclusiva NÃO pertencem à aba de coordenadas. */
 };
}
/* SOMENTE LEITURA (18/11/2026): o High OS nunca grava nesta planilha.
   Ele le, compara com o Firebase e avisa o que a equipe deve atualizar a mao. */
async function sheets(url,token){
 const response=await fetch(url,{method:"GET",headers:{"Authorization":"Bearer "+token}});
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data?.error?.message||("Google Sheets HTTP "+response.status));
 return data;
}
function colLetter(index){
 let n=index+1,s="";
 while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26);}
 return s;
}
/* Comparacao tolerante: espacos e espacos apos virgula nao contam como diferenca. */
export function sameSheetValue(a,b){
 const n=v=>plain(v).replace(/\s*,\s*/g,",").replace(/\s+/g," ").toUpperCase();
 return n(a)===n(b);
}
function sectionsIn(rows){
 const sections=[];
 for(let i=0;i<rows.length;i++){
  const name=cell(rows,i,4),key=fold(name);
  if(!["ARMAS","MUNICAO","DROGAS","LAVAGEM","DESMANCHE","EXTRA1","APOIO","ESTELIONATARIOS","GALPOES","CONTRABANDO","OUTROS","MECANICAILEGAL","HOSPITALILEGAL"].includes(key))continue;
  const header=Array.from({length:Math.min(20,rows.length-i)},(_,d)=>i+d).find(r=>GROUP_COLS.some(c=>fold(cell(rows,r,c-1))==="GROUP"));
  if(header===undefined)continue;
  const footer=Array.from({length:Math.min(MAX_FIELDS_SCAN,rows.length-header)},(_,d)=>header+d)
   .find(r=>GROUP_COLS.some(c=>fold(cell(rows,r,c-1))==="TRUE"));
  if(footer===undefined)continue;
  sections.push({sector:key,title:name,sectionRow:i,headerRow:header,footerRow:footer,
   entries:GROUP_COLS.filter(c=>fold(cell(rows,header,c-1))==="GROUP").map(c=>({col:c,name:cell(rows,header,c)})),reserved:new Set()});
 }
 return sections;
}
function safeBlank(rows,sec,entry){
 if(fold(entry.name)!=="NA"&&plain(entry.name)!=="")return false;
 for(let r=sec.headerRow+1;r<Math.min(sec.footerRow,rows.length);r++){
  // A seção tem seis colunas de dados entre este Group e o próximo título.
  for(let c=entry.col;c<entry.col+6;c++){
   if(cell(rows,r,c))return false;
  }
 }
 return true;
}
/* Compara o cadastro do High OS (Firebase) com a aba BLIPS COORDENADAS.
   Nada e gravado: devolve a lista do que esta diferente, celula por celula,
   para a equipe atualizar a planilha manualmente. So entram campos em que o
   High OS TEM valor e a planilha mostra outro (ou nada). */
export async function compareBlipsCoordinates({token,groups=[]}={}){
 if(!token)throw new Error("Conecte o Google Sheets para conferir Blips e Coordenadas.");
 const list=[...new Map(groups.filter(g=>g&&plain(g.group)).map(g=>[fold(g.group),g])).values()];
 if(!list.length)return {diffs:[],checkedGroups:[],sheetGid:null};
 const root="https://sheets.googleapis.com/v4/spreadsheets/"+SHEET_ID;
 const meta=await sheets(root+"?fields=sheets.properties(sheetId,title,gridProperties)",token);
 const abas=(meta.sheets||[]).map(s=>s.properties||{});
 const tab=TAB_GIDS.map(g=>abas.find(p=>Number(p.sheetId)===g)).find(Boolean)
  ||abas.find(p=>fold(p.title)===fold(TAB_TITLE));
 if(!tab)throw new Error("A aba BLIPS COORDENADAS não foi encontrada.");
 const sheetGid=Number(tab.sheetId),aba=String(tab.title);
 const a1="'"+aba.replace(/'/g,"''")+"'";
 const range=a1+"!A1:CD"+Math.min(tab.gridProperties?.rowCount||1006,4000);
 const data=await sheets(root+"/values/"+encodeURIComponent(range)+"?valueRenderOption=FORMATTED_VALUE",token);
 const rows=data.values||[];
 const sections=sectionsIn(rows);
 if(!sections.length)throw new Error("Quadros da planilha não reconhecidos na aba BLIPS COORDENADAS.");
 const diffs=[];
 for(const f of list){
  const key=fold(f.group),[sectorKey,title]=sector(f);
  let selected=null;
  for(const s of sections.filter(s=>s.sector===sectorKey)){
   const entry=s.entries.find(e=>fold(e.name)===key);
   if(entry){selected={s,entry};break;}
  }
  if(!selected)for(const s of sections){
   const entry=s.entries.find(e=>fold(e.name)===key);
   if(entry){selected={s,entry};break;}
  }
  if(!selected){
   // Sugere o primeiro quadro livre (N/A sem dados) do segmento certo.
   let livre=null;
   for(const s of sections.filter(s=>s.sector===sectorKey)){
    const e=s.entries.find(e=>safeBlank(rows,s,e));
    if(e){livre=colLetter(e.col)+(s.headerRow+1);break;}
   }
   diffs.push({group:f.group,aba,sheetGid,campo:"GROUP",tipo:"ADICIONAR",
    celula:livre||"",naPlanilha:"",noHighOS:f.group,
    obs:livre?"Group não está na aba. Quadro livre sugerido em "+title+": "+livre+".":"Group não está na aba e não há quadro livre em "+title+"."});
   continue;
  }
  const {s,entry}=selected,col=entry.col,fields=valuesFor(f);
  for(let r=s.headerRow+1;r<Math.min(s.footerRow,s.headerRow+MAX_FIELDS_SCAN);r++){
   const label=cell(rows,r,col-1);
   if(!label||fold(label)==="TRUE")continue;
   const value=fields[fold(label)];
   if(!plain(value))continue;
   const occupied=Array.from({length:6},(_,i)=>col+i).filter(c=>cell(rows,r,c));
   const found=occupied.map(c=>cell(rows,r,c)).join(" / ");
   if(sameSheetValue(value,found))continue;
   diffs.push({group:f.group,aba,sheetGid,campo:label,tipo:found?"ALTERAR":"PREENCHER",
    celula:colLetter(occupied[0]??col)+(r+1),naPlanilha:found,noHighOS:plain(value),
    obs:occupied.length>1?"Campo repartido em "+occupied.length+" células na planilha.":""});
  }
 }
 return {diffs,checkedGroups:list.map(f=>f.group),sheetGid};
}
