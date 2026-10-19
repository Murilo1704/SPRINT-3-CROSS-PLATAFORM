import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { styles } from "./styles";


type Props = {
  analise: AnaliseState;
};


// ============================================================
// 4. CLASSIFICAÇÃO
// ============================================================

export default function SecaoClassificacao({ analise }: Props) {
  const {
    analisando,
    resultado,
  } = analise;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        4. Classificação
      </Text>

      <View style={styles.card}>
        {analisando ? (
          <>
            <ActivityIndicator
              size="large"
              color="#21894A"
            />

            <Text style={styles.cardTitle}>
              Analisando imagem...
            </Text>
          </>
        ) : resultado ? (
          <>
            <Text style={styles.resultLabel}>
              Resultado
            </Text>

            <View
              style={[
                styles.resultBadge,
                resultado.classe === "CRITICO"
                  ? styles.resultCritical
                  : resultado.classe === "ATENCAO"
                    ? styles.resultAttention
                    : resultado.classe === "NORMAL"
                      ? styles.resultNormal
                      : styles.resultInconclusive,
              ]}
            >
              <Text style={styles.resultBadgeText}>
                {resultado.classe === "CRITICO"
                  ? "CRÍTICO"
                  : resultado.classe === "ATENCAO"
                    ? "ATENÇÃO"
                    : resultado.classe}
              </Text>
            </View>

            {resultado.manual ? (
              <Text style={styles.confidence}>
                Classificado manualmente pelo operador (sem IA)
              </Text>
            ) : (
              resultado.classe !== "INCONCLUSIVO" && (
                <>
                  <Text style={styles.confidence}>
                    Confiança da decisão:{" "}
                    {resultado.confiancaPercentual.toFixed(2)}%
                  </Text>

                  <Text style={styles.confidenceLevel}>
                    Nível de confiança: {resultado.nivelConfianca}
                  </Text>
                </>
              )
            )}

            {resultado.revisaoRecomendada && (
              <View style={styles.reviewBox}>
                <Text style={styles.reviewTitle}>
                  ⚠ Revisão recomendada
                </Text>

                <Text style={styles.reviewText}>
                  {resultado.motivoRevisao ??
                    "O resultado deve ser conferido pelo operador."}
                </Text>
              </View>
            )}

            {/* Detalhes técnicos da segmentação e do classificador
                ficam somente na API e não são exibidos ao operador. */}
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>
              Aguardando análise
            </Text>

            <Text style={styles.cardText}>
              A IA classificará a vegetação como Normal,
              Atenção ou Crítico.
            </Text>

            <Text style={styles.rules}>
              Normal: até 10 cm{"\n"}
              Atenção: 10 a 30 cm{"\n"}
              Crítico: acima de 30 cm
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
