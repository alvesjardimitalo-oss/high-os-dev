/* ============================================================
   FONTE DOS DADOS DO PAINEL
   ------------------------------------------------------------
   Ate a V16 o painel gravava tudo no bot (PC de casa) e o Firestore
   era so contingencia. Com o PC desligado o painel ficava somente
   leitura. Agora a fonte e o Firestore (plano gratuito do Firebase)
   e o bot vira opcional: se estiver ligado, o painel ainda usa ele
   para metricas da Paradise, agenda do diario e a copia do anuncio
   de faccao livre; se estiver desligado, nada trava.

   Os anuncios de entrega e recolhimento no Discord do Ilegal saiam
   do bot pelo webhook do canal. Agora o proprio painel posta no
   mesmo webhook, com o mesmo visual (embed roxo + arte do canal).
   ============================================================ */

export const COR_ILEGAL = 0x8d35ff;
const ARTE_BASE = 'https://alvesjardimitalo-oss.github.io/high-os/assets/avisos/';
export const ARTE = {
  ENTREGA: ARTE_BASE + 'faccoes-entregues.jpg',
  RECOLHIMENTO: ARTE_BASE + 'faccoes-retomadas.jpg'
};
const TITULO = {
  ENTREGA: 'ENTREGA DE ORGANIZAÇÃO — HIGH ILEGAL',
  RECOLHIMENTO: 'RECOLHIMENTO DE FACÇÃO — HIGH ILEGAL'
};

/**
 * 'bot' ou 'firestore' forcados em api-config.js; senao 'auto': o painel
 * le highos/fonte_dados, que a ferramenta de migracao grava ao terminar.
 * Assim o painel so troca de fonte depois que os dados ja foram copiados.
 */
export function fonteDosDados(win = globalThis) {
  const v = String(win?.HIGH_OS_FONTE || 'auto').toLowerCase();
  return v === 'bot' || v === 'firestore' ? v : 'auto';
}
export function fonteDoMarcador(dados) {
  return dados && String(dados.fonte || '').toLowerCase() === 'firestore' ? 'firestore' : 'bot';
}

/** Registro do bot (nomes nativos) -> ficha do painel (nomes em portugues). */
export function fichaDoBot(x = {}) {
  const faccao = x.faccao || x.highOsFaction || '';
  const st = String(x.status || '').toUpperCase();
  return {
    ...x,
    id: x.group || x.id,
    group: x.group || x.id || '',
    segmento: x.segmento || x.segment || '',
    qg: x.qg || x.location || '',
    produto: x.produto || x.product || '',
    cds: x.cds || x.coords || '',
    anuncio: x.anuncio || x.announced || '',
    faccao,
    lider: x.lider || x.responsible || '',
    staff: x.staff || '',
    dataEntrega: x.dataEntrega || x.deliveryDate || '',
    status: (st === 'ENTREGUE' || st === 'ATIVA' || String(faccao).trim()) ? 'ATIVA' : 'INATIVA',
    beneficios: x.beneficios || x.benefits || {},
    observacoes: x.observacoes || x.observations || '',
    discordImageUrls: Array.isArray(x.discordImageUrls) ? x.discordImageUrls : []
  };
}

/**
 * Tira da gravacao os campos que eram so recado para o bot postar
 * (anuncioEntrega / anuncioRecolhimento). Eles nao ficam na ficha:
 * o print em base64 do recolhimento estouraria o limite do documento.
 */
export function separarAnuncios(data = {}) {
  const dados = { ...data };
  const anuncios = [];
  const pegar = (campo, tipo) => {
    if (!Object.prototype.hasOwnProperty.call(dados, campo)) return;
    const a = dados[campo];
    delete dados[campo];
    if (a && typeof a === 'object' && String(a.description || '').trim()) anuncios.push({ tipo, ...a });
  };
  pegar('anuncioEntrega', 'ENTREGA');
  pegar('anuncioRecolhimento', 'RECOLHIMENTO');
  return { dados, anuncios };
}

