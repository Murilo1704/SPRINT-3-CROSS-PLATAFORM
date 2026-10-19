import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AnaliseHeader from "../components/analise/AnaliseHeader";
import BotoesAcao from "../components/analise/BotoesAcao";
import ClassificacaoManual from "../components/analise/ClassificacaoManual";
import SecaoClassificacao from "../components/analise/SecaoClassificacao";
import SecaoFoto from "../components/analise/SecaoFoto";
import SecaoLocalizacao from "../components/analise/SecaoLocalizacao";
import SecaoRegistro from "../components/analise/SecaoRegistro";
import SecaoTrecho from "../components/analise/SecaoTrecho";
import { styles } from "../components/analise/styles";

import { useAnalise } from "../hooks/useAnalise";


// ============================================================
// NOVA ANÁLISE
// Estado e regras ficam em src/hooks/useAnalise.ts;
// cada seção da tela fica em src/components/analise/.
// ============================================================

export default function AnaliseScreen() {
  const analise = useAnalise();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AnaliseHeader analise={analise} />
          <SecaoFoto analise={analise} />
          <SecaoTrecho analise={analise} />
          <SecaoLocalizacao analise={analise} />
          <SecaoClassificacao analise={analise} />
          <ClassificacaoManual analise={analise} />
          <SecaoRegistro analise={analise} />
          <BotoesAcao analise={analise} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
