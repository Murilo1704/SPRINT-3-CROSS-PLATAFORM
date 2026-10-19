import { router } from "expo-router";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { useState } from "react";

import {
  Alert,
  Platform,
} from "react-native";

import {
  riscoPorClasse,
  violaContrato,
} from "../constants/risco";

import {
  adicionarOcorrencia,
} from "../services/storage";

import {
  enviarFotoParaAPI,
  localizarPorRodoviaKm,
} from "../services/verdescanApi";

import {
  Localizacao,
  OrigemFoto,
  OrigemLocalizacao,
  RespostaAPI,
  ResultadoAnalise,
} from "../types/Analise";

import {
  ClasseRisco,
  Ocorrencia,
} from "../types/Ocorrencia";

import {
  extrairLocalizacaoExif,
} from "../utils/exif";

import {
  garantirJpeg,
} from "../utils/imagem";


const DICA_MANUAL =
  "Sem a IA, você pode classificar o risco manualmente logo abaixo.";

const TIMEOUT_GPS_MS = 15000;


// ============================================================
// AUXILIARES
// ============================================================

function mostrarMensagem(
  titulo: string,
  mensagem: string
) {
  if (Platform.OS === "web") {
    alert(`${titulo}\n\n${mensagem}`);
    return;
  }

  Alert.alert(titulo, mensagem);
}


function comTimeout<T>(
  promessa: Promise<T>,
  ms: number,
  mensagem: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(mensagem)),
      ms
    );

    promessa.then(
      (valor) => {
        clearTimeout(timer);
        resolve(valor);
      },
      (erro) => {
        clearTimeout(timer);
        reject(erro);
      }
    );
  });
}


function converterResposta(
  resposta: RespostaAPI,
  inconclusivo: boolean
): ResultadoAnalise {
  return {
    classe: inconclusivo
      ? "INCONCLUSIVO"
      : resposta.classe,

    confianca: inconclusivo
      ? 0
      : resposta.confianca,

    confiancaPercentual: inconclusivo
      ? 0
      : resposta.confianca_percentual ??
        resposta.confianca * 100,

    nivelConfianca:
      resposta.nivel_confianca ??
      (inconclusivo ? "BAIXA" : "MODERADA"),

    revisaoRecomendada: inconclusivo
      ? true
      : resposta.revisao_recomendada ?? false,

    motivoRevisao: inconclusivo
      ? resposta.motivo_revisao ??
        "Pouca vegetação de interesse foi identificada na imagem."
      : resposta.motivo_revisao ?? null,

    vegetacaoTotal:
      resposta.vegetacao_total ?? 0,

    vegetacaoInteresse:
      resposta.vegetacao_interesse ??
      resposta.vegetacao_total ??
      0,

    arvore:
      resposta.arvore ?? 0,

    background:
      resposta.background ?? 0,

    pAcimaNormal:
      resposta.ordinal?.p_acima_normal ?? 0,

    pAcimaAtencao:
      resposta.ordinal?.p_acima_atencao ?? 0,

    limiarAtencao:
      resposta.ordinal?.limiar_atencao ?? 0.5,

    limiarCritico:
      resposta.ordinal?.limiar_critico ?? 0.65,

    probabilidadeNormal:
      resposta.probabilidades?.NORMAL ?? 0,

    probabilidadeAtencao:
      resposta.probabilidades?.ATENCAO ?? 0,

    probabilidadeCritico:
      resposta.probabilidades?.CRITICO ?? 0,
  };
}


function mensagemDeErroDaAnalise(
  erro: any
) {
  if (erro?.name === "AbortError") {
    return "A análise demorou demais. Verifique se a API está ligada.";
  }

  const texto =
    String(erro?.message ?? "");

  if (
    texto.includes("Network request failed") ||
    texto.includes("Failed to fetch") ||
    texto.includes("Load failed")
  ) {
    return "Não foi possível conectar à API de IA.";
  }

  return texto || "Não foi possível realizar a análise.";
}


// ============================================================
// HOOK
// ============================================================

