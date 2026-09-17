# High OS · Índice do código

Gerado por `node tools/mapa-do-codigo.mjs --md`. Não edite à mão.

820 funções, 37 categorias.

Para ver o impacto de remover uma função:

```
node tools/mapa-do-codigo.mjs nomeDaFuncao
```


## Administração

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `syncForm` | assets/mission-planner.js:1421 | 22 | 2 | 3 |
| `syncMapRegion` | assets/mission-planner.js:1635 | 11 | 1 | 2 |
| `syncMissionsFromCloud` | assets/mission-planner.js:871 | 16 | 2 | 7 |
| `syncSegmentSelects` | assets/app.js:260 | 13 | 5 | 4 |

## ADMINISTRAÇÃO MESTRE DE GROUPS

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `adminGroupStatus` | assets/app.js:11208 | 1 | 2 | 0 |
| `renameAdminGroup` | assets/app.js:11237 | 48 | 1 | 12 |
| `renderAdminGroupManager` | assets/app.js:11209 | 28 | 3 | 8 |

## ADMINISTRAÇÃO ORGANIZADA

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `normalizeOccupationStatusV820` | assets/app.js:11306 | 31 | 1 | 9 |
| `openAdminTab` | assets/app.js:11289 | 4 | 1 | 4 |

## Alvesinho

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `alvesNorm` | assets/modules/metricas-parser.js:22 | 3 | 33 | 0 |

## ALVESINHO OPERACIONAL

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `alvesAddMessage` | assets/app.js:4976 | 10 | 1 | 2 |
| `alvesAnswer` | assets/app.js:4875 | 101 | 2 | 12 |
| `alvesDateFromDelivery` | assets/app.js:4874 | 1 | 1 | 0 |
| `alvesFindGroup` | assets/app.js:4842 | 5 | 2 | 2 |
| `alvesFindOrg` | assets/app.js:4847 | 10 | 2 | 2 |
| `alvesInstalledLines` | assets/app.js:4857 | 16 | 1 | 4 |
| `alvesLastHistory` | assets/app.js:4873 | 1 | 1 | 1 |
| `askAlvesinho` | assets/app.js:4986 | 4 | 1 | 2 |

## Autenticação e sessão

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `closeCurrentSession` | assets/app.js:1130 | 32 | 1 | 4 |
| `esperar` | assets/app.js:1112 | 1 | 2 | 0 |
| `login` | assets/app.js:1095 | 1 | 3 | 0 |
| `logout` | assets/app.js:1162 | 2 | 3 | 2 |
| `makeSessionId` | assets/app.js:1126 | 1 | 1 | 1 |
| `renderSessionClock` | assets/app.js:1220 | 21 | 3 | 5 |
| `reservarSessao` | assets/app.js:1114 | 12 | 1 | 3 |
| `sessionStorageKey` | assets/app.js:1098 | 1 | 3 | 0 |
| `startOrResumeSession` | assets/app.js:1164 | 56 | 1 | 8 |
| `startSessionClock` | assets/app.js:1241 | 3 | 1 | 1 |
| `touchSession` | assets/app.js:1247 | 10 | 1 | 1 |

## BOLETIM SEMANAL AUTOMATICO

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `boletimAgregar` | assets/app.js:6336 | 17 | 1 | 4 |
| `boletimCalcular` | assets/app.js:6374 | 21 | 1 | 3 |
| `boletimDataBR` | assets/app.js:6323 | 3 | 1 | 1 |
| `boletimJanelas` | assets/app.js:6355 | 8 | 1 | 0 |
| `boletimParseData` | assets/app.js:6326 | 4 | 1 | 1 |
| `boletimPartes` | assets/app.js:6452 | 12 | 1 | 1 |
| `boletimPct` | assets/app.js:6368 | 5 | 1 | 1 |
| `boletimTexto` | assets/app.js:6396 | 54 | 1 | 4 |
| `boletimTotalLinha` | assets/app.js:6330 | 4 | 1 | 1 |
| `boletimVariacao` | assets/app.js:6364 | 4 | 1 | 0 |
| `iso` | assets/app.js:6831 | 1 | 3 | 1 |
| `loadMetricSourceConfig` | assets/app.js:6863 | 7 | 1 | 1 |
| `metricAdvancedStats` | assets/app.js:6600 | 40 | 4 | 6 |
| `movement` | assets/app.js:6560 | 1 | 1 | 2 |
| `openMetricSource` | assets/app.js:6839 | 14 | 1 | 1 |
| `parseMetricImport` | assets/app.js:6756 | 47 | 1 | 5 |
| `renderBoletim` | assets/app.js:6465 | 36 | 1 | 6 |
| `renderMetricAdvancedRanking` | assets/app.js:6640 | 25 | 3 | 7 |
| `renderMetricComparison` | assets/app.js:6672 | 33 | 3 | 5 |
| `renderMetrics` | assets/app.js:6502 | 98 | 6 | 26 |
| `renderRhFactionInsights` | assets/app.js:6705 | 8 | 1 | 3 |
| `saveMetricImport` | assets/app.js:6803 | 21 | 1 | 8 |
| `split` | assets/app.js:6760 | 1 | 1 | 0 |
| `switchMetricCenterView` | assets/app.js:6720 | 11 | 3 | 8 |
| `syncMetricCompareSelectors` | assets/app.js:6665 | 7 | 2 | 3 |
| `testMetricSource` | assets/app.js:6853 | 7 | 1 | 2 |

## BUSCA GLOBAL (Ctrl+K)

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `buscaAbrir` | assets/app.js:3830 | 8 | 1 | 2 |
| `buscaCasa` | assets/app.js:3769 | 4 | 1 | 1 |
| `buscaDestacar` | assets/app.js:3773 | 11 | 1 | 2 |
| `buscaFechar` | assets/app.js:3826 | 4 | 3 | 0 |
| `buscaMontar` | assets/app.js:3868 | 25 | 1 | 2 |
| `buscaNorm` | assets/app.js:3768 | 1 | 3 | 1 |
| `buscaRenderizar` | assets/app.js:3838 | 29 | 2 | 6 |
| `buscaResultados` | assets/app.js:3785 | 40 | 1 | 9 |
| `loadUserAudit` | assets/app.js:3937 | 5 | 4 | 8 |
| `openAuditSession` | assets/app.js:3952 | 1 | 1 | 12 |
| `openUserActivity` | assets/app.js:3956 | 1 | 1 | 4 |
| `renderSaudeSistema` | assets/app.js:3899 | 37 | 1 | 8 |
| `renderUserAudit` | assets/app.js:3942 | 10 | 3 | 11 |

## CAMADA DE RESILIENCIA DO FIRESTORE

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `add` | assets/app.js:2056 | 3 | 11 | 0 |
| `addDoc` | assets/app.js:1614 | 1 | 38 | 0 |
| `autoDeliveryRequests` | assets/app.js:2120 | 128 | 4 | 7 |
| `benefitLines` | assets/app.js:1988 | 35 | 1 | 2 |
| `buildDeliveryExtract` | assets/app.js:2023 | 22 | 2 | 2 |
| `cacheEscrever` | assets/app.js:1706 | 11 | 1 | 1 |
| `cacheLer` | assets/app.js:1717 | 15 | 1 | 1 |
| `changedBenefit` | assets/app.js:2045 | 1 | 1 | 0 |
| `closeRecollectModal` | assets/app.js:2486 | 2 | 1 | 1 |
| `comoSnapshot` | assets/app.js:1732 | 12 | 1 | 0 |
| `compressRecollectImage` | assets/app.js:2488 | 14 | 1 | 1 |
| `copyDeliveryExtract` | assets/app.js:2262 | 7 | 1 | 1 |
| `copyDeliveryRequests` | assets/app.js:2254 | 8 | 1 | 2 |
| `currentFactionFromForm` | assets/app.js:1963 | 25 | 3 | 4 |
| `currentPtBrDateTime` | assets/app.js:2439 | 10 | 1 | 1 |
| `deleteDoc` | assets/app.js:1615 | 1 | 3 | 0 |
| `entrarModoLocal` | assets/app.js:1749 | 13 | 1 | 1 |
| `getDocsCached` | assets/app.js:1791 | 1 | 10 | 0 |
| `getFormBenefits` | assets/app.js:1858 | 64 | 3 | 1 |
| `mostrarFaixaModoLocal` | assets/app.js:1775 | 14 | 1 | 0 |
| `og` | assets/app.js:2053 | 2 | 1 | 0 |
| `openFac` | assets/app.js:2288 | 32 | 5 | 11 |
| `openRecollectModal` | assets/app.js:2469 | 17 | 1 | 5 |
| `operationalRequestAdditions` | assets/app.js:2047 | 1 | 1 | 0 |
| `packCache` | assets/app.js:1674 | 13 | 1 | 0 |
| `recollectExtract` | assets/app.js:2449 | 17 | 2 | 3 |
| `recollectReasonLabel` | assets/app.js:2432 | 7 | 4 | 1 |
| `renderDeliveryRequests` | assets/app.js:2248 | 4 | 1 | 3 |
| `resolveGroupIdentity` | assets/app.js:2270 | 1 | 3 | 0 |
| `sairModoLocal` | assets/app.js:1762 | 13 | 1 | 1 |
| `samePlain` | assets/app.js:2046 | 1 | 2 | 1 |
| `selectedDefaultBenefits` | assets/app.js:1962 | 1 | 2 | 0 |
| `setDoc` | assets/app.js:1613 | 1 | 41 | 0 |
| `setFormBenefits` | assets/app.js:1922 | 1 | 1 | 0 |
| `setRecollectPrint` | assets/app.js:2502 | 6 | 1 | 3 |
| `snapshot` | assets/app.js:2592 | 4 | 4 | 0 |
| `statBump` | assets/app.js:1639 | 13 | 3 | 0 |
| `unpackCache` | assets/app.js:1687 | 19 | 1 | 0 |
| `updateDeliveryPreview` | assets/app.js:2252 | 2 | 6 | 3 |
| `updateRecollectUi` | assets/app.js:2466 | 3 | 3 | 2 |
| `writeBatch` | assets/app.js:1617 | 10 | 9 | 2 |

