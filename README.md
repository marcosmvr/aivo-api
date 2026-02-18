# Aivo

API REST para análise automatizada de campanhas de marketing digital usando Google Gemini.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## O que é?

Aivo permite que gestores de tráfego cadastrem suas campanhas, comparem métricas com benchmarks de mercado e recebam análises detalhadas geradas por IA. A API identifica gargalos, sugere otimizações e mantém histórico completo de performance.

**Problema resolvido:** Gestores perdem tempo analisando dados manualmente e comparando performance com médias de mercado. Aivo automatiza isso.

## Principais recursos

- Autenticação JWT com controle de permissões (gestores e administradores)
- CRUD completo de campanhas com métricas de performance
- Cálculo automático de métricas derivadas (CTR, CPC, CPM, ROAS, AOV)
- Análise com Google Gemini comparando dados reais vs benchmarks
- Sistema de benchmarks configurável por nicho, país e fonte de tráfego
- Histórico de análises e relatórios

## Por que este stack?

- **NestJS**: Arquitetura escalável com injeção de dependências nativa
- **Prisma**: Type-safety completo do banco até a aplicação
- **Zod**: Validação runtime que complementa a tipagem do TypeScript
- **PostgreSQL**: Relacionamentos complexos entre ofertas, métricas e análises
- **Google Gemini**: Análise contextual que considera histórico e benchmarks

## Stack técnica

```
Backend:     NestJS + TypeScript
Database:    PostgreSQL (Supabase)
ORM:         Prisma
Auth:        JWT (jsonwebtoken + bcrypt)
Validation:  Zod
AI:          Google Gemini API
```

## Começando

### Requisitos

- Node.js 20+
- Conta no Supabase (ou PostgreSQL rodando localmente)
- Google Gemini API key ([obter aqui](https://makersuite.google.com/app/apikey))

### Instalação

```bash
# Clone o repositório
git clone https://github.com/marcosmvr/aivo.git
cd aivo

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Execute as migrations
npx prisma migrate dev

# (Opcional) Popule benchmarks iniciais
npx prisma db seed

# Inicie o servidor
npm run start:dev
```

O servidor estará disponível em `https://aivo-api.onrender.com`

## Variáveis de ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT
JWT_SECRET="seu-secret-aqui"
JWT_EXPIRATION="15m"

# Google Gemini
GEMINI_API_KEY="sua-api-key"

# Server
PORT=3000
NODE_ENV="development"
```

## Documentação da API

Acesse `https://aivo-api.onrender.com/docs` para a documentação Swagger completa com exemplos de requisições.

### Autenticação

Todas as rotas (exceto registro e login) requerem token JWT no header:

```
Authorization: Bearer {seu-token}
```

### Fluxo básico de uso

1. **Registrar conta**
```http
POST /auth/register
{
  "email": "gestor@exemplo.com",
  "password": "SenhaSegura123!",
  "name": "João Silva"
}
```

2. **Fazer login**
```http
POST /auth/login
{
  "email": "gestor@exemplo.com",
  "password": "SenhaSegura123!"
}
```

3. **Criar campanha**
```http
POST /offers
Authorization: Bearer {token}
{
  "name": "Black Friday 2024",
  "niche": "ecommerce",
  "country": "BR",
  "trafficSource": "facebook",
  "funnelType": "vsl"
}
```

4. **Registrar métricas**
```http
POST /offers/{offerId}/metrics
{
  "impressions": 100000,
  "clicks": 2500,
  "leads": 450,
  "sales": 67,
  "revenue": 33500,
  "cost": 8000
}
```

5. **Gerar análise com IA**
```http
POST /offers/{offerId}/analyze
```

A IA retorna análise estruturada incluindo:
- Status de validação da campanha
- Gargalos identificados por etapa do funil
- Plano de ação priorizado
- Comparação com benchmarks de mercado
- Recomendações para próximos testes

## Estrutura do projeto

```
src/
├── auth/              # Autenticação e autorização
├── offers/            # Gestão de campanhas
├── metrics/           # Métricas de performance
├── benchmarks/        # Referências de mercado
├── ai/                # Análises geradas por IA
└── prisma/            # Schema e migrations
```

## Modelo de dados

O banco usa relacionamentos bem definidos:

- **User** → tem muitas **Offers**
- **Offer** → tem uma **Metrics** (1:1)
- **Offer** → tem muitas **AIReports**
- **Benchmarks** são globais (comparação de mercado)

Métricas calculadas automaticamente:
- CTR = (clicks / impressions) × 100
- CPC = cost / clicks
- CPM = (cost / impressions) × 1000
- Conversion Rate = (sales / leads) × 100
- ROAS = revenue / cost
- AOV = revenue / sales

## Como a análise com IA funciona

1. Backend coleta dados da campanha + métricas + benchmarks relevantes
2. Monta contexto estruturado (JSON) com histórico
3. Envia para Google Gemini com prompt especializado
4. IA retorna análise em formato estruturado
5. Backend valida resposta com Zod e salva no banco
6. Retorna relatório completo para o cliente

Modelo usado: `gemini-2.5-flash` (rápido e econômico para análises)

## Segurança

- Senhas hasheadas com bcrypt (10 rounds)
- Tokens JWT com expiração configurável
- Validação de entrada em todas as rotas (Zod)
- RBAC (Role-Based Access Control) para admins e gestores
- SQL injection prevenido pelo Prisma ORM

## Licença

MIT

---

**Desenvolvido por Marcos Dev** • [GitHub](https://github.com/marcosmvr) • [Email](mailto:marcosvr.dev@gmail.com)
