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
    <View style={styles.secao}>
      <TituloPasso
        numero={5}
        titulo="Detalhes do registro"
        opcional
        concluido={local.trim().length > 0 || descricao.trim().length > 0}
      />

      <Card>
        <Campo
          rotulo="Local"
          icone="location-outline"
          value={local}
          onChangeText={setLocal}
          placeholder="Ex.: Acostamento sentido capital"
        />

        <Campo
          rotulo="Descrição"
          icone="document-text-outline"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex.: Capim alto cobrindo a placa de velocidade"
          multiline
        />

        <View style={styles.linha}>
          <Campo
            rotulo="Equipe"
            icone="people-outline"
            value={equipe}
            onChangeText={setEquipe}
            placeholder="Ex.: Equipe 03"
            estiloContainer={styles.colunaFlex}
          />

          <Campo
            rotulo="Veículo (placa)"
            icone="car-outline"
            value={veiculo}
            onChangeText={setVeiculo}
            placeholder="ABC1D23"
            autoCapitalize="characters"
            autoCorrect={false}
            estiloContainer={styles.colunaFlex}
          />
        </View>
      </Card>
    </View>
  );
}
