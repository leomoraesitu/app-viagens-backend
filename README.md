# 📦 App Viagens — Backend

Backend do projeto **App Viagens**, responsável por fornecer APIs, integrações externas e regras de negócio para o aplicativo desenvolvido em **FlutterFlow**, utilizando **Firebase** como plataforma principal.

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
- Firebase Cloud Functions
- Firebase Admin SDK
- HTTP Functions (REST-like)
- Integrações externas (Google APIs)

**Fluxo simplificado:**
````
FlutterFlow App  
↓  
Firebase HTTPS Functions  
↓  
Serviços externos / Firestore
````

### Motivações arquiteturais

- Evitar exposição de API Keys no frontend
- Reduzir acoplamento entre app e serviços externos
- Facilitar manutenção e evolução do backend
- Permitir validações e controles de acesso centralizados

---

## 🔐 Segurança

Este backend foi projetado considerando boas práticas de **Segurança da Informação**:

- ❌ Nenhuma chave sensível no frontend
- ✅ Uso de variáveis de ambiente
- ✅ Regras de acesso controladas via backend
- ✅ Isolamento entre ambientes (Dev / Prod)
- ✅ Validação de inputs recebidos do cliente

Arquivos como `.env`, credenciais Firebase e secrets **não são versionados**.

---

## 🌱 Ambientes

| Ambiente | Descrição |
|--------|----------|
| Development | Testes, homologação e debug |
| Production | Ambiente estável para usuários finais |

---

## 🔧 Variáveis de Ambiente

Exemplo (arquivo **não versionado**):

GOOGLE_MAPS_API_KEY=xxxxxxxxxxxx  
NODE_ENV=development

---

## 🌐 Endpoints Principais

| Método | Endpoint | Descrição |
|------|---------|----------|
| GET | /placesAutocomplete | Autocomplete de locais |
| GET | /placeDetails | Detalhes de local |

---

## 🚀 Deploy

firebase deploy --only functions

---

## 📁 Estrutura do Projeto

app-viagens-backend/  
├── functions/  
│   ├── src/  
│   │   ├── services/  
│   │   ├── controllers/  
│   │   ├── utils/  
│   │   └── index.ts  
│   ├── package.json  
│   └── tsconfig.json  
├── .gitignore  
└── README.md  

---

## 👤 Autor

Leonardo de Moraes Souza  
Análise e Desenvolvimento de Sistemas  
