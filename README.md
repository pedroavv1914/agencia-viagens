✈️ Palazzo Travel — Documentação Completa 🧭

Este repositório contém uma aplicação full‑stack para gestão e exibição de pacotes de viagens, com autenticação JWT, documentação via Swagger, suporte a upload de imagens, e pipelines de CI/CD para frontend (GitHub Pages) e backend (Docker/GHCR + deploy via SSH).

O objetivo deste README é ensinar alguém a entender a arquitetura, rodar localmente, configurar ambientes, consumir a API e acompanhar o fluxo de entrega contínua. Vamos nessa! 🚀

**🗺️ Visão Geral**
- 🧩 Frontend em `React + Vite + TypeScript`, com comunicação à API em `Frontend/src/services/api.ts`.
- ⚙️ Backend em `Node.js + Express + TypeScript` usando `TypeORM` (PostgreSQL), `JWT` e `swagger-ui-express`.
- 🖼️ Upload de imagem para pacotes por URL ou arquivo local (base64), armazenado em `Backend/uploads` e servido estaticamente.
- 🚀 CI/CD:
  - 🎯 Frontend: deploy na Vercel (static build do Vite).
  - 🐳 Backend: build TS + imagem Docker no GHCR; deploy via SSH.

**🛠️ Stack Tecnológica**
- 🧑‍💻 Linguagens: `TypeScript` (frontend e backend)
- 🎨 Frontend: `React`, `Vite`
- 🔧 Backend: `Express`, `TypeORM`, `swagger-ui-express`, `jsonwebtoken`
- 🗄️ Banco: `PostgreSQL`
- 🔐 Auth: `JWT` (Bearer Token)
- 🐳 Contêiner: `Docker`
- 📦 Orquestração local: `docker-compose`
- 🔄 CI/CD: `Vercel` (frontend) + `GitHub Actions` (GHCR, SSH deploy)

**📁 Estrutura do Projeto**
- `.github/workflows/`
  - `frontend.yml` — CI/CD do frontend (GitHub Pages)
  - `backend.yml` — CI + build/push Docker no GHCR
  - `backend-deploy.yml` — Deploy do backend via SSH
- `Backend/`
  - `src/` — `server.ts` (Express, Swagger, estático `/uploads`), `routes/`, `entity/`, `middleware/`, `swagger.yaml`
  - `uploads/` — Imagens enviadas
  - `Dockerfile`, `package.json`, `tsconfig.json`
- `Frontend/`
  - `src/` — páginas (Admin, etc.), componentes e `services/api.ts`
  - `vite.config.ts`, `package.json`
- `docker-compose.yml` — Ambiente local com API + DB

**✨ Funcionalidades Principais**
- ✅ Listagem de pacotes nacionais e internacionais, com imagem, preço e descrição.
- 🛠️ Área administrativa para criar, editar e excluir pacotes.
- 🖼️ Imagem do pacote por URL ou upload de arquivo local.
- 🔐 Autenticação JWT para operações administrativas.
- 📘 Documentação da API via Swagger.
- 🚢 Deploy automatizado: Vercel (frontend) e GHCR + SSH (backend).

**🧪 Como Rodar Localmente (Dev)**
- 📋 Pré‑requisitos: `Node.js >= 18`, `npm`, `Docker` e `docker-compose` (opcional).
- 🔧 Backend: crie `Backend/.env` (exemplo em `Backend/.env.example`)
  - `PORT=3000`
  - `JWT_SECRET=uma_chave_segura`
  - `DB_HOST=localhost`, `DB_PORT=5432`, `DB_USER=postgres`, `DB_PASSWORD=postgres`, `DB_NAME=agencia`
- 🎛️ Frontend: crie `Frontend/.env` (exemplo em `Frontend/.env.example`)
  - `VITE_API_BASE_URL=http://localhost:3000`
- 🐳 Subir com Docker Compose (API + DB) na raiz:
  - `docker-compose up -d`
  - API em `http://localhost:3000`.
- 🎨 Rodar Frontend (em `Frontend/`):
  - `npm install`
  - `npm run dev`
  - App em `http://localhost:5173`.
- ⚙️ Rodar Backend sem Docker (em `Backend/`):
  - `npm install`
  - `npm run dev`
  - API em `http://localhost:3000`.

