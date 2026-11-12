import test from 'node:test';
import assert from 'node:assert/strict';
import { fonteDosDados, fonteDoMarcador, fichaDoBot, separarAnuncios, corpoDoAnuncio, postarNoWebhook, caminhoDoEscopo, semIndefinidos, ARTE, COR_ILEGAL } from '../assets/modules/fonte-dados.js';

test('fonte: auto por padrao, forcada pelo api-config', ()=>{
 assert.equal(fonteDosDados({}),'auto');
 assert.equal(fonteDosDados({HIGH_OS_FONTE:'BOT'}),'bot');
 assert.equal(fonteDosDados({HIGH_OS_FONTE:'firestore'}),'firestore');
 assert.equal(fonteDoMarcador(null),'bot','sem marcador continua no bot');
 assert.equal(fonteDoMarcador({fonte:'firestore'}),'firestore');
});

test('ficha do bot vira ficha do painel', ()=>{
 const f=fichaDoBot({group:'Armas01',segment:'ARMAS',location:'Favela X',highOsFaction:'Tropa',responsible:'1 - Ze',status:'ENTREGUE',benefits:{farm:'1,2,3'}});
 assert.equal(f.id,'Armas01');assert.equal(f.qg,'Favela X');assert.equal(f.faccao,'Tropa');
 assert.equal(f.lider,'1 - Ze');assert.equal(f.status,'ATIVA');assert.deepEqual(f.beneficios,{farm:'1,2,3'});
 assert.equal(fichaDoBot({group:'Armas02',status:'DISPONIVEL'}).status,'INATIVA');
});

test('anuncios saem da gravacao da ficha', ()=>{
 const {dados,anuncios}=separarAnuncios({group:'A',anuncioEntrega:{title:'T',description:'corpo'},anuncioRecolhimento:{description:'  '}});
 assert.equal('anuncioEntrega' in dados,false);assert.equal('anuncioRecolhimento' in dados,false);
 assert.equal(anuncios.length,1,'anuncio vazio nao posta');assert.equal(anuncios[0].tipo,'ENTREGA');
 assert.deepEqual(separarAnuncios({group:'B'}).anuncios,[]);
});

test('embed igual ao do bot: cor, rodape, arte do canal', ()=>{
 const {embed,arquivo}=corpoDoAnuncio({tipo:'RECOLHIMENTO',description:'x'},'H | High Season 3',new Date('2026-11-12T12:00:00Z'));
 assert.equal(embed.color,COR_ILEGAL);assert.equal(embed.footer.text,'H | High Season 3');
 assert.equal(embed.image.url,ARTE.RECOLHIMENTO);assert.equal(arquivo,null);
 assert.match(embed.title,/RECOLHIMENTO/);
 const comPrint=corpoDoAnuncio({tipo:'RECOLHIMENTO',description:'x',imageDataUrl:'data:image/png;base64,AAAA'});
 assert.equal(comPrint.arquivo.nome,'evidencia.png');assert.equal(comPrint.embed.image.url,'attachment://evidencia.png');
});

test('webhook: forum recebe post com nome do Group', async()=>{
 const chamadas=[];
 const fetchFn=async(url,o)=>{const b=JSON.parse(o.body);chamadas.push(b);
  return chamadas.length===1?{status:400,ok:false,json:async()=>({code:220001})}:{status:200,ok:true}};
 await postarNoWebhook('https://discord.com/api/webhooks/123/abc',{tipo:'ENTREGA',description:'oi'},{group:'Armas01',fetchFn});
 assert.equal(chamadas.length,2);assert.equal(chamadas[1].thread_name,'ARMAS01');
 await assert.rejects(()=>postarNoWebhook('http://x',{description:'a'},{fetchFn}),/não configurado/);
});

test('escopos e limpeza para o Firestore', ()=>{
 assert.deepEqual(caminhoDoEscopo('users'),['users']);
 assert.deepEqual(caminhoDoEscopo('historico'),['highos','data','historico']);
 assert.throws(()=>caminhoDoEscopo('a/b'));
 class Sentinela{constructor(){this.k=1}}
 const s=new Sentinela();
 const r=semIndefinidos({a:undefined,b:[1,undefined],c:{d:undefined,e:2},t:s});
 assert.deepEqual(Object.keys(r).sort(),['b','c','t']);assert.deepEqual(r.b,[1,null]);assert.equal(r.t,s,'sentinela passa inteira');
});
