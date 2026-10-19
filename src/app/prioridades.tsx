import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  File,
  Paths,
} from "expo-file-system";

import * as Sharing from "expo-sharing";

import BadgeRisco from "../components/ui/BadgeRisco";
import Botao from "../components/ui/Botao";
import Cabecalho from "../components/ui/Cabecalho";
import Campo from "../components/ui/Campo";
import Card from "../components/ui/Card";
import EstadoVazio from "../components/ui/EstadoVazio";

import { useSessao } from "../hooks/useSessao";

import { ehGestor } from "../services/auth";

import { gerarCSV } from "../services/csv";

import { carregarOcorrencias } from "../services/storage";

import {
  cores,
  espaco,
  raio,
  tipografia,
} from "../theme";

import { Ocorrencia } from "../types/Ocorrencia";

import { mostrarMensagem } from "../utils/mensagem";


// ============================================================
// PRIORIDADE DAS CLASSES
// ============================================================

function prioridadeClasse(classe: Ocorrencia["classe"]) {
  if (classe === "CRITICO") {
    return 3;
  }

  if (classe === "ATENCAO") {
    return 2;
  }

  return 1;
}


// CRÍTICO → ATENÇÃO → NORMAL; depois maior confiança; depois mais recente
function ordenarOcorrencias(lista: Ocorrencia[]) {
  return [...lista].sort((a, b) => {
    const prioridadeA = prioridadeClasse(a.classe);
    const prioridadeB = prioridadeClasse(b.classe);

    if (prioridadeA !== prioridadeB) {
      return prioridadeB - prioridadeA;
    }

    if (a.confianca !== b.confianca) {
      return b.confianca - a.confianca;
    }

    return new Date(b.data).getTime() - new Date(a.data).getTime();
  });
}


const NOME_STATUS: Record<Ocorrencia["status"], string> = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído",
};


function formatarData(dataIso: string) {
  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return dataIso;
  }

  return data.toLocaleDateString("pt-BR");
}


// ============================================================
// TEXTO DD/MM/AAAA → DATE
// ============================================================

function converterData(
  texto: string,
  fimDoDia = false
) {
  const partes = texto.trim().split("/");

  if (partes.length !== 3) {
    return null;
  }

  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  let ano = Number(partes[2]);

  // Permite digitar 01/07/26 ou 01/07/2026
  if (partes[2].length === 2) {
    ano += 2000;
  }

  if (
    !Number.isInteger(dia) ||
    !Number.isInteger(mes) ||
    !Number.isInteger(ano)
  ) {
    return null;
  }

  const data = new Date(
    ano,
    mes - 1,
    dia,
    fimDoDia ? 23 : 0,
    fimDoDia ? 59 : 0,
    fimDoDia ? 59 : 0,
    fimDoDia ? 999 : 0
  );

  // Evita aceitar datas impossíveis, como 31/02/2026.
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null;
  }

  return data;
}


// ============================================================
// PERÍODO PADRÃO = MÊS ATUAL
// ============================================================

