import {
  StyleSheet,
} from "react-native";


// ============================================================
// ESTILOS DA CLASSIFICAÇÃO MANUAL E DOS DETALHES DO REGISTRO
// ============================================================

export const extraStyles =
  StyleSheet.create({

    manualCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: "#D8E0DA",
      borderStyle: "dashed",
    },

    manualTitle: {
      fontSize: 15,
      fontWeight: "bold",
      color: "#1D2A21",
    },

    manualHelp: {
      marginTop: 5,
      marginBottom: 14,
      fontSize: 12,
      lineHeight: 18,
      color: "#667168",
    },

    manualButtons: {
      flexDirection: "row",
      gap: 8,
    },

    manualButton: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 6,
      alignItems: "center",
    },

    manualButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "bold",
    },

    manualButtonRange: {
      marginTop: 3,
      color: "#FFFFFF",
      fontSize: 11,
      opacity: 0.9,
    },

    changeButton: {
      backgroundColor: "#E5F2E9",
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
    },

    changeButtonText: {
      color: "#21894A",
      fontSize: 14,
      fontWeight: "bold",
    },

    multilineInput: {
      minHeight: 90,
      textAlignVertical: "top",
    },

  });
