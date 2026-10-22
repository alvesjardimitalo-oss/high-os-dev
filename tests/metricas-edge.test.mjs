import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const path=name=>new URL('../assets/modules/'+name,import.meta.url);
const ocu=readFileSync(path('ocupacao.js'),'utf8');
let metric=readFileSync(path('metricas-motor.js'),'utf8');
metric=metric.replace("from './ocupacao.js'","from 'data:text/javascript,"+encodeURIComponent(ocu).replaceAll("'","%27")+"'");
const motor=await import('data:text/javascript,'+encodeURIComponent(metric));
const parser=await import('data:text/javascript,'+encodeURIComponent(readFileSync(path('metricas-parser.js'),'utf8')));

test('Data impossível não vira data válida no histórico',()=>{
 assert.equal(Number.isNaN(motor.msDe('31/02/2026')),true);
 assert.equal(Number.isNaN(motor.msDe('2026-13-03')),true);
 assert.equal(Number.isNaN(motor.msDe('2026-02-30')),true);
 assert.ok(Number.isFinite(motor.msDe('29/02/2024')));
});
test('Data efetiva prevalece sobre data de gravação na transferência',()=>{
 const tl=motor.montarLinhaDoTempo({
  entregas:[{group:'Armas01',faccao:'Primeira',dataEntrega:'2026-10-01',status:'ATIVA'}],
  transferencias:[{group:'Armas01',groupDestino:'Drogas02',
   dataEfetiva:'2026-10-20',data:'2026-10-22T12:00:00-03:00',
   depois:{origem:{faccao:''},destino:{faccao:'Primeira'}}}]
 });
 assert.equal(tl.ocupanteEm('Armas01',motor.msDe('2026-10-19')+20*3600000),'Primeira');
 assert.equal(tl.ocupanteEm('Armas01',motor.msDe('2026-10-20')+14*3600000),null);
 assert.equal(tl.ocupanteEm('Drogas02',motor.msDe('2026-10-20')+14*3600000),'Primeira');
});
test('Coleta ausente não deve virar zero realizado',()=>{
 const data=new Date(2026,9,22),agora=new Date(2026,9,23,12);
 const c=motor.coletaDoDia({'14H':null,'16h':'','21H':0,'23H':'abc'},data,agora);
 assert.equal(c.feitas,1);
 assert.equal(c.faltam,3);
 assert.equal(c.aguardando,0);
 assert.equal(c.parcial,true);
});
test('Aliasing de horário é normalizado e só números são realizados',()=>{
 const c=motor.coletaDoDia({'14h':'3','16H':1,'21H':false,'23H':' '},new Date(2026,9,22),new Date(2026,9,23));
 assert.equal(c.feitas,2);
 assert.equal(c.faltam,2);
});
test('Linha atribuída ignora horário fora do dia e slots sem número',()=>{
 const faccoes=[{group:'Armas01',faccao:'Primeira',status:'ATIVA',dataEntrega:'2026-10-01'}];
 const tl=motor.montarLinhaDoTempo({faccoes});
 const {linhas}=motor.atribuirLinhas(
  [{group:'Armas01',data:'22/10/2026',slots:{'14H':null,'16H':'4','25H':9}}],
  tl,{faccoes,dataDe:()=>new Date(2026,9,22),slotsDe:r=>r.slots});
 assert.equal(linhas.length,1);
 assert.deepEqual(linhas[0].slots,{'16H':'4'});
});
test('Importador aceita Galpão e variação antiga da Mecânica Ilegal',()=>{
 assert.equal(parser.metricGroupLabel('Galpao02'),'Galpao02');
 assert.equal(parser.metricGroupLabel('IlegalMecanic01'),'IlegalMecanic01');
});
