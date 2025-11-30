# 📊 OfferIQ - Sistema Inteligente de Análise de Ofertas de Marketing

> Plataforma backend para análise automatizada de campanhas de marketing digital com IA, benchmarking inteligente e geração de insights acionáveis.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🎯 Sobre o Projeto

**OfferIQ** é uma API REST completa que permite gestores de tráfego e marketing digital:

- 📈 **Cadastrar campanhas** com dados estruturados (nicho, país, funil, métricas)
- 🤖 **Gerar análises automáticas com IA** usando Google Gemini
- 📊 **Comparar performance** com benchmarks de mercado por nicho/país
- 🎯 **Receber planos de ação** priorizados e específicos
- 📉 **Identificar gargalos** em cada etapa do funil
- 📚 **Manter histórico completo** de ofertas e relatórios

### 💼 Por que este projeto é relevante?

```
✅ Integração real com IA (Google Gemini API)
✅ Autenticação e autorização (JWT + RBAC)
✅ CRUD completo com relacionamentos complexos
✅ Lógica de negócio não-trivial (cálculos, comparações)
✅ TypeScript com tipagem forte
✅ Arquitetura escalável (Services, Controllers, Middlewares)
✅ Validação robusta com Zod
✅ ORM moderno (Prisma)
```

---

## 🚀 Funcionalidades

### Para Gestores de Tráfego:

- ✅ CRUD completo de ofertas (campanhas)
- ✅ Registro de métricas de performance (CTR, ROAS, conversão)
- ✅ Cálculo automático de métricas derivadas (CPC, CPM, AOV)
- ✅ Geração de análise com IA em segundos
- ✅ Visualização de benchmarks de mercado
- ✅ Histórico de relatórios com comparações

### Para Administradores:

- ✅ Todas as funcionalidades de gestores
- ✅ Gerenciamento de benchmarks (criar, editar, deletar)
- ✅ Acesso a dados de todos os usuários

### Análise com IA (Google Gemini):

A IA analisa suas campanhas e retorna:

- 📋 **Resumo executivo** da performance
- ✅ **Status de validação** (validada, não validada, próxima da validação)
- 🚨 **Gargalos identificados** por etapa (tráfego, funil, checkout)
- 🎯 **Plano de ação priorizado** com impacto esperado
- 📊 **Comparação detalhada** com benchmarks de mercado
- 💡 **Recomendações estratégicas** baseadas em histórico

---

## 🏗️ Arquitetura

```
┌──────────────┐
│   Cliente    │  (Frontend/Postman)
└──────┬───────┘
       │ HTTP/JSON
       ▼
┌──────────────────────────────────┐
│      NestJS API (Backend)        │
│                                  │
│  ┌────────────────────────────┐ │
│  │    Auth Middleware         │ │
│  │    (JWT Validation)        │ │
│  └────────────┬───────────────┘ │
│               ▼                  │
│  ┌────────────────────────────┐ │
│  │      Controllers           │ │
│  │  (Offers, Metrics, etc)    │ │
│  └────────────┬───────────────┘ │
│               ▼                  │
│  ┌────────────────────────────┐ │
│  │       Services             │ │
│  │  (Business Logic)          │ │
│  └─────┬──────────────┬───────┘ │
└────────┼──────────────┼─────────┘
         │              │
         ▼              ▼
   ┌─────────┐   ┌──────────────┐
   │ Prisma  │   │Google Gemini │
   │   ORM   │   │     API      │
   └────┬────┘   └──────────────┘
        │
        ▼
┌──────────────┐
│  PostgreSQL  │
│  (Supabase)  │
└──────────────┘
```

### Fluxo de Análise com IA

```
1. Cliente envia POST /offers/:id/analyze
           ↓
2. Backend busca: Oferta + Métricas + Benchmarks + Histórico
           ↓
3. Monta contexto estruturado em JSON
           ↓
4. Envia prompt para Google Gemini API
           ↓
5. IA retorna análise estruturada (JSON)
           ↓
6. Backend valida, parseia e salva no banco
           ↓
7. Retorna relatório completo para o cliente
```

---

## 🛠️ Stack Tecnológica

### Backend

- **Runtime:** Node.js 20+
- **Framework:** NestJS
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco:** PostgreSQL (Supabase)
- **Autenticação:** JWT (jsonwebtoken + bcrypt)
- **Validação:** Zod
- **IA:** Google Gemini API (`@google/generative-ai`)

