import { router } from "expo-router";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AnaliseState } from "../../hooks/useAnalise";

import {
  cores,
  espaco,
  raio,
  tipografia,
} from "../../theme";

import Cabecalho from "../ui/Cabecalho";


type Props = {
  analise: AnaliseState;
};


// ============================================================
// CABEÇALHO + INDICADOR DE PROGRESSO
// ============================================================

export default function AnaliseHeader({ analise }: Props) {
  const { etapas } = analise;

  const concluidas =
    etapas.filter((etapa) => etapa.concluida).length;

  return (
    <Cabecalho
      titulo="Nova análise"
      subtitulo="Registre uma nova ocorrência de vegetação"
      rotuloVoltar="Voltar"
      onVoltar={() =>
        router.canGoBack() ? router.back() : router.replace("/")
      }
    >
      <View
        style={styles.progresso}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`${concluidas} de ${etapas.length} etapas concluídas`}
        accessibilityValue={{
          min: 0,
          max: etapas.length,
          now: concluidas,
        }}
      >
        <Text style={styles.progressoTexto}>
          {concluidas} de {etapas.length} etapas
        </Text>

        <View style={styles.segmentos}>
          {etapas.map((etapa, indice) => (
            <View
              key={etapa.nome}
              style={styles.segmento}
            >
              <View
                style={[
                  styles.barra,
                  etapa.concluida && styles.barraConcluida,
                ]}
              />

              <Text
                style={[
                  styles.rotulo,
                  etapa.concluida && styles.rotuloConcluido,
                ]}
                numberOfLines={1}
              >
                {indice + 1}. {etapa.nome}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Cabecalho>
  );
}


const styles = StyleSheet.create({
  progresso: {
    marginTop: espaco.lg,
  },

  progressoTexto: {
    ...tipografia.rotulo,
    color: cores.textoSobreEscuro,
    marginBottom: espaco.sm,
  },

  segmentos: {
    flexDirection: "row",
    gap: espaco.xs + 2,
  },

  segmento: {
    flex: 1,
  },

  barra: {
    height: 6,
    borderRadius: raio.pilula,
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  barraConcluida: {
    backgroundColor: cores.destaque,
  },

  rotulo: {
    fontSize: 11,
    fontWeight: "600",
    color: cores.textoSobreEscuroSuave,
    marginTop: espaco.xs,
  },

  rotuloConcluido: {
    color: cores.textoSobreEscuro,
  },
});
