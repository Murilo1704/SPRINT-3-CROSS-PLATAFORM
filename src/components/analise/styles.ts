import {
  StyleSheet,
} from "react-native";

import {
  ALVO_TOQUE,
  cores,
  espaco,
  raio,
  tipografia,
} from "../../theme";


// ============================================================
// ESTILOS COMPARTILHADOS PELAS SEÇÕES DA NOVA ANÁLISE
// ============================================================

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  corpo: {
    paddingHorizontal: espaco.xl,
  },

  secao: {
    marginTop: espaco.xxl,
  },

  linha: {
    flexDirection: "row",
    gap: espaco.md,
  },

  colunaFlex: {
    flex: 1,
  },


  // ---------------- TEXTOS ----------------

  cardTitulo: {
    ...tipografia.corpoForte,
    fontSize: 17,
    color: cores.texto,
    textAlign: "center",
  },

  cardTexto: {
    ...tipografia.corpo,
    color: cores.textoSecundario,
    textAlign: "center",
    marginTop: espaco.xs,
  },

  textoPequeno: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
  },


  // ---------------- FOTO ----------------

  botoesFoto: {
    flexDirection: "row",
    gap: espaco.md,
  },

  botaoFoto: {
    flex: 1,
    minHeight: 120,
    borderRadius: raio.lg,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: espaco.sm,
    padding: espaco.md,
  },

  botaoFotoPrimario: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },

  botaoFotoSecundario: {
    backgroundColor: cores.superficie,
    borderColor: cores.primaria,
    borderStyle: "dashed",
  },

  botaoFotoTexto: {
    ...tipografia.corpoForte,
    textAlign: "center",
  },

  pressionado: {
    opacity: 0.85,
  },

  previewImagem: {
    width: "100%",
    height: 220,
    borderRadius: raio.md,
    backgroundColor: cores.superficieSuave,
  },

  fotoOk: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
    marginTop: espaco.md,
    marginBottom: espaco.md,
  },

  fotoOkTexto: {
    ...tipografia.corpoForte,
    color: cores.sucesso,
  },


  // ---------------- LOCALIZAÇÃO ----------------

  statusLocal: {
    flexDirection: "row",
    gap: espaco.md,
    backgroundColor: cores.primariaClara,
    borderRadius: raio.md,
    padding: espaco.md,
  },

  statusLocalTitulo: {
    ...tipografia.corpoForte,
    color: cores.primariaEscura,
  },

  statusLocalTexto: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    marginTop: 2,
  },

  coordenadas: {
    marginTop: espaco.md,
    backgroundColor: cores.superficieSuave,
    borderRadius: raio.md,
    padding: espaco.md,
    gap: 2,
  },

  coordenadaTexto: {
    ...tipografia.rotulo,
    color: cores.texto,
    fontVariant: ["tabular-nums"],
  },

  ajudaOpcional: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    marginTop: espaco.lg,
    marginBottom: espaco.md,
  },

  buscandoLocal: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
    marginTop: espaco.xs,
  },


  // ---------------- CLASSIFICAÇÃO ----------------

  resultadoRotulo: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
    textAlign: "center",
    marginBottom: espaco.sm,
  },

  resultadoCentro: {
    alignItems: "center",
  },

  confianca: {
    ...tipografia.corpoForte,
    color: cores.texto,
    textAlign: "center",
    marginTop: espaco.md,
  },

  nivelConfianca: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    textAlign: "center",
    marginTop: 2,
  },

  caixaRevisao: {
    flexDirection: "row",
    gap: espaco.sm,
    marginTop: espaco.lg,
    backgroundColor: cores.avisoFundo,
    borderRadius: raio.md,
    padding: espaco.md,
  },

  caixaRevisaoTitulo: {
    ...tipografia.corpoForte,
    color: cores.aviso,
  },

  caixaRevisaoTexto: {
    ...tipografia.pequeno,
    color: cores.aviso,
    marginTop: 2,
  },

  regras: {
    marginTop: espaco.lg,
    gap: espaco.sm,
    alignSelf: "center",
  },

  regraLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
  },

  regraPonto: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  regraTexto: {
    ...tipografia.rotulo,
    color: cores.texto,
  },


  // ---------------- CLASSIFICAÇÃO MANUAL ----------------

  cardManual: {
    borderWidth: 1.5,
    borderColor: cores.bordaForte,
    borderStyle: "dashed",
  },

  manualTitulo: {
    ...tipografia.corpoForte,
    fontSize: 17,
    color: cores.texto,
  },

  manualAjuda: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    marginTop: espaco.xs,
    marginBottom: espaco.lg,
  },

  botoesManual: {
    flexDirection: "row",
    gap: espaco.sm,
  },

  botaoManual: {
    flex: 1,
    minHeight: ALVO_TOQUE + 24,
    borderRadius: raio.md,
    paddingVertical: espaco.md,
    paddingHorizontal: espaco.xs,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoManualTexto: {
    ...tipografia.corpoForte,
  },

  botaoManualFaixa: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },


  // ---------------- AÇÕES ----------------

  acoes: {
    marginTop: espaco.xxl,
    gap: espaco.md,
  },

  dicaAnalise: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
  },
});
