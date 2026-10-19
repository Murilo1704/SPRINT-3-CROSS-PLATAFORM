import { Ionicons } from "@expo/vector-icons";

import {
  ComponentProps,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import {
  ALVO_TOQUE,
  cores,
  espaco,
  raio,
  tipografia,
} from "../../theme";


export type NomeIcone =
  ComponentProps<typeof Ionicons>["name"];

type Variante =
  | "primario"
  | "secundario"
  | "perigo"
  | "contorno"
  | "claro";

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icone?: NomeIcone;
  carregando?: boolean;
  desabilitado?: boolean;
  // "grande" = 56 px, para as ações principais da tela
  tamanho?: "normal" | "grande";
  estilo?: StyleProp<ViewStyle>;
};


const VARIANTES: Record<
  Variante,
  { fundo: string; texto: string; borda: string }
> = {
  primario: {
    fundo: cores.primaria,
    texto: cores.sobrePrimaria,
    borda: cores.primaria,
  },
  secundario: {
    fundo: cores.primariaClara,
    texto: cores.primariaEscura,
    borda: cores.primariaClara,
  },
  perigo: {
    fundo: cores.perigoFundo,
    texto: cores.perigo,
    borda: cores.perigo,
  },
  contorno: {
    fundo: cores.superficie,
    texto: cores.primariaEscura,
    borda: cores.bordaForte,
  },
  // Para usar sobre fundos escuros (cabeçalho verde)
  claro: {
    fundo: "rgba(255,255,255,0.14)",
    texto: cores.textoSobreEscuro,
    borda: "rgba(255,255,255,0.35)",
  },
};


// ============================================================
// BOTÃO
// ============================================================

export default function Botao({
  titulo,
  onPress,
  variante = "primario",
  icone,
  carregando = false,
  desabilitado = false,
  tamanho = "normal",
  estilo,
}: Props) {
  const cor = VARIANTES[variante];
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{
        disabled: inativo,
        busy: carregando,
      }}
      disabled={inativo}
      onPress={onPress}
      style={({ pressed }) => [
        styles.botao,
        tamanho === "grande" && styles.grande,
        {
          backgroundColor: cor.fundo,
          borderColor: cor.borda,
        },
        pressed && styles.pressionado,
        desabilitado && styles.desabilitado,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={cor.texto} />
      ) : (
        <View style={styles.conteudo}>
          {icone && (
            <Ionicons
              name={icone}
              size={tamanho === "grande" ? 24 : 20}
              color={cor.texto}
            />
          )}

          <Text
            style={[
              styles.texto,
              tamanho === "grande" && styles.textoGrande,
              { color: cor.texto },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {titulo}
          </Text>
        </View>
      )}
    </Pressable>
  );
}


const styles = StyleSheet.create({
  botao: {
    minHeight: ALVO_TOQUE,
    borderRadius: raio.md,
    borderWidth: 1.5,
    paddingHorizontal: espaco.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  grande: {
    minHeight: 56,
    borderRadius: raio.lg,
  },

  conteudo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaco.sm,
  },

  texto: {
    ...tipografia.corpoForte,
    flexShrink: 1,
  },

  textoGrande: {
    fontSize: 17,
  },

  pressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  desabilitado: {
    opacity: 0.45,
  },
});
