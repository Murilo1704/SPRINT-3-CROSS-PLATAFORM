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
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import MonitoramentoMap from "../components/MonitoramentoMap";
import Botao, { NomeIcone } from "../components/ui/Botao";
import Cabecalho from "../components/ui/Cabecalho";
import Card from "../components/ui/Card";

import { useSessao } from "../hooks/useSessao";

import {
  ehGestor,
  NOME_PERFIL,
} from "../services/auth";

import { carregarOcorrencias } from "../services/storage";

import {
  cores,
  espaco,
  raio,
  tipografia,
} from "../theme";

import { Ocorrencia } from "../types/Ocorrencia";

import { confirmarAcao } from "../utils/mensagem";


function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}


export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const { usuario, sair } = useSessao();

  const gestor = ehGestor(usuario);

  const [ocorrencias, setOcorrencias] =
    useState<Ocorrencia[]>([]);


  // =========================================================
  // CARREGAR DADOS
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      carregarOcorrencias().then(setOcorrencias);
    }, [])
  );


  // =========================================================
  // LOGOUT
  // O _layout.tsx leva para o login quando o usuário sai.
  // =========================================================

  function confirmarLogout() {
    confirmarAcao(
      "Sair",
      "Deseja sair do VerdeScan?",
      "Sair",
      sair
    );
  }


  // =========================================================
  // CONTADORES
  // =========================================================

  const totalMonitorados = ocorrencias.length;

  const totalCriticos = ocorrencias.filter(
    (ocorrencia) => ocorrencia.classe === "CRITICO"
  ).length;

  const totalPendentes = ocorrencias.filter(
    (ocorrencia) => ocorrencia.status !== "CONCLUIDO"
  ).length;

  const totalRodovias = new Set(
    ocorrencias.map((ocorrencia) =>
      ocorrencia.rodovia.trim().toUpperCase()
    )
  ).size;


  // =========================================================
  // INTERFACE
  // =========================================================

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={{
        paddingBottom: insets.bottom + espaco.xxxl,
      }}
    >
      <Cabecalho
        titulo="VerdeScan"
        subtitulo="Monitoramento inteligente de vegetação"
        acaoDireita={
          <Botao
            titulo="Sair"
            icone="log-out-outline"
            variante="claro"
            onPress={confirmarLogout}
          />
        }
      >
        {usuario && (
          <View style={styles.usuarioBox}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>
                {iniciais(usuario.nome)}
              </Text>
            </View>

            <View style={styles.usuarioInfo}>
              <Text
                style={styles.usuarioNome}
                numberOfLines={1}
              >
                {usuario.nome}
              </Text>

              <View style={styles.usuarioLinha}>
                <View
                  style={[
                    styles.badgePerfil,
                    gestor && styles.badgeGestor,
                  ]}
                >
                  <Ionicons
                    name={gestor ? "briefcase-outline" : "construct-outline"}
                    size={14}
                    color={gestor ? cores.primariaEscura : cores.sobrePrimaria}
                  />

                  <Text
                    style={[
                      styles.badgePerfilTexto,
                      gestor && styles.badgeGestorTexto,
                    ]}
                  >
                    {NOME_PERFIL[usuario.perfil]}
                  </Text>
                </View>

                {usuario.equipe && (
                  <Text style={styles.usuarioEquipe}>
                    {usuario.equipe}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </Cabecalho>


      <View style={styles.corpo}>

        {/* VISÃO GERAL */}

        <Text
          style={styles.tituloSecao}
          accessibilityRole="header"
        >
          Visão geral
        </Text>

        <View style={styles.linhaResumo}>
          <CardResumo
            icone="layers-outline"
            valor={totalMonitorados}
            rotulo="Pontos monitorados"
            cor={cores.primaria}
            fundo={cores.primariaClara}
          />

          <CardResumo
            icone="alert-circle"
            valor={totalCriticos}
            rotulo="Pontos críticos"
            cor={cores.risco.CRITICO.texto}
            fundo={cores.risco.CRITICO.fundo}
          />

          <CardResumo
            icone="time-outline"
            valor={totalPendentes}
            rotulo="Pendentes de poda"
            cor={cores.risco.ATENCAO.texto}
            fundo={cores.risco.ATENCAO.fundo}
          />
        </View>


        {/* AÇÃO PRINCIPAL */}

        <Botao
          titulo="Nova análise"
          icone="camera"
          tamanho="grande"
          onPress={() => router.push("/analise")}
          estilo={styles.botaoNovaAnalise}
        />


        {/* ATALHOS */}

        <Text
          style={styles.tituloSecao}
          accessibilityRole="header"
        >
          Gestão das ocorrências
        </Text>

        <Atalho
          icone="map-outline"
          titulo="Trechos monitorados"
          descricao="Histórico agrupado por rodovia e detalhe de cada ocorrência."
          extra={`${totalRodovias} ${totalRodovias === 1 ? "rodovia registrada" : "rodovias registradas"}`}
          cor={cores.primaria}
          fundo={cores.primariaClara}
          onPress={() => router.push("/rodovias")}
        />

        {gestor && (
          <Atalho
            icone="flag-outline"
            titulo="Pontos prioritários"
            descricao="Ocorrências por período, ordenadas por risco, com exportação CSV."
            extra={`${totalCriticos} ${totalCriticos === 1 ? "ponto crítico" : "pontos críticos"}`}
            cor={cores.risco.CRITICO.texto}
            fundo={cores.risco.CRITICO.fundo}
            onPress={() => router.push("/prioridades")}
          />
        )}


        {/* MAPA */}

        <Text
          style={styles.tituloSecao}
          accessibilityRole="header"
        >
          Mapa de monitoramento
        </Text>

        <MonitoramentoMap ocorrencias={ocorrencias} />

        <View style={styles.legenda}>
          {(["NORMAL", "ATENCAO", "CRITICO"] as const).map((classe) => (
            <View
              key={classe}
              style={styles.legendaItem}
            >
              <View
                style={[
                  styles.legendaPonto,
                  { backgroundColor: cores.risco[classe].cor },
                ]}
              />

              <Text style={styles.legendaTexto}>
                {classe === "NORMAL"
                  ? "Normal"
                  : classe === "ATENCAO"
                    ? "Atenção"
                    : "Crítico"}
              </Text>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}


// ============================================================
// CARD DE RESUMO
// ============================================================

function CardResumo({
  icone,
  valor,
  rotulo,
  cor,
  fundo,
}: {
  icone: NomeIcone;
  valor: number;
  rotulo: string;
  cor: string;
  fundo: string;
}) {
  return (
    <Card
      estilo={styles.cardResumo}
    >
      <View
        style={[styles.iconeResumo, { backgroundColor: fundo }]}
      >
        <Ionicons
          name={icone}
          size={20}
          color={cor}
        />
      </View>

      <Text
        style={[styles.valorResumo, { color: cor }]}
        accessibilityLabel={`${valor} ${rotulo}`}
      >
        {valor}
      </Text>

      <Text style={styles.rotuloResumo}>
        {rotulo}
      </Text>
    </Card>
  );
}


// ============================================================
// ATALHO
// ============================================================

function Atalho({
  icone,
  titulo,
  descricao,
  extra,
  cor,
  fundo,
  onPress,
}: {
  icone: NomeIcone;
  titulo: string;
  descricao: string;
  extra: string;
  cor: string;
  fundo: string;
  onPress: () => void;
}) {
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={titulo}
      estilo={styles.atalho}
    >
      <View
        style={[styles.iconeAtalho, { backgroundColor: fundo }]}
      >
        <Ionicons
          name={icone}
          size={28}
          color={cor}
        />
      </View>

      <View style={styles.atalhoTexto}>
        <Text style={styles.atalhoTitulo}>
          {titulo}
        </Text>

        <Text style={styles.atalhoDescricao}>
          {descricao}
        </Text>

        <Text style={[styles.atalhoExtra, { color: cor }]}>
          {extra}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color={cores.textoSuave}
      />
    </Card>
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

  usuarioBox: {
    marginTop: espaco.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.md,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: raio.lg,
    padding: espaco.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarTexto: {
    ...tipografia.corpoForte,
    color: cores.sobrePrimaria,
  },

  usuarioInfo: {
    flex: 1,
  },

  usuarioNome: {
    ...tipografia.corpoForte,
    fontSize: 17,
    color: cores.textoSobreEscuro,
  },

  usuarioLinha: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: espaco.sm,
    marginTop: espaco.xs,
  },

  badgePerfil: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.xs,
    backgroundColor: cores.primaria,
    borderRadius: raio.pilula,
    paddingHorizontal: espaco.sm + 2,
    paddingVertical: 3,
  },

  badgeGestor: {
    backgroundColor: cores.destaque,
  },

  badgePerfilTexto: {
    fontSize: 13,
    fontWeight: "800",
    color: cores.sobrePrimaria,
  },

  badgeGestorTexto: {
    color: cores.primariaEscura,
  },

  usuarioEquipe: {
    ...tipografia.pequeno,
    color: cores.textoSobreEscuroSuave,
  },

  tituloSecao: {
    ...tipografia.secao,
    color: cores.texto,
    marginTop: espaco.xxl,
    marginBottom: espaco.md,
  },

  linhaResumo: {
    flexDirection: "row",
    gap: espaco.sm + 2,
  },

  cardResumo: {
    flex: 1,
    padding: espaco.md,
  },

  iconeResumo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espaco.sm,
  },

  valorResumo: {
    ...tipografia.numero,
  },

  rotuloResumo: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    marginTop: 2,
  },

  botaoNovaAnalise: {
    marginTop: espaco.xl,
  },

  atalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.md,
    marginBottom: espaco.md,
    minHeight: 96,
  },

  iconeAtalho: {
    width: 56,
    height: 56,
    borderRadius: raio.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  atalhoTexto: {
    flex: 1,
  },

  atalhoTitulo: {
    ...tipografia.corpoForte,
    fontSize: 17,
    color: cores.texto,
  },

  atalhoDescricao: {
    ...tipografia.pequeno,
    color: cores.textoSecundario,
    marginTop: 2,
  },

  atalhoExtra: {
    ...tipografia.pequeno,
    fontWeight: "700",
    marginTop: espaco.xs,
  },

  legenda: {
    flexDirection: "row",
    justifyContent: "center",
    gap: espaco.xl,
    marginTop: espaco.md,
  },

  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.xs + 2,
  },

  legendaPonto: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  legendaTexto: {
    ...tipografia.rotulo,
    color: cores.textoSecundario,
  },
});
