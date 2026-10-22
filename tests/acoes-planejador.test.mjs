import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const coreText=readFileSync(new URL('../assets/modules/acoes-core.js',import.meta.url),'utf8');
const {calculateAction,kitFor,priceOf,defaultTeam,availableTeams,photoUrl}=await import('data:text/javascript,'+encodeURIComponent(coreText));
const products={itens:[
 {item:'PISTOLA T54',pista:38000,parceria:30000,status:'ativo'},
 {item:'PISTOLA 100X',pista:13500,parceria:10000,status:'ativo'},
 {item:'COLETE',pista:13000,parceria:10000,status:'ativo'},
 {item:'PENDRIVE 2',pista:10500,parceria:7500,status:'ativo'},
 {item:'UZI',pista:47000,parceria:42000,status:'ativo'},
 {item:'SMG 200X',pista:18000,parceria:15000,status:'ativo'}
]};
const store={nome:'LOJA DE DEPARTAMENTO',status:'ativo',custo:268500,premio_min:438571,premio_max:504357,buff:55000,
 itens:[{nome:'ARMA PISTOLA',quantidade:4},{nome:'MUNIÇÃO PISTOLA (x100)',quantidade:4},{nome:'COLETE',quantidade:4},{nome:'PENDRIVE 2',quantidade:1}],
 regras_confronto:[{invasores:3,policiais:4,refens:1},{invasores:4,policiais:5,refens:1}]};
test('Loja de Departamento: custo original R$ 268.500, preço de pista',()=>{
 const k=kitFor(store,products,{team:4,kitMode:'oficial'});
 assert.equal(k.total,268500);
 assert.equal(k.comparison,0);
 assert.deepEqual(k.lines.map(x=>x.total),[152000,54000,52000,10500]);
});
test('Equipe com 3 jogadores tem 3 kits e apenas um pendrive',()=>{
 const k=kitFor(store,products,{team:3,kitMode:'por-jogador'});
 assert.deepEqual(k.lines.map(x=>x.qty),[3,3,3,1]);
 assert.equal(k.total,204000);
});
test('Kit cadastrado NÃO cresce automaticamente com equipe',()=>{
 const k=kitFor(store,products,{team:3,kitMode:'oficial'});
 assert.deepEqual(k.lines.map(x=>x.qty),[4,4,4,1]);
 assert.equal(k.total,268500);
});
test('Lucro após 30% de lavagem e custo sem reaplicar buff histórico',()=>{
 const p=calculateAction(store,products,{team:4,targetPerPlayer:20000,roi:.25});
 assert.ok(Math.abs(p.netMin-38499.7)<.01);
 assert.equal(p.buffIncluded,55000);
 assert.equal(p.payoutNeeded,497858);
 assert.equal(p.status,'BUFF');
 assert.equal(p.rule.policiais,5);
});
test('Equipe de 3 jogadores pode exigir nerf dependendo da meta',()=>{
 const p=calculateAction(store,products,{team:3,targetPerPlayer:20000,roi:.25});
 assert.equal(p.kit.total,204000);
 assert.equal(p.rule.policiais,4);
 assert.equal(p.status,'NERF');
 assert.equal(p.payoutNeeded,377143);
 assert.ok(p.perPlayer>30000);
});
test('Margem e meta de lucro reguláveis alteram a recomendação',()=>{
 const p=calculateAction(store,products,{team:4,targetPerPlayer:1000,roi:0,tolerance:.25});
 assert.equal(p.status,'NERF');
 const q=calculateAction(store,products,{team:4,targetPerPlayer:40000,roi:0});
 assert.equal(q.status,'BUFF');
 assert.ok(q.payoutNeeded>p.payoutNeeded);
});
test('Preço de parceria é independente do preço de pista',()=>{
 const q=priceOf('MUNIÇÃO PISTOLA (x100)',products,'parceria');
 assert.equal(q.unit,10000);
 assert.equal(kitFor(store,products,{team:4,priceMode:'parceria'}).total,207500);
});
test('Preço não cadastrado é pendência, nunca valor zero inventado',()=>{
 const unknown={...store,itens:[...store.itens,{nome:'PENDRIVE CLANDESTINO 3',quantidade:1}]};
 const p=calculateAction(unknown,products,{team:4});
 assert.equal(p.kit.total,null);
 assert.equal(p.status,'INSUMO SEM PREÇO');
 assert.equal(p.payoutAdjustable,false);
});
test('Regra de equipe determina invasores, policiais e reféns',()=>{
 assert.deepEqual(availableTeams(store),[3,4]);
 assert.equal(defaultTeam(store),4);
 assert.equal(calculateAction(store,products,{team:10}).status,'EQUIPE INVÁLIDA');
});
test('Recuperação de equipamentos é parâmetro, não redução automática',()=>{
 const p=calculateAction(store,products,{team:4,reuse:.5});
 assert.equal(p.kit.total,268500);
 assert.equal(p.kit.effectiveCost,134250);
});
test('Links de foto aceitam apenas nome local seguro',()=>{
 assert.match(photoUrl('loja_departamento.webp'),/loja_departamento\.webp$/);
 assert.equal(photoUrl('../private.png'),'');
});
test('Página protegida pela permissão Economia e inicialização isolada',()=>{
 const app=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(app,/'planejador-acoes':'economia'/);
 assert.match(app,/if\(page==='planejador-acoes'\)import\('\.\/modules\/acoes-planejador-ui\.js/);
 assert.match(html,/data-page="planejador-acoes"/);
 assert.match(html,/id="page-planejador-acoes"/);
 assert.match(html,/id="apScenarios"/);
});

test('Item inativo do Mercado Negro não permite validar custo para buff/nerf',()=>{
 const inactive={itens:products.itens.map(x=>x.item==='COLETE'?{...x,status:'inativo'}:x)};
 const p=priceOf('COLETE',inactive,'pista');
 assert.equal(p.unit,null);
 assert.equal(p.listedInactive,true);
 assert.equal(p.missing,true);
 const result=calculateAction(store,inactive,{team:4});
 assert.ok(result.kit.missing.includes('COLETE'));
 assert.equal(result.kit.total,null);
 assert.equal(result.status,'INSUMO SEM PREÇO');
 assert.equal(result.payoutAdjustable,false);
});

test('A aprovação exige GID da aba original e revalida fórmulas antes do POST',()=>{
 const app=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
 const fn=app.slice(app.indexOf('async function syncApprovedActionPayout('),app.indexOf('function activateAppPage(',app.indexOf('async function syncApprovedActionPayout(')));
 assert.match(fn,/sheets\.properties\(sheetId,title\)/);
 assert.match(fn,/Number\(sheetEntry\.properties\.sheetId\)!==candidate\.sheetId/);
 assert.match(fn,/latestFormulas=await facSheetFetch/);
 assert.match(fn,/BUFF\/NERF recebeu uma fórmula durante a confirmação/);
 assert.ok(fn.indexOf('latestFormulas=await')<fn.indexOf("root+':batchUpdate'"));
});
