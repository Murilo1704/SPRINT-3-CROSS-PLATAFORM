import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import OcorrenciaCard from "../components/OcorrenciaCard";
import Cabecalho from "../components/ui/Cabecalho";
import Card from "../components/ui/Card";
import Carregando from "../components/ui/Carregando";
import EstadoVazio from "../components/ui/EstadoVazio";

import { carregarOcorrencias } from "../services/storage";

import {
  cores,
  espaco,
  tipografia,
} from "../theme";

import { Ocorrencia } from "../types/Ocorrencia";


type ResumoRodovia = {
  rodovia: string;
  ocorrencias: Ocorrencia[];
  total: number;
  criticos: number;
  atencao: number;
  normais: number;
  pendentes: number;
  kmInicial: number;
  kmFinal: number;
};


export default function RodoviasScreen() {
  const insets = useSafeAreaInsets();

  const [ocorrencias, setOcorrencias] =
    useState<Ocorrencia[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarOcorrencias()
        .then(setOcorrencias)
        .finally(() => setCarregando(false));
    }, [])
  );


  // =========================================================
  // AGRUPAR POR RODOVIA (mais críticos primeiro)
  // =========================================================

  const rodovias = useMemo(() => {
    const mapa = new Map<string, Ocorrencia[]>();

    ocorrencias.forEach((ocorrencia) => {
      const nome =
        ocorrencia.rodovia?.trim().toUpperCase() ||
        "RODOVIA NÃO INFORMADA";

      mapa.set(nome, [...(mapa.get(nome) ?? []), ocorrencia]);
    });

    const resultado: ResumoRodovia[] =
      Array.from(mapa.entries()).map(([rodovia, lista]) => {
        const kms = lista.map((item) => Number(item.km));

        return {
          rodovia,
          ocorrencias: [...lista].sort(
            (a, b) =>
              new Date(b.data).getTime() - new Date(a.data).getTime()
          ),
          total: lista.length,
          criticos: lista.filter((item) => item.classe === "CRITICO").length,
          atencao: lista.filter((item) => item.classe === "ATENCAO").length,
          normais: lista.filter((item) => item.classe === "NORMAL").length,
          pendentes: lista.filter((item) => item.status !== "CONCLUIDO").length,
          kmInicial: Math.min(...kms),
          kmFinal: Math.max(...kms),
        };
      });

    return resultado.sort((a, b) => {
      if (b.criticos !== a.criticos) {
        return b.criticos - a.criticos;
      }

      if (b.atencao !== a.atencao) {
        return b.atencao - a.atencao;
      }

      return b.total - a.total;
    });
  }, [ocorrencias]);

  const totalCriticos = ocorrencias.filter(
    (item) => item.classe === "CRITICO"
  ).length;

  const totalPendentes = ocorrencias.filter(
    (item) => item.status !== "CONCLUIDO"
  ).length;


  function abrirOcorrencia(id: string) {
    router.push({
      pathname: "/trecho-detalhes",
      params: { id },
    });
  }

  function abrirRodovia(rodovia: string) {
    router.push({
      pathname: "/trecho-detalhes",
      params: { rodovia },
    });
  }


  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={{
        paddingBottom: insets.bottom + espaco.xxxl,
      }}
    >
      <Cabecalho
        titulo="Trechos monitorados"
        subtitulo="Rodovias e ocorrências registradas no VerdeScan"
        rotuloVoltar="Início"
        onVoltar={() => router.replace("/")}
      />

      <View style={styles.corpo}>
        {carregando ? (
          <Carregando texto="Carregando ocorrências..." />
        ) : rodovias.length === 0 ? (
          <View style={styles.vazio}>
            <EstadoVazio
              icone="trail-sign-outline"
              titulo="Nenhuma rodovia cadastrada"
              texto="Faça uma nova análise para adicionar um trecho ao monitoramento."
              acao={{
                titulo: "+ Nova análise",
                icone: "camera",
                onPress: () => router.push("/analise"),
              }}
            />
          </View>
        ) : (
          <>
            {/* RESUMO */}

            <View style={styles.linhaResumo}>
              <Resumo
                valor={rodovias.length}
                rotulo="Rodovias"
                cor={cores.primaria}
              />
              <Resumo
                valor={totalCriticos}
                rotulo="Críticos"
                cor={cores.risco.CRITICO.texto}
              />
              <Resumo
                valor={totalPendentes}
                rotulo="Abertos"
                cor={cores.risco.ATENCAO.texto}
              />
            </View>


            {/* RODOVIAS */}

            <Text
              style={styles.tituloSecao}
              accessibilityRole="header"
            >
              Rodovias
            </Text>

            {rodovias.map((item) => (
              <Card
                key={item.rodovia}
                onPress={() => abrirRodovia(item.rodovia)}
                accessibilityLabel={`${item.rodovia}, ${item.total} pontos, ${item.criticos} críticos. Ver histórico.`}
                corFaixa={
                  item.criticos > 0
                    ? cores.risco.CRITICO.cor
                    : item.atencao > 0
                      ? cores.risco.ATENCAO.cor
                      : cores.risco.NORMAL.cor
                }
                estilo={styles.cardRodovia}
              >
                <View style={styles.cardTopo}>
                  <View style={styles.flex}>
                    <Text style={styles.nomeRodovia}>
                      {item.rodovia}
                    </Text>

                    <Text style={styles.faixaKm}>
                      {item.kmInicial === item.kmFinal
                        ? `KM ${item.kmInicial}`
                        : `KM ${item.kmInicial} até KM ${item.kmFinal}`}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={cores.textoSuave}
                  />
                </View>

                <View style={styles.contadores}>
                  <Contador valor={item.total} rotulo="Pontos" cor={cores.texto} />
                  <Contador valor={item.criticos} rotulo="Críticos" cor={cores.risco.CRITICO.texto} ponto={cores.risco.CRITICO.cor} />
                  <Contador valor={item.atencao} rotulo="Atenção" cor={cores.risco.ATENCAO.texto} ponto={cores.risco.ATENCAO.cor} />
                  <Contador valor={item.normais} rotulo="Normal" cor={cores.risco.NORMAL.texto} ponto={cores.risco.NORMAL.cor} />
                </View>

                <View style={styles.rodapeCard}>
                  <Text style={styles.pendentes}>
                    {item.pendentes}{" "}
                    {item.pendentes === 1
                      ? "ocorrência em aberto"
                      : "ocorrências em aberto"}
                  </Text>

                  <Text style={styles.verHistorico}>
                    Ver histórico
                  </Text>
                </View>
              </Card>
            ))}


            {/* OCORRÊNCIAS DETALHADAS */}

            <Text
              style={styles.tituloSecao}
              accessibilityRole="header"
            >
              Ocorrências Detalhadas
            </Text>

            {rodovias.map((resumo) => (
              <View key={resumo.rodovia}>
                <View style={styles.grupoRodovia}>
                  <Ionicons
                    name="trail-sign-outline"
                    size={18}
                    color={cores.primariaEscura}
                  />

                  <Text style={styles.grupoRodoviaTexto}>
                    {resumo.rodovia}
                  </Text>
                </View>

                {resumo.ocorrencias.map((ocorrencia) => (
                  <OcorrenciaCard
                    key={ocorrencia.id}
                    ocorrencia={ocorrencia}
                    onPress={() => abrirOcorrencia(ocorrencia.id)}
                  />
                ))}
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}


function Resumo({
  valor,
  rotulo,
  cor,
}: {
  valor: number;
  rotulo: string;
  cor: string;
}) {
  return (
    <Card estilo={styles.cardResumo}>
      <Text style={[styles.valorResumo, { color: cor }]}>
        {valor}
      </Text>

      <Text style={styles.rotuloResumo}>
        {rotulo}
      </Text>
    </Card>
  );
}


function Contador({
  valor,
  rotulo,
  cor,
  ponto,
}: {
  valor: number;
  rotulo: string;
  cor: string;
  ponto?: string;
}) {
  return (
    <View style={styles.contador}>
      <View style={styles.contadorLinha}>
        {ponto && (
          <View
            style={[styles.contadorPonto, { backgroundColor: ponto }]}
          />
        )}

        <Text style={[styles.contadorValor, { color: cor }]}>
          {valor}
        </Text>
      </View>

      <Text style={styles.contadorRotulo}>
        {rotulo}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  corpo: {
    paddingHorizontal: espaco.xl,
    paddingTop: espaco.xl,
  },

  flex: {
    flex: 1,
  },

  vazio: {
    marginTop: espaco.sm,
  },

  linhaResumo: {
    flexDirection: "row",
    gap: espaco.sm + 2,
  },

  cardResumo: {
    flex: 1,
    alignItems: "center",
    paddingVertical: espaco.md,
  },

  valorResumo: {
    ...tipografia.numero,
    fontSize: 26,
  },

  rotuloResumo: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
  },

  tituloSecao: {
    ...tipografia.secao,
    color: cores.texto,
    marginTop: espaco.xxl,
    marginBottom: espaco.md,
  },

  cardRodovia: {
    marginBottom: espaco.md,
  },

  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  nomeRodovia: {
    ...tipografia.titulo,
    color: cores.texto,
  },

  faixaKm: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
    marginTop: 2,
  },

  contadores: {
    flexDirection: "row",
    marginTop: espaco.md,
    paddingVertical: espaco.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: cores.borda,
  },

  contador: {
    flex: 1,
    alignItems: "center",
  },

  contadorLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.xs,
  },

  contadorPonto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  contadorValor: {
    fontSize: 20,
    fontWeight: "800",
  },

  contadorRotulo: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    marginTop: 2,
  },

  rodapeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: espaco.md,
  },

  pendentes: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
  },

  verHistorico: {
    ...tipografia.rotulo,
    color: cores.primaria,
    fontWeight: "800",
  },

  grupoRodovia: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
    marginTop: espaco.sm,
    marginBottom: espaco.sm,
  },

  grupoRodoviaTexto: {
    ...tipografia.corpoForte,
    color: cores.primariaEscura,
  },
});
