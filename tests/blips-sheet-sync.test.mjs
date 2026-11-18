import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const code=readFileSync(new URL('../assets/modules/blips-sheet-sync.js',import.meta.url),'utf8');
const {compareBlipsCoordinates,valuesFor,sameSheetValue}=await import('data:text/javascript,'+encodeURIComponent(code));

function fakeSheet(){
 const rows=Array.from({length:10},()=>[]);
 rows[0][4]='ARMAS';
 rows[1][5]='GROUP';rows[1][6]='Armas01';
 rows[2][5]='GARAGEM PUBLICA';rows[2][6]='BLIP: 10,10,10\nSPAWN: 11,11,11';
 rows[3][5]='GARAGEM DELUXE';
 rows[4][5]='BLINDADOS';
 rows[5][5]='FARM';
 rows[6][5]='TRUE';
 return rows;
}
function group(){
 return {group:'Armas01',segmento:'Armas',perfilTecnico:{
  operacional:{
   garagens:[{tipo:'PUBLICA',blip:'20,20,20',spawn:'21,21,21'},
             {tipo:'DELUXE',blip:'30,30,30',spawn:'31,31,31'}],
   blindados:[{blip:'40,40,40',spawn:'41,41,41'}]
  },farm:{cds:'42,42,42'}
 }};
}
async function withSheet(rows,work){
 const previous=globalThis.fetch;
 const writes=[];
 globalThis.fetch=async (url,opt={})=>{
  if((opt.method||'GET')!=='GET'||opt.body!==undefined)writes.push({url,opt});
  if(url.includes('/values/'))return {ok:true,json:async()=>({values:rows})};
  return {ok:true,json:async()=>({sheets:[{properties:{
   sheetId:1571924835,title:'BLIPS COORDENADAS',gridProperties:{rowCount:300}
  }}]})};
 };
 try{return await work(writes)}
 finally{globalThis.fetch=previous}
}
test('Garagens, blindados e farm são serializados sem perder os spawns',()=>{
 const v=valuesFor(group());
 assert.match(v.GARAGEMPUBLICA,/BLIP: 20,20,20\nSPAWN: 21,21,21/);
 assert.match(v.GARAGEMDELUXE,/BLIP: 30,30,30\nSPAWN: 31,31,31/);
 assert.match(v.BLINDADOS,/BLIP: 40,40,40\nSPAWN: 41,41,41/);
 assert.equal(v.FARM,'42,42,42');
 assert.equal(v.INICIARFARM,v.FARM);
 assert.equal(Object.hasOwn(v,'ROTAEXCLUSIVA'),false);
 assert.equal(Object.hasOwn(v,'VIPORG'),false);
 assert.equal(Object.hasOwn(v,'CAPACIDADEBAU'),false);
});
test('SOMENTE LEITURA: a conferência nunca faz requisição de escrita',async()=>{
 await withSheet(fakeSheet(),async writes=>{
  await compareBlipsCoordinates({token:'mock',groups:[group(),{group:'Armas99',segmento:'Armas',beneficios:{craft:'1,1,1'}}]});
  assert.equal(writes.length,0);
 });
});
test('Lista célula a célula o que difere; campo igual não entra',async()=>{
 await withSheet(fakeSheet(),async()=>{
  const {diffs,checkedGroups}=await compareBlipsCoordinates({token:'mock',groups:[group()]});
  assert.deepEqual(checkedGroups,['Armas01']);
  const pub=diffs.find(d=>d.campo==='GARAGEM PUBLICA');
  assert.equal(pub.celula,'G3');
  assert.equal(pub.tipo,'ALTERAR');
  assert.equal(pub.naPlanilha,'BLIP: 10,10,10\nSPAWN: 11,11,11');
  assert.equal(pub.noHighOS,'BLIP: 20,20,20\nSPAWN: 21,21,21');
  const deluxe=diffs.find(d=>d.campo==='GARAGEM DELUXE');
  assert.equal(deluxe.tipo,'PREENCHER');
  assert.equal(deluxe.celula,'G4');
  assert.equal(diffs.find(d=>d.campo==='FARM').noHighOS,'42,42,42');
  assert.equal(diffs.every(d=>d.aba==='BLIPS COORDENADAS'&&d.sheetGid===1571924835),true);
 });
 const rows=fakeSheet();rows[5][6]='42, 42, 42';
 await withSheet(rows,async()=>{
  const {diffs}=await compareBlipsCoordinates({token:'mock',groups:[group()]});
  assert.equal(diffs.some(d=>d.campo==='FARM'),false,'espaço após vírgula não é diferença');
 });
});
test('Campo vazio no High OS não gera pendência (planilha mantém o que tem)',async()=>{
 await withSheet(fakeSheet(),async()=>{
  const g=group();g.perfilTecnico.operacional.garagens=[];
  const {diffs}=await compareBlipsCoordinates({token:'mock',groups:[g]});
  assert.equal(diffs.some(d=>d.campo==='GARAGEM PUBLICA'),false);
 });
});
test('Group ausente vira ADICIONAR com quadro livre sugerido',async()=>{
 const rows=fakeSheet();
 rows[1][12]='GROUP';rows[1][13]='N/A';
 await withSheet(rows,async()=>{
  const {diffs}=await compareBlipsCoordinates({token:'mock',groups:[{group:'Armas99',segmento:'Armas',beneficios:{craft:'1,1,1'}}]});
  assert.equal(diffs.length,1);
  assert.equal(diffs[0].tipo,'ADICIONAR');
  assert.equal(diffs[0].celula,'N2');
 });
 await withSheet(fakeSheet(),async()=>{
  const {diffs}=await compareBlipsCoordinates({token:'mock',groups:[{group:'Armas99',segmento:'Armas'}]});
  assert.equal(diffs[0].celula,'');
  assert.match(diffs[0].obs,/não há quadro livre/);
 });
});
test('Campo repartido em várias células é comparado inteiro e sinalizado',async()=>{
 const rows=fakeSheet();rows[2][7]='Outra coordenada técnica';
 await withSheet(rows,async()=>{
  const {diffs}=await compareBlipsCoordinates({token:'mock',groups:[group()]});
  const pub=diffs.find(d=>d.campo==='GARAGEM PUBLICA');
  assert.match(pub.obs,/2 células/);
  assert.match(pub.naPlanilha,/Outra coordenada técnica/);
 });
});
test('Group achado em outra categoria ainda é comparado no quadro existente',async()=>{
 const rows=fakeSheet();rows[0][4]='MUNIÇÃO';
 await withSheet(rows,async()=>{
  const {diffs}=await compareBlipsCoordinates({token:'mock',groups:[group()]});
  assert.equal(diffs.some(d=>d.tipo==='ADICIONAR'),false);
  assert.equal(diffs.some(d=>d.campo==='GARAGEM PUBLICA'),true);
 });
});
test('sameSheetValue ignora espaços e caixa',()=>{
 assert.equal(sameSheetValue(' 1.5, 2 ,3 ','1.5,2,3'),true);
 assert.equal(sameSheetValue('abc','ABC'),true);
 assert.equal(sameSheetValue('1,2,3','1,2,4'),false);
});
