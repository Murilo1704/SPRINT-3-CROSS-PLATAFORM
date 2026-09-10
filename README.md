# 🌱 VERDESCAN MOBILE

**Monitoramento Inteligente de Vegetação em Rodovias**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-54.0.36-black)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📱 Sobre o Projeto

**VERDESCAN** é um aplicativo mobile desenvolvido para auxiliar o monitoramento da vegetação em rodovias administradas pela **Motiva**. Utiliza análise de imagens com inteligência artificial para identificar e classificar pontos que podem exigir manutenção.

### O Problema

O monitoramento manual de vegetação em rodovias é demorado, impreciso, difícil de priorizar e sem histórico sistematizado.

### A Solução

```
📸 Fotografar → 🤖 IA Classifica → 💾 Registra → 📊 Analisa → 🎯 Prioriza
```

**Funcionalidades principais:**
- **Captura de imagem** via câmera ou galeria, com metadados (GPS, data/hora)
- **Análise por IA** (TensorFlow/Keras) com classificação em Normal (≤10cm), Atenção (10-30cm) e Crítico (>30cm)
- **Registro de ocorrências** com rodovia, KM, geolocalização e status
- **Gestão de pontos prioritários** por risco, com filtros e busca
- **Exportação de dados** em CSV
- **Visualização em mapa** interativo, colorido por nível de risco

---

## 👥 Integrantes

| Nome | RM |
|------|-----|
| Murilo Justino Arcanjo | 565470 |
| Rafael Quattrer  | RM562052 |
| Kaio Corrêa | RM563443 |
| Rafael Louzã Lopes | RM564963 |
| Luiz Miguel Martin Crocco |RM562796 |  


---

## 📚 Tecnologias

- **React Native** + **Expo** + **TypeScript** — app mobile multiplataforma
- **Expo Router** — roteamento baseado em arquivos
- **AsyncStorage** — persistência local dos dados
- **FastAPI** + **TensorFlow/Keras** — backend e modelo de IA para classificação
- **React Native Maps** / **Expo Camera** / **Expo Location** — mapa, câmera e geolocalização

---

## 📂 Estrutura do Projeto

```
verdescan-mobile/
│
├── src/
│   ├── app/                    # Rotas (Expo Router)
│   │   ├── index.tsx           # Home/Dashboard
│   │   ├── login.tsx           # Autenticação
│   │   ├── analise.tsx         # Nova análise (cadastro)
│   │   ├── rodovias.tsx        # Trechos monitorados (lista)
│   │   ├── trecho-detalhes.tsx # Detalhe da ocorrência
│   │   └── prioridades.tsx     # Pontos prioritários
│   │
│   ├── screens/                # Componentes de tela (lógica)
│   ├── components/             # Componentes reutilizáveis (OcorrenciaCard, mapas)
│   ├── types/                  # Tipos TypeScript (Ocorrencia)
│   ├── services/                # storage.ts, auth.ts, csv.ts
│   └── data/                   # Dados iniciais
│
├── VERDESCAN-API/               # Backend (Python/FastAPI + modelo de IA)
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

---

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** 18+ e npm
- **Dispositivo físico** com [Expo Go](https://expo.dev/go) ou emulador (Android Studio / Xcode)

### Passos

```bash
git clone https://github.com/Murilo1704/verdescan-mobile.git
cd verdescan-mobile
npm install
npx expo start
```

Depois, pressione `i` (iOS) ou `a` (Android), ou escaneie o QR Code com o Expo Go.

### API de IA (opcional)

Para habilitar a classificação automática:

```bash
cd VERDESCAN-API
pip install -r requirements.txt
python main.py
```

A API roda em `http://10.0.0.30:8000`. Sem ela, o app continua funcionando normalmente (offline).

---

## 💾 Persistência de Dados

Todas as ocorrências são salvas localmente no dispositivo via **AsyncStorage** (`@verdescan_ocorrencias`), sobrevivendo ao fechar e reabrir o app. O acesso é sempre feito pela camada de serviço (`src/services/storage.ts`), nunca diretamente pelas telas.

---

## 🔧 Tipo Principal: `Ocorrencia`

```typescript
export type Ocorrencia = {
  id: string;
  data: string;
  rodovia: string;
  km: number;
  latitude: number;
  longitude: number;
  classe: "NORMAL" | "ATENCAO" | "CRITICO";
  confianca: number;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
  imagem?: string;
};
```

| Classe | Altura | Cor |
|--------|--------|-----|
| NORMAL | ≤ 10cm | 🟢 Verde |
| ATENCAO | 10-30cm | 🟡 Amarelo |
| CRITICO | > 30cm | 🔴 Vermelho |

---

## 📜 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com React Native + Expo**
