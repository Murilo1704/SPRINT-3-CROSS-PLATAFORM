import { Ionicons } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  cores,
  espaco,
  raio,
} from "../../theme";

import { ClasseAnalise } from "../../types/Analise";

import { NomeIcone } from "./Botao";


type Props = {
  classe: ClasseAnalise;
  tamanho?: "normal" | "grande";
};


const NOMES: Record<ClasseAnalise, string> = {
  NORMAL: "NORMAL",
  ATENCAO: "ATENÇÃO",
  CRITICO: "CRÍTICO",
  INCONCLUSIVO: "INCONCLUSIVO",
};

// Ícone além da cor: quem não distingue cores também lê o risco.
const ICONES: Record<ClasseAnalise, NomeIcone> = {
  NORMAL: "checkmark-circle",
  ATENCAO: "warning",
  CRITICO: "alert-circle",
  INCONCLUSIVO: "help-circle",
};


// ============================================================
// BADGE DE RISCO
// Cor sólida da classe + texto com contraste adequado.
// ============================================================

export default function BadgeRisco({
  classe,
  tamanho = "normal",
}: Props) {
  const cor = cores.risco[classe];
  const grande = tamanho === "grande";

  return (
    <View
      accessible
      accessibilityLabel={`Risco ${NOMES[classe]}`}
      style={[
        styles.badge,
        grande && styles.badgeGrande,
        { backgroundColor: cor.cor },
      ]}
    >
      <Ionicons
        name={ICONES[classe]}
        size={grande ? 22 : 16}
        color={cor.sobre}
      />

      <Text
        style={[
          styles.texto,
          grande && styles.textoGrande,
          { color: cor.sobre },
        ]}
      >
        {NOMES[classe]}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: espaco.xs,
    paddingHorizontal: espaco.md - 2,
    paddingVertical: espaco.xs + 2,
    borderRadius: raio.pilula,
  },

  badgeGrande: {
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.sm + 2,
    gap: espaco.sm,
  },

  texto: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  textoGrande: {
    fontSize: 18,
    letterSpacing: 0.6,
  },
});
