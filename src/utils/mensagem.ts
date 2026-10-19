import {
  Alert,
  Platform,
} from "react-native";


// ============================================================
// ALERTAS (iPhone/Android usam Alert; navegador usa alert/confirm)
// ============================================================

export function mostrarMensagem(
  titulo: string,
  mensagem: string
) {
  if (Platform.OS === "web") {
    alert(`${titulo}\n\n${mensagem}`);
    return;
  }

  Alert.alert(titulo, mensagem);
}


export function confirmarAcao(
  titulo: string,
  mensagem: string,
  textoConfirmar: string,
  onConfirmar: () => void
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) {
      onConfirmar();
    }
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: "Cancelar", style: "cancel" },
    {
      text: textoConfirmar,
      style: "destructive",
      onPress: onConfirmar,
    },
  ]);
}
