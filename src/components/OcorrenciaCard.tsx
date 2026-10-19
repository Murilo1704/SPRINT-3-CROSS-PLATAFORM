import { Ionicons } from "@expo/vector-icons";

import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  NOME_CLASSE,
  NOME_RISCO,
  riscoPorClasse,
} from "../constants/risco";

import {
  cores,
  espaco,
  raio,
  tipografia,
} from "../theme";

import { Ocorrencia } from "../types/Ocorrencia";

import BadgeRisco from "./ui/BadgeRisco";
import Card from "./ui/Card";


type Props = {
  ocorrencia: Ocorrencia;
  onPress?: () => void;
};


function formatarDataHora(dataIso: string) {
  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return dataIso;
  }

  const dia = data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dia} · ${hora}`;
}


// "Risco Alto · IA 91%" ou "Risco Médio · manual" (+ "· concluída")
function textoRisco(ocorrencia: Ocorrencia) {
  const risco =
    NOME_RISCO[ocorrencia.risco ?? riscoPorClasse(ocorrencia.classe)];

  const origem =
    ocorrencia.origemClassificacao === "MANUAL"
      ? "manual"
      : `IA ${(ocorrencia.confianca * 100).toFixed(0)}%`;

  const concluida =
    ocorrencia.status === "CONCLUIDO" ? " · concluída" : "";

  return `Risco ${risco} · ${origem}${concluida}`;
}


// ============================================================
// CARD DE OCORRÊNCIA (lista "Ocorrências Detalhadas")
// ============================================================

export default function OcorrenciaCard({
  ocorrencia,
  onPress,
}: Props) {
  const corRisco = cores.risco[ocorrencia.classe];
  const concluida = ocorrencia.status === "CONCLUIDO";
  const manual = ocorrencia.origemClassificacao === "MANUAL";

  return (
    <Card
      corFaixa={corRisco.cor}
      onPress={onPress}
      accessibilityLabel={`${ocorrencia.rodovia}, KM ${ocorrencia.km.toFixed(1)}, risco ${NOME_CLASSE[ocorrencia.classe]}. Abrir detalhe.`}
      estilo={styles.card}
    >
      <View style={styles.topo}>
        <BadgeRisco classe={ocorrencia.classe} />

        <Text style={styles.data}>
          {formatarDataHora(ocorrencia.data)}
        </Text>
      </View>

      <View style={styles.meio}>
        <View style={styles.textos}>
          <Text style={styles.rodovia}>
            {ocorrencia.rodovia}
          </Text>

          <Text
            style={styles.km}
            numberOfLines={2}
          >
            KM {ocorrencia.km.toFixed(1)}
            {ocorrencia.local ? ` · ${ocorrencia.local}` : ""}
          </Text>

          {ocorrencia.descricao && (
            <Text
              style={styles.descricao}
              numberOfLines={1}
            >
              {ocorrencia.descricao}
            </Text>
          )}
        </View>

        {ocorrencia.imagem && (
          <Image
            source={{ uri: ocorrencia.imagem }}
            style={styles.miniatura}
            accessibilityIgnoresInvertColors
          />
        )}
      </View>

      <View style={styles.rodape}>
        <Ionicons
          name={
            concluida
              ? "checkmark-done"
              : manual
                ? "hand-left-outline"
                : "sparkles"
          }
          size={16}
          color={concluida ? cores.sucesso : cores.textoSecundario}
        />

        <Text
          style={[
            styles.risco,
            concluida && { color: cores.sucesso },
          ]}
          numberOfLines={1}
        >
          {textoRisco(ocorrencia)}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={cores.textoSuave}
        />
      </View>
    </Card>
  );
}


const styles = StyleSheet.create({
  card: {
    marginBottom: espaco.md,
  },

  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espaco.sm,
  },

  data: {
    ...tipografia.pequeno,
    color: cores.textoSuave,
  },

  meio: {
    flexDirection: "row",
    gap: espaco.md,
    marginTop: espaco.md,
  },

  textos: {
    flex: 1,
  },

  rodovia: {
    ...tipografia.titulo,
    color: cores.texto,
  },

  km: {
    ...tipografia.corpoForte,
    color: cores.textoSecundario,
    marginTop: 2,
  },

  descricao: {
    ...tipografia.pequeno,
    color: cores.textoSuave,
    marginTop: espaco.xs,
  },

  miniatura: {
    width: 68,
    height: 68,
    borderRadius: raio.md,
    backgroundColor: cores.superficieSuave,
  },

  rodape: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.xs + 2,
    marginTop: espaco.md,
    paddingTop: espaco.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: cores.borda,
  },

  risco: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
    flex: 1,
  },
});
