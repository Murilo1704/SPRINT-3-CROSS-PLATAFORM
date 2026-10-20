# 🌱 VerdeScan Mobile

**Monitoramento da vegetação às margens das rodovias da Motiva**, com registro em campo, classificação de risco (por IA ou manual) e priorização da poda. O **operador** registra em campo; o **gestor** prioriza e acompanha.

| | |
|---|---|
| 🎬 **Vídeo de demonstração** (YouTube, não listado) | https://youtu.be/yacMScBubj8 |
| 📦 **Repositório** | https://github.com/Murilo1704/SPRINT-3-CROSS-PLATAFORM |
| 🤖 **API de IA (pública)** | https://sprint-3-cross-plataform-production.up.railway.app ([status dos modelos](https://sprint-3-cross-plataform-production.up.railway.app/status-modelos)) |
| 🚂 **Painel do Railway** (deploy da API) | https://railway.com/dashboard |
| 🧪 **Testes manuais** | [docs/TESTES.md](docs/TESTES.md) |

---

## Como acessar o app

### 1. Rodar

Pré-requisitos: **Node.js 18+** e o app **Expo Go** no celular, compatível com o **SDK 57** ([App Store](https://apps.apple.com/app/expo-go/id982107779) / [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)).

```bash
git clone https://github.com/Murilo1704/SPRINT-3-CROSS-PLATAFORM.git
cd SPRINT-3-CROSS-PLATAFORM
npm install
npx expo start
```

Leia o **QR Code** que aparece no terminal: no **iPhone**, com a **câmera** (toque em "Abrir no Expo Go"); no **Android**, pelo próprio Expo Go. Celular e computador precisam estar na **mesma rede Wi-Fi** (se não conectar, veja [Rodando no iPhone](#rodando-no-iphone)).

> ✅ **Não precisa criar `.env` nem subir a API.** O app já usa a API pública no Railway e, se ela estiver fora do ar, o cadastro funciona com **classificação manual**.

### 2. Entrar

Quando o app abrir, aparece a tela de **login**. Digite o **usuário** e a **senha** de uma das contas abaixo e toque em **Entrar**.

### 3. Contas de acesso

| Perfil | Usuário | Senha | O que pode fazer |
|---|---|---|---|
| **Operador de campo** (Equipe 03) | `operador` | `Operador@2026` | Registrar ocorrências (Nova análise), ver Trechos monitorados e o detalhe de cada ocorrência, **marcar a poda como concluída** |
| **Gestor** | `gestor` | `Gestor@2026` | Tudo do operador **+ Pontos prioritários**, **exportação CSV** e **excluir ocorrência** |

> As senhas não aparecem na tela do app; ficam só aqui. O login funciona **sem internet**.

### 4. Sugestão de ordem para avaliar

1. Entre como **operador** (`operador` / `Operador@2026`). Na Home, veja o badge **"Operador"** e a **Equipe 03**. O atalho **"Pontos prioritários" não aparece**.
2. Toque em **Nova análise** e cadastre uma ocorrência (com foto e IA, ou sem foto usando **"Sem a IA? Classifique manualmente"**). O campo **Equipe** já vem preenchido com "Equipe 03".
3. Abra **Trechos monitorados**, encontre a ocorrência em **"Ocorrências Detalhadas"** e toque nela: o detalhe mostra **"Registrado por: Operador de Campo"**. Marque **"Marcar poda como concluída"** (o operador **não** vê o botão Excluir).
4. Toque em **Sair** e entre como **gestor** (`gestor` / `Gestor@2026`). Agora aparecem o badge **"Gestor"**, o atalho **Pontos prioritários** (ordenados por risco, com filtro por período e **Exportar período em CSV**) e o botão **Excluir ocorrência** no detalhe.
5. Feche o app e abra de novo: os dados e o login continuam salvos.

---

## Sumário

1. [O problema e a solução](#1-o-problema-e-a-solução)
2. [Integrantes](#2-integrantes)
3. [Tecnologias](#3-tecnologias)
4. [Como rodar (detalhes)](#4-como-rodar-detalhes)
5. [Perfis e segurança do login](#5-perfis-e-segurança-do-login)
6. [Comportamento esperado (roteiro de uso)](#6-comportamento-esperado-roteiro-de-uso)
7. [Classificação de risco](#7-classificação-de-risco)
8. [Tipo `Ocorrencia`](#8-tipo-ocorrencia)
9. [Persistência](#9-persistência)
10. [Interface (tema e componentes)](#10-interface-tema-e-componentes)
11. [Estrutura de pastas](#11-estrutura-de-pastas)
12. [Status das funcionalidades](#12-status-das-funcionalidades)
13. [API de IA](#13-api-de-ia)
14. [Limitações e próximos passos](#14-limitações-e-próximos-passos)

---

## 1. O problema e a solução

### O problema (Motiva)

Hoje a inspeção da vegetação nas margens das rodovias é anotada **no caderno**: sem foto, sem localização exata e sem histórico. A poda acaba sendo feita **pela ordem de chegada das anotações, e não pelo risco**. Vegetação alta esconde placas, atrapalha a visibilidade dos motoristas e, quando passa do limite do contrato de concessão, **gera multa** para a concessionária.

### Quem usa

| Perfil | Papel |
|---|---|
| **Operador de campo** | Percorre a rodovia e registra o que encontra, muitas vezes com uma mão e sol na tela |
| **Gestor** | Prioriza a poda pelo risco, acompanha o andamento e exporta os dados |

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
- React Native 0.86 + **Expo SDK 57** + TypeScript
- **Expo Router** (rotas por arquivo em `src/app/`)
- **AsyncStorage** (persistência local)
- **Expo Crypto** (hash SHA-256 das senhas)
- **Expo Image Picker** (câmera e galeria), **Expo Image Manipulator** (converte HEIC do iPhone para JPEG), **Expo Location** (GPS)
- **React Native Maps** (Apple Maps no iOS, Google Maps no Android)
- **@expo/vector-icons** (Ionicons)

**API de IA** (pasta `VERDESCAN-API/`)
- Python 3.12 + **FastAPI** + **Keras 3 com backend JAX** (segmentação da vegetação + classificador ordinal), sem TensorFlow
- Publicada no **Railway**, com endereço HTTPS público

---

## 4. Como rodar (detalhes)

Os comandos básicos estão em [Como acessar o app](#como-acessar-o-app). Outras formas de abrir:

| Tecla / ação no terminal do Expo | Abre em |
|---|---|
| Ler o **QR Code** | Celular com Expo Go (no iPhone, pela **câmera**) |
| `a` | Emulador Android (Android Studio) |
| `i` | Simulador iOS (Xcode, só no Mac) |
| `w` | Navegador |
| `r` | Recarrega o app |

### Rodando no iPhone

1. Instale o **Expo Go** pela App Store (ele precisa mostrar suporte ao **SDK 57**).
2. Rode `npx expo start` no computador e **leia o QR Code com a câmera do iPhone** (toque no aviso "Abrir no Expo Go").
3. iPhone e computador precisam estar na **mesma rede Wi-Fi**. Redes de convidados ou com "isolamento de clientes" (comuns em faculdade/empresa) bloqueiam a conexão.
4. Permita **Rede Local** para o Expo Go: *Ajustes → Privacidade e Segurança → Rede Local → Expo Go* (ligado). Sem isso o iPhone não acha o computador.
5. No Windows, se aparecer o aviso do firewall para o **Node.js**, clique em **Permitir** (rede privada).
6. Se mesmo assim não conectar, use o túnel (funciona em qualquer rede):
   ```bash
   npx expo start --tunnel
   ```
   Se o Expo pedir para instalar o `@expo/ngrok`, aceite.
7. Erro **"You're signed in to Expo Go as ..., but not signed in to Expo CLI"**: o Expo Go do celular está logado em uma conta Expo e o computador não. Rode `npx expo login` no computador com a **mesma conta** (ou saia da conta no Expo Go) e leia o QR Code de novo.
8. Erro de **versão do SDK** ("Project is incompatible with this version of Expo Go"): atualize o Expo Go na App Store.
9. Permissões: o app pede acesso à **câmera**, às **fotos** e à **localização** na primeira vez. Se você negar, ele mostra uma mensagem explicando como liberar em *Ajustes → Expo Go* e continua funcionando (dá para cadastrar sem foto e informando coordenadas).

> A API padrão é **HTTPS** (Railway), então o iOS não bloqueia a conexão. Se você usar uma API local, o iPhone precisa do **IP do computador na rede** (ex.: `http://192.168.0.10:8000`), **nunca** `localhost` (veja a seção 13).

---

## 5. Perfis e segurança do login

| Recurso | Operador | Gestor |
|---|:---:|:---:|
| Home (resumo, mapa, atalhos) | ✅ | ✅ |
| Nova análise (IA ou manual) | ✅ | ✅ |
| Trechos monitorados e detalhe | ✅ | ✅ |
| Marcar poda como concluída | ✅ | ✅ |
| Pontos prioritários + filtro por período | ❌ | ✅ |
| Exportar CSV | ❌ | ✅ |
| Excluir ocorrência | ❌ | ✅ |

**Como funciona** ([`src/services/auth.ts`](src/services/auth.ts))
- Os dois usuários ficam no código, **sem a senha em texto puro**: cada um tem um *salt* fixo e o **hash SHA-256** de `salt:senha`. No login o app calcula o hash com o `expo-crypto` e compara.
- O login **funciona offline** (não depende da API).
- A mensagem de erro é sempre a mesma, **"Usuário ou senha inválidos"**, para não revelar se o usuário existe.
- Após **5 tentativas erradas seguidas**, o login fica **bloqueado por 1 minuto**, com contagem regressiva na tela. O bloqueio fica salvo no aparelho (fechar o app não zera).
- A sessão fica em **`@verdescan_usuario_logado`** (só id, nome, usuário, perfil e equipe; nunca o hash). Uma sessão antiga ou inválida (ex.: o login `master` de versões anteriores) é descartada e o app volta para o login.

**Permissões em duas camadas**
- A interface **esconde** o que o perfil não pode usar (atalho Pontos prioritários e botão Excluir).
- O [`src/app/_layout.tsx`](src/app/_layout.tsx) **bloqueia a rota**: se um operador abrir `/prioridades` (ex.: pelo navegador), volta para a Home com o aviso "Acesso restrito".

**Registro de autoria:** cada ocorrência nova grava `criadoPor` (id, nome e perfil do usuário logado) e o campo Equipe já vem preenchido com a equipe do usuário. O detalhe mostra **"Registrado por"** e o CSV tem a coluna **"Registrado por"**.

---

## 6. Comportamento esperado (roteiro de uso)

### Fluxo principal

| # | Perfil | Onde | O que fazer | O que deve acontecer |
|---|---|---|---|---|
| 1 | Operador | Login | Entrar com `operador` / `Operador@2026` | Abre a Home com o nome **"Operador de Campo"**, badge **Operador** e **Equipe 03**. Senha errada mostra **"Usuário ou senha inválidos"** |
| 2 | Operador | Home | Ver "Visão geral" e o mapa | Cards **Pontos monitorados**, **Pontos críticos** e **Pendentes de poda**. Na primeira abertura já existem **6 ocorrências de exemplo** (SP-330, SP-348 e BR-116) com pontos coloridos no mapa. **Não** aparece o atalho "Pontos prioritários" |
| 3 | Operador | Home → **Nova análise** | Abrir o cadastro | Tela com os passos 1 a 5 numerados e o indicador **"X de 5 etapas"** no topo |
| 4 | Operador | Passo 1 (opcional) | **Tirar foto agora** ou **Escolher da galeria** | Mostra a prévia e "Foto registrada". Se a foto tiver GPS, a localização é preenchida sozinha |
| 5 | Operador | Passo 2 | Informar **Rodovia** (ex.: `SP-330`) e **KM** (ex.: `75`) | Campos obrigatórios. KM inválido mostra "KM inválido" abaixo do campo |
| 6 | Operador | Passo 3 (opcional) | Informar latitude/longitude | Ex.: `-22.8866` / `-47.1232`. Sem elas, o app tenta: rodovia+KM pela API → GPS do aparelho |
| 7 | Operador | Passo 4 | **Analisar ocorrência** (precisa de foto) **ou** usar o card **"Sem a IA? Classifique manualmente"** | Mostra o selo NORMAL / ATENÇÃO / CRÍTICO. No manual aparece "Classificado manualmente pelo operador (sem IA)" |
| 8 | Operador | Passo 5 (opcional) | Preencher local, descrição e veículo | **Equipe** já vem com "Equipe 03" |
| 9 | Operador | Salvar | Tocar em **Salvar ocorrência** | Mensagem "Ocorrência salva" (com aviso extra se o trecho estiver fora do contrato) e volta para a Home, já com o novo ponto |
| 10 | Operador | Trechos monitorados | Procurar a ocorrência em **"Ocorrências Detalhadas"** | O card mostra o selo da classe, `SP-330`, `KM 75.0 · local` e "Risco Alto · manual" |
| 11 | Operador | Detalhe | Tocar no card | Mostra selo de risco, status, alerta "Fora do limite do contrato" (quando for o caso), classificação, risco, local, descrição, equipe, veículo, **Registrado por: Operador de Campo (Operador)** e coordenadas. **Sem** botão Excluir |
| 12 | Operador | Detalhe | **Marcar poda como concluída** | Status vira CONCLUÍDO, aparece "Poda concluída em" e o botão some |
| 13 | Operador | Home | **Sair** → confirmar | Volta para o login |
| 14 | Gestor | Login | Entrar com `gestor` / `Gestor@2026` | Home com **"Gestor Motiva"**, badge **Gestor** e o atalho **Pontos prioritários** |
| 15 | Gestor | **Pontos prioritários** | Ver o período (mês atual) e tocar em **Exportar período em CSV** | Lista numerada CRÍTICO → ATENÇÃO → NORMAL; o CSV é compartilhado (celular) ou baixado (navegador) |
| 16 | Gestor | Detalhe | **Excluir ocorrência** → confirmar | A ocorrência some da lista e do mapa |
| 17 | Todos | Persistência | **Fechar o app e abrir de novo** (ou `r` no terminal) | Continua logado e as ocorrências continuam lá, com o status atualizado |

### Fluxos alternativos

| Situação | Comportamento esperado |
|---|---|
| **Senha errada** | "Usuário ou senha inválidos" (a senha é apagada para digitar de novo) |
| **5 tentativas erradas seguidas** | "Muitas tentativas incorretas. Tente novamente em 0:59" com contagem regressiva; o botão vira "Aguarde 0:59" até liberar |
| **Campos de login vazios** | "Informe o usuário e a senha." |
| **Operador abre `/prioridades`** (ex.: no navegador) | Aviso "Acesso restrito" e volta para a Home |
| **API fora do ar / sem internet** | "Analisar ocorrência" mostra erro + "Sem a IA, você pode classificar o risco manualmente logo abaixo." A classificação manual salva normalmente. Se não houver coordenadas, o app usa o GPS do aparelho; se nem isso, pede latitude/longitude no passo 3 |
| **KM vazio ou inválido** | O botão Analisar fica desabilitado; ao salvar aparece "KM inválido – Informe um KM válido no passo 2." |
| **Rodovia vazia** | Ao salvar aparece "Rodovia necessária" |
| **Salvar sem classificar** | "Classificação necessária – Analise a foto com a IA ou classifique o risco manualmente antes de salvar." |
| **Lista vazia** | Ao excluir todas as ocorrências (gestor), "Trechos monitorados" mostra "Nenhuma rodovia cadastrada" com o botão "+ Nova análise". Os exemplos **não** voltam sozinhos |
| **IA inconclusiva** (pouca vegetação na foto) | Selo cinza INCONCLUSIVO, botão "Tentar outra análise" e o card de classificação manual continua disponível |
| **Período inválido** (Pontos prioritários) | Mensagem abaixo das datas: formato DD/MM/AAAA ou data inicial depois da final |
| **Permissão negada** (câmera, fotos ou localização) | Mensagem explicando como liberar nos Ajustes; o app não trava |

---

## 7. Classificação de risco

A régua é **única** no app e na IA (`src/constants/risco.ts` e `VERDESCAN-API/modelos/VERDESCAN_MODELOS_V3_1_CONFIG.json`):

| Classe | Altura da vegetação | Risco | Cor |
|---|---|---|---|
| **NORMAL** | até 10 cm | Baixo | 🟢 `#2E9D50` |
| **ATENÇÃO** | acima de 10 até 30 cm | Médio | 🟡 `#E0A82E` |
| **CRÍTICO** | acima de 30 cm | Alto | 🔴 `#D63E3E` |

Os selos usam **cor + ícone + texto** (quem não distingue cores também lê o risco) e o texto sobre cada cor tem contraste adequado (ex.: texto escuro sobre o amarelo de Atenção).

**Regra do contrato** (`violaContrato`): CRÍTICO sempre está fora do limite; em **área nobre**, ATENÇÃO também já está. A tela de Nova análise não pede a zona, então os registros novos seguem a regra comum (só CRÍTICO); a zona aparece apenas nos dados de exemplo.

**Onde a classificação aparece**

| Tela | Como aparece |
|---|---|
| **Lista** ("Trechos monitorados" → "Ocorrências Detalhadas") | Faixa lateral e selo na cor da classe, contadores Críticos/Atenção/Normal por rodovia e a linha "Risco Alto · IA 91%" ou "Risco Médio · manual" (+ "· concluída") |
| **Detalhe** | Selo grande, linha "Classificação" (IA · % ou Manual), linha "Risco" e alerta "Fora do limite do contrato: priorizar a poda." |
| **Mapa** (Home) | Pino na cor da classe (no navegador aparece só um aviso) |
| **Pontos prioritários** (gestor) | Ordenação numerada CRÍTICO → ATENÇÃO → NORMAL, selo colorido e "Confiança" ou "Classificação manual" |
| **CSV** (gestor) | Colunas Classificação, Confiança, Risco, Origem e Registrado por |

---

## 8. Tipo `Ocorrencia`

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
  criadoPor?: { id: string; nome: string; perfil: string }; // usuário logado no cadastro
  status: StatusOcorrencia; dataConclusao?: string;
  imagem?: string;
};
```

| Arquivo | Uso |
|---|---|
| `src/services/storage.ts` | Salvar, carregar, atualizar e excluir no AsyncStorage |
| `src/hooks/useAnalise.ts` | Monta a nova ocorrência no cadastro (com `criadoPor`) |
| `src/data/dadosIniciais.ts` | 6 ocorrências de exemplo (registradas pelo operador padrão) |
| `src/app/index.tsx` | Contadores e mapa da Home |
| `src/app/rodovias.tsx` | Lista agrupada por rodovia |
| `src/app/trecho-detalhes.tsx` | Detalhe, concluir poda e excluir (gestor) |
| `src/app/prioridades.tsx` | Ordenação por risco, filtro por período, exportação (gestor) |
| `src/components/OcorrenciaCard.tsx` | Card da lista |
| `src/components/MonitoramentoMap.*.tsx` | Pinos do mapa |
| `src/services/csv.ts` | Geração do CSV |
| `src/constants/risco.ts` | Régua (`riscoPorClasse`, `violaContrato`, nomes e cores) |

---

## 9. Persistência

- As ocorrências ficam no **AsyncStorage** do aparelho, na chave **`@verdescan_ocorrencias`** (JSON com a lista de `Ocorrencia`).
- As telas **nunca** acessam o AsyncStorage direto: tudo passa por [`src/services/storage.ts`](src/services/storage.ts) (`carregarOcorrencias`, `adicionarOcorrencia`, `atualizarOcorrencia`, `removerOcorrencia`, `limparTodasOcorrencias`, `restaurarDadosIniciais`).
- Cada tela recarrega os dados ao ganhar foco com **`useFocusEffect`** (expo-router). Por isso, ao salvar ou concluir uma poda, a Home, a lista e as prioridades já mostram o dado novo.
- **Dados de exemplo:** na primeira abertura, se não houver nada salvo, são gravadas 6 ocorrências de exemplo (`src/data/dadosIniciais.ts`, datas relativas ao dia). Isso é marcado na chave `@verdescan_dados_iniciais_v1`; se o usuário apagar tudo depois, a lista fica vazia (os exemplos não são recriados).
- **Retenção:** ocorrências com mais de **6 meses** são removidas automaticamente ao carregar.
- **Login:** o usuário logado fica salvo em **`@verdescan_usuario_logado`** (o app abre direto na Home até tocar em "Sair"); as tentativas erradas ficam em `@verdescan_tentativas_login`.
- Os dados ficam **no aparelho**: o gestor vê as ocorrências registradas no mesmo celular (não há servidor central; veja a seção 14).
- As fotos ficam no cache do app (o registro guarda o endereço da imagem).

> Para voltar aos dados de exemplo do zero: no navegador, limpe os dados do site; no celular, apague o app Expo Go e instale de novo (isso limpa o AsyncStorage).

---

## 10. Interface (tema e componentes)

Pensada para o campo: **legível no sol e usável com uma mão**.

- **Tokens** em [`src/theme/`](src/theme/index.ts): cores (verde VerdeScan como primária, neutros e as cores de risco com o texto de contraste de cada uma), tipografia (corpo de 16 px), espaçamentos, raios e sombras. As telas usam esses tokens em vez de valores soltos.
- **Componentes** em [`src/components/ui/`](src/components/ui/): `Botao` (primário, secundário, perigo, carregando e desabilitado; altura mínima de **48 px**, 56 px nas ações principais), `Campo` (rótulo, ícone, erro e mostrar/ocultar senha), `Card`, `BadgeRisco`, `Cabecalho`, `EstadoVazio` e `Carregando`. Ícones do **Ionicons** (`@expo/vector-icons`).
- **Nova análise:** passos numerados com indicador de progresso e botões grandes de câmera e galeria.
- **Lista e detalhe:** selo de risco em destaque, rodovia e KM com hierarquia clara, estados vazios com ícone e chamada para ação.
- **Safe area:** o cabeçalho verde ocupa a área do notch/Dynamic Island e as listas respeitam a barra inferior do iPhone.

---

## 11. Estrutura de pastas

```
SPRINT-3-CROSS-PLATAFORM/
├── src/
│   ├── app/                        # Telas (Expo Router: cada arquivo é uma rota)
│   │   ├── _layout.tsx             # Stack + proteção de login e de rotas do gestor
│   │   ├── login.tsx               # Login (perfis, bloqueio após 5 tentativas)
│   │   ├── index.tsx               # Home: perfil, resumo, atalhos e mapa
│   │   ├── analise.tsx             # Nova análise (monta as seções)
│   │   ├── rodovias.tsx            # Trechos monitorados + Ocorrências Detalhadas
│   │   ├── trecho-detalhes.tsx     # Detalhe da ocorrência / histórico da rodovia
│   │   └── prioridades.tsx         # Pontos prioritários e CSV (somente gestor)
│   ├── components/
│   │   ├── ui/                     # Componentes reutilizáveis
│   │   │   ├── Botao.tsx, Campo.tsx, Card.tsx, BadgeRisco.tsx
│   │   │   └── Cabecalho.tsx, EstadoVazio.tsx, Carregando.tsx
│   │   ├── analise/                # Seções da tela Nova análise
│   │   │   ├── AnaliseHeader.tsx (progresso), TituloPasso.tsx
│   │   │   ├── SecaoFoto.tsx, SecaoTrecho.tsx, SecaoLocalizacao.tsx
│   │   │   ├── SecaoClassificacao.tsx, ClassificacaoManual.tsx
│   │   │   ├── SecaoRegistro.tsx, BotoesAcao.tsx
│   │   │   └── styles.ts
│   │   ├── OcorrenciaCard.tsx      # Card da lista
│   │   └── MonitoramentoMap.native.tsx / .web.tsx / .d.ts
│   ├── theme/
│   │   └── index.ts                # Tokens: cores, tipografia, espaços, raios, sombras
│   ├── hooks/
│   │   ├── useAnalise.ts           # Estado e regras do cadastro
│   │   └── useSessao.tsx           # Usuário logado compartilhado entre as telas
│   ├── services/
│   │   ├── storage.ts              # Única porta de acesso ao AsyncStorage
│   │   ├── auth.ts                 # Login com perfis (hash SHA-256 + bloqueio)
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
│   │   ├── imagem.ts               # HEIC → JPEG
│   │   └── mensagem.ts             # Alertas e confirmações (celular e web)
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

## 12. Status das funcionalidades

| Funcionalidade | Status | Observação |
|---|---|---|
| Login com perfis (operador e gestor) | ✅ | Senhas como hash SHA-256 no código; funciona offline |
| Bloqueio após 5 tentativas erradas | ✅ | 1 minuto, com contagem regressiva |
| Permissões por perfil | ✅ | Interface esconde e `_layout.tsx` bloqueia a rota `/prioridades` |
| Home com perfil, resumo, atalhos e mapa | ✅ | No navegador o mapa mostra só um aviso (react-native-maps não roda na web) ⚠️ |
| Cadastro com foto (câmera/galeria) | ✅ | Fotos HEIC do iPhone são convertidas para JPEG |
| Classificação por IA | ✅ | Depende da API no ar; cada análise leva alguns segundos ⚠️ |
| Classificação manual (sem IA) | ✅ | Foto opcional |
| Localização (GPS da foto, GPS atual, coordenadas, rodovia+KM) | ✅ | Rodovia+KM depende da API; sem ela usa GPS ou coordenadas |
| Detalhes do registro (local, descrição, equipe, veículo) | ✅ | Equipe preenchida com a do usuário |
| "Registrado por" (autoria) | ✅ | No detalhe e no CSV |
| Lista por rodovia + cards | ✅ | |
| Detalhe da ocorrência | ✅ | |
| Concluir poda | ✅ | Operador e gestor |
| Excluir ocorrência | ✅ | Somente gestor |
| Pontos prioritários + filtro por período | ✅ | Somente gestor; período padrão = mês atual |
| Exportar CSV | ✅ | Somente gestor; navegador baixa o arquivo, celular abre o compartilhamento |
| Persistência (AsyncStorage) | ✅ | |
| Dados de exemplo na primeira abertura | ✅ | |
| Novo visual (tema + componentes) | ✅ | Tokens em `src/theme`, componentes em `src/components/ui` |
| Status "Em andamento" | ⚠️ | Aparece nos dados, mas ainda não há botão para mudar para esse status |

---

## 13. API de IA

**URL pública:** https://sprint-3-cross-plataform-production.up.railway.app (Railway, CPU).

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

## 14. Limitações e próximos passos

**Limitações atuais**
- Duas contas fixas no código (demonstração): não há cadastro de usuários nem troca de senha.
- Dados apenas no aparelho (AsyncStorage): não há sincronização entre operadores e gestor em celulares diferentes.
- Mapa interativo só no celular/emulador.
- A IA depende de conexão e cada análise leva alguns segundos.

**Próximos passos (Trello da equipe)**
1. Integrar o app ao **painel do gestor** (dados centralizados e login no servidor).
2. **Priorização** considerando chuva, temperatura e dias desde a última poda.
3. **Histórico de poda** e linha do tempo por trecho.
4. **Filtros** avançados e **mapa de calor**.
5. **Notificação** de trechos críticos.
6. IA treinada com mais exemplos de **relevo** e **validação de acurácia** sem vazamento entre treino e teste.

---

📋 Testes manuais: **[docs/TESTES.md](docs/TESTES.md)**

Licença: MIT ([LICENSE](LICENSE)).
