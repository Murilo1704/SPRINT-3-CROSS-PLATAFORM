import { riscoPorClasse } from "../constants/risco";

import { Ocorrencia } from "../types/Ocorrencia";


// ============================================================
// OCORRÊNCIAS DE EXEMPLO
//
// Gravadas uma única vez, na primeira abertura do app
// (ver src/services/storage.ts), para que dê para testar a lista,
// o detalhe, o mapa e as prioridades sem depender da API.
//
// Cobrem: as 3 classes, os 3 status, IA e manual, zona comum e
// nobre, e as rodovias SP-330, SP-348 e BR-116.
// As datas são relativas ao dia em que os dados são gravados.
// ============================================================

function diasAtras(
  dias: number,
  hora = 9
) {
  const data =
    new Date();

  data.setDate(data.getDate() - dias);
  data.setHours(hora, 30, 0, 0);

  return data.toISOString();
}


export function gerarDadosIniciais(): Ocorrencia[] {
  return [
    {
      id: "exemplo-1",
      data: diasAtras(1, 8),
      rodovia: "SP-330",
      km: 103.2,
      latitude: -22.886624,
      longitude: -47.123174,
      local: "Acostamento sentido interior, próximo ao trevo de Campinas",
      zona: "COMUM",
      classe: "CRITICO",
      risco: riscoPorClasse("CRITICO"),
      confianca: 0.91,
      origemClassificacao: "IA",
      descricao: "Capim acima de 30 cm cobrindo a placa de velocidade.",
      equipe: "Equipe Campinas 02",
      veiculo: "FKT3A21",
      status: "PENDENTE",
    },
    {
      id: "exemplo-2",
      data: diasAtras(2, 10),
      rodovia: "SP-348",
      km: 76.5,
      latitude: -23.143611,
      longitude: -46.995833,
      local: "Canteiro central em frente ao acesso de Itupeva",
      zona: "NOBRE",
      classe: "ATENCAO",
      risco: riscoPorClasse("ATENCAO"),
      confianca: 0,
      origemClassificacao: "MANUAL",
      descricao: "Grama entre 10 e 30 cm em área nobre (já fora do contrato).",
      equipe: "Equipe Jundiaí 01",
      veiculo: "GHJ4B56",
      status: "PENDENTE",
    },
    {
      id: "exemplo-3",
      data: diasAtras(4, 14),
      rodovia: "BR-116",
      km: 147,
      latitude: -23.196944,
      longitude: -45.865278,
      local: "Faixa de domínio sentido Rio, São José dos Campos",
      zona: "COMUM",
      classe: "ATENCAO",
      risco: riscoPorClasse("ATENCAO"),
      confianca: 0.78,
      origemClassificacao: "IA",
      descricao: "Vegetação arbustiva avançando sobre o acostamento.",
      equipe: "Equipe SJC 03",
      status: "EM_ANDAMENTO",
    },
    {
      id: "exemplo-4",
      data: diasAtras(6, 11),
      rodovia: "SP-330",
      km: 61.8,
      latitude: -23.171389,
      longitude: -46.917500,
      local: "Talude sentido capital, Jundiaí",
      zona: "COMUM",
      classe: "NORMAL",
      risco: riscoPorClasse("NORMAL"),
      confianca: 0.88,
      origemClassificacao: "IA",
      descricao: "Grama baixa, apenas acompanhamento.",
      status: "PENDENTE",
    },
    {
      id: "exemplo-5",
      data: diasAtras(9, 9),
      rodovia: "BR-116",
      km: 154.3,
      latitude: -23.229167,
      longitude: -45.931111,
      local: "Acostamento sentido São Paulo",
      zona: "COMUM",
      classe: "CRITICO",
      risco: riscoPorClasse("CRITICO"),
      confianca: 0,
      origemClassificacao: "MANUAL",
      descricao: "Mato alto escondendo defensa metálica. Poda feita.",
      equipe: "Equipe SJC 01",
      veiculo: "EZR7C89",
      status: "CONCLUIDO",
      dataConclusao: diasAtras(7, 16),
    },
    {
      id: "exemplo-6",
      data: diasAtras(12, 15),
      rodovia: "SP-348",
      km: 88,
      latitude: -23.062222,
      longitude: -47.027500,
      local: "Praça de pedágio de Louveira",
      zona: "NOBRE",
      classe: "NORMAL",
      risco: riscoPorClasse("NORMAL"),
      confianca: 0.93,
      origemClassificacao: "IA",
      descricao: "Gramado aparado dentro do padrão.",
      equipe: "Equipe Jundiaí 02",
      status: "PENDENTE",
    },
  ];
}


export const dadosIniciais: Ocorrencia[] =
  gerarDadosIniciais();
