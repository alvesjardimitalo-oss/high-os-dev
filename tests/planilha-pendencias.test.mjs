import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const code=readFileSync(new URL('../assets/modules/planilha-pendencias.js',import.meta.url),'utf8');
const P=await import('data:text/javascript,'+encodeURIComponent(code));

const diff=(o={})=>({origem:'BLIPS',aba:'BLIPS COORDENADAS',group:'Armas01',campo:'CRAFT',celula:'G5',naPlanilha:'',noHighOS:'1,2,3',...o});

test('Diferença nova vira pendência PENDENTE com id estável',()=>{
 const {gravar,resolver}=P.planejarConferencia([],[diff()],{origem:'BLIPS',groups:['Armas01']});
 assert.equal(gravar.length,1);
 assert.equal(gravar[0].status,'PENDENTE');
 assert.equal(gravar[0].id,P.pendenciaId(diff()));
 assert.deepEqual(resolver,[]);
});
test('Pendência que voltou a bater é resolvida só dentro do escopo conferido',()=>{
 const a={...diff(),id:P.pendenciaId(diff()),status:'PENDENTE',assinatura:P.assinatura(diff())};
 const b={...diff({group:'Armas02'}),id:P.pendenciaId(diff({group:'Armas02'})),status:'PENDENTE'};
 const r=P.planejarConferencia([a,b],[],{origem:'BLIPS',groups:['Armas01']});
 assert.deepEqual(r.resolver,[a.id]);
 const todos=P.planejarConferencia([a,b],[],{origem:'BLIPS',groups:null});
 assert.deepEqual(todos.resolver.sort(),[a.id,b.id].sort());
 const nenhum=P.planejarConferencia([a,b],[],{origem:'BLIPS',groups:[]});
 assert.deepEqual(nenhum.resolver,[]);
});
test('Outra origem nunca é resolvida por engano',()=>{
 const v={...diff({origem:'VIP'}),id:'x',status:'PENDENTE'};
 assert.deepEqual(P.planejarConferencia([v],[],{origem:'BLIPS',groups:null}).resolver,[]);
});
test('IGNORADA só volta se o valor esperado mudar; PENDENTE igual não regrava',()=>{
 const ign={...diff(),id:P.pendenciaId(diff()),status:'IGNORADA',assinatura:P.assinatura(diff())};
 assert.equal(P.planejarConferencia([ign],[diff()],{origem:'BLIPS',groups:null}).gravar.length,0);
 assert.equal(P.planejarConferencia([ign],[diff({noHighOS:'9,9,9'})],{origem:'BLIPS',groups:null}).gravar.length,1);
 const pend={...ign,status:'PENDENTE'};
 assert.equal(P.planejarConferencia([pend],[diff()],{origem:'BLIPS',groups:null}).gravar.length,0);
 assert.equal(P.planejarConferencia([pend],[diff({naPlanilha:'outro'})],{origem:'BLIPS',groups:null}).gravar.length,1);
});
test('Conferência por célula resolve quando a planilha passa a mostrar o valor',()=>{
 const p={id:'v1',status:'PENDENTE',aba:'BENEFICIOS FACÇÕES',celula:'AB12',noHighOS:'SIM'};
 const vazio={id:'v2',status:'PENDENTE',aba:'BENEFICIOS FACÇÕES',celula:'AC12',noHighOS:''};
 const valores=new Map([['BENEFICIOS FACÇÕES!AB12','sim'],['BENEFICIOS FACÇÕES!AC12','']]);
 assert.deepEqual(P.resolvidasPorCelula([p,vazio],valores),['v1','v2']);
 assert.deepEqual(P.resolvidasPorCelula([p],new Map([['BENEFICIOS FACÇÕES!AB12','NÃO']])),[]);
});
test('Link abre a planilha na aba e célula certas',()=>{
 assert.equal(P.linkCelula({sheetId:'ID',sheetGid:1571924835,celula:'G56'}),'https://docs.google.com/spreadsheets/d/ID/edit#gid=1571924835&range=G56');
 assert.equal(P.linkCelula({sheetId:''}),'');
});