### Principais Dependências

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/config": "^3.0.0",
  "@prisma/client": "^5.7.1",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "zod": "^3.22.4",
  "@google/generative-ai": "^0.1.3",
  "passport-jwt": "^4.0.1"
}
```

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 20+ instalado
- Conta no [Supabase](https://supabase.com) (ou PostgreSQL local)
- API Key do [Google Gemini](https://makersuite.google.com/app/apikey)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/offeriq-backend.git
cd offeriq-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# JWT
JWT_SECRET="seu-segredo-super-secreto-aqui"
JWT_EXPIRATION="15m"
JWT_REFRESH_SECRET="outro-segredo-para-refresh"
JWT_REFRESH_EXPIRATION="7d"

# Google Gemini API
GEMINI_API_KEY="sua-api-key-do-gemini"

# Server
PORT=3000
NODE_ENV="development"

# Bcrypt
BCRYPT_SALT_ROUNDS=10
```

### 4. Configure o banco de dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Rodar migrations
npx prisma migrate dev --name init

# (Opcional) Popular benchmarks iniciais
npx prisma db seed
```

### 5. Inicie o servidor

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

O servidor estará rodando em `http://localhost:3000`

---

## 📚 Documentação da API

A documentação completa da API está disponível via **Swagger** após iniciar o servidor:

```
http://localhost:3000/api/docs
```

### Recursos Principais

- **Auth:** Registro, login e gerenciamento de tokens
- **Offers:** CRUD completo de ofertas/campanhas
- **Metrics:** Criação e atualização de métricas (com cálculos automáticos)
- **Benchmarks:** Gerenciamento de referências de mercado (admin apenas)
- **Reports:** Geração de análises com IA e histórico de relatórios

### Autenticação

Todas as rotas (exceto `/auth/register` e `/auth/signin`) exigem JWT:

```
Authorization: Bearer <seu-token-jwt>
```

---

## 🗄️ Modelo de Dados

### Relacionamentos

```
User (1) ──────── (N) Offer
                       │
                       ├──── (1:1) Metrics
                       │
                       └──── (1:N) AIReport

Benchmark (Tabela independente para referências de mercado)
```

### Principais Entidades

#### **User**

Usuários do sistema (gestores e admins).

| Campo        | Tipo    | Descrição                    |
| ------------ | ------- | ---------------------------- |
| id           | UUID    | Identificador único          |
| email        | String  | Email (único)                |
| passwordHash | String  | Senha hasheada (bcrypt)      |
| name         | String  | Nome completo                |
| role         | Enum    | ADMIN ou GESTOR              |
| offers       | Offer[] | Ofertas criadas pelo usuário |

#### **Offer**

Campanhas de marketing cadastradas.

| Campo         | Tipo       | Descrição                           |
| ------------- | ---------- | ----------------------------------- |
| id            | UUID       | Identificador único                 |
| userId        | UUID       | Criador (FK → User)                 |
| name          | String     | Nome da campanha                    |
| niche         | String     | Nicho (saude, fitness, educacao...) |
| country       | String     | País (BRA, USA, PRT...)             |
| trafficSource | String     | Fonte de tráfego (Facebook Ads...)  |
| funnelType    | String     | Tipo de funil (VSL, Webinar...)     |
| startDate     | Date       | Data de início                      |
| budget        | Decimal    | Orçamento (opcional)                |
| status        | Enum       | ACTIVE, PAUSED, COMPLETED           |
| metrics       | Metrics    | Métricas (relação 1:1)              |
| reports       | AIReport[] | Relatórios de IA gerados            |

#### **Metrics**

Métricas de performance da oferta (relação 1:1 com Offer).

| Campo          | Tipo    | Calculado? | Fórmula                        |
| -------------- | ------- | ---------- | ------------------------------ |
| impressions    | Int     | ❌         | -                              |
| clicks         | Int     | ❌         | -                              |
| ctr            | Decimal | ✅         | (clicks / impressions) × 100   |
| cpc            | Decimal | ✅         | cost / clicks                  |
| cpm            | Decimal | ✅         | (cost / impressions) × 1000    |
| leads          | Int     | ❌         | -                              |
| sales          | Int     | ❌         | -                              |
| conversionRate | Decimal | ✅         | (sales / leads) × 100          |
| revenue        | Decimal | ❌         | -                              |
| cost           | Decimal | ❌         | -                              |
| roas           | Decimal | ✅         | revenue / cost                 |
| aov            | Decimal | ✅         | revenue / sales (Ticket Médio) |

**Nota:** Métricas calculadas são geradas automaticamente pelo backend ao salvar/atualizar.

#### **Benchmark**

Referências de mercado por nicho, país e fonte.

| Campo         | Tipo    | Descrição                      |
| ------------- | ------- | ------------------------------ |
| id            | UUID    | Identificador único            |
| niche         | String  | Nicho de mercado               |
| country       | String  | País                           |
| trafficSource | String  | Fonte de tráfego               |
| funnelType    | String  | Tipo de funil                  |
| metricName    | String  | Nome da métrica (ctr, roas...) |
| minValue      | Decimal | Valor mínimo aceitável         |
| maxValue      | Decimal | Valor máximo esperado          |
| idealValue    | Decimal | Valor ideal/meta               |
| description   | String  | Contexto adicional             |