/** Mesmo embed que o bot montava (announcementPayload). */
export function corpoDoAnuncio(anuncio = {}, rodape = 'H | Season', agora = new Date()) {
  const tipo = anuncio.tipo === 'RECOLHIMENTO' ? 'RECOLHIMENTO' : 'ENTREGA';
  const embed = {
    color: COR_ILEGAL,
    title: String(anuncio.title || TITULO[tipo]).trim().slice(0, 256) || TITULO[tipo],
    description: String(anuncio.description || '').trim().slice(0, 4000),
    footer: { text: String(rodape || '').slice(0, 2048) },
    timestamp: agora.toISOString()
  };
  let arquivo = null;
  const m = String(anuncio.imageDataUrl || '').match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (m) {
    const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
    arquivo = { nome: 'evidencia.' + ext, tipo: 'image/' + (ext === 'jpg' ? 'jpeg' : ext), base64: m[2] };
    embed.image = { url: 'attachment://' + arquivo.nome };
  } else if (/^https:\/\/\S+$/i.test(String(anuncio.imageUrl || ''))) {
    embed.image = { url: String(anuncio.imageUrl).slice(0, 2000) };
  } else {
    embed.image = { url: ARTE[tipo] };
  }
  return { embed, arquivo };
}

export const WEBHOOK_OK = /^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/;

/**
 * Posta no webhook do canal. Se o canal for forum, o Discord recusa com
 * o codigo 220001 e a gente reenvia abrindo um post com o nome do Group.
 */
export async function postarNoWebhook(url, anuncio, { group = '', rodape, fetchFn = globalThis.fetch, agora } = {}) {
  url = String(url || '').trim();
  if (!WEBHOOK_OK.test(url)) throw new Error('Webhook do Discord do Ilegal não configurado.');
  const destino = url + (url.includes('?') ? '&' : '?') + 'wait=true';
  const { embed, arquivo } = corpoDoAnuncio(anuncio, rodape, agora);
  const enviar = extra => {
    const json = { embeds: [embed], allowed_mentions: { parse: [] }, ...extra };
    if (!arquivo) return fetchFn(destino, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(json) });
    const bin = Uint8Array.from(atob(arquivo.base64), c => c.charCodeAt(0));
    const form = new FormData();
    form.append('payload_json', JSON.stringify({ ...json, attachments: [{ id: 0, filename: arquivo.nome }] }));
    form.append('files[0]', new Blob([bin], { type: arquivo.tipo }), arquivo.nome);
    return fetchFn(destino, { method: 'POST', body: form });
  };
  let res = await enviar({});
  if (res.status === 400) {
    const err = await res.json().catch(() => ({}));
    if (err?.code === 220001) res = await enviar({ thread_name: String(group || 'Facção').toUpperCase().slice(0, 100) });
    else throw new Error('Discord recusou o anúncio: ' + JSON.stringify(err).slice(0, 200));
  }
  if (!res.ok) throw new Error('Discord respondeu HTTP ' + res.status);
  return true;
}

/** Escopos que o bot guardava e o caminho equivalente no Firestore. */
export function caminhoDoEscopo(scope) {
  const s = String(scope || '').trim();
  if (!s || s.includes('/')) throw new Error('Escopo inválido: ' + s);
  return s === 'users' ? ['users'] : ['highos', 'data', s];
}

/** Firestore nao aceita undefined; o bot devolvia JSON puro. */
export function semIndefinidos(v) {
  if (v === undefined) return undefined;
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(semIndefinidos).map(x => x === undefined ? null : x);
  // Timestamp, serverTimestamp() e afins nao sao objetos simples: passam inteiros.
  const proto = Object.getPrototypeOf(v);
  if (proto !== Object.prototype && proto !== null) return v;
  const o = {};
  for (const [k, x] of Object.entries(v)) { const y = semIndefinidos(x); if (y !== undefined) o[k] = y; }
  return o;
}
