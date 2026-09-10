
export type Ocorrencia = {
  // Identificação
  id: string;
  data: string;

  // Localização (VERDESCAN)
  rodovia: string;
  km: number;
  latitude: number;
  longitude: number;

  // Localização (Sprint 3)
  local?: string;

  // Classificação (VERDESCAN)
  classe: "NORMAL" | "ATENCAO" | "CRITICO";
  confianca: number;

  // Risco (Sprint 3)
  risco?: "baixo" | "medio" | "alto";

  // Descrição (Sprint 3)
  descricao?: string;

  // Status
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";

  // Mídia
  imagem?: string;
};