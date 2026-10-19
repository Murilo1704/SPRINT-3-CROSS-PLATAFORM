import {
  File as ArquivoLocal,
} from "expo-file-system";

import {
  Platform,
} from "react-native";

import {
  API_ANALISE_URL,
  API_LOCALIZACAO_URL,
} from "../config/api";

import {
  Localizacao,
  RespostaAPI,
  RespostaLocalizacao,
} from "../types/Analise";

import {
  garantirJpeg,
} from "../utils/imagem";


// ============================================================
// CHAMADAS À VERDESCAN-API
//
// O endereço vem de src/config/api.ts (EXPO_PUBLIC_API_URL ou a
// API pública no Railway). Nada aqui é obrigatório para o
// cadastro: se a API estiver fora, o operador classifica manualmente.
// ============================================================

const TIMEOUT_LOCALIZACAO_MS = 8000;

const TIMEOUT_ANALISE_MS = 120000;


// ============================================================
// MIME
// ============================================================

export function obterMimeType(
  uri: string
) {
  const endereco =
    uri.toLowerCase();

  if (endereco.includes(".png")) {
    return "image/png";
  }

  if (endereco.includes(".webp")) {
    return "image/webp";
  }

  if (
    endereco.includes(".heic") ||
    endereco.includes(".heif")
  ) {
    return "image/heic";
  }

  return "image/jpeg";
}


// ============================================================
// NOME DO ARQUIVO
// ============================================================

export function obterNomeArquivo(
  uri: string
) {
  const partes =
    uri.split("/");

  const ultimo =
    partes[partes.length - 1];

  if (
    ultimo &&
    ultimo.includes(".")
  ) {
    return ultimo;
  }

  return `verdescan_${Date.now()}.jpg`;
}


// ============================================================
// LOCALIZAR POR RODOVIA + KM
// ============================================================

export async function localizarPorRodoviaKm(
  rodoviaInformada: string,
  kmInformado: number
): Promise<{
  localizacao: Localizacao;
  qualidade: string;
}> {

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      TIMEOUT_LOCALIZACAO_MS
    );

  try {
    const resposta =
      await fetch(
        API_LOCALIZACAO_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            rodovia: rodoviaInformada
              .trim()
              .toUpperCase(),

            km: kmInformado,
          }),

          signal: controller.signal,
        }
      );

    if (!resposta.ok) {
      let mensagem =
        "Não foi possível localizar o trecho.";

      try {
        const erro =
          await resposta.json();

        mensagem =
          erro.detail ?? mensagem;

      } catch {
        // mantém mensagem padrão
      }

      throw new Error(mensagem);
    }

    const dados: RespostaLocalizacao =
      await resposta.json();

    return {
      localizacao: {
        latitude: dados.latitude,
        longitude: dados.longitude,
        precisao: null,
      },

      qualidade: dados.aproximada
        ? dados.qualidade
        : "REFERÊNCIA EXATA",
    };

  } finally {
    clearTimeout(timeout);
  }
}


// ============================================================
// ENVIAR FOTO PARA A IA (/analisar)
// ============================================================

export async function enviarFotoParaAPI(
  uriOriginal: string
): Promise<RespostaAPI> {

  // Segurança extra: a API não lê HEIC.
  const uri =
    await garantirJpeg(uriOriginal);

  const formData =
    new FormData();

  const nomeArquivo =
    obterNomeArquivo(uri);

  const mimeType =
    obterMimeType(uri);

  if (Platform.OS === "web") {
    const respostaArquivo =
      await fetch(uri);

    const blob =
      await respostaArquivo.blob();

    formData.append(
      "imagem",
      blob,
      nomeArquivo
    );

  } else {
    // Desde o SDK 57 o fetch do Expo não aceita mais o objeto
    // { uri, name, type } do React Native ("Unsupported FormDataPart
    // implementation"). Ele aceita qualquer objeto com bytes(), e
    // usa name/type no cabeçalho do arquivo (a API exige image/*).
    const arquivo =
      new ArquivoLocal(uri);

    formData.append(
      "imagem",
      {
        name: nomeArquivo,
        type: mimeType,
        bytes: () => arquivo.bytes(),
      } as any
    );
  }

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      TIMEOUT_ANALISE_MS
    );

  try {
    const resposta =
      await fetch(
        API_ANALISE_URL,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        }
      );

    if (!resposta.ok) {
      let detalhe =
        "Erro desconhecido";

      try {
        const erroJson =
          await resposta.json();

        detalhe =
          erroJson.detail ??
          JSON.stringify(erroJson);

      } catch {
        detalhe =
          await resposta.text();
      }

      throw new Error(
        `API ${resposta.status}: ${detalhe}`
      );
    }

    return await resposta.json();

  } finally {
    clearTimeout(timeout);
  }
}
