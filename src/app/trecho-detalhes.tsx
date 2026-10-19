import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  NOME_RISCO,
  NOME_ZONA,
  riscoPorClasse,
  violaContrato,
} from "../constants/risco";

import {
  atualizarOcorrencia,
  carregarOcorrencias,
  removerOcorrencia,
} from "../services/storage";

import {
  Ocorrencia,
} from "../types/Ocorrencia";


// ============================================================
// FORMATAR DATA
// ============================================================

function formatarDataHora(
  dataIso: string
) {
  const data =
    new Date(
      dataIso
    );


  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return dataIso;
  }


  return data.toLocaleString(
    "pt-BR",
    {
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        false,
    }
  );
}


// ============================================================
// CLASSE
// ============================================================

function nomeClasse(
  classe:
    Ocorrencia["classe"]
) {
  if (
    classe ===
    "CRITICO"
  ) {
    return "CRÍTICO";
  }


  if (
    classe ===
    "ATENCAO"
  ) {
    return "ATENÇÃO";
  }


  return "NORMAL";
}


// ============================================================
// STATUS
// ============================================================

function nomeStatus(
  status:
    Ocorrencia["status"]
) {
  if (
    status ===
    "EM_ANDAMENTO"
  ) {
    return "EM ANDAMENTO";
  }


  if (
    status ===
    "CONCLUIDO"
  ) {
    return "CONCLUÍDO";
  }


  return "PENDENTE";
}


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagem(
  titulo: string,
  mensagem: string
) {
  if (
    Platform.OS ===
    "web"
  ) {
    alert(
      `${titulo}\n\n${mensagem}`
    );

    return;
  }


  Alert.alert(
    titulo,
    mensagem
  );
}


// ============================================================
// DETALHES DO REGISTRO
// Mostra só as linhas preenchidas.
// ============================================================

function DetalhesRegistro({
  ocorrencia,
}: {
  ocorrencia: Ocorrencia;
}) {

  const linhas: [string, string | undefined][] = [
    [
      "Risco",
      NOME_RISCO[
        ocorrencia.risco ??
        riscoPorClasse(
          ocorrencia.classe
        )
      ],
    ],

    [
      "Local",
      ocorrencia.local,
    ],

    [
      "Descrição",
      ocorrencia.descricao,
    ],

    [
      "Zona",
      ocorrencia.zona
        ? NOME_ZONA[
            ocorrencia.zona
          ]
        : undefined,
    ],

    [
      "Equipe",
      ocorrencia.equipe,
    ],

    [
      "Veículo",
      ocorrencia.veiculo,
    ],

    [
      "Poda concluída em",
      ocorrencia.dataConclusao
        ? formatarDataHora(
            ocorrencia.dataConclusao
          )
        : undefined,
    ],
  ];


  const foraDoContrato =
    violaContrato(
      ocorrencia.classe,
      ocorrencia.zona
    ) &&
    ocorrencia.status !==
      "CONCLUIDO";


  return (
    <>
      <View
        style={
          styles.detailsBox
        }
      >
        {linhas
          .filter(
            ([, valor]) =>
              !!valor
          )
          .map(
            ([rotulo, valor]) => (
              <View
                key={
                  rotulo
                }
                style={
                  styles.detailRow
                }
              >
                <Text
                  style={
                    styles.detailLabel
                  }
                >
                  {rotulo}
                </Text>

                <Text
                  style={[
                    styles.detailValue,
                    styles.detailValueLong,
                  ]}
                >
                  {valor}
                </Text>
              </View>
            )
          )}
      </View>


      {foraDoContrato && (
        <View
          style={
            styles.contractAlert
          }
        >
          <Text
            style={
              styles.contractAlertText
            }
          >
            Fora do limite do contrato: priorizar a poda.
          </Text>
        </View>
      )}
    </>
  );
}


// ============================================================
// TELA
// ============================================================

