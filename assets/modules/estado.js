/* =====================================================================
   HIGH OS · ESTADO COMPARTILHADO
   ---------------------------------------------------------------------
   Terceiro corte da modularizacao, e o que destrava os proximos.

   Em modulos ES, quem importa uma variavel pode LER o valor atualizado,
   mas nao pode ATRIBUIR a ela. Como dezenas de funcoes fazem
   `metricas = ...`, nenhuma delas podia sair do app.js.

   Reunindo o estado num objeto, a escrita vira `estado.metricas = ...` -
   uma alteracao de propriedade, nao de binding. Isso funciona de
   qualquer modulo, e libera as funcoes para serem movidas.

   A migracao e gradual: por enquanto so as metricas moraram para ca.
   Os demais arrays continuam no app.js e entram um por vez.
   ===================================================================== */

export const estado = {
  /** Linhas de metrica exibidas no momento (planilha, espelho ou colecao). */
  metricas: [],
  /** Copia usada para comparar o que mudou antes de gravar. */
  metricasCache: []
};
