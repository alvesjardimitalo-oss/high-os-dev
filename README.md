# HIGH OS

## V14.1 + Planejador V12.17 (atual — trazido do high-os, mantendo o banco Discord/Railway do dev)

**Ocupação dos Groups (V14)** — `assets/modules/ocupacao.js`
- Regra única de ocupação para todas as telas: ASSUMIDA (status ATIVA + facção), DISPONÍVEL, SEM QG e REVISAR (dados contraditórios).
- Dashboard: painel de ocupação + "Facções disponíveis" refeitos; card "A REVISAR" e tela de revisão. Nada é corrigido sozinho: o administrador escolhe a ação (marcar assumida, liberar, restaurar entrega órfã, fechar entrega).
- Entrega: facção não pode ocupar dois Groups; Group SEM QG/REVISAR bloqueado; Group ocupado só por **troca confirmada** com justificativa (recolhe o ocupante com anúncio de recolhimento e entrega ao novo com anúncio de entrega, pelo bot do Discord).
- Desligadas as correções automáticas antigas (normalização V8.20 e reconciliação de entregas) que remarcavam Groups sem avisar.

**Métricas (V14.1)** — `assets/modules/metricas-motor.js`
- A métrica é da facção que ocupava o Group no horário da coleta (linha do tempo por entregas, recolhimentos, transferências de painel e cadastro).
- Facção transferida leva o histórico para o Group atual; facção que saiu aparece como `Group • Facção`; coleta em Group vago vira anomalia.
- Dia de hoje mostra coleta parcial (14H/16H/21H/23H) em vez de comparar dia incompleto.

**Planejador V12.17** — mesclado com a SAFE dinâmica V3, polígonos, sincronização e desfazer/refazer do dev
- Tipos de evento do painel `/evento` (`assets/modules/eventos-painel.js`), ciclo da solicitação por zona (rascunho → pronta → enviada → no jogo), diff do que mudou desde o jogo, pacote do evento e cópia em partes para o Discord.
- Padrão dos eventos com gás (13/10) em toda solicitação de Sobrevivência / Fac x Fac / BR, com testes no jogo.
- ⚡ AUTO na SAFE: 4 etapas em terra firme, longe de QG, ~20 min até raio 0 e tempo de fuga a pé com margem PvP em todas as transições.
- Solicitação de gás descreve todas as SAFEs, dano/HUD fora da safe e a duração pela timeline; dominação por polígono sai com as CDS do contorno.
- META de facções, gerar spawns que faltam (fora de água/QG), sugerir locais, centro justo, otimizar spawns, partidas e análise de vitórias.
- TP de teste com **Z estimado** pelas CDS já validadas próximas (evita limbo/NC).

## V9.5.0 (atual)
- Planejador abre em **Central de Missões compacta**; formulário e mapa só aparecem depois de escolher uma zona.
- Editor ganhou breadcrumb `MISSÕES > EVENTO > ZONA`, mantendo as abas ZONA / PONTOS / VALIDAÇÃO / ENTREGA.
- Firestore passa a receber na primeira sincronização a **união segura Local + Nuvem**, preservando zonas que existiam somente em um navegador e redistribuindo-as para os demais.
- Estado de nuvem visível: `SINCRONIZANDO`, `SINCRONIZADO` e `MODO LOCAL`.
- `localStorage` continua como cache/backup; a sincronização de equipe é consolidada no Firestore.
- Interface reduz ações concorrentes: na Central fica em destaque apenas `+ NOVO EVENTO`; ações de zona/edição aparecem somente no contexto do editor.


## V9.4.1 (atual)
- **Correcao critica das regras**: a V9.4 bloqueava o chat inteiro ("Missing or insufficient permissions"). Numa consulta de lista o Firestore valida a regra contra os FILTROS, nao documento a documento. Agora cada mensagem carrega `participants` e a consulta usa `array-contains`.
- Rode `tools/migrar-chat.html` uma vez, como ADMIN, para preencher `participants` nas mensagens antigas.
- Republique regras e indice: `firebase deploy --only firestore:rules,firestore:indexes` (o indice mudou: conversationId + participants + createdAt).
- Camada de resiliencia: espelho local de cada colecao, janela de 20s e MODO LOCAL quando o Firebase cai ou bate a cota. `highOSRotinas()` no console mostra o consumo. Detalhes em `ROTINAS-FIREBASE.md`.
- Planejador reorganizado em abas (ZONA / PONTOS / VALIDACAO / ENTREGA), KPIs sobre o mapa e mar de Cayo Perico na mesma cor de Los Santos.
- Validador de CDS refeito: aceita tpcds, chaves, vector4, ponto e virgula ou espaco; avisa desvio em metros; Enter valida e pula para o proximo pendente; validacao em lote.

## V9.4.0
- Chat passa a escutar somente a conversa aberta (`where conversationId` + `limit 80`): acabou o vazamento de DMs entre usuarios.
- Novo `firestore.rules` + `firestore.indexes.json`. **Publique antes de usar a V9.4**, senao o chat nao carrega:
  `firebase deploy --only firestore:rules,firestore:indexes`
- Planejador de Missoes sincroniza com o Firestore (`highos/data/config/missoes_planejador`) mantendo o localStorage como cache.
- Novos `assets/ui-kit.css` e `assets/ui-kit.js`: toasts no lugar dos alert(), menu lateral em drawer no celular, skeletons, foco visivel e rotulos de acessibilidade.
- Imagens otimizadas: 892 KB -> 213 KB.
- Correcoes: atributo `class` duplicado no item Spotify do menu, CSS inline do `<head>` movido para o `style.css`, listener do chat encerrado no logout.
- Detalhes completos em `CHANGELOG-V9.4.0.md`.

## High OS V8.33

Atualização do Planejador de Missões com missões salvas, validação assistida, snapshots do mapa e presets Dominação/Fac x Fac.

# High OS DEV

Ambiente de desenvolvimento separado do Mercado Negro público.

## Publicar no GitHub Pages
1. Envie todos os arquivos desta pasta para a raiz do repositório `high-os`.
2. GitHub > Settings > Pages.
3. Source: Deploy from a branch.
4. Branch: `main` / `(root)` > Save.
5. Aguarde o endereço do GitHub Pages aparecer.

## Firebase
Projeto configurado: `high-os`.
O login usa Google Authentication e valida o documento `users/{email}` no Firestore.

## Importante: domínio autorizado
Após o GitHub Pages gerar o endereço, adicione o domínio `SEU-USUARIO.github.io` em:
Firebase Console > Authentication > Settings > Authorized domains.

O Mercado Negro atual não é alterado por este projeto.


## V9.0.11
- Facções disponíveis cadastradas voltam a aparecer em Organizações mesmo antes do recadastro das CDS V9.
- Groups apenas detectados por métricas continuam ocultos até terem ocupação, cadastro de disponível ou QG/estrutura configurada.
- Mantém integralmente o salvamento estável da V9.0.10.
