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
} from "../theme";


// No navegador o react-native-maps não funciona:
// mostramos só um aviso (a legenda fica na Home).
export default function MonitoramentoMap() {
  return (
    <View style={styles.container}>
      <Ionicons
        name="map-outline"
        size={40}
        color={cores.primaria}
      />

      <Text style={styles.titulo}>
        Mapa VerdeScan
      </Text>

      <Text style={styles.descricao}>
        O mapa interativo com os pontos das análises está disponível
        no aplicativo mobile.
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    height: 240,
    borderRadius: raio.lg,
    backgroundColor: cores.primariaClara,
    alignItems: "center",
    justifyContent: "center",
    padding: espaco.xxl,
    gap: espaco.sm,
  },

  titulo: {
    ...tipografia.secao,
    color: cores.primariaEscura,
  },

  descricao: {
    ...tipografia.corpo,
    color: cores.textoSecundario,
    textAlign: "center",
    maxWidth: 420,
  },
});
