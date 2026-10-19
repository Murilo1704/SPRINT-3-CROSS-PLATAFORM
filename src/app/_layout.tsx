import {
  Stack,
  router,
  useSegments,
} from "expo-router";

import { StatusBar } from "expo-status-bar";

import {
  useEffect,
  useRef,
} from "react";

import Carregando from "../components/ui/Carregando";

import {
  SessaoProvider,
  useSessao,
} from "../hooks/useSessao";

import { ehGestor } from "../services/auth";

import { cores } from "../theme";

import { mostrarMensagem } from "../utils/mensagem";


// Rotas que só o gestor pode abrir.
// Exportar CSV fica dentro de "prioridades".
const ROTAS_DO_GESTOR = [
  "prioridades",
];


// O expo-router já envolve o app em um SafeAreaProvider.
export default function RootLayout() {
  return (
    <SessaoProvider>
      <StatusBar style="light" />
      <Navegacao />
    </SessaoProvider>
  );
}


function Navegacao() {
  const segments = useSegments();

  const { usuario, carregando } = useSessao();

  // Evita mostrar o aviso duas vezes durante o redirecionamento.
  const avisoMostrado = useRef(false);


  // =========================================================
  // CONTROLAR ACESSO ÀS TELAS
  // =========================================================

  useEffect(() => {
    if (carregando) {
      return;
    }

    const rota: string =
      segments[0] ?? "";

    const estaNoLogin =
      rota === "login";

    // Não autenticado
    if (!usuario && !estaNoLogin) {
      router.replace("/login");
      return;
    }

    // Já autenticado e tentou abrir login
    if (usuario && estaNoLogin) {
      router.replace("/");
      return;
    }

    // Operador tentando abrir tela do gestor
    if (
      usuario &&
      ROTAS_DO_GESTOR.includes(rota) &&
      !ehGestor(usuario)
    ) {
      if (!avisoMostrado.current) {
        avisoMostrado.current = true;

        mostrarMensagem(
          "Acesso restrito",
          "Pontos prioritários e exportação CSV são exclusivos do gestor."
        );
      }

      router.replace("/");
      return;
    }

    avisoMostrado.current = false;

  }, [
    usuario,
    carregando,
    segments,
  ]);


  if (carregando) {
    return <Carregando telaCheia />;
  }


  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: cores.fundo,
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="index" />
      <Stack.Screen name="analise" />
      <Stack.Screen name="prioridades" />
      <Stack.Screen name="rodovias" />
      <Stack.Screen name="trecho-detalhes" />
    </Stack>
  );
}
