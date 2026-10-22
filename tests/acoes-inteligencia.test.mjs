import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const core=readFileSync(new URL('../assets/modules/acoes-core.js',import.meta.url),'utf8');
const coreUrl='data:text/javascript,'+encodeURIComponent(core);
const intel=readFileSync(new URL('../assets/modules/acoes-inteligencia.js',import.meta.url),'utf8')
 .replace("from './acoes-core.js?v=2'",'from '+JSON.stringify(coreUrl));
const {makePriceReference,assessPriceChanges,analyzeDecision,applySheetPrizeOverrides}=
 await import('data:text/javascript,'+encodeURIComponent(intel));
const {extractPublishedActionPrizes}=
 await import('data:text/javascript,'+encodeURIComponent(readFileSync(new URL('../assets/modules/acoes-sheet-sync.js',import.meta.url),'utf8')));
const catalog={itens:[
 {item:'PISTOLA T54',status:'ativo',pista:38000,parceria:30000},
 {item:'PISTOLA 100X',status:'ativo',pista:13500,parceria:10000},
 {item:'COLETE',status:'ativo',pista:13000,parceria:10000},
 {item:'PENDRIVE 2',status:'ativo',pista:10500,parceria:7500}
]};
const action={nome:'LOJA MODELO',status:'ativo',premio_min:300000,premio_max:360000,
 itens:[{nome:'ARMA PISTOLA',quantidade:2},{nome:'MUNIÇÃO PISTOLA (x100)',quantidade:2},
  {nome:'COLETE',quantidade:2},{nome:'PENDRIVE 2',quantidade:1}],
 regras_confronto:[{invasores:1,policiais:3,refens:1},{invasores:2,policiais:4,refens:1}]};
test('Sem referência salva não anuncia aumento inventado',()=>{
 const result=assessPriceChanges([action],catalog,null);
 assert.equal(result.available,false);
 assert.equal(result.changed,0);
});
test('Detecta aumento real e impacto por membro sem confundir investimento com reposição',()=>{
 const ref=makePriceReference(catalog,'2026-10-01T12:00:00Z');
 const current={itens:catalog.itens.map(i=>i.item==='PISTOLA T54'?{...i,pista:40000}:
  i.item==='COLETE'?{...i,pista:15000}:i)};
 const report=assessPriceChanges([action],current,ref);
 assert.equal(report.available,true);assert.equal(report.changed,1);
 assert.equal(report.up,1);assert.equal(report.down,0);
 assert.equal(report.changes[0].oldCost,139500);
 assert.equal(report.changes[0].newCost,147500);
 assert.equal(report.changes[0].difference,8000);
 assert.equal(report.changes[0].deltaPerMember,-2000);
 assert.equal(report.changes[0].items.length,2);
});
test('Baixa real não é chamada de buff automático',()=>{
 const ref=makePriceReference(catalog);
 const current={itens:catalog.itens.map(i=>i.item==='COLETE'?{...i,pista:11000}:i)};
 const report=assessPriceChanges([action],current,ref);
 assert.equal(report.down,1);
 assert.equal(report.changes[0].difference,-4000);
 assert.equal(report.changes[0].deltaPerMember,2000);
});
test('Cálculo de risco pondera vitória e perda integral, sem prever chance sozinho',()=>{
 const d=analyzeDecision(action,catalog,{team:2});
 assert.equal(d.valid,true);assert.equal(d.winChance,.4);
 assert.equal(d.expected,-19700);assert.equal(d.hourly,null);
 assert.equal(d.calc.kit.total,139500);
 assert.equal(d.calc.kit.winCost,50000);
 assert.equal(d.calc.netMin,160000);
 assert.equal(d.calc.loss,-139500);
 const informed=analyzeDecision(action,catalog,{team:2,winChance:.6,
  policeWaitMinutes:30,estimatedActionMinutes:20,targetPerPlayer:30000,roi:.25});
 assert.equal(informed.expected,40200);
 assert.equal(informed.totalMinutes,50);
 assert.equal(informed.hourly,96000);
 assert.equal(informed.suggested,347143);
 assert.equal(informed.direction,'CONSIDERAR BUFF');
 assert.ok(Math.abs(informed.breakEven-139500/299500)<.0001);
});
test('Prêmios proporcionais por equipe são apenas simulação e impedem publicação',()=>{
 const modeled=analyzeDecision(action,catalog,{team:1,teamPayout:'proporcional',kitMode:'por-jogador'});
 assert.equal(modeled.modeled,true);
 assert.equal(modeled.calc.min,150000);
 assert.equal(modeled.calc.max,180000);
 assert.equal(modeled.eligibleForSheet,false);
 const published=analyzeDecision(action,catalog,{team:1,teamPayout:'publicado'});
 assert.equal(published.modeled,false);
 assert.equal(published.calc.min,300000);
});
test('Ajustes hipotéticos de preço ou insumo não podem ser aprovados',()=>{
 assert.equal(analyzeDecision(action,catalog,{team:2,priceShift:.1}).eligibleForSheet,false);
 assert.equal(analyzeDecision(action,catalog,{team:2,quantities:{0:3}}).eligibleForSheet,false);
 assert.equal(analyzeDecision(action,catalog,{team:2,prices:{0:99999}}).eligibleForSheet,false);
 assert.equal(analyzeDecision(action,catalog,{team:2}).eligibleForSheet,true);
});
test('Extrai prêmios corretos da planilha sem inferir máximo',()=>{
 const rows=Array.from({length:60},()=>Array(20).fill(null));
 rows[5][5]='AÇÕES';rows[5][6]='LOJA MODELO';
 rows[13][5]='PRÊMIO MINIMO (SUJO)';rows[13][6]=300000;
 rows[14][5]='PRÊMIO MAXIMO (SUJO)';rows[14][6]=360000;
 rows[16][5]='BUFF';rows[16][6]=7000;
 rows[17][5]='NERF';rows[17][6]=500;
 rows[23][5]='AÇÕES';rows[23][6]='INCOMPLETA';
 rows[31][5]='PRÊMIO MINIMO (SUJO)';rows[31][6]=20000;
 const values=extractPublishedActionPrizes(rows);
 assert.equal(values.length,1);
 assert.deepEqual(values[0],{name:'LOJA MODELO',min:300000,max:360000,buff:7000,nerf:500});
 const enriched=applySheetPrizeOverrides([action],values);
 assert.equal(enriched[0].premioFonte,'Google Sheets');
 assert.equal(enriched[0].premio_max,360000);
});
test('Novos controles de decisão, histórico, refência e valores manuais fazem parte do app',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const js=readFileSync(new URL('../assets/modules/acoes-planejador-ui.js',import.meta.url),'utf8');
 const app=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
 for(const id of ['apPriceAlerts','apSaveReference','apReadSheet','apPoliceWait','apActionDuration',
  'apWinChance','apTeamPayout','apApproveManual','apReject','apHistory','apDecisionReason','apIntelligenceResult']){
  assert.ok(html.includes('id="'+id+'"'),id);
 }
 assert.match(js,/onReadReference/);
 assert.match(js,/approveProposal\('manual'\)/);
 assert.match(js,/d\.eligibleForSheet/);
 assert.match(app,/actionSaveReference/);
 assert.match(app,/actionRejectProposal/);
 assert.match(app,/actionReadSheetPrizes/);
 assert.match(app,/acoes-planejador-ui\.js\?v=7/);
 assert.match(app,/root\+':batchUpdate'/);
});

