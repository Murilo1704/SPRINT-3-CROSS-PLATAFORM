import { Ionicons } from "@expo/vector-icons";

import {
  Text,
  View,
} from "react-native";

import { FAIXA_CLASSE } from "../../constants/risco";

import { AnaliseState } from "../../hooks/useAnalise";

import { cores } from "../../theme";

import BadgeRisco from "../ui/BadgeRisco";
import Card from "../ui/Card";
import Carregando from "../ui/Carregando";

import { styles } from "./styles";
import TituloPasso from "./TituloPasso";


type Props = {
  analise: AnaliseState;
};


const REGRAS = [
  { classe: "NORMAL", nome: "Normal" },
  { classe: "ATENCAO", nome: "Atenção" },
  { classe: "CRITICO", nome: "Crítico" },
] as const;


// ============================================================
// 4. CLASSIFICAÇÃO
// ============================================================

export default function SecaoClassificacao({ analise }: Props) {
  const {
    analisando,
    resultado,
    podeSalvar,
  } = analise;

  return (
    <View style={styles.secao}>
      <TituloPasso
        numero={4}
        titulo="Classificação"
        concluido={podeSalvar}
      />

      <Card>
        {analisando ? (
          <Carregando texto={"Analisando imagem...\nIsso pode levar alguns segundos."} />
        ) : resultado ? (
          <View style={styles.resultadoCentro}>
            <Text style={styles.resultadoRotulo}>
              Resultado
            </Text>

            <BadgeRisco
              classe={resultado.classe}
              tamanho="grande"
            />

            {resultado.manual ? (
              <Text style={styles.confianca}>
                Classificado manualmente pelo operador (sem IA)
              </Text>
            ) : (
              resultado.classe !== "INCONCLUSIVO" && (
                <>
                  <Text style={styles.confianca}>
                    Confiança da decisão:{" "}
                    {resultado.confiancaPercentual.toFixed(2)}%
                  </Text>

                  <Text style={styles.nivelConfianca}>
                    Nível de confiança: {resultado.nivelConfianca}
                  </Text>
                </>
              )
            )}

            {resultado.revisaoRecomendada && (
              <View
                style={styles.caixaRevisao}
                accessibilityRole="alert"
              >
                <Ionicons
                  name="warning"
                  size={22}
                  color={cores.aviso}
                />

                <View style={styles.colunaFlex}>
                  <Text style={styles.caixaRevisaoTitulo}>
                    Revisão recomendada
                  </Text>

                  <Text style={styles.caixaRevisaoTexto}>
                    {resultado.motivoRevisao ??
                      "O resultado deve ser conferido pelo operador."}
                  </Text>
                </View>
              </View>
            )}

            {/* Detalhes técnicos da segmentação e do classificador
                ficam somente na API e não são exibidos ao operador. */}
          </View>
        ) : (
          <>
            <Text style={styles.cardTitulo}>
              Aguardando análise
            </Text>

            <Text style={styles.cardTexto}>
              A IA classificará a vegetação como Normal, Atenção ou Crítico.
            </Text>

            <View style={styles.regras}>
              {REGRAS.map((regra) => (
                <View
                  key={regra.classe}
                  style={styles.regraLinha}
                >
                  <View
                    style={[
                      styles.regraPonto,
                      { backgroundColor: cores.risco[regra.classe].cor },
                    ]}
                  />

                  <Text style={styles.regraTexto}>
                    {regra.nome}: {FAIXA_CLASSE[regra.classe]}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </Card>
    </View>
  );
}
