// ============================================================
// TIPOS DA TELA "NOVA ANÁLISE"
// Usados por src/hooks/useAnalise.ts, src/services/verdescanApi.ts,
// src/utils/exif.ts e src/components/analise/*.
// ============================================================

export type Localizacao = {
  latitude: number;
  longitude: number;
  precisao: number | null;
};


export type OrigemFoto =
  | "camera"
  | "galeria"
  | null;


export type OrigemLocalizacao =
  | "FOTO"
  | "GPS_ATUAL"
  | "MANUAL"
  | "RODOVIA_KM"
  | null;


export type ClasseAnalise =
  | "NORMAL"
  | "ATENCAO"
  | "CRITICO"
  | "INCONCLUSIVO";


export type ResultadoAnalise = {
  classe: ClasseAnalise;

  confianca: number;

  confiancaPercentual: number;

  nivelConfianca: string;

  revisaoRecomendada: boolean;

  motivoRevisao: string | null;

  vegetacaoTotal: number;

  vegetacaoInteresse: number;

  arvore: number;

  background: number;

  pAcimaNormal: number;

  pAcimaAtencao: number;

  limiarAtencao: number;

  limiarCritico: number;

  probabilidadeNormal: number;

  probabilidadeAtencao: number;

  probabilidadeCritico: number;

  // true quando o operador classificou sem a IA
  manual?: boolean;
};


export type RespostaAPI = {
  status: string;

  pipeline?: string;

  classe: ClasseAnalise;

  confianca: number;

  confianca_percentual?: number;

  nivel_confianca?: string;

  revisao_recomendada?: boolean;

  motivo_revisao?: string | null;

  vegetacao_total?: number;

  vegetacao_interesse?: number;

  arvore?: number;

  background?: number;

  ordinal?: {
    p_acima_normal?: number;

    p_acima_normal_percentual?: number;

    p_acima_atencao?: number;

    p_acima_atencao_percentual?: number;

    limiar_atencao?: number;

    limiar_atencao_percentual?: number;

    limiar_critico?: number;

    limiar_critico_percentual?: number;
  };

  probabilidades?: {
    ATENCAO?: number;
    CRITICO?: number;
    NORMAL?: number;
  };

  probabilidades_percentuais?: {
    ATENCAO?: number;
    CRITICO?: number;
    NORMAL?: number;
  };

  // Campos legados mantidos pela API durante a transição.
  vegetacao_baixa?: number;

  vegetacao_alta?: number;

  patches_analisados?: number;

  arquivo?: string;
};


export type RespostaLocalizacao = {
  status: string;

  rodovia: string;

  km: number;

  latitude: number;

  longitude: number;

  origem: string;

  aproximada: boolean;

  qualidade:
    | "REFERENCIA"
    | "BOA"
    | "MEDIA"
    | "BAIXA"
    | string;

  km_referencia_anterior: number;

  km_referencia_posterior: number;
};