export function useAnalise() {

  // ----------------------------------------------------------
  // FOTO
  // ----------------------------------------------------------

  const [fotoUri, setFotoUri] =
    useState<string | null>(null);

  const [origemFoto, setOrigemFoto] =
    useState<OrigemFoto>(null);


  // ----------------------------------------------------------
  // LOCALIZAÇÃO
  // ----------------------------------------------------------

  const [localizacao, setLocalizacao] =
    useState<Localizacao | null>(null);

  const [origemLocalizacao, setOrigemLocalizacao] =
    useState<OrigemLocalizacao>(null);

  const [qualidadeLocalizacao, setQualidadeLocalizacao] =
    useState<string | null>(null);

  const [rodovia, setRodovia] =
    useState("");

  const [km, setKm] =
    useState("");

  const [latitudeManual, setLatitudeManual] =
    useState("");

  const [longitudeManual, setLongitudeManual] =
    useState("");


  // ----------------------------------------------------------
  // DETALHES DO REGISTRO
  // ----------------------------------------------------------

  const [local, setLocal] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [equipe, setEquipe] =
    useState("");

  const [veiculo, setVeiculo] =
    useState("");


  // ----------------------------------------------------------
  // CLASSIFICAÇÃO E CONTROLE
  // ----------------------------------------------------------

  const [resultado, setResultado] =
    useState<ResultadoAnalise | null>(null);

  const [analisando, setAnalisando] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const [buscandoLocalizacao, setBuscandoLocalizacao] =
    useState(false);


// ============================================================
// LIMPAR RESULTADO
//
// A classificação manual não depende da foto nem do trecho,
// então é mantida quando o operador corrige rodovia/KM.
// ============================================================

  function limparResultado() {
    setResultado((atual) =>
      atual?.manual ? atual : null
    );
  }


// ============================================================
// LIMPAR LOCALIZAÇÃO CALCULADA
// ============================================================

  function limparLocalizacaoCalculada() {
    if (
      origemLocalizacao === "RODOVIA_KM" ||
      origemLocalizacao === "MANUAL"
    ) {
      setLocalizacao(null);
      setOrigemLocalizacao(null);
      setQualidadeLocalizacao(null);
    }
  }


// ============================================================
// ALTERAR CAMPOS DO TRECHO / COORDENADAS
// ============================================================

  function alterarRodovia(texto: string) {
    setRodovia(texto);
    limparResultado();
    limparLocalizacaoCalculada();
  }

  function alterarKm(texto: string) {
    setKm(texto);
    limparResultado();
    limparLocalizacaoCalculada();
  }

  function alterarLatitudeManual(texto: string) {
    setLatitudeManual(texto);
    limparResultado();
    limparLocalizacaoCalculada();
  }

  function alterarLongitudeManual(texto: string) {
    setLongitudeManual(texto);
    limparResultado();
    limparLocalizacaoCalculada();
  }


// ============================================================
// FOTO SELECIONADA (câmera ou galeria)
// ============================================================

  async function registrarFoto(
    asset: ImagePicker.ImagePickerAsset,
    origem: Exclude<OrigemFoto, null>
  ) {
    const uri =
      await garantirJpeg(
        asset.uri,
        asset.mimeType
      );

    setFotoUri(uri);
    setOrigemFoto(origem);

    // Uma foto nova invalida o resultado anterior.
    setResultado(null);

    setLocalizacao(null);
    setOrigemLocalizacao(null);
    setQualidadeLocalizacao(null);
  }


// ============================================================
// CÂMERA
// ============================================================

  async function tirarFoto() {
    try {
      const permissao =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissao.granted) {
        mostrarMensagem(
          "Permissão necessária",
          "O VerdeScan precisa acessar a câmera. Libere o acesso nos Ajustes do aparelho (Expo Go → Câmera) ou escolha uma foto da galeria."
        );
        return;
      }

      const resultadoFoto =
        await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          quality: 0.8,
          exif: true,
        });

      if (resultadoFoto.canceled) {
        return;
      }

      await registrarFoto(
        resultadoFoto.assets[0],
        "camera"
      );

    } catch (erro) {
      console.log("Erro ao abrir a câmera:", erro);

      mostrarMensagem(
        "Câmera indisponível",
        "Não foi possível abrir a câmera neste aparelho. Escolha uma foto da galeria."
      );
      return;
    }


    // --------------------------------------------------------
    // TENTA GPS ATUAL
    // --------------------------------------------------------

    try {
      setBuscandoLocalizacao(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      const posicao =
        await comTimeout(
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          }),
          TIMEOUT_GPS_MS,
          "GPS demorou demais"
        );

      setLocalizacao({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        precisao: posicao.coords.accuracy,
      });

      setOrigemLocalizacao("GPS_ATUAL");
      setQualidadeLocalizacao("GPS");

    } catch (erro) {
      console.log("GPS atual indisponível:", erro);

    } finally {
      setBuscandoLocalizacao(false);
    }
  }