test('Valor sugerido fica visível e combina mínimo, máximo e lucro por participante',()=>{
 const d=analyzeDecision(action,catalog,{team:2,targetPerPlayer:140000,roi:.25,winChance:null});
 assert.equal(d.direction,'CONSIDERAR BUFF');
 assert.equal(d.recommendedMin,471429);
 assert.equal(d.recommendedMax,565715);
 assert.equal(d.recommendedDelta,171429);
 assert.ok(d.recommendedPercent>.57);
 assert.ok(Math.abs(d.recommendedPerMember-140000)<1);
 assert.ok(d.eligibleForSheet);
});
test('Ação saudável recomenda MANTER prêmio atual e não simula nerf',()=>{
 const d=analyzeDecision(action,catalog,{team:2,targetPerPlayer:80000,roi:0,winChance:null});
 assert.equal(d.direction,'MANTER');
 assert.equal(d.recommendedMin,300000);
 assert.equal(d.recommendedMax,360000);
 assert.equal(d.recommendedDelta,0);
 assert.equal(d.recommendedPercent,0);
 assert.equal(d.recommendedPerMember,80000);
});
test('Faltando preço, recomendação não inventa valor nem lucro',()=>{
 const unknown={itens:catalog.itens.filter(x=>x.item!=='COLETE')};
 const d=analyzeDecision(action,unknown,{team:2});
 assert.equal(d.valid,false);
 assert.equal(d.direction,'PENDENTE');
 assert.equal(d.recommendedMin,null);
 assert.equal(d.recommendedMax,null);
 assert.equal(d.recommendedPerMember,null);
});
test('A sugestão aparece na capa, na lista e possui atalho para a aprovação',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../assets/modules/acoes-planejador-ui.js',import.meta.url),'utf8');
 for(const k of ['apSuggestedMain','apQuickMetrics','apStrategyDetails'])assert.ok(html.includes('id="'+k+'"'),k);
 assert.match(ui,/function showMainRecommendation/);
 assert.match(ui,/showMainRecommendation\(d\)/);
 assert.match(ui,/data-ap-action/);
 assert.match(ui,/SUGESTÃO/);
 assert.match(ui,/RECOMENDADO \(MÍNIMO\)/);
 assert.match(ui,/id="apOpenStrategy"/);
 assert.match(ui,/details\.open=true/);
 assert.match(ui,/value=manual\?state\.manualPayout:d\.recommendedMin/);
});

test('Padrão de 40% exige prêmio mais alto para compensar derrotas, sem ser dado observado',()=>{
 const without=analyzeDecision(action,catalog,{team:2,winChance:null});
 const assumed=analyzeDecision(action,catalog,{team:2});
 assert.equal(assumed.winChance,.4);
 assert.equal(assumed.expected,-19700);
 assert.ok(assumed.suggested>without.suggested);
 assert.ok(assumed.recommendedMax>assumed.recommendedMin);
 assert.ok(assumed.remarks.some(x=>x.includes('premissa de gestão')));
});
test('Faixas mínimo e máximo atuais e recomendadas visíveis, inclusive na aprovação',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../assets/modules/acoes-planejador-ui.js',import.meta.url),'utf8');
 assert.ok(html.includes('id="apDecisionPayoutCompare"'));
 assert.ok(html.includes('id="apWinChance" type="number" min="0" max="100" value="40"'));
 assert.ok(html.includes('id="apPortfolioWinChance" min="0" max="100" step="5" value="40"'));
 assert.match(ui,/payoutPair\('ATUAL • SUJO',p.min,p.max\)/);
 assert.match(ui,/payoutPair\('RECOMENDADO • SUJO',d.recommendedMin,d.recommendedMax/);
 assert.match(ui,/officialMax:p.max/);
 assert.match(ui,/proposedMin:value,proposedMax/);
 assert.match(ui,/winChance:d.winChance/);
});