## CAMADA DO GOOGLE SHEETS RESTAURADA

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `authorizeSheets` | assets/app.js:6891 | 20 | 1 | 0 |
| `compareMetricSources` | assets/app.js:6972 | 22 | 1 | 3 |
| `getSheetTitles` | assets/app.js:6911 | 6 | 1 | 2 |
| `loadMarketCatalog` | assets/app.js:7236 | 12 | 1 | 4 |
| `marketFind` | assets/app.js:7249 | 2 | 1 | 1 |
| `marketFlatten` | assets/app.js:7213 | 14 | 1 | 1 |
| `marketPriceFields` | assets/app.js:7227 | 9 | 2 | 1 |
| `metricLatestInfo` | assets/app.js:6957 | 15 | 1 | 5 |
| `metricRowKey` | assets/app.js:6956 | 1 | 2 | 0 |
| `metricTimeout` | assets/app.js:6994 | 6 | 2 | 1 |
| `pick` | assets/app.js:7228 | 2 | 1 | 0 |
| `podeSincronizarAgora` | assets/app.js:7128 | 14 | 1 | 0 |
| `readMetricsDirect` | assets/app.js:6924 | 3 | 1 | 0 |
| `readMetricSheet` | assets/app.js:6917 | 7 | 1 | 4 |
| `readMetricsWithoutPopup` | assets/app.js:7001 | 32 | 2 | 7 |
| `recoverMetricsAutomatically` | assets/app.js:7033 | 1 | 1 | 0 |
| `refreshMetricServerConfig` | assets/app.js:6950 | 6 | 1 | 1 |
| `renderMarket` | assets/app.js:7251 | 14 | 2 | 6 |
| `requestServerMetricSync` | assets/app.js:7160 | 1 | 1 | 0 |
| `runMetricAutoRecovery` | assets/app.js:7110 | 1 | 2 | 0 |
| `saveMetricSource` | assets/app.js:7189 | 17 | 1 | 3 |
| `sheetsFetch` | assets/app.js:6881 | 10 | 3 | 1 |
| `startMetricAutoRecovery` | assets/app.js:7146 | 14 | 1 | 3 |
| `stopMetricAutoRecovery` | assets/app.js:7142 | 4 | 1 | 0 |

## CDS CONFIRMADAS / GROUPS REMOVIDOS · 07/09/2026

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `cleanProfileValue` | assets/app.js:7905 | 1 | 2 | 0 |
| `profileCoordLike` | assets/app.js:7898 | 1 | 1 | 0 |
| `sourceToGroupPatch` | assets/app.js:7906 | 81 | 2 | 8 |
| `splitCoordPair` | assets/app.js:7899 | 6 | 1 | 0 |
| `updateOfficialGroupProfiles` | assets/app.js:7987 | 32 | 1 | 7 |

## CENTRAL DE COMANDO + PERFIL DE FACÇÃO EM PÁGINA

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `activityButtons` | assets/app.js:10985 | 13 | 3 | 2 |
| `allSegmentNames` | assets/app.js:10939 | 5 | 1 | 2 |
| `applyCoreSegmentMap` | assets/app.js:11169 | 25 | 1 | 5 |
| `assignSegment` | assets/app.js:11119 | 27 | 1 | 8 |
| `availableAnnouncementText` | assets/app.js:10640 | 45 | 3 | 2 |
| `availableDiscordState` | assets/app.js:10758 | 10 | 7 | 1 |
| `availablePosted` | assets/app.js:10768 | 1 | 1 | 2 |
| `beginEditSegment` | assets/app.js:11058 | 9 | 1 | 4 |
| `buildCraftRequestText` | assets/app.js:10421 | 1 | 1 | 0 |
| `closeCraftRequestModal` | assets/app.js:10498 | 1 | 1 | 1 |
| `closeOrganizationProfilePage` | assets/app.js:10253 | 1 | 1 | 1 |
| `craftRecipeKey` | assets/app.js:10403 | 1 | 1 | 0 |
| `createSegment` | assets/app.js:11067 | 52 | 1 | 12 |
| `dashboardGo` | assets/app.js:10328 | 1 | 1 | 1 |
| `deleteSegment` | assets/app.js:11146 | 23 | 1 | 12 |
| `downloadFreeFacCsv` | assets/app.js:10891 | 30 | 1 | 4 |
| `farmItemKey` | assets/app.js:10404 | 1 | 1 | 0 |
| `freeFaccoesForReport` | assets/app.js:10872 | 6 | 3 | 2 |
| `freeFacReportText` | assets/app.js:10878 | 13 | 2 | 4 |
| `ingredientDisplay` | assets/app.js:10405 | 1 | 1 | 0 |
| `isLaundryMachineRecipe` | assets/app.js:10415 | 1 | 1 | 0 |
| `isoDay` | assets/app.js:10264 | 1 | 2 | 1 |
| `openCraftRequestModal` | assets/app.js:10484 | 14 | 1 | 2 |
| `openMetricForGroup` | assets/app.js:10329 | 13 | 1 | 8 |
| `persistCurrentTechProfile` | assets/app.js:10515 | 1 | 1 | 0 |
| `refreshSegmentAssignEntities` | assets/app.js:11021 | 12 | 2 | 5 |
| `renderAvailableFaccoes` | assets/app.js:10769 | 57 | 5 | 12 |
| `renderAvailableSegmentCards` | assets/app.js:10975 | 10 | 1 | 3 |
| `renderCommandDashboard` | assets/app.js:10342 | 48 | 6 | 20 |
| `renderFacActivityButtonsLegacy` | assets/app.js:10998 | 9 | **ninguém** | 2 |
| `renderOrgActivityButtons` | assets/app.js:11007 | 9 | 1 | 2 |
| `renderSegmentAdmin` | assets/app.js:11033 | 14 | 4 | 10 |
| `renderVisualSegmentFilter` | assets/app.js:10948 | 1 | 2 | 0 |
| `same` | assets/app.js:10281 | 3 | 2 | 2 |
| `saveAvailableContingent` | assets/app.js:10721 | 37 | 1 | 5 |
| `saveAvailableImageLink` | assets/app.js:10686 | 35 | 1 | 4 |
| `saveSegmentRegistry` | assets/app.js:11047 | 9 | 2 | 8 |
| `segmentCardMarkup` | assets/app.js:10944 | 4 | 1 | 4 |
| `segmentUsage` | assets/app.js:11018 | 3 | 2 | 6 |
| `segmentVisual` | assets/app.js:10936 | 3 | 1 | 2 |
| `setAvailableDiscordState` | assets/app.js:10826 | 43 | 3 | 6 |
| `showFreeFacReport` | assets/app.js:10921 | 11 | 1 | 8 |
| `showOrganizationProfilePage` | assets/app.js:10235 | 1 | 1 | 0 |
| `startOfWeekMonday` | assets/app.js:10256 | 8 | 2 | 0 |
| `toggleAvailablePosted` | assets/app.js:10869 | 2 | **ninguém** | 3 |
| `vacantMetricAnomalies` | assets/app.js:10311 | 17 | 1 | 6 |
| `weeklyContingentAlerts` | assets/app.js:10265 | 46 | 1 | 9 |

## CENTRAL DE SOLICITAÇÕES · PADRÕES OFICIAIS HIGH

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `allRequestModels` | assets/app.js:3277 | 2 | 1 | 0 |
| `applyRouteRequestToProfile` | assets/app.js:3339 | 57 | 1 | 14 |
| `buildRequestText` | assets/app.js:2832 | 400 | 1 | 7 |
| `copyRequestText` | assets/app.js:3518 | 37 | 2 | 8 |
| `defaultSubject` | assets/app.js:2759 | 39 | 6 | 0 |
| `fmtCds` | assets/app.js:2827 | 1 | 5 | 0 |
| `getDetailBlock` | assets/app.js:2809 | 18 | 2 | 1 |
| `getDetailValue` | assets/app.js:2799 | 10 | 3 | 1 |
| `initRequestUi` | assets/app.js:2714 | 35 | 1 | 10 |
| `loadRequests` | assets/app.js:3259 | 18 | 2 | 5 |
| `manualRequestMutation` | assets/app.js:3437 | 1 | 1 | 0 |
| `openRequestModal` | assets/app.js:3233 | 26 | 5 | 6 |
| `pushObs` | assets/app.js:2829 | 2 | 1 | 2 |
| `renderRequests` | assets/app.js:3279 | 27 | 2 | 7 |
| `requestRoutePoints` | assets/app.js:3306 | 10 | 2 | 2 |
| `requestTypeName` | assets/app.js:2749 | 1 | 7 | 0 |
| `saveRequestModel` | assets/app.js:3397 | 40 | 1 | 7 |
| `slug` | assets/app.js:3555 | 1 | 2 | 0 |
| `syncRequestFaction` | assets/app.js:2757 | 2 | 3 | 2 |
| `syncRouteRequestAction` | assets/app.js:3316 | 23 | 2 | 2 |
| `updateRequestGroupOptions` | assets/app.js:2750 | 7 | 2 | 4 |
| `upGarage` | assets/app.js:3444 | 6 | 1 | 1 |

