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
  sombra,
  tipografia,
} from "../../theme";

import Botao, { NomeIcone } from "./Botao";


type Props = {
  icone: NomeIcone;
  titulo: string;
  texto?: string;
  acao?: {
    titulo: string;
    icone?: NomeIcone;
    onPress: () => void;
  };
};


// ============================================================
// ESTADO VAZIO
// Ícone + explicação + (opcional) chamada para ação.
// ============================================================

export default function EstadoVazio({
  icone,
  titulo,
  texto,
  acao,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.circuloIcone}>
        <Ionicons
          name={icone}
          size={36}
          color={cores.primaria}
        />
      </View>

      <Text style={styles.titulo}>{titulo}</Text>

      {texto && <Text style={styles.texto}>{texto}</Text>}

      {acao && (
        <Botao
          titulo={acao.titulo}
          icone={acao.icone}
          onPress={acao.onPress}
          estilo={styles.botao}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    paddingVertical: espaco.xxxl,
    paddingHorizontal: espaco.xxl,
    ...sombra.card,
  },

  circuloIcone: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: cores.primariaClara,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espaco.lg,
  },

  titulo: {
    ...tipografia.secao,
    color: cores.texto,
    textAlign: "center",
  },

  texto: {
    ...tipografia.corpo,
    color: cores.textoSecundario,
    textAlign: "center",
    marginTop: espaco.sm,
  },

  botao: {
    marginTop: espaco.xl,
    alignSelf: "stretch",
  },
});