**📚 Documentação da API (Swagger)**
- 📄 Baseada em `Backend/src/swagger.yaml`, exposta via `swagger-ui-express`.
- 🔗 UI em `http://localhost:3000/docs` (ver `server.ts`).
- ⚙️ Em produção, o Swagger pode ser desabilitado por segurança. Controle com `SWAGGER_ENABLED=true|false` no `.env` do backend.
- ℹ️ Para seu fluxo de cadastro via Swagger, mantenha `SWAGGER_ENABLED=true` em produção enquanto precisar usar a UI.

**👤 Papéis e Acessos (Roles)**
- `user`: pode navegar e visualizar pacotes.
- `admin`: pode criar, editar, excluir pacotes e fazer upload de imagens.
- `master`: além de poder gerenciar pacotes, pode gerenciar papéis de usuários. A rota de usuários é restrita ao master.
- O master é determinado por `MASTER_EMAIL` (backend). No frontend de desenvolvimento, você pode definir `VITE_MASTER_EMAIL` para garantir que o badge e as rotas reflitam esse papel.

**🔐 Autenticação JWT**
- ➡️ Use `Authorization: Bearer <token>` nas rotas protegidas.
- 🔑 Fluxo:
  - `POST /auth/login` → retorna `token` e `role`.
  - `POST /auth/register` → cria usuário e retorna `token` e `role`.
  - `GET /auth/me` → retorna `email` e `role` do token atual.
  - `POST /auth/refresh` → reemite `token` sincronizando `role` com o banco/ambiente.
  - Use o token para criar/editar/excluir pacotes.
 - 🌐 `GET /packages` agora exige token (privado).

**🖼️ Upload de Imagens de Pacotes**
- 🔗 Opção 1: informar URL no campo de imagem.
- 📤 Opção 2: upload de arquivo local (frontend envia base64, backend salva e expõe).
- `POST /packages/upload`
  - Body (JSON): `{ "filename": "imagem.png", "data": "data:image/png;base64,<BASE64>" }`
  - Resposta: `{ "url": "/uploads/<arquivo>.png" }`
  - Exemplo `curl`:
    - `curl -X POST http://localhost:3000/packages/upload -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"filename":"foto.png","data":"data:image/png;base64,<BASE64>"}'`

**🛣️ Principais Endpoints**
- `GET /packages` — lista pacotes
- `POST /packages` — cria pacote (JWT)
- `PUT /packages/:id` — atualiza pacote (JWT)
- `DELETE /packages/:id` — exclui pacote (JWT)
- `POST /packages/upload` — upload base64; retorna URL pública
- `GET /uploads/<nome>` — serve imagem estática
- `POST /auth/login` — autentica e retorna JWT
 - `POST /auth/register` — cria usuário
 - `GET /auth/me` — informações do usuário autenticado
 - `POST /auth/refresh` — reemite token atualizado
 - `GET /admin/users` — listar usuários (master)
 - `PATCH /admin/users/:id/role` — atualizar papel para `admin` ou `user` (master)

**🎨 Frontend (Vite + React)**
- 🧾 Scripts (em `Frontend/package.json`): `npm run dev`, `npm run build`, `npm run preview`.
- 🔗 `VITE_API_BASE_URL` define a URL da API.
- 👑 `VITE_MASTER_EMAIL` (opcional em dev) define qual email deve ser tratado visualmente como master para exibição de badge e acesso à UI de usuários, mesmo antes do backend refletir a promoção.
- 🚀 Deploy na Vercel usando `vercel.json`; sem necessidade de `base` especial.

**⚙️ Backend (Express + TypeORM)**
- 🧱 Entidade `TravelPackage` (campo opcional `imagem?: string`).
- 🛣️ Rotas em `Backend/src/routes/` (incl. `packages.ts` e upload).
- 📁 `server.ts` cria `uploads` e serve estático em `/uploads`.
- 🏗️ Build de produção em `Backend/dist/`.
 - 🔐 Segurança: `helmet`, `hpp`, `express-rate-limit` (global e específico para login) e limite de `express.json { limit: '1mb' }`.
 - 🔗 CORS: defina `CORS_ORIGIN` para restringir a origem permitida.
 - 📘 Swagger: controlado por `SWAGGER_ENABLED=true|false`.

