import {
  ReactNode,
} from "react";

import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import {
  cores,
  espaco,
  raio,
  sombra,
} from "../../theme";


type Props = {
  children: ReactNode;
  // Cor da faixa à esquerda (ex.: cor do risco)
  corFaixa?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  estilo?: StyleProp<ViewStyle>;
};


// ============================================================
// CARD
// Superfície branca com sombra leve. Com onPress vira tocável.
// ============================================================

export default function Card({
  children,
  corFaixa,
  onPress,
  accessibilityLabel,
  estilo,
}: Props) {
  const estiloBase = [
    styles.card,
    corFaixa ? { borderLeftWidth: 6, borderLeftColor: corFaixa } : null,
    estilo,
  ];

  if (!onPress) {
    return <View style={estiloBase}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        estiloBase,
        pressed && styles.pressionado,
      ]}
    >
      {children}
    </Pressable>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    padding: espaco.lg,
    ...sombra.card,
  },

  pressionado: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
});
