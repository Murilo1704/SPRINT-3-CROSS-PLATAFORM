import { Ionicons } from "@expo/vector-icons";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Botao from "../components/ui/Botao";
import Campo from "../components/ui/Campo";

import { useSessao } from "../hooks/useSessao";

import {
  fazerLogin,
  obterBloqueioLogin,
} from "../services/auth";

import {
  cores,
  espaco,
  raio,
  sombra,
  tipografia,
} from "../theme";

import { mostrarMensagem } from "../utils/mensagem";


function formatarContagem(
  milissegundos: number
) {
  const totalSegundos =
    Math.max(0, Math.ceil(milissegundos / 1000));

  const minutos = Math.floor(totalSegundos / 60);
  const segundos = String(totalSegundos % 60).padStart(2, "0");

  return `${minutos}:${segundos}`;
}


export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  const { definirUsuario } = useSessao();

  const campoSenha = useRef<TextInput>(null);

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Timestamp até quando o login está bloqueado
  const [bloqueadoAte, setBloqueadoAte] =
    useState<number | null>(null);

  const [agora, setAgora] = useState(Date.now());


  // =========================================================
  // BLOQUEIO (5 tentativas erradas → 1 minuto)
  // =========================================================

  useEffect(() => {
    obterBloqueioLogin().then(setBloqueadoAte);
  }, []);

  useEffect(() => {
    if (!bloqueadoAte) {
      return;
    }

    const timer = setInterval(() => {
      const instante = Date.now();
      setAgora(instante);

      if (instante >= bloqueadoAte) {
        setBloqueadoAte(null);
        setErro("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [bloqueadoAte]);

  const bloqueado =
    bloqueadoAte !== null && bloqueadoAte > agora;


  // =========================================================
  // LOGIN
  // =========================================================

  async function entrar() {
    if (bloqueado || carregando) {
      return;
    }

    if (!usuario.trim() || !senha) {
      setErro("Informe o usuário e a senha.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const resultado =
        await fazerLogin(usuario, senha);

      if (!resultado.sucesso) {
        setErro(resultado.mensagem);
        setSenha("");
        setAgora(Date.now());
        setBloqueadoAte(resultado.bloqueadoAte);
        return;
      }

      // O _layout.tsx leva para a Home ao detectar o usuário.
      definirUsuario(resultado.usuario);

    } catch (error) {
      console.error(error);

      mostrarMensagem(
        "Erro",
        "Não foi possível realizar o login."
      );

    } finally {
      setCarregando(false);
    }
  }


  return (
    <View style={styles.tela}>
      <View style={styles.circuloTopo} />
      <View style={styles.circuloBase} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.conteudo,
            {
              paddingTop: insets.top + espaco.xxl,
              paddingBottom: insets.bottom + espaco.xxl,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* MARCA */}

          <View style={styles.marca}>
            <View style={styles.logo}>
              <Ionicons
                name="leaf"
                size={40}
                color={cores.sobrePrimaria}
              />
            </View>

            <Text
              style={styles.nomeApp}
              accessibilityRole="header"
            >
              VerdeScan
            </Text>

            <Text style={styles.slogan}>
              Monitoramento inteligente de vegetação
            </Text>
          </View>


          {/* FORMULÁRIO */}

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>
              Entrar
            </Text>

            <Text style={styles.cardTexto}>
              Use o usuário e a senha fornecidos pela Motiva.
            </Text>

            <Campo
              rotulo="Usuário"
              icone="person-outline"
              value={usuario}
              onChangeText={(texto) => {
                setUsuario(texto);
                setErro("");
              }}
              placeholder="Digite seu usuário"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => campoSenha.current?.focus()}
              editable={!carregando}
            />

            <Campo
              ref={campoSenha}
              rotulo="Senha"
              icone="lock-closed-outline"
              senha
              value={senha}
              onChangeText={(texto) => {
                setSenha(texto);
                setErro("");
              }}
              placeholder="Digite sua senha"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={entrar}
              editable={!carregando}
            />

            {bloqueado ? (
              <View
                style={[styles.aviso, styles.avisoBloqueio]}
                accessibilityLiveRegion="polite"
              >
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={cores.aviso}
                />

                <Text style={[styles.avisoTexto, { color: cores.aviso }]}>
                  Muitas tentativas incorretas. Tente novamente em{" "}
                  <Text style={styles.contagem}>
                    {formatarContagem((bloqueadoAte ?? 0) - agora)}
                  </Text>
                  .
                </Text>
              </View>
            ) : (
              erro.length > 0 && (
                <View
                  style={[styles.aviso, styles.avisoErro]}
                  accessibilityLiveRegion="polite"
                >
                  <Ionicons
                    name="alert-circle"
                    size={22}
                    color={cores.perigo}
                  />

                  <Text style={[styles.avisoTexto, { color: cores.perigo }]}>
                    {erro}
                  </Text>
                </View>
              )
            )}

            <Botao
              titulo={
                bloqueado
                  ? `Aguarde ${formatarContagem((bloqueadoAte ?? 0) - agora)}`
                  : "Entrar"
              }
              icone={bloqueado ? "lock-closed" : "log-in-outline"}
              tamanho="grande"
              carregando={carregando}
              desabilitado={bloqueado}
              onPress={entrar}
              estilo={styles.botaoEntrar}
            />
          </View>

          <View style={styles.rodape}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={cores.textoSobreEscuroSuave}
            />

            <Text style={styles.rodapeTexto}>
              Acesso restrito a operadores e gestores da Motiva
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.primariaEscura,
    overflow: "hidden",
  },

  flex: {
    flex: 1,
  },

  circuloTopo: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -140,
    right: -110,
  },

  circuloBase: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(83,190,120,0.16)",
    bottom: -110,
    left: -90,
  },

  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: espaco.xl,
  },

  marca: {
    alignItems: "center",
    marginBottom: espaco.xxl,
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: raio.xl,
    backgroundColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espaco.md,
    ...sombra.destaque,
  },

  nomeApp: {
    ...tipografia.tituloGrande,
    fontSize: 32,
    lineHeight: 38,
    color: cores.textoSobreEscuro,
  },

  slogan: {
    ...tipografia.corpo,
    color: cores.textoSobreEscuroSuave,
    marginTop: espaco.xs,
    textAlign: "center",
  },

  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    backgroundColor: cores.superficie,
    borderRadius: raio.xl,
    padding: espaco.xxl,
    ...sombra.card,
  },

  cardTitulo: {
    ...tipografia.titulo,
    color: cores.texto,
  },

  cardTexto: {
    ...tipografia.corpo,
    color: cores.textoSecundario,
    marginTop: espaco.xs,
    marginBottom: espaco.xl,
  },

  aviso: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
    borderRadius: raio.md,
    padding: espaco.md,
    marginBottom: espaco.lg,
  },

  avisoErro: {
    backgroundColor: cores.perigoFundo,
  },

  avisoBloqueio: {
    backgroundColor: cores.avisoFundo,
  },

  avisoTexto: {
    ...tipografia.rotulo,
    flex: 1,
  },

  contagem: {
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },

  botaoEntrar: {
    marginTop: espaco.xs,
  },

  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaco.xs + 2,
    marginTop: espaco.xxl,
  },

  rodapeTexto: {
    ...tipografia.pequeno,
    color: cores.textoSobreEscuroSuave,
  },
});
