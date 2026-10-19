import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  gerarDadosIniciais,
} from "../data/dadosIniciais";

import {
  Ocorrencia,
} from "../types/Ocorrencia";


// ============================================================
// CHAVES
// ============================================================

const STORAGE_KEY =
  "@verdescan_ocorrencias";


// Marca que os dados de exemplo já foram gravados uma vez.
// Se o usuário apagar tudo depois, a lista fica vazia
// (os exemplos NÃO são recriados).

const DADOS_INICIAIS_KEY =
  "@verdescan_dados_iniciais_v1";


// ============================================================
// RETENÇÃO
// ============================================================

const MESES_RETENCAO = 6;


// ============================================================
// DADOS DE EXEMPLO NA PRIMEIRA ABERTURA
// ============================================================

async function gravarDadosIniciaisSeNecessario() {
  try {
    const jaGravados =
      await AsyncStorage.getItem(
        DADOS_INICIAIS_KEY
      );


    if (jaGravados) {
      return;
    }


    const dados =
      await AsyncStorage.getItem(
        STORAGE_KEY
      );


    let existentes: unknown = [];

    try {
      existentes =
        dados ? JSON.parse(dados) : [];
    } catch {
      existentes = [];
    }


    // Só grava os exemplos se ainda não houver nada válido salvo.

    if (
      normalizarLista(existentes)
        .length === 0
    ) {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          gerarDadosIniciais()
        )
      );
    }


    await AsyncStorage.setItem(
      DADOS_INICIAIS_KEY,
      "CONCLUIDO"
    );

  } catch (error) {
    console.error(
      "Erro ao gravar dados iniciais:",
      error
    );
  }
}


// ============================================================
// VERIFICAR SE A OCORRÊNCIA EXPIROU
// ============================================================

function ocorrenciaAindaValida(
  ocorrencia: Ocorrencia
) {
  const dataOcorrencia =
    new Date(
      ocorrencia.data
    );


  // Se houver algum registro antigo com data inválida,
  // preferimos NÃO apagar automaticamente.

  if (
    Number.isNaN(
      dataOcorrencia.getTime()
    )
  ) {
    return true;
  }


  const dataLimite =
    new Date();


  dataLimite.setMonth(
    dataLimite.getMonth() -
      MESES_RETENCAO
  );


  return (
    dataOcorrencia.getTime() >=
    dataLimite.getTime()
  );
}


// ============================================================
// VALIDAR REGISTROS CARREGADOS
//
// Protege as telas contra dados antigos ou corrompidos
// (ex.: registros de versões anteriores sem "rodovia").
// Registros sem id, rodovia ou classe válida são descartados;
// números inválidos viram 0 e status inválido vira PENDENTE.
// ============================================================

const CLASSES_VALIDAS = [
  "NORMAL",
  "ATENCAO",
  "CRITICO",
];

const STATUS_VALIDOS = [
  "PENDENTE",
  "EM_ANDAMENTO",
  "CONCLUIDO",
];


function numeroOuZero(
  valor: unknown
) {
  const numero =
    Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}


function normalizarOcorrencia(
  item: any
): Ocorrencia | null {

  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }


  const rodovia =
    typeof item.rodovia === "string"
      ? item.rodovia.trim()
      : "";


  if (
    item.id === undefined ||
    item.id === null ||
    item.id === "" ||
    !rodovia ||
    !CLASSES_VALIDAS.includes(
      item.classe
    )
  ) {
    return null;
  }


  return {
    ...item,

    id:
      String(item.id),

    data:
      typeof item.data === "string"
        ? item.data
        : new Date().toISOString(),

    rodovia,

    km:
      numeroOuZero(item.km),

    latitude:
      numeroOuZero(item.latitude),

    longitude:
      numeroOuZero(item.longitude),

    confianca:
      numeroOuZero(item.confianca),

    status:
      STATUS_VALIDOS.includes(
        item.status
      )
        ? item.status
        : "PENDENTE",
  };
}


function normalizarLista(
  dados: unknown
): Ocorrencia[] {

  if (
    !Array.isArray(dados)
  ) {
    return [];
  }


  return dados
    .map(
      normalizarOcorrencia
    )
    .filter(
      (
        ocorrencia
      ): ocorrencia is Ocorrencia =>
        ocorrencia !== null
    );
}


