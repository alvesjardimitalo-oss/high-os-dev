import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const coreText=readFileSync(new URL('../assets/modules/acoes-core.js',import.meta.url),'utf8');
const coreUrl='data:text/javascript,'+encodeURIComponent(coreText);
const intelText=readFileSync(new URL('../assets/modules/acoes-inteligencia.js',import.meta.url),'utf8')
 .replace("from './acoes-core.js?v=2'",'from '+JSON.stringify(coreUrl));
const intelUrl='data:text/javascript,'+encodeURIComponent(intelText);
const managementText=readFileSync(new URL('../assets/modules/acoes-gestao.js',import.meta.url),'utf8')
 .replace("from './acoes-core.js?v=2'",'from '+JSON.stringify(coreUrl))
 .replace("from './acoes-inteligencia.js?v=1'",'from '+JSON.stringify(intelUrl));
const {buildManagementBoard,filterManagementEntries}=
 await import('data:text/javascript,'+encodeURIComponent(managementText));
const {makePriceReference}=await import(intelUrl);
const catalog={itens:[
 {item:'PISTOLA T54',pista:38000,status:'ativo',parceria:30000},
 {item:'PISTOLA 100X',pista:13500,status:'ativo',parceria:10000},
 {item:'COLETE',pista:13000,status:'ativo',parceria:10000},
 {item:'PENDRIVE 2',pista:10500,status:'ativo',parceria:7500}
]};
const template={nome:'LOJA MODELO',status:'ativo',custo:139500,
 premio_min:300000,premio_max:360000,
 itens:[{nome:'ARMA PISTOLA',quantidade:2},{nome:'MUNIÇÃO PISTOLA (x100)',quantidade:2},
 {nome:'COLETE',quantidade:2},{nome:'PENDRIVE 2',quantidade:1}],
 regras_confronto:[{invasores:1,policiais:3},{invasores:2,policiais:4}]};
test('painel compara ações pelo cenário de vitória, sem inventar estatísticas operacionais',()=>{
 const b=buildManagementBoard([template],catalog);
 assert.equal(b.stats.total,1);
 assert.equal(b.stats.active,1);
 assert.equal(b.stats.valid,1);
 assert.equal(b.stats.pendentes,0);
 assert.equal(b.stats.capitalMediano,139500);
 assert.equal(b.stats.lucroMedianoMembro,80000);
 assert.equal(b.entries[0].netMin,160000);
 assert.equal(b.entries[0].loss,-139500);
 assert.equal(b.entries[0].status,'MANTER');
 assert.equal(b.hasReference,false);
});
test('aumento apenas da arma aumenta capital, mas não simula diminuição do lucro recorrente',()=>{
 const reference=makePriceReference(catalog,'2026-10-01T10:00:00Z');
 const now={itens:catalog.itens.map(i=>i.item==='PISTOLA T54'?{...i,pista:40000}:i)};
 const board=buildManagementBoard([template],now,{reference});
 const row=board.entries[0];
 assert.equal(board.hasReference,true);
 assert.equal(row.change.difference,4000);
 assert.equal(row.change.deltaPerMember,0);
 assert.equal(row.status,'CONFERIR INVESTIMENTO');
 assert.equal(row.priority,3); // divergência documentada entre custo base e preços vigentes
});
test('alta de colete afeta reposição e prioriza avaliação de rentabilidade',()=>{
 const reference=makePriceReference(catalog);
 const now={itens:catalog.itens.map(i=>i.item==='COLETE'?{...i,pista:15000}:i)};
 const row=buildManagementBoard([template],now,{reference}).entries[0];
 assert.equal(row.change.difference,4000);
 assert.equal(row.change.deltaPerMember,-2000);
 assert.equal(row.status,'IMPACTADA POR PREÇOS');
 assert.ok(row.priority>=4);
});
test('queda de insumo não aprova nerf automaticamente',()=>{
 const reference=makePriceReference(catalog);
 const now={itens:catalog.itens.map(i=>i.item==='COLETE'?{...i,pista:11000}:i)};
 const row=buildManagementBoard([template],now,{reference}).entries[0];
 assert.equal(row.change.deltaPerMember,2000);
 assert.notEqual(row.status,'NERF');
 assert.ok(row.reason.some(x=>x.includes('não é automática')));
});
test('gestão separa pendências, prejuízo e inativas sem criar preços fictícios',()=>{
 const rows=[
  template,
  {...template,nome:'SEM PREÇO',itens:[{nome:'ITEM INEXISTENTE',quantidade:1}]},
  {...template,nome:'PREJUÍZO',custo:139500,premio_min:40000,premio_max:60000},
  {...template,nome:'INATIVA',status:'inativo'}
 ];
 const board=buildManagementBoard(rows,catalog);
 assert.equal(board.stats.total,4);
 assert.equal(board.stats.active,3);
 assert.equal(board.stats.pendentes,1);
 assert.equal(board.stats.emPrejuizo,1);
 assert.equal(filterManagementEntries(board.entries,{filter:'PENDENTES'}).length,1);
 assert.equal(filterManagementEntries(board.entries,{filter:'PREJUIZO'}).length,1);
 assert.equal(filterManagementEntries(board.entries,{filter:'IMPACTADAS'}).length,0);
 assert.equal(filterManagementEntries(board.entries,{query:'sem preco'}).length,1);
 const sorted=filterManagementEntries(board.entries,{sort:'LUCRO_MEMBRO'});
 assert.equal(sorted.at(-1).nome,'SEM PREÇO');
});

test('cenário de risco gera resultado esperado e retorno por hora só com hipóteses explícitas',()=>{
 const without=buildManagementBoard([template],catalog).entries[0];
 assert.equal(without.expected,null);
 assert.equal(without.expectedMemberHour,null);
 const estimated=buildManagementBoard([template],catalog,{
  winChance:.6,policeWaitMinutes:30,estimatedActionMinutes:20
 }).entries[0];
 assert.equal(estimated.expected,40200);
 assert.equal(estimated.expectedMemberHour,24120);
 assert.equal(estimated.cycleMinutes,50);
 const noTimes=buildManagementBoard([template],catalog,{winChance:.6}).entries[0];
 assert.equal(noTimes.expected,40200);
 assert.equal(noTimes.expectedMemberHour,null);
 const worst=buildManagementBoard([template],catalog,{winChance:.3}).entries[0];
 assert.equal(worst.expected,-49650);
 assert.equal(worst.status,'RISCO SIMULADO');
 assert.ok(worst.priority>=4);
});

test('elementos de navegação e painel gerencial integrados à página original',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../assets/modules/acoes-planejador-ui.js',import.meta.url),'utf8');
 const app=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
 for(const id of ['apManagementKpis','apManagementList','apManagementFilter','apManagementSort','apManagementSearch','apManagementMethod','apPortfolioWinChance','apPortfolioPoliceWait','apPortfolioDuration','apManagementExport']){
  assert.match(html,new RegExp('id="'+id+'"'));
 }
 assert.match(ui,/buildManagementBoard/);
 assert.match(ui,/filterManagementEntries/);
 assert.match(ui,/data-ap-manage/);
 assert.match(app,/acoes-planejador-ui\.js\?v=5/);
});
