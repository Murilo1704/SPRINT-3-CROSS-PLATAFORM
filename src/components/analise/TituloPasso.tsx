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
  tipografia,
} from "../../theme";


type Props = {
  numero: number;
  titulo: string;
  concluido?: boolean;
  opcional?: boolean;
};


// ============================================================
// TÍTULO NUMERADO DE CADA PASSO DA NOVA ANÁLISE
// ============================================================

export default function TituloPasso({
  numero,
  titulo,
  concluido = false,
  opcional = false,
}: Props) {
  return (
    <View
      style={styles.linha}
      accessible
      accessibilityRole="header"
      accessibilityLabel={`Passo ${numero}: ${titulo}${concluido ? ", concluído" : ""}${opcional ? ", opcional" : ""}`}
    >
      <View
        style={[
          styles.circulo,
          concluido && styles.circuloConcluido,
        ]}
      >
        {concluido ? (
          <Ionicons
            name="checkmark"
            size={18}
            color={cores.sobrePrimaria}
          />
        ) : (
          <Text style={styles.numero}>{numero}</Text>
        )}
      </View>

      <Text style={styles.titulo}>{titulo}</Text>

      {opcional && (
        <View style={styles.etiqueta}>
          <Text style={styles.etiquetaTexto}>Opcional</Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm + 2,
    marginBottom: espaco.md,
  },

  circulo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: cores.primaria,
    backgroundColor: cores.superficie,
    alignItems: "center",
    justifyContent: "center",
  },

  circuloConcluido: {
    backgroundColor: cores.primaria,
  },

  numero: {
    ...tipografia.corpoForte,
    color: cores.primaria,
  },

  titulo: {
    ...tipografia.secao,
    color: cores.texto,
    flexShrink: 1,
  },

  etiqueta: {
    backgroundColor: cores.superficieSuave,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.pilula,
    paddingHorizontal: espaco.sm,
    paddingVertical: 2,
  },

  etiquetaTexto: {
    ...tipografia.pequeno,
    fontWeight: "600",
    color: cores.textoSecundario,
  },
});
