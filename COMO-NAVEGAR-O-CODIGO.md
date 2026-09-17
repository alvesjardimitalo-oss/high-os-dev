# High OS · Como navegar e mexer no código

Guia para responder, antes de editar: **o que quebra se eu tirar isso?**

## A ferramenta

```
node tools/mapa-do-codigo.mjs                 panorama + o que dá para remover
node tools/mapa-do-codigo.mjs --md            grava INDICE-DO-CODIGO.md
node tools/mapa-do-codigo.mjs nomeDaFuncao    impacto de uma função
```

A consulta por nome é a que importa no dia a dia. Exemplo real:

```
$ node tools/mapa-do-codigo.mjs loadMarketCatalog

loadMarketCatalog  ·  assets/app.js, linhas 7236–7247 (12 linhas)

CHAMADA POR (1):  (código de topo)
CHAMA (4):        marketFlatten, renderMarket, alvesNorm, y

FICARIAM ÓRFÃS se esta sair (só ela chama):
  marketFlatten
```

Ou seja: tirar a Economia significa remover `loadMarketCatalog`,
`renderMarket`, `marketFlatten`, `marketPriceFields` e `marketFind` —
e nada mais no sistema sente falta, porque nenhuma outra função as chama.

## O que o panorama mostra

820 funções, agrupadas por **seção declarada no próprio arquivo**. O
projeto já tinha 49 banners de seção (`// ===== HIGH OS V5.4 · ALVESINHO
OPERACIONAL =====`); a ferramenta usa esses títulos como categoria, em
vez de inventar uma taxonomia por fora. Onde não há banner, cai numa
regra por nome (`boletim*` → Boletim, `spotify*` → Spotify, e assim por
diante).

As maiores seções, por número de funções:

| Funções | Linhas | Seção |
|---|---|---|
| 81 | 989 | Organizações unificadas + rota padrão |
| 52 | 353 | Comunicação flutuante + Spotify |
| 50 | 509 | Perfil técnico integrado ao Group |
| 46 | 660 | Métricas sem custo de leitura |
| 46 | 675 | Central de comando + perfil de facção |

## Por que a detecção erra por excesso, de propósito

A primeira versão só reconhecia chamada com parêntese, `minhaFn(...)`.
Isso produziu **179 falsos "pode remover"** — incluindo
`startOrResumeSession`, que é chamada de código de topo, e `renderBoletim`,
passada como callback em `setTimeout(renderBoletim, 0)`.

Agora qualquer menção ao nome conta como dependência. A lista caiu de 179
para **16 candidatas**. Pode haver um ou outro falso positivo ao contrário
(contar dependência que não existe), e isso é intencional: superestimar
dependência faz você conferir à mão; subestimar faz você apagar algo que
está em uso.

## Regra de trabalho

1. `node tools/mapa-do-codigo.mjs nomeDaFuncao` antes de remover.
2. Se aparecer `CHAMADA POR: ninguém`, confira também o `index.html` —
   pode haver um `onclick` inline que a ferramenta não vê.
3. Remova, rode `node tools/verificar-integridade.mjs`.
4. Teste no `high-os-dev`.
5. Regrave o índice: `node tools/mapa-do-codigo.mjs --md`.

## As 16 candidatas atuais

Nenhuma é chamada por nada, nem aparece no HTML. São restos de versões
anteriores — a maioria com 1 a 6 linhas, mas duas maiores:
`techAutoRequests` (49 linhas) e `fetchMetricsFromSource` (3 linhas, mas
era a antiga porta de entrada das métricas).

A lista completa sai no comando sem argumentos.
