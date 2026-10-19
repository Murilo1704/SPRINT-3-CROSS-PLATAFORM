import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

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

import { espaco } from "../theme";


// ============================================================
// NOVA ANÁLISE
// Estado e regras ficam em src/hooks/useAnalise.ts;
// cada seção da tela fica em src/components/analise/.
// ============================================================

export default function AnaliseScreen() {
  const insets = useSafeAreaInsets();

  const analise = useAnalise();

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
        <AnaliseHeader analise={analise} />

        <View style={styles.corpo}>
          <SecaoFoto analise={analise} />
          <SecaoTrecho analise={analise} />
          <SecaoLocalizacao analise={analise} />
          <SecaoClassificacao analise={analise} />
          <ClassificacaoManual analise={analise} />
          <SecaoRegistro analise={analise} />
          <BotoesAcao analise={analise} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
