
import React, { useState, useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { carregarOcorrencias } from "../services/storage";
import { Ocorrencia } from "../types/Ocorrencia";
import OcorrenciaCard from "../components/OcorrenciaCard";

interface TrechosScreenProps {
  onSelecionarTrecho?: (
    ocorrencia: Ocorrencia
  ) => void;
}

/**
 * Tipo para resumo agrupado por rodovia
 */
type ResumoRodovia = {
  rodovia: string;
  total: number;
  criticos: number;
  atencao: number;
  normais: number;
  pendentes: number;
  kmInicial: number;
  kmFinal: number;
  ocorrencias: Ocorrencia[];
};

/**
 * Componente da tela de trechos
 */
export default function TrechosScreen({
  onSelecionarTrecho,
}: TrechosScreenProps) {
  const [ocorrencias, setOcorrencias] =
    useState<Ocorrencia[]>([]);

  /**
   * Carregar dados ao foco da tela
   */
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const dados =
          await carregarOcorrencias();
        setOcorrencias(dados);
      }

      carregar();
    }, [])
  );

  /**
   * Agrupar e resumir dados por rodovia
   */
  const rodoviasAgrupadas = useMemo(() => {
    const mapa = new Map<
      string,
      Ocorrencia[]
    >();

    // Agrupar por rodovia
    ocorrencias.forEach((ocorrencia) => {
      const nome =
        ocorrencia.rodovia
          ?.trim()
          .toUpperCase() ||
        "RODOVIA NÃO INFORMADA";

      const lista = mapa.get(nome) || [];
      lista.push(ocorrencia);
      mapa.set(nome, lista);
    });

    // Gerar resumo
    const resultado: ResumoRodovia[] =
      Array.from(mapa.entries()).map(
        ([rodovia, lista]) => {
          const kms = lista.map((item) =>
            Number(item.km)
          );

          return {
            rodovia,
            total: lista.length,
            criticos: lista.filter(
              (item) => item.classe === "CRITICO"
            ).length,
            atencao: lista.filter(
              (item) => item.classe === "ATENCAO"
            ).length,
            normais: lista.filter(
              (item) => item.classe === "NORMAL"
            ).length,
            pendentes: lista.filter(
              (item) =>
                item.status !== "CONCLUIDO"
            ).length,
            kmInicial: Math.min(...kms),
            kmFinal: Math.max(...kms),
            ocorrencias: lista,
          };
        }
      );

    // Ordenar: mais críticos primeiro
    return resultado.sort((a, b) => {
      if (b.criticos !== a.criticos) {
        return b.criticos - a.criticos;
      }
      if (b.atencao !== a.atencao) {
        return b.atencao - a.atencao;
      }
      return a.rodovia.localeCompare(b.rodovia);
    });
  }, [ocorrencias]);

  /**
   * Verificar se lista está vazia
   */
  const listaVazia =
    rodoviasAgrupadas.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      {listaVazia ? (
        <View
          style={styles.containerVazio}
        >
          <Text style={styles.textoVazio}>
            Nenhuma ocorrência registrada
          </Text>
          <Text
            style={
              styles.textoVazioSecundario
            }
          >
            Realize uma nova análise para
            começar a monitorar
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.titulo}>
              Trechos Monitorados
            </Text>
            <Text style={styles.subtitulo}>
              {ocorrencias.length} ocorrência
              {ocorrencias.length !== 1
                ? "s"
                : ""}
            </Text>
          </View>

          {/* Resumos por rodovia */}
          {rodoviasAgrupadas.map(
            (resumo) => (
              <View key={resumo.rodovia}>
                {/* Cabeçalho de rodovia */}
                <View
                  style={
                    styles.headerRodovia
                  }
                >
                  <Text
                    style={
                      styles.nomeRodovia
                    }
                  >
                    {resumo.rodovia}
                  </Text>
                  <Text
                    style={
                      styles.kmRange
                    }
                  >
                    KM {resumo.kmInicial.toFixed(1)} - {resumo.kmFinal.toFixed(1)}
                  </Text>
                </View>

                {/* Cards de resumo */}
                <View
                  style={
                    styles.resumoContainer
                  }
                >
                  <View
                    style={[
                      styles.resumoCard,
                      {
                        borderLeftColor:
                          "#2E9D50",
                      },
                    ]}
                  >
                    <Text
                      style={
                        styles.resumoNumero
                      }
                    >
                      {resumo.total}
                    </Text>
                    <Text
                      style={
                        styles.resumoLabel
                      }
                    >
                      Total
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.resumoCard,
                      {
                        borderLeftColor:
                          "#D63E3E",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.resumoNumero,
                        {
                          color:
                            "#D63E3E",
                        },
                      ]}
                    >
                      {resumo.criticos}
                    </Text>
                    <Text
                      style={
                        styles.resumoLabel
                      }
                    >
                      Críticos
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.resumoCard,
                      {
                        borderLeftColor:
                          "#E0A82E",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.resumoNumero,
                        {
                          color:
                            "#E0A82E",
                        },
                      ]}
                    >
                      {resumo.atencao}
                    </Text>
                    <Text
                      style={
                        styles.resumoLabel
                      }
                    >
                      Atenção
                    </Text>
                  </View>
                </View>

                {/* Ocorrências */}
                {resumo.ocorrencias.map(
                  (ocorrencia) => (
                    <OcorrenciaCard
                      key={ocorrencia.id}
                      ocorrencia={
                        ocorrencia
                      }
                      onPress={() => {
                        onSelecionarTrecho?.(
                          ocorrencia
                        );
                      }}
                    />
                  )
                )}
              </View>
            )
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F6",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D2A21",
  },

  subtitulo: {
    fontSize: 14,
    color: "#6B756E",
    marginTop: 4,
  },

  containerVazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  textoVazio: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D2A21",
    textAlign: "center",
    marginBottom: 8,
  },

  textoVazioSecundario: {
    fontSize: 14,
    color: "#6B756E",
    textAlign: "center",
  },

  headerRodovia: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },

  nomeRodovia: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#164B2A",
  },

  kmRange: {
    fontSize: 12,
    color: "#6B756E",
    marginTop: 4,
  },

  resumoContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  resumoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 8,
    borderRightWidth: 0,
  },

  resumoNumero: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E9D50",
  },

  resumoLabel: {
    fontSize: 11,
    color: "#6B756E",
    marginTop: 4,
  },
});
