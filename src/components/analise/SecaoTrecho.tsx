import {
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import Campo from "../ui/Campo";
import Card from "../ui/Card";

import { styles } from "./styles";
import TituloPasso from "./TituloPasso";


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
    kmValido,
    alterarRodovia,
    alterarKm,
  } = analise;

  return (
    <View style={styles.secao}>
      <TituloPasso
        numero={2}
        titulo="Trecho da rodovia"
        concluido={rodovia.trim().length > 0 && kmValido}
      />

      <Card>
        <View style={styles.linha}>
          <Campo
            rotulo="Rodovia"
            obrigatorio
            icone="trail-sign-outline"
            value={rodovia}
            onChangeText={alterarRodovia}
            placeholder="Ex.: SP-330"
            autoCapitalize="characters"
            autoCorrect={false}
            estiloContainer={styles.colunaFlex}
          />

          <Campo
            rotulo="KM"
            obrigatorio
            icone="speedometer-outline"
            value={km}
            onChangeText={alterarKm}
            placeholder="Ex.: 100"
            keyboardType="decimal-pad"
            erro={km.trim() && !kmValido ? "KM inválido" : null}
            estiloContainer={styles.colunaFlex}
          />
        </View>
      </Card>
    </View>
  );
}