**Constraint Único:** `(niche, country, trafficSource, funnelType, metricName)`

#### **AIReport**

Relatórios de análise gerados pela IA.

| Campo                   | Tipo   | Descrição                                     |
| ----------------------- | ------ | --------------------------------------------- |
| id                      | UUID   | Identificador único                           |
| offerId                 | UUID   | Oferta analisada (FK → Offer)                 |
| summary                 | Text   | Resumo executivo                              |
| validationStatus        | String | validated, not_validated, close_to_validation |
| validationExplanation   | Text   | Explicação do status                          |
| bottlenecks             | JSON   | Array de gargalos identificados               |
| actionPlan              | JSON   | Array de ações recomendadas                   |
| missingData             | JSON   | Array de dados faltantes                      |
| nextTestRecommendations | Text   | Sugestões para próximo teste                  |
| aiModel                 | String | Modelo usado (gemini-1.5-flash)               |
| promptTokens            | Int    | Tokens do prompt                              |
| completionTokens        | Int    | Tokens da resposta                            |

---

## 🤖 Integração com Google Gemini

### Como funciona

1. **Contexto rico:** O backend monta um contexto completo com:
   - Dados da oferta (nicho, país, funil)
   - Métricas atuais de performance
   - Benchmarks relevantes do mercado
   - Histórico de ofertas similares

2. **Prompt especializado:** Template otimizado para análise de marketing digital

3. **Resposta estruturada:** IA retorna JSON com análise detalhada

4. **Validação:** Backend valida a resposta com Zod antes de salvar

### Modelo utilizado

- **Recomendado:** `gemini-1.5-flash` (rápido e econômico)
- **Alternativa:** `gemini-1.5-pro` (análises mais complexas)

### Exemplo de análise gerada

```json
{
  "summary": "A oferta apresentou ROAS de 4.5, acima do benchmark mínimo de 3.0...",
  "validationStatus": "validated",
  "bottlenecks": [
    {
      "stage": "traffic",
      "metric": "ctr",
      "current_value": 1.8,
      "benchmark_value": 2.5,
      "severity": "medium",
      "explanation": "CTR ligeiramente abaixo do ideal..."
    }
  ],
  "actionPlan": [
    {
      "priority": 1,
      "action": "Realizar teste A/B com 3 variações de criativo...",
      "expected_impact": "Aumentar CTR em 25-40%",
      "difficulty": "easy"
    }
  ]
}
```

---

## 🧪 Testando a API

### 1. Criar usuário

```bash
POST /auth/register
{
  "email": "gestor@teste.com",
  "password": "Senha123!",
  "name": "João Silva"
}
```

### 2. Fazer login

```bash
POST /auth/signin
{
  "email": "gestor@teste.com",
  "password": "Senha123!"
}
```

### 3. Criar oferta

```bash
POST /offers
Authorization: Bearer <seu-token>
{
  "name": "Campanha Emagrecimento",
  "niche": "saude",
  "country": "BRA",
  "trafficSource": "Facebook Ads",
  "funnelType": "VSL",
  "startDate": "2024-02-01",
  "budget": 5000
}
```

### 4. Adicionar métricas

```bash
POST /offers/:offerId/metrics
Authorization: Bearer <seu-token>
{
  "impressions": 100000,
  "clicks": 2000,
  "leads": 500,
  "sales": 45,
  "revenue": 22500,
  "cost": 5000
}
```

### 5. Gerar análise com IA

```bash
POST /offers/:offerId/analyze
Authorization: Bearer <seu-token>
```

---

## 🚀 Deploy

### Opções recomendadas

- **Railway:** Deploy automático via GitHub
- **Render:** Free tier com PostgreSQL incluído
- **Vercel:** Ideal para serverless
- **AWS EC2:** Controle total

### Configuração de produção

1. Configure variáveis de ambiente na plataforma
2. Rode migrations: `npx prisma migrate deploy`
3. Build do projeto: `npm run build`
4. Inicie: `npm run start:prod`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

**Seu Nome**

- GitHub: [@marcosmvr](https://github.com/marcosmvr)
- Email: marcosvr.dev@gmail.com

---

## 🙏 Agradecimentos

- [NestJS](https://nestjs.com/) pela framework incrível
- [Prisma](https://www.prisma.io/) pelo ORM type-safe
- [Google](https://ai.google.dev/) pela API do Gemini
- [Supabase](https://supabase.com/) pelo PostgreSQL gerenciado

---

<p align="center">
  Feito com ❤️ por Marcos Dev
</p>
