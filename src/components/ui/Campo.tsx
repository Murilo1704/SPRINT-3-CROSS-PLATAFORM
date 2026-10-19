import { Ionicons } from "@expo/vector-icons";

import {
  Ref,
  useState,
} from "react";

import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import {
  ALVO_TOQUE,
  cores,
  espaco,
  raio,
  tipografia,
} from "../../theme";

import { NomeIcone } from "./Botao";


type Props = TextInputProps & {
  rotulo: string;
  icone?: NomeIcone;
  erro?: string | null;
  ajuda?: string;
  // Mostra o botão de olho para exibir/ocultar a senha
  senha?: boolean;
  obrigatorio?: boolean;
  estiloContainer?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
};


// ============================================================
// CAMPO DE TEXTO
// ============================================================

export default function Campo({
  rotulo,
  icone,
  erro,
  ajuda,
  senha = false,
  obrigatorio = false,
  estiloContainer,
  multiline,
  editable = true,
  ref,
  ...inputProps
}: Props) {
  const [focado, setFocado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const corBorda = erro
    ? cores.perigo
    : focado
      ? cores.primaria
      : cores.borda;

  return (
    <View style={[styles.container, estiloContainer]}>
      <Text style={styles.rotulo}>
        {rotulo}
        {obrigatorio && (
          <Text style={styles.obrigatorio}> *</Text>
        )}
      </Text>

      <View
        style={[
          styles.caixa,
          multiline && styles.caixaMultilinha,
          { borderColor: corBorda },
          focado && styles.caixaFocada,
          !editable && styles.caixaInativa,
        ]}
      >
        {icone && (
          <Ionicons
            name={icone}
            size={20}
            color={focado ? cores.primaria : cores.textoSuave}
            style={multiline ? styles.iconeMultilinha : undefined}
          />
        )}

        <TextInput
          ref={ref}
          style={[
            styles.input,
            multiline && styles.inputMultilinha,
          ]}
          placeholderTextColor={cores.textoSuave}
          secureTextEntry={senha && !senhaVisivel}
          multiline={multiline}
          editable={editable}
          accessibilityLabel={rotulo}
          {...inputProps}
          onFocus={(evento) => {
            setFocado(true);
            inputProps.onFocus?.(evento);
          }}
          onBlur={(evento) => {
            setFocado(false);
            inputProps.onBlur?.(evento);
          }}
        />

        {senha && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              senhaVisivel ? "Ocultar senha" : "Mostrar senha"
            }
            hitSlop={8}
            style={styles.botaoOlho}
            onPress={() => setSenhaVisivel((atual) => !atual)}
          >
            <Ionicons
              name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={cores.textoSecundario}
            />
          </Pressable>
        )}
      </View>

      {erro ? (
        <View style={styles.linhaErro}>
          <Ionicons
            name="alert-circle"
            size={16}
            color={cores.perigo}
          />
          <Text style={styles.erro}>{erro}</Text>
        </View>
      ) : (
        ajuda && <Text style={styles.ajuda}>{ajuda}</Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginBottom: espaco.lg,
  },

  rotulo: {
    ...tipografia.rotulo,
    color: cores.texto,
    marginBottom: espaco.sm - 2,
  },

  obrigatorio: {
    color: cores.perigo,
  },

  caixa: {
    minHeight: ALVO_TOQUE + 4,
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
    backgroundColor: cores.superficieSuave,
    borderWidth: 1.5,
    borderRadius: raio.md,
    paddingHorizontal: espaco.md,
  },

  caixaMultilinha: {
    alignItems: "flex-start",
    paddingVertical: espaco.sm,
  },

  caixaFocada: {
    backgroundColor: cores.superficie,
  },

  caixaInativa: {
    opacity: 0.6,
  },

  iconeMultilinha: {
    marginTop: espaco.sm,
  },

  input: {
    flex: 1,
    ...tipografia.corpo,
    color: cores.texto,
    paddingVertical: espaco.md,
  },

  inputMultilinha: {
    minHeight: 88,
    textAlignVertical: "top",
  },

  botaoOlho: {
    minWidth: 40,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  linhaErro: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.xs,
    marginTop: espaco.xs + 2,
  },

  erro: {
    ...tipografia.pequeno,
    color: cores.perigo,
    fontWeight: "600",
    flexShrink: 1,
  },

  ajuda: {
    ...tipografia.pequeno,
    color: cores.textoSuave,
    marginTop: espaco.xs + 2,
  },
});
