# Testes manuais · VerdeScan Mobile

**Aparelho/ambiente:** ____________________ (ex.: iPhone 13, iOS 18, Expo Go SDK 57)
**Data:** ___/___/______
**Responsável:** ____________________

Pré-condição: app aberto pela primeira vez (com as 6 ocorrências de exemplo) ou já em uso.

| Perfil | Usuário | Senha |
|---|---|---|
| Operador de campo | `operador` | `Operador@2026` |
| Gestor | `gestor` | `Gestor@2026` |

Legenda de status: ✅ passou · ❌ falhou · ⚠️ passou com ressalva

| # | Fluxo | Cenário | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|
| 1 | **Login e perfis** | a) Entrar com `operador` / `Operador@2026`.<br>b) Na Home do operador, procurar o atalho "Pontos prioritários"; abrir uma ocorrência e procurar o botão "Excluir ocorrência".<br>c) Tocar em **Sair**, entrar com `gestor` / `Gestor@2026`, abrir **Pontos prioritários** e o detalhe de uma ocorrência.<br>d) Sair e tentar `operador` / `senhaerrada`.<br>e) Tentar com os campos vazios.<br>f) Errar a senha **5 vezes seguidas**. | a) Abre a Home com "Operador de Campo", badge **Operador** e "Equipe 03".<br>b) O atalho **não aparece** e o detalhe **não tem** o botão Excluir (tem "Marcar poda como concluída" se estiver pendente).<br>c) Home com "Gestor Motiva" e badge **Gestor**; Pontos prioritários abre com a lista e "Exportar período em CSV"; o detalhe mostra **"Excluir ocorrência"**.<br>d) Mensagem **"Usuário ou senha inválidos"** e continua no login.<br>e) Mensagem "Informe o usuário e a senha."<br>f) Na 5ª tentativa aparece "Muitas tentativas incorretas. Tente novamente em 0:59", com contagem regressiva; o botão fica "Aguarde ..." e desabilitado até liberar (fechar e abrir o app não zera). | | |
| 2 | **Cadastro sem IA** (operador) | Logado como operador: Home → **Nova análise**. Sem foto. Rodovia `SP-330`, KM `75`, latitude `-23.0466`, longitude `-46.9850`. No card "Sem a IA? Classifique manualmente" tocar **Crítico**. Local `Acostamento sentido capital`, descrição `Capim cobrindo placa`. Tocar **Salvar ocorrência**. | O campo **Equipe** já vem com "Equipe 03". O indicador do topo avança ("X de 5 etapas"). Selo CRÍTICO com "Classificado manualmente pelo operador (sem IA)". Ao salvar: "Ocorrência salva" com o aviso de que o trecho está fora do limite do contrato. Volta para a Home e o card "Pontos críticos" aumenta em 1. | | |
| 3 | **Lista e detalhe** | Home → **Trechos monitorados** → seção "Ocorrências Detalhadas" → card da SP-330 KM 75 → abrir. | Card com faixa e selo vermelhos, "SP-330", "KM 75.0 · Acostamento sentido capital" e "Risco Alto · manual". No detalhe: título SP-330, selo CRÍTICO, "Classificação: Manual (operador)", Risco Alto, Local, Descrição, Equipe 03, **"Registrado por: Operador de Campo (Operador)"** e o alerta "Fora do limite do contrato: priorizar a poda." | | |
| 4 | **Persistência** | a) Fechar o app por completo (deslizar para cima no seletor de apps) e abrir de novo pelo Expo Go.<br>b) Com o app aberto, apertar `r` no terminal do Expo. | Nos dois casos continua logado com o mesmo perfil e a ocorrência do teste 2 aparece na lista, no mapa e no detalhe, com os mesmos dados. | | |
| 5 | **Fluxos alternativos** | a) **API desligada** (modo avião com o app já carregado, ou `.env` apontando para um endereço inválido): tirar foto e tocar **Analisar ocorrência**.<br>b) **KM vazio**: classificar manualmente sem preencher KM e tocar Salvar.<br>c) **Atenção**: classificar **Atenção** e salvar.<br>d) **Concluir poda** (operador): no detalhe, tocar **Marcar poda como concluída**.<br>e) **Excluir tudo** (gestor): excluir todas as ocorrências pelo detalhe.<br>f) **Rota do gestor** (navegador, tecla `w`): logado como operador, abrir `http://localhost:8081/prioridades`. | a) Erro informando que não conectou/demorou + "Sem a IA, você pode classificar o risco manualmente logo abaixo."; a classificação manual salva normalmente.<br>b) "KM inválido – Informe um KM válido no passo 2."<br>c) "Ocorrência salva" **sem** aviso de fora do contrato; no detalhe não aparece o alerta vermelho.<br>d) Status muda para CONCLUÍDO, aparece "Poda concluída em", o botão some e o card da lista mostra "· concluída".<br>e) "Trechos monitorados" mostra "Nenhuma rodovia cadastrada" e o botão "+ Nova análise"; ao reabrir o app a lista continua vazia.<br>f) Aviso "Acesso restrito" e volta para a Home. | | |

## Pendências encontradas

| # | Descrição do problema | Tela | Gravidade (alta/média/baixa) | Situação |
|---|---|---|---|---|
| | | | | |
| | | | | |