export default function TrechoDetalhesScreen() {

  const params =
    useLocalSearchParams<{
      rodovia?: string;
      id?: string;
    }>();


  const rodovia =
    typeof params.rodovia ===
    "string"
      ? params.rodovia
      : "";

  const ocorrenciaId =
    typeof params.id ===
    "string"
      ? params.id
      : "";


  const [
    ocorrencias,
    setOcorrencias,
  ] =
    useState<Ocorrencia[]>(
      []
    );


  // ==========================================================
  // CARREGAR HISTÓRICO
  // ==========================================================

  const carregar = useCallback(
    async () => {

      const dados =
        await carregarOcorrencias();

      let filtradas: Ocorrencia[] = [];

      // Se ID foi fornecido, filtrar por ID
      if (ocorrenciaId) {
        filtradas = dados.filter(
          (item) => item.id === ocorrenciaId
        );
      } 
      // Se rodovia foi fornecida, filtrar por rodovia
      else if (rodovia) {
        filtradas = dados
          .filter(
            (item) =>
              item.rodovia
                .trim()
                .toUpperCase() ===
              rodovia
                .trim()
                .toUpperCase()
          );
      }

      // Ordenar por data (mais recente primeiro)
      filtradas.sort(
        (a, b) =>
          new Date(
            b.data
          ).getTime() -
          new Date(
            a.data
          ).getTime()
      );

      setOcorrencias(
        filtradas
      );

    },
    [
      rodovia,
      ocorrenciaId,
    ]
  );


  useFocusEffect(
    useCallback(() => {

      carregar();

    }, [
      carregar,
    ])
  );


  // ==========================================================
  // EXCLUIR
  // ==========================================================

  async function excluirOcorrencia(
    id: string
  ) {
    try {

      await removerOcorrencia(
        id
      );


      setOcorrencias(
        (dadosAtuais) =>
          dadosAtuais.filter(
            (item) =>
              item.id !== id
          )
      );


    } catch (error) {

      console.error(
        "Erro ao excluir ocorrência:",
        error
      );


      mostrarMensagem(
        "Erro",
        "Não foi possível excluir a ocorrência."
      );
    }
  }


  // ==========================================================
  // MARCAR PODA COMO CONCLUÍDA
  // ==========================================================

  async function concluirPoda(
    ocorrencia:
      Ocorrencia
  ) {
    try {

      const atualizada: Ocorrencia = {
        ...ocorrencia,

        status:
          "CONCLUIDO",

        dataConclusao:
          new Date()
            .toISOString(),
      };


      await atualizarOcorrencia(
        atualizada
      );


      setOcorrencias(
        (dadosAtuais) =>
          dadosAtuais.map(
            (item) =>
              item.id ===
              atualizada.id
                ? atualizada
                : item
          )
      );


      mostrarMensagem(
        "Poda concluída",
        `A poda da ${ocorrencia.rodovia} no KM ${ocorrencia.km} foi registrada como concluída.`
      );


    } catch (error) {

      console.error(
        "Erro ao concluir poda:",
        error
      );


      mostrarMensagem(
        "Erro",
        "Não foi possível atualizar a ocorrência."
      );
    }
  }


  // ==========================================================
  // CONFIRMAR EXCLUSÃO
  // ==========================================================

  function confirmarExclusao(
    ocorrencia:
      Ocorrencia
  ) {

    const mensagem =
      `Deseja excluir a ocorrência da ${ocorrencia.rodovia} no KM ${ocorrencia.km}?`;


    if (
      Platform.OS ===
      "web"
    ) {

      const confirmou =
        window.confirm(
          mensagem
        );


      if (
        confirmou
      ) {
        excluirOcorrencia(
          ocorrencia.id
        );
      }


      return;
    }


    Alert.alert(
      "Excluir ocorrência",
      mensagem,
      [
        {
          text:
            "Cancelar",

          style:
            "cancel",
        },

        {
          text:
            "Excluir",

          style:
            "destructive",

          onPress:
            () =>
              excluirOcorrencia(
                ocorrencia.id
              ),
        },
      ]
    );
  }


  // ==========================================================
  // RESUMO
  // ==========================================================

  const totalCriticos =
    ocorrencias.filter(
      (item) =>
        item.classe ===
        "CRITICO"
    ).length;


  // Ao abrir pela lista (por id), o parâmetro "rodovia" não vem.
  const titulo =
    rodovia ||
    ocorrencias[0]?.rodovia ||
    "Ocorrência";


  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >

        {/* HEADER */}

        <View
          style={
            styles.header
          }
        >

          <Pressable
            style={
              styles.backButton
            }
            onPress={() =>
              router.back()
            }
          >

            <Text
              style={
                styles.backButtonText
              }
            >
              ← Trechos
            </Text>

          </Pressable>


          <Text
            style={
              styles.title
            }
          >
            {titulo}
          </Text>


          <Text
            style={
              styles.subtitle
            }
          >
            {ocorrenciaId
              ? "Detalhe da ocorrência"
              : "Histórico de análises da rodovia"}
          </Text>

        </View>


        {/* RESUMO */}

        <View
          style={
            styles.summaryRow
          }
        >

          <View
            style={
              styles.summaryCard
            }
          >

            <Text
              style={
                styles.summaryNumber
              }
            >
              {
                ocorrencias.length
              }
            </Text>

            <Text
              style={
                styles.summaryLabel
              }
            >
              Análises
            </Text>

          </View>


          <View
            style={
              styles.summaryCard
            }
          >

            <Text
              style={[
                styles.summaryNumber,
                styles.criticalNumber,
              ]}
            >
              {
                totalCriticos
              }
            </Text>

            <Text
              style={
                styles.summaryLabel
              }
            >
              Críticas
            </Text>

          </View>

        </View>


        {/* HISTÓRICO */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Histórico
        </Text>


        {
          ocorrencias.length ===
          0 ? (

            <View
              style={
                styles.emptyCard
              }
            >

              <Text
                style={
                  styles.emptyTitle
                }
              >
                Nenhuma análise encontrada
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Novas análises desta rodovia aparecerão aqui.
              </Text>

            </View>

          ) : (

            ocorrencias.map(
              (
                ocorrencia
              ) => (

                <View
                  key={
                    ocorrencia.id
                  }
                  style={
                    styles.card
                  }
                >

                  {/* TOPO */}

                  <View
                    style={
                      styles.cardTop
                    }
                  >

                    <View>

                      <Text
                        style={
                          styles.km
                        }
                      >
                        KM{" "}
                        {
                          ocorrencia.km
                        }
                      </Text>


                      <Text
                        style={
                          styles.date
                        }
                      >
                        {
                          formatarDataHora(
                            ocorrencia.data
                          )
                        }
                      </Text>

                    </View>


                    <View
                      style={[
                        styles.badge,

                        ocorrencia.classe ===
                        "CRITICO"
                          ?
                          styles.criticalBadge

                          :

                          ocorrencia.classe ===
                          "ATENCAO"
                            ?
                            styles.attentionBadge

                            :
                            styles.normalBadge,
                      ]}
                    >

                      <Text
                        style={
                          styles.badgeText
                        }
                      >
                        {
                          nomeClasse(
                            ocorrencia.classe
                          )
                        }
                      </Text>

                    </View>

                  </View>


                  {/* DETALHES */}

                  <View
                    style={
                      styles.detailsBox
                    }
                  >

                    <View
                      style={
                        styles.detailRow
                      }
                    >

                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Classificação
                      </Text>


                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {ocorrencia.origemClassificacao ===
                        "MANUAL"
                          ? "Manual (operador)"
                          : `IA · ${(
                              ocorrencia.confianca *
                              100
                            ).toFixed(2)}%`}
                      </Text>

                    </View>


                    <View
                      style={
                        styles.detailRow
                      }
                    >

                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Status
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {
                          nomeStatus(
                            ocorrencia.status
                          )
                        }
                      </Text>

                    </View>


                    <View
                      style={
                        styles.detailRow
                      }
                    >

                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Latitude
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {
                          ocorrencia.latitude
                            .toFixed(
                              6
                            )
                        }
                      </Text>

                    </View>


                    <View
                      style={
                        styles.detailRow
                      }
                    >

                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Longitude
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {
                          ocorrencia.longitude
                            .toFixed(
                              6
                            )
                        }
                      </Text>

                    </View>

                  </View>


                  {/* DADOS DO REGISTRO */}

                  <DetalhesRegistro
                    ocorrencia={
                      ocorrencia
                    }
                  />


                  {/* FOTO */}

                  {
                    ocorrencia.imagem &&
                    (
                      <Image
                        source={{
                          uri:
                            ocorrencia.imagem,
                        }}
                        style={
                          styles.image
                        }
                      />
                    )
                  }


                  {/* CONCLUIR PODA */}

                  {ocorrencia.status !==
                    "CONCLUIDO" && (
                    <Pressable
                      style={
                        styles.concludeButton
                      }
                      onPress={() =>
                        concluirPoda(
                          ocorrencia
                        )
                      }
                    >
                      <Text
                        style={
                          styles.concludeButtonText
                        }
                      >
                        Marcar poda como concluída
                      </Text>
                    </Pressable>
                  )}


                  {/* EXCLUIR */}

                  <Pressable
                    style={
                      styles.deleteButton
                    }
                    onPress={() =>
                      confirmarExclusao(
                        ocorrencia
                      )
                    }
                  >

                    <Text
                      style={
                        styles.deleteButtonText
                      }
                    >
                      Excluir ocorrência
                    </Text>

                  </Pressable>

                </View>

              )
            )
          )
        }

      </ScrollView>

    </SafeAreaView>
  );
}