// ============================================================
// GALERIA
// ============================================================

  async function selecionarFoto() {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        mostrarMensagem(
          "Permissão necessária",
          "O VerdeScan precisa acessar suas fotos. Libere o acesso nos Ajustes do aparelho (Expo Go → Fotos)."
        );
        return;
      }

      const resultadoFoto =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.8,
          exif: true,
        });

      if (resultadoFoto.canceled) {
        return;
      }

      const asset =
        resultadoFoto.assets[0];

      // O GPS é lido do EXIF original, antes de converter HEIC.
      const gpsFoto =
        extrairLocalizacaoExif(
          asset.exif as
            | Record<string, any>
            | null
            | undefined
        );

      await registrarFoto(asset, "galeria");

      if (gpsFoto) {
        setLocalizacao(gpsFoto);
        setOrigemLocalizacao("FOTO");
        setQualidadeLocalizacao("GPS DA FOTO");

        mostrarMensagem(
          "Localização encontrada",
          "O VerdeScan encontrou as coordenadas salvas na própria foto."
        );
        return;
      }

      mostrarMensagem(
        "Foto sem GPS",
        "Nenhum problema. Informe a rodovia e o KM. O VerdeScan estimará automaticamente onde fica o ponto. Latitude e longitude também podem ser informadas opcionalmente."
      );

    } catch (erro) {
      console.log("Erro ao abrir a galeria:", erro);

      mostrarMensagem(
        "Galeria indisponível",
        "Não foi possível abrir a galeria de fotos."
      );
    }
  }


// ============================================================
// KM
// ============================================================

  function obterKmNumerico() {
    const texto =
      km.trim().replace(",", ".");

    if (!texto) {
      return null;
    }

    const valor =
      Number(texto);

    if (
      !Number.isFinite(valor) ||
      valor < 0
    ) {
      return null;
    }

    return valor;
  }


// ============================================================
// COORDENADAS MANUAIS
// ============================================================

  function obterLocalizacaoManual():
    Localizacao | null {

    const latTexto =
      latitudeManual.trim();

    const lngTexto =
      longitudeManual.trim();

    // Nenhum dos dois preenchidos
    if (!latTexto && !lngTexto) {
      return null;
    }

    // Apenas um preenchido
    if (!latTexto || !lngTexto) {
      throw new Error(
        "Para usar coordenadas manuais, informe latitude e longitude."
      );
    }

    const latitude =
      Number(latTexto.replace(",", "."));

    const longitude =
      Number(lngTexto.replace(",", "."));

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      throw new Error("Latitude inválida.");
    }

    if (
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error("Longitude inválida.");
    }

    return {
      latitude,
      longitude,
      precisao: null,
    };
  }


// ============================================================
// RESOLVER LOCALIZAÇÃO
// 1. GPS da foto  2. GPS atual da câmera
// 3. coordenadas informadas  4. rodovia + KM (API)
// ============================================================

  async function resolverLocalizacao():
    Promise<Localizacao> {

    if (
      (origemLocalizacao === "FOTO" ||
        origemLocalizacao === "GPS_ATUAL") &&
      localizacao
    ) {
      return localizacao;
    }

    const manual =
      obterLocalizacaoManual();

    if (manual) {
      setLocalizacao(manual);
      setOrigemLocalizacao("MANUAL");
      setQualidadeLocalizacao("COORDENADAS INFORMADAS");

      return manual;
    }

    const kmNumerico =
      obterKmNumerico();

    if (!rodovia.trim()) {
      throw new Error("Informe a rodovia.");
    }

    if (kmNumerico === null) {
      throw new Error("Informe um KM válido.");
    }

    setBuscandoLocalizacao(true);

    try {
      const resultadoLocalizacao =
        await localizarPorRodoviaKm(
          rodovia,
          kmNumerico
        );

      setLocalizacao(resultadoLocalizacao.localizacao);
      setOrigemLocalizacao("RODOVIA_KM");
      setQualidadeLocalizacao(resultadoLocalizacao.qualidade);

      return resultadoLocalizacao.localizacao;

    } finally {
      setBuscandoLocalizacao(false);
    }
  }


