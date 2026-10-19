import { Ionicons } from "@expo/vector-icons";

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
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import BadgeRisco from "../components/ui/BadgeRisco";
import Botao, { NomeIcone } from "../components/ui/Botao";
import Cabecalho from "../components/ui/Cabecalho";
import Card from "../components/ui/Card";
import Carregando from "../components/ui/Carregando";
import EstadoVazio from "../components/ui/EstadoVazio";

import {
  NOME_RISCO,
  NOME_ZONA,
  riscoPorClasse,
  violaContrato,
} from "../constants/risco";

import { useSessao } from "../hooks/useSessao";

import {
  ehGestor,
  NOME_PERFIL,
  PerfilUsuario,
} from "../services/auth";

import {
  atualizarOcorrencia,
  carregarOcorrencias,
  removerOcorrencia,
} from "../services/storage";

import {
  cores,
  espaco,
  raio,
  tipografia,
} from "../theme";

import { Ocorrencia } from "../types/Ocorrencia";

import {
  confirmarAcao,
  mostrarMensagem,
} from "../utils/mensagem";


// ============================================================
// FORMATAÇÃO
// ============================================================

function formatarDataHora(dataIso: string) {
  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return dataIso;
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


const NOME_STATUS: Record<Ocorrencia["status"], string> = {
  PENDENTE: "PENDENTE",
  EM_ANDAMENTO: "EM ANDAMENTO",
  CONCLUIDO: "CONCLUÍDO",
};


function textoRegistradoPor(
  criadoPor: Ocorrencia["criadoPor"]
) {
  if (!criadoPor) {
    return undefined;
  }

  const perfil =
    NOME_PERFIL[criadoPor.perfil as PerfilUsuario] ?? criadoPor.perfil;

  return `${criadoPor.nome} (${perfil})`;
}


// ============================================================
// LINHA DE INFORMAÇÃO
// ============================================================

function LinhaInfo({
  icone,
  rotulo,
  valor,
}: {
  icone: NomeIcone;
  rotulo: string;
  valor?: string;
}) {
  if (!valor) {
    return null;
  }

  return (
    <View
      style={styles.linhaInfo}
      accessible
      accessibilityLabel={`${rotulo}: ${valor}`}
    >
      <Ionicons
        name={icone}
        size={20}
        color={cores.textoSuave}
        style={styles.linhaIcone}
      />

      <Text style={styles.linhaRotulo}>{rotulo}</Text>

      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}


// ============================================================
// TELA
// ============================================================

export default function TrechoDetalhesScreen() {
  const insets = useSafeAreaInsets();

  const { usuario } = useSessao();

  const podeExcluir = ehGestor(usuario);

  const params = useLocalSearchParams<{
    rodovia?: string;
    id?: string;
  }>();

  const rodovia =
    typeof params.rodovia === "string" ? params.rodovia : "";

  const ocorrenciaId =
    typeof params.id === "string" ? params.id : "";

  const [ocorrencias, setOcorrencias] =
    useState<Ocorrencia[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [concluindo, setConcluindo] =
    useState<string | null>(null);


  // =========================================================
  // CARREGAR (uma ocorrência por id ou o histórico da rodovia)
  // =========================================================

  const carregar = useCallback(async () => {
    const dados = await carregarOcorrencias();

    let filtradas: Ocorrencia[] = [];

    if (ocorrenciaId) {
      filtradas = dados.filter((item) => item.id === ocorrenciaId);
    } else if (rodovia) {
      filtradas = dados.filter(
        (item) =>
          item.rodovia.trim().toUpperCase() ===
          rodovia.trim().toUpperCase()
      );
    }

    // Mais recente primeiro
    filtradas.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    setOcorrencias(filtradas);
    setCarregando(false);
  }, [rodovia, ocorrenciaId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );


  // =========================================================
  // EXCLUIR (somente gestor)
  // =========================================================

  async function excluirOcorrencia(id: string) {
    if (!podeExcluir) {
      return;
    }

    try {
      await removerOcorrencia(id);

      setOcorrencias((atuais) =>
        atuais.filter((item) => item.id !== id)
      );

    } catch (error) {
      console.error("Erro ao excluir ocorrência:", error);

      mostrarMensagem(
        "Erro",
        "Não foi possível excluir a ocorrência."
      );
    }
  }

  function confirmarExclusao(ocorrencia: Ocorrencia) {
    confirmarAcao(
      "Excluir ocorrência",
      `Deseja excluir a ocorrência da ${ocorrencia.rodovia} no KM ${ocorrencia.km}?`,
      "Excluir",
      () => excluirOcorrencia(ocorrencia.id)
    );
  }


  // =========================================================
  // MARCAR PODA COMO CONCLUÍDA (operador e gestor)
  // =========================================================

  async function concluirPoda(ocorrencia: Ocorrencia) {
    try {
      setConcluindo(ocorrencia.id);

      const atualizada: Ocorrencia = {
        ...ocorrencia,
        status: "CONCLUIDO",
        dataConclusao: new Date().toISOString(),
      };

      await atualizarOcorrencia(atualizada);

      setOcorrencias((atuais) =>
        atuais.map((item) =>
          item.id === atualizada.id ? atualizada : item
        )
      );

      mostrarMensagem(
        "Poda concluída",
        `A poda da ${ocorrencia.rodovia} no KM ${ocorrencia.km} foi registrada como concluída.`
      );

    } catch (error) {
      console.error("Erro ao concluir poda:", error);

      mostrarMensagem(
        "Erro",
        "Não foi possível atualizar a ocorrência."
      );

    } finally {
      setConcluindo(null);
    }
  }


  // =========================================================
  // INTERFACE
  // =========================================================

  const totalCriticos = ocorrencias.filter(
    (item) => item.classe === "CRITICO"
  ).length;

  // Ao abrir pela lista (por id), o parâmetro "rodovia" não vem.
  const titulo =
    rodovia || ocorrencias[0]?.rodovia || "Ocorrência";

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={{
        paddingBottom: insets.bottom + espaco.xxxl,
      }}
    >
      <Cabecalho
        titulo={titulo}
        subtitulo={
          ocorrenciaId
            ? "Detalhe da ocorrência"
            : "Histórico de análises da rodovia"
        }
        rotuloVoltar="Trechos"
        onVoltar={() =>
          router.canGoBack() ? router.back() : router.replace("/rodovias")
        }
      />

      <View style={styles.corpo}>

        {/* RESUMO (somente no histórico da rodovia) */}

        {!ocorrenciaId && ocorrencias.length > 0 && (
          <View style={styles.linhaResumo}>
            <Card estilo={styles.cardResumo}>
              <Text style={[styles.valorResumo, { color: cores.primaria }]}>
                {ocorrencias.length}
              </Text>
              <Text style={styles.rotuloResumo}>Análises</Text>
            </Card>

            <Card estilo={styles.cardResumo}>
              <Text style={[styles.valorResumo, { color: cores.risco.CRITICO.texto }]}>
                {totalCriticos}
              </Text>
              <Text style={styles.rotuloResumo}>Críticas</Text>
            </Card>
          </View>
        )}

        {carregando ? (
          <Carregando texto="Carregando ocorrência..." />
        ) : ocorrencias.length === 0 ? (
          <EstadoVazio
            icone="document-text-outline"
            titulo="Nenhuma análise encontrada"
            texto="Novas análises desta rodovia aparecerão aqui."
            acao={{
              titulo: "Voltar para os trechos",
              icone: "map-outline",
              onPress: () => router.replace("/rodovias"),
            }}
          />
        ) : (
          ocorrencias.map((ocorrencia) => {
            const foraDoContrato =
              violaContrato(ocorrencia.classe, ocorrencia.zona) &&
              ocorrencia.status !== "CONCLUIDO";

            const concluida =
              ocorrencia.status === "CONCLUIDO";

            return (
              <Card
                key={ocorrencia.id}
                corFaixa={cores.risco[ocorrencia.classe].cor}
                estilo={styles.card}
              >

                {/* TOPO: KM + DATA + RISCO */}

                <View style={styles.topo}>
                  <View style={styles.flex}>
                    <Text style={styles.km}>
                      KM {ocorrencia.km}
                    </Text>

                    <Text style={styles.data}>
                      {formatarDataHora(ocorrencia.data)}
                    </Text>
                  </View>

                  <BadgeRisco
                    classe={ocorrencia.classe}
                    tamanho="grande"
                  />
                </View>


                {/* STATUS */}

                <View
                  style={[
                    styles.status,
                    concluida ? styles.statusConcluido : styles.statusAberto,
                  ]}
                >
                  <Ionicons
                    name={concluida ? "checkmark-circle" : "time-outline"}
                    size={18}
                    color={concluida ? cores.sucesso : cores.aviso}
                  />

                  <Text
                    style={[
                      styles.statusTexto,
                      { color: concluida ? cores.sucesso : cores.aviso },
                    ]}
                  >
                    Status: {NOME_STATUS[ocorrencia.status]}
                  </Text>
                </View>


                {/* ALERTA DE CONTRATO */}

                {foraDoContrato && (
                  <View
                    style={styles.alertaContrato}
                    accessibilityRole="alert"
                  >
                    <Ionicons
                      name="warning"
                      size={22}
                      color={cores.perigo}
                    />

                    <Text style={styles.alertaContratoTexto}>
                      Fora do limite do contrato: priorizar a poda.
                    </Text>
                  </View>
                )}


                {/* INFORMAÇÕES */}

                <View style={styles.infos}>
                  <LinhaInfo
                    icone={
                      ocorrencia.origemClassificacao === "MANUAL"
                        ? "hand-left-outline"
                        : "sparkles"
                    }
                    rotulo="Classificação"
                    valor={
                      ocorrencia.origemClassificacao === "MANUAL"
                        ? "Manual (operador)"
                        : `IA · ${(ocorrencia.confianca * 100).toFixed(2)}%`
                    }
                  />

                  <LinhaInfo
                    icone="speedometer-outline"
                    rotulo="Risco"
                    valor={
                      NOME_RISCO[
                        ocorrencia.risco ?? riscoPorClasse(ocorrencia.classe)
                      ]
                    }
                  />

                  <LinhaInfo
                    icone="location-outline"
                    rotulo="Local"
                    valor={ocorrencia.local}
                  />

                  <LinhaInfo
                    icone="document-text-outline"
                    rotulo="Descrição"
                    valor={ocorrencia.descricao}
                  />

                  <LinhaInfo
                    icone="pricetag-outline"
                    rotulo="Zona"
                    valor={ocorrencia.zona ? NOME_ZONA[ocorrencia.zona] : undefined}
                  />

                  <LinhaInfo
                    icone="people-outline"
                    rotulo="Equipe"
                    valor={ocorrencia.equipe}
                  />

                  <LinhaInfo
                    icone="car-outline"
                    rotulo="Veículo"
                    valor={ocorrencia.veiculo}
                  />

                  <LinhaInfo
                    icone="person-outline"
                    rotulo="Registrado por"
                    valor={textoRegistradoPor(ocorrencia.criadoPor)}
                  />

                  <LinhaInfo
                    icone="navigate-outline"
                    rotulo="Latitude"
                    valor={ocorrencia.latitude.toFixed(6)}
                  />

                  <LinhaInfo
                    icone="navigate-outline"
                    rotulo="Longitude"
                    valor={ocorrencia.longitude.toFixed(6)}
                  />

                  <LinhaInfo
                    icone="checkmark-done"
                    rotulo="Poda concluída em"
                    valor={
                      ocorrencia.dataConclusao
                        ? formatarDataHora(ocorrencia.dataConclusao)
                        : undefined
                    }
                  />
                </View>


                {/* FOTO */}

                {ocorrencia.imagem && (
                  <Image
                    source={{ uri: ocorrencia.imagem }}
                    style={styles.foto}
                    accessibilityLabel="Foto da vegetação"
                  />
                )}


                {/* AÇÕES */}

                {!concluida && (
                  <Botao
                    titulo="Marcar poda como concluída"
                    icone="checkmark-done"
                    tamanho="grande"
                    carregando={concluindo === ocorrencia.id}
                    onPress={() => concluirPoda(ocorrencia)}
                    estilo={styles.botao}
                  />
                )}

                {podeExcluir && (
                  <Botao
                    titulo="Excluir ocorrência"
                    icone="trash-outline"
                    variante="perigo"
                    onPress={() => confirmarExclusao(ocorrencia)}
                    estilo={styles.botao}
                  />
                )}
              </Card>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}


// ============================================================
// ESTILOS
// ============================================================

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

  linhaResumo: {
    flexDirection: "row",
    gap: espaco.md,
    marginBottom: espaco.lg,
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

  card: {
    marginBottom: espaco.lg,
  },

  topo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espaco.md,
  },

  km: {
    ...tipografia.tituloGrande,
    color: cores.texto,
  },

  data: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
    marginTop: 2,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: espaco.xs + 2,
    marginTop: espaco.md,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.xs + 2,
    borderRadius: raio.pilula,
  },

  statusAberto: {
    backgroundColor: cores.avisoFundo,
  },

  statusConcluido: {
    backgroundColor: cores.sucessoFundo,
  },

  statusTexto: {
    ...tipografia.rotulo,
    fontWeight: "800",
  },

  alertaContrato: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
    marginTop: espaco.md,
    backgroundColor: cores.perigoFundo,
    borderWidth: 1.5,
    borderColor: cores.risco.CRITICO.cor,
    borderRadius: raio.md,
    padding: espaco.md,
  },

  alertaContratoTexto: {
    ...tipografia.corpoForte,
    color: cores.perigo,
    flex: 1,
  },

  infos: {
    marginTop: espaco.lg,
    backgroundColor: cores.superficieSuave,
    borderRadius: raio.md,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.xs,
  },

  linhaInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: espaco.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.borda,
  },

  linhaIcone: {
    marginRight: espaco.sm,
    marginTop: 1,
  },

  linhaRotulo: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
    width: 112,
  },

  linhaValor: {
    ...tipografia.rotulo,
    color: cores.texto,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },

  foto: {
    width: "100%",
    height: 200,
    marginTop: espaco.lg,
    borderRadius: raio.md,
    backgroundColor: cores.superficieSuave,
  },

  botao: {
    marginTop: espaco.md,
  },
});
