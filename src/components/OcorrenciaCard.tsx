
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ocorrencia } from "../types/Ocorrencia";

interface OcorrenciaCardProps {
  ocorrencia: Ocorrencia;
  onPress?: () => void;
}

/**
 * Mapear classe para cor
 * NORMAL -> Verde (#2E9D50)
 * ATENCAO -> Amarelo (#E0A82E)
 * CRITICO -> Vermelho (#D63E3E)
 */
function obterCoresPorClasse(
  classe: Ocorrencia["classe"]
): {
  bg: string;
  border: string;
  badge: string;
  text: string;
} {
  switch (classe) {
    case "CRITICO":
      return {
        bg: "#FDEAEA",
        border: "#D63E3E",
        badge: "#D63E3E",
        text: "#D63E3E",
      };
    case "ATENCAO":
      return {
        bg: "#FEF5E6",
        border: "#E0A82E",
        badge: "#E0A82E",
        text: "#E0A82E",
      };
    case "NORMAL":
    default:
      return {
        bg: "#E8F5F0",
        border: "#2E9D50",
        badge: "#2E9D50",
        text: "#2E9D50",
      };
  }
}

/**
 * Traduzir classe para português
 */
function traduzirClasse(
  classe: Ocorrencia["classe"]
): string {
  switch (classe) {
    case "CRITICO":
      return "CRÍTICO";
    case "ATENCAO":
      return "ATENÇÃO";
    case "NORMAL":
    default:
      return "NORMAL";
  }
}

/**
 * Formatar data e hora
 */
function formatarDataHora(dataIso: string): {
  data: string;
  hora: string;
} {
  try {
    const data = new Date(dataIso);
    return {
      data: data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      hora: data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch {
    return { data: dataIso, hora: "" };
  }
}

/**
 * Componente principal
 */
export default function OcorrenciaCard({
  ocorrencia,
  onPress,
}: OcorrenciaCardProps) {
  const cores = obterCoresPorClasse(ocorrencia.classe);
  const { data, hora } = formatarDataHora(
    ocorrencia.data
  );

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cores.bg,
          borderLeftColor: cores.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* ========== CABEÇALHO: BADGE + DATA ========== */}
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            { backgroundColor: cores.badge },
          ]}
        >
          <Text style={styles.badgeText}>
            {traduzirClasse(ocorrencia.classe)}
          </Text>
        </View>

        <Text style={styles.dataTexto}>
          {data}
        </Text>
      </View>

      {/* ========== CONTEÚDO PRINCIPAL ========== */}
      <View style={styles.conteudo}>
        {/* Rodovia */}
        <Text
          style={[
            styles.rodovia,
            { color: cores.text },
          ]}
        >
          {ocorrencia.rodovia}
        </Text>

        {/* KM */}
        <Text style={styles.km}>
          KM {ocorrencia.km.toFixed(1)}
        </Text>

        {/* Descrição (se existir) */}
        {ocorrencia.descricao && (
          <Text
            style={styles.descricao}
            numberOfLines={1}
          >
            {ocorrencia.descricao}
          </Text>
        )}

        {/* Rodapé: Confiança + Hora */}
        <View style={styles.rodape}>
          <Text style={styles.confianca}>
            Confiança: {(ocorrencia.confianca * 100).toFixed(0)}%
          </Text>

          {hora && (
            <Text style={styles.hora}>
              {hora}
            </Text>
          )}
        </View>
      </View>

      {/* ========== IMAGEM MINIATURA ========== */}
      {ocorrencia.imagem && (
        <View style={styles.imagemContainer}>
          <Image
            source={{ uri: ocorrencia.imagem }}
            style={styles.imagemThumbnail}
            onError={() => {
              // Se falhar ao carregar, apenas ignora
            }}
          />
        </View>
      )}

      {/* ========== SETA (indicador clicável) ========== */}
      <View style={styles.seta}>
        <Text
          style={[
            styles.setaTexto,
            { color: cores.text },
          ]}
        >
          →
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Card container
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 5,
    padding: 14,
    backgroundColor: "#FFFFFF",

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  // Cabeçalho com badge
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  dataTexto: {
    fontSize: 12,
    color: "#7A8A82",
    fontWeight: "500",
  },

  // Conteúdo principal
  conteudo: {
    marginBottom: 10,
  },

  rodovia: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  km: {
    fontSize: 13,
    color: "#6B756E",
    marginBottom: 8,
  },

  descricao: {
    fontSize: 12,
    color: "#5B665E",
    fontStyle: "italic",
    marginBottom: 6,
  },

  rodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  confianca: {
    fontSize: 12,
    color: "#5B665E",
    fontWeight: "500",
  },

  hora: {
    fontSize: 11,
    color: "#AAB3A9",
  },

  // Imagem miniatura
  imagemContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },

  imagemThumbnail: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },

  // Seta de navegação
  seta: {
    position: "absolute",
    right: 14,
    top: "50%",
    marginTop: -10,
  },

  setaTexto: {
    fontSize: 20,
    fontWeight: "300",
  },
});