function obterPeriodoPadrao() {
  const hoje = new Date();

  const formatar = (data: Date) => {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}/${data.getFullYear()}`;
  };

  return {
    inicio: formatar(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
    fim: formatar(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)),
  };
}


function filtrarPeriodo(
  dados: Ocorrencia[],
  inicio: Date,
  fim: Date
) {
  return dados.filter((ocorrencia) => {
    const timestamp = new Date(ocorrencia.data).getTime();

    return (
      timestamp >= inicio.getTime() &&
      timestamp <= fim.getTime()
    );
  });
}


// ============================================================
// TELA (somente gestor)
// ============================================================

export default function PrioridadesScreen() {
  const insets = useSafeAreaInsets();

  const { usuario } = useSessao();

  const periodoPadrao = obterPeriodoPadrao();

  const [todasOcorrencias, setTodasOcorrencias] =
    useState<Ocorrencia[]>([]);

  const [ocorrenciasFiltradas, setOcorrenciasFiltradas] =
    useState<Ocorrencia[]>([]);

  const [dataInicial, setDataInicial] =
    useState(periodoPadrao.inicio);

  const [dataFinal, setDataFinal] =
    useState(periodoPadrao.fim);

  const [erroPeriodo, setErroPeriodo] =
    useState<string | null>(null);

  const [exportando, setExportando] =
    useState(false);


  // =========================================================
  // FILTRAR
  // =========================================================

  function aplicarFiltro(dados = todasOcorrencias) {
    const inicio = converterData(dataInicial, false);
    const fim = converterData(dataFinal, true);

    if (!inicio || !fim) {
      setErroPeriodo(
        "Informe as datas no formato DD/MM/AAAA. Exemplo: 01/07/2026."
      );
      return;
    }

    if (inicio.getTime() > fim.getTime()) {
      setErroPeriodo(
        "A data inicial não pode ser posterior à data final."
      );
      return;
    }

    setErroPeriodo(null);

    setOcorrenciasFiltradas(
      ordenarOcorrencias(filtrarPeriodo(dados, inicio, fim))
    );
  }


  // =========================================================
  // CARREGAR STORAGE
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const dados = await carregarOcorrencias();

        setTodasOcorrencias(dados);

        const inicio = converterData(dataInicial, false);
        const fim = converterData(dataFinal, true);

        setOcorrenciasFiltradas(
          ordenarOcorrencias(
            inicio && fim ? filtrarPeriodo(dados, inicio, fim) : dados
          )
        );
      }

      carregar();
    }, [])
  );


  // =========================================================
  // EXPORTAR CSV
  // =========================================================

  async function exportarCSV() {
    if (ocorrenciasFiltradas.length === 0) {
      mostrarMensagem(
        "Nenhum dado",
        "Não existem ocorrências no período selecionado para exportar."
      );
      return;
    }

    try {
      setExportando(true);

      // Usa exatamente os dados filtrados na tela.
      // O BOM UTF-8 ajuda o Excel a reconhecer os acentos.
      const csvFinal = `﻿${gerarCSV(ocorrenciasFiltradas)}`;

      // ---------------- WEB ----------------
      if (Platform.OS === "web") {
        const blob = new Blob([csvFinal], {
          type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `verdescan_${dataInicial.replace(/\//g, "-")}_a_${dataFinal.replace(/\//g, "-")}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        mostrarMensagem(
          "CSV gerado",
          "O arquivo CSV do período selecionado foi gerado com sucesso."
        );
        return;
      }

      // ---------------- IPHONE / ANDROID ----------------
      const arquivo = new File(
        Paths.cache,
        `verdescan_${Date.now()}.csv`
      );

      arquivo.create();
      arquivo.write(csvFinal);

      if (!(await Sharing.isAvailableAsync())) {
        mostrarMensagem(
          "Compartilhamento indisponível",
          "Não foi possível abrir as opções de compartilhamento neste dispositivo."
        );
        return;
      }

      await Sharing.shareAsync(arquivo.uri);

    } catch (erro) {
      console.error("Erro ao exportar CSV:", erro);

      mostrarMensagem(
        "Erro ao exportar",
        "Não foi possível gerar o arquivo CSV."
      );

    } finally {
      setExportando(false);
    }
  }


  // O _layout.tsx já redireciona o operador; isto é só uma garantia.
  if (!ehGestor(usuario)) {
    return null;
  }


  const totalCriticos = ocorrenciasFiltradas.filter(
    (item) => item.classe === "CRITICO"
  ).length;

  const totalAtencao = ocorrenciasFiltradas.filter(
    (item) => item.classe === "ATENCAO"
  ).length;

  const totalNormal = ocorrenciasFiltradas.filter(
    (item) => item.classe === "NORMAL"
  ).length;


  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + espaco.xxxl,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Cabecalho
          titulo="Pontos prioritários"
          subtitulo="Consulte e exporte as ocorrências por período"
          rotuloVoltar="Início"
          onVoltar={() => router.replace("/")}
        />

        <View style={styles.corpo}>

          {/* PERÍODO */}

          <Text
            style={styles.tituloSecao}
            accessibilityRole="header"
          >
            Período
          </Text>

          <Card>
            <View style={styles.linhaDatas}>
              <Campo
                rotulo="Data inicial"
                icone="calendar-outline"
                value={dataInicial}
                onChangeText={setDataInicial}
                placeholder="01/07/2026"
                keyboardType="numbers-and-punctuation"
                estiloContainer={styles.campoData}
              />

              <Campo
                rotulo="Data final"
                icone="calendar-outline"
                value={dataFinal}
                onChangeText={setDataFinal}
                placeholder="31/07/2026"
                keyboardType="numbers-and-punctuation"
                estiloContainer={styles.campoData}
              />
            </View>

            {erroPeriodo ? (
              <View style={styles.erroPeriodo}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={cores.perigo}
                />
                <Text style={styles.erroPeriodoTexto}>
                  {erroPeriodo}
                </Text>
              </View>
            ) : (
              <Text style={styles.ajuda}>
                Formato: DD/MM/AAAA
              </Text>
            )}

            <Botao
              titulo="Aplicar período"
              icone="search-outline"
              variante="secundario"
              onPress={() => aplicarFiltro()}
            />
          </Card>


          {/* RESUMO */}

          <Text
            style={styles.tituloSecao}
            accessibilityRole="header"
          >
            Resumo do período
          </Text>

          <View style={styles.linhaResumo}>
            {[
              { valor: totalCriticos, rotulo: "Críticos", classe: "CRITICO" as const },
              { valor: totalAtencao, rotulo: "Atenção", classe: "ATENCAO" as const },
              { valor: totalNormal, rotulo: "Normais", classe: "NORMAL" as const },
            ].map((item) => (
              <Card
                key={item.classe}
                corFaixa={cores.risco[item.classe].cor}
                estilo={styles.cardResumo}
              >
                <Text
                  style={[
                    styles.valorResumo,
                    { color: cores.risco[item.classe].texto },
                  ]}
                >
                  {item.valor}
                </Text>

                <Text style={styles.rotuloResumo}>
                  {item.rotulo}
                </Text>
              </Card>
            ))}
          </View>


          {/* EXPORTAR */}

          <Botao
            titulo={exportando ? "Gerando CSV..." : "Exportar período em CSV"}
            icone="share-outline"
            tamanho="grande"
            carregando={exportando}
            desabilitado={ocorrenciasFiltradas.length === 0}
            onPress={exportarCSV}
            estilo={styles.botaoExportar}
          />

          <Text style={styles.ajudaExportar}>
            O arquivo inclui data, rodovia, KM, latitude, longitude,
            classificação, confiança, status e quem registrou.
          </Text>


          {/* LISTA */}

          <View style={styles.linhaTituloLista}>
            <Text
              style={[styles.tituloSecao, styles.semMargem]}
              accessibilityRole="header"
            >
              Ocorrências
            </Text>

            <Text style={styles.totalRegistros}>
              {ocorrenciasFiltradas.length} registros
            </Text>
          </View>

          {ocorrenciasFiltradas.length === 0 ? (
            <EstadoVazio
              icone="calendar-outline"
              titulo="Nenhuma ocorrência"
              texto="Não foram encontradas análises no período selecionado."
            />
          ) : (
            ocorrenciasFiltradas.map((ocorrencia, indice) => (
              <Card
                key={ocorrencia.id}
                corFaixa={cores.risco[ocorrencia.classe].cor}
                onPress={() =>
                  router.push({
                    pathname: "/trecho-detalhes",
                    params: { id: ocorrencia.id },
                  })
                }
                accessibilityLabel={`Prioridade ${indice + 1}: ${ocorrencia.rodovia}, KM ${ocorrencia.km}. Abrir detalhe.`}
                estilo={styles.itemLista}
              >
                <View style={styles.itemTopo}>
                  <View style={styles.posicao}>
                    <Text style={styles.posicaoTexto}>
                      {indice + 1}
                    </Text>
                  </View>

                  <View style={styles.flex}>
                    <Text style={styles.itemLocal}>
                      {ocorrencia.rodovia} · KM {ocorrencia.km}
                    </Text>

                    <Text style={styles.itemData}>
                      {formatarData(ocorrencia.data)} ·{" "}
                      {NOME_STATUS[ocorrencia.status]}
                    </Text>
                  </View>

                  <BadgeRisco classe={ocorrencia.classe} />
                </View>

                <Text style={styles.itemConfianca}>
                  {ocorrencia.origemClassificacao === "MANUAL"
                    ? "Classificação manual"
                    : `Confiança: ${(ocorrencia.confianca * 100).toFixed(1)}%`}
                </Text>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },

  flex: {
    flex: 1,
  },

  tituloSecao: {
    ...tipografia.secao,
    color: cores.texto,
    marginTop: espaco.xxl,
    marginBottom: espaco.md,
  },

  semMargem: {
    marginTop: 0,
    marginBottom: 0,
  },

  linhaDatas: {
    flexDirection: "row",
    gap: espaco.md,
  },

  campoData: {
    flex: 1,
    marginBottom: espaco.sm,
  },

  ajuda: {
    ...tipografia.pequeno,
    color: cores.textoSuave,
    marginBottom: espaco.md,
  },

  erroPeriodo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.xs + 2,
    backgroundColor: cores.perigoFundo,
    borderRadius: raio.sm,
    padding: espaco.sm + 2,
    marginBottom: espaco.md,
  },

  erroPeriodoTexto: {
    ...tipografia.pequeno,
    color: cores.perigo,
    fontWeight: "600",
    flex: 1,
  },

  linhaResumo: {
    flexDirection: "row",
    gap: espaco.sm + 2,
  },

  cardResumo: {
    flex: 1,
    paddingVertical: espaco.md,
    paddingHorizontal: espaco.md,
  },

  valorResumo: {
    ...tipografia.numero,
  },

  rotuloResumo: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
  },

  botaoExportar: {
    marginTop: espaco.xl,
  },

  ajudaExportar: {
    ...tipografia.pequeno,
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: espaco.sm,
  },

  linhaTituloLista: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: espaco.xxl,
    marginBottom: espaco.md,
  },

  totalRegistros: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
  },

  itemLista: {
    marginBottom: espaco.md,
  },

  itemTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.md,
  },

  posicao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.superficieSuave,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: "center",
    justifyContent: "center",
  },

  posicaoTexto: {
    ...tipografia.corpoForte,
    color: cores.texto,
  },

  itemLocal: {
    ...tipografia.corpoForte,
    fontSize: 17,
    color: cores.texto,
  },

  itemData: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    marginTop: 2,
  },

  itemConfianca: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    marginTop: espaco.sm,
    marginLeft: 36 + espaco.md,
  },
});
