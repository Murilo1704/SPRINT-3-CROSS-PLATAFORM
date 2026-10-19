# Testes manuais · VerdeScan Mobile

**Aparelho/ambiente:** ____________________ (ex.: iPhone 13, iOS 18, Expo Go SDK 54)
**Data:** ___/___/______
**Responsável:** ____________________

Pré-condição: app aberto pela primeira vez (com as 6 ocorrências de exemplo) ou já em uso. Login `master` / `verdescan2026`.

Legenda de status: ✅ passou · ❌ falhou · ⚠️ passou com ressalva

| # | Fluxo | Cenário | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|
| 1 | **Login** | a) Entrar com `master` / `verdescan2026`.<br>b) Sair e tentar com `master` / `senhaerrada`.<br>c) Tentar com campos vazios. | a) Abre a Home com "Operador conectado".<br>b) Mensagem "Usuário ou senha incorretos." e continua no login.<br>c) Mensagem "Informe o usuário e a senha." | | |
| 2 | **Cadastro sem IA** | Home → **+ Nova análise**. Sem foto. Rodovia `SP-330`, KM `75`, latitude `-23.0466`, longitude `-46.9850`. No card "Sem a IA? Classifique manualmente" tocar **Crítico**. Local `Acostamento sentido capital`, descrição `Capim cobrindo placa`. Tocar **Salvar ocorrência**. | Selo CRÍTICO com "Classificado manualmente pelo operador (sem IA)". Ao salvar: "Ocorrência salva" com o aviso de que o trecho está fora do limite do contrato. Volta para a Home e o contador de pontos críticos aumenta em 1. | | |
| 3 | **Lista e detalhe** | Home → **Trechos monitorados** → seção "Ocorrências Detalhadas" → card da SP-330 KM 75 → abrir. | Card vermelho com "KM 75.0 · Acostamento sentido capital" e "Risco Alto · manual". No detalhe: título SP-330, "Classificação: Manual (operador)", Risco Alto, Local, Descrição e o alerta "Fora do limite do contrato: priorizar a poda." | | |
| 4 | **Persistência** | a) Fechar o app por completo (deslizar para cima no seletor de apps) e abrir de novo pelo Expo Go.<br>b) Com o app aberto, apertar `r` no terminal do Expo. | Nos dois casos continua logado e a ocorrência do teste 2 aparece na lista, no mapa e no detalhe, com os mesmos dados. | | |
| 5 | **Fluxos alternativos** | a) **API desligada** (modo avião com o app já carregado, ou `.env` apontando para um endereço inválido): tirar foto e tocar **Analisar ocorrência**.<br>b) **KM vazio**: classificar manualmente sem preencher KM e tocar Salvar.<br>c) **Atenção**: classificar **Atenção** e salvar.<br>d) **Concluir poda**: no detalhe, tocar **Marcar poda como concluída**.<br>e) **Excluir tudo**: excluir todas as ocorrências pelo detalhe. | a) Erro informando que não conectou/demorou + "Sem a IA, você pode classificar o risco manualmente logo abaixo."; a classificação manual salva normalmente.<br>b) "KM inválido – Informe um KM válido no passo 2."<br>c) "Ocorrência salva" **sem** aviso de fora do contrato; no detalhe não aparece o alerta vermelho.<br>d) Status muda para CONCLUÍDO, aparece "Poda concluída em", o botão some e o card da lista mostra "· concluída".<br>e) "Trechos monitorados" mostra "Nenhuma rodovia cadastrada" e o botão "+ Nova análise"; ao reabrir o app a lista continua vazia. | | |

## Pendências encontradas

| # | Descrição do problema | Tela | Gravidade (alta/média/baixa) | Situação |
|---|---|---|---|---|
| | | | | |
| | | | | |