// ============================================================
// LOCALIZAÇÃO PARA SALVAR (funciona sem a API)
// 1. localização já resolvida  2. coordenadas informadas
// 3. rodovia + KM pela API     4. GPS do aparelho
// ============================================================

  async function obterLocalizacaoParaSalvar():
    Promise<Localizacao> {

    if (localizacao) {
      return localizacao;
    }

    // Lança erro se as coordenadas digitadas forem inválidas.
    const manual =
      obterLocalizacaoManual();

    if (manual) {
      setLocalizacao(manual);
      setOrigemLocalizacao("MANUAL");
      setQualidadeLocalizacao("COORDENADAS INFORMADAS");

      return manual;
    }

    try {
      return await resolverLocalizacao();

    } catch (erro) {
      console.log("Localização pela API indisponível:", erro);
    }

    try {
      setBuscandoLocalizacao(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const posicao =
          await comTimeout(
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            }),
            TIMEOUT_GPS_MS,
            "GPS demorou demais"
          );

        const gps: Localizacao = {
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
          precisao: posicao.coords.accuracy,
        };

        setLocalizacao(gps);
        setOrigemLocalizacao("GPS_ATUAL");
        setQualidadeLocalizacao("GPS");

        return gps;
      }

    } catch (erro) {
      console.log("GPS do aparelho indisponível:", erro);

    } finally {
      setBuscandoLocalizacao(false);
    }

    throw new Error(
      "Não foi possível descobrir a localização automaticamente (API e GPS indisponíveis). Informe a latitude e a longitude no passo 3. Localização."
    );
  }


// ============================================================
// ANALISAR COM A IA
// ============================================================

  async function analisarOcorrencia() {

    if (!fotoUri) {
      mostrarMensagem(
        "Foto necessária",
        "Selecione ou tire uma foto."
      );
      return;
    }

    if (!rodovia.trim()) {
      mostrarMensagem(
        "Rodovia necessária",
        "Informe a rodovia."
      );
      return;
    }

    if (obterKmNumerico() === null) {
      mostrarMensagem(
        "KM inválido",
        "Informe um KM válido."
      );
      return;
    }

    try {
      // Coordenadas digitadas erradas param aqui, antes da rede.
      obterLocalizacaoManual();

    } catch (erro: any) {
      mostrarMensagem(
        "Coordenadas inválidas",
        erro?.message ?? "Verifique latitude e longitude."
      );
      return;
    }

    try {
      setAnalisando(true);
      setResultado(null);

      // Primeiro tenta resolver a localização. Se a API de
      // localização falhar, a ocorrência ainda pode ser salva:
      // a localização é resolvida de novo na hora de salvar.
      try {
        await resolverLocalizacao();
      } catch (erro) {
        console.log("Localização não resolvida antes da IA:", erro);
      }

      const resposta =
        await enviarFotoParaAPI(fotoUri);

      console.log("Resposta VerdeScan:", resposta);

      if (
        resposta.status === "inconclusivo" ||
        resposta.classe === "INCONCLUSIVO"
      ) {
        setResultado(
          converterResposta(resposta, true)
        );

        mostrarMensagem(
          "Análise inconclusiva",
          `A IA não encontrou vegetação suficiente para classificar o trecho. ${DICA_MANUAL}`
        );
        return;
      }

      if (
        resposta.classe !== "NORMAL" &&
        resposta.classe !== "ATENCAO" &&
        resposta.classe !== "CRITICO"
      ) {
        throw new Error(
          "A API retornou uma classe inválida."
        );
      }

      setResultado(
        converterResposta(resposta, false)
      );

    } catch (erro: any) {
      console.log("Erro na análise:", erro);

      mostrarMensagem(
        "Erro",
        `${mensagemDeErroDaAnalise(erro)}\n\n${DICA_MANUAL}`
      );

    } finally {
      setAnalisando(false);
    }
  }


// ============================================================
// CLASSIFICAÇÃO MANUAL (sem IA)
// ============================================================

  function classificarManualmente(
    classe: ClasseRisco
  ) {
    setResultado({
      classe,
      confianca: 0,
      confiancaPercentual: 0,
      nivelConfianca: "MANUAL",
      revisaoRecomendada: false,
      motivoRevisao: null,
      vegetacaoTotal: 0,
      vegetacaoInteresse: 0,
      arvore: 0,
      background: 0,
      pAcimaNormal: 0,
      pAcimaAtencao: 0,
      limiarAtencao: 0,
      limiarCritico: 0,
      probabilidadeNormal: 0,
      probabilidadeAtencao: 0,
      probabilidadeCritico: 0,
      manual: true,
    });
  }

  function trocarClassificacaoManual() {
    setResultado(null);
  }


