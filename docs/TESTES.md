# Testes manuais · VerdeScan Mobile

**Aparelho/ambiente:** iPhone (iOS) · Expo Go SDK 57 · API de IA no Railway
**Data:** 20/10/2026
**Responsável:** Murilo Justino Arcanjo (RM565470)

Pré-condição: app aberto pela primeira vez (com as ocorrências de exemplo) ou já em uso.

| Perfil | Usuário | Senha |
|---|---|---|
| Operador de campo | `operador` | `Operador@2026` |
| Gestor | `gestor` | `Gestor@2026` |

Legenda de status: ✅ passou · ❌ falhou · ⚠️ passou com ressalva

## Fluxos testados

| # | Fluxo | Cenário | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|
| 1 | **Abrir o app no iPhone** | Rodar `npx expo start` e ler o QR Code com a câmera do iPhone (Expo Go da App Store). | O app abre na tela de login. | Na primeira tentativa apareceu **"Project is incompatible with this version of Expo Go"**: o Expo Go instalado era do SDK 57 e o projeto estava no SDK 54. O iOS não permite instalar versões antigas do Expo Go. **Correção:** projeto atualizado para o SDK 57. Depois disso o app abriu normalmente. | ❌ → corrigido |
| 2 | **Conexão do Expo Go com o computador** | Com o Expo Go logado numa conta Expo, abrir o projeto pelo QR Code. | O projeto carrega. | Apareceu **"There was a problem running the requested project"**: o Expo Go estava logado como `murilojustino`, mas o Expo CLI do computador não. **Correção:** rodar `npx expo login` no computador com a mesma conta (ou sair da conta no Expo Go). Depois disso carregou. | ❌ → corrigido |
| 3 | **Login e perfis** | a) Entrar com `operador`.<br>b) Na Home do operador, procurar "Pontos prioritários".<br>c) Sair e entrar com `gestor`. | a) Home com "Operador de Campo", badge **Operador** e "Equipe 03".<br>b) O atalho não aparece.<br>c) Home com "Gestor Motiva", badge **Gestor** e atalho **Pontos prioritários**. | a) Entrou como Operador de Campo, Equipe 03.<br>b) O atalho de prioridades não aparece para o operador.<br>c) Gestor entrou com o badge Gestor e acesso a Pontos prioritários. | ✅ |
| 4 | **Cadastro com IA** (operador) | Nova análise → tirar foto da vegetação → rodovia `BR-101`, KM `150` → localização pelo GPS → **Analisar ocorrência**. | A foto é enviada para a API e volta a classificação (Normal, Atenção ou Crítico). | Na primeira versão, ao analisar apareceu **"Erro: Unsupported FormDataPart implementation"**: o envio da foto (FormData) não era compatível com o SDK novo. O app ofereceu a classificação manual, como previsto. **Correção:** ajuste no envio da imagem em `services/verdescanApi.ts`. Depois da correção a IA classificou como **CRÍTICO** (confiança 59,73%, com "Revisão recomendada"). | ❌ → corrigido |
| 5 | **Detalhes do registro e salvar** (operador) | Preencher local `Sentido litoral`, descrição `Grama alta perto de curva`, equipe e placa do veículo; tocar **Salvar ocorrência**. | "Ocorrência salva", volta para a Home e os contadores aumentam. | Salvou e voltou para a Home: pontos monitorados de 7 para 8 e críticos de 2 para 3. O ponto novo aparece no mapa em vermelho. | ✅ |
| 6 | **Lista, detalhe e concluir poda** | Trechos monitorados → abrir uma ocorrência pendente → **Marcar poda como concluída**. | Status vira CONCLUÍDO com a data; o card da lista mostra "concluída". | Status mudou para CONCLUÍDO com "Poda concluída em 20/10/2026"; na Home os pendentes caíram de 6 para 5. A ocorrência nova aparece na lista com foto e "Risco Alto · IA". | ✅ |
| 7 | **Persistência e prioridades** (gestor) | Sair e entrar como gestor → Pontos prioritários (01/10 a 31/10) → **Exportar período em CSV**. | Os dados registrados pelo operador continuam lá; lista ordenada por risco; CSV gerado. | As ocorrências do operador continuaram salvas após trocar de usuário. Resumo do período: 3 críticos, 3 atenção, 2 normais, ordenados por risco. O CSV foi gerado e compartilhado (8 registros). | ✅ |

## Pendências encontradas

| # | Descrição | Tela / parte | Gravidade | Situação |
|---|---|---|---|---|
| 1 | Expo Go do iPhone só abre o SDK mais recente; com o SDK 54 o app não abria. | Projeto (Expo) | Alta | Resolvida: atualizado para o SDK 57. |
| 2 | Conta do Expo Go diferente da do Expo CLI impede abrir o projeto. | Ambiente de desenvolvimento | Média | Resolvida: `npx expo login`. Documentado no README. |
| 3 | Envio da foto para a IA falhava com "Unsupported FormDataPart implementation". | Nova análise / API | Alta | Resolvida: ajuste no envio da imagem. |
| 4 | A IA erra mais perto dos limites de 10 e 30 cm; neste teste a confiança foi de 59,73% e o app pediu revisão. | Classificação por IA | Média | Aberta: o operador pode corrigir pela classificação manual; retreinar o modelo com mais exemplos (card do Trello). |
| 5 | A API roda no plano de teste do Railway (30 dias ou US$ 5). Depois disso pode sair do ar. | API (Railway) | Média | Aberta: sem a API o app funciona com classificação manual. |
| 6 | Os dados ficam só no aparelho; o painel web do gestor ainda não recebe os registros do app. | Persistência | Baixa | Aberta: integrar app e painel via API (próxima etapa). |