**🐳 Docker**
- 📦 Imagem do backend em `ghcr.io/<owner>/agencia-viagens-backend:<tag>`.
- ▶️ Rodar manualmente:
  - `docker pull ghcr.io/<owner>/agencia-viagens-backend:latest`
  - `docker run -d --name agencia_viagens_api --restart=always --env-file /caminho/para/env -p 3000:3000 ghcr.io/<owner>/agencia-viagens-backend:latest`

**🔄 CI/CD**
- 🎯 Frontend (Vercel): `vercel.json`
  - Build estático (Vite) com output `Frontend/dist`.
  - Configure `VITE_API_BASE_URL` nas Environment Variables da Vercel.
- 🖥️ Backend (Render): `render.yaml`
  - Build: `cd Backend && npm ci && npm run build`; Start: `cd Backend && node dist/server.js`.
  - Database gerenciado pela Render com envs injetados (host, port, user, password, database).
  - Defina `JWT_SECRET` (gerado) e, opcionalmente, `SWAGGER_ENABLED` e `CORS_ORIGIN` para produção.
 - Observação: Workflows alternativos (GHCR/SSH) estão presentes no repositório, porém os gatilhos automáticos foram desativados para evitar concorrência com Render/Vercel. Use apenas se desejar deploy por Docker/SSH.

**🔑 Secrets Necessários**
- 🎨 Frontend (Vercel): `VITE_API_BASE_URL` (Environment Variable; URL pública da API)
- ⚙️ Backend Deploy:
  - `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_PORT`
  - `PORT`, `JWT_SECRET`, `MASTER_EMAIL`, `MASTER_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `USER_EMAIL`, `USER_PASSWORD`
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `SWAGGER_ENABLED`, `CORS_ORIGIN`

**🚀 Deploy**
- 🎨 Frontend (Vercel):
  - Crie o projeto na Vercel e conecte ao GitHub (monorepo).
  - A Vercel usará `vercel.json` para build (static-build). Output: `Frontend/dist`.
  - Configure `VITE_API_BASE_URL` em Settings → Environment Variables (Production/Preview).
  - Faça push na branch configurada e acompanhe o build/deploy.
- ⚙️ Backend:
  - `Backend CI/CD` publica a imagem no GHCR.
  - `Backend Deploy` realiza deploy via SSH com a imagem `latest`.
  - 🔁 Alternativamente, deploy manual em qualquer host com Docker.

**🧯 Dicas e Solução de Problemas**
- 💡 `EADDRINUSE`: porta em uso. Ajuste `PORT` ou pare o processo existente.
- ❗ CORS: verifique `VITE_API_BASE_URL` e configure CORS no backend se necessário.
- 🧪 Upload: confirme `dataUrl` válido e permissões em `Backend/uploads`.
- 🔗 Vercel sem API: forneça backend público e atualize `VITE_API_BASE_URL`.
- 🔐 Segurança adicional habilitada: `helmet`, `hpp`, `rate-limit` e limite de `express.json`. Se necessário, ajuste `CORS_ORIGIN` para seu domínio.
 - 🗄️ Banco de dados: em desenvolvimento, o backend tenta criar o banco se não existir (`ensureDatabaseExists`) e usa `synchronize: true` no TypeORM. Em produção, desabilite a criação automática e gerencie migrações.

**🧩 Regras de Acesso na UI**
- Painel “Admin Pacotes” acessível a `admin` e `master`.
- Painel “Admin Usuários” acessível apenas ao `master`.
- O usuário com email igual a `MASTER_EMAIL` sempre recebe `role: master` via backend (login/refresh). No frontend, `VITE_MASTER_EMAIL` garante consistência visual em dev.

**🤝 Como Contribuir**
- 🪄 Use feature branches e siga o estilo do projeto.
- 📘 Atualize Swagger ao mudar a API.
- 🔐 Documente rotas protegidas e o uso de JWT.

**✅ Status dos Requisitos Técnicos**
- TypeScript: OK
- ORM (TypeORM): OK
- JWT: OK
- Swagger: OK
- Docker: OK
- CI/CD: OK (Frontend Vercel, Backend GHCR, Deploy SSH)
- Comunicação Frontend‑API: OK (via `VITE_API_BASE_URL`)

