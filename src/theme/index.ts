import {
  Platform,
  TextStyle,
  ViewStyle,
} from "react-native";


// ============================================================
// TOKENS VISUAIS DO VERDESCAN
//
// Pensados para uso em campo: texto grande, alto contraste
// (legível no sol) e alvos de toque de no mínimo 48 px.
// Toda tela e componente deve usar estes valores em vez de
// cores e tamanhos soltos.
// ============================================================

type CoresRisco = {
  // cor sólida (badge, pino do mapa, faixa lateral)
  cor: string;
  // texto sobre a cor sólida (contraste >= 4.5:1)
  sobre: string;
  // fundo claro (caixas e cards tingidos)
  fundo: string;
  // texto na cor do risco sobre fundo claro/branco
  texto: string;
};


export const cores = {
  // Marca
  primaria: "#1B7A42",
  primariaEscura: "#0E4A28",
  primariaClara: "#E3F1E8",
  sobrePrimaria: "#FFFFFF",
  // Destaque do perfil gestor (texto: primariaEscura)
  destaque: "#F2C94C",

  // Neutros
  fundo: "#F1F4F1",
  superficie: "#FFFFFF",
  superficieSuave: "#F6F8F6",
  borda: "#D3DDD6",
  bordaForte: "#AEBDB3",
  texto: "#132019",
  textoSecundario: "#4B5B51",
  textoSuave: "#66736A",
  textoSobreEscuro: "#FFFFFF",
  textoSobreEscuroSuave: "#C9DDD0",

  // Estados
  perigo: "#B42F2F",
  perigoFundo: "#FBE5E5",
  aviso: "#8A5F00",
  avisoFundo: "#FCF1D9",
  sucesso: "#1F7A3A",
  sucessoFundo: "#E5F4EA",
  info: "#1F5F99",
  infoFundo: "#E4EEF8",

  // Régua de risco (mesmas cores do mapa e do CSV)
  risco: {
    NORMAL: {
      cor: "#2E9D50",
      sobre: "#0A1F10",
      fundo: "#E5F4EA",
      texto: "#1F7A3A",
    },
    ATENCAO: {
      cor: "#E0A82E",
      sobre: "#2B1D00",
      fundo: "#FCF1D9",
      texto: "#8A5F00",
    },
    CRITICO: {
      cor: "#D63E3E",
      sobre: "#FFFFFF",
      fundo: "#FBE5E5",
      texto: "#B42F2F",
    },
    INCONCLUSIVO: {
      cor: "#5E6862",
      sobre: "#FFFFFF",
      fundo: "#ECEFED",
      texto: "#4B5B51",
    },
  } satisfies Record<string, CoresRisco>,
};


export const espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};


export const raio = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pilula: 999,
};


// Altura mínima de qualquer área tocável (Apple: 44, Material: 48).
export const ALVO_TOQUE = 48;


export const tipografia = {
  tituloGrande: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  titulo: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
  },
  secao: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  corpoForte: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
  },
  corpo: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  rotulo: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  pequeno: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  numero: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
} satisfies Record<string, TextStyle>;


export const sombra = {
  card: Platform.select<ViewStyle>({
    web: {
      boxShadow: "0px 2px 8px rgba(19, 32, 25, 0.08)",
    },
    default: {
      shadowColor: "#132019",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
  }),
  destaque: Platform.select<ViewStyle>({
    web: {
      boxShadow: "0px 6px 16px rgba(14, 74, 40, 0.25)",
    },
    default: {
      shadowColor: "#0E4A28",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
  }),
};


export const tema = {
  cores,
  espaco,
  raio,
  tipografia,
  sombra,
  ALVO_TOQUE,
};
