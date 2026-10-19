import {
  Pressable,
  Text,
  View,
} from "react-native";

import { FAIXA_CLASSE } from "../../constants/risco";

import { AnaliseState } from "../../hooks/useAnalise";

import { cores } from "../../theme";

import { ClasseRisco } from "../../types/Ocorrencia";

import Botao from "../ui/Botao";
import Card from "../ui/Card";

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
    <View style={styles.secao}>
      <Card estilo={styles.cardManual}>
        {resultado?.manual ? (
          <Botao
            titulo="Trocar classificação manual"
            icone="refresh"
            variante="secundario"
            onPress={trocarClassificacaoManual}
          />
        ) : (
          <>
            <Text style={styles.manualTitulo}>
              Sem a IA? Classifique manualmente
            </Text>

            <Text style={styles.manualAjuda}>
              Se a API estiver fora do ar ou sem internet, escolha a faixa
              de altura da vegetação observada no local. A foto passa a ser
              opcional.
            </Text>

            <View style={styles.botoesManual}>
              {OPCOES.map((opcao) => {
                const cor = cores.risco[opcao.classe];

                return (
                  <Pressable
                    key={opcao.classe}
                    accessibilityRole="button"
                    accessibilityLabel={`Classificar como ${opcao.nome}, ${FAIXA_CLASSE[opcao.classe]}`}
                    onPress={() => classificarManualmente(opcao.classe)}
                    style={({ pressed }) => [
                      styles.botaoManual,
                      { backgroundColor: cor.cor },
                      pressed && styles.pressionado,
                    ]}
                  >
                    <Text style={[styles.botaoManualTexto, { color: cor.sobre }]}>
                      {opcao.nome}
                    </Text>

                    <Text style={[styles.botaoManualFaixa, { color: cor.sobre }]}>
                      {FAIXA_CLASSE[opcao.classe]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </Card>
    </View>
  );
}
