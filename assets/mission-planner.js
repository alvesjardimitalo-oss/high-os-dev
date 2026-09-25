/* HIGH OS Planejador de Eventos V9.5.2 — Evento > Zonas + Replicador Inteligente */
(() => {
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  /* V12.5 - nomes de evento/zona vem do Firestore e sao digitados pela equipe:
     tudo que entra em innerHTML ou popup do Leaflet passa por aqui. */
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const STORE='highos_mission_planner_v832_missions';
  const ACTIVE='highos_mission_planner_v832_active';
  const DB_NAME='highos_mission_planner_v832';
  const SNAP_STORE='snapshots';

  const DOMINACAO_30=[
    [126.19,
-455.65,
42.21,
175.75],
[333.39,
-476.59,
43.17,
167.25],
[529.8,
-542.94,
24.8,
138.9],
[710.96,
-647.32,
35.87,
150.24],
[869.03,
-781.43,
40.47,
116.23],
[987.45,
-956.33,
42.07,
90.71],
[1074.23,
-1147.33,
26.05,
119.06],
[1109.81,
-1354.03,
29.39,
28.35],
[1111.85,
-1559.48,
34.9,
187.09],
[1074.22,
-1765.37,
35.72,
226.78],
[989.25,
-1956.43,
30.75,
209.77],
[866.31,
-2125.47,
30.55,
206.93],
[709.38,
-2267.73,
27.47,
76.54],
[530.71,
-2368.62,
5.95,
331.66],
[331.17,
-2434.32,
8.41,
331.66],
[127.86,
-2458.49,
6,
328.82],
[-84.75,
-2434.49,
6,
243.78],
[-272.95,
-2388.94,
6,
238.12],
[-456.03,
-2263.83,
8.51,
314.65],
[-619.97,
-2125.47,
6,
311.82],
[-742.78,
-1956.27,
8.16,
308.98],
[-830.2,
-1765.22,
37.32,
130.4],
[-900.97,
-1534.72,
5.02,
42.52],
[-837.92,
-1333.78,
5,
25.52],
[-827.89,
-1147.33,
7.55,
263.63],
[-742.68,
-956.36,
17.54,
266.46],
[-616.24,
-787.42,
25.09,
274.97],
[-464.72,
-647.32,
32.2,
87.88],
[-282.97,
-545.43,
29.28,
308.98],
[-84.75,
-478.19,
34.07,
334.49]
  ];
  const FACXFAC_25=[
    [2047.19,
4793.20,
41.72,
337.33],
[2077.90,
5222.43,
55.76,
124.73],
[2644.07,
5300.08,
44.15,
90.71],
[2944.20,
4902.62,
102.85,
102.05],
[2571.17,
4494.00,
36.90,
195.60],
[3255.45,
4483.96,
130.64,
170.08],
[2609.66,
3990.06,
41.52,
170.08],
[3316.00,
4028.01,
154.98,
121.89],
[3011.48,
3606.78,
71.16,
28.35],
[2814.98,
3226.52,
54.12,
87.88],
[2473.34,
3344.27,
50.21,
85.04],
[2395.52,
3022.16,
47.94,
119.06],
[2013.88,
3232.94,
43.69,
331.66],
[1900.16,
2821.05,
45.95,
42.52],
[1438.86,
2946.04,
44.74,
39.69],
[847.47,
3047.33,
41.40,
48.19],
[1378.44,
3462.31,
34.51,
337.33],
[718.54,
3560.48,
33.40,
334.49],
[-52.68,
3705.38,
36.21,
343.00],
[-259.45,
4184.54,
62.23,
257.96],
[203.94,
4418.76,
71.81,
204.10],
[728.34,
4295.90,
67.30,
218.27],
[1475.68,
4942.80,
76.04,
226.78],
[1240.82,
4393.51,
39.98,
138.90],
[711.38,
4711.51,
117.06,
201.26]
  ];

  const FACXFAC_SUL_CASSINO_25=[
    [339.20,
-242.94,
53.92,
161.58],
[497.54,
-118.50,
61.13,
229.61],
[341.33,
36.93,
89.89,
79.38],
[503.29,
104.06,
96.30,
59.53],
[790.90,
-107.32,
80.42,
65.20],
[648.68,
-12.07,
82.60,
221.11],
[501.28,
-357.41,
43.15,
141.74],
[857.94,
-325.51,
60.52,
164.41],
[730.53,
-467.26,
16.82,
164.41],
[760.79,
-705.41,
28.49,
184.26],
[558.64,
-790.44,
11.09,
178.59],
[507.35,
-631.81,
24.75,
175.75],
[395.99,
-884.87,
29.42,
175.75],
[308.56,
-729.71,
29.32,
195.60],
[278.11,
-589.13,
43.30,
175.75],
[180.35,
-855.66,
30.94,
172.92],
[175.55,
-412.31,
41.15,
172.92],
[86.11,
-673.27,
31.64,
150.24],
[-38.08,
-508.43,
32.65,
79.38],
[-21.57,
-320.65,
45.49,
249.45],
[668.48,
-253.63,
44.75,
354.34],
[-61.42,
-90.94,
57.78,
246.62],
[100.74,
-3.59,
68.09,
226.78],
[130.37,
-206.92,
54.53,
303.31],
[205.79,
164.27,
105.48,
0.00]
  ];
  const FACXFAC_SUL_CEMITERIO_25=[
    [-1480.45,
197.56,
56.67,
107.72],
[-1315.17,
292.78,
64.67,
153.08],
[-1087.63,
336.72,
66.86,
306.15],
[-940.72,
177.37,
66.00,
104.89],
[-791.24,
58.67,
50.31,
99.22],
[-877.22,
-156.40,
37.66,
79.38],
[-1005.16,
-312.81,
37.86,
116.23],
[-742.64,
-317.43,
36.43,
150.24],
[-789.59,
-640.07,
28.91,
175.75],
[-988.14,
-639.19,
24.25,
189.93],
[-935.86,
-822.64,
15.20,
189.93],
[-1205.96,
-686.59,
40.36,
5.67],
[-1255.29,
-960.52,
2.61,
150.24],
[-1429.42,
-787.66,
21.96,
215.44],
[-1648.25,
-971.98,
7.70,
68.04],
[-1363.89,
-565.80,
30.13,
48.19],
[-1722.42,
-718.11,
10.09,
300.48],
[-1596.96,
-552.42,
34.81,
8.51],
[-1806.60,
-500.47,
39.71,
260.79],
[-1889.20,
-280.31,
49.32,
246.62],
[-2135.02,
-305.49,
13.19,
246.62],
[-1689.98,
-326.20,
50.09,
280.63],
[-1580.21,
-130.82,
55.82,
82.21],
[-1676.53,
69.51,
63.91,
85.04],
[-1225.30,
-126.56,
41.62,
311.82]
  ];

  const presets=[
    {id:'dominacao-sul',
name:'Dominação — Sul',
event:'Dominação',
panel:'/ilegal',
mode:'assistant',
center:{x:116.48,
y:-457.27,
z:481.13,
h:212.6,
label:'Centro / área do evento'},
radius:1000,
points:DOMINACAO_30},

    {id:'facxfac-norte',
eventId:'preset_gas_fac-x-fac',
name:'Norte - Mar Alamo',
event:'Fac x Fac',
category:'gas',
panel:'/ilegal',
mode:'assistant',
center:{x:1692.36,
y:4040.85,
z:281.98,
h:22.68,
label:'Centro do Gás / Marco Zero'},
radius:1000,
points:FACXFAC_25},

    {id:'facxfac-sul-cassino-banco',
eventId:'preset_gas_fac-x-fac',
name:'Sul - Cassino / Banco Central',
event:'Fac x Fac',
category:'gas',
panel:'/ilegal',
mode:'assistant',
center:{x:351.53,
y:-357.41,
z:0.00,
h:0.00,
label:'Centro do Gás / Marco Zero'},
radius:1000,
points:FACXFAC_SUL_CASSINO_25},

    {id:'facxfac-sul-cemiterio-praia',
eventId:'preset_gas_fac-x-fac',
name:'Sul - Cemitério / Praia',
event:'Fac x Fac',
category:'gas',
panel:'/ilegal',
mode:'assistant',
center:{x:-1422.15,
y:-287.28,
z:46.25,
h:133.23,
label:'Centro do Gás / Marco Zero'},
radius:1000,
points:FACXFAC_SUL_CEMITERIO_25},

    {id:'facxfac-cayo-perico',
eventId:'preset_gas_fac-x-fac',
name:'Cayo Perico',
event:'Fac x Fac',
category:'gas',
panel:'/ilegal',
mode:'assistant',
center:{x:4787.64,
y:-5150.00,
z:0.00,
h:351.50,
label:'Centro do Gás / Marco Zero'},
radius:1000,
points:[]}
  ];

  const state={map:null,
drawn:[],
missions:[],
activeId:null,
initialized:false,
placing:false,
snapshotTimer:null,
autosaveTimer:null,
editing:false,
editBackup:null,
dirty:false,
libraryCategory:'dominacao',
activeEventId:null,
activeMapName:null,
workspaceOpen:false,
cloudState:'local',
mapMode:'center',safeEditorStage:0,safePlacementStage:null,safePlacementAsOption:false,polygonPlacement:false,layerVisibility:{zone:true,spawns:true,center:true,access:false},proToolsReady:false,undoStack:[],redoStack:[],lastEditSnapshot:null,compareOverlay:false,safePresentation:false,safePresentationPrev:null,safeConfigView:false,safePreviewModel:null,safePreviewElapsed:0,safePreviewPlaying:false,safePreviewSpeed:1,safeTestPlayer:null,safeTestPlayerMarker:null,zoneProposal:null,safeHoverMarker:null,cloudMeta:{updatedAtText:'',updatedBy:''}};
  const f=n=>Number(n).toFixed(2);
  const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
  const nowIso=()=>new Date().toISOString();
  const uid=()=>`m_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const ll=(x,y)=>L.latLng(Number(y),Number(x));
  const active=()=>state.missions.find(m=>m.id===state.activeId)||null;
  const eventUid=()=>`e_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const activeEventId=()=>active()?.eventId||state.activeEventId||null;
  const zonesOfEvent=(eventId)=>state.missions.filter(m=>m.eventId===eventId);
  const mapNameOf=(m)=>m?.mapName||'Mapa Principal';
  const mapsOfEvent=(eventId)=>[...new Set(zonesOfEvent(eventId).map(mapNameOf))];
  const zonesOfMap=(eventId,mapName)=>zonesOfEvent(eventId).filter(m=>mapNameOf(m)===mapName);
  const eventsOfCategory=(category)=> {
    const seen=new Map();
    state.missions.filter(m=>(m.category||'dominacao')===category).forEach(m=>{
      if(!seen.has(m.eventId)) seen.set(m.eventId,{id:m.eventId,
name:m.event||'Evento sem nome',
category:m.category||category,
panel:m.panel||'/ilegal'});
    });
    return [...seen.values()];
  };
  function slugify(s){return String(s||'evento').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'evento';}
  function normalizeZoneGeometry(m){
    if(!m)return false;let changed=false;const cat=m.category||((String(m.event||'').toLowerCase().includes('domina'))?'dominacao':'gas');
    if(cat==='dominacao'){if(!Array.isArray(m.zonePolygon)){m.zonePolygon=[];changed=true;}if(m.zoneMode!=='radius'&&m.zoneMode!=='polygon'){m.zoneMode=m.zonePolygon.filter(p=>validCoord(p?.x)&&validCoord(p?.y)).length>=3?'polygon':'radius';changed=true;}}
    return changed;
  }
  function inferLegacyStructure(m){
    normalizeZoneGeometry(m);if(m.eventId)return;
    const cat=m.category||((String(m.event||'').toLowerCase().includes('domina'))?'dominacao':'gas');
    const name=String(m.name||'').trim(),
 evt=String(m.event||'').trim();
    let eventName=evt||name||'Evento';
    let zoneName=name||'Zona Principal';
    if(cat==='dominacao' && /^domina/i.test(evt||'') && /[—-]/.test(name)){
      const parts=name.split(/\s*[—-]\s*/).filter(Boolean);
      if(parts.length>=2){eventName=`Dominação ${parts.slice(1).join(' ')}`;zoneName='Zona Principal';}
      else {eventName=name;zoneName='Zona Principal';}
    } else if(cat==='gas' && /[—-]/.test(name) && evt && name.toLowerCase().startsWith(evt.toLowerCase())){
      const rest=name.slice(evt.length).replace(/^\s*[—-]\s*/,'').trim();
      eventName=evt;zoneName=rest||'Zona Principal';
    } else if(name && evt && name!==evt && !name.toLowerCase().includes('clone')){
      eventName=evt;zoneName=name;
    } else {
      eventName=evt||name||'Evento'; zoneName='Zona Principal';
    }
    m.event=eventName;
    m.name=zoneName;
    m.eventId=`legacy_${cat}_${slugify(eventName)}`;
    m.requestKind=m.requestKind||(m.official?'alter-zone':'create-zone');normalizeZoneGeometry(m);
  }

  function dominationPolygon(m){return (m?.category||'dominacao')==='dominacao'&&Array.isArray(m?.zonePolygon)?m.zonePolygon.filter(p=>validCoord(p?.x)&&validCoord(p?.y)):[];}
  function dominationZoneMode(m){if((m?.category||'dominacao')!=='dominacao')return 'radius';const p=dominationPolygon(m);return m?.zoneMode||(p.length>=3?'polygon':'radius');}
  function activeDominationPolygon(m){return dominationZoneMode(m)==='polygon'?dominationPolygon(m):[];}
  function polygonArea(points){if(!points||points.length<3)return 0;let a=0;for(let i=0,j=points.length-1;i<points.length;j=i++)a+=Number(points[j].x)*Number(points[i].y)-Number(points[i].x)*Number(points[j].y);return Math.abs(a)/2;}
  function polygonPerimeter(points){if(!points||points.length<2)return 0;let d=0;for(let i=0;i<points.length;i++)d+=distXY(points[i],points[(i+1)%points.length]);return d;}
  function polygonCentroid(points){if(!points?.length)return null;if(points.length<3){const x=points.reduce((a,p)=>a+Number(p.x),0)/points.length,y=points.reduce((a,p)=>a+Number(p.y),0)/points.length;return {x,y};}let a=0,cx=0,cy=0;for(let i=0;i<points.length;i++){const p=points[i],q=points[(i+1)%points.length],cross=Number(p.x)*Number(q.y)-Number(q.x)*Number(p.y);a+=cross;cx+=(Number(p.x)+Number(q.x))*cross;cy+=(Number(p.y)+Number(q.y))*cross;}a*=.5;if(Math.abs(a)<1e-7)return {x:points.reduce((v,p)=>v+Number(p.x),0)/points.length,y:points.reduce((v,p)=>v+Number(p.y),0)/points.length};return {x:cx/(6*a),y:cy/(6*a)};}
  function dominationAnalysisCenter(m){const p=activeDominationPolygon(m),c=p.length>=3?polygonCentroid(p):null;return c||(validCoord(m?.center?.x)&&validCoord(m?.center?.y)?{x:Number(m.center.x),y:Number(m.center.y)}:null);}

  function dominationZoneGeometry(m){const p=dominationPolygon(m),raw=Array.isArray(m?.zonePolygon)?m.zonePolygon:[],mode=m?.zoneMode||(p.length>=3?'polygon':'radius');if(mode==='polygon'&&raw.some(v=>!validCoord(v?.x)||!validCoord(v?.y)))return {mode:'polygon-invalid',vertices:p.length,area:null,perimeter:null};if(mode==='polygon'&&p.length<3)return {mode:'polygon-incomplete',vertices:p.length,area:null,perimeter:null};if(mode!=='polygon')return {mode:'radius',vertices:0,area:Math.PI*Math.pow(effectiveEventRadius(m),2),perimeter:2*Math.PI*effectiveEventRadius(m)};return {mode:'polygon',vertices:p.length,area:polygonArea(p),perimeter:polygonPerimeter(p)};}
  function orient2d(a,b,c){return (Number(b.y)-Number(a.y))*(Number(c.x)-Number(b.x))-(Number(b.x)-Number(a.x))*(Number(c.y)-Number(b.y));}
  function segmentCross(a,b,c,d){const eps=1e-7,o1=orient2d(a,b,c),o2=orient2d(a,b,d),o3=orient2d(c,d,a),o4=orient2d(c,d,b),on=(p,q,r)=>Math.abs(orient2d(p,q,r))<=eps&&Number(r.x)>=Math.min(Number(p.x),Number(q.x))-eps&&Number(r.x)<=Math.max(Number(p.x),Number(q.x))+eps&&Number(r.y)>=Math.min(Number(p.y),Number(q.y))-eps&&Number(r.y)<=Math.max(Number(p.y),Number(q.y))+eps;if(((o1>eps&&o2<-eps)||(o1<-eps&&o2>eps))&&((o3>eps&&o4<-eps)||(o3<-eps&&o4>eps)))return true;return (Math.abs(o1)<=eps&&on(a,b,c))||(Math.abs(o2)<=eps&&on(a,b,d))||(Math.abs(o3)<=eps&&on(c,d,a))||(Math.abs(o4)<=eps&&on(c,d,b));}
  function polygonSelfIntersections(points){const hits=[];if(!points||points.length<4)return hits;for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];for(let j=i+1;j<points.length;j++){if(j===i||j===(i+1)%points.length||(i===0&&j===points.length-1))continue;const c=points[j],d=points[(j+1)%points.length];if(segmentCross(a,b,c,d))hits.push([i+1,j+1]);}}return hits;}
  function dominationPolygonAudit(m){
    const raw=Array.isArray(m?.zonePolygon)?m.zonePolygon:[],indexed=raw.map((v,i)=>({v,i})).filter(x=>validCoord(x.v?.x)&&validCoord(x.v?.y)),p=indexed.map(x=>x.v),findings=[];
    const add=(level,message,action)=>findings.push({level,message,action});
    const pack=metrics=>({issues:findings.filter(x=>x.level==='BLOQUEIO').map(x=>x.message),warns:findings.filter(x=>x.level!=='BLOQUEIO'&&x.level!=='OK').map(x=>x.message),findings,metrics});
    if(!raw.length)return pack(null);
    const invalid=raw.map((v,i)=>({v,i})).filter(x=>!validCoord(x.v?.x)||!validCoord(x.v?.y)),pendingZ=raw.map((v,i)=>({v,i})).filter(x=>validCoord(x.v?.x)&&validCoord(x.v?.y)&&(!validCoord(x.v?.z)||x.v?.status!=='validated'));
    if(invalid.length)add('BLOQUEIO','CDS inválida(s) no polígono: '+invalid.map(x=>String(x.i+1).padStart(2,'0')).join(', ')+'.','Corrija X/Y dessas CDS. O sistema não deve unir os vértices vizinhos atravessando um ponto inválido.');
    if(pendingZ.length)add('ATENÇÃO','Vértice(s) pendente(s) de validação real no FiveM: '+pendingZ.map(x=>String(x.i+1).padStart(2,'0')).join(', ')+'.','Cole a CDS real X/Y/Z coletada no jogo e valide cada vértice antes da implementação.');
    if(p.length<3){add('BLOQUEIO','Polígono incompleto: são necessárias pelo menos 3 CDS válidas para fechar a Zona de Pontuação.','Adicione vértices seguindo a ordem real do contorno.');return pack(null);}
    if(invalid.length){add('ATENÇÃO','Auditoria geométrica suspensa até corrigir todas as CDS com X/Y inválidos.','Mantenha a numeração original e corrija somente as CDS inválidas.');return pack({area:null,perimeter:null,minSide:null,maxSide:null,compactness:null,crossings:null,invalidVertices:invalid.length,pendingZ:pendingZ.length,nearDuplicates:null,geometryDeferred:true});}
    const near=[];for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){const d=distXY(p[i],p[j]);if(d<2)near.push([indexed[i].i+1,indexed[j].i+1,d]);}
    if(near.length)add('BLOQUEIO','Vértices duplicados/quase iguais: '+near.map(x=>String(x[0]).padStart(2,'0')+'↔'+String(x[1]).padStart(2,'0')+' ('+x[2].toFixed(1)+'m)').join(', ')+'.','Confirme no mapa qual CDS representa o contorno correto; não remova ou mova automaticamente.');
    const sides=p.map((v,i)=>distXY(v,p[(i+1)%p.length])),area=polygonArea(p),perimeter=polygonPerimeter(p),minSide=Math.min(...sides),maxSide=Math.max(...sides),meanSide=sides.reduce((x,y)=>x+y,0)/sides.length,sideStd=Math.sqrt(sides.reduce((x,y)=>x+Math.pow(y-meanSide,2),0)/sides.length),sideCv=meanSide?sideStd/meanSide:0,cross=polygonSelfIntersections(p),compactness=perimeter>0?(4*Math.PI*area)/(perimeter*perimeter):0;
    const xs=p.map(v=>Number(v.x)),ys=p.map(v=>Number(v.y)),width=Math.max(...xs)-Math.min(...xs),height=Math.max(...ys)-Math.min(...ys),shortAxis=Math.max(1,Math.min(width,height)),longAxis=Math.max(width,height),aspectRatio=longAxis/shortAxis;
    const hullArea=(()=>{const pts=p.map(v=>({x:Number(v.x),y:Number(v.y)})).sort((x,y)=>x.x-y.x||x.y-y.y);if(pts.length<3)return area;const cr=(o,x,y)=>(x.x-o.x)*(y.y-o.y)-(x.y-o.y)*(y.x-o.x),lo=[],up=[];pts.forEach(q=>{while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q);});for(let i=pts.length-1;i>=0;i--){const q=pts[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q);}return polygonArea(lo.slice(0,-1).concat(up.slice(0,-1)));})();
    const concavity=hullArea>0?1-area/hullArea:0;
    if(cross.length){const edgeLabel=k=>{const x=indexed[k-1]?.i+1,y=indexed[k%p.length]?.i+1;return String(x).padStart(2,'0')+'→'+String(y).padStart(2,'0');},detail=cross.slice(0,6).map(x=>edgeLabel(x[0])+' × '+edgeLabel(x[1])).join(', ');add('BLOQUEIO','O contorno possui arestas que se cruzam, encostam ou se sobrepõem indevidamente'+(detail?': '+detail:'')+(cross.length>6?' (+'+(cross.length-6)+' conflito(s))':'')+'.','Revise a ordem das CDS ou a posição do vértice indicado; não publique enquanto houver cruzamento.');}
    if(area<10000)add('ALERTA','Área pequena (~'+Math.round(area).toLocaleString('pt-BR')+' m²).','Confira no jogo se há espaço suficiente para movimentação, cobertura e flancos.');
    if(minSide<25)add('ALERTA','Há lado muito curto no contorno (~'+Math.round(minSide)+' m).','Confira se existe CDS redundante, duplicada ou posicionada perto demais da vizinha.');
    if(maxSide>0&&minSide>0&&maxSide/minSide>8)add('ALERTA','Lados muito desproporcionais ('+Math.round(minSide)+'–'+Math.round(maxSide)+' m).','Confira se a ordem das CDS cria um salto grande ou um gargalo não intencional.');
    if(aspectRatio>4)add('ALERTA','Zona muito alongada: proporção aproximada '+aspectRatio.toFixed(1)+':1 ('+Math.round(width)+' × '+Math.round(height)+' m).','Revise se o formato cobre de fato vários quarteirões ou se virou um corredor estreito.');
    if(compactness<.18)add('ALERTA','Formato com baixa compactação ('+(compactness*100).toFixed(0)+'%).','Confira corredores, gargalos e pontas excessivas antes de implementar.');
    if(concavity>.35)add('ALERTA','Contorno muito côncavo: cerca de '+Math.round(concavity*100)+'% da envoltória externa fica recortada.','Verifique se as reentrâncias são intencionais e se não criam bolsões difíceis de entender dentro da cidade.');
    if(sideCv>.85)add('ATENÇÃO','Variação alta entre comprimentos dos lados (CV '+sideCv.toFixed(2)+').','Revise visualmente os trechos muito curtos e muito longos; isso pode indicar CDS fora de ordem.');
    if(!findings.some(x=>x.level==='BLOQUEIO')&&area>=10000&&aspectRatio<=4&&compactness>=.18&&concavity<=.35)add('OK','Geometria estrutural consistente para validação operacional.','Ainda confirme terreno, cobertura, acessos e CDS reais no FiveM antes de publicar.');
    return pack({area,perimeter,minSide,maxSide,meanSide,sideCv,compactness,crossings:cross.length,invalidVertices:invalid.length,pendingZ:pendingZ.length,nearDuplicates:near.length,width,height,aspectRatio,concavity,hullArea,geometryDeferred:false});
  }

  function coverageStats(m){
    if(!m||!validCoord(m.center?.x)||!validCoord(m.center?.y))return null;
    const pts=(m.points||[]).filter(p=>validCoord(p.x)&&validCoord(p.y));
    if(!pts.length)return null;
    let max=-1,
maxIndex=-1,
sum=0;
    pts.forEach((p,i)=>{const d=Math.hypot(Number(p.x)-Number(m.center.x),Number(p.y)-Number(m.center.y));sum+=d;if(d>max){max=d;maxIndex=(m.points||[]).indexOf(p);}});
    const minimum=Math.ceil(max);
    const recommended=Math.ceil((max*1.02)/100)*100;
    return {count:pts.length,
max,
minimum,
recommended,
average:sum/pts.length,
farthestIndex:maxIndex};
  }
  function effectiveEventRadius(m){const saved=Number(m?.eventRadius),
base=Number(m?.circleRadius),
s=coverageStats(m);return Number.isFinite(saved)&&saved>0?saved:(Number.isFinite(base)&&base>0?base:(s?.recommended||1000));}
  function pointDistanceFromCenter(m,p){return Math.hypot(Number(p.x)-Number(m.center.x),Number(p.y)-Number(m.center.y));}
  function pointInsideZone(m,p){if(!m||!p||!validCoord(m.center?.x)||!validCoord(m.center?.y)||!validCoord(p.x)||!validCoord(p.y))return true;return pointDistanceFromCenter(m,p)<=effectiveEventRadius(m);}
  function zoneCoverageCounts(m){const pts=(m?.points||[]).filter(p=>validCoord(p.x)&&validCoord(p.y)),radius=effectiveEventRadius(m),category=m?.category||'dominacao',geom=category==='dominacao'?dominationZoneGeometry(m):null;let inside=0,outside=0,unknown=0;pts.forEach(p=>{if(category==='dominacao'&&geom?.mode==='polygon'){if(pointInPolygon(p,activeDominationPolygon(m)))inside++;else outside++;}else if(category==='dominacao'&&['polygon-incomplete','polygon-invalid'].includes(geom?.mode))unknown++;else if(validCoord(m?.center?.x)&&validCoord(m?.center?.y)&&pointDistanceFromCenter(m,p)<=radius)inside++;else outside++;});return {inside,outside,unknown,total:pts.length,radius,mode:geom?.mode||'radius'};}

  function validCoord(v){return Number.isFinite(Number(v)) && Number(v)!==0;}

  /* ---------------------------------------------------------------
     V9.4.1 - Leitor de CDS tolerante.
     Aceita, entre outros:
       123.4,-56.7,8.9,180
       tpcds 123.4, -56.7, 8.9, 180
       {123.4,-56.7,8.9,180}   vector4(123.4,-56.7,8.9,180)
       [123.4 -56.7 8.9 180]   123.4; -56.7; 8.9; 180
       x=123.4 y=-56.7 z=8.9 h=180
     Retorna {ok,x,y,z,h,motivo}.
  --------------------------------------------------------------- */
  function parseCds(raw){
    let t=String(raw||'').trim();
    if(!t)return {ok:false,
motivo:'Cole a CDS copiada do jogo.'};
    t=t.replace(/^\s*(tpcds|tp|nc|setcoords|coords?)\s*[:=]?\s*/i,'');
    t=t.replace(/vector4|vector3|vec4|vec3/gi,'');
    t=t.replace(/[{}\[\]()]/g,' ');
    t=t.replace(/\b[xyzh]\s*[:=]\s*/gi,' ');
    t=t.replace(/heading|head|rot/gi,' ');
    let nums=t.match(/-?\d+(?:[.,]\d+)?/g)||[];
    let vals=nums.map(v=>Number(String(v).replace(',','.'))).filter(v=>Number.isFinite(v));
    // CDS copiada com vírgula decimal e separador por espaço: "123,45 -456,78 30,10 90"
    if(vals.length<2){nums=t.replace(/(\d),(\d)/g,'$1.$2').match(/-?\d+(?:\.\d+)?/g)||[];vals=nums.map(Number).filter(Number.isFinite);}
    if(vals.length<2)return {ok:false,
motivo:'Nao encontrei X e Y na CDS colada.'};
    const [x,
y,
z,
h]=vals;
    return {
      ok:true,

      x,
y,

      z:Number.isFinite(z)?z:null,

      h:Number.isFinite(h)?h:null,

      total:vals.length
    };
  }
  function cdsProblemas(r,{exigeZ=true,
exigeH=true}={}){
    const out=[];
    if(!validCoord(r.x)||!validCoord(r.y))out.push('X e Y precisam ser numeros diferentes de zero.');
    if(exigeZ&&!validCoord(r.z))out.push('Z ausente ou igual a zero - va ate o local no jogo e copie a CDS real.');
    if(exigeH&&r.h===null)out.push('Heading ausente.');
    if(r.h!==null&&(r.h<-360||r.h>360))out.push('Heading fora da faixa -360..360.');
    return out;
  }
  function distXY(a,b){return Math.hypot(Number(b.x)-Number(a.x),Number(b.y)-Number(a.y));}
  function nextPendingId(m,fromId=0){
    if(!m||!m.points?.length)return 0;
    for(let i=fromId;i<m.points.length;i++)if(!isValidated(m.points[i]))return i+1;
    for(let i=0;i<fromId;i++)if(!isValidated(m.points[i]))return i+1;
    return 0;
  }
  function isValidated(p){return p?.status==='validated' && validCoord(p.x) && validCoord(p.y) && validCoord(p.z) && Number.isFinite(Number(p.h));}
  function isCenterValidated(m){const c=m?.center;return c?.status==='validated' && validCoord(c.x) && validCoord(c.y) && validCoord(c.z) && Number.isFinite(Number(c.h));}
  function normalizeCenter(m){if(!m?.center)return;const c=m.center;const complete=validCoord(c.x)&&validCoord(c.y)&&validCoord(c.z)&&Number.isFinite(Number(c.h));if(!c.status){c.status=complete?'validated':'planned';c.validatedAt=complete?(c.validatedAt||nowIso()):null;}else if(c.status==='planned'&&complete&&!c.validationReason){/* migração: clones antigos perdiam a validação apenas ao trocar de categoria */c.status='validated';c.validatedAt=c.validatedAt||nowIso();}}
  function normalizePoint(p,i,statusDefault='planned'){
    return {id:i+1,
x:num(p.x),
y:num(p.y),
z:num(p.z),
h:num(p.h),
status:p.status||statusDefault,
validatedAt:p.validatedAt||null};
  }
  function presetMission(p){
    const category=p.category||(p.event==='Dominação'?'dominacao':'gas');
    let eventName=p.event,
 zoneName=p.name;
    if(category==='dominacao' && /Sul/i.test(p.name)){eventName='Dominação Sul';zoneName='Zona Principal';}
    if(category==='gas' && /Fac x Fac/i.test(p.event||p.name) && !p.eventId){eventName='Fac x Fac';zoneName=(/Norte/i.test(p.name)?'Norte':'Zona Principal');}
    return {id:p.id,
eventId:p.eventId||`preset_${category}_${slugify(eventName)}`,
mapName:p.mapName||'Mapa Principal',
name:zoneName,
event:eventName,
panel:p.panel,
mode:p.mode,
category,
center:{...p.center,
status:'validated',
validatedAt:nowIso()},
circleRadius:p.radius,
eventRadius:null,
startAngle:0,
spawnRadius:100,
createdAt:nowIso(),
updatedAt:nowIso(),
points:p.points.map((v,i)=>normalizePoint({x:v[0],
y:v[1],
z:v[2],
h:v[3],
status:'validated',
validatedAt:nowIso()},i,'validated')),
requestText:'',
requestKind:'alter-zone',
official:true};
  }
  function newMission(eventId=null,eventName=null,category=null){
    const cat=category||state.libraryCategory||'dominacao';
    return {id:uid(),
eventId:eventId||eventUid(),
mapName:'Mapa Principal',
name:'Zona Principal',
event:eventName||(cat==='gas'?'Novo Evento de Gás':'Novo Evento de Dominação'),
panel:'/ilegal',
mode:'assistant',
category:cat,
center:{x:null,
y:null,
z:null,
h:null,
label:cat==='gas'?'Centro do Gás / Marco Zero':'Centro da Zona do Evento',
status:'planned',
validatedAt:null},
circleRadius:1000,
eventRadius:null,
startAngle:0,
spawnRadius:100,
createdAt:nowIso(),
updatedAt:nowIso(),
points:[],
requestText:'',
requestKind:eventId?'create-zone':'create-event',
official:false,zoneMode:cat==='dominacao'?'radius':null,zonePolygon:[]};
  }

  function normalizeText(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
  function repairKnownZoneAssignments(){
    // Corrige migração V8: a antiga missão "Hoje é dia de Guerra - Zona Cemiterio Praia"
    // deve ser uma ZONA dentro do evento "Hoje é Dia de Guerra", e não um evento separado.
    const gas=state.missions.filter(m=>(m.category||'dominacao')==='gas');
    const candidates=gas.filter(m=>{
      const t=normalizeText(`${m.event||''} ${m.name||''}`);
      return t.includes('hoje')&&t.includes('dia')&&t.includes('guerra')&&t.includes('cemiterio')&&t.includes('praia');
    });
    if(!candidates.length)return;
    const existing=gas.find(m=>{
      const e=normalizeText(m.event||'');
      const z=normalizeText(m.name||'');
      return e.includes('hoje')&&e.includes('dia')&&e.includes('guerra')&&!e.includes('cemiterio')&&!e.includes('praia')&&!z.includes('cemiterio');
    });
    const targetEventId=existing?.eventId||'legacy_gas_hoje-e-dia-de-guerra';
    const targetEventName=existing?.event||'Hoje é Dia de Guerra';
    candidates.forEach(m=>{
      m.eventId=targetEventId;
      m.event=targetEventName;
      m.name='Cemitério / Praia';
      if(!m.requestKind||m.requestKind==='create-event')m.requestKind='create-zone';
      m.updatedAt=nowIso();
    });
  }

  function repairFacxFacHierarchy(){
    const all=state.missions.filter(m=>normalizeText(m.event||'').includes('fac x fac')||normalizeText(m.event||'').includes('facxfac'));
    if(!all.length)return false;
    let changed=false;
    const target='preset_gas_fac-x-fac';
    // Migra as versões 9.2.8–9.3.0: qualquer cenário/subnível vira uma ZONA normal na coluna da direita.
    const legacySul=all.find(m=>m.id==='facxfac-sul');
    if(legacySul?.facxfacScenarios?.length){
      legacySul.facxfacScenarios.forEach((sc,i)=>{
        const id=i===0?'facxfac-sul-cassino-banco':'facxfac-sul-cemiterio-praia';
        if(!state.missions.some(x=>x.id===id)){
          const z=JSON.parse(JSON.stringify(legacySul));z.id=id;z.eventId=target;z.event='Fac x Fac';z.category='gas';z.name=i===0?'Sul - Cassino / Banco Central':'Sul - Cemitério / Praia';z.center=JSON.parse(JSON.stringify(sc.center));z.points=JSON.parse(JSON.stringify(sc.points||[]));delete z.facxfacScenarios;delete z.activeScenario;delete z.mapName;state.missions.push(z);changed=true;
        }
      });
    }
    state.missions=state.missions.filter(m=>m.id!=='facxfac-sul');
    const rename={
      'facxfac-norte':'Norte - Mar Alamo',

      'facxfac-sul-cassino-banco':'Sul - Cassino / Banco Central',

      'facxfac-sul-cemiterio-praia':'Sul - Cemitério / Praia',

      'facxfac-cayo-perico':'Cayo Perico'
    };
    state.missions.forEach(m=>{if(rename[m.id]){if(m.eventId!==target||m.event!=='Fac x Fac'||m.name!==rename[m.id]||m.mapName||m.facxfacScenarios){m.eventId=target;m.event='Fac x Fac';m.name=rename[m.id];m.category='gas';delete m.mapName;delete m.facxfacScenarios;delete m.activeScenario;changed=true;}}});
    // Recuperação V10.98.2: migração nunca apaga registros. Duplicatas/legados
    // permanecem disponíveis até uma revisão explícita do usuário.
    return changed;
  }

  const SAVED_AT='highos_mission_planner_saved_at';
  const BACKUPS='highos_mission_planner_backups';
  const MAX_BACKUPS=8;

  /* V9.4.2 - guarda as ultimas versoes da lista de missoes neste navegador.
     Serve de rede de seguranca contra qualquer perda (sincronizacao, limpeza
     de cache, erro de edicao). Nunca apaga sozinho alem do rodizio. */
  function pushBackup(missions){
    try{
      if(!Array.isArray(missions)||!missions.length)return;
      const lista=JSON.parse(localStorage.getItem(BACKUPS)||'[]');
      const corpo=JSON.stringify(missions);
      if(lista[0]&&lista[0].corpo===corpo)return;          // nada mudou
      lista.unshift({at:new Date().toISOString(),
qtd:missions.length,
corpo});
      while(lista.length>MAX_BACKUPS)lista.pop();
      localStorage.setItem(BACKUPS,JSON.stringify(lista));
    }catch(e){
      // cota cheia: descarta o backup mais antigo e tenta de novo uma vez
      try{
        const lista=JSON.parse(localStorage.getItem(BACKUPS)||'[]').slice(0,3);
        localStorage.setItem(BACKUPS,JSON.stringify(lista));
      }catch(e2){}
    }
  }
  function readBackups(){
    try{return JSON.parse(localStorage.getItem(BACKUPS)||'[]')}catch(e){return []}
  }
  /* Fusão multi-PC: adiciona zonas novas e resolve a mesma zona pela versão
     mais recente. Em empate com conteúdo diferente, preserva o local e registra conflito. */
  function missionComparable(m){const x=JSON.parse(JSON.stringify(m||{}));delete x._syncConflict;return JSON.stringify(x);}
  function missionTime(m){const t=Date.parse(m?.updatedAt||'');return Number.isFinite(t)?t:0;}
  function mergeMissions(entrada=[]){
    const result={added:0,updated:0,keptLocal:0,conflicts:[]};
    if(!Array.isArray(entrada)||!entrada.length)return result;
    const chave=m=>`${String(m.eventId||'')}|${normalizeText(m.name||'')}`;
    entrada.forEach(raw=>{
      if(!raw||!raw.id)return;
      const m=JSON.parse(JSON.stringify(raw));normalizeCenter(m);if(!m.category)m.category=(String(m.event||'').toLowerCase().includes('domina')?'dominacao':'gas');inferLegacyStructure(m);
      let idx=state.missions.findIndex(x=>x.id===m.id);if(idx<0)idx=state.missions.findIndex(x=>chave(x)===chave(m));
      if(idx<0){state.missions.push(m);result.added++;return;}
      const local=state.missions[idx];if(missionComparable(local)===missionComparable(m))return;
      const lt=missionTime(local),rt=missionTime(m);
      if(rt>lt){state.missions[idx]=m;result.updated++;result.conflicts.push({id:m.id,name:m.name,resolution:'firebase',localAt:local.updatedAt||'',remoteAt:m.updatedAt||''});}
      else if(lt>rt){result.keptLocal++;result.conflicts.push({id:local.id,name:local.name,resolution:'local',localAt:local.updatedAt||'',remoteAt:m.updatedAt||''});}
      else{local._syncConflict={at:nowIso(),remote:m};result.keptLocal++;result.conflicts.push({id:local.id,name:local.name,resolution:'manual',localAt:local.updatedAt||'',remoteAt:m.updatedAt||''});}
    });
    if(result.added||result.updated){state.applyingCloud=true;try{saveStore();}finally{state.applyingCloud=false;}render();}
    return result;
  }

  function saveStore(){
    try{
      localStorage.setItem(STORE,JSON.stringify(state.missions));
      localStorage.setItem(ACTIVE,state.activeId||'');
      if(!state.applyingCloud)localStorage.setItem(SAVED_AT,new Date().toISOString());
      pushBackup(state.missions);
    }catch(e){console.warn('Planejador: falha ao salvar',e);}
    if(state.applyingCloud)return;
    try{window.HighOSMissionCloud?.push?.(state.missions);}catch(e){console.warn('Planejador: falha ao enfileirar sincronizacao',e);}
  }
  function applyCloudMissions(list){
    const r=mergeMissions(list);return !!(r.added||r.updated);
  }

  window.addEventListener('highos:mission-cloud',e=>{const st=e?.detail?.state,err=e?.detail?.error;if(st==='sync')setCloudState('sync','↻ SALVANDO NO FIREBASE...');else if(st==='ok'){state.cloudMeta={updatedAtText:e?.detail?.updatedAtText||new Date().toISOString(),updatedBy:e?.detail?.updatedBy||state.cloudMeta?.updatedBy||''};setCloudState('ok',`☁ SINCRONIZADO · ${new Set(state.missions.map(m=>m.eventId).filter(Boolean)).size} eventos · ${state.missions.length} zonas`);}else if(st==='quota'){const suffix=err?.when?` • tentar após ${err.when}${err.estimated?' (estimado)':''}`:'';setCloudState('local','⚠ COTA FIREBASE ESGOTADA'+suffix);setSaveState('Cota do Firebase esgotada'+suffix+' • dados locais preservados');}else if(st==='permission'){setCloudState('local','⛔ SEM PERMISSÃO PARA SINCRONIZAR');setSaveState('Firebase recusou a gravação por permissão • dados locais preservados');}else if(st==='local')setCloudState('local','⚠ SALVO LOCAL • FIREBASE PENDENTE');});
  function setCloudState(kind,text){
    state.cloudState=kind;
    const els=[qs('#mpCloudState'),
qs('#mpCloudStateTop')].filter(Boolean);if(!els.length)return;
    els.forEach(el=>{el.className='mp-cloud-state '+kind;el.textContent=text||(kind==='ok'?'☁ SINCRONIZADO':kind==='sync'?'↻ SINCRONIZANDO...':'⚠ MODO LOCAL');});
  }
  async function forcePlannerCloudSync(){
    const cloud=window.HighOSMissionCloud;if(!cloud?.pull){setCloudState('local','⚠ FIREBASE INDISPONÍVEL');return;}
    const btn=qs('#mpForceCloudSync');if(btn){btn.disabled=true;btn.textContent='↻ SINCRONIZANDO...';}
    setCloudState('sync','↻ SINCRONIZANDO FIREBASE...');
    try{
      const res=await cloud.pull({force:true}),remote=Array.isArray(res?.missions)?res.missions:[],merge=mergeMissions(remote);if(res?.updatedAtText)state.cloudMeta={updatedAtText:res.updatedAtText,updatedBy:res.updatedBy||''};
      const ok=cloud.pushNow?await cloud.pushNow(state.missions):(cloud.push?.(state.missions),true);
      if(!ok){const ce=window.HighOSMissionCloudLastError;if(ce?.quota){const suffix=ce.when?` • tente após ${ce.when}${ce.estimated?' (estimado)':''}`:'';setCloudState('local','⚠ COTA FIREBASE ESGOTADA'+suffix);setSaveState('Cota do Firebase esgotada'+suffix+' • dados locais preservados');return;}throw new Error('Falha ao confirmar gravação');}
      setCloudState('ok',`☁ SINCRONIZADO · ${new Set(state.missions.map(m=>m.eventId).filter(Boolean)).size} eventos · ${state.missions.length} zonas`);
      setSaveState(`Sincronização manual concluída ✓${merge.added?' • '+merge.added+' nova(s)':''}${merge.updated?' • '+merge.updated+' atualizada(s) do Firebase':''}${merge.keptLocal?' • '+merge.keptLocal+' versão(ões) locais mais recentes':''}${merge.conflicts.some(x=>x.resolution==='manual')?' • ⚠ conflito(s) para revisar':''}`);
      render();
    }catch(e){
      console.warn('Planejador: sincronização manual falhou',e);setCloudState('local','⚠ FIREBASE PENDENTE');setSaveState('Falha ao sincronizar Firebase • dados locais preservados');
    }finally{const b=qs('#mpForceCloudSync');if(b){b.disabled=false;b.textContent='↻ SINCRONIZAR FIREBASE';}}
  }
  function syncMissionsFromCloud(tries=0){
    const cloud=window.HighOSMissionCloud;
    if(!cloud||!cloud.pull){if(tries<12)setTimeout(()=>syncMissionsFromCloud(tries+1),1500);else setCloudState('local');return;}
    setCloudState('sync');
    cloud.pull().then(async res=>{
      const remote=Array.isArray(res?.missions)?res.missions:[];
      const merge=mergeMissions(remote);
      // V9.5: primeira sincronizacao e sempre uma UNIAO segura. O navegador
      // nunca e substituido pela nuvem; depois da fusao, a lista completa volta
      // ao Firestore para que outros computadores recebam as zonas que so
      // existiam localmente.
      if(cloud.pushNow){await cloud.pushNow(state.missions);}else cloud.push?.(state.missions);
      setCloudState('ok',`☁ SINCRONIZADO · ${new Set(state.missions.map(m=>m.eventId).filter(Boolean)).size} eventos · ${state.missions.length} zonas`);
      if(merge.added||merge.updated)setStatus(`${merge.added} nova(s) • ${merge.updated} atualizada(s) recebidas do Firebase.`,'ok');if(merge.conflicts.some(x=>x.resolution==='manual'))setSaveState('⚠ Existem conflitos de sincronização que não foram sobrescritos.');
    }).catch(()=>setCloudState('local'));
  }

  function mergeOfficialPresets(){
    const byId=new Set(state.missions.map(m=>m.id));
    let changed=false;
    presets.forEach(p=>{
      const existing=state.missions.find(m=>m.id===p.id);
      if(existing){
        const fresh=presetMission(p);
        ['eventId',
'event',
'name',
'category',
'panel'].forEach(k=>{if(existing[k]!==fresh[k]){existing[k]=fresh[k];changed=true;}});
        return;
      }
      state.missions.push(presetMission(p));
      byId.add(p.id);changed=true;
    });
    return changed;
  }

  function persistBootStateLocalOnly(){
    try{
      localStorage.setItem(STORE,JSON.stringify(state.missions));
      localStorage.setItem(ACTIVE,state.activeId||'');
      pushBackup(state.missions);
    }catch(e){console.warn('Planejador: falha ao preservar estado local no boot',e);}
  }
  function recoverMissingFromLocalBackups(){
    const backups=readBackups();let recovered=0;
    const key=m=>m?.id||(`${String(m?.eventId||'')}|${normalizeText(m?.name||'')}`);
    const known=new Set(state.missions.map(key));
    backups.forEach(b=>{
      let list=[];try{list=JSON.parse(b?.corpo||'[]')}catch(e){}
      if(!Array.isArray(list))return;
      list.forEach(raw=>{
        if(!raw||!raw.id)return;
        const k=key(raw);if(known.has(k))return;
        const m=JSON.parse(JSON.stringify(raw));normalizeCenter(m);
        if(!m.category)m.category=(String(m.event||'').toLowerCase().includes('domina')?'dominacao':'gas');
        inferLegacyStructure(m);state.missions.push(m);known.add(k);recovered++;
      });
    });
    return recovered;
  }
  function loadStore(){
    let raw=null;
    try{raw=JSON.parse(localStorage.getItem(STORE)||'null')}catch(e){}
    if(Array.isArray(raw)&&raw.length){
      state.missions=raw;
      state.missions.forEach(m=>{normalizeCenter(m);if(!m.category)m.category=(String(m.event||'').toLowerCase().includes('domina')?'dominacao':'gas');inferLegacyStructure(m);});
    }else{
      // Nunca envia presets para o Firebase antes do primeiro pull.
      state.missions=presets.map(presetMission);
    }
    const recovered=recoverMissingFromLocalBackups();
    repairKnownZoneAssignments();repairFacxFacHierarchy();mergeOfficialPresets();
    const preferred=localStorage.getItem(ACTIVE)||raw?.[0]?.id||state.missions[0]?.id||null;
    state.activeId=state.missions.some(m=>m.id===preferred)?preferred:(state.missions[0]?.id||null);
    const am=state.missions.find(m=>m.id===state.activeId)||state.missions[0];
    state.libraryCategory=(am?.category||'dominacao');state.activeEventId=am?.eventId||null;
    // Boot é somente leitura da nuvem: persiste localmente, sem HighOSMissionCloud.push.
    persistBootStateLocalOnly();
    if(recovered)console.info('Planejador: '+recovered+' missão(ões) recuperada(s) dos backups locais no boot.');
  }

  function openDb(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(SNAP_STORE))db.createObjectStore(SNAP_STORE,{keyPath:'id'});};
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
  }
  async function saveSnapshot(id,dataUrl){
    if(!id||!dataUrl)return;
    try{const db=await openDb();const tx=db.transaction(SNAP_STORE,'readwrite');tx.objectStore(SNAP_STORE).put({id,
dataUrl,
updatedAt:nowIso()});}catch(e){console.warn('Planejador: snapshot não salvo',e);}
  }
  async function getSnapshot(id){
    try{const db=await openDb();return await new Promise((resolve,reject)=>{const r=db.transaction(SNAP_STORE,'readonly').objectStore(SNAP_STORE).get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}catch{return null;}
  }

  function makeCrs(){return L.extend({},L.CRS.Simple,{projection:L.Projection.LonLat,
scale:z=>Math.pow(2,z),
zoom:s=>Math.log(s)/Math.LN2,
distance:(a,b)=>Math.hypot(b.lng-a.lng,b.lat-a.lat),
transformation:new L.Transformation(0.02072,117.3,-0.0205,172.8),
infinite:true});}
  const remoteBases=['https://cdn.jsdelivr.net/gh/Trusted-Studios/mapStyles@main',
'https://raw.githubusercontent.com/Trusted-Studios/mapStyles/main'];
  const TRANSPARENT_TILE='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  function layer(style,ext='jpg',maxZoom=5,baseIndex=0){
    // V9.5.3: o repositorio usa matriz XYZ padrao (0..2^z-1). O CRS customizado
    // pode pedir x/y fora dessa matriz; antes isso gerava dezenas de 404/403 no console.
    const base=`${remoteBases[baseIndex]}/${style}`;
    const SafeTiles=L.TileLayer.extend({
      getTileUrl(coords){
        const max=Math.pow(2,coords.z)-1;
        if(coords.x<0||coords.y<0||coords.x>max||coords.y>max)return TRANSPARENT_TILE;
        return `${base}/${coords.z}/${coords.x}/${coords.y}.${ext}`;
      }
    });
    return new SafeTiles('',{minZoom:0,
maxZoom,
noWrap:true,
continuousWorld:false,
updateWhenIdle:true,
keepBuffer:2,
crossOrigin:'anonymous',
errorTileUrl:TRANSPARENT_TILE});
  }
  function setStatus(text,type='ok'){const el=qs('#mpTileStatus');if(el){el.textContent=text;el.className=type;}}

  /* ---------------------------------------------------------------
     V9.4.1 - O mar de Cayo Perico e um retangulo desenhado por nos,
     enquanto o mar de Los Santos vem pintado dentro dos tiles. Antes
     usavamos um azul fixo e a emenda ficava visivel. Agora lemos um
     pixel de oceano do proprio tile carregado e aplicamos a mesma cor
     no retangulo e no fundo do mapa - funciona para Atlas, Satelite e
     Grid, e se ajusta sozinho ao trocar de camada.
  --------------------------------------------------------------- */
  const OCEAN_FALLBACK='#0d1b2a';
  function applyOceanColor(hex){
    if(!hex)return;
    try{state.cayoOceanLayer?.setStyle({fillColor:hex});}catch(e){}
    const box=qs('#missionPlannerMap');
    if(box)box.style.setProperty('--mp-ocean',hex);
  }
  function sampleOceanFromTile(img){
    try{
      if(!img||!img.naturalWidth)return null;
      const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
      const ctx=c.getContext('2d',{willReadFrequently:true});
      ctx.drawImage(img,0,0);
      const pts=[[2,
2],
[c.width-3,
2],
[2,
c.height-3],
[c.width-3,
c.height-3],
[c.width>>1,
2]];
      const cores=pts.map(([x,
y])=>{const d=ctx.getImageData(x,y,1,1).data;return [d[0],
d[1],
d[2],
d[3]];}).filter(d=>d[3]>200);
      if(cores.length<4)return null;
      const media=[0,
1,
2].map(i=>cores.reduce((a,c2)=>a+c2[i],0)/cores.length);
      // so aceita se as amostras forem parecidas entre si (tile uniforme = mar aberto)
      const desvio=Math.max(...[0,
1,
2].map(i=>Math.max(...cores.map(c2=>Math.abs(c2[i]-media[i])))));
      if(desvio>14)return null;
      const [r,
g,
b]=media.map(v=>Math.round(v));
      // e se realmente parecer agua (azul/verde dominante e nao muito claro)
      if(b<40||b<r||(r+g+b)/3>190)return null;
      return '#'+[r,
g,
b].map(v=>v.toString(16).padStart(2,'0')).join('');
    }catch(e){return null;}
  }
  function watchOcean(layer){
    if(!layer||layer._mpOceanWatch)return;layer._mpOceanWatch=true;
    layer.on('tileload',ev=>{
      // desiste depois de algumas tentativas: e so cosmetico, nunca pode
      // atrapalhar o carregamento do mapa em si
      if(state.oceanLocked||state.oceanTries>=8)return;
      state.oceanTries=(state.oceanTries||0)+1;
      try{
        const hex=sampleOceanFromTile(ev.tile);
        if(hex){state.oceanLocked=true;applyOceanColor(hex);}
      }catch(e){state.oceanTries=99;}
    });
  }
  /* ---------------------------------------------------------------
     V9.4.4 - Se nenhum tile chegar, o mapa ficava eternamente em
     "Carregando mapa GTA V...". Agora existe um vigia: ele diz o que
     esta acontecendo, tenta o servidor alternativo sozinho e oferece
     um botao de recarregar sem precisar atualizar a pagina inteira.
  --------------------------------------------------------------- */
  function updateMapDiagnostics(extra=''){
    const el=qs('#mpMapDiagnostics');if(!el)return;
    const base=qs('#mpLayerControl [data-base].active')?.dataset.base||'atlas',ok=state.tileCounters?.ok||0,err=state.tileCounters?.err||0,server=(Number(state.tileBase)||0)+1,cayo=!!(state.cayoLayer&&state.map?.hasLayer(state.cayoLayer)),postal=!!(state.cayoPostalLayer&&state.map?.hasLayer(state.cayoPostalLayer)),box=qs('#missionPlannerMap');
    el.textContent='Servidor '+server+'/'+remoteBases.length+' • '+base.toUpperCase()+' • tiles '+ok+' OK / '+err+' falha(s) • Cayo '+(cayo?'SAT':postal?'POSTAL':'OFF')+(box?' • '+box.clientWidth+'×'+box.clientHeight:'')+(extra?' • '+extra:'');
  }
  function mapNotice(texto,tipo='warn',comBotao=false){
    setStatus(texto,tipo);updateMapDiagnostics(texto);
    const barra=qs('.mp-map-status');if(!barra)return;
    let acao=qs('#mpMapRetry');
    if(!comBotao){acao?.remove();return;}
    if(!acao){
      acao=document.createElement('button');
      acao.type='button';acao.id='mpMapRetry';acao.className='mp-map-retry';
      acao.textContent='RECARREGAR MAPA';
      acao.addEventListener('click',reloadMapTiles);
      barra.appendChild(acao);
    }
  }
  function attachMapLayerHealth(layers){
    let ok=0,err=0;Object.values(layers).forEach(l=>{l.on('tileload',()=>{ok++;mapNotice('Mapa GTA V carregado','ok',false)});l.on('tileerror',()=>{err++;updateMapDiagnostics('falha de tile')});watchOcean(l);});
    startMapWatchdog(()=>ok,()=>err);return {get ok(){return ok},get err(){return err}};
  }
  function replaceMapBases(baseIndex=0){
    if(!state.map)return;const current=qs('#mpLayerControl [data-base].active')?.dataset.base||'atlas';
    Object.values(state.mapLayers||{}).forEach(l=>{try{state.map.removeLayer(l)}catch(e){}});
    const layers={atlas:layer('styleAtlas','jpg',5,baseIndex),sat:layer('styleSatelite','jpg',5,baseIndex),grid:layer('styleGrid','png',5,baseIndex)};
    state.mapLayers=layers;state.atlasLayer=layers.atlas;state.satLayer=layers.sat;state.gridLayer=layers.grid;state.tileCounters=attachMapLayerHealth(layers);
    (layers[current]||layers.atlas).addTo(state.map);state.map.invalidateSize();
    return layers;
  }
  function reloadMapTiles(){
    if(!state.map)return;
    state.tileBase=((state.tileBase||0)+1)%remoteBases.length;
    mapNotice('Tentando outro servidor do mapa...','warn',false);
    replaceMapBases(state.tileBase);
  }
  function startMapWatchdog(getOk,getErr){
    clearTimeout(state.mapWatchdog);
    let ciclos=0;
    const tick=()=>{
      ciclos++;
      if(!state.map)return;
      if(getOk()>0){mapNotice('Mapa GTA V carregado','ok',false);return;}
      const box=qs('#missionPlannerMap');
      const semTamanho=box&&(box.clientWidth<40||box.clientHeight<40);
      if(semTamanho){
        // causa mais comum: o mapa foi criado com a aba ainda escondida
        state.map.invalidateSize();
        if(ciclos<6)return void(state.mapWatchdog=setTimeout(tick,1200));
        mapNotice('O mapa abriu sem espaço na tela. Recarregue.','warn',true);
        return;
      }
      if(getErr()>0){
        mapNotice(`Servidor do mapa não respondeu (${getErr()} tiles falharam).`,'warn',true);
        return;
      }
      if(ciclos<6)return void(state.mapWatchdog=setTimeout(tick,1200));
      mapNotice('Nenhum tile chegou. Verifique a conexão ou o bloqueador.','warn',true);
    };
    state.mapWatchdog=setTimeout(tick,2500);
  }

  /* ---------------------------------------------------------------
     V9.4.5 - Controle de camadas proprio. O padrao do Leaflet (lista
     de radios e checkboxes) destoava do resto do painel. Aqui as
     bases viram um seletor segmentado e os overlays de Cayo viram
     interruptores, tudo no mesmo tema do High OS.
  --------------------------------------------------------------- */
  function buildLayerControl(bases,overlays){
    const host=qs('.mission-planner-mapwrap');
    if(!host||qs('#mpLayerControl'))return;
    const box=document.createElement('div');
    box.id='mpLayerControl';box.className='mp-layer-control';
    box.innerHTML=`
      <button type="button" class="mp-layer-toggle" aria-expanded="true" title="Camadas do mapa">
        <span class="mp-layer-icon">◧</span><span class="mp-layer-label">CAMADAS</span>
      </button>
      <div class="mp-layer-body">
        <div class="mp-layer-group">
          <span class="mp-layer-title">BASE</span>
          <div class="mp-segment" role="group">
            <button type="button" data-base="atlas" class="active">ATLAS</button>
            <button type="button" data-base="sat">SATÉLITE</button>
            <button type="button" data-base="grid">GRID</button>
          </div>
        </div>
        <div class="mp-layer-group">
          <span class="mp-layer-title">CAYO PERICO</span>
          <label class="mp-switch"><input type="checkbox" data-over="cayo" checked><i></i><span>Satélite</span></label>
          <label class="mp-switch"><input type="checkbox" data-over="cayoPostal" checked><i></i><span>Postal</span></label>
        </div>
        <div class="mp-layer-group"><span class="mp-layer-title">DIAGNÓSTICO</span><small id="mpMapDiagnostics" style="display:block;max-width:230px;line-height:1.45;opacity:.72">Aguardando mapa…</small><button type="button" id="mpMapDiagRefresh" style="margin-top:6px">ATUALIZAR</button></div>
      </div>`;
    host.appendChild(box);
    qs('#mpMapDiagRefresh',box)?.addEventListener('click',()=>{state.map?.invalidateSize();updateMapDiagnostics('diagnóstico atualizado');});
    if(window.L?.DomEvent){L.DomEvent.disableClickPropagation(box);L.DomEvent.disableScrollPropagation(box);}

    const trocarBase=chave=>{
      const live=state.mapLayers||bases;
      Object.entries(live).forEach(([k,l])=>{try{if(k===chave){if(!state.map.hasLayer(l))l.addTo(state.map);}else if(state.map.hasLayer(l))state.map.removeLayer(l);}catch(e){}});
      qsa('[data-base]',box).forEach(b=>b.classList.toggle('active',b.dataset.base===chave));
      state.oceanLocked=false;state.oceanTries=0;watchOcean(live[chave]);updateMapDiagnostics('base alterada');
    };
    qsa('[data-base]',box).forEach(b=>b.addEventListener('click',()=>trocarBase(b.dataset.base)));

    // Overlays de Cayo são ativados apenas quando a missão está em Cayo.
    qsa('[data-over]',box).forEach(inp=>{inp.checked=false;inp.addEventListener('change',()=>{
      const l=overlays[inp.dataset.over];if(!l)return;
      try{inp.checked?l.addTo(state.map):state.map.removeLayer(l)}catch(e){}
    });});

    const alternar=()=>{
      const aberto=box.classList.toggle('collapsed');
      box.querySelector('.mp-layer-toggle')?.setAttribute('aria-expanded',aberto?'false':'true');
      try{localStorage.setItem('highos_mp_layers_collapsed',aberto?'1':'0')}catch(e){}
    };
    box.querySelector('.mp-layer-toggle')?.addEventListener('click',alternar);
    try{if(localStorage.getItem('highos_mp_layers_collapsed')==='1')box.classList.add('collapsed');}catch(e){}
  }

  function initMap(){
    if(state.map||!qs('#missionPlannerMap'))return;
    if(typeof L==='undefined'){setStatus('Leaflet não carregou','warn');return;}
    let atlas=layer('styleAtlas'),
sat=layer('styleSatelite'),
grid=layer('styleGrid','png');
    // Cayo Perico overlay calibrated to the GTA/FiveM world-coordinate region around 4700,-5150.
    // It is an overlay (not a separate coordinate system), so clicks/markers continue returning GTA X/Y.
    const cayoUrl='https://raw.githubusercontent.com/fivenet-app/livemap-tiles/main/overlays/cayo-perico/satellite.webp';
    const cayoPostalUrl='https://raw.githubusercontent.com/fivenet-app/livemap-tiles/main/overlays/cayo-perico/postal.webp';
    const cayoBounds=L.latLngBounds(ll(3900,-6000),ll(5600,-4300));
    // Fundo de oceano próprio para a região de Cayo. O mapa base não possui tiles nessa área,
    // então este retângulo evita o vazio/preto ao redor da ilha sem alterar as coordenadas GTA/FiveM.
    state.map=L.map('missionPlannerMap',{crs:makeCrs(),
minZoom:1,
maxZoom:5,
layers:[atlas],
preferCanvas:true,
zoomControl:true,
attributionControl:false});
    state.map.createPane('cayoOceanPane');state.map.getPane('cayoOceanPane').style.zIndex=220;
    state.map.createPane('cayoMapPane');state.map.getPane('cayoMapPane').style.zIndex=230;
    const cayoOceanBounds=L.latLngBounds(ll(3450,-6450),ll(6050,-3850));
    const cayoOcean=L.rectangle(cayoOceanBounds,{pane:'cayoOceanPane',
stroke:false,
fill:true,
fillColor:OCEAN_FALLBACK,
fillOpacity:1,
interactive:false});
    const cayo=L.imageOverlay(cayoUrl,cayoBounds,{pane:'cayoMapPane',
opacity:1,
interactive:false,
crossOrigin:true});
    const cayoPostal=L.imageOverlay(cayoPostalUrl,cayoBounds,{pane:'cayoMapPane',
opacity:1,
interactive:false,
crossOrigin:true});
    buildLayerControl({atlas,
sat,
grid},{cayo,
cayoPostal});
    state.cayoBounds=cayoBounds;state.cayoOceanLayer=cayoOcean;state.cayoLayer=cayo;state.cayoPostalLayer=cayoPostal;state.atlasLayer=atlas;state.satLayer=sat;state.gridLayer=grid;
    let cayoOk=false;cayo.on('load',()=>{cayoOk=true;if(/cayo/i.test(active()?.name||'')||/cayo/i.test(active()?.event||''))mapNotice('Cayo Perico carregado','ok',false)});cayo.on('error',()=>{if(!cayoOk)mapNotice('Imagem de Cayo indisponível • coordenadas e ferramentas continuam funcionando','warn',true)});
    state.map.setView(ll(900,-600),3);
    state.tileBase=0;
    state.mapLayers={atlas,sat,grid};state.atlasLayer=atlas;state.satLayer=sat;state.gridLayer=grid;
    state.tileCounters=attachMapLayerHealth(state.mapLayers);
    let initialFallback=false;
    const initialErr=()=>{if(initialFallback||state.tileCounters.ok>0||state.tileCounters.err<=4)return;initialFallback=true;state.tileBase=1;mapNotice('Servidor principal falhou • alternando automaticamente…','warn',false);replaceMapBases(1);};
    [atlas,sat,grid].forEach(x=>x.on('tileerror',()=>setTimeout(initialErr,0)));
    applyOceanColor(OCEAN_FALLBACK);
    state.map.on('baselayerchange',ev=>{state.oceanLocked=false;watchOcean(ev.layer);setTimeout(()=>{if(!state.oceanLocked)applyOceanColor(OCEAN_FALLBACK);},1200);});
    state.map.on('mousemove',e=>{
      if(qs('#mpCursor')){const m=active(),sg=m?suggestedMapCoord(m,e.latlng):null;qs('#mpCursor').textContent=sg?`X ${f(sg.x)} | Y ${f(sg.y)} | Z~ ${sg.elevation.count?f(sg.z):'?'} | ${sg.elevation.confidence}%`:`X ${f(e.latlng.lng)} | Y ${f(e.latlng.lat)}`;}
      if(state.safePlacementStage!==null)previewSafePlacement(e.latlng);
    });
    state.map.on('click',e=>{
      const m=active();if(!m)return;
      if(!state.editing){if(qs('#mpClicked'))qs('#mpClicked').textContent='Modo visualização: clique em EDITAR EVENTO para alterar posições.';return;}
      const suggested=suggestedMapCoord(m,e.latlng);
      if(qs('#mpClicked'))qs('#mpClicked').innerHTML=`MAPA ${f(e.latlng.lng)}, ${f(e.latlng.lat)} → <b>CDS SUGERIDA ${f(suggested.x)}, ${f(suggested.y)}, ${suggested.elevation.count?f(suggested.z):'Z ?'}</b>${suggested.elevation.count?` • confiança Z ${suggested.elevation.confidence}% • ${suggested.elevation.count} ref.`:''}`;
      if(state.mapMode==='safe-stage'||state.mapMode==='safe-option'){placeSafeOnMap(e.latlng);return;}
      if(state.mapMode==='polygon'){if((m.category||'dominacao')!=='dominacao')return;if(!Array.isArray(m.zonePolygon))m.zonePolygon=[];m.zonePolygon.push({x:e.latlng.lng,y:e.latlng.lat,z:0,status:'planned',validatedAt:null,validationReason:'map-placement'});m.zoneMode='polygon';commit('Vértice '+String(m.zonePolygon.length).padStart(2,'0')+' marcado no mapa');return;}
      if(state.mapMode==='spawn'){m.points.push(normalizePoint({x:e.latlng.lng,y:e.latlng.lat,z:0,h:0,status:'planned'},m.points.length));commit('Ponto marcado no mapa');return;}
      if(state.mapMode!=='center')return;
      if((m.category||'dominacao')==='dominacao'&&dominationZoneMode(m)==='polygon'){if(qs('#mpClicked'))qs('#mpClicked').textContent=`${f(e.latlng.lng)},${f(e.latlng.lat)} • Polígono ativo: use MARCAR VÉRTICE NO MAPA`;return;}m.center.x=e.latlng.lng;m.center.y=e.latlng.lat;m.center.z=0;m.center.h=0;m.center.status='planned';m.center.validatedAt=null;m.center.validationReason='coordinate-change';syncForm();commit('Centro ajustado no mapa — validação removida');
    });
  }

  function pinIcon(p,outside=false){const cls=isValidated(p)?'validated':'planned';const warn=outside?' style="outline:3px solid #ff5252;box-shadow:0 0 0 5px rgba(255,82,82,.22)"':'';return L.divIcon({className:'',
html:`<div class="mp-pin ${cls} ${outside?'outside':''}"${warn}>${outside?'!':''}${String(p.id).padStart(2,'0')}</div>`,
iconSize:[outside?34:28,
outside?34:28],
iconAnchor:[outside?17:14,
outside?17:14]});}
  function headingIcon(h){return L.divIcon({className:'',
html:`<div class="mp-heading" style="transform:rotate(${Number(h)||0}deg)">↑</div>`,
iconSize:[24,
24],
iconAnchor:[12,
12]});}
  function clearLayers(){const compareLegend=qs('#mpCompareLegend');if(compareLegend)compareLegend.remove();state.drawn.forEach(o=>{try{state.map.removeLayer(o)}catch{}});state.drawn=[];}
  function drawCompareOverlay(){
    if(!state.compareOverlay||!state.editing||!state.map)return;const m=active(),old=state.editBackup?.zones?.find(z=>z.id===m?.id);if(!old)return;
    const oldPoly=dominationPolygon(old);
    if((old.category||'dominacao')==='dominacao'&&dominationZoneMode(old)==='polygon'&&oldPoly.length>=3){
      const z=L.polygon(oldPoly.map(p=>ll(p.x,p.y)),{weight:3,opacity:.78,fillOpacity:.012,dashArray:'4 8',color:'#9ca3af',interactive:false}).addTo(state.map);z._mpKind='compare';state.drawn.push(z);
      oldPoly.forEach((p,i)=>{const ic=L.divIcon({className:'',html:'<div style="min-width:20px;height:20px;border:1px dashed #d1d5db;border-radius:50%;background:rgba(17,24,39,.7);color:#e5e7eb;font:9px/18px system-ui;text-align:center">V'+(i+1)+'</div>',iconSize:[20,20],iconAnchor:[10,10]});const mk=L.marker(ll(p.x,p.y),{icon:ic,interactive:false}).addTo(state.map);mk._mpKind='compare';state.drawn.push(mk);});
    }else if(validCoord(old.center?.x)&&validCoord(old.center?.y)){
      const z=L.circle(ll(old.center.x,old.center.y),{radius:effectiveEventRadius(old),weight:2,opacity:.72,fillOpacity:.015,dashArray:'3 8',color:'#9ca3af',interactive:false}).addTo(state.map);z._mpKind='compare';state.drawn.push(z);
    }
    if(validCoord(old.center?.x)&&validCoord(old.center?.y)){const ci=L.divIcon({className:'',html:'<div style="width:18px;height:18px;border:2px dashed #d1d5db;border-radius:50%;background:rgba(17,24,39,.55)"></div>',iconSize:[18,18],iconAnchor:[9,9]});const cm=L.marker(ll(old.center.x,old.center.y),{icon:ci,interactive:false}).addTo(state.map);cm._mpKind='compare';state.drawn.push(cm);}
    if((m?.category||'dominacao')==='dominacao'){const before=dominationZoneGeometry(old),after=dominationZoneGeometry(m),ba=Number(before?.area),aa=Number(after?.area);if(Number.isFinite(ba)&&ba>0&&Number.isFinite(aa)&&aa>0){const pct=((aa-ba)/ba)*100,center=dominationAnalysisCenter(m)||dominationAnalysisCenter(old);if(center){const label=L.marker(ll(center.x,center.y),{interactive:false,icon:L.divIcon({className:'',html:'<div style="white-space:nowrap;transform:translate(-50%,-32px);background:rgba(17,24,39,.88);border:1px dashed #d1d5db;border-radius:8px;padding:4px 7px;color:#f3f4f6;font:10px system-ui">ANTES '+Math.round(ba).toLocaleString('pt-BR')+' m² → DEPOIS '+Math.round(aa).toLocaleString('pt-BR')+' m² ('+(pct>=0?'+':'')+pct.toFixed(1)+'%)</div>'})}).addTo(state.map);label._mpKind='compare';state.drawn.push(label);}}}
    (old.points||[]).forEach((p,i)=>{if(!validCoord(p.x)||!validCoord(p.y))return;const ic=L.divIcon({className:'',html:'<div style="min-width:20px;height:20px;padding:0 3px;border:1px dashed #d1d5db;border-radius:10px;background:rgba(17,24,39,.68);color:#e5e7eb;font:10px/18px system-ui;text-align:center">S'+(i+1)+'</div>',iconSize:[22,20],iconAnchor:[11,10]});const mk=L.marker(ll(p.x,p.y),{icon:ic,interactive:false}).addTo(state.map);mk._mpKind='compare';state.drawn.push(mk);});
    const host=qs('.mission-planner-mapwrap')||qs('#missionPlannerMap')?.parentElement;if(host){let legend=qs('#mpCompareLegend');if(!legend){legend=document.createElement('div');legend.id='mpCompareLegend';Object.assign(legend.style,{position:'absolute',right:'12px',bottom:'12px',zIndex:'901',background:'rgba(17,24,39,.9)',border:'1px dashed #d1d5db',borderRadius:'9px',padding:'7px 9px',fontSize:'10px',lineHeight:'1.55',color:'#f3f4f6',pointerEvents:'none'});host.appendChild(legend);}legend.innerHTML='<b>ANTES × DEPOIS</b><br>Tracejado = configuração anterior<br>V = vértice antigo • S = spawn antigo<br>Zona sólida = configuração atual';}
  }
  // V12.6 — rota progressiva da Safe: FECHA -> MOVE -> FECHA -> MOVE -> FECHA FINAL
  function hasDynamicSafe(m){return !!(m?.safeRoute&&Array.isArray(m.safeRoute.stages)&&m.safeRoute.stages.length);}
  function ensureSafeRoute(m,create=false){
    if(!m||((m.category||'dominacao')!=='gas'))return null;
    const initial=effectiveEventRadius(m);
    if(!hasDynamicSafe(m)){
      if(!create)return null;
      m.safeRoute={version:2,enabled:true,stages:[
        {x:num(m.center?.x),y:num(m.center?.y),z:0,radius:Math.max(50,Math.round(initial*.65)),damage:5,closeSeconds:180,moveSeconds:90},
        {x:null,y:null,z:null,radius:Math.max(50,Math.round(initial*.35)),damage:10,closeSeconds:150,moveSeconds:75},
        {x:null,y:null,z:null,radius:Math.max(30,Math.round(initial*.12)),damage:20,closeSeconds:120,moveSeconds:0}
      ],stageOptions:{}};
    }
    const r=m.safeRoute;
    if(!r.stageOptions||typeof r.stageOptions!=='object')r.stageOptions={};
    // Migração única: lê o formato legado, converte para stageOptions e o remove do runtime.
    if(Array.isArray(r.stage2Options)&&!Array.isArray(r.stageOptions['1']))r.stageOptions['1']=r.stage2Options;
    if(Array.isArray(r.stage3Options)&&!Array.isArray(r.stageOptions['2']))r.stageOptions['2']=r.stage3Options;
    delete r.stage2Options;delete r.stage3Options;
    return r;
  }
  function safeOptions(r,idx,create=false){
    if(!r||idx<=0)return [];
    if(!r.stageOptions||typeof r.stageOptions!=='object')r.stageOptions={};
    const key=String(idx);
    if(!Array.isArray(r.stageOptions[key])){
      if(create)r.stageOptions[key]=[];
    }
    return Array.isArray(r.stageOptions[key])?r.stageOptions[key]:[];
  }
  function setSafeOptions(r,idx,arr){
    if(!r||idx<=0)return;if(!r.stageOptions||typeof r.stageOptions!=='object')r.stageOptions={};
    r.stageOptions[String(idx)]=Array.isArray(arr)?arr:[];
  }
  function safeOptionStage(r,idx,p){return {...r.stages[idx],x:Number(p.x),y:Number(p.y),z:0};}
  function safeParentCandidates(r,idx){
    if(!r||idx<=0)return [];
    const fixed=r.stages[idx-1];
    // Se a etapa anterior já foi escolhida/fixada, ela é a única referência
    // geométrica. Opções antigas não podem invalidar a cadeia selecionada.
    if(safeStageValid(fixed))return [fixed];
    return safeOptions(r,idx-1).filter(p=>validCoord(p.x)&&validCoord(p.y)).map(p=>safeOptionStage(r,idx-1,p));
  }
  function safeOptionAudit(r,idx){
    const opts=safeOptions(r,idx).filter(p=>validCoord(p.x)&&validCoord(p.y));if(idx<=0)return {all:opts,valid:opts,invalid:[]};
    const parents=safeParentCandidates(r,idx);
    const valid=[],invalid=[];opts.forEach((p,j)=>{const candidate=safeOptionStage(r,idx,p),land=safeLandCheck(candidate),fits=parents.some(parent=>safeCircleFits(parent,candidate));(fits&&land.ok?valid:invalid).push({p,index:j,reason:!fits?'fora da SAFE anterior selecionada':land.reason||'posição inválida'});});
    return {all:opts,valid,invalid};
  }
  function safeRouteReachability(r){
    const result={};if(!r?.stages?.length)return result;
    let next=[r.stages.length-1];
    for(let i=r.stages.length-1;i>=1;i--){
      const audit=safeOptionAudit(r,i),fixed=safeStageValid(r.stages[i])?[{p:r.stages[i],index:-1}]:[],nodes=[...audit.valid,...fixed];
      const viable=nodes.filter(node=>{
        const cur=node.index===-1?r.stages[i]:safeOptionStage(r,i,node.p);
        if(i===r.stages.length-1)return true;
        const downstream=result[i+1]?.viableStages||[];
        return downstream.some(child=>safeCircleFits(cur,child));
      });
      result[i]={...audit,viable,dead:nodes.filter(n=>!viable.includes(n)),viableStages:viable.map(n=>n.index===-1?r.stages[i]:safeOptionStage(r,i,n.p))};
      next=result[i].viableStages;
    }
    return result;
  }
  function safeStageValid(s){return !!s&&validCoord(s.x)&&validCoord(s.y)&&Number(s.radius)>0;}
  function safeTimeline(m){
    const r=ensureSafeRoute(m);if(!r)return [];let at=0;const out=[{label:'INÍCIO DO EVENTO',at:0,radius:effectiveEventRadius(m),duration:0,type:'start'}];
    r.stages.forEach((st,i)=>{const close=Math.max(0,Number(st.closeSeconds)||0);at+=close;out.push({label:'SAFE '+(i+1)+' FECHADA',at,radius:Number(st.radius)||0,duration:close,type:'close'});if(i<r.stages.length-1){const move=Math.max(0,Number(st.moveSeconds)||0);at+=move;out.push({label:'MOVIMENTO → SAFE '+(i+2),at,radius:Number(st.radius)||0,duration:move,type:'move'});}});
    return out;
  }
  function safeTotalSeconds(m){const tl=safeTimeline(m);return tl.length?tl[tl.length-1].at:0;}
  function formatDuration(sec){sec=Math.max(0,Math.round(Number(sec)||0));const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return (h?h+'h ':'')+(m?m+'min ':'')+(s||(!h&&!m)?s+'s':'');}
  function setSafeConfigView(on){state.safeConfigView=!!on;if(on)state.layerVisibility.spawns=false;renderMap();}
  function safeCircleFits(parent,child){if(!safeStageValid(parent)||!safeStageValid(child))return true;return distXY(parent,child)+Number(child.radius)<=Number(parent.radius)+.01;}
  function safeRouteAudit(m){
    const r=ensureSafeRoute(m),issues=[];if(!r)return issues;
    const initial=effectiveEventRadius(m);let prev=initial;
    const reach=safeRouteReachability(r);
    r.stages.forEach((st,i)=>{const hasFixed=safeStageValid(st),hasViableOption=i>0&&!!reach[i]?.viable?.some(x=>x.index>=0);if(!hasFixed&&!hasViableOption)issues.push('SAFE '+(i+1)+' sem posição fixa ou possibilidade viável.');if(hasFixed&&Number(st.z)!==0)issues.push('SAFE '+(i+1)+' deve usar Z = 0 na referência visual.');if(Number(st.radius)>=prev)issues.push('Raio da SAFE '+(i+1)+' precisa ser menor que a etapa anterior.');if(Number(st.closeSeconds)<=0)issues.push('Tempo de fechamento da SAFE '+(i+1)+' inválido.');if(i<r.stages.length-1&&Number(st.moveSeconds)<=0)issues.push('Tempo de movimento após SAFE '+(i+1)+' inválido.');prev=Number(st.radius)||prev;});
    const initialStage={x:m.center?.x,y:m.center?.y,radius:initial};
    if(safeStageValid(r.stages[0])&&!safeCircleFits(initialStage,r.stages[0]))issues.push('SAFE 1 não cabe completamente dentro da Safe inicial.');
    for(let i=1;i<r.stages.length;i++)if(safeStageValid(r.stages[i-1])&&safeStageValid(r.stages[i])&&!safeCircleFits(r.stages[i-1],r.stages[i]))issues.push('SAFE '+(i+1)+' ultrapassa os limites da SAFE '+i+'.');
    for(let i=1;i<r.stages.length;i++){
      const audit=safeOptionAudit(r,i);audit.invalid.forEach(x=>issues.push('Opção '+(x.index+1)+' da SAFE '+(i+1)+': '+x.reason+'.'));
      const stageReach=reach[i];if(audit.valid.length&&!(stageReach?.viable?.length))issues.push('SAFE '+(i+1)+' possui opções locais, mas nenhuma mantém caminho até a SAFE final.');
    }
    return [...new Set(issues)];
  }
  function gtaLandHeuristic(x,y){
    x=Number(x);y=Number(y);if(!Number.isFinite(x)||!Number.isFinite(y))return false;
    // Máscara conservadora de terra para impedir propostas óbvias em oceano.
    // LS/Blaine: envelope do continente; Cayo: elipse aproximada da ilha.
    const cayo=((x-4900)/1050)**2+((y+5450)/900)**2<=1;
    if(cayo)return true;
    if(x<-3900||x>4700||y<-4200||y>8500)return false;
    // Recortes costeiros grosseiros: evitam mar aberto sem fingir precisão de colisão GTA.
    if(y<-3500&&(x<-900||x>2100))return false;
    if(x<-3200&&y<1000)return false;
    if(x>3900&&y<1800)return false;
    return true;
  }
  function safeLandCheck(candidate,samples=20){
    if(!candidate||!gtaLandHeuristic(candidate.x,candidate.y))return {ok:false,landRatio:0,reason:'Centro sobre área de mar / fora da terra jogável.'};
    const radius=Math.max(0,Number(candidate.radius)||0);if(!radius)return {ok:true,landRatio:1};
    let land=1,total=1;
    [0.45,0.78,1].forEach(fr=>{for(let i=0;i<samples;i++){const a=Math.PI*2*i/samples,x=Number(candidate.x)+Math.cos(a)*radius*fr,y=Number(candidate.y)+Math.sin(a)*radius*fr;total++;if(gtaLandHeuristic(x,y))land++;}});
    const ratio=land/total;
    return {ok:ratio>=.82,landRatio:ratio,reason:ratio>=.82?'':`SAFE invade demais o mar (${Math.round((1-ratio)*100)}% das amostras fora da terra).`};
  }

  function safeCandidateScore(parent,stage,p,nextStage=null){
    const c={...stage,...p},land=safeLandCheck(c),limit=Math.max(1,Number(parent.radius)-Number(stage.radius)),d=distXY(parent,c),margin=Math.max(0,1-d/limit);
    let future=1;
    if(nextStage){
      const room=Math.max(0,Number(stage.radius)-Number(nextStage.radius));
      future=room>0?Math.min(1,room/Math.max(1,Number(stage.radius))):0;
    }
    const score=Math.round((land.landRatio*.62+margin*.25+future*.13)*100);
    return {...p,score,landRatio:land.landRatio,margin};
  }
  function generateSafeCandidates(){
    if(!requireEdit())return;const m=active(),r=ensureSafeRoute(m,true);if(!m||!r)return;
    if(!safeStageValid(r.stages[0])){alert('Defina primeiro a SAFE 1.');return;}
    const radial=(parent,child,count=12)=>{const limit=Math.max(0,Number(parent.radius)-Number(child.radius)),rings=[0,.25,.45,.65,.82,.94],out=[];rings.forEach(fr=>{const d=limit*fr;for(let i=0;i<count;i++){const a=(Math.PI*2*i/count)+(fr>.5?Math.PI/count:0);out.push({x:Number(parent.x)+Math.cos(a)*d,y:Number(parent.y)+Math.sin(a)*d,z:0});}});return out;};
    const dedupe=(arr,min=20)=>arr.filter((p,i,a)=>a.findIndex(q=>distXY(p,q)<min)===i);let parents=[{...r.stages[0]}],generated=[];
    for(let idx=1;idx<r.stages.length;idx++){const stage=r.stages[idx],next=r.stages[idx+1],all=[];parents.forEach(parent=>radial(parent,stage,12).forEach(p=>{const c={...stage,...p};if(safeCircleFits(parent,c)&&safeLandCheck(c).ok)all.push({...safeCandidateScore(parent,stage,p,next),parentX:parent.x,parentY:parent.y});}));const diverse=[];for(const p of dedupe(all.sort((x,y)=>y.score-x.score),Math.max(15,Number(stage.radius)*.08))){if(diverse.every(q=>distXY(p,q)>=Math.max(30,Number(stage.radius)*.16)))diverse.push(p);if(diverse.length>=10)break;}if(!diverse.length){alert('Não encontrei opções automáticas válidas para a SAFE '+(idx+1)+'. Revise os raios ou a etapa anterior.');return;}setSafeOptions(r,idx,diverse);generated.push('SAFE '+(idx+1)+': '+diverse.length);parents=diverse.map(p=>({...stage,...p}));}
    commit('Opções automáticas geradas • '+generated.join(' • '));const status=qs('#mpSafeRouteStatus');if(status)status.innerHTML='<b>MODO AUTOMÁTICO INTELIGENTE</b><br>'+generated.join(' • ')+'<br><small>Possibilidades geradas etapa por etapa até a SAFE final.</small>';
  }

  function selectSafeCandidate(stageIndex,p){
    if(!requireEdit())return;
    const m=active(),r=ensureSafeRoute(m),st=r?.stages?.[stageIndex];if(!st||stageIndex<=0)return;
    const reach=safeRouteReachability(r),opts=safeOptions(r,stageIndex),idx=opts.indexOf(p);
    if(idx>=0&&!reach[stageIndex]?.viable?.some(x=>x.index===idx)){alert('Essa possibilidade não possui continuidade válida até a SAFE final.');return;}
    const candidate=safeOptionStage(r,stageIndex,p),parent=r.stages[stageIndex-1];
    if(!safeStageValid(parent)){alert('Selecione primeiro a SAFE '+stageIndex+'.');state.safeEditorStage=stageIndex-1;renderSafeRouteUi();focusSafeStage(stageIndex-1);return;}
    if(!safeStageValid(candidate)||!safeCircleFits(parent,candidate)||!safeLandCheck(candidate).ok){alert('Essa possibilidade não é válida para a SAFE '+stageIndex+' selecionada.');return;}
    st.x=candidate.x;st.y=candidate.y;st.z=0;st.status='planned';st.validatedAt=null;
    state.safeEditorStage=Math.min(stageIndex+1,r.stages.length-1);
    commit('SAFE '+(stageIndex+1)+' selecionada • '+f(st.x)+', '+f(st.y));
    renderSafeRouteUi();renderMap();focusSafeStage(stageIndex);
  }

  function elevationSamples(){
    const out=[];state.missions.forEach(m=>{
      const add=(p,source)=>{if(!p||!validCoord(p.x)||!validCoord(p.y)||!Number.isFinite(Number(p.z))||Number(p.z)===0||!isValidated(p))return;out.push({x:Number(p.x),y:Number(p.y),z:Number(p.z),source,missionId:m.id});};
      add(m.center,'centro');(m.points||[]).forEach(p=>add(p,'spawn'));(m.zonePolygon||[]).forEach(p=>add(p,'zona'));
      const r=hasDynamicSafe(m)?m.safeRoute:null;(r?.stages||[]).forEach(p=>add(p,'safe'));
    });return out;
  }
  function estimateElevation(x,y){
    const samples=elevationSamples().map(p=>({...p,d:Math.hypot(Number(x)-p.x,Number(y)-p.y)})).sort((a,b)=>a.d-b.d).slice(0,8);
    if(!samples.length)return {z:0,confidence:0,count:0,nearest:null};
    const near=samples.filter(p=>p.d<=1200),use=(near.length>=2?near:samples.slice(0,Math.min(3,samples.length)));
    let sw=0,sz=0;use.forEach(p=>{const w=1/Math.max(25,p.d)**2;sw+=w;sz+=p.z*w;});
    const z=sw?sz/sw:use[0].z,nearest=samples[0],spread=use.reduce((a,p)=>a+Math.abs(p.z-z),0)/use.length;
    let confidence=Math.round(Math.max(5,Math.min(98,100-(nearest.d/15)-(spread*1.5)+(Math.min(use.length,5)*5))));
    if(nearest.d>1500)confidence=Math.min(confidence,25);else if(nearest.d>700)confidence=Math.min(confidence,50);
    return {z,confidence,count:use.length,nearest,spread};
  }
  function suggestedMapCoord(m,latlng){
    const c=calibrationModelAt(latlng.lng,latlng.lat),x=Number(latlng.lng)+(c?.dx||0),y=Number(latlng.lat)+(c?.dy||0),e=estimateElevation(x,y);
    return {x,y,z:e.z,elevation:e,calibration:c};
  }
  function calibrationReferences(){
    const refs=[];state.missions.forEach(m=>(m.calibrationRefs||[]).forEach(r=>{if([r.realX,r.realY,r.mapX,r.mapY].every(Number.isFinite))refs.push({...r,dx:Number(r.realX)-Number(r.mapX),dy:Number(r.realY)-Number(r.mapY)});}));
    return refs;
  }
  function calibrationModelAt(x,y){
    const refs=calibrationReferences().map(r=>({...r,d:Math.hypot(Number(x)-Number(r.mapX),Number(y)-Number(r.mapY))})).sort((a,b)=>a.d-b.d).slice(0,8);
    if(!refs.length)return null;const use=refs.filter(r=>r.d<=1800);const chosen=use.length?use:refs.slice(0,Math.min(3,refs.length));let sw=0,dx=0,dy=0;
    chosen.forEach(r=>{const w=1/Math.max(50,r.d)**2;sw+=w;dx+=r.dx*w;dy+=r.dy*w;});dx/=sw;dy/=sw;
    const error=chosen.reduce((a,r)=>a+Math.hypot(r.dx-dx,r.dy-dy),0)/chosen.length,nearest=chosen[0]?.d??Infinity;
    const confidence=Math.round(Math.max(5,Math.min(98,100-nearest/20-error*8+Math.min(chosen.length,5)*4)));
    return {dx,dy,count:chosen.length,error,nearest,confidence};
  }
  function ensureSafeRouteUi(){
    const existing=qs('#mpSafeRouteBox');
    if(existing){
      const coverage=qs('#mpCoverageBox');
      if(coverage&&existing.previousElementSibling!==coverage)coverage.insertAdjacentElement('afterend',existing);
      return;
    }
    const anchor=qs('#mpCoverageBox')||qs('#mpCenterValidation'),zonePanel=plannerPanel('zona');
    if(!anchor&&!zonePanel)return;
    const box=document.createElement('div');box.id='mpSafeRouteBox';box.className='mp-card mp-workflow-card mp-safe-workflow';box.dataset.forceTab='zona';box.style.marginTop='10px';
    box.innerHTML=`<h3>ROTA PROGRESSIVA DA SAFE</h3>
      <p class="mp-note">Fluxo progressivo: <b>FECHA → MOVE → FECHA</b>, com quantas etapas forem necessárias até a SAFE final. Cada etapa define o dano por segundo fora da zona.</p>
      <div id="mpSafeRouteStatus" class="mp-readout"></div>
      <div id="mpSafeStageToolbar" class="mp-actions mp-safe-stage-toolbar" style="display:none;margin-top:8px">
        <button type="button" id="mpAddSafeTop" class="primary">＋ ADICIONAR SAFE</button>
        <button type="button" id="mpRemoveSafeTop" style="display:none">REMOVER ÚLTIMA SAFE</button>
        <button type="button" id="mpSafeViableOnly">GRAFO: TODAS</button>
        <button type="button" id="mpElevationToggle">RELEVO: OFF</button>
      </div>
      <div id="mpSafeTimeline" class="mp-readout" style="margin-top:8px"></div>
      <div id="mpSafeStages"></div>
      <div class="mp-actions" style="display:flex;gap:6px;flex-wrap:wrap">
        <button type="button" id="mpSafePlace1">POSICIONAR SAFE SELECIONADA</button>
        <button type="button" id="mpSafeUseCenter">SAFE 1 = CENTRO ATUAL</button>
        <button type="button" id="mpSafeAuto">⚡ GERAR POSSIBILIDADES</button>
        <button type="button" id="mpSafeFocus">◎ CONFIGURAR SAFES SEM SPAWNS</button>
        <button type="button" id="mpSafePreview" class="primary">▶ SIMULAR EVENTO</button><button type="button" id="mpSafePresent">⛶ APRESENTAR / GRAVAR</button>
        <button type="button" id="mpSafeStop">■ PARAR</button>
      </div>`;
    if(anchor)anchor.insertAdjacentElement('afterend',box);else zonePanel.appendChild(box);
        qs('#mpSafePlace1')?.addEventListener('click',()=>beginSafePlacement(Math.max(0,Number(state.safeEditorStage)||0),false));
    qs('#mpSafeUseCenter')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active(),r=ensureSafeRoute(m);if(!m||!r)return;r.stages[0].x=num(m.center.x);r.stages[0].y=num(m.center.y);r.stages[0].z=0;commit('Safe 1 vinculada ao centro da missão');});
    qs('#mpSafeAuto')?.addEventListener('click',generateSafeCandidates);
    qs('#mpSafeFocus')?.addEventListener('click',()=>setSafeConfigView(!state.safeConfigView));
    qs('#mpSafePreview')?.addEventListener('click',startSafePreview);
    qs('#mpSafePresent')?.addEventListener('click',startSafePresentation);
    qs('#mpSafeStop')?.addEventListener('click',()=>{stopSafePreview();exitSafePresentation();});
    qs('#mpAddSafeTop')?.addEventListener('click',addDynamicSafeStage);
    qs('#mpRemoveSafeTop')?.addEventListener('click',removeDynamicSafeStage);
    qs('#mpSafeViableOnly')?.addEventListener('click',()=>{state.safeGraphViableOnly=!state.safeGraphViableOnly;const b=qs('#mpSafeViableOnly');if(b)b.textContent=state.safeGraphViableOnly?'GRAFO: VIÁVEIS':'GRAFO: TODAS';renderMap();});
    qs('#mpElevationToggle')?.addEventListener('click',()=>{state.showElevationKnowledge=!state.showElevationKnowledge;const b=qs('#mpElevationToggle');if(b)b.textContent=state.showElevationKnowledge?'RELEVO: ON':'RELEVO: OFF';renderMap();});
  }
  function safePlacementCheck(latlng){
    const m=active(),idx=state.safePlacementStage;if(!m||idx===null||!latlng)return {ok:false,reason:'Marcação inativa.'};
    const r=ensureSafeRoute(m),child=r?.stages?.[idx];if(!child||!Number(child.radius)>0)return {ok:false,reason:'Defina primeiro o raio desta SAFE.'};
    const candidate={...child,x:latlng.lng,y:latlng.lat,z:0};
    const land=safeLandCheck(candidate);if(!land.ok)return {ok:false,reason:land.reason};
    let parents=[];
    if(idx===0)parents=[{x:m.center?.x,y:m.center?.y,z:0,radius:effectiveEventRadius(m)}];
    else{
      parents=safeParentCandidates(r,idx);
    }
    if(!parents.length)return {ok:false,reason:'Defina uma SAFE anterior válida primeiro.'};
    const fitting=parents.filter(parent=>safeCircleFits(parent,candidate));
    if(!fitting.length){
      const maxMove=Math.max(0,...parents.map(parent=>Number(parent.radius)-Number(candidate.radius)));
      return {ok:false,reason:`Fora da área possível. O centro desta SAFE precisa ficar a no máximo ~${Math.round(maxMove)} m do centro válido anterior.`};
    }
    const next=r.stages[idx+1];
    if(next&&safeStageValid(next)&&!safeCircleFits(candidate,next))return {ok:false,reason:`Este ponto cabe na SAFE anterior, mas deixaria a SAFE ${idx+2} atual fora da progressão.`};
    return {ok:true,reason:'POSIÇÃO VÁLIDA • clique para marcar'};
  }
  function clearSafeHover(){
    if(state.safeHoverMarker&&state.map){try{state.map.removeLayer(state.safeHoverMarker)}catch(e){}}
    state.safeHoverMarker=null;
  }
  function previewSafePlacement(latlng){
    const chk=safePlacementCheck(latlng),m=active(),idx=state.safePlacementStage,r=ensureSafeRoute(m),stage=r?.stages?.[idx];
    if(!stage)return;
    const radius=Math.max(1,Number(stage.radius)||1);
    if(!state.safeHoverMarker)state.safeHoverMarker=L.circle(latlng,{radius,weight:3,fillOpacity:.08,interactive:false}).addTo(state.map);
    else{state.safeHoverMarker.setLatLng(latlng);state.safeHoverMarker.setRadius(radius);}
    state.safeHoverMarker.setStyle(chk.ok?{color:'#52ff9a',fillColor:'#52ff9a'}:{color:'#ff5252',fillColor:'#ff5252'});
    const mapEl=state.map?.getContainer();if(mapEl)mapEl.style.cursor=chk.ok?'crosshair':'not-allowed';
    const status=qs('#mpSafeRouteStatus');if(status)status.innerHTML=`<b>MARCAÇÃO ATIVA: SAFE ${idx+1}</b><br><span style="color:${chk.ok?'#52ff9a':'#ff7474'}"><b>${esc(chk.reason)}</b></span>`;
  }
  function beginSafePlacement(stageIndex,asOption=false){
    if(!requireEdit())return;
    const m=active();if(!m||((m.category||'dominacao')!=='gas'))return;
    const r=ensureSafeRoute(m);if(!r?.stages?.[stageIndex])return;resetMapPlacementModes();state.safeEditorStage=stageIndex;state.safePlacementStage=stageIndex;state.safePlacementAsOption=!!asOption;state.mapMode=asOption?'safe-option':'safe-stage';
    const status=qs('#mpSafeRouteStatus');if(status)status.innerHTML=`<b>MARCAÇÃO ATIVA: SAFE ${stageIndex+1}</b><br>Mova o mouse: verde permite marcar; vermelho bloqueia o clique.`;
    if(state.map?.getContainer())state.map.getContainer().style.cursor='crosshair';
  }
  function placeSafeOnMap(latlng){
    const m=active(),idx=state.safePlacementStage;if(!m||idx===null||idx===undefined)return false;
    const check=safePlacementCheck(latlng);
    if(!check.ok){previewSafePlacement(latlng);if(qs('#mpClicked'))qs('#mpClicked').textContent='SAFE BLOQUEADA • '+check.reason;return false;}
    const r=ensureSafeRoute(m),s=r?.stages?.[idx];if(!s)return false;
    const asOption=state.mapMode==='safe-option';
    if(asOption&&idx>0){
      const opts=safeOptions(r,idx,true),candidate={x:latlng.lng,y:latlng.lat,z:0};
      if(!opts.some(p=>distXY(p,candidate)<1))opts.push(candidate);
    }else{s.x=latlng.lng;s.y=latlng.lat;s.z=0;}
    state.safeEditorStage=idx;state.safePlacementStage=null;state.safePlacementAsOption=false;state.mapMode='center';clearSafeHover();if(state.map?.getContainer())state.map.getContainer().style.cursor='';
    commit(`${asOption?'Possibilidade da SAFE':'Safe'} ${idx+1} marcada no mapa`);
    state.map?.panTo(latlng);renderSafeRouteUi();return true;
  }
  function safeStageMinRadius(index){return Number(index)>=3?10:30;}
  function addDynamicSafeStage(){
    if(!requireEdit())return;const m=active(),r=ensureSafeRoute(m,true);if(!m||!r)return;
    const nextIndex=r.stages.length,prev=r.stages[nextIndex-1],prevRadius=Number(prev?.radius)||100,minRadius=safeStageMinRadius(nextIndex),radius=Math.max(minRadius,Math.round(prevRadius*.6));
    if(radius>=prevRadius){setSaveState('Não há espaço de raio para adicionar outra SAFE. Reduza o raio da SAFE final atual primeiro.');return;}
    if(prev)prev.moveSeconds=Math.max(60,Number(prev.moveSeconds)||0);
    r.stages.push({x:null,y:null,z:null,radius,damage:Math.max(5,Number(prev?.damage)||5),closeSeconds:120,moveSeconds:0});state.safeEditorStage=r.stages.length-1;
    commit('Nova etapa de SAFE adicionada');renderSafeRouteUi();
  }
  function removeDynamicSafeStage(){
    if(!requireEdit())return;const m=active(),r=ensureSafeRoute(m);if(!r||r.stages.length<=3)return;
    r.stages.pop();r.stages[r.stages.length-1].moveSeconds=0;commit('Última etapa de SAFE removida');renderSafeRouteUi();
  }
  function renderSafeRouteUi(){
    ensureSafeRouteUi();const box=qs('#mpSafeRouteBox'),m=active();if(!box||!m)return;
    const gas=(m.category||'dominacao')==='gas';
    box.style.display=gas?'block':'none';if(!gas)return;
    const coverage=qs('#mpCoverageBox');
    if(coverage&&box.previousElementSibling!==coverage)coverage.insertAdjacentElement('afterend',box);
    const host=qs('#mpSafeStages'),status=qs('#mpSafeRouteStatus'),toolbar=qs('#mpSafeStageToolbar');if(!host)return;
    if(!hasDynamicSafe(m)){
      if(toolbar)toolbar.style.display='none';
      const tl=qs('#mpSafeTimeline');if(tl)tl.innerHTML='<b>SAFE DINÂMICA • NÃO CONFIGURADA</b><br><span style="opacity:.78">Esta missão permanece com a configuração atual até você implementar e salvar a nova rota.</span>';
      host.innerHTML='<div class="mp-readout mp-safe-legacy"><b>CONFIGURAÇÃO LEGADA PRESERVADA</b><br><span style="opacity:.8">Você pode preparar a SAFE dinâmica, validar CDS, tempos e simular tudo antes de salvar. Nada será aplicado automaticamente.</span><div class="mp-actions" style="margin-top:10px"><button type="button" id="mpEnableDynamicSafe" class="primary">IMPLEMENTAR SAFE DINÂMICA</button></div></div>';
      if(status)status.innerHTML='<b>SAFE DINÂMICA DISPONÍVEL</b> • ainda não implementada';
      qs('#mpEnableDynamicSafe',host)?.addEventListener('click',()=>{if(!requireEdit())return;ensureSafeRoute(m,true);commit('Safe dinâmica preparada para implementação');renderSafeRouteUi();renderMap();});
      return;
    }
    const r=ensureSafeRoute(m),timeline=safeTimeline(m),audit=safeRouteAudit(m),initial=effectiveEventRadius(m),tl=qs('#mpSafeTimeline');
    if(toolbar){toolbar.style.display='flex';const rm=qs('#mpRemoveSafeTop');if(rm)rm.style.display=r.stages.length>3?'inline-flex':'none';const gv=qs('#mpSafeViableOnly');if(gv)gv.textContent=state.safeGraphViableOnly?'GRAFO: VIÁVEIS':'GRAFO: TODAS';const et=qs('#mpElevationToggle');if(et)et.textContent=state.showElevationKnowledge?'RELEVO: ON':'RELEVO: OFF';}

    if(tl){const total=safeTotalSeconds(m);tl.innerHTML='<b>TIMELINE COMPLETA • DURAÇÃO ESTIMADA: '+formatDuration(total)+'</b><br>'+timeline.map(x=>{const mm=Math.floor(x.at/60),ss=String(x.at%60).padStart(2,'0');return mm+':'+ss+' • '+x.label+(x.duration?' ('+formatDuration(x.duration)+')':'')+' • '+Math.round(x.radius)+' m';}).join('<br>')+(audit.length?'<br><span style="color:#ff7474"><b>ATENÇÃO:</b> '+esc(audit.join(' • '))+'</span>':'');}
    const openSafe=Math.min(Math.max(0,Number(state.safeEditorStage)||0),r.stages.length-1);state.safeEditorStage=openSafe;
    host.innerHTML=r.stages.map((st,i)=>{const valid=safeStageValid(st),land=valid?safeLandCheck(st):{ok:false},optAudit=i>0?safeOptionAudit(r,i):null,reach=i>0?safeRouteReachability(r)[i]:null,parent=i===0?{x:m.center?.x,y:m.center?.y,z:0,radius:initial}:r.stages[i-1],fits=valid&&safeCircleFits(parent,st),stageOk=valid&&land.ok&&fits,open=i===openSafe;return `<section class="mp-safe-stage ${open?'open':''} ${stageOk?'ok':'pending'}" data-safe-card="${i}">
      <button type="button" class="mp-safe-stage-head" data-safe-toggle="${i}" aria-expanded="${open?'true':'false'}">
        <span><b>SAFE ${i+1}${i===r.stages.length-1?' • FINAL':''}</b><small>${stageOk?'✓ VÁLIDA':valid?'⚠ REVISAR':'○ PENDENTE'}</small></span>
        <span class="mp-safe-stage-summary">${Math.round(Number(st.radius)||0)} m · ${formatDuration(Number(st.closeSeconds)||0)}${i<r.stages.length-1?' · move '+formatDuration(Number(st.moveSeconds)||0):''}${i>0&&optAudit.all.length?' · opções '+optAudit.valid.length+'/'+optAudit.all.length:''}</span>
        <i>${open?'−':'+'}</i>
      </button>
      <div class="mp-safe-stage-body">
        <div class="mp-grid">
          <label>X<input data-safe="${i}" data-k="x" inputmode="decimal" value="${st.x??''}"></label>
          <label>Y<input data-safe="${i}" data-k="y" inputmode="decimal" value="${st.y??''}"></label>
          <label>Raio final (m)<input data-safe="${i}" data-k="radius" type="number" min="${safeStageMinRadius(i)}" value="${st.radius??''}"></label>
          <label>Dano<input data-safe="${i}" data-k="damage" type="number" min="0" value="${st.damage??''}"></label>
          <label>Fechamento (s)<input data-safe="${i}" data-k="closeSeconds" type="number" min="1" value="${st.closeSeconds??''}"></label>
          ${i<r.stages.length-1?`<label>Movimento (s)<input data-safe="${i}" data-k="moveSeconds" type="number" min="1" value="${st.moveSeconds??''}"></label>`:''}
        </div>
        ${i>0&&optAudit.all.length?`<div class="mp-safe-option-audit ${optAudit.invalid.length||reach?.dead?.some(x=>x.index>=0)?'has-invalid':'all-valid'}"><b>POSSIBILIDADES: ${optAudit.valid.length}/${optAudit.all.length} VÁLIDAS • ${reach?.viable?.filter(x=>x.index>=0).length||0} CHEGAM À FINAL</b>${optAudit.invalid.length||reach?.dead?.some(x=>x.index>=0)?`<div>${optAudit.invalid.map(x=>`<button type="button" data-safe-option-remove="${i}" data-index="${x.index}" title="${esc(x.reason)}">S${i+1}-${x.index+1} INVÁLIDA ×</button>`).join(' ')} ${(reach?.dead||[]).filter(x=>x.index>=0&&!optAudit.invalid.some(y=>y.index===x.index)).map(x=>`<button type="button" data-safe-option-remove="${i}" data-index="${x.index}" title="Caminho sem continuidade até a SAFE final">S${i+1}-${x.index+1} SEM SAÍDA ×</button>`).join(' ')}</div>`:''}</div>`:''}
        <div class="mp-actions mp-safe-stage-actions">
          <button type="button" data-safe-place="${i}">◎ POSICIONAR SAFE ${i+1} NO MAPA</button>
          ${i>0?`<button type="button" data-safe-option="${i}">＋ ADICIONAR POSSIBILIDADE</button><button type="button" data-safe-clear="${i}" ${safeOptions(r,i).length?'':'disabled'}>LIMPAR ${safeOptions(r,i).length} OPÇ${safeOptions(r,i).length===1?'ÃO':'ÕES'}</button>`:''}
          ${i===r.stages.length-1?`<button type="button" data-safe-add-next="${i+1}" class="primary">＋ ADICIONAR SAFE ${i+2}</button>`:''}
        </div>
      </div>
    </section>`;}).join('');
    qsa('[data-safe-toggle]',host).forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();selectSafeStage(Number(btn.dataset.safeToggle));}));
    qsa('[data-safe-place]',host).forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const i=Number(btn.dataset.safePlace);selectSafeStage(i,{focus:false});beginSafePlacement(i,false);}));
    qsa('[data-safe-option]',host).forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const i=Number(btn.dataset.safeOption);selectSafeStage(i,{focus:false});beginSafePlacement(i,true);}));
    qsa('[data-safe-clear]',host).forEach(btn=>btn.addEventListener('click',()=>{if(!requireEdit())return;const i=Number(btn.dataset.safeClear);setSafeOptions(r,i,[]);commit('Possibilidades da SAFE '+(i+1)+' removidas');renderSafeRouteUi();renderMap();}));
    qsa('[data-safe-add-next]',host).forEach(btn=>btn.addEventListener('click',()=>addDynamicSafeStage()));
    qsa('[data-safe-option-remove]',host).forEach(btn=>btn.addEventListener('click',()=>{if(!requireEdit())return;const i=Number(btn.dataset.safeOptionRemove),n=Number(btn.dataset.index),opts=safeOptions(r,i,true);if(!opts[n])return;opts.splice(n,1);commit('Possibilidade inválida S'+(i+1)+'-'+(n+1)+' removida');renderSafeRouteUi();renderMap();}));
    qsa('[data-safe]',host).forEach(inp=>inp.addEventListener('change',e=>{if(!requireEdit())return;const mm=active(),rr=ensureSafeRoute(mm),i=Number(e.target.dataset.safe),k=e.target.dataset.k,v=Number(e.target.value);if(!Number.isFinite(v)){renderSafeRouteUi();return;}const snapshot=JSON.parse(JSON.stringify(rr.stages));rr.stages[i][k]=k==='radius'?Math.max(safeStageMinRadius(i),v):v;if((k==='x'||k==='y'||k==='radius')&&safeStageValid(rr.stages[i])){const parent=i===0?{x:mm.center?.x,y:mm.center?.y,z:0,radius:effectiveEventRadius(mm)}:rr.stages[i-1];let reason='';if(parent&&!safeCircleFits(parent,rr.stages[i]))reason='precisa caber completamente dentro da etapa anterior';else{const land=safeLandCheck(rr.stages[i]);if(!land.ok)reason=land.reason;}if(!reason&&i<rr.stages.length-1&&safeStageValid(rr.stages[i+1])&&!safeCircleFits(rr.stages[i],rr.stages[i+1]))reason='a alteração deixaria a SAFE '+(i+2)+' fora da SAFE '+(i+1);if(!reason&&i<rr.stages.length-1){const nextOpts=safeOptions(rr,i+1);const bad=nextOpts.some(p=>validCoord(p.x)&&validCoord(p.y)&&!safeCircleFits(rr.stages[i],{...rr.stages[i+1],x:p.x,y:p.y,z:0}));if(bad)reason='a alteração invalidaria opção já configurada da SAFE '+(i+2);}if(reason){rr.stages=snapshot;setSaveState('SAFE '+(i+1)+' rejeitada • '+reason);renderSafeRouteUi();renderMap();return;}}commit('Rota da Safe alterada');}));
    const ok=r.stages.filter(safeStageValid).length;
    const optionStages=[];
    for(let i=1;i<r.stages.length;i++){
      const all=safeOptions(r,i),audit=safeOptionAudit(r,i),validSet=new Set(audit.valid.map(x=>x.index));
      optionStages.push({stage:i,all,audit,invalid:all.map((p,index)=>({p,index})).filter(x=>!validSet.has(x.index))});
    }
    const optionTotal=optionStages.reduce((n,x)=>n+x.all.length,0);
    const opts=document.createElement('div');opts.className='mp-note';opts.style.marginTop='8px';
    const summaries=optionStages.map(x=>`Safe ${x.stage+1} válidas: <b>${x.audit.valid.length}/${x.all.length}</b>`).join(' • ');
    const invalidButtons=optionStages.flatMap(x=>x.invalid.map(v=>`<button type="button" data-safe-remove="${x.stage+1}" data-index="${v.index}" title="Remover opção inválida da Safe ${x.stage+1}">S${x.stage+1}-${v.index+1} ×</button>`)).join(' ');
    opts.innerHTML=`Modo do preview: <b>${optionTotal?'ALEATÓRIO/MISTO':'ROTA FIXA'}</b>${summaries?' • '+summaries:''} <button type="button" id="mpSafeClearOptions" style="margin-left:8px">LIMPAR OPÇÕES</button>`+(invalidButtons?`<div style="margin-top:7px;color:#ff8b8b"><b>Opções inválidas:</b> ${invalidButtons}</div>`:'');host.appendChild(opts);
    qsa('[data-safe-remove]',opts).forEach(btn=>btn.addEventListener('click',()=>{if(!requireEdit())return;const stage=Number(btn.dataset.safeRemove),idx=Number(btn.dataset.index),arr=safeOptions(r,stage-1);if(!arr[idx])return;arr.splice(idx,1);setSafeOptions(r,stage-1,arr);commit('Opção inválida da Safe '+stage+' removida');}));
    qs('#mpSafeClearOptions')?.addEventListener('click',()=>{if(!requireEdit())return;for(let i=1;i<r.stages.length;i++)setSafeOptions(r,i,[]);r.stages.slice(1).forEach(st=>{st.x=null;st.y=null;});commit('Opções aleatórias da Safe removidas');});
    status.innerHTML=`Raio inicial: <b>${Math.round(initial)} m</b> • Etapas válidas: <b>${ok}/${r.stages.length}</b> • Evento: <b>${formatDuration(safeTotalSeconds(m))}</b>${state.safeConfigView?' • <b>SPAWNS OCULTOS</b>':''}<br><small>SAFE selecionada: <b>${openSafe+1}</b>${openSafe>0?` • caminhos viáveis: <b>${safeRouteReachability(r)[openSafe]?.viable?.length||0}</b>`:''} • Qualquer SAFE 2+ pode ter múltiplas possibilidades. A simulação monta apenas combinações compatíveis etapa por etapa.</small>`;
  }
  function selectSafeStage(index,{focus=true,cancelPlacement=true}={}){
    const m=active(),r=ensureSafeRoute(m);if(!r?.stages?.length)return false;
    const raw=Number(index);if(!Number.isInteger(raw))return false;
    const i=Math.max(0,Math.min(raw,r.stages.length-1));
    if(cancelPlacement&&(state.safePlacementStage!==null||state.mapMode==='safe-stage'||state.mapMode==='safe-option'))resetMapPlacementModes();
    state.safeEditorStage=i;
    renderMap();
    if(focus)focusSafeStage(i);
    return true;
  }
  function focusSafeStage(index){
    const m=active(),r=ensureSafeRoute(m);if(!state.map||!r)return;const i=Math.max(0,Math.min(Number(index)||0,r.stages.length-1)),st=r.stages[i];
    if(!safeStageValid(st))return;
    const radius=Math.max(80,Number(st.radius)||80),pad=Math.max(radius*1.35,160);
    try{state.map.fitBounds([[Number(st.y)-pad,Number(st.x)-pad],[Number(st.y)+pad,Number(st.x)+pad]],{maxZoom:5,animate:true,duration:.35});}catch(e){}
  }
  function safeTransitionGeometry(parent,child){
    if(!safeStageValid(parent)||!safeStageValid(child))return null;
    const distance=distXY(parent,child),available=Number(parent.radius)-Number(child.radius),margin=available-distance;
    return {distance,available,margin,ok:margin>=-.01,overflow:Math.max(0,-margin)};
  }
  function drawSafePlacementEnvelope(m,r){
    if(!state.map||!r?.stages?.length)return;
    const idx=Math.max(0,Math.min(Number(state.safeEditorStage)||0,r.stages.length-1)),child=r.stages[idx];
    if(!Number(child?.radius)>0)return;
    const parents=idx===0?[{x:m.center?.x,y:m.center?.y,z:0,radius:effectiveEventRadius(m)}]:safeParentCandidates(r,idx);
    parents.filter(safeStageValid).forEach((parent,j)=>{
      const allowed=Math.max(0,Number(parent.radius)-Number(child.radius));if(!allowed)return;
      const circle=L.circle(ll(parent.x,parent.y),{radius:allowed,weight:3,color:'#38bdf8',opacity:.82,fillColor:'#38bdf8',fillOpacity:.045,dashArray:'6 7',interactive:true}).addTo(state.map);
      circle.bindPopup('<b>ÁREA VÁLIDA DO CENTRO • SAFE '+(idx+1)+'</b><br>O centro da SAFE '+(idx+1)+' pode ficar dentro deste limite.<br>Raio da SAFE anterior: '+Math.round(Number(parent.radius))+'m<br>Raio da SAFE '+(idx+1)+': '+Math.round(Number(child.radius))+'m<br><b>Deslocamento máximo: '+Math.round(allowed)+'m</b>');
      state.drawn.push(circle);
      if(j===0){
        const icon=L.divIcon({className:'',html:'<div style="white-space:nowrap;background:#075985;color:#e0f2fe;border:1px solid #38bdf8;border-radius:7px;padding:3px 6px;font:800 9px system-ui">CENTRO S'+(idx+1)+' ≤ '+Math.round(allowed)+'m</div>',iconSize:[112,20],iconAnchor:[56,-8]});
        state.drawn.push(L.marker(ll(parent.x,parent.y),{icon,interactive:false,zIndexOffset:900}).addTo(state.map));
      }
    });
  }
  function drawSafeTransitionDiagnostics(m,r){
    if(!state.map||!r?.stages?.length)return;
    const chain=[{x:m.center?.x,y:m.center?.y,z:0,radius:effectiveEventRadius(m)},...r.stages];
    for(let i=1;i<chain.length;i++){
      const parent=chain[i-1],child=chain[i],g=safeTransitionGeometry(parent,child);if(!g)continue;
      const from=i===1?'INICIAL':'S'+(i-1),to='S'+i,color=g.ok?'#22c55e':'#ef4444';
      const line=L.polyline([ll(parent.x,parent.y),ll(child.x,child.y)],{weight:g.ok?2.2:5,dashArray:g.ok?'5 7':'12 6',opacity:g.ok?.34:.95,color,interactive:true}).addTo(state.map);
      const mid={x:(Number(parent.x)+Number(child.x))/2,y:(Number(parent.y)+Number(child.y))/2};
      const label=g.ok?'MARGEM +'+Math.round(g.margin)+'m':'EXCEDE '+Math.round(g.overflow)+'m';
      line.bindPopup('<b>'+from+' → '+to+'</b><br>Distância entre centros: '+Math.round(g.distance)+'m<br>Deslocamento máximo permitido: '+Math.round(g.available)+'m<br><b style="color:'+color+'">'+label+'</b>');
      if(!g.ok){
        const icon=L.divIcon({className:'',html:'<div style="white-space:nowrap;background:#7f1d1d;color:#fff;border:2px solid #f87171;border-radius:8px;padding:4px 7px;font:900 10px system-ui;box-shadow:0 4px 14px rgba(0,0,0,.45)">⚠ '+from+'→'+to+' • +'+Math.round(g.overflow)+'m</div>',iconSize:[120,24],iconAnchor:[60,12]});
        const mk=L.marker(ll(mid.x,mid.y),{icon,interactive:true,zIndexOffset:1800}).addTo(state.map).bindPopup('<b>TRANSIÇÃO INVÁLIDA</b><br>'+from+' → '+to+' ultrapassa o encaixe possível em <b>'+Math.round(g.overflow)+'m</b>.<br>Distância atual: '+Math.round(g.distance)+'m<br>Máximo permitido: '+Math.round(g.available)+'m');
        mk.on('click',()=>{state.safeEditorStage=Math.max(0,i-1);renderSafeRouteUi();});
        state.drawn.push(mk);
      }
      state.drawn.push(line);
    }
  }
  function drawSafeRoute(m){
    if(!state.map||!m||((m.category||'dominacao')!=='gas'))return;
    const r=ensureSafeRoute(m);if(!r)return;
    const valid=r.stages.filter(safeStageValid),reach=safeRouteReachability(r);drawSafePlacementEnvelope(m,r);drawSafeTransitionDiagnostics(m,r);
    for(let idx=1;idx<r.stages.length;idx++){const opts=safeOptions(r,idx).filter(p=>validCoord(p.x)&&validCoord(p.y)),audit=safeOptionAudit(r,idx);opts.forEach((p,j)=>{const parent=r.stages[idx-1],candidate=safeOptionStage(r,idx,p),ok=safeStageValid(parent)&&safeCircleFits(parent,candidate)&&safeLandCheck(candidate).ok,viable=!!reach[idx]?.viable?.some(x=>x.index===j);if(safeStageValid(parent)){const line=L.polyline([ll(parent.x,parent.y),ll(p.x,p.y)],{weight:1.6,dashArray:'6 7',opacity:ok?.5:.8,color:ok&&viable?'#22c55e':'#ef4444',interactive:false}).addTo(state.map);state.drawn.push(line);}const quality=Number(p.score)||0,bg=!ok||!viable?'#991b1b':quality>=90?'#14532d':quality>=80?'#166534':'#365314',icon=L.divIcon({className:'',html:`<div class="mp-center-pin" style="font-size:9px;font-weight:900;background:${bg};border-color:${ok&&viable?'#4ade80':'#f87171'}">S${idx+1}-${j+1}</div>`,iconSize:[38,30],iconAnchor:[19,15]});const pin=L.marker(ll(p.x,p.y),{icon}).addTo(state.map).bindPopup(`<b>SAFE ${idx+1} • OPÇÃO ${j+1}</b><br>${ok&&viable?'✓ Rota viável':'⚠ Sem continuidade válida'}<br>CDS: ${f(p.x)}, ${f(p.y)}, 0.00`);if(ok&&viable)pin.on('click',()=>{if(state.editing)selectSafeCandidate(idx,p);});state.drawn.push(pin);});}
    if(valid.length>1){const line=L.polyline(valid.map(st=>ll(st.x,st.y)),{weight:4,dashArray:'10 8',opacity:.85,interactive:false}).addTo(state.map);state.drawn.push(line);}
    const selectedOptStage=Math.max(1,Math.min(Number(state.safeEditorStage)||1,r.stages.length-1)),selectedOpts=safeOptions(r,selectedOptStage).filter(p=>validCoord(p.x)&&validCoord(p.y)),reachStage=reach[selectedOptStage];
    if(selectedOpts.length){
      const graphStages=[selectedOptStage-1,selectedOptStage,selectedOptStage+1].filter(i=>i>=0&&i<r.stages.length),graphNodes={};
      graphStages.forEach(i=>{const opts=i>0?safeOptions(r,i).filter(p=>validCoord(p.x)&&validCoord(p.y)):[];graphNodes[i]=opts.length?opts.map((p,j)=>({stage:safeOptionStage(r,i,p),index:j,viable:!!reach[i]?.viable?.some(x=>x.index===j)})):(safeStageValid(r.stages[i])?[{stage:r.stages[i],index:-1,viable:i===0||i===r.stages.length-1||!!reach[i]?.viable?.some(x=>x.index===-1)}]:[]);});
      for(let gi=0;gi<graphStages.length-1;gi++){const aIdx=graphStages[gi],bIdx=graphStages[gi+1];if(bIdx!==aIdx+1)continue;(graphNodes[aIdx]||[]).forEach(a=>(graphNodes[bIdx]||[]).forEach(b=>{if(!safeCircleFits(a.stage,b.stage))return;const full=!!a.viable&&!!b.viable;if(state.safeGraphViableOnly&&!full)return;const line=L.polyline([ll(a.stage.x,a.stage.y),ll(b.stage.x,b.stage.y)],{weight:full?3:1.5,dashArray:full?'8 6':'3 8',opacity:full?.72:.24,color:full?'#4ade80':'#facc15',interactive:false}).addTo(state.map);state.drawn.push(line);}));}
      let parents=selectedOptStage===1?[r.stages[0]]:safeOptions(r,selectedOptStage-1).filter(p=>validCoord(p.x)&&validCoord(p.y)).map(p=>safeOptionStage(r,selectedOptStage-1,p));
      if(!parents.length&&safeStageValid(r.stages[selectedOptStage-1]))parents.push(r.stages[selectedOptStage-1]);
      selectedOpts.forEach((p,j)=>{const candidate=safeOptionStage(r,selectedOptStage,p),localOk=parents.some(parent=>safeCircleFits(parent,candidate))&&safeLandCheck(candidate).ok,viable=!!reachStage?.viable?.some(x=>x.index===j),dead=localOk&&!viable;
        const bg=!localOk?'#991b1b':dead?'#854d0e':'#14532d',border=!localOk?'#f87171':dead?'#facc15':'#4ade80',label=dead?'SEM SAÍDA':localOk?'CHEGA À FINAL':'INVÁLIDA';
        const pin=L.marker(ll(p.x,p.y),{icon:L.divIcon({className:'',html:`<div class="mp-center-pin" style="font-size:9px;font-weight:900;background:${bg};border-color:${border}">S${selectedOptStage+1}-${j+1}</div>`,iconSize:[38,28],iconAnchor:[19,14]})}).addTo(state.map).bindPopup(`<b>SAFE ${selectedOptStage+1} • POSSIBILIDADE ${j+1}</b><br><b style="color:${border}">${label}</b><br>CDS: ${f(p.x)}, ${f(p.y)}, 0.00${viable?'<br><small>Clique no marcador para usar como posição fixa.</small>':''}`);
        if(viable)pin.on('click',()=>{if(!state.editing)return;selectSafeCandidate(selectedOptStage,p);state.safeEditorStage=selectedOptStage;renderSafeRouteUi();renderMap();focusSafeStage(selectedOptStage);});
        state.drawn.push(pin);
      });
    }
    const selected=Math.max(0,Math.min(Number(state.safeEditorStage)||0,r.stages.length-1));
    r.stages.forEach((s,i)=>{if(!safeStageValid(s))return;
      const parent=i===0?{x:m.center?.x,y:m.center?.y,z:0,radius:effectiveEventRadius(m)}:r.stages[i-1],routeOk=!!parent&&safeCircleFits(parent,s)&&safeLandCheck(s).ok,isCurrent=i===selected,isParent=i===selected-1,isNext=i===selected+1;
      const context=isCurrent?'ATUAL':isParent?'ANTERIOR':isNext?'PRÓXIMA':'';
      const color=!routeOk?'#ef4444':isCurrent?'#d8b4fe':isParent?'#38bdf8':isNext?'#facc15':undefined;
      const circle=L.circle(ll(s.x,s.y),{radius:Number(s.radius),weight:isCurrent?6:(isParent||isNext?4:2),opacity:isCurrent?1:(isParent||isNext?.82:.42),fillOpacity:isCurrent?.08:.018,dashArray:i===r.stages.length-1?'4 4':'10 7',color,fillColor:color,interactive:false}).addTo(state.map);
      const bg=!routeOk?'#991b1b':isCurrent?'#6d28d9':isParent?'#075985':isNext?'#854d0e':'';
      const icon=L.divIcon({className:'',html:`<div class="mp-center-pin ${routeOk?'validated':''} ${isCurrent?'mp-safe-current':''}" style="font-size:11px;font-weight:900;${bg?'background:'+bg+';':''}${!routeOk?'border-color:#f87171':''}">S${i+1}</div>`,iconSize:[isCurrent?38:32,isCurrent?38:32],iconAnchor:[isCurrent?19:16,isCurrent?19:16]});
      const canDrag=!!state.editing&&isCurrent&&!state.safePresentation;
      const pin=L.marker(ll(s.x,s.y),{icon,interactive:true,draggable:canDrag}).addTo(state.map).bindPopup(`<b>SAFE ${i+1}${context?' • '+context:''}</b><br><b style="color:${routeOk?'#4ade80':'#f87171'}">${routeOk?'✓ ROTA VÁLIDA':'⚠ ROTA INVÁLIDA'}</b><br>Raio final: ${Math.round(Number(s.radius))}m<br>Dano: ${Number(s.damage)||0}<br>Fecha: ${Number(s.closeSeconds)||0}s${i<r.stages.length-1?`<br>Move: ${Number(s.moveSeconds)||0}s`:''}${canDrag?'<br><small>Arraste para reposicionar • verde = válido</small>':''}`);
      pin.on('click',()=>selectSafeStage(i));
      if(canDrag){
        const original={x:Number(s.x),y:Number(s.y)};
        pin.on('drag',e=>{const pos=e.target.getLatLng(),candidate={...s,x:pos.lng,y:pos.lat,z:0},parents=i===0?[{x:m.center?.x,y:m.center?.y,z:0,radius:effectiveEventRadius(m)}]:safeParentCandidates(r,i),fits=parents.length&&parents.some(p=>safeCircleFits(p,candidate)),land=safeLandCheck(candidate),next=r.stages[i+1],nextOk=!next||!safeStageValid(next)||safeCircleFits(candidate,next),ok=fits&&land.ok&&nextOk;
          circle.setLatLng(pos);circle.setStyle({color:ok?'#22c55e':'#ef4444',fillColor:ok?'#22c55e':'#ef4444',opacity:1,fillOpacity:.1});
          const el=e.target.getElement()?.querySelector('.mp-center-pin');if(el){el.style.background=ok?'#14532d':'#991b1b';el.style.borderColor=ok?'#4ade80':'#f87171';}
          const status=qs('#mpSafeRouteStatus');if(status){let reason='POSIÇÃO VÁLIDA • solte para confirmar';if(!fits)reason='FORA DO ENCAIXE DA SAFE ANTERIOR';else if(!land.ok)reason=land.reason;else if(!nextOk)reason='A SAFE seguinte deixaria de caber nesta posição';status.innerHTML='<b>ARRASTANDO SAFE '+(i+1)+'</b><br><span style="color:'+(ok?'#52ff9a':'#ff7474')+'"><b>'+esc(reason)+'</b></span>'; }
          e.target._mpDragValid=ok;e.target._mpDragCandidate={x:pos.lng,y:pos.lat};
        });
        pin.on('dragend',e=>{const candidate=e.target._mpDragCandidate,ok=e.target._mpDragValid;if(!candidate||!ok){s.x=original.x;s.y=original.y;renderSafeRouteUi();renderMap();setSaveState('Posição inválida • SAFE '+(i+1)+' mantida na CDS anterior');return;}s.x=candidate.x;s.y=candidate.y;s.z=0;commit('SAFE '+(i+1)+' reposicionada pelo mapa');});
      }
      state.drawn.push(circle,pin);
    });
  }
  function stopSafePreview(){
    if(state.safePreviewTimer){clearInterval(state.safePreviewTimer);state.safePreviewTimer=null;}
    state.safePreviewModel=null;state.safePreviewElapsed=0;state.safePreviewPlaying=false;
    if(state.safePreviewLayer&&state.map){try{state.map.removeLayer(state.safePreviewLayer)}catch{}state.safePreviewLayer=null;}
    if(state.safePreviewMask&&state.map){try{state.map.removeLayer(state.safePreviewMask)}catch{}state.safePreviewMask=null;}
    if(state.safePreviewRouteLayer&&state.map){try{state.map.removeLayer(state.safePreviewRouteLayer)}catch{}state.safePreviewRouteLayer=null;}
    const hud=qs('#mpSafePreviewHud');if(hud)hud.remove();
    if(state.safeTestPlayerMarker&&state.map){try{state.map.removeLayer(state.safeTestPlayerMarker)}catch{}state.safeTestPlayerMarker=null;}
    state.safeTestPlayer=null;qs('#mpSafeTimeline')?.remove();
  }
  function ensurePreviewHud(){
    let hud=qs('#mpSafePreviewHud');if(hud)return hud;const wrap=qs('#missionPlannerMap')?.parentElement;if(!wrap)return null;
    if(getComputedStyle(wrap).position==='static')wrap.style.position='relative';
    hud=document.createElement('div');hud.id='mpSafePreviewHud';Object.assign(hud.style,{position:'absolute',top:'16px',left:'50%',transform:'translateX(-50%)',zIndex:'10050',background:'rgba(8,10,18,.88)',border:'1px solid rgba(192,132,252,.7)',borderRadius:'12px',padding:'10px 16px',color:'#fff',fontWeight:'700',fontFamily:'system-ui',textAlign:'center',pointerEvents:'none',boxShadow:'0 10px 30px rgba(0,0,0,.35)'});wrap.appendChild(hud);return hud;
  }
  function fitSafeRouteForPresentation(){
    const m=active(),r=ensureSafeRoute(m);if(!m||!r||!state.map)return;const pts=[];
    [...(r.stages||[]),...Object.keys(r.stageOptions||{}).flatMap(k=>safeOptions(r,Number(k)))].forEach(p=>{if(validCoord(p?.x)&&validCoord(p?.y))pts.push(ll(p.x,p.y));});
    if(validCoord(m.center?.x)&&validCoord(m.center?.y))pts.push(ll(m.center.x,m.center.y));
    if(pts.length>1)state.map.fitBounds(L.latLngBounds(pts).pad(.18),{maxZoom:5});else if(pts.length)state.map.setView(pts[0],4);
  }
  function startSafePresentation(){
    const m=active(),r=ensureSafeRoute(m);if(!m||!r||!safeStageValid(r.stages[0])){alert('Configure a rota da Safe antes de apresentar.');return;}
    const el=qs('#missionPlannerMap')?.closest('.mp-map-card')||qs('#missionPlannerMap');if(!el)return;
    state.safePresentationPrev={fullscreen:el.classList.contains('mp-pro-fullscreen'),layerVisibility:{...state.layerVisibility}};
    state.safePresentation=true;el.dataset.safePresentation='1';Object.assign(el.style,{position:'fixed',inset:'0',zIndex:'100000',background:'#05070d',padding:'0'});
    const map=qs('#missionPlannerMap');if(map)map.style.height='100vh';
    qsa('.mp-map-toolbar,.mp-map-status,.leaflet-control-container',el).forEach(x=>{x.dataset.mpPresentationDisplay=x.style.display||'';x.style.display='none';});
    const legend=qs('#mpMapLegend');if(legend)legend.style.display='none';
    // Modo gravação: mantém somente o mapa base e a Safe animada.
    (state.drawn||[]).forEach(l=>{try{if(state.map?.hasLayer(l))state.map.removeLayer(l);}catch(e){}});
    let title=qs('#mpPresentationTitle');if(!title){title=document.createElement('div');title.id='mpPresentationTitle';Object.assign(title.style,{position:'absolute',top:'16px',left:'16px',zIndex:'10040',background:'rgba(5,7,13,.82)',border:'1px solid rgba(255,255,255,.14)',borderRadius:'10px',padding:'9px 12px',color:'#fff',font:'700 13px system-ui',pointerEvents:'none'});el.appendChild(title);}title.innerHTML='SOBREVIVÊNCIA • '+esc(m.name||'ZONA')+'<br><small style="opacity:.65;font-weight:500">Preview visual • ESC para sair</small>';
    setTimeout(()=>{state.map?.invalidateSize();fitSafeRouteForPresentation();setTimeout(startSafePreview,180);},100);
  }
  function exitSafePresentation(){
    if(!state.safePresentation)return;state.safePresentation=false;const prev=state.safePresentationPrev||{},el=qs('[data-safe-presentation="1"]');if(el){delete el.dataset.safePresentation;const wasFullscreen=!!prev.fullscreen;Object.assign(el.style,wasFullscreen?{position:'fixed',inset:'0',zIndex:'99999',background:'#0b1018',padding:'12px'}:{position:'',inset:'',zIndex:'',background:'',padding:''});const map=qs('#missionPlannerMap');if(map)map.style.height=wasFullscreen?'calc(100vh - 24px)':'';qsa('.mp-map-toolbar,.mp-map-status,.leaflet-control-container',el).forEach(x=>{x.style.display=x.dataset.mpPresentationDisplay||'';delete x.dataset.mpPresentationDisplay;});}
    qs('#mpPresentationTitle')?.remove();state.safePresentationPrev=null;renderMap();const legend=qs('#mpMapLegend');if(legend)legend.style.display=qs('#mpLegendToggle')?.checked===false?'none':'';setTimeout(()=>state.map?.invalidateSize(),80);
  }
  function safeGasMask(center,radius){
    if(!state.map||!center)return null;
    const outer=[[-12000,-12000],[-12000,12000],[12000,12000],[12000,-12000]];
    const hole=[],steps=96;
    for(let i=steps;i>=0;i--){const a=Math.PI*2*i/steps;hole.push([Number(center.y)+Math.sin(a)*radius,Number(center.x)+Math.cos(a)*radius]);}
    return L.polygon([outer,hole],{stroke:false,fill:true,fillColor:'#6d28d9',fillOpacity:.48,fillRule:'evenodd',interactive:false}).addTo(state.map);
  }
  function updateSafeGasMask(center,radius){
    if(!state.safePreviewMask||!center)return;
    const outer=[[-12000,-12000],[-12000,12000],[12000,12000],[12000,-12000]],hole=[],steps=96;
    for(let i=steps;i>=0;i--){const a=Math.PI*2*i/steps;hole.push([Number(center.y)+Math.sin(a)*radius,Number(center.x)+Math.cos(a)*radius]);}
    state.safePreviewMask.setLatLngs([outer,hole]);
  }

  function safeTestPlayerStatus(center,radius,damage){
    const p=state.safeTestPlayer;if(!p||!center)return null;const distance=distXY(p,center),margin=Number(radius)-distance,inside=margin>=0;
    return {distance,margin,inside,damage:inside?0:(Number(damage)||0)};
  }
  function updateSafeTestPlayerMarker(){
    if(!state.map||!state.safeTestPlayer)return;
    if(!state.safeTestPlayerMarker){
      const icon=L.divIcon({className:'',html:'<div id="mpSafeTestPlayerPin" style="width:28px;height:28px;border-radius:50%;background:#111827;border:3px solid #fff;color:#fff;font:900 12px/22px system-ui;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.5)">P</div>',iconSize:[28,28],iconAnchor:[14,14]});
      state.safeTestPlayerMarker=L.marker(ll(state.safeTestPlayer.x,state.safeTestPlayer.y),{icon,draggable:true,zIndexOffset:2000}).addTo(state.map);
      state.safeTestPlayerMarker.on('drag',e=>{const n=e.target.getLatLng();state.safeTestPlayer={x:n.lng,y:n.lat};safePreviewAt(state.safePreviewElapsed);});
    }else state.safeTestPlayerMarker.setLatLng(ll(state.safeTestPlayer.x,state.safeTestPlayer.y));
  }
  function toggleSafeTestPlayer(){
    if(state.safeTestPlayer){if(state.safeTestPlayerMarker&&state.map){try{state.map.removeLayer(state.safeTestPlayerMarker)}catch{}}state.safeTestPlayer=null;state.safeTestPlayerMarker=null;safePreviewAt(state.safePreviewElapsed);return;}
    const model=state.safePreviewModel;if(!model?.route?.length)return;const s=model.route[0];state.safeTestPlayer={x:Number(s.x),y:Number(s.y)};updateSafeTestPlayerMarker();safePreviewAt(state.safePreviewElapsed);
  }
  function safePreviewAt(seconds){
    const model=state.safePreviewModel;if(!model)return;
    const total=model.totalSeconds,elapsed=Math.max(0,Math.min(total,Number(seconds)||0));state.safePreviewElapsed=elapsed;
    let acc=0,p=model.phases[model.phases.length-1],pi=model.phases.length-1;
    for(let i=0;i<model.phases.length;i++){if(elapsed<=acc+model.phases[i].seconds||i===model.phases.length-1){p=model.phases[i];pi=i;break;}acc+=model.phases[i].seconds;}
    const local=Math.max(0,elapsed-acc),u=p.seconds?Math.min(1,local/p.seconds):1,smooth=u*u*(3-2*u);
    let x=p.a.x,y=p.a.y,rad=p.from+(p.to-p.from)*smooth;
    if(p.type==='move'){x=p.a.x+(p.b.x-p.a.x)*smooth;y=p.a.y+(p.b.y-p.a.y)*smooth;}
    state.safePreviewLayer?.setLatLng(ll(x,y));state.safePreviewLayer?.setRadius(rad);updateSafeGasMask({x,y},rad);
    const remain=Math.max(0,Math.ceil(p.seconds-local)),damage=Number(p.damage)||0,hud=ensurePreviewHud();
    const player=safeTestPlayerStatus({x,y},rad,damage);updateSafeTestPlayerMarker();
    if(hud)hud.innerHTML='<div style="font-size:12px;opacity:.72">SOBREVIVÊNCIA • '+model.routeMode+'</div><div>'+p.label+'</div><div style="font-size:13px;font-weight:500">Raio '+Math.round(rad)+' m • dano fora '+damage+' HP/s • fase '+remain+' s • evento '+formatDuration(elapsed)+' / '+formatDuration(total)+'</div><div style="font-size:11px;color:#fca5a5;margin-top:3px">FORA DA SAFE: '+damage+' DE DANO POR SEGUNDO</div>'+(player?'<div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,.15);font-size:12px;color:'+(player.inside?'#86efac':'#fca5a5')+'">PLAYER TESTE: <b>'+(player.inside?'DENTRO DA SAFE':'FORA DA SAFE')+'</b> • distância '+Math.round(player.distance)+'m • '+(player.inside?'margem '+Math.round(player.margin)+'m':'fora por '+Math.round(Math.abs(player.margin))+'m')+' • DPS aplicado '+player.damage+'</div>':'');
    const range=qs('#mpSafeTimeRange'),clock=qs('#mpSafeTimeClock'),play=qs('#mpSafeTimePlay');if(range&&document.activeElement!==range)range.value=String(elapsed);if(clock)clock.textContent=formatDuration(elapsed)+' / '+formatDuration(total);if(play)play.textContent=state.safePreviewPlaying?'❚❚':'▶';
    model.phaseIndex=pi;
  }
  function ensureSafeTimeline(){
    const model=state.safePreviewModel;if(!model)return null;let bar=qs('#mpSafeTimeline');if(bar)return bar;
    const wrap=qs('#missionPlannerMap')?.parentElement;if(!wrap)return null;if(getComputedStyle(wrap).position==='static')wrap.style.position='relative';
    bar=document.createElement('div');bar.id='mpSafeTimeline';Object.assign(bar.style,{position:'absolute',left:'50%',bottom:'18px',transform:'translateX(-50%)',zIndex:'10055',width:'min(760px,calc(100% - 32px))',background:'rgba(8,10,18,.92)',border:'1px solid rgba(255,255,255,.18)',borderRadius:'12px',padding:'9px 12px',color:'#fff',font:'600 12px system-ui',boxShadow:'0 10px 30px rgba(0,0,0,.35)'});
    bar.innerHTML='<div style="display:flex;gap:6px;align-items:center"><button id="mpSafePrevPhase" title="Fase anterior">|◀</button><button id="mpSafeTimePlay" title="Play/Pause">▶</button><button id="mpSafeNextPhase" title="Próxima fase">▶|</button><button id="mpSafeTimeSpeed" title="Velocidade">1x</button><button id="mpSafeTestPlayer" title="Adicionar/remover Player de Teste">P TESTE</button><span id="mpSafeTimeClock" style="min-width:100px;text-align:center">00:00 / '+formatDuration(model.totalSeconds)+'</span><input id="mpSafeTimeRange" type="range" min="0" max="'+model.totalSeconds+'" step="1" value="0" style="flex:1"></div>';
    wrap.appendChild(bar);
    qs('#mpSafeTestPlayer',bar).onclick=()=>{toggleSafeTestPlayer();const b=qs('#mpSafeTestPlayer',bar);if(b)b.textContent=state.safeTestPlayer?'REMOVER P':'P TESTE';};
    qs('#mpSafeTimePlay',bar).onclick=()=>{state.safePreviewPlaying=!state.safePreviewPlaying;safePreviewAt(state.safePreviewElapsed);};
    qs('#mpSafeTimeSpeed',bar).onclick=e=>{state.safePreviewSpeed=state.safePreviewSpeed===1?2:state.safePreviewSpeed===2?4:1;e.currentTarget.textContent=state.safePreviewSpeed+'x';};
    qs('#mpSafeTimeRange',bar).oninput=e=>{state.safePreviewPlaying=false;safePreviewAt(Number(e.target.value));};
    const phaseStart=i=>model.phases.slice(0,Math.max(0,i)).reduce((n,p)=>n+p.seconds,0);
    qs('#mpSafePrevPhase',bar).onclick=()=>{state.safePreviewPlaying=false;safePreviewAt(phaseStart(Math.max(0,(model.phaseIndex||0)-1)));};
    qs('#mpSafeNextPhase',bar).onclick=()=>{state.safePreviewPlaying=false;safePreviewAt(phaseStart(Math.min(model.phases.length-1,(model.phaseIndex||0)+1)));};
    return bar;
  }
  function startSafePreview(){
    const m=active(),r=ensureSafeRoute(m);if(!m||!r||!safeStageValid(r.stages[0])){alert('Configure a Safe 1 antes do preview.');return;}
    const audit=safeRouteAudit(m);
    const blocking=audit.filter(x=>/sem posição fixa ou possibilidade viável|precisa ser menor|ultrapassa os limites|Tempo de fechamento|Tempo de movimento/.test(x));
    if(blocking.length){alert('Não é possível simular enquanto a rota possui erro técnico:\n\n- '+blocking.join('\n- '));return;}
    const reach=safeRouteReachability(r),route=[{...r.stages[0]}];let randomized=false;
    for(let i=1;i<r.stages.length;i++){if(safeOptions(r,i).length&&!(reach[i]?.viable?.some(x=>x.index>=0))){alert('A SAFE '+(i+1)+' possui possibilidades, mas nenhuma mantém caminho até a SAFE final. Corrija a cadeia antes do preview.');return;}}
    for(let i=1;i<r.stages.length;i++){
      const opts=safeOptions(r,i).filter(p=>validCoord(p.x)&&validCoord(p.y)),fixed=r.stages[i],parent=route[i-1],choices=[];
      opts.forEach(p=>{const c=safeOptionStage(r,i,p);if(safeStageValid(c)&&safeCircleFits(parent,c)&&safeLandCheck(c).ok)choices.push(c);});
      if(safeStageValid(fixed)&&safeCircleFits(parent,fixed)&&safeLandCheck(fixed).ok)choices.push({...fixed});
      if(!choices.length){alert('A SAFE '+(i+1)+' não possui posição compatível com a SAFE '+i+'. Corrija a rota antes do preview.');return;}
      const chosen=choices[Math.floor(Math.random()*choices.length)];if(opts.length)randomized=true;route.push(chosen);
    }
    const routeMode=randomized?'ALEATÓRIA/MISTA':'FIXA',s1=route[0];
    stopSafePreview();
    state.safeConfigView=true;state.layerVisibility.spawns=false;renderMap();
    const initial=effectiveEventRadius(m),phases=[];
    route.forEach((st,i)=>{
      phases.push({type:'close',label:'FECHANDO SAFE '+(i+1)+(i===route.length-1?' FINAL':''),a:st,from:i?route[i-1].radius:initial,to:st.radius,damage:Number(st.damage)||0,seconds:Number(st.closeSeconds)||120});
      if(i<route.length-1){
        const next=route[i+1];
        phases.push({type:'move',label:'MOVENDO PARA SAFE '+(i+2),a:st,b:next,from:st.radius,to:st.radius,damage:Number(st.damage)||0,seconds:Number(st.moveSeconds)||60});
      }
    });
    const gasStyle={radius:initial,weight:4,color:'#a855f7',opacity:.92,fillColor:'#7e22ce',fillOpacity:.16,dashArray:'10 7',interactive:false};
    state.safePreviewLayer=L.circle(ll(s1.x,s1.y),{...gasStyle,fillOpacity:0}).addTo(state.map);
    state.safePreviewMask=safeGasMask(s1,initial);
    state.safePreviewRouteLayer=state.safePresentation?null:L.polyline(route.map(x=>ll(x.x,x.y)),{color:'#c084fc',weight:3,opacity:.72,dashArray:'8 8',interactive:false}).addTo(state.map);
    const totalSeconds=phases.reduce((a,p)=>a+p.seconds,0),status=qs('#mpSafeRouteStatus');if(status)status.innerHTML=`<b>SIMULAÇÃO DO EVENTO</b> • rota ${routeMode.toLowerCase()} • duração ${formatDuration(totalSeconds)}<br><small>A área sem cor é a SAFE. Todo o roxo opaco representa o gás fora da zona segura.</small>`;
    state.safePreviewModel={route,phases,totalSeconds,routeMode,phaseIndex:0};state.safePreviewElapsed=0;state.safePreviewPlaying=true;state.safePreviewSpeed=1;ensureSafeTimeline();safePreviewAt(0);
    let last=performance.now();state.safePreviewTimer=setInterval(()=>{const now=performance.now(),dt=(now-last)/1000;last=now;if(!state.safePreviewPlaying)return;const next=state.safePreviewElapsed+dt*state.safePreviewSpeed;if(next>=totalSeconds){state.safePreviewPlaying=false;safePreviewAt(totalSeconds);return;}safePreviewAt(next);},50);
  }

  function drawElevationKnowledge(m){
    if(!state.map||!state.showElevationKnowledge)return;
    const samples=elevationSamples();if(!samples.length)return;
    samples.forEach(p=>{const c=L.circleMarker(ll(p.x,p.y),{radius:4,weight:1,opacity:.75,fillOpacity:.55,interactive:true}).addTo(state.map).bindPopup(`<b>ALTURA CONFIRMADA</b><br>Z ${f(p.z)} • ${esc(p.source)}`);state.drawn.push(c);});
    const bounds=state.map.getBounds?.();if(!bounds)return;
    const sw=bounds.getSouthWest(),ne=bounds.getNorthEast(),nx=7,ny=7;
    for(let ix=0;ix<nx;ix++)for(let iy=0;iy<ny;iy++){
      const x=sw.lng+(ne.lng-sw.lng)*(ix/(nx-1)),y=sw.lat+(ne.lat-sw.lat)*(iy/(ny-1)),e=estimateElevation(x,y);
      if(!e.count||e.confidence<20)continue;
      const icon=L.divIcon({className:'',html:`<div class="mp-elev-label" style="opacity:${Math.max(.35,e.confidence/100)}">Z~${Math.round(e.z)}<small>${e.confidence}%</small></div>`,iconSize:[48,28],iconAnchor:[24,14]});
      const mk=L.marker(ll(x,y),{icon,interactive:false}).addTo(state.map);state.drawn.push(mk);
    }
  }
  function renderMapLegend(m){
    const host=qs('.mission-planner-mapwrap')||qs('#missionPlannerMap')?.parentElement;if(!host)return;let el=qs('#mpMapLegend');
    if(!el){el=document.createElement('div');el.id='mpMapLegend';Object.assign(el.style,{position:'absolute',left:'12px',bottom:'12px',zIndex:'900',background:'rgba(8,10,18,.86)',border:'1px solid rgba(255,255,255,.16)',borderRadius:'10px',padding:'8px 10px',fontSize:'11px',lineHeight:'1.55',color:'#fff',pointerEvents:'none',boxShadow:'0 8px 24px rgba(0,0,0,.3)'});host.appendChild(el);}
    const counts=zoneCoverageCounts(m),valid=(m.points||[]).filter(isValidated).length,total=m.points?.length||0,category=m.category||'dominacao',poly=category==='dominacao'?dominationPolygon(m):[],mode=category==='dominacao'?dominationZoneMode(m):'radius',geom=category==='dominacao'?dominationZoneGeometry(m):null,rawPoly=category==='dominacao'&&Array.isArray(m.zonePolygon)?m.zonePolygon:[];
    const zoneLabel=category==='dominacao'&&mode==='polygon'?(geom?.mode==='polygon'?('⬡ Zona por CDS • '+poly.length+' vértices'):(geom?.mode==='polygon-invalid'?('⚠ Polígono com CDS inválida • '+rawPoly.length+' armazenadas'):('⬡ Polígono em construção • '+poly.length+'/3+ vértices válidos'))):'◯ Zona '+Math.round(effectiveEventRadius(m))+'m';
    const centerLabel=category==='dominacao'&&mode==='polygon'?'':('◎ Centro • ');
    el.innerHTML='<b>'+esc(m.event||'EVENTO')+' • '+esc(m.name||'ZONA')+'</b><br>'+centerLabel+zoneLabel+'<br>Spawns '+valid+'/'+total+' validados'+(category==='gas'?'<br>Safe inicial: '+counts.inside+'/'+counts.total+' dentro'+(counts.outside?' • '+counts.outside+' fora ⚠':' ✓'):'');
  }
  function renderMap(){
    if(!state.map)return;clearLayers();const m=active();if(!m)return;renderSafeRouteUi();renderMapLegend(m);drawElevationKnowledge(m);
    const poly=dominationPolygon(m),hasCenter=validCoord(m.center?.x)&&validCoord(m.center?.y),polyMode=(m.category||'dominacao')==='dominacao'&&dominationZoneMode(m)==='polygon';
    if(hasCenter&&!polyMode){
      const cicon=L.divIcon({className:'',html:`<div class="mp-center-pin ${isCenterValidated(m)?'validated':'planned'}">◎</div>`,iconSize:[32,32],iconAnchor:[16,16]});
      const center=L.marker(ll(m.center.x,m.center.y),{icon:cicon,draggable:state.editing}).addTo(state.map).bindPopup(`<b>${esc(m.center.label||'Centro')}</b><br>Status: <b>${isCenterValidated(m)?'VALIDADO':'PENDENTE'}</b><br>${f(m.center.x)},${f(m.center.y)}${isCenterValidated(m)?','+f(m.center.z)+','+f(m.center.h):',0.00,0.00'}<br><small>${state.editing?'Arraste para ajustar o centro':'Visualização • ponto travado'}</small>`);
      center.on('dragend',ev=>{const n=ev.target.getLatLng();m.center.x=n.lng;m.center.y=n.lat;m.center.z=0;m.center.h=0;m.center.status='planned';m.center.validatedAt=null;m.center.validationReason='coordinate-change';commit('Centro movido no mapa — validação removida');});center._mpKind='center';state.drawn.push(center);
    }
    if((m.category||'dominacao')==='dominacao'&&(m.zoneMode||(poly.length>=3?'polygon':'radius'))==='polygon'&&poly.length){
      const geom=dominationZoneGeometry(m),canClose=geom.mode==='polygon';if(canClose){const zone=L.polygon(poly.map(p=>ll(p.x,p.y)),{weight:2,fillOpacity:.055,interactive:false}).addTo(state.map);zone._mpKind='zone';state.drawn.push(zone);}else{const raw=Array.isArray(m.zonePolygon)?m.zonePolygon:[];let run=[];const flush=()=>{if(run.length>=2){const line=L.polyline(run.map(p=>ll(p.x,p.y)),{weight:2,dashArray:'6 7',opacity:.85,interactive:false}).addTo(state.map);line._mpKind='zone';state.drawn.push(line);}run=[];};raw.forEach(v=>{if(validCoord(v?.x)&&validCoord(v?.y))run.push(v);else flush();});flush();}
      poly.forEach(p=>{const rawIndex=(m.zonePolygon||[]).indexOf(p),vertexNo=rawIndex>=0?rawIndex+1:0,ic=L.divIcon({className:'',html:'<div style="min-width:22px;height:22px;border:2px solid #fff;border-radius:50%;background:#171923;color:#fff;font:10px/18px system-ui;text-align:center">'+vertexNo+'</div>',iconSize:[22,22],iconAnchor:[11,11]});const mk=L.marker(ll(p.x,p.y),{icon:ic,interactive:true,draggable:state.editing}).addTo(state.map).bindPopup('<b>Vértice da Zona '+String(vertexNo).padStart(2,'0')+'</b><br>'+f(p.x)+', '+f(p.y)+', '+f(Number(p.z)||0)+(state.editing?'<br><small>Arraste para ajustar • será necessário validar novamente</small>':''));mk.on('dragend',ev=>{if(rawIndex<0)return;const n=ev.target.getLatLng(),v=m.zonePolygon[rawIndex];v.x=n.lng;v.y=n.lat;v.z=0;v.status='planned';v.validatedAt=null;v.validationReason='coordinate-change';commit('Vértice '+String(rawIndex+1).padStart(2,'0')+' movido — validação removida');});mk._mpKind='zone';state.drawn.push(mk);});
    }else if(hasCenter&&!polyMode){const eventRadius=effectiveEventRadius(m);if(eventRadius>0){const zone=L.circle(ll(m.center.x,m.center.y),{radius:eventRadius,weight:2,fillOpacity:.035,dashArray:(m.category||'dominacao')==='gas'?'8 6':null,interactive:false}).addTo(state.map);zone._mpKind='zone';state.drawn.push(zone);}}
    drawSafeRoute(m);drawCompareOverlay();drawDominationAccess(m);drawZoneProposal();
    if(!state.safeConfigView&&!state.safePresentation)m.points.forEach((p,i)=>{
      p.id=i+1;const valid=isValidated(p),
outside=((m.category||'dominacao')==='gas')&&!pointInsideZone(m,p),
pos=ll(p.x,p.y);
      const circle=L.circle(pos,{radius:Number(m.spawnRadius)||100,
weight:outside?3:2,
fillOpacity:outside?.14:.07,
dashArray:outside?'3 4':(valid?null:'6 5'),
color:outside?'#ff5252':undefined,
fillColor:outside?'#ff5252':undefined}).addTo(state.map);
      const marker=L.marker(pos,{icon:pinIcon(p,outside),
draggable:state.editing}).addTo(state.map);
      marker.bindPopup(`<b>Ponto ${String(p.id).padStart(2,'0')}</b><br>Status: <b>${valid?'VALIDADO':'PENDENTE'}</b>${outside?'<br><b style="color:#ff7474">FORA DA ZONA ⚠</b>':''}<br>Distância do centro: <b>${validCoord(m.center?.x)&&validCoord(m.center?.y)?pointDistanceFromCenter(m,p).toFixed(0)+' m':'—'}</b><br>${f(p.x)},${f(p.y)}${valid?','+f(p.z)+','+f(p.h):''}`);
      marker.on('click',()=>selectPoint(p.id));
      marker.on('dragend',ev=>{const n=ev.target.getLatLng();p.x=n.lng;p.y=n.lat;p.z=0;p.status='planned';p.validatedAt=null;commit(`Ponto ${p.id} movido — validação removida`);selectPoint(p.id);});
      circle._mpKind='spawns';marker._mpKind='spawns';state.drawn.push(circle,marker);
      if(Number.isFinite(p.h)){const a=p.h*Math.PI/180,
d=35;const hd=L.marker(ll(p.x+Math.sin(a)*d,p.y+Math.cos(a)*d),{icon:headingIcon(p.h),interactive:false}).addTo(state.map);hd._mpKind='spawns';state.drawn.push(hd);}
    });
    applyLayerVisibility();
  }

  function renderMissionList(){
    renderCentralV954();
  }

  function spawnProblems(m){
    const near=new Set(),duplicates=[];if(!m)return {near,duplicates};
    for(let i=0;i<m.points.length;i++)for(let j=i+1;j<m.points.length;j++){const d=distXY(m.points[i],m.points[j]);if(d<2){near.add(i);near.add(j);duplicates.push([i,j,d]);}else if(d<(Number(m.spawnRadius)||100)*2){near.add(i);near.add(j);}}
    return {near,duplicates};
  }
  function renumberSpawns(){
    if(!requireEdit())return;const m=active();if(!m)return;m.points.forEach((p,i)=>p.id=i+1);commit('Spawns renumerados sem alterar CDS');
  }
  function focusSpawnProblems(){
    const m=active();if(!m)return;const pr=spawnProblems(m);if(!pr.near.size){alert('Nenhum spawn duplicado ou próximo demais foi detectado.');return;}const pts=[...pr.near].map(i=>m.points[i]).filter(Boolean);if(pts.length===1)state.map?.setView(ll(pts[0].x,pts[0].y),5);else state.map?.fitBounds(L.latLngBounds(pts.map(p=>ll(p.x,p.y))).pad(.2),{maxZoom:5});qsa('.mp-point-row').forEach((el,i)=>el.style.outline=pr.near.has(i)?'2px solid #ff7474':'');setSaveState(pr.near.size+' spawn(s) problemático(s) destacados');
  }
  function renderPointList(){
    const m=active(),
box=qs('#mpPointList');if(!box||!m)return;
    if(!m.points.length){box.innerHTML='<div class="mp-note">Nenhum ponto registrado.</div>';return;}
    const problems=spawnProblems(m);
    box.innerHTML='<div class="mp-actions" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px"><button type="button" id="mpFocusProblems">VER PROBLEMÁTICOS</button><button type="button" id="mpRenumberSpawns">RENUMERAR 01…'+String(m.points.length).padStart(2,'0')+'</button><span class="mp-note">'+(problems.duplicates.length?problems.duplicates.length+' duplicidade(s) crítica(s) < 2m':'Sem duplicidades exatas')+'</span></div>'+m.points.map((p,i)=>{const valid=isValidated(p);return `<div class="mp-point-row ${valid?'validated':'planned'}" data-pidx="${i}"><div class="mp-point-num">${String(i+1).padStart(2,'0')}</div><div><b>Ponto ${i+1} <span class="mp-state ${valid?'ok':'warn'}">${valid?'VALIDADO':'PENDENTE'}</span></b><small>${valid?rawCds(p):tpCds(p)+' • Z provisório para TP/NC'}</small></div><div class="mp-row-actions"><button type="button" data-copy="${i}" title="${valid?'Copiar CDS validada':'Copiar CDS provisória para TPCDS'}">⧉</button><button type="button" data-del="${i}" title="Remover">×</button></div></div>`;}).join('');
    qs('#mpFocusProblems')?.addEventListener('click',focusSpawnProblems);qs('#mpRenumberSpawns')?.addEventListener('click',renumberSpawns);if(qs('#mpRenumberSpawns'))qs('#mpRenumberSpawns').disabled=!state.editing;
    qsa('.mp-point-row',box).forEach(r=>r.onclick=e=>{if(e.target.dataset.copy!==undefined||e.target.dataset.del!==undefined)return;const i=Number(r.dataset.pidx);selectPoint(i+1);state.map?.setView(ll(m.points[i].x,m.points[i].y),5);});
    qsa('[data-copy]',box).forEach(b=>b.onclick=async e=>{e.stopPropagation();const p=m.points[Number(b.dataset.copy)];await copyText(isValidated(p)?rawCds(p):tpCds(p));b.textContent='✓';setTimeout(()=>b.textContent='⧉',800);});
    qsa('[data-del]',box).forEach(b=>b.onclick=e=>{e.stopPropagation();if(!requireEdit())return;m.points.splice(Number(b.dataset.del),1);commit('Ponto removido');});
  }
  function selectPoint(id){
    const m=active(),
p=m?.points[id-1],
box=qs('#mpValidationTarget');
    if(box)box.innerHTML=p?`Ponto <b>${String(id).padStart(2,'0')}</b> • ${isValidated(p)?rawCds(p):tpCds(p)} • ${isValidated(p)?'<span class="mp-ok">VALIDADO</span>':'<span class="mp-warn">PENDENTE / Z PROVISÓRIO</span>'}`:'Selecione um ponto.';
    if(m)m.selectedId=id;
    qsa('.mp-point-row').forEach((r,i)=>r.classList.toggle('selected',i===id-1));
  }

  function ensureCenterValidationUi(){
    const clicked=qs('#mpClicked');if(!clicked||qs('#mpCenterValidation'))return;
    const wrap=document.createElement('div');wrap.id='mpCenterValidation';wrap.style.marginTop='8px';
    wrap.innerHTML=`<div id="mpCenterValidationStatus" class="mp-readout"></div><div class="mp-actions"><button type="button" id="mpCopyCenterTp">COPIAR TP DO CENTRO</button></div><label style="margin-top:8px">Cole a CDS real do centro<input id="mpCenterRealCds" placeholder="4869.25,-5060.22,292.63,306.15"></label><div class="mp-actions"><button type="button" id="mpValidateCenter" class="primary">VALIDAR CENTRO</button></div>`;
    clicked.insertAdjacentElement('afterend',wrap);
    qs('#mpCopyCenterTp')?.addEventListener('click',async()=>{const m=active();if(!m||!validCoord(m.center.x)||!validCoord(m.center.y)){alert('Marque primeiro o centro no mapa.');return;}await copyText(`${f(m.center.x)},${f(m.center.y)},0.00,${Number.isFinite(Number(m.center.h))?f(m.center.h):'0.00'}`);const b=qs('#mpCopyCenterTp');if(b){const old=b.textContent;b.textContent='COPIADO ✓';setTimeout(()=>b.textContent=old,900);}});
    qs('#mpValidateCenter')?.addEventListener('click',validateCenter);
  }
  function renderCenterValidation(){ensureCenterValidationUi();const m=active(),
el=qs('#mpCenterValidationStatus');if(!m||!el)return;el.innerHTML=isCenterValidated(m)?`<b>CENTRO VALIDADO ✓</b><br>${rawCds(m.center)}`:(validCoord(m.center.x)&&validCoord(m.center.y)?`<b>CENTRO PENDENTE</b><br>${f(m.center.x)},${f(m.center.y)},0.00,0.00 • copie o TP, vá ao local e cole a CDS real.`:'Marque o centro no mapa para iniciar a validação.');}
  function validateCenter(){if(!requireEdit())return;
    const m=active();if(!m)return;const r=parseCds(qs('#mpCenterRealCds')?.value);
    if(!r.ok){alert('CDS do centro nao reconhecida. '+r.motivo);return;}
    const probsC=cdsProblemas(r);
    if(probsC.length){alert('CDS do centro incompleta:\n\n'+probsC.join('\n'));return;}
    const x=r.x,
y=r.y,
z=r.z,
h=r.h===null?0:r.h;
    m.center.x=x;m.center.y=y;m.center.z=z;m.center.h=h;m.center.status='validated';m.center.validatedAt=nowIso();delete m.center.validationReason;if(qs('#mpCenterRealCds'))qs('#mpCenterRealCds').value='';commit('Centro validado com CDS real');state.map?.panTo(ll(x,y));
  }

  function ensureCoverageUi(){
    const anchor=qs('#mpCenterValidation');if(!anchor||qs('#mpCoverageBox'))return;
    const box=document.createElement('div');box.id='mpCoverageBox';box.style.marginTop='10px';
    box.innerHTML=`<label id="mpZoneModeWrap" style="margin-bottom:8px">FORMA DA ZONA<select id="mpZoneMode"><option value="radius">CENTRO + RAIO</option><option value="polygon">POLÍGONO POR CDS</option></select></label><div class="mp-readout"><b id="mpCoverageTitle">COBERTURA DA ZONA</b><div id="mpCoverageStatus" style="margin-top:6px">—</div></div><label style="margin-top:8px">Raio visual da zona (m)<input id="mpEventRadius" type="number" min="50" step="50" placeholder="1000"></label><div class="mp-actions" style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" id="mpRadiusMinus50">-50</button><button type="button" id="mpRadiusPlus50">+50</button><button type="button" id="mpRadiusMinus100">-100</button><button type="button" id="mpRadiusPlus100">+100</button></div><div class="mp-actions" style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" id="mpUseRecommendedRadius">COBRIR TODOS</button><button type="button" id="mpFitZone">ENQUADRAR ZONA</button><button type="button" id="mpGenerateInsideZone">GERAR SPAWNS DENTRO DA ZONA</button></div><div class="mp-note" style="margin-top:6px">Defina primeiro o tamanho ideal da área. Spawns fora dela serão destacados; não aumente a zona só para caber em pontos ruins.</div>`;
    anchor.insertAdjacentElement('afterend',box);
    qs('#mpZoneMode')?.addEventListener('change',e=>{if(!requireEdit())return;const m=active();if(!m||m.category!=='dominacao')return;m.zoneMode=e.target.value==='polygon'?'polygon':'radius';commit('Forma da Zona alterada para '+(m.zoneMode==='polygon'?'Polígono por CDS':'Centro + Raio'));});

    const applyRadius=(v,commitNow=true)=>{if(!requireEdit())return;const m=active();if(!m)return;v=Math.max(50,Math.round(Number(v)/50)*50);if(Number(m.eventRadius)===v)return;m.eventRadius=v;if(commitNow)commit('Raio da zona alterado');else{state.dirty=true;setSaveState('Raio da zona alterado • NÃO SALVO');renderMap();renderCoverage();}};
    let radiusInputStart=null;const radiusInput=qs('#mpEventRadius');
    radiusInput?.addEventListener('focus',()=>{radiusInputStart=state.editing?editSnapshot():null;});
    radiusInput?.addEventListener('input',e=>{if(!state.editing)return;const v=Number(e.target.value);if(Number.isFinite(v)&&v>0)applyRadius(v,false);});
    radiusInput?.addEventListener('change',()=>{if(!state.editing)return;if(radiusInputStart&&radiusInputStart!==editSnapshot()){const current=editSnapshot();state.lastEditSnapshot=radiusInputStart;pushUndo();state.lastEditSnapshot=current;state.dirty=true;render();setSaveState('Raio da zona alterado • NÃO SALVO');}radiusInputStart=null;});
    qs('#mpRadiusMinus50')?.addEventListener('click',()=>applyRadius(effectiveEventRadius(active())-50));
    qs('#mpRadiusPlus50')?.addEventListener('click',()=>applyRadius(effectiveEventRadius(active())+50));
    qs('#mpRadiusMinus100')?.addEventListener('click',()=>applyRadius(effectiveEventRadius(active())-100));
    qs('#mpRadiusPlus100')?.addEventListener('click',()=>applyRadius(effectiveEventRadius(active())+100));
    qs('#mpUseRecommendedRadius')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active(),
s=coverageStats(m);if(!m||!s)return;applyRadius(s.recommended);});
    qs('#mpFitZone')?.addEventListener('click',fitZone);
    qs('#mpGenerateInsideZone')?.addEventListener('click',generateInsideZone);
  }
  function zoneProposalPoints(m,shape,scale=1,rotation=0){
    if(!m||!validCoord(m.center?.x)||!validCoord(m.center?.y))return [];const cx=Number(m.center.x),cy=Number(m.center.y),r=Math.max(100,effectiveEventRadius(m))*Math.max(.2,Number(scale)||1),z=Number(m.center.z)||0,rot=Number(rotation)||0;
    const rotate=(x,y)=>{const a=rot*Math.PI/180,c=Math.cos(a),sn=Math.sin(a);return {x:cx+x*c-y*sn,y:cy+x*sn+y*c,z};};
    if(shape==='triangle')return [0,120,240].map(a=>{const q=a*Math.PI/180;return rotate(Math.sin(q)*r,Math.cos(q)*r);});
    if(shape==='hexagon')return [0,60,120,180,240,300].map(a=>{const q=a*Math.PI/180;return rotate(Math.sin(q)*r,Math.cos(q)*r);});
    if(shape==='rectangle'){const w=r,h=r*.62;return [rotate(-w,-h),rotate(w,-h),rotate(w,h),rotate(-w,h)];}
    const d=r/Math.sqrt(2);return [rotate(-d,-d),rotate(d,-d),rotate(d,d),rotate(-d,d)];
  }
  function drawZoneProposal(){const p=state.zoneProposal;if(!p?.points?.length||!state.map)return;const line=L.polygon(p.points.map(v=>ll(v.x,v.y)),{weight:3,fillOpacity:.025,dashArray:'8 7',interactive:false}).addTo(state.map);line._mpKind='proposal';state.drawn.push(line);p.points.forEach((v,i)=>{const mk=L.marker(ll(v.x,v.y),{interactive:false,icon:L.divIcon({className:'',html:'<div style="width:24px;height:24px;border:2px dashed #fff;border-radius:50%;background:rgba(8,10,18,.75);color:#fff;font:10px/20px system-ui;text-align:center">P'+(i+1)+'</div>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(state.map);mk._mpKind='proposal';state.drawn.push(mk);});}
  function setZoneProposal(shape){const m=active();if(!m||m.category!=='dominacao')return;if(!validCoord(m.center?.x)||!validCoord(m.center?.y)){alert('Defina o centro da zona antes de gerar uma proposta.');return;}const scale=Math.max(.2,Number(qs('#mpDomProposalScale')?.value)||1),rotation=Number(qs('#mpDomProposalRotation')?.value)||0;state.zoneProposal={shape,scale,rotation,points:zoneProposalPoints(m,shape,scale,rotation)};renderMap();renderDominationPolygonUi();}
  function applyZoneProposal(){if(!requireEdit())return;const m=active(),p=state.zoneProposal;if(!m||!p?.points?.length)return;m.zonePolygon=p.points.map(v=>({x:v.x,y:v.y,z:0,status:'planned',validatedAt:null,validationReason:'assisted-proposal'}));m.zoneMode='polygon';state.zoneProposal=null;commit('Proposta assistida aplicada à Zona de Dominação');}

  function ensureDominationPolygonUi(){
    const anchor=qs('#mpCoverageBox'),m=active();if(!anchor||qs('#mpDomPolygonBox'))return;
    const box=document.createElement('div');box.id='mpDomPolygonBox';box.className='mp-card';box.dataset.forceTab='zona';box.style.marginTop='10px';
    box.innerHTML=`<h3>CDS DA ZONA — POLÍGONO</h3><p class="mp-note">Opcional. Cole 3 ou mais CDS na ordem do contorno. O mapa une os pontos e fecha a Zona de Pontuação automaticamente. Estas CDS não são spawns.</p><div id="mpDomPolygonStatus" class="mp-readout">Nenhum vértice cadastrado.</div><div id="mpDomPolygonList" style="margin-top:8px"></div><label style="margin-top:8px">CDS do vértice<input id="mpDomPolygonCds" type="text" placeholder="x, y, z ou vec3(x, y, z)"></label><label style="margin-top:8px">COLAR VÁRIAS CDS<textarea id="mpDomPolygonBulk" rows="5" placeholder="01 - x, y, z&#10;02 - x, y, z&#10;03 - vec3(x, y, z)"></textarea></label><div class="mp-actions" style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" id="mpDomPolygonAdd">ADICIONAR VÉRTICE</button><button type="button" id="mpDomPolygonPlace">MARCAR VÉRTICE NO MAPA</button><button type="button" id="mpDomPolygonBulkAdd">IMPORTAR / ACRESCENTAR</button><button type="button" id="mpDomPolygonBulkReplace">SUBSTITUIR POLÍGONO</button><button type="button" id="mpDomPolygonValidateAll">VALIDAR TODAS</button><button type="button" id="mpDomPolygonUndo">REMOVER ÚLTIMO</button><button type="button" id="mpDomPolygonClear">LIMPAR POLÍGONO</button></div><div class="mp-note" style="margin-top:10px"><b>PLANEJADOR ASSISTIDO</b> • gera apenas uma proposta visual; nada é alterado até clicar APLICAR. Ao aplicar, as CDS ficam PENDENTES até validação real no FiveM.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0"><label>ESCALA<input id="mpDomProposalScale" type="number" min="0.2" max="3" step="0.1" value="1"></label><label>ROTAÇÃO °<input id="mpDomProposalRotation" type="number" min="-180" max="180" step="5" value="0"></label></div><div class="mp-actions" style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" data-zoneproposal="square">QUADRADO</button><button type="button" data-zoneproposal="rectangle">RETÂNGULO</button><button type="button" data-zoneproposal="triangle">TRIÂNGULO</button><button type="button" data-zoneproposal="hexagon">HEXÁGONO</button><button type="button" id="mpDomProposalApply">APLICAR PROPOSTA</button><button type="button" id="mpDomProposalCancel">CANCELAR</button></div>`;
    anchor.insertAdjacentElement('afterend',box);
    qs('#mpDomPolygonPlace')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active();if(!m||m.category!=='dominacao')return;const enable=!state.polygonPlacement;resetMapPlacementModes();state.polygonPlacement=enable;state.mapMode=enable?'polygon':'center';const b=qs('#mpDomPolygonPlace');if(b)b.textContent=state.polygonPlacement?'PARAR MARCAÇÃO':'MARCAR VÉRTICE NO MAPA';if(state.map?.getContainer())state.map.getContainer().style.cursor=state.polygonPlacement?'crosshair':'';const el=qs('#mpDomPolygonStatus');if(el&&state.polygonPlacement)el.innerHTML='<b>MARCAÇÃO DE VÉRTICES ATIVA</b><br>Clique no mapa seguindo a ordem do contorno. Os pontos entram como PENDENTES até validação real no FiveM.';});
    qs('#mpDomPolygonAdd')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active();if(!m||m.category!=='dominacao')return;const r=parseCds(qs('#mpDomPolygonCds')?.value);if(!r.ok||!validCoord(r.x)||!validCoord(r.y)){alert('CDS do vértice não reconhecida.');return;}if(!Array.isArray(m.zonePolygon))m.zonePolygon=[];m.zonePolygon.push({x:r.x,y:r.y,z:Number.isFinite(r.z)?r.z:0,status:'planned',validatedAt:null,validationReason:'pending-explicit-validation'});if(qs('#mpDomPolygonCds'))qs('#mpDomPolygonCds').value='';commit('Vértice da Zona de Dominação adicionado');});
    function readPolygonBulk(){const input=qs('#mpDomPolygonBulk'),lines=String(input?.value||'').split(/\n+/).map(x=>x.trim()).filter(Boolean),parsed=[],bad=[];lines.forEach((line,i)=>{const clean=line.replace(/^\s*\d+\s*[-–—:.)]\s*/,'').trim(),r=parseCds(clean);if(!r.ok||!validCoord(r.x)||!validCoord(r.y)){bad.push(i+1);return;}parsed.push({x:r.x,y:r.y,z:Number.isFinite(r.z)?r.z:0,status:'planned',validatedAt:null,validationReason:'pending-explicit-validation'});});return {input,parsed,bad};}
    function confirmPolygonBulk(result,action){if(!result.parsed.length){alert('Nenhuma CDS válida encontrada.');return false;}if(result.bad.length&&!confirm(result.parsed.length+' CDS reconhecida(s). Linha(s) não reconhecida(s): '+result.bad.join(', ')+'.\n\n'+action+' somente as CDS válidas?'))return false;return true;}
    qs('#mpDomPolygonBulkAdd')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active(),r=readPolygonBulk();if(!m||m.category!=='dominacao'||!r.input||!confirmPolygonBulk(r,'Importar'))return;if(!Array.isArray(m.zonePolygon))m.zonePolygon=[];m.zonePolygon.push(...r.parsed);m.zoneMode='polygon';r.input.value='';commit(r.parsed.length+' CDS acrescentadas à Zona de Dominação na ordem informada');fitZone();});
    qs('#mpDomPolygonBulkReplace')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active(),r=readPolygonBulk();if(!m||m.category!=='dominacao'||!r.input||!confirmPolygonBulk(r,'Substituir'))return;const oldCount=Array.isArray(m.zonePolygon)?m.zonePolygon.length:0;if(oldCount&&!confirm('Substituir os '+oldCount+' vértice(s) atuais por '+r.parsed.length+' CDS da lista colada?\n\nOs vértices anteriores serão removidos desta edição.'))return;m.zonePolygon=r.parsed;m.zoneMode='polygon';r.input.value='';commit('Polígono substituído por '+r.parsed.length+' CDS na ordem informada');fitZone();});

    qs('#mpDomPolygonValidateAll')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active(),raw=Array.isArray(m?.zonePolygon)?m.zonePolygon:[];if(!raw.length)return;const ready=raw.filter(v=>validCoord(v.x)&&validCoord(v.y)&&validCoord(v.z)&&v.status!=='validated');if(!ready.length){alert('Não há CDS pendentes com X, Y e Z completos para validar.');return;}if(!confirm('Confirmar '+ready.length+' CDS como coordenadas REAIS coletadas no FiveM?\n\nUse esta opção somente depois de conferir as CDS no jogo.'))return;const at=nowIso();ready.forEach(v=>{v.status='validated';v.validatedAt=at;v.validationReason=null;});commit(ready.length+' vértice(s) validados com CDS reais do FiveM');});
    qs('#mpDomPolygonUndo')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active();if(!m?.zonePolygon?.length)return;m.zonePolygon.pop();if(!m.zonePolygon.length)m.zoneMode='radius';commit(m.zonePolygon.length?'Último vértice da Zona de Dominação removido — polígono permanece em construção':'Último vértice removido — zona voltou para Centro + Raio');});
    qs('#mpDomPolygonClear')?.addEventListener('click',()=>{if(!requireEdit())return;const m=active();if(!m)return;const count=Array.isArray(m.zonePolygon)?m.zonePolygon.length:0;if(!count&&dominationZoneMode(m)!=='polygon')return;if(!confirm('Remover todas as CDS do polígono e voltar a visualizar a zona por Centro + Raio?'))return;m.zonePolygon=[];m.zoneMode='radius';state.zoneProposal=null;resetMapPlacementModes();commit('Polígono removido — Zona de Pontuação voltou para Centro + Raio');});
    qsa('[data-zoneproposal]',box).forEach(b=>b.addEventListener('click',()=>setZoneProposal(b.dataset.zoneproposal)));['mpDomProposalScale','mpDomProposalRotation'].forEach(id=>qs('#'+id)?.addEventListener('input',()=>{const p=state.zoneProposal,m=active();if(!p||!m)return;p.scale=Math.max(.2,Number(qs('#mpDomProposalScale')?.value)||1);p.rotation=Number(qs('#mpDomProposalRotation')?.value)||0;p.points=zoneProposalPoints(m,p.shape,p.scale,p.rotation);renderMap();renderDominationPolygonUi();}));
    qs('#mpDomProposalApply')?.addEventListener('click',applyZoneProposal);qs('#mpDomProposalCancel')?.addEventListener('click',()=>{state.zoneProposal=null;renderMap();renderDominationPolygonUi();});
    box.addEventListener('click',e=>{const b=e.target.closest('[data-polyaction]');if(!b)return;const m=active(),i=Number(b.dataset.index);if(!m||!Array.isArray(m.zonePolygon)||!Number.isInteger(i)||!m.zonePolygon[i])return;const action=b.dataset.polyaction;if(action==='go'){const p=m.zonePolygon[i];if(!validCoord(p?.x)||!validCoord(p?.y)){alert('Este vértice possui X/Y inválidos. Use CORRIGIR CDS antes de tentar localizá-lo no mapa.');return;}state.map?.setView(ll(p.x,p.y),Math.max(state.map?.getZoom?.()||4,5));return;}if(!requireEdit())return;if(action==='validate'){const old=m.zonePolygon[i];if(!validCoord(old?.x)||!validCoord(old?.y)){alert('Corrija X/Y deste vértice antes de validá-lo com a CDS real do FiveM.');return;}const value=prompt('Cole a CDS REAL coletada no FiveM para validar o vértice '+String(i+1).padStart(2,'0')+':',validCoord(old.z)?f(old.x)+', '+f(old.y)+', '+f(old.z):'');if(value===null)return;const r=parseCds(value);if(!r.ok||!validCoord(r.x)||!validCoord(r.y)||!validCoord(r.z)){alert('Para validar é necessário informar X, Y e Z reais da CDS coletada no FiveM.');return;}m.zonePolygon[i]={...old,x:r.x,y:r.y,z:r.z,status:'validated',validatedAt:nowIso(),validationReason:null};commit('Vértice '+String(i+1).padStart(2,'0')+' validado com CDS real');return;}if(action==='edit'){const old=m.zonePolygon[i],value=prompt('Editar CDS do vértice '+String(i+1).padStart(2,'0')+':',f(old.x)+', '+f(old.y)+', '+f(old.z));if(value===null)return;const r=parseCds(value);if(!r.ok||!validCoord(r.x)||!validCoord(r.y)){alert('CDS não reconhecida.');return;}m.zonePolygon[i]={...old,x:r.x,y:r.y,z:Number.isFinite(r.z)?r.z:0,status:'planned',validatedAt:null,validationReason:'coordinate-change'};commit('CDS do vértice '+String(i+1).padStart(2,'0')+' atualizada');return;}if(action==='remove'){m.zonePolygon.splice(i,1);commit('Vértice '+String(i+1).padStart(2,'0')+' removido da Zona de Dominação');return;}const j=action==='up'?i-1:action==='down'?i+1:i;if(j<0||j>=m.zonePolygon.length||j===i)return;[m.zonePolygon[i],m.zonePolygon[j]]=[m.zonePolygon[j],m.zonePolygon[i]];commit('Ordem das CDS da Zona de Dominação alterada');});
  }
  function renderDominationPolygonUi(){
    ensureDominationPolygonUi();const m=active(),box=qs('#mpDomPolygonBox'),el=qs('#mpDomPolygonStatus');if(!box||!m)return;const show=(m.category||'dominacao')==='dominacao';box.style.display=show?'block':'none';if(!show||!el)return;const p=dominationPolygon(m),polyMode=dominationZoneMode(m)==='polygon',raw=Array.isArray(m.zonePolygon)?m.zonePolygon:[],validated=raw.filter(v=>validCoord(v.x)&&validCoord(v.y)&&validCoord(v.z)&&v.status==='validated').length,geom=dominationZoneGeometry(m),pa=dominationPolygonAudit(m),crit=(pa.findings||[]).filter(x=>x.level!=='OK'),list=qs('#mpDomPolygonList');if(list)list.innerHTML=raw.length?raw.map((v,i)=>{const xyOk=validCoord(v.x)&&validCoord(v.y),validatedOk=xyOk&&validCoord(v.z)&&v.status==='validated',status=!xyOk?'CDS INVÁLIDA':(validatedOk?'VALIDADO':'PENDENTE'),statusColor=!xyOk?'#ff9b9b':(validatedOk?'#a7f3d0':'#ffd27a');return '<div class="mp-readout" style="margin:4px 0;display:flex;gap:6px;align-items:center;flex-wrap:wrap'+(!xyOk?';border-color:rgba(255,116,116,.55)':'')+'"><b>'+String(i+1).padStart(2,'0')+'</b><span style="font-size:10px;padding:2px 6px;border-radius:8px;border:1px solid rgba(255,255,255,.18);color:'+statusColor+'">'+status+'</span><span style="flex:1;min-width:180px">'+f(v.x)+', '+f(v.y)+', '+f(v.z)+'</span><button type="button" data-polyaction="go" data-index="'+i+'" '+(!xyOk?'disabled':'')+'>IR</button><button type="button" data-polyaction="edit" data-index="'+i+'" '+(!state.editing?'disabled':'')+'>'+(!xyOk?'CORRIGIR CDS':'EDITAR CDS')+'</button><button type="button" data-polyaction="validate" data-index="'+i+'" '+(!state.editing||!xyOk?'disabled':'')+'>VALIDAR CDS</button><button type="button" data-polyaction="up" data-index="'+i+'" '+(!state.editing||i===0?'disabled':'')+'>↑</button><button type="button" data-polyaction="down" data-index="'+i+'" '+(!state.editing||i===raw.length-1?'disabled':'')+'>↓</button><button type="button" data-polyaction="remove" data-index="'+i+'" '+(!state.editing?'disabled':'')+'>REMOVER</button></div>';}).join(''):'<div class="mp-note">Adicione as CDS na ordem do contorno da zona.</div>';const geometryReady=polyMode&&p.length>=3&&!pa.metrics?.geometryDeferred&&Number.isFinite(geom?.area)&&Number.isFinite(geom?.perimeter);el.innerHTML=raw.length?`Vértices armazenados: <b>${raw.length}</b> • validados: <b>${validated}/${raw.length}</b>${polyMode?(p.length>=3?(geometryReady?`<br>Polígono ativo e fechado ✓ • área ~<b>${Math.round(geom.area).toLocaleString('pt-BR')} m²</b> • perímetro ~<b>${Math.round(geom.perimeter)} m</b>`:'<br>Polígono selecionado • <b>geometria aguardando correção das CDS</b>.'):'<br>Modo POLÍGONO ativo • adicione pelo menos 3 CDS para fechar a zona.'):'<br>Modo CENTRO + RAIO ativo • polígono armazenado sem interferir na zona.'}`:(polyMode?'Nenhum vértice cadastrado • modo POLÍGONO aguardando CDS.':'Nenhum vértice cadastrado • usando Centro + Raio.');if(polyMode&&raw.length>=3&&crit.length){const rank={BLOQUEIO:0,ALERTA:1,'ATENÇÃO':2};crit.sort((a,b)=>(rank[a.level]??9)-(rank[b.level]??9));el.innerHTML+='<br><br><b>DIAGNÓSTICO DA ZONA</b><br>'+crit.map(x=>'<span><b>['+esc(x.level)+']</b> '+esc(x.message)+(x.action?'<br><small>↳ '+esc(x.action)+'</small>':'')+'</span>').join('<br><br>');if(pa.metrics&&!pa.metrics.geometryDeferred)el.innerHTML+='<br><br><b>MÉTRICAS</b><br>Dimensões ~<b>'+Math.round(pa.metrics.width)+' × '+Math.round(pa.metrics.height)+' m</b> • proporção <b>'+pa.metrics.aspectRatio.toFixed(1)+':1</b><br>Compactação <b>'+(pa.metrics.compactness*100).toFixed(0)+'%</b> • concavidade <b>'+Math.round(pa.metrics.concavity*100)+'%</b> • lados <b>'+Math.round(pa.metrics.minSide)+'–'+Math.round(pa.metrics.maxSide)+' m</b>';}else if(polyMode&&raw.length>=3)el.innerHTML+='<br><br><b>Geometria:</b> sem problemas estruturais detectados ✓';
    ['mpDomPolygonAdd','mpDomPolygonPlace','mpDomPolygonBulkAdd','mpDomPolygonValidateAll','mpDomPolygonUndo','mpDomPolygonClear','mpDomProposalApply'].forEach(id=>{const b=qs('#'+id);if(b)b.disabled=!state.editing;});const placeBtn=qs('#mpDomPolygonPlace');if(placeBtn){placeBtn.textContent=state.polygonPlacement?'PARAR MARCAÇÃO':'MARCAR VÉRTICE NO MAPA';placeBtn.setAttribute('aria-pressed',state.polygonPlacement?'true':'false');}if(state.map?.getContainer()&&state.polygonPlacement){state.map.getContainer().style.cursor='crosshair';qs('#missionPlannerMap')?.classList.add('mp-crosshair');}const prop=state.zoneProposal;if(prop){const names={square:'QUADRADO',rectangle:'RETÂNGULO',triangle:'TRIÂNGULO',hexagon:'HEXÁGONO'};el.innerHTML+='<br><br><b>Proposta visual:</b> '+esc(names[prop.shape]||String(prop.shape||'FORMA').toUpperCase())+' • '+prop.points.length+' vértices • ainda não aplicada.';}
  }

  function renderCoverage(){
    ensureCoverageUi();ensureSafeRouteUi();ensureDominationPolygonUi();const m=active(),
el=qs('#mpCoverageStatus'),
title=qs('#mpCoverageTitle'),
inp=qs('#mpEventRadius'),
btn=qs('#mpUseRecommendedRadius');if(!m||!el)return;
    const category=m.category||'dominacao',
used=effectiveEventRadius(m),
s=coverageStats(m),
counts=zoneCoverageCounts(m);
    if(title)title.textContent=category==='gas'?'COBERTURA INICIAL DA SAFE / GÁS':'ZONA DE PONTUAÇÃO — DOMINAÇÃO';const modeWrap=qs('#mpZoneModeWrap'),modeEl=qs('#mpZoneMode');if(modeWrap)modeWrap.style.display=category==='dominacao'?'block':'none';if(modeEl&&document.activeElement!==modeEl)modeEl.value=m.zoneMode||(dominationPolygon(m).length>=3?'polygon':'radius');
    if(inp&&document.activeElement!==inp)inp.value=used;
    const note=qs('#mpCoverageBox .mp-note');renderDominationPolygonUi();
    if(category==='dominacao'){
      const geom=dominationZoneGeometry(m),outsideAccess=(m.points||[]).filter(isValidated).map(p=>dominationAccessDistance(m,p)).filter(Number.isFinite),minAccess=outsideAccess.length?Math.min(...outsideAccess):null,maxAccess=outsideAccess.length?Math.max(...outsideAccess):null,aa=dominationAccessAnalysis(m);
      const fair=dominationFairnessAnalysis(m),fairWarn=dominationFairnessWarnings(m),usedEdges=aa?new Set(aa.access.map(x=>x.edge).filter(Boolean)).size:0,accessSummary=aa?`${geom.mode==='polygon'?`Bordas com aproximação: <b>${usedEdges}/${geom.vertices}</b> • `:''}Cobertura angular: <b>${aa.sectors}/4 quadrantes</b> • maior trecho sem entrada: <b>${aa.largestGap.toFixed(0)}°</b><br>${fair?`Mediana de aproximação: <b>${fair.median.toFixed(0)} m</b> • amplitude: <b>${fair.spread.toFixed(0)} m</b><br>`:''}${fairWarn.length?`<span style="color:#ffd27a"><b>Crítica de equidade:</b><br>${fairWarn.map(x=>'• '+esc(x)).join('<br>')}</span><br>`:''}`:'';
      el.innerHTML=`${geom.mode==='polygon'?`Zona por polígono: <b>${geom.vertices} vértices</b> • área ~<b>${Math.round(geom.area).toLocaleString('pt-BR')} m²</b><br>`:(geom.mode==='polygon-incomplete'?`Zona por polígono: <b>EM CONSTRUÇÃO</b> • ${geom.vertices}/3+ vértices válidos<br>`:(geom.mode==='polygon-invalid'?`Zona por polígono: <b>AGUARDANDO CORREÇÃO</b> • existem CDS com X/Y inválidos<br>`:`Zona por raio: <b>${used} m</b><br>`))}Spawns/entradas cadastrados: <b>${counts.total}</b><br>${minAccess!==null?`Distância até a borda da zona: <b>${minAccess.toFixed(0)}–${maxAccess.toFixed(0)} m</b><br>`:''}${geom.mode==='polygon-incomplete'?'<span style="color:#ffd27a"><b>Análise de acesso pausada:</b> conclua o contorno com pelo menos 3 CDS válidas. Distâncias, quadrantes e equidade serão recalculados automaticamente quando a zona fechar.</span><br>':(geom.mode==='polygon-invalid'?'<span style="color:#ff9b9b"><b>Análise de acesso pausada:</b> corrija as CDS com X/Y inválidos. O sistema não conectará vértices ignorando pontos inválidos.</span><br>':'')}${accessSummary}<span style="color:#9ed7ff">A pontuação acontece dentro da zona. Os spawns podem e normalmente devem ficar externos, funcionando como pontos de entrada para a disputa.</span>`;
      if(note)note.textContent='Projete uma área ampla de disputa, com espaço para movimentação, cobertura e flancos. Evite zonas pequenas que permitam marcar facilmente os jogadores ou controlar todas as entradas.';
      if(btn){btn.style.display='none';btn.disabled=true;}
      const gen=qs('#mpGenerateInsideZone');if(gen){gen.style.display='none';gen.disabled=true;}
    }else{
      if(!s){el.innerHTML=`Raio inicial da safe: <b>${used} m</b><br>Defina o centro e os spawns para calcular a cobertura.`;}
      else{const ok=counts.outside===0;el.innerHTML=`Dentro da safe inicial: <b>${counts.inside}/${counts.total}</b> ${counts.outside?`• <b style="color:#ff7474">${counts.outside} FORA ⚠</b>`:'• TODOS DENTRO ✓'}<br>Spawn mais distante: <b>${s.farthestIndex>=0?String(s.farthestIndex+1).padStart(2,'0'):'—'}</b> • ${s.max.toFixed(0)} m<br>Raio mínimo para todos: <b>${s.minimum} m</b><br>Raio sugerido + margem: <b>${s.recommended} m</b><br>Raio inicial escolhido: <b>${used} m</b> • ${ok?'COBERTURA OK ✓':'AJUSTE A SAFE OU OS SPAWNS ⚠'}`;}
      if(note)note.textContent='Na Zona de Gás, todos os spawns devem iniciar dentro da safe. Ajuste o raio ou reposicione os pontos que ficarem fora.';
      if(btn){btn.style.display='';btn.disabled=!state.editing;}
      const gen=qs('#mpGenerateInsideZone');if(gen){gen.style.display='';gen.disabled=!state.editing;}
    }
    ['mpRadiusMinus50',
'mpRadiusPlus50',
'mpRadiusMinus100',
'mpRadiusPlus100'].forEach(id=>{const b=qs('#'+id);if(b)b.disabled=!state.editing;});
  }

  function fitZone(){
    const m=active();if(!state.map||!m)return;const poly=dominationPolygon(m),polyMode=(m.category||'dominacao')==='dominacao'&&dominationZoneMode(m)==='polygon';
    if(polyMode&&poly.length){const arr=poly.map(p=>ll(p.x,p.y));if(arr.length===1){state.map.setView(arr[0],Math.max(state.map.getZoom()||0,5));}else state.map.fitBounds(L.latLngBounds(arr).pad(.12),{padding:[35,35],maxZoom:6});return;}
    if(polyMode)return;
    if(!validCoord(m.center?.x)||!validCoord(m.center?.y))return;const r=effectiveEventRadius(m);if(r<=0)return;const temp=L.circle(ll(m.center.x,m.center.y),{radius:r});state.map.fitBounds(temp.getBounds(),{padding:[35,35],maxZoom:6});
  }
  function generateInsideZone(){
    if(!requireEdit())return;const m=active();if(!m||!validCoord(m.center?.x)||!validCoord(m.center?.y)){alert('Defina primeiro o centro da zona.');return;}
    const zoneRadius=effectiveEventRadius(m),
qty=Math.max(2,Number(qs('#mpQty')?.value)||m.points.length||25),
spawnRing=Math.max(50,Math.floor((zoneRadius*.80)/50)*50);
    if(!confirm(`Gerar ${qty} spawns distribuídos a aproximadamente 80% do raio da zona (${spawnRing} m)?

Os pontos atuais serão substituídos e ficarão PENDENTES até validação no FiveM.`))return;
    if(qs('#mpCircleRadius'))qs('#mpCircleRadius').value=spawnRing;m.circleRadius=spawnRing;
    if(qs('#mpQty'))qs('#mpQty').value=qty;
    generateCircle();renderCoverage();fitZone();
  }

  function analyze(){
    const m=active();if(!m)return;let min=Infinity,
pair=null,
over=0;
    for(let i=0;i<m.points.length;i++)for(let j=i+1;j<m.points.length;j++){const d=Math.hypot(m.points[i].x-m.points[j].x,m.points[i].y-m.points[j].y);if(d<min){min=d;pair=[i+1,
j+1];}if(d<(Number(m.spawnRadius)||100)*2)over++;}
    if(qs('#mpCount'))qs('#mpCount').textContent=m.points.length;
    if(qs('#mpValidCount'))qs('#mpValidCount').textContent=m.points.filter(isValidated).length;
    if(qs('#mpPendingCount'))qs('#mpPendingCount').textContent=m.points.filter(p=>!isValidated(p)).length;
    if(qs('#mpOverlap'))qs('#mpOverlap').textContent=over+(spawnProblems(m).duplicates.length?' • '+spawnProblems(m).duplicates.length+' duplicado(s)':'');
    if(qs('#mpNearest'))qs('#mpNearest').textContent=pair?`${pair[0]} ↔ ${pair[1]} • ${min.toFixed(1)} m`:'—';
  }
  function rawCds(p){return `${f(p.x)},${f(p.y)},${f(p.z)},${f(p.h)}`;}
  function tpCds(p){const z=Number.isFinite(Number(p?.z))?Number(p.z):0;const h=Number.isFinite(Number(p?.h))?Number(p.h):0;return `${f(p.x)},${f(p.y)},${f(z)},${f(h)}`;}
  /* V9.6 DEV — pacote de produtividade/validação do Planejador */
  function median(nums){const a=nums.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return null;const i=Math.floor(a.length/2);return a.length%2?a[i]:(a[i-1]+a[i])/2;}
  function pointSegmentDistance(p,a,b){const px=Number(p.x),py=Number(p.y),ax=Number(a.x),ay=Number(a.y),bx=Number(b.x),by=Number(b.y),dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy;if(!l2)return Math.hypot(px-ax,py-ay);const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/l2));return Math.hypot(px-(ax+t*dx),py-(ay+t*dy));}
  function polygonEdgeAccess(m,p){const poly=activeDominationPolygon(m);if(poly.length<3)return null;let best={distance:Infinity,edge:0};for(let i=0;i<poly.length;i++){const d=pointSegmentDistance(p,poly[i],poly[(i+1)%poly.length]);if(d<best.distance)best={distance:d,edge:i+1};}return best;}
  function pointOnSegment(p,a,b,epsilon=.15){const px=Number(p.x),py=Number(p.y),ax=Number(a.x),ay=Number(a.y),bx=Number(b.x),by=Number(b.y),dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy;if(!Number.isFinite(px)||!Number.isFinite(py)||!l2)return Math.hypot(px-ax,py-ay)<=epsilon;const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/l2)),x=ax+t*dx,y=ay+t*dy;return Math.hypot(px-x,py-y)<=epsilon;}
  function pointInPolygon(p,poly){if(!p||!poly||poly.length<3)return false;for(let i=0;i<poly.length;i++)if(pointOnSegment(p,poly[i],poly[(i+1)%poly.length]))return true;const x=Number(p.x),y=Number(p.y);let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const xi=Number(poly[i].x),yi=Number(poly[i].y),xj=Number(poly[j].x),yj=Number(poly[j].y);if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))inside=!inside;}return inside;}
  function spawnInsideDomination(m,p){const poly=activeDominationPolygon(m);if(poly.length>=3)return pointInPolygon(p,poly);if(!validCoord(m?.center?.x)||!validCoord(m?.center?.y))return false;return pointDistanceFromCenter(m,p)<=effectiveEventRadius(m);}
  function dominationAccessDistance(m,p){if(['polygon-incomplete','polygon-invalid'].includes(dominationZoneGeometry(m).mode))return null;if(spawnInsideDomination(m,p))return 0;const edge=polygonEdgeAccess(m,p);return edge?edge.distance:Math.max(0,pointDistanceFromCenter(m,p)-effectiveEventRadius(m));}
  function nearestPolygonEdgePoint(m,p){const poly=activeDominationPolygon(m);if(poly.length<3)return null;let best={distance:Infinity,x:null,y:null,edge:null};for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],px=Number(p.x),py=Number(p.y),ax=Number(a.x),ay=Number(a.y),dx=Number(b.x)-ax,dy=Number(b.y)-ay,l2=dx*dx+dy*dy,t=l2?Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/l2)):0,x=ax+t*dx,y=ay+t*dy,d=Math.hypot(px-x,py-y);if(d<best.distance)best={distance:d,x,y,edge:i+1};}return best;}
  function dominationAccessTarget(m,p){if(['polygon-incomplete','polygon-invalid'].includes(dominationZoneGeometry(m).mode))return null;if(spawnInsideDomination(m,p))return {x:Number(p.x),y:Number(p.y),distance:0,edge:null,inside:true};const edge=nearestPolygonEdgePoint(m,p);if(edge)return {...edge,inside:false};if(!validCoord(m?.center?.x)||!validCoord(m?.center?.y))return null;const dx=Number(p.x)-Number(m.center.x),dy=Number(p.y)-Number(m.center.y),d=Math.hypot(dx,dy),r=effectiveEventRadius(m);if(!d)return {x:Number(m.center.x),y:Number(m.center.y),distance:0,edge:null};return {x:Number(m.center.x)+dx/d*r,y:Number(m.center.y)+dy/d*r,distance:Math.max(0,d-r),edge:null};}
  function drawDominationAccess(m){if((m?.category||'dominacao')!=='dominacao'||state.layerVisibility?.access===false)return;(m.points||[]).filter(isValidated).forEach(p=>{const t=dominationAccessTarget(m,p);if(!t)return;if(!t.inside){const line=L.polyline([ll(p.x,p.y),ll(t.x,t.y)],{weight:2,opacity:.72,dashArray:'6 7',interactive:false}).addTo(state.map);line._mpKind='access';state.drawn.push(line);}const label=L.marker(ll(t.x,t.y),{interactive:false,icon:L.divIcon({className:'',html:'<div style="white-space:nowrap;background:rgba(8,10,18,.82);border:1px solid rgba(255,255,255,.25);border-radius:8px;padding:2px 5px;color:#fff;font:10px system-ui">'+(t.inside?'DENTRO DA ZONA':Math.round(t.distance)+'m'+(t.edge?' • L'+t.edge:''))+'</div>',iconAnchor:[18,-4]})}).addTo(state.map);label._mpKind='access';state.drawn.push(label);});}

  function dominationAccessAnalysis(m){
    if(['polygon-incomplete','polygon-invalid'].includes(dominationZoneGeometry(m).mode))return null;
    const pts=(m?.points||[]).filter(isValidated),center=dominationAnalysisCenter(m);if(!m||pts.length<2||!center)return null;
    const poly=activeDominationPolygon(m),access=pts.map(p=>{let deg=Math.atan2(Number(p.y)-Number(center.y),Number(p.x)-Number(center.x))*180/Math.PI;if(deg<0)deg+=360;const inside=spawnInsideDomination(m,p),edge=!inside&&poly.length>=3?polygonEdgeAccess(m,p):null;return {id:p.id,deg,distanceToEdge:inside?0:(edge?edge.distance:Math.max(0,pointDistanceFromCenter(m,p)-effectiveEventRadius(m))),edge:edge?.edge||null,inside};}).sort((a,b)=>a.deg-b.deg);
    let largestGap=0;for(let i=0;i<access.length;i++){const a=access[i].deg,b=i===access.length-1?access[0].deg+360:access[i+1].deg;largestGap=Math.max(largestGap,b-a);}
    const sectors=new Set(access.map(x=>Math.floor(x.deg/90)%4));
    return {access,largestGap,sectors:sectors.size};
  }
  function dominationFairnessAnalysis(m){
    const aa=dominationAccessAnalysis(m);if(!aa?.access?.length)return null;const inside=aa.access.filter(x=>x.inside),external=aa.access.filter(x=>!x.inside),ds=external.map(x=>x.distanceToEdge).filter(Number.isFinite),med=median(ds);if(med===null)return {median:null,q1:null,q3:null,spread:0,short:[],long:[],maxEdge:null,total:aa.access.length,externalTotal:external.length,inside,external,access:aa.access};
    const sorted=[...ds].sort((a,b)=>a-b),q1=sorted[Math.floor((sorted.length-1)*.25)]||0,q3=sorted[Math.floor((sorted.length-1)*.75)]||0,spread=(Math.max(...ds)-Math.min(...ds));
    const short=external.filter(x=>x.distanceToEdge<Math.max(30,med*.55)),long=external.filter(x=>x.distanceToEdge>Math.max(med*1.65,med+180));
    const edgeCounts={};external.forEach(x=>{if(x.edge)edgeCounts[x.edge]=(edgeCounts[x.edge]||0)+1;});const maxEdge=Object.entries(edgeCounts).sort((a,b)=>b[1]-a[1])[0]||null;
    return {median:med,q1,q3,spread,short,long,maxEdge,total:aa.access.length,externalTotal:external.length,inside,external,access:aa.access};
  }
  function dominationFairnessWarnings(m){
    const f=dominationFairnessAnalysis(m),w=[];if(!f)return w;if(f.inside?.length)w.push('Spawn(s) já dentro da Zona de Pontuação: '+f.inside.map(x=>String(x.id).padStart(2,'0')).join(', ')+'. Confira se isso é intencional.');if(f.externalTotal<3)return w;
    if(f.short.length)w.push('Aproximação muito curta em relação ao conjunto: spawn(s) '+f.short.map(x=>String(x.id).padStart(2,'0')).join(', ')+'. Confira possível vantagem de chegada.');
    if(f.long.length)w.push('Aproximação muito longa em relação ao conjunto: spawn(s) '+f.long.map(x=>String(x.id).padStart(2,'0')).join(', ')+'. Confira possível desvantagem de chegada.');
    if(f.maxEdge&&Number(f.maxEdge[1])>=Math.ceil(f.externalTotal*.6))w.push('Concentração de acessos externos: '+f.maxEdge[1]+'/'+f.externalTotal+' spawns se aproximam pela borda L'+f.maxEdge[0]+'. Confira gargalo/camping de entrada.');
    return w;
  }

  function plannerAudit(m){
    const issues=[],warns=[]; if(!m)return {issues:['Nenhuma zona ativa.'],warns:[]};
    const category=m.category||'dominacao',poly=category==='dominacao'?dominationPolygon(m):[],zoneMode=category==='dominacao'?(m.zoneMode||(poly.length>=3?'polygon':'radius')):null,usesPolygon=category==='dominacao'&&zoneMode==='polygon';if(usesPolygon&&poly.length<3)issues.push('Forma da zona definida como Polígono por CDS, mas ainda faltam vértices válidos para fechar o contorno.');if(!usesPolygon&&(!validCoord(m.center?.x)||!validCoord(m.center?.y)))issues.push(category==='dominacao'?'Centro da Zona de Pontuação não definido para o modo Centro + Raio.':'Centro da zona não definido.');
    const pending=(m.points||[]).filter(p=>!isValidated(p)); if(pending.length)issues.push(pending.length+' spawn(s) ainda pendente(s) de validação.');
    if(category==='gas'){const c=zoneCoverageCounts(m);if(c.outside)issues.push(c.outside+' spawn(s) fora da safe inicial.');const r=ensureSafeRoute(m);const configured=r?.stages?.filter(safeStageValid).length||0;if(configured<3)warns.push('Rota progressiva da Safe está com '+configured+'/3 etapas configuradas.');safeRouteAudit(m).forEach(x=>issues.push(x));}
    else{const radius=effectiveEventRadius(m);if(usesPolygon){const pa=dominationPolygonAudit(m);issues.push(...pa.issues);warns.push(...pa.warns);}else{if(!Number.isFinite(radius)||radius<=0)issues.push('Raio da Zona de Pontuação inválido.');if(radius<150)warns.push('Zona de Pontuação pequena ('+Math.round(radius)+' m de raio). Confira se há espaço suficiente para movimentação, cobertura e flancos.');}const ds=(m.points||[]).filter(isValidated).map(p=>dominationAccessDistance(m,p));if(ds.length>=4){const min=Math.min(...ds),max=Math.max(...ds);if(max-min>300)warns.push('Acessos com diferença relevante: há cerca de '+Math.round(max-min)+' m entre a entrada mais próxima e a mais distante da borda da zona.');dominationFairnessWarnings(m).forEach(x=>warns.push(x));const aa=dominationAccessAnalysis(m);if(aa&&aa.sectors<3)warns.push('Acessos concentrados em apenas '+aa.sectors+' setor(es) ao redor da zona; confira se existem rotas de aproximação por lados diferentes.');if(aa&&aa.largestGap>180)warns.push('Há mais de 180° da Zona de Pontuação sem entrada cadastrada; confira risco de concentração da disputa em um único lado.');}}
    const allProblems=spawnProblems(m);if(allProblems.duplicates.length)issues.push(allProblems.duplicates.length+' par(es) de spawns praticamente duplicados (< 2 m).');
    const pts=(m.points||[]).filter(p=>isValidated(p));
    let nearest=Infinity,pair=null;for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=distXY(pts[i],pts[j]);if(d<nearest){nearest=d;pair=[pts[i].id,pts[j].id];}}
    const minRecommended=(Number(m.spawnRadius)||100)*2;if(pair&&nearest<minRecommended)warns.push('Spawns '+pair[0]+' e '+pair[1]+' estão muito próximos ('+nearest.toFixed(0)+' m).');
    const zs=pts.map(p=>Number(p.z)).filter(Number.isFinite),med=median(zs);if(med!==null){const odd=pts.filter(p=>Math.abs(Number(p.z)-med)>80);if(odd.length)warns.push('Altitude atípica em '+odd.length+' spawn(s): '+odd.map(p=>p.id).join(', ')+'.');}
    return {issues,warns};
  }
  function zoneOperation(m){if(!m)return 'alter-zone';if(m.requestKind==='create-event')return 'create-event';if(m.requestKind==='create-zone'||m.official===false)return 'create-zone';return 'alter-zone';}
  function requestComparable(m){if(!m)return null;const x=JSON.parse(JSON.stringify(m));delete x.updatedAt;delete x._lastSavedRequestBase;delete x.requestText;return x;}
  function requestChangeScope(m){
    const base=m?._lastSavedRequestBase;if(!base)return {safeOnly:false,hasBase:false};
    const now=requestComparable(m),before=requestComparable(base),nowSafe=JSON.stringify(now?.safeRoute||null),beforeSafe=JSON.stringify(before?.safeRoute||null);
    if(now)delete now.safeRoute;if(before)delete before.safeRoute;
    const n=JSON.parse(JSON.stringify(now||{})),b=JSON.parse(JSON.stringify(before||{}));
    const nPoints=JSON.stringify(n.points||[]),bPoints=JSON.stringify(b.points||[]),nCenter=JSON.stringify(n.center||{}),bCenter=JSON.stringify(b.center||{}),nRadius=JSON.stringify({eventRadius:n.eventRadius,circleRadius:n.circleRadius}),bRadius=JSON.stringify({eventRadius:b.eventRadius,circleRadius:b.circleRadius}),nPoly=JSON.stringify(n.zonePolygon||[]),bPoly=JSON.stringify(b.zonePolygon||[]);
    const safeOnly=nowSafe!==beforeSafe&&JSON.stringify(now)===JSON.stringify(before);
    ['points','center','eventRadius','circleRadius','zonePolygon','zoneMode'].forEach(k=>{delete n[k];delete b[k];});
    const commonSame=JSON.stringify(n)===JSON.stringify(b),zoneChanged=nCenter!==bCenter||nRadius!==bRadius||nPoly!==bPoly||(before?.zoneMode||null)!==(now?.zoneMode||null),spawnsOnly=nPoints!==bPoints&&!zoneChanged&&commonSame,zoneOnly=nPoints===bPoints&&zoneChanged&&commonSame;
    const beforePoly=(before?.zonePolygon||[]).filter(p=>validCoord(p?.x)&&validCoord(p?.y)),nowPoly=(now?.zonePolygon||[]).filter(p=>validCoord(p?.x)&&validCoord(p?.y)),beforeZoneMode=before?.zoneMode||(beforePoly.length>=3?'polygon':'radius'),nowZoneMode=now?.zoneMode||(nowPoly.length>=3?'polygon':'radius'),zoneTransition=beforeZoneMode===nowZoneMode?(nowZoneMode==='polygon'&&nPoly!==bPoly?'polygon-to-polygon':null):(beforeZoneMode+'-to-'+nowZoneMode);return {hasBase:true,safeOnly,safeChanged:nowSafe!==beforeSafe,spawnsOnly,zoneOnly,polygonChanged:nPoly!==bPoly,zoneChanged,beforeZoneMode,nowZoneMode,zoneTransition};
  }
  function safeIssueStage(issue){
    const s=String(issue||'');let m=s.match(/SAFE\s+(\d+)/i);if(m)return Math.max(0,Number(m[1])-1);
    m=s.match(/após SAFE\s+(\d+)/i);if(m)return Math.max(0,Number(m[1])-1);
    return null;
  }
  function safePreflight(m){
    if(!m||(m.category||'dominacao')!=='gas')return {blocking:[],warnings:[],firstStage:null};
    const blocking=safeRouteAudit(m),r=ensureSafeRoute(m);
    if(r){
      r.stages.forEach((st,i)=>{const land=safeStageValid(st)?safeLandCheck(st):null;if(land&&!land.ok)blocking.push('SAFE '+(i+1)+': '+land.reason);});
      const reach=safeRouteReachability(r);for(let i=1;i<r.stages.length;i++){const opts=safeOptions(r,i);if(opts.length&&!reach[i]?.viable?.some(x=>x.index>=0))blocking.push('SAFE '+(i+1)+' não possui possibilidade com continuidade até a SAFE final.');}
    }
    const unique=[...new Set(blocking)],first=unique.map(safeIssueStage).find(x=>x!==null&&Number.isFinite(x));
    return {blocking:unique,warnings:[],firstStage:first??null};
  }
  function focusSafePreflight(stage){
    const m=active(),r=ensureSafeRoute(m);if(!r?.stages?.length)return;
    const i=Math.min(Math.max(0,Number(stage)||0),r.stages.length-1);state.safeEditorStage=i;state.safeConfigView=true;state.layerVisibility.spawns=false;renderSafeRouteUi();renderMap();
    const st=r.stages[i];if(safeStageValid(st)&&state.map)state.map.panTo(ll(st.x,st.y));
  }
  function requireSafePreflight(m,action='gerar a solicitação'){
    const check=safePreflight(m);if(!check.blocking.length)return true;
    if(check.firstStage!==null)focusSafePreflight(check.firstStage);
    alert('NÃO É POSSÍVEL '+action.toUpperCase()+'.\n\nCorrija primeiro:\n- '+check.blocking.join('\n- ')+'\n\nA primeira SAFE com problema foi aberta no editor.');
    return false;
  }
  function highRequestExport(){
    const m=active();if(!m)return '';const a=plannerAudit(m),pts=(m.points||[]).filter(isValidated),r=(m.category||'dominacao')==='gas'?ensureSafeRoute(m):null,isSurvival=/sobreviv[eê]ncia/i.test(m.event||''),change=requestChangeScope(m),polyRaw=(m.category||'dominacao')==='dominacao'&&Array.isArray(m.zonePolygon)?m.zonePolygon:[],polyAudit=(m.category||'dominacao')==='dominacao'?dominationPolygonAudit(m):null,polyPending=polyRaw.filter(v=>validCoord(v?.x)&&validCoord(v?.y)&&(!validCoord(v?.z)||v?.status!=='validated')).length,polyInvalid=polyRaw.filter(v=>!validCoord(v?.x)||!validCoord(v?.y)).length;
    const operation=zoneOperation(m),creating=operation==='create-event'||operation==='create-zone',zoneName=m.name||'Zona Principal',eventName=m.event||'Sem nome',facXFac=/fac\s*x\s*fac/i.test(eventName),subject=operation==='create-event'?'Solicitação de Criação do Evento '+eventName:(operation==='create-zone'?'Solicitação de Criação de Zona do Evento '+eventName+' — Zona '+zoneName:'Solicitação de Alteração da Zona do Evento '+eventName+' — Zona '+zoneName);
    const lines=['ASSUNTO:','- '+subject+'.','','SOLICITAÇÃO:','- '+(creating?'Solicitamos a criação':'Solicitamos a alteração')+' da zona "'+zoneName+'" do evento "'+eventName+'" no painel '+(m.panel||'/ilegal')+'.'];
    if(facXFac&&!creating)lines.push('- Evento base: Fac x Fac.');
    if(dominationZoneMode(m)==='polygon'&&(polyPending>0||polyInvalid>0)){lines.push('','STATUS DA ENTREGA:','- RASCUNHO — NÃO IMPLEMENTAR AINDA.');if(polyPending>0)lines.push('- Existem '+polyPending+' vértice(s) do polígono pendente(s) de validação com CDS reais no FiveM.');if(polyInvalid>0)lines.push('- Existem '+polyInvalid+' vértice(s) com X/Y inválidos que precisam ser corrigidos antes de fechar a zona.');lines.push('- As coordenadas válidas abaixo podem ser usadas para planejamento visual, mas devem ser confirmadas antes da implementação.');}
    if(isSurvival)lines.push('','BASE DO EVENTO — CLONE DO FAC X FAC:','- Utilizar o Fac X Fac atual como base do Sobrevivência.','- Preservar as mecânicas, regras, sistemas, escalação, inventário entregue aos participantes, caixas de loot, drop de itens ao morrer, ping para aliados, ranking e premiações já existentes no Fac X Fac.','- Não recriar nem alterar essas mecânicas sem necessidade; a diferença funcional desta solicitação é a SAFE DINÂMICA progressiva descrita abaixo.');
    if(change.safeOnly&&!creating)lines.push('','ESCOPO DA ALTERAÇÃO:','- Alteração exclusiva da SAFE progressiva desta zona.','- Manter centro, raio inicial, spawns, regras e demais configurações atuais sem alteração.','- Implementar somente as etapas, movimentos e possibilidades da SAFE descritas abaixo.');
    else if(change.spawnsOnly&&!creating)lines.push('','ESCOPO DA ALTERAÇÃO:','- Alteração exclusiva dos pontos de spawn desta zona.','- Manter centro, raio/zona de disputa, regras e demais configurações atuais sem alteração.','- Atualizar somente os spawns conforme as CDS abaixo.','','SPAWNS ATUALIZADOS:',...pts.map((p,i)=>'  '+String(i+1).padStart(2,'0')+' - '+f(p.x)+', '+f(p.y)+', '+f(p.z)+', '+f(p.h)));
    else if(change.zoneOnly&&!creating){const poly=dominationPolygon(m),polyMode=dominationZoneMode(m)==='polygon';lines.push('','ESCOPO DA ALTERAÇÃO:','- Alteração exclusiva da Zona de Pontuação deste evento.','- Manter spawns, mecânica de pontuação, regras, premiações e demais configurações atuais sem alteração.');if(polyMode&&poly.length<3){lines.push('- A forma escolhida é POLÍGONO POR CDS, porém o contorno ainda está incompleto.','- NÃO converter para Centro + Raio e NÃO implementar esta alteração enquanto faltarem vértices.','','ZONA ATUALIZADA — POLÍGONO EM CONSTRUÇÃO:','- Vértices válidos cadastrados: '+poly.length+' / mínimo 3.');poly.forEach((p,i)=>lines.push('  '+String(i+1).padStart(2,'0')+' - '+f(p.x)+', '+f(p.y)+', '+f(p.z)+(isValidated(p)?'':'  [PENDENTE DE VALIDAÇÃO]')));}else if(polyMode&&poly.length>=3){if(change.zoneTransition==='radius-to-polygon')lines.push('- Converter a Zona de Pontuação atual de CENTRO + RAIO para POLÍGONO POR CDS.');else if(change.zoneTransition==='polygon-to-polygon')lines.push('- Substituir o contorno atual do POLÍGONO pelas novas CDS abaixo.');else lines.push('- Atualizar os limites da Zona de Dominação pelas CDS abaixo.');lines.push('','ZONA ATUALIZADA — POLÍGONO POR CDS:');poly.forEach((p,i)=>lines.push('  '+String(i+1).padStart(2,'0')+' - '+f(p.x)+', '+f(p.y)+', '+f(p.z)+(isValidated(p)?'':'  [PENDENTE DE VALIDAÇÃO]')));lines.push('- As CDS acima formam o limite da Zona de Dominação, devem ser ligadas na ordem informada e fechadas do último ponto ao primeiro.','- Estas CDS NÃO são pontos de spawn.');}else{if(change.zoneTransition==='polygon-to-radius')lines.push('- Converter a Zona de Pontuação atual de POLÍGONO POR CDS para CENTRO + RAIO.','- O polígono/CDS de contorno anterior deixa de definir a área válida da Zona de Pontuação.','- Manter os pontos de spawn atuais sem alteração.');else lines.push('- Atualizar somente o centro e o raio conforme abaixo.');lines.push('','ZONA ATUALIZADA — CENTRO + RAIO:','- Centro: '+f(m.center?.x)+', '+f(m.center?.y)+', '+f(m.center?.z),'- Raio: '+Math.round(effectiveEventRadius(m))+'m');}}
    else{const poly=dominationPolygon(m),polyMode=dominationZoneMode(m)==='polygon';lines.push('','CONFIGURAÇÃO DA ZONA:');if((m.category||'dominacao')==='dominacao'&&polyMode&&poly.length<3){lines.push('- Forma da Zona de Pontuação: POLÍGONO POR CDS — INCOMPLETO.','- Vértices válidos cadastrados: '+poly.length+' / mínimo 3.','- NÃO implementar como Centro + Raio; concluir e validar o polígono antes da implementação.');poly.forEach((p,i)=>lines.push('  '+String(i+1).padStart(2,'0')+' - '+f(p.x)+', '+f(p.y)+', '+f(p.z)+(isValidated(p)?'':'  [PENDENTE DE VALIDAÇÃO]')));}else if((m.category||'dominacao')==='dominacao'&&polyMode&&poly.length>=3){lines.push('- Forma da Zona de Pontuação: POLÍGONO POR CDS.','- CDS que formam o limite da Zona de Dominação:');poly.forEach((p,i)=>lines.push('  '+String(i+1).padStart(2,'0')+' - '+f(p.x)+', '+f(p.y)+', '+f(p.z)+(isValidated(p)?'':'  [PENDENTE DE VALIDAÇÃO]')));lines.push('- Ligar as CDS na ordem informada e fechar do último ponto ao primeiro.','- Estas CDS formam a zona e NÃO são spawns.');}else lines.push('- Forma da zona: CENTRO + RAIO.','- Centro: '+f(m.center?.x)+', '+f(m.center?.y)+', '+f(m.center?.z),'- Raio inicial: '+Math.round(effectiveEventRadius(m))+'m');lines.push('','SPAWNS / PONTOS DE ENTRADA:','- Spawns validados: '+pts.length);pts.forEach((p,i)=>lines.push('  '+String(i+1).padStart(2,'0')+' - '+f(p.x)+', '+f(p.y)+', '+f(p.z)+', '+f(p.h)));}
    if(r){
      lines.push('','SAFE DINÂMICA:','- Referência vertical da Safe: Z = 0.','- Fluxo com '+r.stages.length+' etapas: FECHA → MOVE → FECHA, até a SAFE final.');
      r.stages.forEach((st,i)=>{
        lines.push('- Safe '+(i+1)+': '+f(st.x)+', '+f(st.y)+', 0.00 | raio '+Math.round(Number(st.radius)||0)+'m | dano '+(Number(st.damage)||0)+' HP/s | fechamento '+(Number(st.closeSeconds)||0)+'s'+(i<r.stages.length-1?' | movimento '+(Number(st.moveSeconds)||0)+'s':''));
        if(i>0)safeOptions(r,i).filter(p=>validCoord(p.x)&&validCoord(p.y)).forEach((p,j)=>lines.push('  - Opção '+(j+1)+': '+f(p.x)+', '+f(p.y)+', 0.00'));
      });
      lines.push('- Aviso fora da SAFE: "VOCÊ ESTÁ FORA DA SAFE — TOMANDO X DE DANO POR SEGUNDO".','- X acompanha automaticamente o dano da etapa ativa.','- Duração configurada da progressão: '+(safeTimeline(m).at(-1)?.at||0)+' segundos.');
    }
    lines.push('','VALIDAÇÃO:');if(!a.issues.length&&!a.warns.length)lines.push('- Configuração aprovada pelas validações automáticas do Planejador.');else{a.issues.forEach(x=>lines.push('- BLOQUEIO: '+x));a.warns.forEach(x=>lines.push('- AVISO: '+x));}
    lines.push('','OBSERVAÇÕES:',isSurvival?'- O Fac X Fac existente permanece como referência de funcionamento; implementar somente as diferenças necessárias para o Sobrevivência.':'- Preservar as mecânicas/regras já existentes do evento base quando aplicável.','- As CDS acima estão em formato simples; vec3/vec4 não é obrigatório.','- Spawns utilizam Z real; somente a referência visual da Safe utiliza Z = 0.');
    return lines.join('\n');
  }
  function technicalSummary(){
    const m=active();if(!m)return '';const a=plannerAudit(m),tl=(m.category||'dominacao')==='gas'?safeTimeline(m):[];
    return ['EVENTO: '+m.event,'ZONA: '+m.name,'STATUS: '+(a.issues.length?'BLOQUEADO':a.warns.length?'PRONTO COM AVISOS':'PRONTO'),'SPAWNS: '+(m.points||[]).filter(isValidated).length+'/'+(m.points||[]).length,'RAIO: '+Math.round(effectiveEventRadius(m))+'m',...(tl.length?['SAFE: '+tl.map(x=>x.label+' @ '+x.at+'s / '+Math.round(x.radius)+'m').join(' | ')]:[]),...(a.issues.length?['BLOQUEIOS: '+a.issues.join(' • ')]:[]),...(a.warns.length?['AVISOS: '+a.warns.join(' • ')]:[])].join('\n');
  }
  function exportMission(format='lua'){
    const m=active();if(!m)return '';if(format==='high')return highRequestExport();if(format==='summary')return technicalSummary();const pts=(m.points||[]).filter(isValidated);
    if(format==='json')return JSON.stringify({event:m.event,zone:m.name,center:m.center,radius:effectiveEventRadius(m),spawns:pts,safeRoute:m.safeRoute||null},null,2);
    if(format==='plain')return pts.map((p,i)=>String(p.id||i+1).padStart(2,'0')+' - '+f(p.x)+', '+f(p.y)+', '+f(p.z)+', '+f(p.h)).join('\n');
    if(format==='vec3')return pts.map((p,i)=>String(p.id||i+1).padStart(2,'0')+' - vec3('+f(p.x)+', '+f(p.y)+', '+f(p.z)+')').join('\n');
    if(format==='vec4')return pts.map((p,i)=>String(p.id||i+1).padStart(2,'0')+' - vec4('+f(p.x)+', '+f(p.y)+', '+f(p.z)+', '+f(p.h)+')').join('\n');
    return pts.map((p,i)=>'['+(i+1)+'] = vector4('+f(p.x)+', '+f(p.y)+', '+f(p.z)+', '+f(p.h)+'),').join('\n');
  }
  function togglePlannerFullscreen(){
    const el=qs('#missionPlannerMap')?.closest('.mp-map-card')||qs('#missionPlannerMap');if(!el)return;
    el.classList.toggle('mp-pro-fullscreen');const on=el.classList.contains('mp-pro-fullscreen');
    Object.assign(el.style,on?{position:'fixed',inset:'0',zIndex:'99999',background:'#0b1018',padding:'12px'}:{position:'',inset:'',zIndex:'',background:'',padding:''});
    const map=qs('#missionPlannerMap');if(map)map.style.height=on?'calc(100vh - 24px)':'';
    qsa('.mp-map-toolbar,.mp-map-status',el).forEach(x=>x.style.display=on?'none':'');
    if(on&&active()){const m=active(),pts=(m.points||[]).filter(p=>validCoord(p.x)&&validCoord(p.y)).map(p=>ll(p.x,p.y));if(validCoord(m.center?.x)&&validCoord(m.center?.y))pts.push(ll(m.center.x,m.center.y));if(pts.length>1)setTimeout(()=>state.map?.fitBounds(L.latLngBounds(pts).pad(.08),{maxZoom:5}),120);}
    setTimeout(()=>state.map?.invalidateSize(),80);
  }
  function applyLayerVisibility(){
    (state.drawn||[]).forEach(l=>{const k=l._mpKind;if(!k)return;const visible=state.layerVisibility?.[k]!==false;try{if(visible&&!state.map.hasLayer(l))l.addTo(state.map);else if(!visible&&state.map.hasLayer(l))state.map.removeLayer(l);}catch(e){}});
  }
  const DRAFT_KEY='highos_mp_edit_draft_v1',LOCAL_PRESETS='highos_mp_local_presets_v1';
  function saveEditDraft(){
    if(!state.editing||!state.dirty)return;
    try{localStorage.setItem(DRAFT_KEY,JSON.stringify({at:nowIso(),activeId:state.activeId,eventId:active()?.eventId,missions:state.missions}));const el=qs('#mpDraftState');if(el)el.textContent='Rascunho salvo às '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}catch(e){}
  }
  function clearEditDraft(){try{localStorage.removeItem(DRAFT_KEY)}catch(e){}}
  function recoverEditDraft(){
    let d=null;try{d=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null')}catch(e){}
    if(!d?.missions?.length)return;
    const current=state.missions.find(m=>m.id===d.activeId),draft=d.missions.find(m=>m.id===d.activeId);
    if(!draft)return;
    const newer=!current||new Date(draft.updatedAt||d.at||0)>new Date(current.updatedAt||0);
    if(newer&&confirm('Existe um rascunho não salvo do Planejador. Deseja recuperar?')){state.missions=d.missions;state.activeId=d.activeId;state.activeEventId=d.eventId||draft.eventId;saveStore();setSaveState('Rascunho recuperado • revise antes de salvar');}
    clearEditDraft();
  }
  function readLocalPresets(){try{return JSON.parse(localStorage.getItem(LOCAL_PRESETS)||'[]')}catch(e){return []}}
  function saveLocalPreset(){
    const m=active();if(!m)return;const list=readLocalPresets(),copy=JSON.parse(JSON.stringify(m));copy.id='localpreset_'+Date.now();copy.official=false;copy.createdAt=nowIso();copy.updatedAt=nowIso();list.unshift({name:(m.event||'Evento')+' — '+(m.name||'Zona'),mission:copy});try{localStorage.setItem(LOCAL_PRESETS,JSON.stringify(list.slice(0,12)));renderLocalPresets();}catch(e){alert('Não foi possível salvar o preset local.');}
  }
  function renderLocalPresets(){
    const el=qs('#mpLocalPresets');if(!el)return;const list=readLocalPresets();if(!list.length){el.textContent='Presets locais: nenhum salvo.';return;}
    el.innerHTML='<b>Presets locais:</b> '+list.map((p,i)=>'<button type="button" data-localpreset="'+i+'" style="margin:3px">'+esc(p.name)+'</button>').join('');
    qsa('[data-localpreset]',el).forEach(b=>b.onclick=()=>{cleanupSafePresentation();const p=readLocalPresets()[Number(b.dataset.localpreset)];if(!p?.mission)return;const m=JSON.parse(JSON.stringify(p.mission));m.id=uid();m.eventId=eventUid();m.event=(m.event||'Evento')+' (Preset)';m.createdAt=nowIso();m.updatedAt=nowIso();state.missions.push(m);state.activeId=m.id;state.activeEventId=m.eventId;saveStore();render();fit();});
  }
  function renderProTools(){
    let box=qs('#mpProTools');const anchor=qs('#mpSafeRouteBox')||qs('#mpCoverageBox');if(!anchor)return;
    if(!box){box=document.createElement('div');box.id='mpProTools';box.className='mp-card';box.style.marginTop='10px';box.innerHTML=`<h3>FERRAMENTAS DE MISSÃO</h3>
      <div id="mpAuditStatus" class="mp-readout"></div>
      <div class="mp-actions" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button type="button" id="mpAuditBtn">VALIDAR ANTES DE PUBLICAR</button><button type="button" id="mpChecklistBtn">CHECKLIST DO EVENTO</button><button type="button" id="mpCompareBtn">ANTES × DEPOIS</button><button type="button" id="mpFullscreenBtn">MAPA TELA CHEIA</button><button type="button" id="mpSurvivalBtn">CRIAR SOBREVIVÊNCIA DO FAC X FAC</button>
      </div>
      <div class="mp-grid" style="margin-top:8px"><label>Exportação<select id="mpExportFormat"><option value="plain">CDS simples</option><option value="lua">Lua / vector4</option><option value="vec4">vec4</option><option value="vec3">vec3</option><option value="json">JSON</option><option value="high">Solicitação HIGH</option><option value="summary">Resumo técnico</option></select></label><label>Camadas<div style="display:flex;gap:10px;flex-wrap:wrap;padding-top:8px"><span><input type="checkbox" data-mplayer="zone" checked> Zona</span><span><input type="checkbox" data-mplayer="spawns" checked> Spawns</span><span><input type="checkbox" data-mplayer="center" checked> Centro</span><span><input type="checkbox" data-mplayer="access"> Acessos</span><span><input type="checkbox" id="mpLegendToggle" checked> Legenda</span><span><input type="checkbox" id="mpCompareLayerToggle"> Antes</span></div></label></div>
      <div class="mp-grid" style="margin-top:8px"><label>Ir para CDS <small style="opacity:.65">formato livre • vec é opcional</small><input id="mpGoCoord" placeholder="Cole a CDS como tiver: X,Y,Z • vec3/vec4 • /tpcds • /tp..."></label><label>Rascunho<div id="mpDraftState" class="mp-note" style="padding-top:8px">Nenhum rascunho pendente.</div></label></div>
      <div class="mp-actions" style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" id="mpGoCoordBtn">CENTRALIZAR CDS</button><button type="button" id="mpSavePresetBtn">SALVAR COMO PRESET LOCAL</button><button type="button" id="mpCopyExportPro">COPIAR EXPORTAÇÃO</button></div>
      <div id="mpLocalPresets" class="mp-note" style="margin-top:8px"></div>`;
      anchor.insertAdjacentElement('afterend',box);
      qs('#mpAuditBtn')?.addEventListener('click',()=>{renderProTools();const a=plannerAudit(active());alert(a.issues.length?'BLOQUEIOS:\n- '+a.issues.join('\n- ')+(a.warns.length?'\n\nAVISOS:\n- '+a.warns.join('\n- '):''):'Validação concluída sem bloqueios.'+(a.warns.length?'\n\nAvisos:\n- '+a.warns.join('\n- '):''));});
      qs('#mpChecklistBtn')?.addEventListener('click',()=>{const m=active(),a=plannerAudit(m),r=(m?.category||'dominacao')==='gas'?ensureSafeRoute(m):null,checks=[['Centro definido',validCoord(m?.center?.x)&&validCoord(m?.center?.y)],['Spawns cadastrados',(m?.points?.length||0)>0],['Todos os spawns validados',(m?.points||[]).length>0&&(m?.points||[]).every(isValidated)],['Raio da zona definido',effectiveEventRadius(m)>0],['Safe progressiva completa',!r||r.stages.every(safeStageValid)],['Sem bloqueios automáticos',a.issues.length===0]];alert('CHECKLIST — '+(m?.event||'EVENTO')+'\n\n'+checks.map(([n,ok])=>(ok?'✓ ':'✗ ')+n).join('\n')+(a.warns.length?'\n\nAVISOS:\n- '+a.warns.join('\n- '):''));});
      qs('#mpCompareBtn')?.addEventListener('click',()=>{const m=active(),old=state.editBackup?.zones?.find(z=>z.id===m?.id);if(!old){alert('Entre em EDITAR ZONA para comparar a versão salva com a alteração atual.');return;}state.compareOverlay=!state.compareOverlay;renderMap();const b=qs('#mpCompareBtn');if(b)b.textContent=state.compareOverlay?'OCULTAR ANTES':'ANTES × DEPOIS';const changes=[];if(Number(old.eventRadius)!==Number(m.eventRadius))changes.push('Raio: '+effectiveEventRadius(old)+' → '+effectiveEventRadius(m)+' m');if(old.points?.length!==m.points?.length)changes.push('Spawns: '+(old.points?.length||0)+' → '+(m.points?.length||0));if(distXY(old.center,m.center)>1)changes.push('Centro movido '+distXY(old.center,m.center).toFixed(0)+' m');setSaveState((state.compareOverlay?'Comparação visual ativa':'Comparação visual ocultada')+(changes.length?' • '+changes.join(' • '):''));});
      qs('#mpFullscreenBtn')?.addEventListener('click',togglePlannerFullscreen);qs('#mpSurvivalBtn')?.addEventListener('click',cloneFacXFacAsSurvival);
      qs('#mpGoCoordBtn')?.addEventListener('click',()=>{const r=parseCds(qs('#mpGoCoord')?.value);if(!r.ok||!validCoord(r.x)||!validCoord(r.y)){alert('CDS não reconhecida. Cole pelo menos X e Y.');return;}state.map?.setView(ll(r.x,r.y),5);});
      qs('#mpGoCoord')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();qs('#mpGoCoordBtn')?.click();}});qs('#mpGoCoord')?.addEventListener('input',e=>{const lab=e.target.closest('label')?.querySelector('small');if(lab)lab.textContent=cdsFormatHint(e.target.value)+' • vec é opcional';});
      qs('#mpSavePresetBtn')?.addEventListener('click',()=>saveLocalPreset());
      qsa('[data-mplayer]',box).forEach(c=>{c.checked=state.layerVisibility[c.dataset.mplayer]!==false;c.addEventListener('change',()=>{state.layerVisibility[c.dataset.mplayer]=c.checked;renderMap();});});qs('#mpLegendToggle')?.addEventListener('change',e=>{const x=qs('#mpMapLegend');if(x)x.style.display=e.target.checked?'':'none';});qs('#mpCompareLayerToggle')?.addEventListener('change',e=>{if(!state.editing&&e.target.checked){e.target.checked=false;alert('Entre em EDITAR ZONA para visualizar a versão anterior.');return;}state.compareOverlay=e.target.checked;renderMap();});
      qs('#mpCopyExportPro')?.addEventListener('click',async()=>{const fmt=qs('#mpExportFormat')?.value||'lua',m=active();if(fmt==='high'&&(m?.category||'dominacao')==='gas'&&!requireSafePreflight(m,'copiar a solicitação HIGH'))return;await copyText(exportMission(fmt));const b=qs('#mpCopyExportPro');if(b){b.textContent='COPIADO ✓';setTimeout(()=>b.textContent='COPIAR EXPORTAÇÃO',900);}});
    }
    const a=plannerAudit(active()),el=qs('#mpAuditStatus');if(el)el.innerHTML=a.issues.length?'<b style="color:#ff7474">NÃO PRONTO PARA PUBLICAR</b><br>'+esc(a.issues.join(' • ')):(a.warns.length?'<b style="color:#ffd166">PRONTO COM AVISOS</b><br>'+esc(a.warns.join(' • ')):'<b class="mp-ok">PRONTO PARA PUBLICAR ✓</b><br>Centro, spawns e cobertura passaram nas validações automáticas.');
    qsa('[data-mplayer]',box).forEach(c=>c.checked=state.layerVisibility?.[c.dataset.mplayer]!==false);const lg=qs('#mpMapLegend');if(lg)lg.style.display=qs('#mpLegendToggle')?.checked===false?'none':'';const ct=qs('#mpCompareLayerToggle');if(ct){ct.checked=!!state.compareOverlay;ct.disabled=!state.editing;}const cb=qs('#mpCompareBtn');if(cb)cb.textContent=state.compareOverlay?'OCULTAR ANTES':'ANTES × DEPOIS';renderLocalPresets();
  }

  function updateExport(){const m=active(),
out=qs('#mpExport');if(out&&m)out.value=m.points.filter(isValidated).map((p,i)=>`${p.id||i+1} - ${rawCds(p)}`).join('\n');}
  function render(){adoptStrayCards();ensureSafeRouteUi();adoptStrayCards();renderMissionList();renderPointList();renderMap();analyze();updateExport();syncForm();renderCenterValidation();renderCoverage();renderProTools();renderPlannerBadges();renderWorkspaceBar();renderBackupList();const rt=qs('#mpRequestText'),
m=active();if(rt&&document.activeElement!==rt)rt.value=m?.requestText||'';loadSnapshotPreview();}

  function syncForm(){
    const m=active();if(!m)return;
    const vals={mpMissionName:m.name,
mpEventCategory:m.category||'dominacao',
mpEventType:m.event,
mpPanel:m.panel,
mpMode:m.mode,
mpRequestKind:m.requestKind||'alter-zone',
mpCenterLabel:m.center.label||'Coordenada central',
mpCenterX:m.center.x??'',
mpCenterY:m.center.y??'',
mpCenterZ:m.center.z??'',
mpCenterH:m.center.h??'',
mpCircleRadius:m.circleRadius||1000,
mpStartAngle:m.startAngle||0,
mpRadius:m.spawnRadius||100,
mpEventRadius:m.eventRadius||''};
    Object.entries(vals).forEach(([id,
v])=>{const el=qs('#'+id);if(el&&document.activeElement!==el)el.value=v;});
    if(qs('#mpRadiusValue'))qs('#mpRadiusValue').textContent=`${m.spawnRadius||100} m`;
    const assist=m.mode==='assistant';qs('#mpModeHint')&&(qs('#mpModeHint').textContent=assist?'ASSISTENTE: todo ponto novo começa PENDENTE (vermelho), recebe Z provisório 0.00 para TPCDS/NC e só fica verde após validação com a CDS real.':'MANUAL: CDS completa e não-zero pode ser adicionada já como validada.');
  }

  function editSnapshot(){return JSON.stringify({missions:state.missions,activeId:state.activeId,activeEventId:state.activeEventId});}
  function pushUndo(){
    if(!state.editing)return false;const before=state.lastEditSnapshot,current=editSnapshot();if(!before||before===current)return false;if(state.undoStack.at(-1)!==before){state.undoStack.push(before);if(state.undoStack.length>30)state.undoStack.shift();}state.redoStack=[];return true;
  }
  function restoreEditSnapshot(raw,label){
    if(!raw)return;try{const x=JSON.parse(raw);state.missions=x.missions;state.activeId=x.activeId;state.activeEventId=x.activeEventId;state.lastEditSnapshot=editSnapshot();state.dirty=true;render();updateEditUi();setSaveState(label+' • NÃO SALVO');}catch(e){}
  }
  function undoEdit(){if(!state.editing||!state.undoStack.length)return;state.redoStack.push(editSnapshot());const target=state.undoStack.pop();restoreEditSnapshot(target,'DESFEITO');state.lastEditSnapshot=editSnapshot();}
  function redoEdit(){if(!state.editing||!state.redoStack.length)return;state.undoStack.push(editSnapshot());const target=state.redoStack.pop();restoreEditSnapshot(target,'REFAZENDO');state.lastEditSnapshot=editSnapshot();}
  function commit(reason='Alteração'){
    const m=active();if(!m)return;
    if(state.editing){const changed=pushUndo();if(!changed){setSaveState('Nenhuma alteração detectada');return;}m.updatedAt=nowIso();state.lastEditSnapshot=editSnapshot();state.dirty=true;render();setSaveState(`${reason} • NÃO SALVO`);return;}
    m.updatedAt=nowIso();saveStore();render();setSaveState(`${reason} • salvo`);queueSnapshot();
  }
  function resetMapPlacementModes(){state.mapMode='center';state.placing=false;state.polygonPlacement=false;state.safePlacementStage=null;state.safePlacementAsOption=false;clearSafeHover();qs('#missionPlannerMap')?.classList.remove('mp-crosshair');if(state.map?.getContainer())state.map.getContainer().style.cursor='';const pb=qs('#mpPlaceBtn');if(pb)pb.textContent='MARCAR PONTO NO MAPA';const vb=qs('#mpDomPolygonPlace');if(vb)vb.textContent='MARCAR VÉRTICE NO MAPA';}
  function requireEdit(){if(state.editing)return true;alert('Zona travada em modo visualização. Clique em EDITAR ZONA para fazer alterações.');return false;}
  function startEdit(){const m=active();if(!m||state.editing)return;state.undoStack=[];state.redoStack=[];state.compareOverlay=false;state.editBackup={eventId:m.eventId,
zones:JSON.parse(JSON.stringify(zonesOfEvent(m.eventId)))};state.editing=true;state.dirty=false;resetMapPlacementModes();state.lastEditSnapshot=editSnapshot();render();updateEditUi();setSaveState('MODO EDIÇÃO • alterações ainda não salvas');}
  function saveMission(){const m=active();if(!m)return;if(!state.editing){setSaveState('Nenhuma alteração para salvar');return;}const audit=plannerAudit(m);if(audit.issues.length&&!confirm('Existem bloqueios de validação:\n\n- '+audit.issues.join('\n- ')+'\n\nSalvar mesmo assim como rascunho?'))return;m.updatedAt=nowIso();const original=state.editBackup?.zones?.find(z=>z.id===m.id);if(original)m._lastSavedRequestBase=requestComparable(original);saveStore();const cloudPush=window.HighOSMissionCloud?.pushNow?.(JSON.parse(JSON.stringify(state.missions)));setCloudState('sync','↻ SALVANDO NO FIREBASE...');clearEditDraft();state.editBackup=null;state.editing=false;state.dirty=false;resetMapPlacementModes();state.undoStack=[];state.redoStack=[];state.lastEditSnapshot=null;state.compareOverlay=false;render();updateEditUi();setSaveState(audit.issues.length?'Zona salva como rascunho ⚠ • enviando Firebase':'Zona salva ✓ • enviando Firebase');Promise.resolve(cloudPush).then(ok=>{if(ok){setCloudState('ok',`☁ SINCRONIZADO · ${new Set(state.missions.map(m=>m.eventId).filter(Boolean)).size} eventos · ${state.missions.length} zonas`);setSaveState(audit.issues.length?'Rascunho salvo ⚠ • Firebase sincronizado':'Zona salva ✓ • Firebase sincronizado');}else{setCloudState('local','⚠ SALVO LOCAL • FIREBASE PENDENTE');setSaveState('Salvo localmente • Firebase pendente');}}).catch(()=>{setCloudState('local','⚠ SALVO LOCAL • FIREBASE PENDENTE');setSaveState('Salvo localmente • Firebase pendente');});queueSnapshot();}
  function cancelEdit(){if(!state.editing)return;clearEditDraft();if(state.editBackup?.eventId&&Array.isArray(state.editBackup.zones)){const eid=state.editBackup.eventId;const keep=state.missions.filter(x=>x.eventId!==eid);state.missions=[...state.editBackup.zones,
...keep];}state.editBackup=null;state.editing=false;state.dirty=false;resetMapPlacementModes();state.undoStack=[];state.redoStack=[];state.lastEditSnapshot=null;state.activeEventId=active()?.eventId||state.activeEventId;render();updateEditUi();setSaveState('Alterações descartadas • visualização');}
  function updateEditUi(){
    const edit=state.editing;const eb=qs('#mpEditMission'),
sb=qs('#mpSaveMission'),
cb=qs('#mpCancelEdit');
    if(eb)eb.style.display=edit?'none':'';if(sb)sb.style.display=edit?'':'none';if(cb)cb.style.display=edit?'':'none';const ub=qs('#mpUndoEdit'),rb=qs('#mpRedoEdit');if(ub){ub.style.display=edit?'':'none';ub.disabled=!state.undoStack.length;}if(rb){rb.style.display=edit?'':'none';rb.disabled=!state.redoStack.length;}
    qsa('#page-planejador input:not(#mpRequestText),#page-planejador select,#page-planejador textarea:not(#mpRequestText):not(#mpExport)').forEach(el=>{if(!['mpValidateCds',
'mpCenterRealCds',
'mpCloneTarget'].includes(el.id))el.disabled=!edit;});
    ['mpSafeUseCenter','mpSafePlace2','mpSafePlace3','mpSafeClearOptions','mpPlaceBtn',
'mpGenerateCircle',
'mpImport',
'mpAddCoord',
'mpClear',
'mpValidateBtn',
'mpValidateCenter',
'mpEventRadius',
'mpRadiusMinus50',
'mpRadiusPlus50',
'mpRadiusMinus100',
'mpRadiusPlus100',
'mpUseRecommendedRadius',
'mpGenerateInsideZone'].forEach(id=>{const el=qs('#'+id);if(el)el.disabled=!edit;});
    if(qs('#missionPlannerMap'))qs('#missionPlannerMap').classList.toggle('mp-editing',edit);
  }
  function setSaveState(t){if(qs('#mpSaveState'))qs('#mpSaveState').textContent=t;}
  function queueSnapshot(){clearTimeout(state.snapshotTimer);state.snapshotTimer=setTimeout(()=>captureSnapshot(false),1100);}
  async function captureSnapshot(download=false){
    const m=active(),
el=qs('#missionPlannerMap');if(!m||!el)return;
    try{
      if(typeof html2canvas==='undefined')throw new Error('html2canvas indisponível');
      const canvas=await html2canvas(el,{useCORS:true,
allowTaint:false,
backgroundColor:'#10151f',
logging:false,
scale:1});
      const max=1400,
ratio=Math.min(1,max/canvas.width);let out=canvas;
      if(ratio<1){out=document.createElement('canvas');out.width=Math.round(canvas.width*ratio);out.height=Math.round(canvas.height*ratio);out.getContext('2d').drawImage(canvas,0,0,out.width,out.height);}
      const dataUrl=out.toDataURL('image/jpeg',0.78);await saveSnapshot(m.id,dataUrl);await loadSnapshotPreview();setSaveState('Missão e print do mapa salvos');
      if(download){const a=document.createElement('a');a.href=dataUrl;a.download=`${safeName(m.name)}-mapa.jpg`;a.click();}
    }catch(e){console.warn(e);if(download)alert('Não foi possível gerar o print do mapa. Aguarde o mapa terminar de carregar e tente novamente.');}
  }
  async function loadSnapshotPreview(){const m=active(),
img=qs('#mpSnapshotPreview');if(!m||!img)return;const s=await getSnapshot(m.id);if(s?.dataUrl){img.src=s.dataUrl;img.classList.add('show');if(qs('#mpSnapshotEmpty'))qs('#mpSnapshotEmpty').style.display='none';}else{img.removeAttribute('src');img.classList.remove('show');if(qs('#mpSnapshotEmpty'))qs('#mpSnapshotEmpty').style.display='block';}}
  const safeName=s=>String(s||'missao').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();

  function fit(){const m=active();if(!state.map||!m)return;const arr=(m.points||[]).filter(p=>validCoord(p.x)&&validCoord(p.y)).map(p=>ll(p.x,p.y)),poly=activeDominationPolygon(m);poly.forEach(p=>arr.push(ll(p.x,p.y)));if(dominationZoneMode(m)!=='polygon'&&validCoord(m.center?.x)&&validCoord(m.center?.y))arr.push(ll(m.center.x,m.center.y));if(arr.length===1)state.map.setView(arr[0],5);else if(arr.length)state.map.fitBounds(L.latLngBounds(arr).pad(.12),{padding:[30,30],maxZoom:6});}
  function generateCircle(){if(!requireEdit())return;
    const m=active();if(!m)return;const cx=num(qs('#mpCenterX')?.value),
cy=num(qs('#mpCenterY')?.value),
qty=Math.max(2,Number(qs('#mpQty')?.value)||2),
r=Math.max(1,Number(qs('#mpCircleRadius')?.value)||1000),
start=Number(qs('#mpStartAngle')?.value)||0;
    if(cx===null||cy===null){alert('Defina a coordenada central no mapa ou informe X e Y.');return;}
    if(Number(m.center.x)!==cx||Number(m.center.y)!==cy){m.center.z=0;m.center.h=0;m.center.status='planned';m.center.validatedAt=null;m.center.validationReason='coordinate-change';}m.center.x=cx;m.center.y=cy;m.circleRadius=r;m.startAngle=start;m.points=[];
    for(let i=0;i<qty;i++){const deg=start+(360/qty)*i,
a=deg*Math.PI/180;m.points.push(normalizePoint({x:cx+Math.sin(a)*r,
y:cy+Math.cos(a)*r,
z:0,
h:(deg+180)%360,
status:'planned'},i));}
    commit(`${qty} pontos gerados como PENDENTES`);fit();
  }
  function parseBulk(text){const out=[];String(text||'').split(/\n+/).forEach(line=>{const c=line.replace(/^\s*\d+\s*[-–—:)]\s*/,'').trim();if(!c)return;const r=parseCds(c);if(!r.ok)return;out.push({x:r.x,y:r.y,z:r.z,h:r.h});});return out;}
  function cdsFormatHint(raw){
    const t=String(raw||'').trim();if(!t)return 'Formato livre';
    if(/vector4|vec4/i.test(t))return 'vec4 detectado';if(/vector3|vec3/i.test(t))return 'vec3 detectado';if(/^\s*\/?(tpcds|tp|nc|setcoords|coords?)/i.test(t))return 'Comando detectado';return 'CDS simples detectada';
  }
  function importBulk(){if(!requireEdit())return;
    const m=active(),
arr=parseBulk(qs('#mpBulk')?.value);if(!m||!arr.length){alert('Nenhuma coordenada válida encontrada.');return;}
    const manual=m.mode==='manual';arr.forEach(v=>{const can=manual&&validCoord(v.x)&&validCoord(v.y)&&validCoord(v.z)&&Number.isFinite(v.h);m.points.push(normalizePoint({...v,
status:can?'validated':'planned',
validatedAt:can?nowIso():null},m.points.length));});commit(`Importadas ${arr.length} CDS`);fit();
  }
  function setValidationFeedback(html,tipo='info'){
    const el=qs('#mpValidationFeedback');
    if(el){el.className='mp-validation-feedback '+tipo;el.innerHTML=html;}
  }
  function validateSelected(opts={}){if(!requireEdit())return false;
    const m=active();let id=m?.selectedId;
    if(!id){id=nextPendingId(m);if(id)selectPoint(id);}
    const p=id?m.points[id-1]:null;
    if(!p){setValidationFeedback('Selecione na lista o ponto que voce esta conferindo no jogo.','erro');return false;}
    const campo=qs('#mpValidateCds');
    const r=parseCds(campo?.value);
    if(!r.ok){setValidationFeedback(`<b>CDS nao reconhecida</b><span>${r.motivo}</span>`,'erro');return false;}
    const probs=cdsProblemas(r);
    if(probs.length){setValidationFeedback(`<b>CDS incompleta</b><span>${probs.join('<br>')}</span>`,'erro');return false;}
    const desvio=distXY(p,r);
    if(desvio>250&&!opts.forcar){
      setValidationFeedback(`<b>Desvio de ${desvio.toFixed(0)} m</b><span>A CDS colada esta longe do ponto ${id} planejado. Confira se selecionou o ponto certo.</span><button type="button" id="mpForceValidate" class="mp-mini-danger">VALIDAR ASSIM MESMO</button>`,'alerta');
      qs('#mpForceValidate')?.addEventListener('click',()=>validateSelected({forcar:true,
avancar:opts.avancar}));
      return false;
    }
    p.x=r.x;p.y=r.y;p.z=r.z;p.h=r.h===null?0:r.h;p.status='validated';p.validatedAt=nowIso();delete p.validationReason;
    if(campo)campo.value='';
    commit(`Ponto ${id} validado`);
    state.map?.panTo(ll(r.x,r.y));
    const restantes=(m.points||[]).filter(x=>!isValidated(x)).length;
    const prox=opts.avancar!==false?nextPendingId(m,id):0;
    if(prox){selectPoint(prox);setTimeout(()=>qs('#mpValidateCds')?.focus(),60);}
    setValidationFeedback(
      `<b>Ponto ${id} validado &#10003;</b><span>Desvio de ${desvio.toFixed(1)} m &bull; Z ${f(r.z)} &bull; H ${f(p.h)}</span>`+
      (restantes?`<span>${restantes} ponto(s) pendente(s).${prox?` Selecionei o ponto ${prox} - cole a proxima CDS.`:''}</span>`:'<span>Todos os pontos desta zona estao validados.</span>'),
      'ok');
    return true;
  }
  /* valida varios pontos de uma vez: "12 - x,y,z,h" por linha */
  function validateBulk(){if(!requireEdit())return;
    const m=active();if(!m)return;
    const texto=String(qs('#mpValidateBulk')?.value||'');
    const linhas=texto.split(/\n+/).map(l=>l.trim()).filter(Boolean);
    if(!linhas.length){setValidationFeedback('Cole uma CDS por linha, no formato <b>numero - x,y,z,h</b>.','erro');return;}
    let ok=0;const erros=[];
    linhas.forEach((linha,i)=>{
      const mm=linha.match(/^\s*(\d+)\s*[-–—:)]\s*(.+)$/);
      const idx=mm?Number(mm[1]):(i+1);
      const r=parseCds(mm?mm[2]:linha);
      const alvo=m.points[idx-1];
      if(!alvo){erros.push(`Linha ${i+1}: nao existe ponto ${idx}.`);return;}
      if(!r.ok){erros.push(`Linha ${i+1}: ${r.motivo}`);return;}
      const probs=cdsProblemas(r);
      if(probs.length){erros.push(`Ponto ${idx}: ${probs[0]}`);return;}
      alvo.x=r.x;alvo.y=r.y;alvo.z=r.z;alvo.h=r.h===null?0:r.h;
      alvo.status='validated';alvo.validatedAt=nowIso();delete alvo.validationReason;ok++;
    });
    if(ok)commit(`${ok} ponto(s) validado(s) em lote`);
    setValidationFeedback(
      `<b>${ok} ponto(s) validado(s)</b>`+(erros.length?`<span>${erros.slice(0,6).join('<br>')}${erros.length>6?`<br>+${erros.length-6} outros`:''}</span>`:''),
      erros.length?(ok?'alerta':'erro'):'ok');
    if(ok&&qs('#mpValidateBulk'))qs('#mpValidateBulk').value='';
  }
  function invalidateSelected(){if(!requireEdit())return;
    const m=active(),
id=m?.selectedId,
p=id?m.points[id-1]:null;
    if(!p){setValidationFeedback('Selecione um ponto na lista.','erro');return;}
    p.status='planned';p.z=0;p.validatedAt=null;p.validationReason='manual-reset';
    commit(`Ponto ${id} voltou para PENDENTE`);
    setValidationFeedback(`<b>Ponto ${id} voltou para pendente</b><span>Z zerado para permitir TPCDS + NC.</span>`,'alerta');
  }
  async function copySelectedTp(){
    const m=active(),
id=m?.selectedId,
p=id?m.points[id-1]:null;
    if(!p){setValidationFeedback('Selecione um ponto na lista.','erro');return;}
    await copyText(`${f(p.x)},${f(p.y)},0.00,${Number.isFinite(Number(p.h))?f(p.h):'0.00'}`);
    setValidationFeedback(`<b>TP do ponto ${id} copiado</b><span>Va ate o local no jogo e cole a CDS real aqui.</span>`,'ok');
  }
  function addManual(){if(!requireEdit())return;
    const m=active();if(!m)return;const x=num(qs('#mpX')?.value),
y=num(qs('#mpY')?.value),
z=num(qs('#mpZ')?.value),
h=num(qs('#mpH')?.value);if(x===null||y===null){alert('Informe X e Y válidos.');return;}
    const can=m.mode==='manual'&&validCoord(x)&&validCoord(y)&&validCoord(z)&&h!==null;m.points.push(normalizePoint({x,
y,
z,
h,
status:can?'validated':'planned',
validatedAt:can?nowIso():null},m.points.length));commit(can?'Ponto manual validado':'Ponto manual adicionado como PENDENTE');
  }
  function createEvent(){
    if(state.editing&&state.dirty&&!confirm('Descartar alterações não salvas e criar um novo evento?'))return;
    cleanupSafePresentation();if(state.editing)cancelEdit();
    const m=newMission(null,null,state.libraryCategory||'dominacao');
    m.name='Zona Principal';m.requestKind='create-event';
    state.missions.unshift(m);state.activeId=m.id;state.activeEventId=m.eventId;saveStore();setWorkspace(true);render();startEdit();state.map?.setView(ll(900,-600),3);setSaveState('Novo evento criado • configure a Zona Principal e clique SALVAR EVENTO');
  }
  function createZone(){
    if(state.editing&&state.dirty&&!confirm('Descartar alterações não salvas e criar uma nova zona?'))return;
    cleanupSafePresentation();if(state.editing)cancelEdit();
    const base=active(),
eid=activeEventId();
    if(!eid||!base){alert('Selecione primeiro um evento.');return;}
    const m=newMission(eid,base.event,base.category);
    m.name=`Nova Zona ${zonesOfEvent(eid).length+1}`;m.panel=base.panel;m.mode=base.mode;m.requestKind='create-zone';m.eventRadius=base.eventRadius||null;m.circleRadius=base.circleRadius||1000;m.spawnRadius=base.spawnRadius||100;
    state.missions.unshift(m);state.activeId=m.id;state.activeEventId=eid;saveStore();setWorkspace(true);render();startEdit();setSaveState('Nova zona criada • defina centro, raio e spawns');
  }
  function syncMapRegion(m){
    if(!state.map||!m)return;
    const pts=[m.center,
...(m.points||[])].filter(p=>validCoord(p?.x)&&validCoord(p?.y));
    const isCayo=/cayo\s*perico/i.test(`${m.name||''} ${m.event||''}`)||pts.some(p=>Number(p.x)>3800&&Number(p.y)<-3800);
    const overlays=[state.cayoLayer,state.cayoPostalLayer].filter(Boolean),checks=qsa('#mpLayerControl [data-over]');
    if(isCayo){
      if(state.cayoOceanLayer&&!state.map.hasLayer(state.cayoOceanLayer))state.cayoOceanLayer.addTo(state.map);
      const satCheck=qs('#mpLayerControl [data-over="cayo"]'),postalCheck=qs('#mpLayerControl [data-over="cayoPostal"]');
      // Ao entrar em Cayo sem preferência ativa, liga somente o satélite para evitar duas imagens sobrepostas.
      if(state.cayoLayer&&!state.map.hasLayer(state.cayoLayer)&&!state.map.hasLayer(state.cayoPostalLayer)){state.cayoLayer.addTo(state.map);if(satCheck)satCheck.checked=true;if(postalCheck)postalCheck.checked=false;}
      checks.forEach(x=>{x.disabled=false;const layer=x.dataset.over==='cayo'?state.cayoLayer:state.cayoPostalLayer;x.checked=!!layer&&state.map.hasLayer(layer);});
    }else{
      [...overlays,state.cayoOceanLayer].filter(Boolean).forEach(l=>{if(state.map.hasLayer(l))state.map.removeLayer(l);});
      checks.forEach(x=>{x.checked=false;x.disabled=false;});
    }
    updateMapDiagnostics(isCayo?'região Cayo':'região Los Santos');
  }
  function focusActiveMission(scrollToMap=false){
    const m=active();if(!state.map||!m)return;syncMapRegion(m);
    const run=()=>{state.map.invalidateSize();const arr=(m.points||[]).filter(p=>validCoord(p.x)&&validCoord(p.y)).map(p=>ll(p.x,p.y));if(validCoord(m.center?.x)&&validCoord(m.center?.y))arr.push(ll(m.center.x,m.center.y));if(arr.length>1)state.map.fitBounds(L.latLngBounds(arr).pad(.12),{animate:true,
duration:.45,
maxZoom:5});else if(arr.length===1)state.map.setView(arr[0],5,{animate:true});};
    setTimeout(run,70);setTimeout(run,260);
    if(scrollToMap){const el=qs('#missionPlannerMap')?.closest('.mission-planner-mapwrap')||qs('#missionPlannerMap');if(el)setTimeout(()=>el.scrollIntoView({behavior:'smooth',
block:'center'}),40);}
  }
  function cleanupSafePresentation(){
    if(state.safePresentation){stopSafePreview();exitSafePresentation();}
    else stopSafePreview();
    state.safePlacementStage=null;
    const mapEl=state.map?.getContainer?.();if(mapEl)mapEl.style.cursor='';
  }
  function switchMission(id){if(state.editing&&state.dirty&&!confirm('Existem alterações não salvas. Deseja descartá-las?'))return;cleanupSafePresentation();if(state.editing)cancelEdit();state.activeId=id;const m=state.missions.find(m=>m.id===id);state.activeEventId=m?.eventId||state.activeEventId;state.libraryCategory=(m?.category||state.libraryCategory||'dominacao');saveStore();setWorkspace(true);render();updateEditUi();focusActiveMission(true);}
  function deleteZone(){const m=active();if(!m)return;const zones=zonesOfEvent(m.eventId);if(zones.length<=1){alert('Este é o único mapa/zona do evento. Para removê-lo, exclua o evento inteiro.');return;}if(!confirm(`Apagar somente a zona "${m.name}" do evento "${m.event}"?`))return;cleanupSafePresentation();state.missions=state.missions.filter(x=>x.id!==m.id);const next=zones.find(x=>x.id!==m.id);state.activeId=next?.id||null;saveStore();render();focusActiveMission(false);}
  function deleteEvent(){
    const m=active();if(!m)return;const zones=zonesOfEvent(m.eventId);
    if(zones.some(z=>z.official)){if(!confirm(`Este evento contém zona(s) cadastrada(s) originalmente no sistema. Excluir o evento "${m.event}" e suas ${zones.length} zona(s)?`))return;}
    else if(!confirm(`Excluir o evento "${m.event}" e TODAS as ${zones.length} zona(s)?`))return;
    cleanupSafePresentation();state.missions=state.missions.filter(x=>x.eventId!==m.eventId);
    const first=state.missions.find(x=>(x.category||'dominacao')===state.libraryCategory)||state.missions[0];
    state.activeId=first?.id||null;state.activeEventId=first?.eventId||null;saveStore();render();focusActiveMission(false);
  }
  function eventProfiles(category,eventName){
    const fac=/fac\s*x\s*fac/i.test(eventName||'');
    if(category==='dominacao')return {title:'DOMINAÇÃO',
needsSafe:false,
notes:['Área de disputa fixa',
'Spawns podem ficar dentro ou fora do raio',
'Sem fechamento progressivo de gás']};
    if(fac)return {title:'FAC X FAC',
needsSafe:true,
notes:['Safe inicial obrigatória cobrindo todos os spawns',
'Fechamento progressivo do gás',
'Spawn individual por organização',
'Loot/caixas e drop ao morrer conforme padrão Fac x Fac',
'Ranking e regras próprias preservados']};
    return {title:'ZONA DE GÁS',
needsSafe:true,
notes:['Safe inicial obrigatória cobrindo todos os spawns',
'Fechamento progressivo do gás',
'Regras específicas do evento de destino preservadas']};
  }
  function openReplicator(){
    const src=active();if(!src)return;if(state.editing&&state.dirty){alert('Salve ou cancele as alterações antes de replicar.');return;}
    let modal=qs('#mpReplicateModal');if(modal)modal.remove();modal=document.createElement('div');modal.id='mpReplicateModal';modal.className='mp-replicate-backdrop';
    const eventOptions=(cat)=>eventsOfCategory(cat).map(e=>`<option value="${esc(e.id)}">${esc(e.name)}</option>`).join('');
    modal.innerHTML=`<div class="mp-replicate-modal"><div class="mp-replicate-head"><div><b>REPLICAR / CONVERTER ZONA</b><small>A geografia vem da zona de origem; a lógica é adaptada ao evento de destino.</small></div><button id="mpRepClose">×</button></div><div class="mp-replicate-origin"><span>ORIGEM</span><b>${esc(src.event)} → ${esc(src.name)}</b><small>${src.points?.length||0} spawns • original será preservado</small></div><div class="mp-replicate-grid"><label>Tipo de destino<select id="mpRepCat"><option value="dominacao">DOMINAÇÃO</option><option value="gas">ZONA DE GÁS</option></select></label><label>Evento de destino<select id="mpRepEvent"></select></label><label>Nome da nova zona<input id="mpRepName" value="${esc(src.name||'Zona replicada')}"></label><label id="mpRepRadiusWrap">Raio inicial da Safe (m)<input id="mpRepRadius" type="number" min="50" step="10" value="${Math.round(effectiveEventRadius(src)||1000)}"></label></div><div id="mpRepStatus" class="mp-replicate-status"></div><div class="mp-replicate-actions"><button id="mpRepCancel">CANCELAR</button><button id="mpRepCreate" class="primary">CRIAR CÓPIA ADAPTADA</button></div></div>`;
    document.body.appendChild(modal);
    const cat=qs('#mpRepCat',modal),
ev=qs('#mpRepEvent',modal),
rad=qs('#mpRepRadius',modal),
status=qs('#mpRepStatus',modal),
create=qs('#mpRepCreate',modal);
    function refreshEvents(){const es=eventsOfCategory(cat.value);ev.innerHTML=eventOptions(cat.value)+`<option value="__new__">+ Criar novo evento…</option>`;if(!es.length)ev.value='__new__';validate();}
    function validate(){const targetCat=cat.value;const targetEvent=ev.value==='__new__'?'Novo Evento':(eventsOfCategory(targetCat).find(x=>x.id===ev.value)?.name||'Evento');const prof=eventProfiles(targetCat,targetEvent);const r=Math.max(0,Number(rad.value)||0);let outside=0,
max=0;if(prof.needsSafe&&validCoord(src.center?.x)&&validCoord(src.center?.y)){(src.points||[]).forEach(p=>{const d=pointDistanceFromCenter(src,p);max=Math.max(max,d);if(d>r)outside++;});}const ok=!prof.needsSafe||outside===0;qs('#mpRepRadiusWrap',modal).style.display=prof.needsSafe?'grid':'none';status.innerHTML=`<b>${prof.title}</b>${prof.notes.map(n=>`<span>✓ ${n}</span>`).join('')}${prof.needsSafe?`<span class="${ok?'ok':'bad'}">${ok?'✓':'⚠'} ${(src.points||[]).length-outside}/${(src.points||[]).length} spawns dentro da safe${outside?` • ${outside} fora • mínimo aproximado ${Math.ceil(max)} m`:''}</span>`:''}`;create.disabled=!ok;}
    function close(){modal.remove();}
    cat.onchange=refreshEvents;ev.onchange=validate;rad.oninput=validate;qs('#mpRepClose',modal).onclick=close;qs('#mpRepCancel',modal).onclick=close;
    create.onclick=()=>{let targetCat=cat.value,
targetEventId=ev.value,
targetEventName;if(targetEventId==='__new__'){targetEventName=prompt('Nome do novo evento:','Novo Evento');if(!targetEventName)return;targetEventId=eventUid();}else targetEventName=eventsOfCategory(targetCat).find(x=>x.id===targetEventId)?.name||'Evento';const c=JSON.parse(JSON.stringify(src));c.id=uid();c.eventId=targetEventId;c.event=targetEventName;c.name=qs('#mpRepName',modal).value.trim()||`${src.name} — Cópia`;c.category=targetCat;c.official=false;c.createdAt=nowIso();c.updatedAt=nowIso();c.requestText='';c.requestKind=zonesOfEvent(targetEventId).length?'create-zone':'create-event';delete c.facxfacScenarios;delete c.activeScenario;delete c.mapName;c.center.label=targetCat==='gas'?'Centro do Gás / Marco Zero':'Centro da Zona do Evento';if(targetCat==='gas')c.eventRadius=Math.max(50,Number(rad.value)||1000);else c.eventRadius=null;state.missions.unshift(c);state.activeId=c.id;state.activeEventId=c.eventId;state.libraryCategory=targetCat;saveStore();close();render();startEdit();setSaveState('Zona replicada e adaptada • revise e gere a solicitação');focusActiveMission(false);};
    refreshEvents();
  }
  function cloneZone(){
    const m=active();if(!m)return;if(state.editing&&state.dirty){alert('Salve ou cancele as alterações antes de clonar.');return;}
    const c=JSON.parse(JSON.stringify(m));c.id=uid();c.name=`${m.name} — Cópia`;c.official=false;c.createdAt=nowIso();c.updatedAt=nowIso();c.requestText='';c.requestKind='create-zone';
    state.missions.unshift(c);state.activeId=c.id;state.activeEventId=c.eventId;saveStore();render();startEdit();setSaveState('Zona clonada • evento original preservado');
  }
  function cloneFacXFacAsSurvival(){
    const m=active();if(!m)return;if(!/fac\s*x\s*fac/i.test(m.event||'')){alert('Selecione primeiro um evento Fac x Fac para criar o Sobrevivência.');return;}
    if(state.editing&&state.dirty){alert('Salve ou cancele as alterações antes de criar o Sobrevivência.');return;}
    const source=zonesOfEvent(m.eventId),eid=eventUid();
    const clones=source.map((z,idx)=>{const c=JSON.parse(JSON.stringify(z));c.id=uid();c.eventId=eid;c.event='Sobrevivência';c.category='gas';c.official=false;c.createdAt=nowIso();c.updatedAt=nowIso();c.requestText='';c.requestKind=idx===0?'create-event':'create-zone';c.center.label='Centro da Safe / Marco Zero';ensureSafeRoute(c);c.safeRoute.stages.forEach(st=>st.z=0);return c;});
    state.missions.unshift(...clones);state.activeId=clones[0].id;state.activeEventId=eid;state.libraryCategory='gas';saveStore();render();startEdit();setSaveState('Sobrevivência criado a partir do Fac x Fac • original preservado');
  }
  function clearPoints(){if(!requireEdit())return;const m=active();if(!m||!confirm('Limpar todos os pontos desta missão?'))return;m.points=[];m.selectedId=null;commit('Pontos removidos');}
  async function copyText(text){try{await navigator.clipboard.writeText(text);return true;}catch{}const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch{}ta.remove();return true;}
  async function exportValidated(){const m=active(),
v=m?.points.filter(isValidated)||[];if(!v.length){alert('Nenhum ponto validado para exportar.');return;}const txt=v.map((p,i)=>`${p.id||i+1} - ${rawCds(p)}`).join('\n');if(qs('#mpExport'))qs('#mpExport').value=txt;await copyText(txt);}
  async function exportXY(){const m=active();if(!m?.points.length)return;await copyText(m.points.map((p,i)=>`${i+1} - ${isValidated(p)?rawCds(p):tpCds(p)}`).join('\n'));}
  function generateRequest(){
    const m=active();if(!m)return;
    if((m.category||'dominacao')==='gas'&&!requireSafePreflight(m,'gerar a solicitação'))return;
    const category=m.category||'dominacao',
all=m.points||[],
pts=all.filter(isValidated),
pending=all.length-pts.length;
    if(!pts.length){alert('Nenhum spawn validado para gerar a solicitação.');return;}
    if(pending>0){alert(`Existem ${pending} spawn(s) pendente(s). Valide todos antes de gerar a solicitação.`);return;}
    const centerReady=isCenterValidated(m)||(m.official&&validCoord(m.center?.x)&&validCoord(m.center?.y)&&Number.isFinite(Number(m.center?.z))&&Number.isFinite(Number(m.center?.h)));
    if(!centerReady){alert(`Valide primeiro a CDS real do ${category==='gas'?'CENTRO DO GÁS / MARCO ZERO':'CENTRO DA ZONA'}.`);return;}
    const radius=effectiveEventRadius(m),
counts=zoneCoverageCounts(m);
    if(category==='gas'&&counts.outside>0){alert(`${counts.outside} spawn(s) estão FORA da safe inicial (${Math.round(radius)} m). Todos precisam iniciar dentro da área segura.`);return;}
    const center=rawCds(m.center),
panel=m.panel?` - ${m.panel}`:'',
kind=m.requestKind||'alter-zone',
eventName=m.event||'Evento',
zoneName=m.name||'Zona Principal';
    let subject='',
intro='';
    if(kind==='create-event'){
      subject=`Solicitação de Criação do Evento ${eventName}${panel}`;
      intro=`- Solicitamos a criação do evento "${eventName}"${m.panel?` no painel ${m.panel}`:''}.

- O evento deverá ser criado inicialmente com a zona "${zoneName}", utilizando a configuração geográfica abaixo.`;
    }else if(kind==='create-zone'){
      subject=`Solicitação de Criação da Zona ${zoneName} - Evento ${eventName}${panel}`;
      intro=`- Solicitamos a criação da nova zona "${zoneName}" para o evento "${eventName}"${m.panel?` no painel ${m.panel}`:''}.

- As demais zonas já existentes do evento deverão permanecer inalteradas.`;
    }else{
      subject=`Solicitação de Alteração da Zona ${zoneName} - Evento ${eventName}${panel}`;
      intro=`- Solicitamos a alteração da zona "${zoneName}" do evento "${eventName}"${m.panel?` no painel ${m.panel}`:''}, utilizando a configuração geográfica abaixo.

- As demais zonas do evento deverão permanecer inalteradas.`;
    }
    const centerTitle=category==='gas'?'CENTRO DO GÁS / MARCO ZERO':'COORDENADA CENTRAL';
    const radiusTitle=category==='gas'?'RAIO INICIAL DA SAFE / GÁS':'RAIO DA ÁREA DE DOMINAÇÃO';
    const isFacXFac=/fac\s*x\s*fac/i.test(eventName);
    const mechanic=category==='gas'
      ? (isFacXFac ? `- Cada facção deverá nascer em uma coordenada diferente da zona selecionada.

- Todos os participantes deverão receber automaticamente os itens necessários no inventário conforme o padrão atual do Fac x Fac.

- Deverão existir caixas de loot espalhadas pelo mapa conforme o funcionamento atual do evento.

- Após alguns minutos, a zona de vitória/safe deverá ser ativada e iniciar o fechamento progressivo.

- Quem permanecer fora da zona deverá receber dano do gás conforme o sistema atual.

- Ao morrer, o jogador deverá dropar uma caixa contendo seus itens, conforme o funcionamento atual do Fac x Fac.

- O comando /evento deverá continuar permitindo escalar a facção de qualquer lugar do mapa, salvar a escalação e aguardar o horário do evento.

- O sistema de ranking próprio e as premiações mensais do Fac x Fac deverão permanecer inalterados.

- Os membros poderão utilizar o N para pingar o mapa para seus aliados, conforme o padrão atual do evento.` : `- Todos os spawns deverão iniciar dentro da safe inicial.

- Após o início, o fechamento da safe/gás deverá seguir a configuração e funcionamento atuais do evento.`)
      : `- Os spawns poderão ficar dentro ou fora da área de Dominação conforme a distribuição planejada.

- A área de Dominação deverá permanecer fixa, sem fechamento progressivo de gás/safe.`;
    const selectorNote=kind==='create-zone'?`

- A nova zona deverá ser adicionada à seleção de zonas do evento "${eventName}".`:'';
    const safeRoute=category==='gas'?ensureSafeRoute(m):null;
    const safeRouteText=category==='gas'&&safeRoute?(()=>{
      const stages=safeRoute.stages||[];if(!stages.length)return '';
      const lines=['','MOVIMENTAÇÃO DA SAFE:',''];
      stages.forEach((st,i)=>{
        const opts=i>0?safeOptions(safeRoute,i).filter(p=>validCoord(p.x)&&validCoord(p.y)):[];
        const pos=validCoord(st.x)&&validCoord(st.y)?f(st.x)+','+f(st.y):'posição definida pelas possibilidades abaixo';
        lines.push('- SAFE '+(i+1)+': '+pos+' • raio '+Math.round(Number(st.radius)||0)+' m • dano fora da SAFE: '+(Number(st.damage)||0)+' HP por segundo • fechamento '+(Number(st.closeSeconds)||0)+'s'+(i<stages.length-1?' • movimento para próxima SAFE '+(Number(st.moveSeconds)||0)+'s.':'.'));
        opts.forEach((p,j)=>lines.push('  - Opção '+String.fromCharCode(65+j)+': '+f(p.x)+','+f(p.y)));
      });
      lines.push('','DANO FORA DA SAFE:','- O dano deve ser aplicado continuamente por segundo enquanto o player estiver fora do círculo ativo.','- O valor do dano deve acompanhar automaticamente a etapa atual da SAFE.','- Enquanto estiver fora da SAFE, exibir aviso visível ao player no padrão: "VOCÊ ESTÁ FORA DA SAFE — TOMANDO X DE DANO POR SEGUNDO".','- Substituir X pelo dano configurado na SAFE ativa e atualizar o aviso quando a etapa mudar.','- Ao retornar para dentro da SAFE, interromper imediatamente o dano e remover o aviso.');
      lines.push('','REGRA DE MOVIMENTAÇÃO:','- A progressão não fica limitada a 3 SAFEs. Utilizar todas as etapas configuradas no Planejador, incluindo SAFE 4, SAFE 5 e seguintes, até a SAFE final.','- Quando uma etapa possuir múltiplas possibilidades, sortear somente uma opção que mantenha uma rota geometricamente compatível até a etapa seguinte.','- Durante cada deslocamento, centro e área do gás devem se mover continuamente, sem teleporte da zona.');
      return lines.join('\n');
    })():'';
    const gasHeightNote=category==='gas'?`

OBSERVAÇÃO — ALTURA DA SAFE:

- A Safe não deve ficar presa ao Z da CDS do centro. Como poderá se movimentar entre locais com alturas diferentes, o gás deve ter cobertura vertical do chão/abaixo do terreno até uma altura suficiente para permanecer visível durante todo o percurso.

- A movimentação e a verificação da Safe devem considerar principalmente X/Y e o raio atual, evitando que o gás fique enterrado ou suspenso devido à diferença de altitude do mapa.`:'';
    const text=`Assunto:

- ${subject};

Solicitação:

${intro}${selectorNote}

${centerTitle}:

- ${center}

${radiusTitle}:

- ${Math.round(radius)} metros.

SPAWNS DAS ORGANIZAÇÕES:

${pts.map((p,i)=>`${String(i+1).padStart(2,'0')} - ${rawCds(p)}`).join('\n')}

DISTRIBUIÇÃO:

- Utilizar 1 spawn diferente por organização inscrita.

- Caso haja menos organizações que pontos disponíveis, utilizar somente a quantidade necessária.

- Nenhuma organização deverá compartilhar o mesmo ponto de spawn.

${mechanic}${safeRouteText}${gasHeightNote}

- As demais configurações, regras, premiações, duração e funcionamento do evento deverão permanecer inalterados.`;
    m.requestText=text;if(qs('#mpRequestText'))qs('#mpRequestText').value=text;
  }
  async function copyCurrentRequest(){generateRequest();const m=active();if(!m?.requestText)return;await copyText(m.requestText);const b=qs('#mpCopyRequest');if(b){const old=b.textContent;b.textContent='COPIADO ✓';setTimeout(()=>b.textContent=old,900);}}

  function ensureCentralV954(){
    let host=qs('#mpCentralV954');
    if(host)return host;
    const shell=qs('.mission-planner-shell');if(!shell)return null;
    host=document.createElement('section');host.id='mpCentralV954';host.className='mp-central-v952';
    shell.insertAdjacentElement('beforebegin',host);return host;
  }
  function centralCategory(){return state.centralFilter||'all';}
  function selectEventForAction(eventId){
    const zones=zonesOfEvent(eventId),
z=zones[0];if(!z)return false;
    state.activeId=z.id;state.activeEventId=eventId;state.libraryCategory=z.category||'dominacao';saveStore();return true;
  }
  function syncConflicts(){return state.missions.filter(m=>m?._syncConflict?.remote);}
  function resolveSyncConflict(id,choice){
    const idx=state.missions.findIndex(m=>m.id===id);if(idx<0)return;
    const local=state.missions[idx],remote=local?._syncConflict?.remote;if(!remote)return;
    if(choice==='firebase'){
      const chosen=JSON.parse(JSON.stringify(remote));delete chosen._syncConflict;chosen.updatedAt=nowIso();state.missions[idx]=chosen;
    }else{
      delete local._syncConflict;local.updatedAt=nowIso();
    }
    saveStore();render();setSaveState(choice==='firebase'?'Conflito resolvido • versão Firebase escolhida':'Conflito resolvido • versão local mantida');
  }

  function renderCentralV954(){
    const host=ensureCentralV954();if(!host)return;
    const filter=centralCategory(),query=String(state.centralSearch||'').trim().toLowerCase(),allEvents=[];
    ['dominacao','gas'].forEach(cat=>eventsOfCategory(cat).forEach(e=>allEvents.push({...e,category:cat})));
    let events=filter==='all'?allEvents:allEvents.filter(e=>e.category===filter);
    if(query)events=events.filter(e=>String(e.name||'').toLowerCase().includes(query)||zonesOfEvent(e.id).some(z=>String(z.name||'').toLowerCase().includes(query)));
    const readyTotal=state.missions.filter(z=>isCenterValidated(z)&&z.points?.length&&z.points.every(isValidated)).length;
    const pendingTotal=state.missions.length-readyTotal,conflicts=syncConflicts();
    host.innerHTML=`${conflicts.length?`<div class="mp-readout" style="margin-bottom:12px;border-color:#f59e0b"><b>⚠ CONFLITO DE SINCRONIZAÇÃO • ${conflicts.length}</b><br><span style="opacity:.8">A mesma zona foi alterada em dois computadores sem uma versão claramente mais recente. Escolha qual deve prevalecer.</span>${conflicts.map(z=>`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px"><strong style="flex:1;min-width:180px">${esc(z.event||'Evento')} • ${esc(z.name||'Zona')}</strong><button type="button" data-conflict-local="${esc(z.id)}">MANTER LOCAL</button><button type="button" class="mpc-primary" data-conflict-cloud="${esc(z.id)}">USAR FIREBASE</button></div>`).join('')}</div>`:''}<div class="mpc-head"><div><span>BIBLIOTECA DE MAPAS</span><strong>${allEvents.length} eventos <i>•</i> ${state.missions.length} zonas <i>•</i> ${readyTotal} prontas <i>•</i> ${pendingTotal} em revisão</strong></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px"><span id="mpCloudStateCentral" class="mp-cloud-state ${state.cloudState||'local'}">${state.cloudState==='ok'?'☁ SINCRONIZADO':state.cloudState==='sync'?'↻ SINCRONIZANDO...':'⚠ LOCAL'}</span><small id="mpCloudMeta" style="opacity:.7;text-align:right">${state.cloudMeta?.updatedAtText?'Última: '+new Date(state.cloudMeta.updatedAtText).toLocaleString('pt-BR')+(state.cloudMeta.updatedBy?' • '+esc(state.cloudMeta.updatedBy):''):'Ainda sem sincronização confirmada nesta sessão'}</small></div><button type="button" id="mpForceCloudSync" class="mpc-primary" style="white-space:nowrap">↻ SINCRONIZAR FIREBASE</button></div></div>
      <div class="mpc-toolbar" style="align-items:center;gap:10px;flex-wrap:wrap"><div class="mpc-filters"><button data-cfilter="all" class="${filter==='all'?'active':''}">TODOS</button><button data-cfilter="dominacao" class="${filter==='dominacao'?'active':''}">DOMINAÇÃO</button><button data-cfilter="gas" class="${filter==='gas'?'active':''}">GÁS / SAFE</button></div><div style="display:flex;gap:8px;flex:1;justify-content:flex-end;min-width:280px"><input id="mpCentralSearch" value="${esc(state.centralSearch||'')}" placeholder="Buscar evento ou zona…" style="max-width:300px"><button id="mpCentralNewEvent" class="mpc-primary">+ NOVO EVENTO</button></div></div>
      <div class="mpc-events">${events.length?events.map(e=>{
        const zones=zonesOfEvent(e.id),ready=zones.filter(z=>isCenterValidated(z)&&z.points?.length&&z.points.every(isValidated)).length;
        return `<article class="mpc-event"><header><div><span>${e.category==='gas'?'GÁS / SAFE DINÂMICA':'DOMINAÇÃO'}</span><h3>${esc(e.name)}</h3><small>${zones.length} zona${zones.length===1?'':'s'} • ${ready}/${zones.length} pronta${zones.length===1?'':'s'}</small></div><div class="mpc-event-actions"><button data-newzone="${esc(e.id)}">+ NOVA ZONA</button><button class="danger" data-delevent="${esc(e.id)}">EXCLUIR EVENTO</button></div></header><div class="mpc-zones">${zones.map(z=>{const total=z.points?.length||0,val=(z.points||[]).filter(isValidated).length,centerOk=isCenterValidated(z),readyZone=centerOk&&total>0&&val===total,geom=e.category==='gas'?'SAFE':(dominationZoneMode(z)==='polygon'?'POLÍGONO':'RAIO'),updated=z.updatedAt?new Date(z.updatedAt).toLocaleDateString('pt-BR'):'—';return `<button class="mpc-zone" data-openzone="${esc(z.id)}" title="Abrir ${esc(z.name||'zona')}"><span style="min-width:0"><b>${esc(z.name||'Zona sem nome')}</b><small>${geom} • ${total?val+'/'+total+' CDS validadas':'sem CDS'} • atualizado ${updated}</small></span><em class="${readyZone?'ok':''}">${readyZone?'✓ PRONTA':centerOk?'REVISAR':'PENDENTE'}</em></button>`}).join('')||'<div class="mpc-empty">Nenhuma zona cadastrada.</div>'}</div></article>`
      }).join(''):'<div class="mpc-empty big">Nenhum mapa encontrado neste filtro.</div>'}</div>`;
    qsa('[data-conflict-local]',host).forEach(btn=>btn.onclick=()=>resolveSyncConflict(btn.dataset.conflictLocal,'local'));
    qsa('[data-conflict-cloud]',host).forEach(btn=>btn.onclick=()=>resolveSyncConflict(btn.dataset.conflictCloud,'firebase'));
    qsa('[data-cfilter]',host).forEach(btn=>btn.onclick=()=>{state.centralFilter=btn.dataset.cfilter;renderCentralV954();});
    const search=qs('#mpCentralSearch',host);if(search){search.oninput=()=>{state.centralSearch=search.value;clearTimeout(state.centralSearchTimer);state.centralSearchTimer=setTimeout(renderCentralV954,180);};setTimeout(()=>{if(document.activeElement?.id==='mpCentralSearch'){const el=qs('#mpCentralSearch');el?.focus();el?.setSelectionRange(el.value.length,el.value.length);}},0);}
    qsa('[data-openzone]',host).forEach(btn=>btn.onclick=()=>switchMission(btn.dataset.openzone));
    qsa('[data-newzone]',host).forEach(btn=>btn.onclick=()=>{if(selectEventForAction(btn.dataset.newzone))createZone();});
    qsa('[data-delevent]',host).forEach(btn=>btn.onclick=()=>{if(selectEventForAction(btn.dataset.delevent))deleteEvent();});
    qs('#mpCentralNewEvent',host)?.addEventListener('click',()=>{if(filter!=='all')state.libraryCategory=filter;createEvent();});
    qs('#mpForceCloudSync',host)?.addEventListener('click',forcePlannerCloudSync);
  }

  function bindFormAutosave(){
    const map={mpMissionName:['name'],mpEventCategory:['category'],mpEventType:['event'],mpPanel:['panel'],mpMode:['mode'],mpRequestKind:['requestKind'],mpCenterLabel:['center','label'],mpCenterX:['center','x'],mpCenterY:['center','y'],mpCenterZ:['center','z'],mpCenterH:['center','h'],mpCircleRadius:['circleRadius'],mpStartAngle:['startAngle'],mpRadius:['spawnRadius']};
    Object.entries(map).forEach(([id,path])=>{const el=qs('#'+id);if(!el)return;let inputStart=null;const eventName=['mpMode','mpEventCategory','mpRequestKind'].includes(id)?'change':'input';el.addEventListener('focus',()=>{inputStart=state.editing?editSnapshot():null;});el.addEventListener(eventName,e=>{const m=active();if(!m||!state.editing)return;let v=e.target.value;const oldCategory=m.category;if(['mpCenterX','mpCenterY','mpCenterZ','mpCenterH','mpCircleRadius','mpStartAngle','mpRadius'].includes(id))v=num(v);if(path.length===2){if((id==='mpCenterX'||id==='mpCenterY')&&Number(m.center[path[1]])!==Number(v)){m.center.z=0;m.center.h=0;m.center.status='planned';m.center.validatedAt=null;m.center.validationReason='coordinate-change';}m[path[0]][path[1]]=v;}else m[path[0]]=v;if(id==='mpEventType'){zonesOfEvent(m.eventId).forEach(z=>z.event=v);}if(id==='mpPanel'){zonesOfEvent(m.eventId).forEach(z=>z.panel=v);}if(id==='mpEventCategory'){zonesOfEvent(m.eventId).forEach(z=>z.category=v);}if(id==='mpEventCategory'&&oldCategory!==v){state.libraryCategory=v;if(v==='gas'){m.center.label='Centro do Gás / Marco Zero';}else{m.center.label='Centro da Zona do Evento';}/* trocar categoria não muda a CDS; mantém validação existente */}if(id==='mpMode'&&v==='assistant'){m.points.forEach(p=>{if(!p.validatedAt&&p.status!=='validated')p.status='planned';});}state.dirty=true;setSaveState('Alteração • NÃO SALVO');renderMap();renderCenterValidation();renderCoverage();if(id==='mpRadius'&&qs('#mpRadiusValue'))qs('#mpRadiusValue').textContent=`${v||100} m`; });if(eventName==='input')el.addEventListener('change',()=>{if(!state.editing)return;if(inputStart&&inputStart!==editSnapshot()){const current=editSnapshot();state.lastEditSnapshot=inputStart;pushUndo();state.lastEditSnapshot=current;state.dirty=true;updateEditUi();}inputStart=null;});else el.addEventListener('change',()=>{if(!state.editing)return;const current=editSnapshot();if(inputStart&&inputStart!==current){state.lastEditSnapshot=inputStart;pushUndo();state.lastEditSnapshot=current;state.dirty=true;updateEditUi();}inputStart=null;});});
  }

  function setWorkspace(open){
    state.workspaceOpen=!!open;
    const page=qs('#page-planejador');if(page)page.classList.toggle('mp-library-mode',!state.workspaceOpen);
    const bar=qs('#mpWorkspaceBar');if(bar)bar.hidden=!state.workspaceOpen;
    if(state.workspaceOpen)setTimeout(()=>{try{state.map?.invalidateSize();focusActiveMission(false)}catch(e){}},100);
  }
  function ensureWorkspaceBar(){
    const shell=qs('.mission-planner-shell');if(!shell||qs('#mpWorkspaceBar'))return;
    const bar=document.createElement('div');bar.id='mpWorkspaceBar';bar.className='mp-workspace-bar';
    bar.innerHTML=`<button type="button" id="mpBackLibrary" class="mp-icon-action" title="Voltar às missões — retorna para a biblioteca de mapas" aria-label="Voltar às missões">←</button><div class="mp-workspace-path"><b id="mpWorkspaceEvent">Evento</b><span>›</span><strong id="mpWorkspaceZone">Zona</strong></div><div class="mp-editor-actions"><button type="button" id="mpNewZone" class="mp-icon-action" title="Nova zona — cria outra zona dentro deste evento" aria-label="Nova zona">＋</button><button type="button" id="mpReplicateZone" class="mp-icon-action" title="Replicar — reaproveita a configuração desta zona em uma nova zona" aria-label="Replicar zona">⧉</button><button type="button" id="mpCloneZone" class="mp-icon-action" title="Clonar — cria uma cópia independente desta zona" aria-label="Clonar zona">⎘</button><button type="button" id="mpDeleteMission" class="mp-delete-action mp-icon-action" title="Excluir zona — remove esta zona do evento" aria-label="Excluir zona">⌫</button><button type="button" id="mpUndoEdit" class="mp-icon-action" title="Desfazer — volta a última alteração da edição" aria-label="Desfazer" style="display:none">↶</button><button type="button" id="mpRedoEdit" class="mp-icon-action" title="Refazer — reaplica a alteração desfeita" aria-label="Refazer" style="display:none">↷</button><button type="button" id="mpEditMission" class="mp-icon-action" title="Editar — habilita alterações nesta zona" aria-label="Editar zona">✎</button><button type="button" id="mpSaveMission" class="primary mp-icon-action" title="Salvar — grava as alterações desta zona" aria-label="Salvar alterações" style="display:none">✓</button><button type="button" id="mpCancelEdit" class="mp-icon-action" title="Cancelar — descarta a edição atual" aria-label="Cancelar edição" style="display:none">×</button></div><span id="mpCloudState" class="mp-cloud-state local">⚠ MODO LOCAL</span>`;
    shell.insertAdjacentElement('beforebegin',bar);
    qs('#mpBackLibrary')?.addEventListener('click',()=>{if(state.editing&&state.dirty&&!confirm('Existem alterações não salvas. Deseja voltar às missões?'))return;if(state.editing)cancelEdit();setWorkspace(false);renderCentralV954();});
  }
  function renderWorkspaceBar(){
    const m=active();const ev=qs('#mpWorkspaceEvent'),zn=qs('#mpWorkspaceZone');if(ev)ev.textContent=m?.event||'Evento';if(zn)zn.textContent=m?.name||'Zona';
  }

  function bind(){
    if(state.initialized)return;state.initialized=true;loadStore();recoverEditDraft();window.addEventListener('beforeunload',e=>{if(state.editing&&state.dirty){saveEditDraft();e.preventDefault();e.returnValue='';}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.safePresentation){e.preventDefault();stopSafePreview();exitSafePresentation();return;}if(!state.editing)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redoEdit():undoEdit();}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redoEdit();}});state.activeEventId=active()?.eventId||state.activeEventId;ensureCentralV954();ensureWorkspaceBar();ensureBackupCard();ensurePlannerTabs();ensureSafeRouteUi();adoptStrayCards();ensureMapKpis();initMap();render();renderWorkspaceBar();setWorkspace(false);bindFormAutosave();updateEditUi();
    qs('#mpEditMission')?.addEventListener('click',startEdit);qs('#mpUndoEdit')?.addEventListener('click',undoEdit);qs('#mpRedoEdit')?.addEventListener('click',redoEdit);qs('#mpSaveMission')?.addEventListener('click',saveMission);qs('#mpCancelEdit')?.addEventListener('click',cancelEdit);qs('#mpNewZone')?.addEventListener('click',createZone);qs('#mpCloneZone')?.addEventListener('click',cloneZone);qs('#mpReplicateZone')?.addEventListener('click',openReplicator);qs('#mpDeleteMission')?.addEventListener('click',deleteZone);
    qs('#mpPlaceBtn')?.addEventListener('click',()=>{if(!requireEdit())return;const enable=state.mapMode!=='spawn';resetMapPlacementModes();state.placing=enable;state.mapMode=enable?'spawn':'center';qs('#missionPlannerMap')?.classList.toggle('mp-crosshair',state.placing);if(state.map?.getContainer())state.map.getContainer().style.cursor=state.placing?'crosshair':'';qs('#mpPlaceBtn').textContent=state.placing?'PARAR DE MARCAR':'MARCAR PONTO NO MAPA';});
    qs('#mpFit')?.addEventListener('click',fit);qs('#mpGoLS')?.addEventListener('click',()=>state.map?.setView(ll(900,-600),3));qs('#mpGoCayo')?.addEventListener('click',()=>{if(state.map&&state.cayoBounds)state.map.fitBounds(state.cayoBounds,{padding:[20,20]});});qs('#mpGenerateCircle')?.addEventListener('click',generateCircle);qs('#mpImport')?.addEventListener('click',importBulk);qs('#mpValidateBtn')?.addEventListener('click',()=>validateSelected());
    qs('#mpValidateBulkBtn')?.addEventListener('click',validateBulk);
    qs('#mpInvalidateBtn')?.addEventListener('click',invalidateSelected);
    qs('#mpCopyPointTp')?.addEventListener('click',copySelectedTp);
    qs('#mpJumpPending')?.addEventListener('click',()=>{const m=active();const id=nextPendingId(m,m?.selectedId||0);if(!id){setValidationFeedback('<b>Nenhum ponto pendente nesta zona.</b>','ok');return;}selectPoint(id);const p=m.points[id-1];if(p)state.map?.setView(ll(p.x,p.y),5);qs('#mpValidateCds')?.focus();});
    qs('#mpValidateCds')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();validateSelected();}});qs('#mpAddCoord')?.addEventListener('click',addManual);qs('#mpClear')?.addEventListener('click',clearPoints);qs('#mpExportBtn')?.addEventListener('click',exportValidated);qs('#mpExportXYBtn')?.addEventListener('click',exportXY);qs('#mpGenerateRequest')?.addEventListener('click',generateRequest);qs('#mpCopyRequest')?.addEventListener('click',copyCurrentRequest);qs('#mpCaptureBtn')?.addEventListener('click',()=>captureSnapshot(true));
    setTimeout(()=>{state.map?.invalidateSize();fit();queueSnapshot();},180);
    setTimeout(()=>syncMissionsFromCloud(),1200);clearInterval(state.autosaveTimer);state.autosaveTimer=setInterval(saveEditDraft,5000);
  }
  /* ---------------------------------------------------------------
     V9.4.1 - A lateral tinha 11 cards empilhados e exigia rolagem
     constante. Aqui os MESMOS cards sao reorganizados em 4 abas, sem
     recriar elemento nenhum (os listeners continuam valendo).
  --------------------------------------------------------------- */
  const PLANNER_TABS=[
    {id:'zona',label:'1 · ZONA / SAFE'},
    {id:'pontos',label:'2 · CDS / SPAWNS'},
    {id:'validacao',label:'3 · VALIDAR'},
    {id:'entrega',label:'4 · SIMULAR / SALVAR'}
  ];
  function cardTabKey(card){
    const t=(card.querySelector('h3')?.textContent||'').toUpperCase();
    if(card.classList.contains('mp-validation-card')||t.includes('VALIDA'))return 'validacao';
    if(t.includes('EXPORT')||t.includes('SOLICITA')||t.includes('PRINT')||t.includes('SEGURANÇA'))return 'entrega';
    if(t.includes('PONTO')||t.includes('SPAWN')||t.includes('LOTE')||t.includes('IMPORT')||t.includes('STATUS'))return 'pontos';
    return 'zona';
  }
  function plannerPanel(id){return qs(`.mp-tabpanel[data-tab="${id}"]`);}
  function adoptStrayCards(){
    const side=qs('.mission-planner-side');if(!side||!qs('#mpTabBar'))return;
    Array.from(side.children).forEach(el=>{
      if(!el.classList||!el.classList.contains('mp-card'))return;
      plannerPanel(el.dataset.forceTab||cardTabKey(el))?.appendChild(el);
    });
    const safe=qs('#mpSafeRouteBox');if(safe&&!safe.closest('.mp-tabpanel[data-tab="zona"]'))plannerPanel('zona')?.appendChild(safe);
  }
  function setPlannerTab(id){
    qsa('.mp-tab').forEach(b=>{const on=b.dataset.tab===id;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false');});
    qsa('.mp-tabpanel').forEach(p=>p.classList.toggle('active',p.dataset.tab===id));
    const m=active(),gas=(m?.category||'dominacao')==='gas';
    qsa('.mp-tab').forEach(b=>{if(b.dataset.tab==='zona')b.title=gas?'Definir zona inicial e rota progressiva das SAFEs':'Definir geometria e limites da zona';});
    try{localStorage.setItem('highos_mp_tab',id);}catch(e){}
  }
  function fmtBackupData(iso){
    try{return new Date(iso).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return iso}
  }
  function renderBackupList(){
    const box=qs('#mpBackupList');if(!box)return;
    const lista=readBackups();
    box.innerHTML=lista.length?lista.map((b,i)=>
      `<div class="mp-backup-row"><div><b>${fmtBackupData(b.at)}</b><small>${b.qtd} missao(oes)</small></div><button type="button" data-restore="${i}">RESTAURAR</button></div>`
    ).join(''):'<div class="mp-note">Nenhum backup automatico ainda. Ele e criado a cada alteracao salva.</div>';
    qsa('[data-restore]',box).forEach(b=>b.onclick=()=>{
      const item=readBackups()[Number(b.dataset.restore)];
      if(!item)return;
      let dados=[];try{dados=JSON.parse(item.corpo)}catch(e){}
      const add=mergeMissions(dados);
      const el=qs('#mpBackupFeedback');
      if(el){el.className='mp-validation-feedback '+(add?'ok':'info');
        el.innerHTML=add?`<b>${add} missao(oes) recuperadas</b><span>Nada foi substituido: apenas o que faltava foi devolvido a lista.</span>`
                        :'<b>Nada a recuperar</b><span>Todas as missoes deste backup ja estao na lista atual.</span>';}
      renderBackupList();
    });
  }
  function baixarBackup(){
    try{
      const blob=new Blob([JSON.stringify(state.missions,null,2)],{type:'application/json'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download=`high-os-missoes-${new Date().toISOString().slice(0,10)}.json`;
      a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    }catch(e){alert('Nao foi possivel gerar o arquivo: '+e.message)}
  }
  function restaurarArquivo(file){
    if(!file)return;
    const r=new FileReader();
    r.onload=()=>{
      let dados=[];
      try{dados=JSON.parse(String(r.result||'[]'))}catch(e){alert('Arquivo invalido.');return;}
      if(!Array.isArray(dados)){alert('O arquivo nao contem uma lista de missoes.');return;}
      const add=mergeMissions(dados);
      const el=qs('#mpBackupFeedback');
      if(el){el.className='mp-validation-feedback '+(add?'ok':'info');
        el.innerHTML=add?`<b>${add} missao(oes) importadas do arquivo</b>`:'<b>Nada novo no arquivo</b><span>Todas essas missoes ja existem aqui.</span>';}
    };
    r.readAsText(file);
  }
  function ensureBackupCard(){
    const side=qs('.mission-planner-side');
    if(!side||qs('#mpBackupCard'))return;
    const card=document.createElement('div');
    card.className='mp-card';card.id='mpBackupCard';
    card.innerHTML=`<h3>SEGURANÇA DAS MISSÕES</h3>
      <p class="mp-note">Cada alteração salva gera um backup automático neste navegador. Restaurar só devolve o que estiver faltando — nunca apaga uma missão atual.</p>
      <div class="mp-actions mp-actions-tight">
        <button type="button" id="mpBackupDownload">BAIXAR CÓPIA (.json)</button>
        <label class="mp-file-btn">RESTAURAR ARQUIVO<input id="mpBackupFile" type="file" accept="application/json" hidden></label>
      </div>
      <div id="mpBackupFeedback" class="mp-validation-feedback info">Backups automáticos das últimas 8 alterações.</div>
      <div id="mpBackupList" class="mp-backup-list"></div>`;
    side.appendChild(card);
    qs('#mpBackupDownload')?.addEventListener('click',baixarBackup);
    qs('#mpBackupFile')?.addEventListener('change',e=>{restaurarArquivo(e.target.files?.[0]);e.target.value='';});
    renderBackupList();
  }
  function ensurePlannerTabs(){
    const side=qs('.mission-planner-side');
    if(!side||qs('#mpTabBar'))return;
    const cards=Array.from(side.querySelectorAll(':scope > .mp-card'));
    if(!cards.length)return;
    const bar=document.createElement('div');bar.id='mpTabBar';bar.className='mp-tabbar';bar.setAttribute('role','tablist');
    const panels={};
    PLANNER_TABS.forEach(t=>{
      const b=document.createElement('button');
      b.type='button';b.className='mp-tab';b.dataset.tab=t.id;b.setAttribute('role','tab');
      b.innerHTML=`<span>${t.label}</span><i class="mp-tab-badge" data-badge="${t.id}"></i>`;
      b.addEventListener('click',()=>setPlannerTab(t.id));
      bar.appendChild(b);
      const panel=document.createElement('div');panel.className='mp-tabpanel';panel.dataset.tab=t.id;
      panels[t.id]=panel;
    });
    side.insertBefore(bar,side.firstChild);
    PLANNER_TABS.forEach(t=>side.appendChild(panels[t.id]));
    cards.forEach(card=>panels[cardTabKey(card)].appendChild(card));
    let salva='zona';try{salva=localStorage.getItem('highos_mp_tab')||'zona';}catch(e){}
    setPlannerTab(PLANNER_TABS.some(t=>t.id===salva)?salva:'zona');
  }
  function renderPlannerBadges(){
    const m=active();if(!m)return;
    const pend=(m.points||[]).filter(p=>!isValidated(p)).length;
    const total=(m.points||[]).length;
    const set=(id,txt,warn)=>{const el=qs(`[data-badge="${id}"]`);if(!el)return;el.textContent=txt||'';el.classList.toggle('warn',!!warn);el.classList.toggle('hidden',!txt);};
    set('pontos',total?String(total):'',false);
    set('validacao',pend?String(pend):'✓',!!pend);
    set('zona','',false);
    set('entrega','',false);
    const kpi=qs('#mpMapKpis');
    if(kpi)kpi.innerHTML=`<span><b>${total-pend}</b> validados</span><span class="${pend?'warn':''}"><b>${pend}</b> pendentes</span><span><b>${total}</b> pontos</span>`;
  }
  function ensureMapKpis(){
    const status=qs('.mp-map-status');
    if(!status||qs('#mpMapKpis'))return;
    const box=document.createElement('div');box.id='mpMapKpis';box.className='mp-map-kpis';
    status.appendChild(box);
  }
  function activate(){
    bind();
    // o mapa e criado dentro de uma secao que pode estar escondida: varias
    // remedidas garantem que o Leaflet enxergue o tamanho real
    [80,300,700,1400].forEach(ms=>setTimeout(()=>{try{state.map?.invalidateSize()}catch(e){}},ms));
    setTimeout(()=>{fit();},320);
    if(!state.resizeWatch&&window.ResizeObserver){
      const box=qs('#missionPlannerMap');
      if(box){
        state.resizeWatch=new ResizeObserver(()=>{try{state.map?.invalidateSize()}catch(e){}});
        state.resizeWatch.observe(box);
      }
    }
  }
  window.HighMissionPlanner={activate,fit,captureSnapshot,syncCloud:syncMissionsFromCloud,applyCloudMissions};
  document.addEventListener('DOMContentLoaded',()=>{if(qs('#missionPlannerMap'))bind();});
})();
