import { Ionicons } from "@expo/vector-icons";

import {
  ReactNode,
} from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ALVO_TOQUE,
  cores,
  espaco,
  raio,
  tipografia,
} from "../../theme";


type Props = {
  titulo: string;
  subtitulo?: string;
  // Botão de voltar (ex.: "Início", "Trechos")
  rotuloVoltar?: string;
  onVoltar?: () => void;
  // Conteúdo à direita do botão de voltar (ex.: "Sair")
  acaoDireita?: ReactNode;
  // Conteúdo extra abaixo do título (ex.: progresso)
  children?: ReactNode;
};


// ============================================================
// CABEÇALHO VERDE DAS TELAS
// Ocupa a área do notch/Dynamic Island (safe area superior).
// ============================================================

export default function Cabecalho({
  titulo,
  subtitulo,
  rotuloVoltar,
  onVoltar,
  acaoDireita,
  children,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.cabecalho,
        { paddingTop: insets.top + espaco.md },
      ]}
    >
      {(onVoltar || acaoDireita) && (
        <View style={styles.linhaTopo}>
          {onVoltar ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Voltar para ${rotuloVoltar ?? "a tela anterior"}`}
              hitSlop={8}
              onPress={onVoltar}
              style={({ pressed }) => [
                styles.botaoVoltar,
                pressed && styles.pressionado,
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={cores.textoSobreEscuro}
              />
              <Text style={styles.textoVoltar}>
                {rotuloVoltar ?? "Voltar"}
              </Text>
            </Pressable>
          ) : (
            <View />
          )}

          {acaoDireita}
        </View>
      )}

      <Text
        style={styles.titulo}
        accessibilityRole="header"
      >
        {titulo}
      </Text>

      {subtitulo && (
        <Text style={styles.subtitulo}>
          {subtitulo}
        </Text>
      )}

      {children}
    </View>
  );
}


const styles = StyleSheet.create({
  cabecalho: {
    backgroundColor: cores.primariaEscura,
    paddingHorizontal: espaco.xl,
    paddingBottom: espaco.xxl,
    borderBottomLeftRadius: raio.xl,
    borderBottomRightRadius: raio.xl,
  },

  linhaTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: espaco.lg,
  },

  botaoVoltar: {
    minHeight: ALVO_TOQUE - 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingLeft: espaco.xs,
    paddingRight: espaco.md,
    borderRadius: raio.pilula,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  textoVoltar: {
    ...tipografia.corpoForte,
    color: cores.textoSobreEscuro,
  },

  pressionado: {
    opacity: 0.8,
  },

  titulo: {
    ...tipografia.tituloGrande,
    color: cores.textoSobreEscuro,
  },

  subtitulo: {
    ...tipografia.corpo,
    color: cores.textoSobreEscuroSuave,
    marginTop: espaco.xs,
  },
});