## COMUNICAÇÃO FLUTUANTE + SPOTIFY CONNECT

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `base64url` | assets/app.js:11391 | 1 | 1 | 1 |
| `chatAttachmentHtml` | assets/app.js:11579 | 4 | 1 | 2 |
| `chatConversationId` | assets/app.js:11587 | 2 | 5 | 0 |
| `chatConversationQuery` | assets/app.js:11641 | 12 | 1 | 1 |
| `chatMeetingHtml` | assets/app.js:11584 | 3 | 1 | 2 |
| `chatParticipants` | assets/app.js:11593 | 2 | 2 | 0 |
| `chatStickerHtml` | assets/app.js:11583 | 1 | 1 | 2 |
| `chatTime` | assets/app.js:11572 | 2 | 1 | 0 |
| `deleteChatMessage` | assets/app.js:11705 | 7 | 1 | 3 |
| `hmDisplayName` | assets/app.js:11734 | 3 | **ninguém** | 1 |
| `hmInitials` | assets/app.js:11574 | 2 | 2 | 0 |
| `hmLastMessageFor` | assets/app.js:11606 | 2 | 1 | 1 |
| `hmUser` | assets/app.js:11576 | 1 | 4 | 0 |
| `hmUserName` | assets/app.js:11577 | 1 | 6 | 0 |
| `hmUserRole` | assets/app.js:11578 | 1 | 3 | 0 |
| `loadSpotifyConfig` | assets/app.js:11348 | 5 | 2 | 3 |
| `populateChatRecipients` | assets/app.js:11595 | 8 | 1 | 5 |
| `prepareChatAttachment` | assets/app.js:11726 | 8 | 1 | 2 |
| `privateChatItems` | assets/app.js:11603 | 3 | 1 | 1 |
| `renderChatAttachmentPreview` | assets/app.js:11718 | 8 | 2 | 2 |
| `renderChatMessages` | assets/app.js:11624 | 15 | 2 | 15 |
| `renderHmContacts` | assets/app.js:11608 | 8 | 4 | 8 |
| `renderSpotify` | assets/app.js:11353 | 9 | 3 | 5 |
| `renderSpotifyAuthUI` | assets/app.js:11534 | 8 | 3 | 3 |
| `saveSpotifyClient` | assets/app.js:11380 | 11 | 1 | 5 |
| `saveSpotifyConfig` | assets/app.js:11362 | 18 | 1 | 7 |
| `selectChatRecipient` | assets/app.js:11616 | 8 | 2 | 4 |
| `sendChatMessage` | assets/app.js:11682 | 1 | 2 | 0 |
| `spotifyApi` | assets/app.js:11460 | 1 | 7 | 0 |
| `spotifyCreatePlayer` | assets/app.js:11518 | 16 | 1 | 7 |
| `spotifyEmbedUrl` | assets/app.js:11343 | 4 | 2 | 2 |
| `spotifyHandleCallback` | assets/app.js:11413 | 23 | 1 | 2 |
| `spotifyLoadPlaylists` | assets/app.js:11556 | 8 | 2 | 4 |
| `spotifyLoadProfile` | assets/app.js:11469 | 5 | 1 | 2 |
| `spotifyLoadSDK` | assets/app.js:11474 | 7 | 1 | 1 |
| `spotifyLogin` | assets/app.js:11392 | 21 | 2 | 2 |
| `spotifyPlayContext` | assets/app.js:11564 | 3 | 1 | 1 |
| `spotifyPlayUri` | assets/app.js:11551 | 3 | 1 | 1 |
| `spotifyQueueUri` | assets/app.js:11554 | 2 | 1 | 1 |
| `spotifyRedirectUri` | assets/app.js:11347 | 1 | 4 | 1 |
| `spotifyRefreshToken` | assets/app.js:11436 | 15 | 1 | 0 |
| `spotifyRenderState` | assets/app.js:11487 | 22 | 1 | 3 |
| `spotifyRestoreSession` | assets/app.js:11451 | 9 | 2 | 4 |
| `spotifySearch` | assets/app.js:11542 | 9 | 1 | 5 |
| `spotifySetTab` | assets/app.js:11567 | 4 | 1 | 4 |
| `spotifyStartProgress` | assets/app.js:11515 | 3 | 1 | 1 |
| `spotifyTime` | assets/app.js:11485 | 2 | 1 | 1 |
| `spotifyUpdateProgress` | assets/app.js:11509 | 6 | 3 | 3 |
| `startChat` | assets/app.js:11679 | 3 | 2 | 3 |
| `stopChat` | assets/app.js:11653 | 1 | 2 | 0 |
| `subscribeChatConversation` | assets/app.js:11654 | 25 | 2 | 7 |
| `toggleFloatingChat` | assets/app.js:11712 | 6 | 1 | 3 |

## Dashboard

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `alertStateId` | assets/app.js:164 | 1 | 2 | 0 |
| `dashboardHealth` | assets/app.js:107 | 5 | 1 | 0 |
| `loadDashboardAlertStates` | assets/app.js:160 | 4 | 3 | 2 |
| `loadDashboardConfig` | assets/app.js:91 | 16 | 1 | 6 |
| `renderDashboardConfigAdmin` | assets/app.js:112 | 15 | 3 | 2 |

## DOCUMENTO DAS FACÇÕES ↔ GOOGLE SHEETS

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `facSheetApplyConfirmed` | assets/app.js:10131 | 42 | 1 | 8 |
| `facSheetAuthorize` | assets/app.js:10025 | 18 | 2 | 2 |
| `facSheetCheckForChanges` | assets/app.js:10107 | 16 | 1 | 6 |
| `facSheetClean` | assets/app.js:9988 | 1 | 2 | 0 |
| `facSheetComparable` | assets/app.js:9989 | 3 | 1 | 2 |
| `facSheetDiffForRecord` | assets/app.js:10088 | 19 | 1 | 3 |
| `facSheetFetch` | assets/app.js:10043 | 3 | 2 | 0 |
| `facSheetNorm` | assets/app.js:9985 | 1 | 3 | 0 |
| `facSheetPatchFromRow` | assets/app.js:10004 | 12 | 1 | 2 |
| `facSheetPushAll` | assets/app.js:10207 | 15 | 1 | 6 |
| `facSheetReadAll` | assets/app.js:10070 | 1 | 2 | 0 |
| `facSheetRenderStatus` | assets/app.js:10016 | 7 | 4 | 2 |
| `facSheetResolveTitle` | assets/app.js:10058 | 12 | 2 | 2 |
| `facSheetRowFromGroup` | assets/app.js:9992 | 1 | 1 | 0 |
| `facSheetSetLastCheck` | assets/app.js:10023 | 2 | 2 | 1 |
| `facSheetStatus` | assets/app.js:9986 | 2 | 2 | 0 |
| `renderFacSheetDiffModal` | assets/app.js:10123 | 8 | 1 | 3 |
| `syncGroupsToOfficialSheet` | assets/app.js:10173 | 2 | 3 | 0 |

## ECONOMIA DE COTA DAS METRICAS

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `applyMetricSnapshot` | assets/app.js:5456 | 1 | 3 | 0 |
| `ensureMetricQuotaPanel` | assets/app.js:5488 | 15 | 1 | 0 |
| `enterQuotaMode` | assets/app.js:5346 | 21 | 4 | 5 |
| `isQuotaError` | assets/app.js:5339 | 7 | 4 | 1 |
| `metricReadCount` | assets/app.js:5485 | 3 | 2 | 0 |
| `metricRealtimeAtivo` | assets/app.js:5567 | 3 | 2 | 0 |
| `metricRowsPendentes` | assets/app.js:5369 | 25 | 1 | 3 |
| `persistMetricRows` | assets/app.js:5395 | 1 | 1 | 0 |
| `proximo` | assets/app.js:5515 | 8 | 1 | 1 |
| `renderMetricQuotaPanel` | assets/app.js:5503 | 59 | 6 | 8 |
| `setMetricRealtime` | assets/app.js:5570 | 8 | 1 | 2 |
| `startMetricRealtime` | assets/app.js:5578 | 18 | 2 | 8 |

## Formatação e utilidades

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `$` | assets/app.js:50 | 1 | 373 | 0 |
| `copyText` | assets/mission-planner.js:1728 | 1 | 12 | 0 |
| `esc` | assets/modules/formatadores.js:12 | 5 | 100 | 0 |
| `fmtBackupData` | assets/mission-planner.js:1934 | 3 | 1 | 1 |
| `fmtDateMs` | assets/modules/formatadores.js:27 | 1 | 3 | 0 |
| `fmtDuration` | assets/modules/formatadores.js:20 | 6 | 4 | 1 |
| `fmtMoneyMaybe` | assets/modules/formatadores.js:29 | 4 | 2 | 1 |
| `normalizeCenter` | assets/mission-planner.js:667 | 1 | 2 | 3 |
| `normalizeMetricDate` | assets/modules/metricas-parser.js:26 | 14 | 5 | 2 |
| `normalizeMetricSlotKey` | assets/modules/metricas-parser.js:45 | 11 | 4 | 1 |
| `normalizePoint` | assets/mission-planner.js:668 | 9 | 5 | 2 |
| `normalizeText` | assets/mission-planner.js:739 | 1 | 4 | 0 |
| `num` | assets/mission-planner.js:532 | 1 | 7 | 0 |
| `parseBulk` | assets/mission-planner.js:1519 | 4 | 1 | 3 |
| `parseCds` | assets/mission-planner.js:619 | 30 | 4 | 2 |
| `parseCsvRows` | assets/modules/metricas-parser.js:202 | 19 | 2 | 1 |
| `parseMetricNumber` | assets/modules/metricas-parser.js:41 | 3 | 3 | 0 |
| `parseMetricSheet` | assets/modules/metricas-parser.js:78 | 123 | 3 | 9 |
| `show` | assets/app.js:1091 | 4 | 7 | 0 |
| `slugify` | assets/mission-planner.js:553 | 1 | 2 | 1 |

