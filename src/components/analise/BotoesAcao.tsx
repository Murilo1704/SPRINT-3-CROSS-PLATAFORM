import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { styles } from "./styles";


type Props = {
  analise: AnaliseState;
};


// ============================================================
// ANALISAR / SALVAR / REFAZER
// ============================================================

export default function BotoesAcao({ analise }: Props) {
  const {
    resultado,
    setResultado,
    analisando,
    podeAnalisar,
    analisarOcorrencia,
    salvando,
    podeSalvar,
    salvarOcorrencia,
  } = analise;

  return (
    <>
      {/* ANALISAR */}

      {!resultado && (
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            !podeAnalisar && styles.disabledButton,
          ]}
          disabled={!podeAnalisar}
          onPress={analisarOcorrencia}
        >
          {analisando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.analyzeButtonText}>
              Analisar ocorrência
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* SALVAR (classificação da IA ou manual) */}

      {podeSalvar && (
        <TouchableOpacity
          style={styles.saveButton}
          disabled={salvando}
          onPress={salvarOcorrencia}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>
              Salvar ocorrência
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* REFAZER */}

      {resultado?.classe === "INCONCLUSIVO" && (
        <TouchableOpacity
          style={styles.secondaryBottomButton}
          onPress={() => setResultado(null)}
        >
          <Text style={styles.secondaryBottomButtonText}>
            Tentar outra análise
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}
