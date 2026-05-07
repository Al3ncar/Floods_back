# 🏗️ FLOODS_BACK API

Backend da plataforma **RECONSTRÓI**, responsável pelo gerenciamento de usuários, autenticação, solicitações de ajuda e aplicações dentro da plataforma.

---

# 📚 Sumário

- [📖 Sobre o Projeto](#-sobre-o-projeto)
- [🧠 Objetivo](#-objetivo)
- [🛠️ Tecnologias](#️-tecnologias)
- [🏛️ Arquitetura](#️-arquitetura)
- [📂 Estrutura de Pastas](#-estrutura-de-pastas)
- [⚙️ Instalação](#️-instalação)
- [🚀 Executando o Projeto](#-executando-o-projeto)
- [🔐 Variáveis de Ambiente](#-variáveis-de-ambiente)
- [🗄️ Banco de Dados](#️-banco-de-dados)
- [📌 Modelagem](#-modelagem)
- [🔑 Autenticação](#-autenticação)
- [📡 Endpoints](#-endpoints)
- [📄 Regras de Negócio](#-regras-de-negócio)
- [🧪 Testes](#-testes)
- [📈 Melhorias Futuras](#-melhorias-futuras)
- [👨‍💻 Autor](#-autor)

---

# 📖 Sobre o Projeto

O **FLOODS_BACK API** é uma API REST desenvolvida para fornecer toda a estrutura backend da plataforma RECONSTRÓI.

A aplicação é responsável pelo gerenciamento de:

- Usuários
- Autenticação
- Solicitações
- Aplicações em solicitações
- Regras de negócio
- Segurança da aplicação

O projeto foi desenvolvido utilizando Node.js com arquitetura organizada e foco em escalabilidade, segurança e manutenção.

---

# 🧠 Objetivo

O objetivo principal da API é:

- Centralizar regras de negócio
- Garantir autenticação segura
- Facilitar integração com frontend
- Gerenciar solicitações da plataforma
- Controlar permissões e acessos
- Garantir organização dos dados

---

# 🛠️ Tecnologias

## Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Bcrypt
- Joi Validation

## Segurança

- Helmet
- Cors
- JsonWebToken

## Desenvolvimento

- Nodemon
- ESLint
- Prettier
- Dotenv

---

# 🏛️ Arquitetura

A aplicação segue separação de responsabilidades em camadas:

```txt
Routes
   ↓
Controllers
   ↓
Services
   ↓
Database
```

---

# 📂 Estrutura de Pastas

```bash
src/
├── auth/
├── config/
├── controllers/
├── models/
├── routes/
├── services/
├── utils/
├── validator/
└── main.js
```

---

# ⚙️ Instalação

## Clone o projeto

```bash
git clone https://github.com/Al3ncar/floods_back
```

## Acesse a pasta

```bash
cd floods_back
```

## Instale as dependências

```bash
npm install
```

---

# 🚀 Executando o Projeto

## Desenvolvimento

```bash
npm run dev
```

## Produção

```bash
npm start
```

---

# 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=
DATABASE_URL=
JWT_SECRET=
```

---

# 🗄️ Banco de Dados

O projeto utiliza PostgreSQL para armazenamento dos dados.

## Dependência utilizada

```json
"pg": "^8.20.0"
```

---

# 📌 Modelagem

## 📷 DBDiagram

Adicione aqui sua modelagem do banco de dados:

```md
![DB Diagram](./docs/dbdiagram.png)
```

---

# 🔑 Autenticação

A autenticação da API é realizada utilizando JWT.

## Fluxo de autenticação

1. Usuário realiza login
2. API valida email e senha
3. Token JWT é gerado
4. Frontend envia Bearer Token nas próximas requisições

## Segurança utilizada

- Criptografia de senha com Bcrypt
- Middleware de autenticação
- Validação de dados com Joi
- Helmet para proteção de headers
- Cors para controle de acesso

---

# 📡 Endpoints

# 🔐 Auth

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /login | Realiza login do usuário |

---

# 👤 Users

| Método | Endpoint | Middleware |
|---|---|---|
| GET | /api/users | — |
| POST | /api/users | validUser |
| PUT | /api/users/:id | validEditUser + auth |
| DELETE | /api/users/:id | auth |

---

# 📦 Requests

| Método | Endpoint | Middleware |
|---|---|---|
| GET | /api/requests | — |
| POST | /api/requests | validRequest + auth |
| PUT | /api/requests/:id | validEditReq + auth |
| DELETE | /api/requests/:id | auth |

---

# 🤝 Applications

| Método | Endpoint | Middleware |
|---|---|---|
| POST | /api/requests/:id/applications | auth |

---

# 📄 Regras de Negócio

## Usuários

- Não pode existir email duplicado
- Senha deve ser criptografada
- Usuário autenticado pode editar seus dados
- Apenas usuários autenticados podem excluir dados

## Requests

- Apenas usuários autenticados podem criar solicitações
- Solicitações devem passar por validação
- Apenas usuários autorizados podem editar/remover solicitações

## Applications

- Usuário autenticado pode aplicar em uma solicitação
- Aplicações dependem da existência da solicitação

---

# 🧪 Testes

Atualmente o projeto ainda não possui testes automatizados configurados.

```bash
npm test
```

---

# 📦 Dependências do Projeto

## Dependências principais

```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "helmet": "^8.1.0",
  "joi": "^18.1.2",
  "jsonwebtoken": "^9.0.3",
  "pg": "^8.20.0"
}
```

---

# 📈 Melhorias Futuras

- [ ] Refresh Token
- [ ] Upload de imagens
- [ ] Logs centralizados
- [ ] Swagger Documentation
- [ ] Testes automatizados
- [ ] Dockerização
- [ ] CI/CD
- [ ] Cache com Redis

---

# 👨‍💻 Autor

Desenvolvido por Igor Alencar 🚀

## Contato

- [https://github.com/Al3ncar](https://github.com/Al3ncar)
- [linkedin.com/in/igoralencar/](linkedin.com/in/igoralencar/)


---