// ============================================================
// SALVAR
// ============================================================

  async function salvarOcorrencia() {

    if (
      !resultado ||
      resultado.classe === "INCONCLUSIVO"
    ) {
      mostrarMensagem(
        "Classificação necessária",
        "Analise a foto com a IA ou classifique o risco manualmente antes de salvar."
      );
      return;
    }

    if (!rodovia.trim()) {
      mostrarMensagem(
        "Rodovia necessária",
        "Informe a rodovia no passo 2."
      );
      return;
    }

    const kmNumerico =
      obterKmNumerico();

    if (kmNumerico === null) {
      mostrarMensagem(
        "KM inválido",
        "Informe um KM válido no passo 2."
      );
      return;
    }

    // A foto só é obrigatória quando a classificação veio da IA.
    if (!resultado.manual && !fotoUri) {
      mostrarMensagem(
        "Foto necessária",
        "A classificação por IA precisa da foto."
      );
      return;
    }

    const classe =
      resultado.classe;

    try {
      setSalvando(true);

      let localSalvar: Localizacao;

      try {
        localSalvar =
          await obterLocalizacaoParaSalvar();

      } catch (erro: any) {
        mostrarMensagem(
          "Localização necessária",
          erro?.message ??
            "Informe a latitude e a longitude no passo 3."
        );
        return;
      }

      const manual =
        resultado.manual === true;

      const novaOcorrencia: Ocorrencia = {
        id: `${Date.now()}`,
        data: new Date().toISOString(),

        rodovia: rodovia.trim().toUpperCase(),
        km: kmNumerico,
        latitude: localSalvar.latitude,
        longitude: localSalvar.longitude,
        local: local.trim() || undefined,

        classe,
        risco: riscoPorClasse(classe),
        confianca: manual ? 0 : resultado.confianca,
        origemClassificacao: manual ? "MANUAL" : "IA",

        descricao: descricao.trim() || undefined,
        equipe: equipe.trim() || undefined,
        veiculo: veiculo.trim().toUpperCase() || undefined,

        status: "PENDENTE",

        imagem: fotoUri ?? undefined,
      };

      await adicionarOcorrencia(novaOcorrencia);

      const avisoContrato =
        violaContrato(classe)
          ? "\n\nAtenção: este trecho já está fora do limite do contrato. Priorize a poda."
          : "";

      mostrarMensagem(
        "Ocorrência salva",
        `A ocorrência foi adicionada ao mapa do VerdeScan.${avisoContrato}`
      );

      // Volta para a Home. O useFocusEffect recarrega o mapa.
      router.replace("/");

    } catch (erro: any) {
      console.log("Erro ao salvar:", erro);

      mostrarMensagem(
        "Erro",
        erro?.message ?? "Não foi possível salvar."
      );

    } finally {
      setSalvando(false);
    }
  }


// ============================================================
// CONTROLES
// ============================================================

  const kmValido =
    obterKmNumerico() !== null;

  const podeAnalisar =
    fotoUri !== null &&
    rodovia.trim().length > 0 &&
    kmValido &&
    !analisando;

  const podeSalvar =
    resultado !== null &&
    resultado.classe !== "INCONCLUSIVO";


// ============================================================
// TEXTO ORIGEM LOCALIZAÇÃO
// ============================================================

  function textoOrigemLocalizacao() {
    if (origemLocalizacao === "FOTO") {
      return "GPS da própria foto";
    }

    if (origemLocalizacao === "GPS_ATUAL") {
      return "GPS atual do aparelho";
    }

    if (origemLocalizacao === "MANUAL") {
      return "Coordenadas informadas pelo operador";
    }

    if (origemLocalizacao === "RODOVIA_KM") {
      return "Estimativa baseada na rodovia e no KM";
    }

    return "Será definida ao analisar ou ao salvar";
  }


  return {
    // foto
    fotoUri,
    origemFoto,
    tirarFoto,
    selecionarFoto,

    // trecho
    rodovia,
    km,
    alterarRodovia,
    alterarKm,

    // localização
    localizacao,
    qualidadeLocalizacao,
    latitudeManual,
    longitudeManual,
    alterarLatitudeManual,
    alterarLongitudeManual,
    buscandoLocalizacao,
    textoOrigemLocalizacao,

    // classificação
    resultado,
    setResultado,
    analisando,
    podeAnalisar,
    analisarOcorrencia,
    classificarManualmente,
    trocarClassificacaoManual,

    // detalhes do registro
    local,
    setLocal,
    descricao,
    setDescricao,
    equipe,
    setEquipe,
    veiculo,
    setVeiculo,

    // salvar
    salvando,
    podeSalvar,
    salvarOcorrencia,
  };
}


export type AnaliseState =
  ReturnType<typeof useAnalise>;