## GESTÃO DE USUÁRIOS

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `applyPermissionPreset` | assets/app.js:3578 | 7 | 1 | 3 |
| `assertAdmin` | assets/app.js:3614 | 2 | 4 | 0 |
| `initUsersUi` | assets/app.js:3585 | 29 | 1 | 8 |
| `loadUsers` | assets/app.js:3616 | 13 | 3 | 6 |
| `openUserModal` | assets/app.js:3652 | 13 | 2 | 4 |
| `readUserPermissions` | assets/app.js:3575 | 3 | 1 | 1 |
| `renderUserPermissionMatrix` | assets/app.js:3566 | 1 | 3 | 0 |
| `renderUsers` | assets/app.js:3629 | 23 | 2 | 6 |
| `saveUser` | assets/app.js:3665 | 13 | 1 | 12 |
| `toggleUserAccess` | assets/app.js:3678 | 12 | 1 | 7 |

## GROUP COMO PATRIMÔNIO + ENTREGA COMO VÍNCULO

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `currentDeliveryRequests` | assets/app.js:4349 | 109 | 3 | 5 |
| `deliveryExtractV5` | assets/app.js:4323 | 26 | 2 | 5 |
| `derivedOrganizations` | assets/app.js:4069 | 26 | 7 | 2 |
| `facSegmentsAvailable` | assets/app.js:3984 | 5 | 1 | 1 |
| `fillDeliveryFromGroup` | assets/app.js:4298 | 24 | 2 | 6 |
| `initDeliveryUi` | assets/app.js:4042 | 24 | 1 | 8 |
| `installedCount` | assets/app.js:3981 | 1 | 2 | 2 |
| `installedValue` | assets/app.js:3975 | 5 | 5 | 1 |
| `isInstalled` | assets/app.js:3980 | 1 | 6 | 1 |
| `loadDeliveries` | assets/app.js:4263 | 6 | 2 | 5 |
| `loadOrganizations` | assets/app.js:4095 | 7 | 2 | 6 |
| `openNewDelivery` | assets/app.js:4286 | 12 | 3 | 5 |
| `openOrganizationByName` | assets/app.js:4185 | 30 | 2 | 13 |
| `orgHistory` | assets/app.js:4179 | 6 | 1 | 4 |
| `orgKey` | assets/app.js:4068 | 1 | 10 | 2 |
| `orgSegmentsAvailable` | assets/app.js:4106 | 15 | 1 | 1 |
| `orgSegmentValue` | assets/app.js:4105 | 1 | 9 | 0 |
| `renderDefaultDeliveryProfile` | assets/app.js:3965 | 9 | 1 | 6 |
| `renderDeliveries` | assets/app.js:4269 | 17 | 2 | 2 |
| `renderFacSegmentChips` | assets/app.js:3989 | 10 | 1 | 6 |
| `renderOrganizations` | assets/app.js:4144 | 34 | 6 | 11 |
| `renderOrgSegmentChips` | assets/app.js:4121 | 23 | 2 | 6 |
| `saveNewDelivery` | assets/app.js:4467 | 69 | 1 | 13 |
| `selectedDeliveryBenefits` | assets/app.js:4322 | 1 | 3 | 0 |
| `syncOrgOptions` | assets/app.js:4102 | 3 | 1 | 3 |
| `updateNewDeliveryPreview` | assets/app.js:4458 | 4 | 3 | 4 |
| `upsertOrganizationFromDelivery` | assets/app.js:4244 | 19 | 1 | 4 |

## HIGH CALL NATIVO (WebRTC + Firestore)

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `acceptIncomingCall` | assets/app.js:11844 | 18 | 1 | 13 |
| `bindRemoteStream` | assets/app.js:11777 | 4 | 1 | 1 |
| `callDocRef` | assets/app.js:11742 | 1 | 5 | 0 |
| `callUiStatus` | assets/app.js:11746 | 2 | 5 | 1 |
| `closeTeamMeeting` | assets/app.js:11871 | 20 | 5 | 4 |
| `createPeer` | assets/app.js:11781 | 22 | 2 | 7 |
| `prepareLocalMedia` | assets/app.js:11763 | 14 | 2 | 3 |
| `rejectIncomingCall` | assets/app.js:11862 | 3 | 1 | 3 |
| `rtcCandidate` | assets/app.js:11745 | 1 | 1 | 0 |
| `rtcDesc` | assets/app.js:11743 | 2 | 2 | 0 |
| `setCallButtons` | assets/app.js:11748 | 7 | 4 | 1 |
| `showCallOverlay` | assets/app.js:11755 | 8 | 2 | 2 |
| `startCallInbox` | assets/app.js:11865 | 6 | 1 | 7 |
| `startTeamMeeting` | assets/app.js:11806 | 38 | 1 | 16 |
| `toggleCallCam` | assets/app.js:11894 | 3 | 1 | 1 |
| `toggleCallMic` | assets/app.js:11891 | 3 | 1 | 1 |
| `toggleHmPicker` | assets/app.js:11897 | 38 | 2 | 3 |
| `watchActiveCall` | assets/app.js:11803 | 3 | 2 | 6 |

## HISTORICO PAGINADO

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `buscarHistoricoCompleto` | assets/app.js:4736 | 12 | 1 | 4 |
| `loadHistory` | assets/app.js:4665 | 1 | 3 | 0 |
| `openRecollectEvidence` | assets/app.js:4714 | 14 | 1 | 4 |
| `renderGroupProfileMemory` | assets/app.js:4812 | 14 | 1 | 6 |
| `renderHistory` | assets/app.js:4778 | 34 | 2 | 9 |
| `renderHistoryFooter` | assets/app.js:4748 | 30 | 1 | 4 |

## LEITURA DO CADASTRO COM DIAGNOSTICO

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `activateAppPage` | assets/app.js:1514 | 17 | 14 | 8 |
| `carregarCadastro` | assets/app.js:1419 | 45 | 1 | 4 |
| `closeGroupProfilePage` | assets/app.js:1549 | 1 | 1 | 1 |
| `loadFaccoes` | assets/app.js:1552 | 8 | 16 | 6 |
| `renderFaccoes` | assets/app.js:1560 | 24 | 7 | 7 |
| `showGroupProfilePage` | assets/app.js:1531 | 18 | 2 | 4 |

## METRICAS SEM CUSTO DE LEITURA

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `agruparPorMes` | assets/app.js:5646 | 15 | 1 | 1 |
| `aplicarLinhasMetricas` | assets/app.js:5783 | 16 | 1 | 4 |
| `assinaturaMes` | assets/app.js:5661 | 10 | 1 | 1 |
| `buildMetricReportHtml` | assets/app.js:5999 | 13 | 2 | 6 |
| `compactarLinhas` | assets/app.js:5634 | 6 | 1 | 0 |
| `downloadMetricCsv` | assets/app.js:6029 | 24 | 1 | 6 |
| `expandirLinhas` | assets/app.js:5640 | 6 | **ninguém** | 0 |
| `lerEspelhoMensal` | assets/app.js:5751 | 31 | 1 | 4 |
| `loadMetrics` | assets/app.js:5800 | 67 | 3 | 17 |
| `metricAggregateDays` | assets/app.js:6169 | 10 | 2 | 4 |
| `metricCalendarRange31` | assets/app.js:6070 | 53 | 1 | 4 |
| `metricCurrentScope` | assets/app.js:5933 | 1 | 4 | 1 |
| `metricDailyBars` | assets/app.js:6123 | 14 | 1 | 4 |
| `metricDailyCard` | assets/app.js:6188 | 11 | 1 | 2 |
| `metricDailyReportText` | assets/app.js:6243 | 20 | 1 | 7 |
| `metricDailySummary` | assets/app.js:6137 | 12 | 1 | 0 |
| `metricDateLabel` | assets/app.js:5916 | 2 | 3 | 1 |
| `metricDayAverage` | assets/app.js:5918 | 2 | 4 | 1 |
| `metricFmtDay` | assets/app.js:6187 | 1 | 2 | 1 |
| `metricGroupKey` | assets/app.js:6054 | 1 | **ninguém** | 1 |
| `metricIdentity` | assets/app.js:5867 | 10 | 6 | 2 |
| `metricMainSortValue` | assets/app.js:6291 | 9 | 1 | 1 |
| `metricMesDe` | assets/app.js:5626 | 6 | 1 | 1 |
| `metricModeValue` | assets/app.js:5923 | 3 | 1 | 0 |
| `metricPeriodRange` | assets/app.js:5920 | 3 | 2 | 2 |
| `metricReportData` | assets/app.js:5982 | 17 | 1 | 5 |
| `metricScopeTitle` | assets/app.js:6162 | 7 | 2 | 3 |
| `metricSegmentSummary` | assets/app.js:6149 | 12 | 1 | 3 |
| `metricSelectedGroup` | assets/app.js:5935 | 1 | 1 | 2 |
| `metricSnapshot` | assets/app.js:5877 | 1 | 2 | 0 |
| `metricSortLabel` | assets/app.js:6285 | 6 | 1 | 1 |
| `metricSortRows` | assets/app.js:5926 | 7 | 2 | 3 |
| `metricSummaryRows` | assets/app.js:5888 | 28 | 8 | 9 |
| `metricTimeline` | assets/app.js:6057 | 13 | 2 | 4 |
| `metricTimeMinutes` | assets/app.js:6055 | 2 | 1 | 0 |
| `metricWeekBounds` | assets/app.js:6179 | 8 | 2 | 0 |
| `metricWeekSvg` | assets/app.js:6199 | 14 | 1 | 3 |
| `name` | assets/app.js:5928 | 2 | 35 | 2 |
| `printMetricDailyReport` | assets/app.js:6263 | 5 | 1 | 3 |
| `printMetricReport` | assets/app.js:6020 | 9 | 1 | 5 |
| `renderMetricExecutiveVisuals` | assets/app.js:6269 | 16 | 1 | 8 |
| `renderMetricFactionDetail` | assets/app.js:5960 | 22 | 4 | 9 |
| `renderMetricIntelligence` | assets/app.js:6213 | 30 | 1 | 11 |
| `renderMetricQuickRanking` | assets/app.js:6300 | 9 | 1 | 4 |
| `renderMetricReport` | assets/app.js:6012 | 8 | 3 | 3 |
| `salvarEspelhoMensal` | assets/app.js:5674 | 75 | 2 | 11 |
| `syncMetricSelectors` | assets/app.js:5936 | 24 | 3 | 3 |
| `y` | assets/app.js:6209 | 1 | 28 | 0 |

