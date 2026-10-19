import {
  Text,
  TextInput,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { extraStyles } from "./extraStyles";
import { styles } from "./styles";


type Props = {
  analise: AnaliseState;
};


// ============================================================
// 5. DETALHES DO REGISTRO
// ============================================================

export default function SecaoRegistro({ analise }: Props) {
  const {
    local,
    setLocal,
    descricao,
    setDescricao,
    equipe,
    setEquipe,
    veiculo,
    setVeiculo,
  } = analise;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        5. Detalhes do registro
      </Text>

      <View style={[styles.card, styles.formCard]}>
        <Text style={styles.inputLabel}>
          Local
        </Text>

        <TextInput
          style={styles.input}
          value={local}
          onChangeText={setLocal}
          placeholder="Ex.: Acostamento sentido capital"
          placeholderTextColor="#9AA39C"
        />

        <Text style={[styles.inputLabel, styles.secondInputLabel]}>
          Descrição
        </Text>

        <TextInput
          style={[styles.input, extraStyles.multilineInput]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex.: Capim alto cobrindo a placa de velocidade"
          placeholderTextColor="#9AA39C"
          multiline
        />

        <Text style={[styles.inputLabel, styles.secondInputLabel]}>
          Equipe
        </Text>

        <TextInput
          style={styles.input}
          value={equipe}
          onChangeText={setEquipe}
          placeholder="Ex.: Equipe Campinas 02"
          placeholderTextColor="#9AA39C"
        />

        <Text style={[styles.inputLabel, styles.secondInputLabel]}>
          Veículo (placa)
        </Text>

        <TextInput
          style={styles.input}
          value={veiculo}
          onChangeText={setVeiculo}
          placeholder="Ex.: ABC1D23"
          placeholderTextColor="#9AA39C"
          autoCapitalize="characters"
          autoCorrect={false}
        />

      </View>
    </View>
  );
}
