import {
  StyleSheet,
} from "react-native";


// ============================================================
// ESTILOS DA TELA "NOVA ANÁLISE"
// (mesmo StyleSheet que ficava em src/app/analise.tsx)
// ============================================================

export const styles =
  StyleSheet.create({

    container: {
      flex: 1,

      backgroundColor:
        "#F4F7F4",
    },


    content: {
      paddingBottom:
        50,
    },


    header: {
      backgroundColor:
        "#164B2A",

      paddingHorizontal:
        20,

      paddingTop:
        28,

      paddingBottom:
        26,
    },


    backButton: {
      color:
        "#D8E7DC",

      fontSize:
        16,

      marginBottom:
        16,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize:
        26,

      fontWeight:
        "bold",
    },


    subtitle: {
      marginTop:
        5,

      fontSize:
        14,

      color:
        "#D8E7DC",
    },


    section: {
      marginTop:
        24,

      paddingHorizontal:
        20,
    },


    sectionTitle: {
      fontSize:
        19,

      fontWeight:
        "bold",

      color:
        "#1D2A21",

      marginBottom:
        12,
    },


    card: {
      backgroundColor:
        "#FFFFFF",

      borderRadius:
        16,

      padding:
        22,

      alignItems:
        "center",
    },


    formCard: {
      alignItems:
        "stretch",
    },


    icon: {
      fontSize:
        38,

      textAlign:
        "center",

      marginBottom:
        10,
    },


    cardTitle: {
      fontSize:
        17,

      fontWeight:
        "bold",

      color:
        "#1D2A21",

      textAlign:
        "center",

      marginTop:
        10,
    },


    cardText: {
      marginTop:
        7,

      fontSize:
        14,

      color:
        "#667168",

      textAlign:
        "center",

      lineHeight:
        20,
    },


    previewImage: {
      width:
        "100%",

      height:
        220,

      borderRadius:
        12,

      marginBottom:
        14,
    },


    successText: {
      fontSize:
        15,

      fontWeight:
        "bold",

      color:
        "#21894A",

      textAlign:
        "center",
    },


    smallText: {
      marginTop:
        5,

      color:
        "#6B756E",

      fontSize:
        12,

      textAlign:
        "center",
    },


    primaryButton: {
      marginTop:
        18,

      backgroundColor:
        "#21894A",

      borderRadius:
        10,

      paddingVertical:
        13,

      paddingHorizontal:
        25,

      alignItems:
        "center",
    },


    primaryButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "bold",
    },


    secondaryButton: {
      marginTop:
        12,

      backgroundColor:
        "#E5F2E9",

      borderRadius:
        10,

      paddingVertical:
        12,

      paddingHorizontal:
        22,

      alignItems:
        "center",
    },


    secondaryButtonText: {
      color:
        "#21894A",

      fontSize:
        14,

      fontWeight:
        "bold",
    },


    inputLabel: {
      fontSize:
        14,

      fontWeight:
        "bold",

      color:
        "#1D2A21",

      marginBottom:
        7,
    },


    secondInputLabel: {
      marginTop:
        18,
    },


    input: {
      width:
        "100%",

      backgroundColor:
        "#F4F7F4",

      borderWidth:
        1,

      borderColor:
        "#D8E0DA",

      borderRadius:
        10,

      paddingHorizontal:
        14,

      paddingVertical:
        13,

      fontSize:
        16,

      color:
        "#1D2A21",
    },


    locationStatus: {
      backgroundColor:
        "#EAF5ED",

      borderRadius:
        12,

      padding:
        14,
    },


    locationStatusTitle: {
      color:
        "#164B2A",

      fontSize:
        14,

      fontWeight:
        "bold",
    },


    locationStatusText: {
      marginTop:
        5,

      color:
        "#526157",

      fontSize:
        12,

      lineHeight:
        17,
    },


    qualityText: {
      marginTop:
        5,

      color:
        "#21894A",

      fontSize:
        11,

      fontWeight:
        "600",
    },


    coordinatesBox: {
      marginTop:
        12,

      backgroundColor:
        "#F4F7F4",

      padding:
        12,

      borderRadius:
        10,
    },


    coordinateText: {
      color:
        "#526157",

      fontSize:
        12,

      marginVertical:
        2,
    },


    optionalBox: {
      marginTop:
        18,

      borderTopWidth:
        1,

      borderTopColor:
        "#E1E7E2",

      paddingTop:
        18,
    },


    optionalTitle: {
      color:
        "#1D2A21",

      fontSize:
        14,

      fontWeight:
        "bold",
    },


    optionalHelp: {
      color:
        "#778078",

      fontSize:
        12,

      lineHeight:
        18,

      marginTop:
        5,

      marginBottom:
        16,
    },


    loadingLocation: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginTop:
        15,

      gap:
        8,
    },


    loadingLocationText: {
      color:
        "#21894A",

      fontSize:
        12,

      fontWeight:
        "600",
    },


    resultLabel: {
      color:
        "#6B756E",

      fontSize:
        13,
    },


    resultBadge: {
      marginTop:
        12,

      paddingHorizontal:
        22,

      paddingVertical:
        10,

      borderRadius:
        24,
    },


    resultNormal: {
      backgroundColor:
        "#2E9D50",
    },


    resultAttention: {
      backgroundColor:
        "#E0A82E",
    },


    resultCritical: {
      backgroundColor:
        "#D63E3E",
    },


    resultInconclusive: {
      backgroundColor:
        "#7A817C",
    },


    resultBadgeText: {
      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "bold",
    },


    confidence: {
      color:
        "#526157",

      fontSize:
        14,

      fontWeight:
        "600",

      marginTop:
        10,
    },


    aiBox: {
      width:
        "100%",

      backgroundColor:
        "#F4F7F4",

      borderRadius:
        12,

      padding:
        15,

      marginTop:
        20,
    },


    aiText: {
      color:
        "#526157",

      fontSize:
        12,

      marginVertical:
        3,
    },


    confidenceLevel: {
      color:
        "#21894A",

      fontSize:
        12,

      fontWeight:
        "700",

      marginTop:
        4,
    },


    reviewBox: {
      width:
        "100%",

      backgroundColor:
        "#FFF7E3",

      borderWidth:
        1,

      borderColor:
        "#E8C86A",

      borderRadius:
        12,

      padding:
        14,

      marginTop:
        16,
    },


    reviewTitle: {
      color:
        "#8A6210",

      fontSize:
        13,

      fontWeight:
        "bold",
    },


    reviewText: {
      color:
        "#745C28",

      fontSize:
        12,

      lineHeight:
        18,

      marginTop:
        5,
    },


    metricsTitle: {
      color:
        "#164B2A",

      fontSize:
        14,

      fontWeight:
        "bold",

      marginBottom:
        10,
    },


    metricRow: {
      width:
        "100%",

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginVertical:
        4,
    },


    metricRowSpacing: {
      marginTop:
        12,
    },


    metricLabel: {
      flex:
        1,

      color:
        "#526157",

      fontSize:
        12,

      paddingRight:
        12,
    },


    metricValue: {
      color:
        "#1D2A21",

      fontSize:
        12,

      fontWeight:
        "700",
    },


    ordinalBox: {
      width:
        "100%",

      backgroundColor:
        "#EDF5EF",

      borderRadius:
        12,

      padding:
        15,

      marginTop:
        14,

      borderWidth:
        1,

      borderColor:
        "#D2E4D7",
    },


    ordinalTitle: {
      color:
        "#164B2A",

      fontSize:
        14,

      fontWeight:
        "bold",
    },


    ordinalHelp: {
      color:
        "#667168",

      fontSize:
        11,

      lineHeight:
        17,

      marginTop:
        5,

      marginBottom:
        10,
    },


    thresholdText: {
      color:
        "#778078",

      fontSize:
        10,

      marginTop:
        2,
    },


    probabilityBox: {
      width:
        "100%",

      backgroundColor:
        "#F8F9F8",

      borderRadius:
        12,

      padding:
        15,

      marginTop:
        14,

      borderWidth:
        1,

      borderColor:
        "#E1E7E2",
    },


    probabilityTitle: {
      color:
        "#1D2A21",

      fontSize:
        13,

      fontWeight:
        "bold",
    },


    probabilityHelp: {
      color:
        "#7A817C",

      fontSize:
        10,

      lineHeight:
        15,

      marginTop:
        4,

      marginBottom:
        8,
    },


    rules: {
      color:
        "#778078",

      fontSize:
        12,

      lineHeight:
        19,

      textAlign:
        "center",

      marginTop:
        20,
    },


    analyzeButton: {
      marginHorizontal:
        20,

      marginTop:
        28,

      backgroundColor:
        "#21894A",

      paddingVertical:
        16,

      borderRadius:
        14,

      alignItems:
        "center",
    },


    disabledButton: {
      backgroundColor:
        "#A7B6AA",
    },


    analyzeButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "bold",
    },


    saveButton: {
      marginHorizontal:
        20,

      marginTop:
        28,

      backgroundColor:
        "#164B2A",

      paddingVertical:
        16,

      borderRadius:
        14,

      alignItems:
        "center",
    },


    saveButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "bold",
    },


    secondaryBottomButton: {
      marginHorizontal:
        20,

      marginTop:
        20,

      backgroundColor:
        "#E5F2E9",

      paddingVertical:
        15,

      borderRadius:
        14,

      alignItems:
        "center",
    },


    secondaryBottomButtonText: {
      color:
        "#21894A",

      fontSize:
        16,

      fontWeight:
        "bold",
    },

  });