## ORGANIZAÇÕES UNIFICADAS + ROTA PADRÃO IMPLÍCITA

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `addPoint` | assets/app.js:12999 | 14 | 1 | 6 |
| `c` | assets/app.js:13726 | 1 | 34 | 0 |
| `fmt` | assets/app.js:12733 | 1 | 3 | 2 |
| `grConfirmRouteRemovalV836` | assets/app.js:12363 | 41 | 1 | 10 |
| `gsAdd` | assets/app.js:12519 | 6 | 1 | 4 |
| `gsCardCoord` | assets/app.js:12858 | 1 | 1 | 2 |
| `gsCleanRow` | assets/app.js:12831 | 4 | 1 | 0 |
| `gsCoord` | assets/app.js:12451 | 1 | 7 | 1 |
| `gsEnsureMap` | assets/app.js:12467 | 19 | 2 | 2 |
| `gsIcon` | assets/app.js:12452 | 15 | 1 | 1 |
| `gsImportArmas01` | assets/app.js:12542 | 65 | 2 | 2 |
| `gsLegacyCatalog` | assets/app.js:12654 | 1 | 1 | 0 |
| `gsMergeLegacy` | assets/app.js:12700 | 16 | 2 | 4 |
| `gsMigrateCurrent` | assets/app.js:12716 | 7 | 1 | 7 |
| `gsModalHtml` | assets/app.js:12870 | 1 | 1 | 0 |
| `gsNorm` | assets/app.js:12653 | 1 | 5 | 0 |
| `gsOpenEditor` | assets/app.js:12872 | 43 | 2 | 10 |
| `gsPersist` | assets/app.js:12835 | 19 | 2 | 7 |
| `gsRender` | assets/app.js:12503 | 16 | 9 | 11 |
| `gsRenderKpis` | assets/app.js:12859 | 5 | 1 | 3 |
| `gsRenderMap` | assets/app.js:12486 | 17 | 4 | 11 |
| `gsRequestText` | assets/app.js:12730 | 7 | 2 | 5 |
| `gsRows` | assets/app.js:12448 | 3 | 14 | 2 |
| `gsSave` | assets/app.js:12525 | 17 | 1 | 8 |
| `gsSetView` | assets/app.js:12864 | 6 | 1 | 3 |
| `gsStatusText` | assets/app.js:12854 | 4 | 2 | 0 |
| `isOperational` | assets/app.js:12298 | 4 | 1 | 5 |
| `isRegisteredAvailable` | assets/app.js:12294 | 3 | 2 | 2 |
| `key` | assets/app.js:12705 | 4 | 19 | 1 |
| `mgmtAction` | assets/app.js:13697 | 6 | 3 | 0 |
| `mgmtBarSvg` | assets/app.js:13747 | 3 | 1 | 3 |
| `mgmtBuild` | assets/app.js:13652 | 44 | 5 | 6 |
| `mgmtDayKey` | assets/app.js:13619 | 1 | 2 | 1 |
| `mgmtDownloadGeneralReport` | assets/app.js:13783 | 8 | 1 | 3 |
| `mgmtEscHtml` | assets/app.js:13743 | 4 | 2 | 0 |
| `mgmtFiltered` | assets/app.js:13708 | 6 | 1 | 2 |
| `mgmtGeneralReportText` | assets/app.js:13727 | 16 | 4 | 9 |
| `mgmtLabel` | assets/app.js:13696 | 1 | 3 | 0 |
| `mgmtMedian` | assets/app.js:13648 | 4 | 1 | 0 |
| `mgmtMessage` | assets/app.js:13703 | 5 | 1 | 3 |
| `mgmtOpenGeneralReport` | assets/app.js:13778 | 5 | **ninguém** | 3 |
| `mgmtOpenMessage` | assets/app.js:13812 | 5 | 1 | 3 |
| `mgmtOpenRichReport` | assets/app.js:13771 | 7 | 1 | 2 |
| `mgmtPct` | assets/app.js:13645 | 1 | 3 | 0 |
| `mgmtPeriodStats` | assets/app.js:13625 | 20 | 1 | 5 |
| `mgmtPrintGeneralReport` | assets/app.js:13791 | 7 | 1 | 3 |
| `mgmtRichReportHtml` | assets/app.js:13750 | 21 | 1 | 9 |
| `mgmtRowsFor` | assets/app.js:13624 | 1 | 1 | 2 |
| `mgmtSegmentReport` | assets/app.js:13723 | 4 | 1 | 2 |
| `mgmtStart` | assets/app.js:13620 | 4 | 1 | 0 |
| `mgmtSummaryText` | assets/app.js:13714 | 9 | 1 | 3 |
| `mgmtTrendText` | assets/app.js:13646 | 2 | 5 | 1 |
| `norm` | assets/app.js:13862 | 1 | 1 | 0 |
| `orgV92ActionMarkup` | assets/app.js:13909 | 12 | 1 | 3 |
| `orgV92Audit` | assets/app.js:13861 | 15 | 1 | 2 |
| `orgV92Filtered` | assets/app.js:13876 | 15 | 1 | 4 |
| `orgV92HasOccupant` | assets/app.js:13831 | 1 | **ninguém** | 0 |
| `orgV92HasQG` | assets/app.js:13832 | 1 | 1 | 0 |
| `orgV92OpenReport` | assets/app.js:13960 | 15 | 1 | 8 |
| `orgV92ReportRows` | assets/app.js:13957 | 2 | 1 | 2 |
| `orgV92ReportTitle` | assets/app.js:13959 | 1 | 1 | 0 |
| `orgV92Rows` | assets/app.js:13858 | 3 | 4 | 3 |
| `orgV92Segment` | assets/app.js:13842 | 1 | 1 | 0 |
| `orgV92Status` | assets/app.js:13838 | 1 | 1 | 0 |
| `orgV92StatusClass` | assets/app.js:13841 | 1 | 1 | 0 |
| `orgV92StatusLabel` | assets/app.js:13840 | 1 | 2 | 0 |
| `pullMissionsFromCloud` | assets/app.js:13991 | 19 | 1 | 1 |
| `pushMissionsToCloud` | assets/app.js:14010 | 25 | 1 | 4 |
| `renderFacActivityButtons` | assets/app.js:13891 | 12 | 1 | 2 |
| `renderIllegalManagement` | assets/app.js:13798 | 14 | 3 | 9 |
| `setMode` | assets/app.js:12882 | 4 | 1 | 2 |
| `speakerRows` | assets/app.js:13145 | 1 | 1 | 0 |
| `sync` | assets/app.js:12517 | 1 | 7 | 3 |
| `syncType` | assets/app.js:13137 | 4 | 1 | 1 |
| `v8361CardImageUrl` | assets/app.js:12614 | 8 | 1 | 1 |
| `v836ApplyUnifiedUi` | assets/app.js:12348 | 10 | 1 | 1 |
| `v836CardImage` | assets/app.js:12284 | 2 | 2 | 3 |
| `v836Occupied` | assets/app.js:12276 | 1 | 3 | 1 |
| `v836RenderOrganizations` | assets/app.js:12286 | 58 | 1 | 21 |
| `v836RouteLabel` | assets/app.js:12280 | 4 | 1 | 3 |
| `v836RoutePoints` | assets/app.js:12277 | 3 | 2 | 4 |
| `v9010CommitStructure` | assets/app.js:13526 | 81 | 1 | 14 |
| `v908EditorHtml` | assets/app.js:13398 | 1 | 1 | 0 |
| `v909CommitStructure` | assets/app.js:13322 | 76 | 1 | 15 |
| `v9CleanRows` | assets/app.js:13029 | 8 | 4 | 0 |
| `v9Clone` | assets/app.js:13027 | 1 | 4 | 0 |
| `v9Diff` | assets/app.js:13049 | 16 | 3 | 3 |
| `v9EditorHtml` | assets/app.js:13111 | 1 | 1 | 0 |
| `v9MarkDirty` | assets/app.js:13037 | 10 | 1 | 3 |
| `v9QGCds` | assets/app.js:13047 | 2 | 1 | 2 |
| `v9SaveAll` | assets/app.js:13259 | 24 | 1 | 12 |
| `v9ShowRequest` | assets/app.js:13105 | 6 | 3 | 3 |
| `v9StructureRequest` | assets/app.js:13065 | 40 | 3 | 3 |

