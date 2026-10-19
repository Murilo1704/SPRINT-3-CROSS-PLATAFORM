# 🌱 VerdeScan Mobile

**Monitoramento da vegetação às margens das rodovias da Motiva**, com registro em campo, classificação de risco (por IA ou manual) e priorização da poda.

| | |
|---|---|
| 🎬 **Vídeo de demonstração** | https://youtu.be/COLE_O_LINK_AQUI |
| 📦 **Repositório** | https://github.com/Murilo1704/SPRINT-3-CROSS-PLATAFORM |
| 🔑 **Login do app** | usuário **`master`** · senha **`verdescan2026`** |
| 🤖 **API de IA (pública)** | https://COLE-A-URL-DO-RAILWAY.up.railway.app ([status dos modelos](https://COLE-A-URL-DO-RAILWAY.up.railway.app/status-modelos)) |
| 🧪 **Testes manuais** | [docs/TESTES.md](docs/TESTES.md) |

> Para rodar: `npm install` e `npx expo start`. **Não é preciso criar `.env` nem subir a API**: o app já aponta para a API pública e, se ela estiver fora do ar, o cadastro funciona com **classificação manual**.

---

## Sumário

1. [O problema e a solução](#1-o-problema-e-a-solução)
2. [Integrantes](#2-integrantes)
3. [Tecnologias](#3-tecnologias)
4. [Como rodar](#4-como-rodar)
5. [Comportamento esperado (roteiro de uso)](#5-comportamento-esperado-roteiro-de-uso)
6. [Classificação de risco](#6-classificação-de-risco)
7. [Tipo `Ocorrencia`](#7-tipo-ocorrencia)
8. [Persistência](#8-persistência)
9. [Estrutura de pastas](#9-estrutura-de-pastas)
10. [Status das funcionalidades](#10-status-das-funcionalidades)
11. [API de IA](#11-api-de-ia)
12. [Limitações e próximos passos](#12-limitações-e-próximos-passos)

---

## 1. O problema e a solução

### O problema (Motiva)

Hoje a inspeção da vegetação nas margens das rodovias é anotada **no caderno**: sem foto, sem localização exata e sem histórico. A poda acaba sendo feita **pela ordem de chegada das anotações, e não pelo risco**. Vegetação alta esconde placas, atrapalha a visibilidade dos motoristas e, quando passa do limite do contrato de concessão, **gera multa** para a concessionária.

### Quem usa

O **operador de campo** que percorre a rodovia e registra o que encontra.

### Ação principal

**Registrar uma ocorrência** (rodovia, KM, local, descrição, risco e foto) e **ver o que precisa ser podado primeiro**.

```
📸 Foto (opcional) → 📍 Rodovia + KM → 🤖 IA ou ✋ classificação manual → 💾 Salva no aparelho → 🗺️ Mapa e lista → ✅ Poda concluída
```

---

## 2. Integrantes

| Nome | RM |
|---|---|
| Murilo Justino Arcanjo | RM565470 |
| Rafael Quattrer Dalla Costa | RM562052 |
| Kaio Corrêa Fernandes | RM563443 |
| Rafael Louzã Lopes | RM564963 |
| Luiz Miguel Martin Crocco | RM562796 |

---

## 3. Tecnologias

**App**
- React Native 0.81 + **Expo SDK 54** + TypeScript
- **Expo Router** (rotas por arquivo em `src/app/`)
- **AsyncStorage** (persistência local)
- **Expo Image Picker** (câmera e galeria), **Expo Image Manipulator** (converte HEIC do iPhone para JPEG), **Expo Location** (GPS)
- **React Native Maps** (Apple Maps no iOS, Google Maps no Android)

**API de IA** (pasta `VERDESCAN-API/`)
- Python 3.12 + **FastAPI** + **Keras 3 com backend JAX** (segmentação da vegetação + classificador ordinal), sem TensorFlow
- Publicada no **Railway**, com endereço HTTPS público

---

## 4. Como rodar

### Pré-requisitos

- **Node.js 18 ou superior** (com npm)
- Uma destas opções para abrir o app:
  - celular com **Expo Go** compatível com o **SDK 54** ([App Store](https://apps.apple.com/app/expo-go/id982107779) / [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)); ou
  - emulador Android (Android Studio) / simulador iOS (Xcode, só no Mac); ou
  - navegador (modo web).

### Passos

```bash
git clone https://github.com/Murilo1704/SPRINT-3-CROSS-PLATAFORM.git
cd SPRINT-3-CROSS-PLATAFORM
npm install
npx expo start
```

No terminal do Expo:

| Tecla / ação | Abre em |
|---|---|
| Ler o **QR Code** | Celular com Expo Go (no iPhone, pela **câmera**) |
| `a` | Emulador Android |
| `i` | Simulador iOS (Mac) |
| `w` | Navegador |
| `r` | Recarrega o app |

Na tela de login, use **`master`** / **`verdescan2026`**.

> ✅ **Não precisa de `.env` nem de API local.** O app usa a API pública no Railway. Se ela estiver fora do ar, a análise por IA mostra um erro e você classifica o risco manualmente: o cadastro, a lista, o detalhe e a persistência funcionam 100% sem a API.

### Rodando no iPhone

1. Instale o **Expo Go** pela App Store (ele precisa mostrar suporte ao **SDK 54**).
2. Rode `npx expo start` no computador e **leia o QR Code com a câmera do iPhone** (toque no aviso "Abrir no Expo Go").
3. iPhone e computador precisam estar na **mesma rede Wi-Fi**. Redes de convidados ou com "isolamento de clientes" (comuns em faculdade/empresa) bloqueiam a conexão.
4. Permita **Rede Local** para o Expo Go: *Ajustes → Privacidade e Segurança → Rede Local → Expo Go* (ligado). Sem isso o iPhone não acha o computador.
5. No Windows, se aparecer o aviso do firewall para o **Node.js**, clique em **Permitir** (rede privada).
6. Se mesmo assim não conectar, use o túnel (funciona em qualquer rede):
   ```bash
   npx expo start --tunnel
   ```
   Se o Expo pedir para instalar o `@expo/ngrok`, aceite.
7. Se aparecer erro de **versão do SDK** ("Project is incompatible with this version of Expo Go"), atualize o Expo Go na App Store.
8. Permissões: o app pede acesso à **câmera**, às **fotos** e à **localização** na primeira vez. Se você negar, ele mostra uma mensagem explicando como liberar em *Ajustes → Expo Go* e continua funcionando (dá para cadastrar sem foto e informando coordenadas).

> A API padrão é **HTTPS** (Railway), então o iOS não bloqueia a conexão. Se você usar uma API local, o iPhone precisa do **IP do computador na rede** (ex.: `http://192.168.0.10:8000`), **nunca** `localhost` (veja a seção 11).

---

## 5. Comportamento esperado (roteiro de uso)

### Fluxo principal

| # | Onde | O que fazer | O que deve acontecer |
|---|---|---|---|
| 1 | Login | Entrar com `master` / `verdescan2026` | Abre a Home. Senha errada mostra "Usuário ou senha incorretos." |
| 2 | Home | Ver "Visão geral" e o mapa | Na primeira abertura já existem **6 ocorrências de exemplo** (SP-330, SP-348 e BR-116) com pontos coloridos no mapa |
| 3 | Home → **Trechos monitorados** | Tocar no card | Lista de rodovias com contadores e, abaixo, **"Ocorrências Detalhadas"** com um card por ocorrência |
| 4 | Home → **+ Nova análise** | Abrir o cadastro | Tela com os passos 1 a 5 |
| 5 | Passo 1 (opcional) | Tirar foto ou escolher da galeria | Mostra a prévia. Se a foto tiver GPS, a localização é preenchida sozinha |
| 6 | Passo 2 | Informar **rodovia** (ex.: `SP-330`) e **KM** (ex.: `75`) | Campos obrigatórios |
| 7 | Passo 3 | Informar latitude/longitude (opcional) | Ex.: `-22.8866` / `-47.1232`. Sem elas, o app tenta: rodovia+KM pela API → GPS do aparelho |
| 8 | Passo 4 | **Analisar ocorrência** (precisa de foto) **ou** usar o card **"Sem a IA? Classifique manualmente"** | Mostra o selo NORMAL / ATENÇÃO / CRÍTICO. No manual aparece "Classificado manualmente pelo operador (sem IA)" |
| 9 | Passo 5 | Preencher local, descrição, equipe e veículo | Campos opcionais |
| 10 | Salvar | Tocar em **Salvar ocorrência** | Mensagem "Ocorrência salva" (com aviso extra se o trecho estiver fora do contrato) e volta para a Home, já com o novo ponto |
| 11 | Trechos monitorados | Procurar a ocorrência em **"Ocorrências Detalhadas"** | O card mostra classe, `KM 75.0 · local`, "Risco Alto · manual" |
| 12 | Detalhe | Tocar no card | Mostra classificação, status, coordenadas, risco, local, descrição, zona, equipe, veículo e o alerta "Fora do limite do contrato" quando for o caso |
| 13 | Detalhe | **Marcar poda como concluída** | Status vira CONCLUÍDO, aparece "Poda concluída em" e o botão some |
| 14 | Persistência | **Fechar o app e abrir de novo** (ou recarregar com `r` no terminal) | A ocorrência continua lá, com o status atualizado |

### Fluxos alternativos

| Situação | Comportamento esperado |
|---|---|
| **API fora do ar / sem internet** | "Analisar ocorrência" mostra erro + "Sem a IA, você pode classificar o risco manualmente logo abaixo." A classificação manual salva normalmente. Se não houver coordenadas, o app usa o GPS do aparelho; se nem isso, pede latitude/longitude no passo 3 |
| **KM vazio ou inválido** | O botão Analisar fica desabilitado; ao salvar aparece "KM inválido – Informe um KM válido no passo 2." |
| **Rodovia vazia** | Ao salvar aparece "Rodovia necessária" |
| **Salvar sem classificar** | "Classificação necessária – Analise a foto com a IA ou classifique o risco manualmente antes de salvar." |
| **Lista vazia** | Ao excluir todas as ocorrências, "Trechos monitorados" mostra "Nenhuma rodovia cadastrada" com o botão "+ Nova análise". Os exemplos **não** voltam sozinhos |
| **IA inconclusiva** (pouca vegetação na foto) | Selo cinza INCONCLUSIVO, botão "Tentar outra análise" e o card de classificação manual continua disponível |
| **Permissão negada** (câmera, fotos ou localização) | Mensagem explicando como liberar nos Ajustes; o app não trava |

---

## 6. Classificação de risco

A régua é **única** no app e na IA (`src/constants/risco.ts` e `VERDESCAN-API/modelos/VERDESCAN_MODELOS_V3_1_CONFIG.json`):

| Classe | Altura da vegetação | Risco | Cor |
|---|---|---|---|
| **NORMAL** | até 10 cm | Baixo | 🟢 `#2E9D50` |
| **ATENÇÃO** | acima de 10 até 30 cm | Médio | 🟡 `#E0A82E` |
| **CRÍTICO** | acima de 30 cm | Alto | 🔴 `#D63E3E` |

**Regra do contrato** (`violaContrato`): CRÍTICO sempre está fora do limite; em **área nobre**, ATENÇÃO também já está. A tela de Nova análise não pede a zona, então os registros novos seguem a regra comum (só CRÍTICO); a zona aparece apenas nos dados de exemplo.

**Onde a classificação aparece**

| Tela | Como aparece |
|---|---|
| **Lista** ("Trechos monitorados" → "Ocorrências Detalhadas") | Card com borda e selo na cor da classe, contadores Críticos/Atenção/Normal por rodovia e a linha "Risco Alto · IA 91%" ou "Risco Médio · manual" (+ "· concluída") |
| **Detalhe** | Selo colorido, linha "Classificação" (IA · % ou Manual), linha "Risco" e alerta "Fora do limite do contrato: priorizar a poda." |
| **Mapa** (Home) | Pino na cor da classe (no navegador aparece só a legenda) |
| **Pontos prioritários** | Ordenação CRÍTICO → ATENÇÃO → NORMAL, selo colorido e "Confiança" ou "Classificação manual" |
| **CSV** | Colunas Classificação, Confiança, Risco e Origem |

---

## 7. Tipo `Ocorrencia`

Definido em [`src/types/Ocorrencia.ts`](src/types/Ocorrencia.ts):

```ts
export type ClasseRisco = "NORMAL" | "ATENCAO" | "CRITICO";
export type NivelRisco = "baixo" | "medio" | "alto";
export type StatusOcorrencia = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
export type TipoZona = "COMUM" | "NOBRE";

export type Ocorrencia = {
  id: string; data: string; rodovia: string; km: number;
  latitude: number; longitude: number;
  local?: string; zona?: TipoZona;
  classe: ClasseRisco; risco?: NivelRisco;
  confianca: number;                       // 0 a 1; 0 quando manual
  origemClassificacao?: "IA" | "MANUAL";
  descricao?: string; equipe?: string; veiculo?: string;
  status: StatusOcorrencia; dataConclusao?: string;
  imagem?: string;
};
```

| Arquivo | Uso |
|---|---|
| `src/services/storage.ts` | Salvar, carregar, atualizar e excluir no AsyncStorage |
| `src/hooks/useAnalise.ts` | Monta a nova ocorrência no cadastro |
| `src/data/dadosIniciais.ts` | 6 ocorrências de exemplo |
| `src/app/index.tsx` | Contadores e mapa da Home |
| `src/app/rodovias.tsx` | Lista agrupada por rodovia |
| `src/app/trecho-detalhes.tsx` | Detalhe, concluir poda e excluir |
| `src/app/prioridades.tsx` | Ordenação por risco, filtro por período, exportação |
| `src/components/OcorrenciaCard.tsx` | Card da lista |
| `src/components/MonitoramentoMap.*.tsx` | Pinos do mapa |
| `src/services/csv.ts` | Geração do CSV |
| `src/constants/risco.ts` | Régua (`riscoPorClasse`, `violaContrato`, nomes e cores) |

---

## 8. Persistência

- As ocorrências ficam no **AsyncStorage** do aparelho, na chave **`@verdescan_ocorrencias`** (JSON com a lista de `Ocorrencia`).
- As telas **nunca** acessam o AsyncStorage direto: tudo passa por [`src/services/storage.ts`](src/services/storage.ts) (`carregarOcorrencias`, `adicionarOcorrencia`, `atualizarOcorrencia`, `removerOcorrencia`, `limparTodasOcorrencias`, `restaurarDadosIniciais`).
- Cada tela recarrega os dados ao ganhar foco com **`useFocusEffect`** (expo-router). Por isso, ao salvar ou concluir uma poda, a Home, a lista e as prioridades já mostram o dado novo.
- **Dados de exemplo:** na primeira abertura, se não houver nada salvo, são gravadas 6 ocorrências de exemplo (`src/data/dadosIniciais.ts`, datas relativas ao dia). Isso é marcado na chave `@verdescan_dados_iniciais_v1`; se o usuário apagar tudo depois, a lista fica vazia (os exemplos não são recriados).
- **Retenção:** ocorrências com mais de **6 meses** são removidas automaticamente ao carregar.
- **Login:** o usuário logado fica salvo em **`@verdescan_usuario_logado`** (o app abre direto na Home até tocar em "Sair").
- As fotos ficam no cache do app (o registro guarda o endereço da imagem).

> Para voltar aos dados de exemplo do zero: no navegador, limpe os dados do site; no celular, apague o app Expo Go e instale de novo (isso limpa o AsyncStorage).

---

## 9. Estrutura de pastas

```
SPRINT-3-CROSS-PLATAFORM/
├── src/
│   ├── app/                        # Telas (Expo Router: cada arquivo é uma rota)
│   │   ├── _layout.tsx             # Stack + proteção de login
│   │   ├── login.tsx               # Login
│   │   ├── index.tsx               # Home: visão geral, mapa e atalhos
│   │   ├── analise.tsx             # Nova análise (monta as seções; ~50 linhas)
│   │   ├── rodovias.tsx            # Trechos monitorados + Ocorrências Detalhadas
│   │   ├── trecho-detalhes.tsx     # Detalhe da ocorrência / histórico da rodovia
│   │   └── prioridades.tsx         # Pontos prioritários, filtro por período e CSV
│   ├── components/
│   │   ├── analise/                # Seções da tela Nova análise
│   │   │   ├── AnaliseHeader.tsx, SecaoFoto.tsx, SecaoTrecho.tsx,
│   │   │   ├── SecaoLocalizacao.tsx, SecaoClassificacao.tsx,
│   │   │   ├── ClassificacaoManual.tsx, SecaoRegistro.tsx, BotoesAcao.tsx
│   │   │   └── styles.ts, extraStyles.ts
│   │   ├── OcorrenciaCard.tsx      # Card da lista
│   │   └── MonitoramentoMap.native.tsx / .web.tsx / .d.ts
│   ├── hooks/
│   │   └── useAnalise.ts           # Estado e regras do cadastro
│   ├── services/
│   │   ├── storage.ts              # Única porta de acesso ao AsyncStorage
│   │   ├── auth.ts                 # Login fixo de demonstração
│   │   ├── csv.ts                  # Exportação CSV
│   │   └── verdescanApi.ts         # Chamadas /analisar e /localizar-trecho
│   ├── config/
│   │   └── api.ts                  # URL da API (EXPO_PUBLIC_API_URL ou Railway)
│   ├── constants/
│   │   └── risco.ts                # Régua de risco única
│   ├── types/
│   │   ├── Ocorrencia.ts           # Tipo principal
│   │   └── Analise.ts              # Tipos da tela de análise e da API
│   ├── utils/
│   │   ├── exif.ts                 # GPS salvo na foto
│   │   └── imagem.ts               # HEIC → JPEG
│   └── data/
│       └── dadosIniciais.ts        # Ocorrências de exemplo
├── VERDESCAN-API/                  # API de IA (FastAPI + Keras 3/JAX), publicada no Railway
│   ├── main.py                     # Endpoints e pipeline (segmentação → classificação)
│   ├── localizacao_rodovia.py      # Rodovia + KM → latitude/longitude
│   ├── modelos_ia.py               # Carrega os .keras com Keras 3 (backend JAX)
│   ├── baixar_modelos.py           # Baixa os .keras da release modelos-v3.1
│   ├── requirements.txt            # keras==3.13.2 + jax[cpu] (sem TensorFlow)
│   ├── .python-version             # 3.12 (usado pelo Railway)
│   └── modelos/                    # Config JSON (os .keras não são versionados)
├── docs/
│   └── TESTES.md                   # Testes manuais
├── .env.example                    # Exemplo de configuração da URL da API (opcional)
├── app.json, package.json, tsconfig.json
└── README.md
```

---

## 10. Status das funcionalidades

| Funcionalidade | Status | Observação |
|---|---|---|
| Login com usuário de demonstração | ✅ | `master` / `verdescan2026`, fixo em `src/services/auth.ts` |
| Home com contadores e mapa | ✅ | No navegador o mapa mostra só a legenda (react-native-maps não roda na web) ⚠️ |
| Cadastro com foto (câmera/galeria) | ✅ | Fotos HEIC do iPhone são convertidas para JPEG |
| Classificação por IA | ✅ | Depende da API no ar; cada análise leva alguns segundos ⚠️ |
| Classificação manual (sem IA) | ✅ | Foto opcional |
| Localização (GPS da foto, GPS atual, coordenadas, rodovia+KM) | ✅ | Rodovia+KM depende da API; sem ela usa GPS ou coordenadas |
| Detalhes do registro (local, descrição, equipe, veículo) | ✅ | |
| Lista por rodovia + cards | ✅ | |
| Detalhe da ocorrência | ✅ | |
| Concluir poda | ✅ | Grava status CONCLUIDO e data |
| Excluir ocorrência | ✅ | |
| Pontos prioritários + filtro por período | ✅ | Período padrão = mês atual |
| Exportar CSV | ✅ | Navegador baixa o arquivo; celular abre o compartilhamento |
| Persistência (AsyncStorage) | ✅ | |
| Dados de exemplo na primeira abertura | ✅ | |
| Status "Em andamento" | ⚠️ | Aparece nos dados, mas ainda não há botão para mudar para esse status |

---

## 11. API de IA

**URL pública:** https://COLE-A-URL-DO-RAILWAY.up.railway.app (Railway, CPU).

> A análise de uma foto pode levar **alguns segundos** (a API roda dois modelos em CPU). Se a API estiver fora do ar ou sem internet, **o app continua funcionando** com a classificação manual.

### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Informações e versão da API |
| GET | `/status-modelos` | Confirma se os modelos foram carregados |
| POST | `/analisar` | Recebe a foto (`multipart/form-data`, campo `imagem`) e devolve classe, confiança e indicadores |
| POST | `/localizar-trecho` | Recebe `{ "rodovia": "SP-330", "km": 100 }` e devolve latitude/longitude estimadas |

Documentação interativa: `/docs` (Swagger).

### Rodar a API localmente (opcional)

Requer **Python 3.11 ou superior** (recomendado **3.12**, a mesma versão do Railway, definida em `VERDESCAN-API/.python-version`).

A API usa **Keras 3 com backend JAX** (`keras==3.13.2` + `jax[cpu]`): **não precisa instalar o TensorFlow**. O backend é escolhido em `modelos_ia.py`; para forçar o TensorFlow, defina `KERAS_BACKEND=tensorflow` (e instale-o à parte).

```bash
cd VERDESCAN-API
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python baixar_modelos.py          # baixa os .keras da release modelos-v3.1 do GitHub
uvicorn main:app --host 0.0.0.0 --port 8000
```

Teste em http://localhost:8000/status-modelos.

> ⚠️ `python main.py` **não** sobe o servidor (o arquivo não tem bloco `if __name__ == "__main__"`). Use o `uvicorn` como acima.

### Apontar o app para a API local

1. Copie `.env.example` para `.env` na raiz do projeto.
2. Preencha `EXPO_PUBLIC_API_URL`:
   - celular com Expo Go: `http://<IP-do-computador>:8000` (veja o IP com `ipconfig` no Windows; nunca use `localhost`);
   - emulador Android: `http://10.0.2.2:8000`;
   - navegador ou simulador iOS: `http://localhost:8000`.
3. Reinicie o Expo: `npx expo start -c`.

### Modelos de IA

Os arquivos `.keras` (~54 MB) **não ficam no repositório**: estão na release [`modelos-v3.1`](https://github.com/Murilo1704/SPRINT-3-CROSS-PLATAFORM/releases/tag/modelos-v3.1) e são baixados por `VERDESCAN-API/baixar_modelos.py` (para usar outro endereço, defina `VERDESCAN_MODELOS_URL`). O arquivo de configuração `VERDESCAN_MODELOS_V3_1_CONFIG.json` continua versionado.

### Deploy da API (Railway)

1. No Railway: **New Project → Deploy from GitHub repo** e escolha este repositório.
2. Em **Settings** do serviço, configure:

   | Campo | Valor |
   |---|---|
   | **Root Directory** | `VERDESCAN-API` |
   | **Start Command** | `python baixar_modelos.py && uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Healthcheck Path** | `/status-modelos` |

3. Em **Settings → Networking**, clique em **Generate Domain** para obter a URL pública (`https://....up.railway.app`).
4. Coloque essa URL em `src/config/api.ts` (constante `URL_API_RAILWAY`) e na tabela do topo deste README.

Observações:
- O Railway detecta o Python pelo `requirements.txt` e usa a versão do `.python-version` (3.12).
- Os `.keras` não estão no repositório: o `baixar_modelos.py` os baixa da release `modelos-v3.1` a cada deploy, antes de subir o `uvicorn`. O healthcheck só passa depois que os modelos carregam.
- O CORS já está liberado em `main.py` (`allow_origins=["*"]`), então o app e um painel web podem chamar a API.

---

## 12. Limitações e próximos passos

**Limitações atuais**
- Login único e fixo no código (demonstração), sem perfis.
- Dados apenas no aparelho (AsyncStorage): não há sincronização entre operadores.
- Mapa interativo só no celular/emulador.
- A IA depende de conexão e cada análise leva alguns segundos.

**Próximos passos (Trello da equipe)**
1. Integrar o app ao **painel do gestor** (dados centralizados).
2. **Priorização** considerando chuva, temperatura e dias desde a última poda.
3. **Login separado** para operador e gestor.
4. **Histórico de poda** e linha do tempo por trecho.
5. **Filtros** avançados e **mapa de calor**.
6. **Notificação** de trechos críticos.
7. IA treinada com mais exemplos de **relevo** e **validação de acurácia** sem vazamento entre treino e teste.

---

📋 Testes manuais: **[docs/TESTES.md](docs/TESTES.md)**

Licença: MIT ([LICENSE](LICENSE)).
