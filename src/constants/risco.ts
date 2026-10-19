import { cores } from "../theme";

import {
  ClasseRisco,
  NivelRisco,
  TipoZona,
} from "../types/Ocorrencia";


// ============================================================
// RÉGUA ÚNICA DE RISCO
//
// É a mesma régua usada no treino do modelo de IA
// (VERDESCAN-API/modelos/VERDESCAN_MODELOS_V3_1_CONFIG.json):
//
//   NORMAL  → até 10 cm          → risco baixo
//   ATENCAO → acima de 10 a 30 cm → risco médio
//   CRITICO → acima de 30 cm      → risco alto
// ============================================================

export const LIMITE_NORMAL_CM = 10;

export const LIMITE_ATENCAO_CM = 30;


export function classePorAltura(
  alturaCm: number
): ClasseRisco {
  if (alturaCm <= LIMITE_NORMAL_CM) {
    return "NORMAL";
  }

  if (alturaCm <= LIMITE_ATENCAO_CM) {
    return "ATENCAO";
  }

  return "CRITICO";
}


export function riscoPorClasse(
  classe: ClasseRisco
): NivelRisco {
  if (classe === "CRITICO") {
    return "alto";
  }

  if (classe === "ATENCAO") {
    return "medio";
  }

  return "baixo";
}


// ============================================================
// TEXTOS E CORES
// ============================================================

export const NOME_CLASSE: Record<ClasseRisco, string> = {
  NORMAL: "NORMAL",
  ATENCAO: "ATENÇÃO",
  CRITICO: "CRÍTICO",
};

export const NOME_RISCO: Record<NivelRisco, string> = {
  baixo: "Baixo",
  medio: "Médio",
  alto: "Alto",
};

export const FAIXA_CLASSE: Record<ClasseRisco, string> = {
  NORMAL: "até 10 cm",
  ATENCAO: "10 a 30 cm",
  CRITICO: "acima de 30 cm",
};

export const NOME_ZONA: Record<TipoZona, string> = {
  COMUM: "Comum",
  NOBRE: "Área nobre",
};

// As cores ficam em src/theme (cores.risco), junto com o texto
// de contraste e o fundo claro de cada classe.
export const COR_CLASSE: Record<ClasseRisco, string> = {
  NORMAL: cores.risco.NORMAL.cor,
  ATENCAO: cores.risco.ATENCAO.cor,
  CRITICO: cores.risco.CRITICO.cor,
};


// ============================================================
// CONTRATO
//
// CRÍTICO sempre viola o contrato.
// Em área nobre, ATENÇÃO (10 a 30 cm) também já viola.
// ============================================================

export function violaContrato(
  classe: ClasseRisco,
  zona?: TipoZona
) {
  if (classe === "CRITICO") {
    return true;
  }

  return (
    classe === "ATENCAO" &&
    zona === "NOBRE"
  );
}
