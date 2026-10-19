import { Ionicons } from "@expo/vector-icons";

import {
  Text,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import { cores } from "../../theme";

import Botao from "../ui/Botao";

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
    <View style={styles.acoes}>

      {/* ANALISAR */}

      {!resultado && (
        <>
          <Botao
            titulo="Analisar ocorrência"
            icone="scan-outline"
            tamanho="grande"
            carregando={analisando}
            desabilitado={!podeAnalisar}
            onPress={analisarOcorrencia}
          />

          {!podeAnalisar && !analisando && (
            <View style={styles.dicaAnalise}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={cores.textoSecundario}
              />

              <Text style={[styles.textoPequeno, styles.colunaFlex]}>
                Para usar a IA: foto + rodovia + KM. Sem foto, use a
                classificação manual.
              </Text>
            </View>
          )}
        </>
      )}

      {/* SALVAR (classificação da IA ou manual) */}

      {podeSalvar && (
        <Botao
          titulo="Salvar ocorrência"
          icone="save-outline"
          tamanho="grande"
          carregando={salvando}
          onPress={salvarOcorrencia}
        />
      )}

      {/* REFAZER */}

      {resultado?.classe === "INCONCLUSIVO" && (
        <Botao
          titulo="Tentar outra análise"
          icone="refresh"
          variante="secundario"
          onPress={() => setResultado(null)}
        />
      )}
    </View>
  );
}
