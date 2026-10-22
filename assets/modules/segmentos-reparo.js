/**
 * Recuperação pontual dos segmentos que o mapeamento V8.13 gravava
 * novamente como APOIO em cada login administrativo.
 *
 * Nunca força segmentos de outros Group e nunca repete a migração depois
 * do registro em config/segmentos. Depois disso, o administrador pode
 * mover qualquer Group livremente (inclusive de volta para APOIO).
 */
export const segmentKeyFor=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toUpperCase().replace(/[^A-Z0-9]/g,'');
export const categoryGroupType=group=>{
 const g=segmentKeyFor(group);
 if(g.startsWith('ILEGALMECHANIC')||g.startsWith('ILEGALMECANIC'))return 'mecanica';
 if(g.startsWith('ILEGALMEDIC'))return 'hospital';
 return null;
};
export const dedicatedCategoryKeys=Object.freeze({
 mecanica:'MECANICAILEGAL',hospital:'HOSPITALILEGAL'
});
export function planLegacyCategoryRecovery(groups,registry,recovery={}){
 const definitions=Array.isArray(registry)?registry:[];
 const registered=Object.fromEntries(Object.entries(dedicatedCategoryKeys).map(([type,key])=>[
  type,definitions.find(s=>segmentKeyFor(s?.nome)===key)?.nome||null
 ]));
 const readyTypes=Object.keys(registered).filter(type=>registered[type]&&recovery[type]!==true);
 const changes=(Array.isArray(groups)?groups:[]).flatMap(f=>{
  const type=categoryGroupType(f?.group);
  if(!readyTypes.includes(type)||segmentKeyFor(f.segmento)!=='APOIO')return [];
  return [{group:f.group,fac:f.faccao||'',from:f.segmento,to:registered[type],type}];
 });
 return {changes,mark:readyTypes,registered};
}