## PAINEL DE SAUDE DO SISTEMA

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `saudeCartao` | assets/app.js:3746 | 7 | 1 | 2 |
| `saudeTempoDesde` | assets/app.js:3727 | 10 | 1 | 2 |
| `saudeUltimaSync` | assets/app.js:3740 | 6 | 1 | 0 |
| `saudeUltimoBackup` | assets/app.js:3737 | 3 | 1 | 0 |

## PARSER DA PLANILHA OFICIAL + GOOGLE SHEETS SOMENTE LEITURA

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `a1SheetName` | assets/app.js:5240 | 1 | 1 | 2 |
| `activeMetricRows` | assets/app.js:5080 | 9 | 6 | 7 |
| `currentMetricMonthKey` | assets/app.js:5067 | 2 | 7 | 1 |
| `extractSpreadsheetId` | assets/app.js:5227 | 13 | 5 | 2 |
| `f` | assets/app.js:5089 | 2 | 110 | 1 |
| `fetchMetricsFromSource` | assets/app.js:5277 | 3 | **ninguém** | 0 |
| `isPublishedSheetUrl` | assets/app.js:5188 | 4 | 2 | 0 |
| `metricActivePeriodLabel` | assets/app.js:5089 | 3 | 4 | 4 |
| `metricAnalysis` | assets/app.js:5140 | 43 | 5 | 4 |
| `metricDateValue` | assets/app.js:5023 | 11 | 12 | 2 |
| `metricGroupOccupied` | assets/app.js:5079 | 1 | 3 | 2 |
| `metricGroupRecords` | assets/app.js:5109 | 1 | 1 | 3 |
| `metricMonthKey` | assets/app.js:5061 | 6 | 2 | 2 |
| `metricPeriodLabel` | assets/app.js:5069 | 8 | 6 | 3 |
| `metricPredominanceRange` | assets/app.js:5110 | 30 | 2 | 1 |
| `metricSlotKeys` | assets/app.js:5059 | 1 | 3 | 2 |
| `metricSlotMinutes` | assets/app.js:5035 | 5 | 4 | 1 |
| `metricSlots` | assets/app.js:5040 | 19 | 18 | 2 |
| `metricTsToDate` | assets/app.js:5242 | 8 | 1 | 0 |
| `occupied` | assets/app.js:5081 | 1 | 5 | 1 |
| `parseIsoMetricDate` | assets/app.js:5077 | 2 | 4 | 1 |
| `publishedCsvUrl` | assets/app.js:5192 | 35 | 1 | 1 |
| `refreshMetricPeriodOptions` | assets/app.js:5097 | 12 | 3 | 5 |
| `renderMetricSourceStatus` | assets/app.js:5250 | 27 | 7 | 4 |
| `syncMetricDateInputs` | assets/app.js:5092 | 4 | 3 | 1 |

## PERFIL TÉCNICO + MEMÓRIA OPERACIONAL DO GROUP

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `changedSummary` | assets/app.js:4596 | 49 | 1 | 1 |
| `formatHistoryDate` | assets/app.js:4554 | 6 | 5 | 1 |
| `historyDateValue` | assets/app.js:4545 | 9 | 6 | 0 |
| `historyFamily` | assets/app.js:4560 | 16 | 3 | 0 |
| `historyTitle` | assets/app.js:4576 | 20 | 5 | 2 |

## PERFIL TÉCNICO INTEGRADO AO GROUP

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `addFarmItem` | assets/app.js:8907 | 6 | 1 | 1 |
| `addRecipe` | assets/app.js:8876 | 3 | 1 | 2 |
| `archiveTechnicalRequest` | assets/app.js:9062 | 1 | 4 | 0 |
| `canonicalProductImage` | assets/app.js:8673 | 12 | 2 | 1 |
| `clonePlain` | assets/app.js:8616 | 1 | 12 | 0 |
| `closeFarmEditor` | assets/app.js:8888 | 1 | 1 | 1 |
| `closeGroupSettingsPage` | assets/app.js:9595 | 15 | 1 | 3 |
| `closeRecipeEditor` | assets/app.js:8863 | 1 | 1 | 1 |
| `copyArchivedRequest` | assets/app.js:9099 | 6 | 1 | 0 |
| `defaultTechProfile` | assets/app.js:8743 | 1 | 1 | 0 |
| `editFarmItem` | assets/app.js:8889 | 18 | 2 | 3 |
| `editRecipe` | assets/app.js:8864 | 12 | 2 | 3 |
| `ensureBenefitsHome` | assets/app.js:9565 | 9 | 2 | 1 |
| `farmItemCard` | assets/app.js:8879 | 2 | 1 | 3 |
| `farmItemsFromCraft` | assets/app.js:8709 | 20 | 1 | 2 |
| `fmtRequestWhen` | assets/app.js:9097 | 1 | 1 | 0 |
| `getTechProfileFromForm` | assets/app.js:8814 | 23 | 4 | 4 |
| `ingredientEditorRow` | assets/app.js:8849 | 1 | 1 | 0 |
| `itemImg` | assets/app.js:8685 | 2 | 6 | 2 |
| `mergedTechProfile` | assets/app.js:8770 | 1 | 20 | 0 |
| `mergeRecipeLists` | assets/app.js:8594 | 12 | 1 | 2 |
| `opBlank` | assets/app.js:9227 | 26 | 1 | 0 |
| `openGroupSettingsPage` | assets/app.js:9574 | 21 | 1 | 5 |
| `operationalFromExisting` | assets/app.js:9276 | 1 | 1 | 0 |
| `operationalFromForm` | assets/app.js:9337 | 56 | 2 | 1 |
| `opGet` | assets/app.js:9336 | 1 | 1 | 1 |
| `opMerge` | assets/app.js:9253 | 1 | 1 | 0 |
| `opPair` | assets/app.js:9224 | 3 | 1 | 0 |
| `readIngredientEditor` | assets/app.js:8859 | 4 | 2 | 1 |
| `recipeCard` | assets/app.js:8837 | 2 | 1 | 3 |
| `recipeNormalize` | assets/app.js:8687 | 1 | 3 | 0 |
| `renderConnectedRequests` | assets/app.js:9105 | 17 | 5 | 8 |
| `renderCraftRecipes` | assets/app.js:8839 | 10 | 2 | 7 |
| `renderFarmItems` | assets/app.js:8881 | 7 | 4 | 5 |
| `renderIngredientEditor` | assets/app.js:8851 | 8 | 2 | 5 |
| `renderOperationalProfile` | assets/app.js:9395 | 1 | 1 | 0 |
| `renderRouteOverview` | assets/app.js:8936 | 26 | 4 | 4 |
| `renderStructureSnapshot` | assets/app.js:8969 | 32 | 2 | 7 |
| `renderTechProfile` | assets/app.js:8798 | 16 | 5 | 9 |
| `requestFingerprint` | assets/app.js:9061 | 1 | 2 | 0 |
| `routePointList` | assets/app.js:8913 | 11 | 6 | 0 |
| `segmentKey` | assets/app.js:8563 | 1 | 16 | 1 |
| `setOpVal` | assets/app.js:9393 | 2 | 2 | 1 |
| `setRouteExclusive` | assets/app.js:8924 | 12 | 1 | 4 |
| `standardRecipesForGroup` | assets/app.js:8564 | 1 | 1 | 0 |
| `syncFarmWithCraft` | assets/app.js:8729 | 14 | 4 | 1 |
| `syncOperationalLegacy` | assets/app.js:9471 | 29 | 1 | 3 |
| `techAutoRequests` | assets/app.js:9002 | 49 | **ninguém** | 5 |
| `techChanged` | assets/app.js:9001 | 1 | **ninguém** | 1 |
| `toggleRoutePoints` | assets/app.js:8962 | 7 | 1 | 1 |

## PERMISSÕES GRANULARES POR MÓDULO

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `applyModuleAccess` | assets/app.js:1359 | 12 | 2 | 6 |
| `canEditModule` | assets/app.js:1356 | 2 | 7 | 3 |
| `canViewModule` | assets/app.js:1353 | 3 | 9 | 3 |
| `defaultPermissionsForRole` | assets/app.js:1327 | 14 | 5 | 0 |
| `effectivePermissions` | assets/app.js:1341 | 11 | 3 | 2 |
| `firstAllowedModule` | assets/app.js:1358 | 1 | 2 | 1 |
| `moduleForElement` | assets/app.js:1375 | 17 | 1 | 1 |
| `mutationButton` | assets/app.js:1371 | 4 | 1 | 1 |
| `normalizePermission` | assets/app.js:1323 | 4 | 4 | 0 |
| `pageModule` | assets/app.js:1352 | 1 | 4 | 0 |
| `permissionDeniedMessage` | assets/app.js:1392 | 2 | 6 | 2 |

