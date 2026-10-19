import {
  Text,
  TextInput,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { styles } from "./styles";


type Props = {
  analise: AnaliseState;
};


// ============================================================
// 2. TRECHO
// ============================================================

export default function SecaoTrecho({ analise }: Props) {
  const {
    rodovia,
    km,
    alterarRodovia,
    alterarKm,
  } = analise;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        2. Trecho da rodovia
      </Text>

      <View style={[styles.card, styles.formCard]}>
        <Text style={styles.inputLabel}>
          Rodovia *
        </Text>

        <TextInput
          style={styles.input}
          value={rodovia}
          onChangeText={alterarRodovia}
          placeholder="Ex.: SP-330"
          placeholderTextColor="#9AA39C"
          autoCapitalize="characters"
        />

        <Text style={[styles.inputLabel, styles.secondInputLabel]}>
          KM *
        </Text>

        <TextInput
          style={styles.input}
          value={km}
          onChangeText={alterarKm}
          placeholder="Ex.: 100"
          placeholderTextColor="#9AA39C"
          keyboardType="decimal-pad"
        />
      </View>
    </View>
  );
}
