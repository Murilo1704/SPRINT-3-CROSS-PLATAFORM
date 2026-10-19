import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Crypto from "expo-crypto";


// ============================================================
// LOGIN COM DOIS PERFIS (funciona offline)
//
// OPERADOR → registra ocorrências, vê trechos e detalhe,
//            marca a poda como concluída.
// GESTOR   → tudo do operador + pontos prioritários,
//            exportação CSV e exclusão de ocorrências.
//
// As senhas NÃO ficam no código: guardamos só o hash
// SHA-256 de "salt:senha", com um salt fixo por usuário.
// As credenciais de demonstração estão no README.
// ============================================================

const AUTH_KEY =
  "@verdescan_usuario_logado";

const TENTATIVAS_KEY =
  "@verdescan_tentativas_login";

const MAX_TENTATIVAS = 5;

const TEMPO_BLOQUEIO_MS = 60 * 1000;

export const MENSAGEM_LOGIN_INVALIDO =
  "Usuário ou senha inválidos";


export type PerfilUsuario =
  | "OPERADOR"
  | "GESTOR";

export type UsuarioLogado = {
  id: string;
  nome: string;
  usuario: string;
  perfil: PerfilUsuario;
  equipe?: string;
};

type UsuarioCadastrado = UsuarioLogado & {
  salt: string;
  hashSenha: string;
};


const USUARIOS: UsuarioCadastrado[] = [
  {
    id: "gestor",
    nome: "Gestor Motiva",
    usuario: "gestor",
    perfil: "GESTOR",
    salt: "vs-gestor-4b9e2c71",
    hashSenha:
      "e089ef436f21bd51dcf8b4fe280bf4c1c0a13e3be886883443b617dc0f79d3f2",
  },
  {
    id: "operador",
    nome: "Operador de Campo",
    usuario: "operador",
    perfil: "OPERADOR",
    equipe: "Equipe 03",
    salt: "vs-operador-d83a5f02",
    hashSenha:
      "22117d1887f487c001d6e43928e0d8d455f4225713246f715b383b2380823102",
  },
];


export const NOME_PERFIL: Record<PerfilUsuario, string> = {
  OPERADOR: "Operador",
  GESTOR: "Gestor",
};


export function ehGestor(
  usuario: UsuarioLogado | null
) {
  return usuario?.perfil === "GESTOR";
}


// Dados públicos do usuário (sem salt e hash)
function semCredenciais(
  usuario: UsuarioCadastrado
): UsuarioLogado {
  const { salt, hashSenha, ...publico } = usuario;
  return publico;
}


async function gerarHash(
  salt: string,
  senha: string
) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${senha}`
  );
}


// ============================================================
// TENTATIVAS ERRADAS
// Salvas no aparelho: fechar o app não zera o bloqueio.
// ============================================================

type EstadoTentativas = {
  falhas: number;
  bloqueadoAte: number | null;
};

async function lerTentativas(): Promise<EstadoTentativas> {
  try {
    const dados =
      await AsyncStorage.getItem(TENTATIVAS_KEY);

    if (!dados) {
      return { falhas: 0, bloqueadoAte: null };
    }

    const estado = JSON.parse(dados);

    return {
      falhas: Number(estado.falhas) || 0,
      bloqueadoAte:
        typeof estado.bloqueadoAte === "number"
          ? estado.bloqueadoAte
          : null,
    };
  } catch {
    return { falhas: 0, bloqueadoAte: null };
  }
}

async function salvarTentativas(
  estado: EstadoTentativas
) {
  await AsyncStorage.setItem(
    TENTATIVAS_KEY,
    JSON.stringify(estado)
  );
}


// Retorna até quando (timestamp) o login está bloqueado,
// ou null se pode tentar.
export async function obterBloqueioLogin():
  Promise<number | null> {

  const estado = await lerTentativas();

  if (
    estado.bloqueadoAte &&
    estado.bloqueadoAte > Date.now()
  ) {
    return estado.bloqueadoAte;
  }

  // Bloqueio venceu: começa a contar de novo.
  if (estado.bloqueadoAte) {
    await salvarTentativas({ falhas: 0, bloqueadoAte: null });
  }

  return null;
}


// ============================================================
// LOGIN
// ============================================================

export type ResultadoLogin =
  | {
      sucesso: true;
      usuario: UsuarioLogado;
    }
  | {
      sucesso: false;
      mensagem: string;
      bloqueadoAte: number | null;
    };


export async function fazerLogin(
  usuario: string,
  senha: string
): Promise<ResultadoLogin> {

  const bloqueadoAte =
    await obterBloqueioLogin();

  if (bloqueadoAte) {
    return {
      sucesso: false,
      mensagem: "Muitas tentativas incorretas.",
      bloqueadoAte,
    };
  }

  const usuarioNormalizado =
    usuario.trim().toLowerCase();

  const cadastrado =
    USUARIOS.find(
      (item) => item.usuario === usuarioNormalizado
    );

  // Calcula o hash mesmo se o usuário não existir, para não
  // revelar pelo tempo de resposta quais usuários existem.
  const hash = await gerarHash(
    cadastrado?.salt ?? "vs-inexistente",
    senha
  );

  if (
    !cadastrado ||
    hash !== cadastrado.hashSenha
  ) {
    const estado = await lerTentativas();
    const falhas = estado.falhas + 1;

    const novoBloqueio =
      falhas >= MAX_TENTATIVAS
        ? Date.now() + TEMPO_BLOQUEIO_MS
        : null;

    await salvarTentativas({
      falhas: novoBloqueio ? 0 : falhas,
      bloqueadoAte: novoBloqueio,
    });

    return {
      sucesso: false,
      mensagem: MENSAGEM_LOGIN_INVALIDO,
      bloqueadoAte: novoBloqueio,
    };
  }

  const dados = semCredenciais(cadastrado);

  await AsyncStorage.removeItem(TENTATIVAS_KEY);

  await AsyncStorage.setItem(
    AUTH_KEY,
    JSON.stringify(dados)
  );

  return { sucesso: true, usuario: dados };
}


// ============================================================
// SESSÃO SALVA
//
// Só aceita usuários que ainda existem no app. Uma sessão
// antiga (ex.: o login "master" das versões anteriores) é
// descartada e o app volta para a tela de login.
// ============================================================

export async function carregarUsuarioLogado():
  Promise<UsuarioLogado | null> {

  try {
    const dados =
      await AsyncStorage.getItem(AUTH_KEY);

    if (!dados) {
      return null;
    }

    const salvo = JSON.parse(dados);

    const cadastrado =
      USUARIOS.find(
        (item) =>
          item.id === salvo?.id &&
          item.perfil === salvo?.perfil
      );

    if (!cadastrado) {
      await AsyncStorage.removeItem(AUTH_KEY);
      return null;
    }

    return semCredenciais(cadastrado);

  } catch {
    return null;
  }
}


// ============================================================
// LOGOUT
// ============================================================

export async function fazerLogout() {
  await AsyncStorage.removeItem(AUTH_KEY);
}