## Planejador de missões

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `plannerPanel` | assets/mission-planner.js:1920 | 1 | 1 | 2 |

## RESUMO EXECUTIVO / CADASTRO RECOLHIDO

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `put` | assets/app.js:9622 | 2 | 1 | 1 |
| `renderGroupOverview` | assets/app.js:9617 | 30 | 1 | 5 |

## ROTA EXCLUSIVA + MAPA OPERACIONAL DO GROUP

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `grCollectStructures` | assets/app.js:12051 | 54 | 2 | 7 |
| `grCurrent` | assets/app.js:12002 | 3 | 19 | 2 |
| `grDeleteRoute` | assets/app.js:12220 | 29 | 1 | 12 |
| `grEnsureMap` | assets/app.js:12105 | 20 | 1 | 2 |
| `grFmtPoint` | assets/app.js:12000 | 1 | 5 | 1 |
| `grMapPng` | assets/app.js:12249 | 9 | 1 | 3 |
| `grParseCoord` | assets/app.js:11985 | 11 | 5 | 1 |
| `grParseRoute` | assets/app.js:11996 | 4 | 6 | 1 |
| `grRenderMap` | assets/app.js:12137 | 16 | 3 | 10 |
| `grRenderRouteUi` | assets/app.js:12163 | 15 | 5 | 8 |
| `grRenderRows` | assets/app.js:12153 | 10 | 2 | 5 |
| `grRequestText` | assets/app.js:12006 | 41 | 3 | 6 |
| `grRouteIcon` | assets/app.js:12125 | 6 | 3 | 1 |
| `grRouteText` | assets/app.js:12001 | 1 | **ninguém** | 3 |
| `grSavedPoints` | assets/app.js:12005 | 1 | 6 | 4 |
| `grSaveRoute` | assets/app.js:12178 | 42 | 1 | 16 |
| `grShowRequest` | assets/app.js:12047 | 4 | 3 | 2 |
| `grStructIcon` | assets/app.js:12131 | 6 | 1 | 1 |
| `walk` | assets/app.js:12098 | 3 | 1 | 2 |

## Sem categoria

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `activate` | assets/mission-planner.js:2036 | 14 | 2 | 3 |
| `active` | assets/mission-planner.js:536 | 1 | 83 | 0 |
| `activeEventId` | assets/mission-planner.js:538 | 1 | 2 | 1 |
| `addManual` | assets/mission-planner.js:1606 | 12 | 1 | 9 |
| `adoptStrayCards` | assets/mission-planner.js:1921 | 7 | 1 | 3 |
| `alternar` | assets/mission-planner.js:1152 | 5 | 1 | 1 |
| `analyze` | assets/mission-planner.js:1402 | 12 | 1 | 4 |
| `anomalyAlertId` | assets/app.js:192 | 1 | 2 | 0 |
| `anomalyIsCleared` | assets/app.js:193 | 4 | 1 | 1 |
| `applyCloudMissions` | assets/mission-planner.js:861 | 3 | 1 | 1 |
| `applyOceanColor` | assets/mission-planner.js:973 | 7 | 2 | 1 |
| `applyRadius` | assets/mission-planner.js:1341 | 1 | 1 | 5 |
| `baixarBackup` | assets/mission-planner.js:1955 | 9 | 1 | 1 |
| `bind` | assets/mission-planner.js:1889 | 13 | 2 | 43 |
| `bindFormAutosave` | assets/mission-planner.js:1867 | 4 | 1 | 11 |
| `buildLayerControl` | assets/mission-planner.js:1107 | 53 | 1 | 8 |
| `cancelEdit` | assets/mission-planner.js:1453 | 2 | 6 | 4 |
| `captureSnapshot` | assets/mission-planner.js:1481 | 17 | 3 | 7 |
| `cardTabKey` | assets/mission-planner.js:1913 | 7 | 2 | 0 |
| `cdsProblemas` | assets/mission-planner.js:649 | 2 | 3 | 0 |
| `centralCategory` | assets/mission-planner.js:1839 | 1 | 1 | 0 |
| `chave` | assets/mission-planner.js:837 | 1 | 6 | 2 |
| `cleanSegmentName` | assets/app.js:257 | 1 | 2 | 0 |
| `clearLayers` | assets/mission-planner.js:1246 | 1 | 1 | 0 |
| `clearPoints` | assets/mission-planner.js:1727 | 1 | 1 | 3 |
| `clearVacantMetricAlert` | assets/app.js:197 | 20 | 1 | 7 |
| `cloneEventTo` | assets/mission-planner.js:1717 | 6 | 1 | 12 |
| `cloneZone` | assets/mission-planner.js:1712 | 5 | 1 | 9 |
| `close` | assets/mission-planner.js:1705 | 1 | 5 | 0 |
| `commit` | assets/mission-planner.js:1444 | 5 | 12 | 7 |
| `copyCurrentRequest` | assets/mission-planner.js:1830 | 1 | 1 | 4 |
| `copySelectedTp` | assets/mission-planner.js:1598 | 8 | 1 | 6 |
| `coverageStats` | assets/mission-planner.js:579 | 17 | 3 | 1 |
| `createEvent` | assets/mission-planner.js:1618 | 7 | 1 | 8 |
| `createZone` | assets/mission-planner.js:1625 | 10 | 2 | 11 |
| `definirGroupsConhecidos` | assets/modules/metricas-parser.js:18 | 3 | 2 | 0 |
| `deleteEvent` | assets/mission-planner.js:1663 | 8 | 1 | 6 |
| `deleteZone` | assets/mission-planner.js:1662 | 1 | 1 | 6 |
| `distXY` | assets/mission-planner.js:658 | 1 | 1 | 0 |
| `duplicateMission` | assets/mission-planner.js:1723 | 4 | **ninguém** | 2 |
| `effectiveEventRadius` | assets/mission-planner.js:596 | 3 | 9 | 1 |
| `ensureBackupCard` | assets/mission-planner.js:1978 | 18 | 1 | 4 |
| `ensureCenterValidationUi` | assets/mission-planner.js:1314 | 8 | 1 | 7 |
| `ensureCentralV954` | assets/mission-planner.js:1832 | 7 | 2 | 1 |
| `ensureCoverageUi` | assets/mission-planner.js:1336 | 16 | 1 | 11 |
| `ensureMapKpis` | assets/mission-planner.js:2030 | 6 | 1 | 1 |
| `ensurePlannerTabs` | assets/mission-planner.js:1996 | 22 | 1 | 4 |
| `ensureWorkspaceBar` | assets/mission-planner.js:1878 | 7 | 1 | 4 |
| `err` | assets/mission-planner.js:1208 | 1 | 19 | 3 |
| `eventOptions` | assets/mission-planner.js:1694 | 1 | 2 | 2 |
| `eventProfiles` | assets/mission-planner.js:1671 | 20 | 2 | 0 |
| `eventsOfCategory` | assets/mission-planner.js:543 | 10 | 5 | 1 |
| `eventUid` | assets/mission-planner.js:537 | 1 | 3 | 0 |
| `exportValidated` | assets/mission-planner.js:1729 | 2 | 1 | 6 |
| `exportXY` | assets/mission-planner.js:1731 | 1 | 1 | 6 |
| `findDashboardAlertState` | assets/app.js:165 | 1 | 2 | 1 |
| `fit` | assets/mission-planner.js:1502 | 1 | 6 | 3 |
| `fitZone` | assets/mission-planner.js:1383 | 6 | 2 | 4 |
| `focusActiveMission` | assets/mission-planner.js:1646 | 9 | 6 | 6 |
| `generateCircle` | assets/mission-planner.js:1503 | 16 | 2 | 9 |
| `generateInsideZone` | assets/mission-planner.js:1389 | 12 | 1 | 9 |
| `generateRequest` | assets/mission-planner.js:1732 | 98 | 2 | 9 |
| `getSnapshot` | assets/mission-planner.js:929 | 3 | 1 | 1 |
| `headingIcon` | assets/mission-planner.js:1240 | 6 | 1 | 1 |
| `importBulk` | assets/mission-planner.js:1523 | 7 | 1 | 10 |
| `inferLegacyStructure` | assets/mission-planner.js:554 | 24 | 2 | 3 |
| `initMap` | assets/mission-planner.js:1161 | 72 | 1 | 18 |
| `invalidateSelected` | assets/mission-planner.js:1589 | 9 | 1 | 5 |
| `isCenterValidated` | assets/mission-planner.js:666 | 1 | 4 | 2 |
| `isValidated` | assets/mission-planner.js:665 | 1 | 13 | 1 |
| `layer` | assets/mission-planner.js:942 | 20 | 7 | 2 |
| `ll` | assets/mission-planner.js:535 | 1 | 14 | 1 |
| `loadSegmentConfig` | assets/app.js:273 | 15 | 1 | 4 |
| `loadSnapshotPreview` | assets/mission-planner.js:1498 | 2 | 2 | 4 |
| `loadStore` | assets/mission-planner.js:908 | 7 | 1 | 7 |
| `makeCrs` | assets/mission-planner.js:933 | 6 | 1 | 0 |
| `mapNameOf` | assets/mission-planner.js:540 | 1 | 2 | 0 |
| `mapNotice` | assets/mission-planner.js:1039 | 13 | 3 | 3 |
| `mapsOfEvent` | assets/mission-planner.js:541 | 1 | **ninguém** | 2 |
| `mergeMissions` | assets/mission-planner.js:834 | 17 | 4 | 8 |
| `mergeOfficialPresets` | assets/mission-planner.js:888 | 19 | 1 | 2 |
| `metricGroupLabel` | assets/modules/metricas-parser.js:59 | 18 | 2 | 3 |
| `metricSlotLabel` | assets/modules/metricas-parser.js:57 | 1 | 2 | 1 |
| `newMission` | assets/mission-planner.js:710 | 28 | 2 | 5 |
| `nextPendingId` | assets/mission-planner.js:659 | 6 | 2 | 1 |
| `nowIso` | assets/mission-planner.js:533 | 1 | 15 | 0 |
| `ok` | assets/mission-planner.js:1207 | 1 | 30 | 1 |
| `openDb` | assets/mission-planner.js:916 | 7 | 2 | 0 |
| `openReplicator` | assets/mission-planner.js:1691 | 21 | 1 | 23 |
| `pinIcon` | assets/mission-planner.js:1234 | 6 | 1 | 2 |
| `pointDistanceFromCenter` | assets/mission-planner.js:599 | 1 | 4 | 0 |
| `pointInsideZone` | assets/mission-planner.js:600 | 1 | 1 | 3 |
| `presetMission` | assets/mission-planner.js:677 | 33 | 2 | 5 |
| `pushBackup` | assets/mission-planner.js:811 | 19 | 1 | 0 |
| `qs` | assets/mission-planner.js:3 | 1 | 66 | 0 |
| `qsa` | assets/mission-planner.js:4 | 1 | 8 | 0 |
| `queueSnapshot` | assets/mission-planner.js:1480 | 1 | 3 | 1 |
| `rawCds` | assets/mission-planner.js:1414 | 1 | 7 | 2 |
| `readBackups` | assets/mission-planner.js:830 | 3 | 1 | 0 |
| `refreshEvents` | assets/mission-planner.js:1702 | 1 | 1 | 3 |
| `reloadMapTiles` | assets/mission-planner.js:1052 | 23 | 1 | 6 |
| `render` | assets/mission-planner.js:1418 | 2 | 15 | 15 |
| `renderBackupList` | assets/mission-planner.js:1937 | 18 | 2 | 8 |
| `renderCenterValidation` | assets/mission-planner.js:1322 | 2 | 2 | 8 |
| `renderCentralV954` | assets/mission-planner.js:1845 | 21 | 2 | 16 |
| `renderCoverage` | assets/mission-planner.js:1352 | 30 | 5 | 8 |
| `renderMap` | assets/mission-planner.js:1247 | 44 | 4 | 14 |
| `renderMissionList` | assets/mission-planner.js:1292 | 3 | 1 | 1 |
| `renderPlannerBadges` | assets/mission-planner.js:2018 | 12 | 1 | 5 |
| `renderPointList` | assets/mission-planner.js:1296 | 9 | 1 | 14 |
| `renderWorkspaceBar` | assets/mission-planner.js:1885 | 3 | 2 | 2 |
| `repairFacxFacHierarchy` | assets/mission-planner.js:765 | 38 | 1 | 2 |
| `repairKnownZoneAssignments` | assets/mission-planner.js:740 | 24 | 1 | 3 |
| `requireEdit` | assets/mission-planner.js:1449 | 1 | 12 | 0 |
| `reservaKey` | assets/app.js:1111 | 1 | 1 | 0 |
| `restaurarArquivo` | assets/mission-planner.js:1964 | 14 | 1 | 5 |
| `run` | assets/mission-planner.js:1648 | 3 | 1 | 2 |
| `safeName` | assets/mission-planner.js:1500 | 1 | 1 | 1 |
| `sampleOceanFromTile` | assets/mission-planner.js:980 | 40 | 1 | 2 |
| `sanitizeDashboardConfig` | assets/app.js:77 | 1 | 3 | 0 |
| `saveDashboardConfig` | assets/app.js:127 | 33 | 1 | 7 |
| `saveMission` | assets/mission-planner.js:1452 | 1 | 1 | 7 |
| `saveSnapshot` | assets/mission-planner.js:923 | 6 | 1 | 3 |
| `saveStore` | assets/mission-planner.js:851 | 10 | 14 | 1 |
| `segmentDefs` | assets/app.js:258 | 1 | 7 | 0 |
| `segmentNames` | assets/app.js:259 | 1 | 6 | 1 |
| `selectEventForAction` | assets/mission-planner.js:1840 | 5 | 1 | 2 |
| `selectPoint` | assets/mission-planner.js:1305 | 8 | 4 | 8 |
| `sessionMeta` | assets/app.js:1128 | 2 | **ninguém** | 0 |
| `set` | assets/mission-planner.js:2022 | 1 | 5 | 2 |
| `setCloudState` | assets/mission-planner.js:865 | 6 | 1 | 3 |
| `setDashboardAlertState` | assets/app.js:166 | 26 | 1 | 9 |
| `setPlannerTab` | assets/mission-planner.js:1928 | 6 | 1 | 2 |
| `setSaveState` | assets/mission-planner.js:1479 | 1 | 13 | 1 |
| `setStatus` | assets/mission-planner.js:962 | 1 | 5 | 1 |
| `setValidationFeedback` | assets/mission-planner.js:1530 | 4 | 5 | 1 |
| `setWorkspace` | assets/mission-planner.js:1872 | 6 | 5 | 2 |
| `startEdit` | assets/mission-planner.js:1450 | 2 | 6 | 5 |
| `startMapWatchdog` | assets/mission-planner.js:1075 | 25 | 2 | 5 |
| `switchEvent` | assets/mission-planner.js:1655 | 6 | **ninguém** | 6 |
| `switchMission` | assets/mission-planner.js:1661 | 1 | 1 | 6 |
| `tick` | assets/mission-planner.js:1078 | 20 | 1 | 4 |
| `tpCds` | assets/mission-planner.js:1415 | 1 | 3 | 2 |
| `trocarBase` | assets/mission-planner.js:1134 | 9 | 1 | 4 |
| `uid` | assets/mission-planner.js:534 | 1 | 4 | 0 |
| `updateEditUi` | assets/mission-planner.js:1455 | 24 | 6 | 2 |
| `updateExport` | assets/mission-planner.js:1416 | 2 | 1 | 5 |
| `validate` | assets/mission-planner.js:1703 | 2 | 2 | 7 |
| `validateBulk` | assets/mission-planner.js:1565 | 24 | 1 | 11 |
| `validateCenter` | assets/mission-planner.js:1324 | 11 | 1 | 9 |
| `validateSelected` | assets/mission-planner.js:1534 | 1 | 2 | 0 |
| `validCoord` | assets/mission-planner.js:607 | 1 | 22 | 0 |
| `watchOcean` | assets/mission-planner.js:1020 | 13 | 4 | 3 |
| `zoneCoverageCounts` | assets/mission-planner.js:601 | 5 | 2 | 3 |
| `zonesOfEvent` | assets/mission-planner.js:539 | 1 | 12 | 0 |
| `zonesOfMap` | assets/mission-planner.js:542 | 1 | **ninguém** | 2 |

