import { router } from "expo-router";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { styles } from "./styles";


type Props = {
  analise: AnaliseState;
};


export default function AnaliseHeader(_props: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>
          ‹ Voltar
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Nova análise
      </Text>

      <Text style={styles.subtitle}>
        Registre uma nova ocorrência de vegetação
      </Text>
    </View>
  );
}
