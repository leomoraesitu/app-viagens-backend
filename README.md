# 📦 App Viagens — Backend

Backend do projeto **App Viagens**, responsável por fornecer **APIs**, **integrações externas** e **regras de negócio** para o aplicativo desenvolvido em **FlutterFlow**, utilizando **Firebase** como plataforma principal.

Este repositório representa a **camada backend/infraestrutural** do projeto, com foco em **segurança**, **escalabilidade** e **boas práticas de engenharia de software**.

---

## 🧭 Visão Geral

O backend do **App Viagens** é responsável por:

- Centralizar integrações externas (ex: Google Maps / Places)
- Proteger chaves e credenciais sensíveis
- Executar regras de negócio fora do cliente
- Servir endpoints HTTP seguros para o app
- Apoiar a estratégia de ambientes (Dev / Prod)

---

## 🏗️ Arquitetura

**Stack principal:**
- Node.js
- Firebase Cloud Functions (HTTPS)
- Integrações externas (Google APIs)

**Fluxo simplificado:**

FlutterFlow App  
↓  
Firebase HTTPS Functions  
↓  
Serviços externos / Firestore

### Motivações arquiteturais

- Evitar exposição de API Keys no frontend
- Reduzir acoplamento entre app e serviços externos
- Centralizar validações e controles de acesso
- Facilitar manutenção e evolução do backend

---

## 🔐 Segurança

Este backend foi projetado considerando boas práticas de **Segurança da Informação**:

- ❌ Nenhuma chave sensível no frontend
- ✅ Uso de Secrets / variáveis de ambiente
- ✅ Validação de inputs recebidos do cliente
- ✅ Isolamento entre ambientes (Dev / Prod)

Arquivos como `.env`, credenciais Firebase e secrets **não são versionados**.

---

## 🌱 Ambientes (Dev / Prod)

O projeto utiliza **aliases do Firebase** para separar ambientes:

```bash
firebase use dev
firebase use prod
```

Isso reduz o risco de deploy em ambiente incorreto.

---

## 🔑 Secrets / Variáveis de Ambiente

Exemplo de secret utilizado:

- `GOOGLE_MAPS_API_KEY`

Configuração por ambiente:

```bash
firebase functions:secrets:set GOOGLE_MAPS_API_KEY
```

---

## 🌐 Base URL (Cloud Functions)

https://southamerica-east1-appviagens2-92cbf.cloudfunctions.net

---

## 🌐 Endpoints Principais

| Método | Endpoint | Descrição |
|------:|----------|-----------|
| GET | `/placesAutocomplete` | Autocomplete de locais |
| GET | `/placesDetails` | Detalhes do local por placeId |

---

## ▶️ Exemplos de chamada

```bash
curl "https://southamerica-east1-appviagens2-92cbf.cloudfunctions.net/placesAutocomplete?input=Sao%20Paulo&languageCode=pt-BR&limit=5"
```

```bash
curl "https://southamerica-east1-appviagens2-92cbf.cloudfunctions.net/placesDetails?placeId=SEU_PLACE_ID&languageCode=pt-BR"
```

---

## 🌐 CORS (Web / FlutterFlow)

CORS para **Cloud Functions** e **Firebase Storage** são configurações independentes.

- Cloud Functions: tratados no código (headers + OPTIONS)
- Firebase Storage: configurado via `cors.json`

```bash
gsutil cors set cors.json gs://appviagens2-92cbf.appspot.com
```

---

## 🧩 Troubleshooting (Erros Comuns)

### 400 — input is required (min 2 chars)
- O endpoint `/placesAutocomplete` exige no mínimo 2 caracteres.
- Solução: debounce no frontend.

### 400 — placeId is required
- O endpoint `/placesDetails` exige `placeId` válido.
- Solução: usar placeId retornado pelo autocomplete.

### Erro de CORS no browser
- Causa: confusão entre CORS de Functions e Storage.
- Solução: configurar cada camada separadamente.

### Deploy no ambiente errado
- Solução: sempre verificar `firebase use` antes do deploy.

---

## 📁 Estrutura do Projeto

```text
app-viagens-backend/
├── functions/
├── cors.json
├── firebase.json
├── .firebaserc
├── .gitignore
└── README.md
```

---

## 👤 Autor

Leonardo de Moraes Souza  
Análise e Desenvolvimento de Sistemas  

---

## 📄 Licença

Projeto desenvolvido para fins educacionais e de portfólio.
