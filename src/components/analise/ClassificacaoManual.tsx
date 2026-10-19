import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  COR_CLASSE,
  FAIXA_CLASSE,
} from "../../constants/risco";

import { AnaliseState } from "../../hooks/useAnalise";

import { ClasseRisco } from "../../types/Ocorrencia";

import { extraStyles } from "./extraStyles";
import { styles } from "./styles";


type Props = {
  analise: AnaliseState;
};


const OPCOES: { classe: ClasseRisco; nome: string }[] = [
  { classe: "NORMAL", nome: "Normal" },
  { classe: "ATENCAO", nome: "Atenção" },
  { classe: "CRITICO", nome: "Crítico" },
];


// ============================================================
// CLASSIFICAÇÃO MANUAL (quando a IA não está disponível)
// ============================================================

export default function ClassificacaoManual({ analise }: Props) {
  const {
    analisando,
    resultado,
    classificarManualmente,
    trocarClassificacaoManual,
  } = analise;

  const temResultadoDaIA =
    resultado !== null &&
    !resultado.manual &&
    resultado.classe !== "INCONCLUSIVO";

  if (analisando || temResultadoDaIA) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={extraStyles.manualCard}>
        {resultado?.manual ? (
          <TouchableOpacity
            style={extraStyles.changeButton}
            onPress={trocarClassificacaoManual}
          >
            <Text style={extraStyles.changeButtonText}>
              Trocar classificação manual
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={extraStyles.manualTitle}>
              Sem a IA? Classifique manualmente
            </Text>

            <Text style={extraStyles.manualHelp}>
              Se a API estiver fora do ar ou sem internet, escolha
              a faixa de altura da vegetação observada no local.
              A foto passa a ser opcional.
            </Text>

            <View style={extraStyles.manualButtons}>
              {OPCOES.map((opcao) => (
                <TouchableOpacity
                  key={opcao.classe}
                  style={[
                    extraStyles.manualButton,
                    { backgroundColor: COR_CLASSE[opcao.classe] },
                  ]}
                  onPress={() =>
                    classificarManualmente(opcao.classe)
                  }
                >
                  <Text style={extraStyles.manualButtonText}>
                    {opcao.nome}
                  </Text>

                  <Text style={extraStyles.manualButtonRange}>
                    {FAIXA_CLASSE[opcao.classe]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
}
