// ============================================================
// TIPO PRINCIPAL DO APP: Ocorrencia
//
// Onde é usado:
// - src/services/storage.ts        → salvar/carregar no AsyncStorage
// - src/services/csv.ts            → exportação CSV
// - src/data/dadosIniciais.ts      → ocorrências de exemplo
// - src/hooks/useAnalise.ts        → criação no cadastro (Nova análise)
// - src/app/index.tsx              → contadores e mapa da Home
// - src/app/rodovias.tsx           → lista agrupada por rodovia
// - src/app/trecho-detalhes.tsx    → detalhe, concluir poda e excluir
// - src/app/prioridades.tsx        → pontos prioritários e filtro por período
// - src/components/OcorrenciaCard.tsx         → card da lista
// - src/components/MonitoramentoMap.*.tsx     → pontos no mapa
// - src/constants/risco.ts         → régua de risco (classe/risco/zona)
// ============================================================

export type ClasseRisco = "NORMAL" | "ATENCAO" | "CRITICO";

export type NivelRisco = "baixo" | "medio" | "alto";

export type StatusOcorrencia = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";

export type TipoZona = "COMUM" | "NOBRE";


export type Ocorrencia = {
  // Identificação
  id: string;
  data: string; // ISO 8601

  // Localização
  rodovia: string;
  km: number;
  latitude: number;
  longitude: number;
  local?: string; // referência livre (ex.: "Acostamento sentido capital")
  zona?: TipoZona;

  // Classificação
  classe: ClasseRisco;
  risco?: NivelRisco;
  confianca: number; // 0 a 1; 0 quando manual
  origemClassificacao?: "IA" | "MANUAL";

  // Registro de campo
  descricao?: string;
  equipe?: string;
  veiculo?: string; // placa

  // Status da poda
  status: StatusOcorrencia;
  dataConclusao?: string; // ISO 8601

  // Mídia
  imagem?: string;
};