// ============================================================
// SALVAR LISTA COMPLETA
// ============================================================

export async function salvarOcorrencias(
  ocorrencias: Ocorrencia[]
) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        ocorrencias
      )
    );

  } catch (error) {
    console.error(
      "Erro ao salvar ocorrências:",
      error
    );

    throw error;
  }
}


// ============================================================
// CARREGAR
//
// Também executa:
// 1. gravação dos dados de exemplo na primeira abertura;
// 2. limpeza de registros com mais de 6 meses.
// ============================================================

export async function carregarOcorrencias():
  Promise<Ocorrencia[]> {

  try {
    // --------------------------------------------------------
    // DADOS DE EXEMPLO (somente uma vez)
    // --------------------------------------------------------

    await gravarDadosIniciaisSeNecessario();


    // --------------------------------------------------------
    // CARREGAR STORAGE
    // --------------------------------------------------------

    const dados =
      await AsyncStorage.getItem(
        STORAGE_KEY
      );


    if (!dados) {
      return [];
    }


    // --------------------------------------------------------
    // VALIDAR + APAGAR AUTOMATICAMENTE > 6 MESES
    // --------------------------------------------------------

    const ocorrenciasValidas =
      normalizarLista(
        JSON.parse(
          dados
        )
      ).filter(
        ocorrenciaAindaValida
      );


    // Se algum registro expirou ou foi corrigido/descartado,
    // atualiza o AsyncStorage automaticamente.

    const dadosValidos =
      JSON.stringify(
        ocorrenciasValidas
      );


    if (
      dadosValidos !==
      dados
    ) {
      await salvarOcorrencias(
        ocorrenciasValidas
      );


      console.log(
        "Ocorrências antigas ou inválidas foram ajustadas automaticamente."
      );
    }


    return ocorrenciasValidas;

  } catch (error) {
    console.error(
      "Erro ao carregar ocorrências:",
      error
    );


    return [];
  }
}


// ============================================================
// ADICIONAR
// ============================================================

export async function adicionarOcorrencia(
  ocorrencia: Ocorrencia
) {
  const ocorrencias =
    await carregarOcorrencias();


  const novaLista = [
    ...ocorrencias,
    ocorrencia,
  ];


  await salvarOcorrencias(
    novaLista
  );
}


// ============================================================
// REMOVER UMA OCORRÊNCIA
// ============================================================

export async function removerOcorrencia(
  id: string
) {
  const ocorrencias =
    await carregarOcorrencias();


  const novaLista =
    ocorrencias.filter(
      (ocorrencia) =>
        ocorrencia.id !== id
    );


  await salvarOcorrencias(
    novaLista
  );


  return novaLista;
}


// ============================================================
// ATUALIZAR UMA OCORRÊNCIA
// ============================================================

export async function atualizarOcorrencia(
  ocorrenciaAtualizada:
    Ocorrencia
) {
  const ocorrencias =
    await carregarOcorrencias();


  const novaLista =
    ocorrencias.map(
      (ocorrencia) =>
        ocorrencia.id ===
        ocorrenciaAtualizada.id
          ? ocorrenciaAtualizada
          : ocorrencia
    );


  await salvarOcorrencias(
    novaLista
  );


  return novaLista;
}


// ============================================================
// APAGAR TODAS
//
// Mantive essa função porque pode ser útil depois
// para testes ou uma tela administrativa.
// ============================================================

export async function limparTodasOcorrencias() {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([])
    );


    console.log(
      "✅ Todas as ocorrências foram removidas."
    );

  } catch (error) {
    console.error(
      "Erro ao limpar ocorrências:",
      error
    );

    throw error;
  }
}


// ============================================================
// RESTAURAR DADOS DE EXEMPLO
//
// Substitui a lista atual pelas ocorrências de exemplo,
// com datas recalculadas a partir de hoje.
// ============================================================

export async function restaurarDadosIniciais() {
  const dados =
    gerarDadosIniciais();


  await salvarOcorrencias(
    dados
  );


  await AsyncStorage.setItem(
    DADOS_INICIAIS_KEY,
    "CONCLUIDO"
  );


  return dados;
}
