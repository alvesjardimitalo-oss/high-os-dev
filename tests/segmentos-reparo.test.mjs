import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../assets/modules/segmentos-reparo.js',import.meta.url),'utf8');
const {segmentKeyFor,categoryGroupType,planLegacyCategoryRecovery}=await import('data:text/javascript,'+encodeURIComponent(src));
const categories=[{nome:'APOIO'},{nome:'HOSPITAL ILEGAL'},{nome:'MECÂNICA ILEGAL'},{nome:'DROGAS'}];
const groups=[
 {group:'IlegalMedic01',segmento:'APOIO',faccao:'Hospital Norte'},
 {group:'IlegalMedic2',segmento:'APOIO',faccao:''},
 {group:'IlegalMechanic01',segmento:'APOIO',faccao:'Nova Era'},
 {group:'IlegalMechanic02',segmento:'APOIO',faccao:'Oficina Dois'},
 {group:'IlegalMecanic01',segmento:'APOIO',faccao:''},
 {group:'Armas04',segmento:'ARMAS'},
 {group:'Manicomio',segmento:'DROGAS'}
];
test('Identifica ambas famílias de Groups sem depender de acentos ou caixa',()=>{
 assert.equal(categoryGroupType('IlegalMedic2'),'hospital');
 assert.equal(categoryGroupType('IlegalMechanic02'),'mecanica');
 assert.equal(categoryGroupType('IlegalMecanic01'),'mecanica');
 assert.equal(categoryGroupType('Armas04'),null);
 assert.equal(segmentKeyFor('MECÂNICA ILEGAL'),'MECANICAILEGAL');
});
test('Recupera uma única vez Hospital/Mecânica sem tocar Armas, Drogas ou outros',()=>{
 const plan=planLegacyCategoryRecovery(groups,categories,{});
 assert.deepEqual(plan.mark,['mecanica','hospital']);
 assert.deepEqual(plan.changes.map(x=>x.group),groups.slice(0,5).map(x=>x.group));
 assert.equal(plan.changes.find(x=>x.group==='IlegalMedic2').to,'HOSPITAL ILEGAL');
 assert.equal(plan.changes.find(x=>x.group==='IlegalMechanic02').to,'MECÂNICA ILEGAL');
});
test('Marcador impede futuras reversões automáticas e preserva a escolha do gestor',()=>{
 const plan=planLegacyCategoryRecovery(groups,categories,{mecanica:true,hospital:true});
 assert.equal(plan.changes.length,0);
 assert.equal(plan.mark.length,0);
});
test('Não altera segmento personalizado que já está definido',()=>{
 const assigned=groups.map(g=>g.group==='IlegalMechanic01'?{...g,segmento:'MECÂNICA ILEGAL'}:g);
 const plan=planLegacyCategoryRecovery(assigned,categories,{});
 assert.equal(plan.changes.some(c=>c.group==='IlegalMechanic01'),false);
});
test('Sem a categoria criada no Firestore não inventa uma nem modifica o Group',()=>{
 const plan=planLegacyCategoryRecovery(groups,[{nome:'APOIO'}],{});
 assert.equal(plan.changes.length,0);
 assert.equal(plan.mark.length,0);
});
test('Se somente Hospital foi criado, não migra Mecânica e respeita demais registros',()=>{
 const plan=planLegacyCategoryRecovery(groups,[{nome:'APOIO'},{nome:'HOSPITAL ILEGAL'}],{});
 assert.deepEqual(plan.mark,['hospital']);
 assert.deepEqual(plan.changes.map(x=>x.group),['IlegalMedic01','IlegalMedic2']);
});
test('Rotina antiga de coerção foi removida e receituário reconhece o novo nome',()=>{
 const app=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
 assert.doesNotMatch(app,/applyCoreSegmentMap|SEGMENTOS_PADRAO_V813/);
 assert.match(app,/repairLegacyIllegalCategories/);
 assert.match(app,/recuperacaoCategoriasV1566/);
 assert.match(app,/segmentKeyFor\(fresh\.data\(\)\?\.segmento\)!=='APOIO'/);
 assert.match(app,/mecanicailegal/);
 assert.doesNotMatch(app,/mecanicaillegal/);
});
