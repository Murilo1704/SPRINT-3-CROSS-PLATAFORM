// ============================================================
// ENDEREÇO DA API DE IA (VERDESCAN-API)
//
// Por padrão o app usa a API pública hospedada no Railway,
// então não é preciso configurar nada para rodar.
//
// Para usar outra API (por exemplo, rodando no seu computador),
// crie um arquivo .env na raiz do projeto com:
//
//   EXPO_PUBLIC_API_URL=http://SEU_IP:8000
//
// e reinicie o Expo (npx expo start). Veja .env.example.
// ============================================================

// URL pública da API no Railway
// (Railway > serviço > Settings > Networking).
export const URL_API_RAILWAY =
  "https://sprint-3-cross-plataform-production.up.railway.app";

const URL_PADRAO = URL_API_RAILWAY;

// O Expo só substitui a variável quando ela é lida exatamente
// como process.env.EXPO_PUBLIC_API_URL.
const urlConfigurada =
  process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL = (
  urlConfigurada && urlConfigurada.trim()
    ? urlConfigurada.trim()
    : URL_PADRAO
).replace(/\/+$/, "");

export const API_ANALISE_URL =
  `${API_BASE_URL}/analisar`;

export const API_LOCALIZACAO_URL =
  `${API_BASE_URL}/localizar-trecho`;