## SESSÕES E AUDITORIA DE USUÁRIOS

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `auditModule` | assets/app.js:3693 | 14 | 1 | 0 |
| `auditTarget` | assets/app.js:3707 | 1 | 1 | 0 |
| `isSameLocalDay` | assets/app.js:3714 | 1 | 1 | 0 |
| `sessionActions` | assets/app.js:3711 | 1 | 3 | 1 |
| `sessionDuration` | assets/app.js:3713 | 1 | 2 | 2 |
| `sessionEffectiveEnd` | assets/app.js:3712 | 1 | 3 | 4 |
| `sessionEndMs` | assets/app.js:3709 | 1 | 2 | 0 |
| `sessionStartMs` | assets/app.js:3708 | 1 | 5 | 0 |

## TRANSFERÊNCIA DE PAINEL, TROCA DE QG E ADMINISTRAÇÃO

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `adminWipe` | assets/app.js:9880 | 33 | 1 | 5 |
| `cleanSnapshot` | assets/app.js:9701 | 4 | 1 | 1 |
| `isAdmin` | assets/app.js:9696 | 4 | 18 | 0 |
| `movementOpen` | assets/app.js:9706 | 37 | 1 | 6 |
| `movementPreview` | assets/app.js:9744 | 12 | 2 | 2 |
| `wipeCollection` | assets/app.js:9863 | 16 | 2 | 4 |

## UI KIT (script classico, carregado antes do app.js)

| Função | Arquivo:linha | Linhas | Chamada por | Chama |
|---|---|---|---|---|
| `boot` | assets/ui-kit.js:221 | 1 | 1 | 5 |
| `classify` | assets/ui-kit.js:30 | 7 | 1 | 2 |
| `dismiss` | assets/ui-kit.js:72 | 5 | 1 | 0 |
| `ensureRegion` | assets/ui-kit.js:13 | 9 | 1 | 0 |
| `labelIconButtons` | assets/ui-kit.js:140 | 25 | 1 | 0 |
| `observarMudancas` | assets/ui-kit.js:209 | 11 | 1 | 1 |
| `rotularDinamicos` | assets/ui-kit.js:194 | 14 | 2 | 0 |
| `setOpen` | assets/ui-kit.js:121 | 5 | 1 | 0 |
| `setupNav` | assets/ui-kit.js:95 | 43 | 1 | 1 |
| `skipLink` | assets/ui-kit.js:167 | 10 | 1 | 0 |
| `toast` | assets/ui-kit.js:42 | 43 | 1 | 5 |
