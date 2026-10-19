import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  cores,
  espaco,
  tipografia,
} from "../../theme";


type Props = {
  texto?: string;
  // true = ocupa a tela inteira (ex.: verificando login)
  telaCheia?: boolean;
};


// ============================================================
// CARREGANDO
// ============================================================

export default function Carregando({
  texto,
  telaCheia = false,
}: Props) {
  return (
    <View
      style={[styles.container, telaCheia && styles.telaCheia]}
      accessibilityRole="progressbar"
      accessibilityLabel={texto ?? "Carregando"}
    >
      <ActivityIndicator
        size="large"
        color={cores.primaria}
      />

      {texto && <Text style={styles.texto}>{texto}</Text>}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: espaco.xxl,
    gap: espaco.md,
  },

  telaCheia: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  texto: {
    ...tipografia.corpoForte,
    color: cores.textoSecundario,
    textAlign: "center",
  },
});
