import test from 'node:test';
import assert from 'node:assert/strict';
import { qgsDaGrade, planejar, separarLocal, segmentoDoGroup, resumoPlano } from '../assets/modules/groups-season.js';

/* Recorte no formato real da aba: rotulo na coluna F, valor na G,
   cartoes a cada 7 colunas, nome do setor na coluna E. */
function grade(){
 const g=Array.from({length:40},()=>[]);
 const put=(r,c,v)=>{g[r][c]=v};
 put(1,4,'ARMAS');
 const cards=[
  ['Armas01','FAVELA DA BARRAGEM','Armas','1250.5,-127.56,76.6,130.4','1248.86,-125.8,76.6,124.73','1252.66,-126.19,76.6,235.28'],
  ['Armas05','FAVELA VIVE 1722.33, 1450.51, 117.98, 257.96','','1547.83,1460.66,113.23,187.09','1548.57,1472.55,117.39,263.63','1548.33,1474.09,117.39,87.88'],
  ['','','','','','']
 ];
 cards.forEach((c,i)=>{
  const col=5+i*7;
  ['GROUP','LOCAL','PRODUTO','INICIAR FARM','CRAFT','BAU'].forEach((rot,k)=>{put(4+k,col,rot);if(c[k])put(4+k,col+1,c[k])});
 });
 put(20,4,'APOIO');
 ['GROUP','LOCAL','PRODUTO','INICIAR FARM'].forEach((rot,k)=>put(23+k,5,rot));
 put(23,6,'IlegalMechanic01'); put(24,6,'QG CYPRESS');
 return g;
}

test('LOCAL com coordenada colada e separado', ()=>{
 assert.deepEqual(separarLocal('FAVELA VIVE 1722.33, 1450.51, 117.98, 257.96'),{nome:'FAVELA VIVE',cds:'1722.33,1450.51,117.98,257.96'});
 assert.deepEqual(separarLocal('FAVELA DA BARRAGEM'),{nome:'FAVELA DA BARRAGEM',cds:''});
});

test('segmento vem do nome do Group', ()=>{
 assert.equal(segmentoDoGroup('Municao03'),'Munição');
 assert.equal(segmentoDoGroup('IlegalMechanic02','APOIO'),'Mecânica Ilegal');
 assert.equal(segmentoDoGroup('IlegalMedic01'),'Hospital Ilegal');
});

test('le os QGs da grade e ignora cartao vazio', ()=>{
 const qgs=qgsDaGrade(grade());
 const nomes=qgs.filter(q=>q.group).map(q=>q.group);
 assert.deepEqual(nomes.sort(),['Armas01','Armas05','IlegalMechanic01']);
 const a5=qgs.find(q=>q.group==='Armas05');
 assert.equal(a5.local,'FAVELA VIVE');
 assert.equal(a5.cds.local,'1722.33,1450.51,117.98,257.96');
});

test('reaproveita QG salvo pelo local, arquiva ficha da S2 e cria a da S3', ()=>{
 const qgsPlanilha=qgsDaGrade(grade());
 const qgsSalvos=[
  {chave:'FAVELA_DA_BARRAGEM',group:'',local:'FAVELA DA BARRAGEM',setor:'ARMAS',vinculado:false,
   cds:{farm:'1,1,1',bar:'9,9,9'}},
  {chave:'QG_ANTIGO',group:'',local:'QG QUE SAIU',vinculado:false,cds:{}}
 ];
 const faccoes=[
  {id:'Armas01',group:'Armas01',faccao:'Tropa S2',status:'ATIVA',segmento:'Armas'},
  {id:'IlegalMechanic01',group:'IlegalMechanic01',seasonId:'s3',segmento:'Mecânica Ilegal',beneficios:{bau:'5,5,5'}}
 ];
 const p=planejar({qgsPlanilha,qgsSalvos,faccoes,seasonId:'s3',seasonAnterior:'s2'});

 const barragem=p.qgsFinal.find(q=>q.group==='Armas01');
 assert.equal(barragem.chave,'FAVELA_DA_BARRAGEM','mantem a chave do QG salvo');
 assert.equal(barragem.cds.farm,'1250.5,-127.56,76.6,130.4','planilha prevalece');
 assert.equal(barragem.cds.bar,'9,9,9','campo vazio na planilha mantem o painel');

 assert.ok(p.foraDaPlanilha.some(q=>q.chave==='QG_ANTIGO'),'QG fora da planilha nao some');
 assert.ok(p.qgsFinal.some(q=>q.chave==='QG_ANTIGO'));

 assert.equal(p.arquivar.length,1);
 assert.equal(p.arquivar[0].para,'s2__Armas01');
 assert.equal(p.arquivar[0].dados.faccao,'Tropa S2','arquivo guarda a ficha inteira');
 assert.equal(p.arquivar[0].dados.group,'s2__Armas01','arquivo nao conflita com o Group novo');

 const nova=p.criar.find(f=>f.group==='Armas01');
 assert.equal(nova.faccao,'');
 assert.equal(nova.status,'INATIVA');
 assert.equal(nova.seasonId,'s3');
 assert.equal(nova.beneficios.craft,'1248.86,-125.8,76.6,124.73');

 assert.ok(p.criar.some(f=>f.group==='Armas05'));
 assert.equal(p.atualizar.length,1,'ficha que ja e da S3 so recebe patch');
 assert.equal(p.atualizar[0].patch.qg,'QG CYPRESS');
 assert.equal(p.atualizar[0].patch.beneficios.bau,'5,5,5');

 const r=resumoPlano(p);
 assert.equal(r.groups,3);
 assert.equal(new Set(p.qgsFinal.map(q=>q.chave)).size,p.qgsFinal.length,'chaves unicas');
});

test('Group repetido na planilha entra uma vez so', ()=>{
 const q={group:'Drogas01',local:'A',cds:{},origem:{linha:1,coluna:1}};
 const p=planejar({qgsPlanilha:[q,{...q,local:'B',origem:{linha:2,coluna:1}}]});
 assert.equal(p.repetidos.length,1);
 assert.equal(p.criar.length,1);
});

test('QGs saem na ordem da planilha (segmento por segmento)', ()=>{
 const p=planejar({qgsPlanilha:qgsDaGrade(grade())});
 assert.deepEqual(p.qgsFinal.map(q=>q.group),['Armas01','Armas05','IlegalMechanic01']);
});