// ============================================================
// ESTILOS
// ============================================================

const styles =
  StyleSheet.create({

    container: {
      flex:
        1,

      backgroundColor:
        "#F4F7F4",
    },


    content: {
      paddingBottom:
        40,
    },


    header: {
      backgroundColor:
        "#164B2A",

      paddingHorizontal:
        20,

      paddingTop:
        20,

      paddingBottom:
        28,
    },


    backButton: {
      alignSelf:
        "flex-start",

      marginBottom:
        18,

      paddingVertical:
        8,

      paddingHorizontal:
        12,

      backgroundColor:
        "rgba(255,255,255,0.12)",

      borderRadius:
        10,
    },


    backButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "600",
    },


    title: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "bold",
    },


    subtitle: {
      marginTop:
        5,

      color:
        "#D8E7DC",

      fontSize:
        14,
    },


    summaryRow: {
      flexDirection:
        "row",

      paddingHorizontal:
        20,

      gap:
        12,

      marginTop:
        22,
    },


    summaryCard: {
      flex:
        1,

      backgroundColor:
        "#FFFFFF",

      padding:
        17,

      borderRadius:
        14,
    },


    summaryNumber: {
      fontSize:
        25,

      fontWeight:
        "bold",

      color:
        "#21894A",
    },


    criticalNumber: {
      color:
        "#D63E3E",
    },


    summaryLabel: {
      marginTop:
        3,

      fontSize:
        13,

      color:
        "#6B756E",
    },


    sectionTitle: {
      marginHorizontal:
        20,

      marginTop:
        24,

      marginBottom:
        12,

      fontSize:
        19,

      fontWeight:
        "bold",

      color:
        "#1D2A21",
    },


    card: {
      marginHorizontal:
        20,

      marginBottom:
        14,

      backgroundColor:
        "#FFFFFF",

      borderRadius:
        16,

      padding:
        17,
    },


    cardTop: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",
    },


    km: {
      fontSize:
        18,

      fontWeight:
        "bold",

      color:
        "#1D2A21",
    },


    date: {
      marginTop:
        4,

      fontSize:
        12,

      color:
        "#6B756E",
    },


    badge: {
      paddingHorizontal:
        10,

      paddingVertical:
        7,

      borderRadius:
        20,
    },


    criticalBadge: {
      backgroundColor:
        "#D63E3E",
    },


    attentionBadge: {
      backgroundColor:
        "#E0A82E",
    },


    normalBadge: {
      backgroundColor:
        "#2E9D50",
    },


    badgeText: {
      color:
        "#FFFFFF",

      fontSize:
        11,

      fontWeight:
        "bold",
    },


    detailsBox: {
      marginTop:
        15,

      backgroundColor:
        "#F7F9F7",

      borderRadius:
        12,

      padding:
        13,
    },


    detailRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      paddingVertical:
        5,
    },


    detailLabel: {
      color:
        "#6B756E",

      fontSize:
        12,
    },


    detailValue: {
      color:
        "#1D2A21",

      fontSize:
        12,

      fontWeight:
        "bold",
    },


    detailValueLong: {
      flexShrink:
        1,

      marginLeft:
        12,

      textAlign:
        "right",
    },


    contractAlert: {
      marginTop:
        12,

      backgroundColor:
        "#FDEAEA",

      borderWidth:
        1,

      borderColor:
        "#D63E3E",

      borderRadius:
        10,

      padding:
        12,
    },


    contractAlertText: {
      color:
        "#B42F2F",

      fontSize:
        13,

      fontWeight:
        "bold",
    },


    concludeButton: {
      marginTop:
        16,

      backgroundColor:
        "#21894A",

      borderRadius:
        10,

      paddingVertical:
        12,

      alignItems:
        "center",
    },


    concludeButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        14,

      fontWeight:
        "bold",
    },


    image: {
      width:
        "100%",

      height:
        180,

      marginTop:
        14,

      borderRadius:
        12,
    },


    deleteButton: {
      marginTop:
        16,

      borderWidth:
        1,

      borderColor:
        "#D63E3E",

      backgroundColor:
        "#FFF5F5",

      borderRadius:
        10,

      paddingVertical:
        12,

      alignItems:
        "center",
    },


    deleteButtonText: {
      color:
        "#C73232",

      fontSize:
        14,

      fontWeight:
        "bold",
    },


    emptyCard: {
      marginHorizontal:
        20,

      backgroundColor:
        "#FFFFFF",

      padding:
        24,

      borderRadius:
        14,

      alignItems:
        "center",
    },


    emptyTitle: {
      fontSize:
        16,

      fontWeight:
        "bold",

      color:
        "#1D2A21",
    },


    emptyText: {
      marginTop:
        6,

      color:
        "#6B756E",

      fontSize:
        13,

      textAlign:
        "center",
    },

  });

  