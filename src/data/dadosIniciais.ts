
import { Ocorrencia } from "../types/Ocorrencia";

/**
 * Ocorrências iniciais
 * 
 * Começa vazia. As ocorrências são adicionadas através de:
 * 1. Nova análise (câmera/galeria + IA)
 * 2. Carregamento do AsyncStorage (persistência)
 */
export const dadosIniciais: Ocorrencia[] = [];

/**
 * Dados para testes (use apenas em desenvolvimento)
 * 
 * Descomente para testar a listagem e persistência sem
 * precisar tirar fotos a cada vez.
 * 
 * Exemplo de como criar uma ocorrência manualmente.
 */
export const dadosTeste: Ocorrencia[] = [
  // {
  //   id: "1234567890",
  //   data: new Date().toISOString(),
  //   rodovia: "BR-116",
  //   km: 50.5,
  //   latitude: -25.123456,
  //   longitude: -49.654321,
  //   classe: "CRITICO",
  //   confianca: 0.95,
  //   status: "PENDENTE",
  //   local: "Acostamento sul",
  //   descricao: "Vegetação arbórea acima de 30cm",
  //   risco: "alto",
  // },
  // {
  //   id: "1234567891",
  //   data: new Date(Date.now() - 86400000).toISOString(),
  //   rodovia: "BR-116",
  //   km: 52.0,
  //   latitude: -25.135678,
  //   longitude: -49.645678,
  //   classe: "ATENCAO",
  //   confianca: 0.87,
  //   status: "EM_ANDAMENTO",
  //   local: "Acostamento norte",
  //   descricao: "Vegetação arbustiva entre 10cm e 30cm",
  //   risco: "medio",
  // },
];
