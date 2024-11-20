# 🚀 StorePulse | E-commerce & Admin Platform

Uma plataforma de e-commerce moderna e completa construída com Next.js 15, App Router, Supabase e Prisma. Inclui uma área de loja para clientes e um dashboard administrativo completo para gerenciamento de produtos, pedidos e clientes.

## 🚀 Tecnologias

- [Next.js 15](https://nextjs.org/) - Framework React com App Router
- [Supabase](https://supabase.io/) - Backend as a Service (Auth, Database, Storage)
- [Prisma](https://www.prisma.io/) - ORM
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes React
- [Lucide Icons](https://lucide.dev/) - Ícones
- [TanStack Query v5](https://tanstack.com/query/latest) - Gerenciamento de Estado e Cache
- [MercadoPago](https://www.mercadopago.com.br/) - Gateway de Pagamento

## ✨ Funcionalidades

- 🔐 Autenticação com Supabase
- 👤 Gerenciamento de Perfil
- 🛒 Carrinho de Compras
- 💳 Integração com MercadoPago
- 📦 Gerenciamento de Produtos
- 📝 Gerenciamento de Pedidos
- 🎨 Tema Claro/Escuro
- 🎯 Painel Administrativo
- 📱 Design Responsivo

## 📁 Principais Rotas

- `/` - Página inicial da loja
- `/(shop)` - Grupo de rotas da loja
  - `/(shop)/products` - Lista de produtos
  - `/(shop)/cart` - Carrinho de compras
  - `/(shop)/checkout` - Finalização de compra
- `/auth/login` - Login
- `/auth/register` - Registro
- `/minha-conta` - Área do cliente
- `/admin` - Painel administrativo
  - `/admin/products` - Gerenciamento de produtos
  - `/admin/orders` - Gerenciamento de pedidos
  - `/admin/customers` - Gerenciamento de clientes
  - `/admin/settings` - Configurações da loja

## 🛠️ Pré-requisitos

- Node.js 16+
- PostgreSQL
- Supabase CLI
- NPM ou Yarn

## 🚀 Configuração do Ambiente Local

1. Instale as dependências:
```bash
npm install
# ou
yarn install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

3. Configure as seguintes variáveis no arquivo .env.local:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Chave anônima do Supabase
SUPABASE_SERVICE_ROLE_KEY=          # Chave de serviço do Supabase

# App
NEXT_PUBLIC_APP_URL=                # URL da aplicação (ex: http://localhost:3000)
NEXT_PUBLIC_API_URL=                # URL da API (ex: http://localhost:3000/api)

# Database
DATABASE_URL=                       # URL de conexão com o PostgreSQL

# Serviços
MERCADOPAGO_ACCESS_TOKEN=          # Token de acesso do MercadoPago

# Storage
S3_END_POINT=                      # Endpoint do S3 (Supabase Storage)
S3_ACCESS_KEY=                     # Chave de acesso do S3
S3_SECRET_KEY=                     # Chave secreta do S3
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## 📚 Estrutura do Projeto

```
store/
├── src/
│   ├── app/                    # Rotas e páginas
│   │   ├── (shop)/            # Grupo de rotas da loja
│   │   ├── admin/             # Área administrativa
│   │   ├── auth/              # Autenticação
│   │   ├── api/               # API Routes
│   │   └── minha-conta/       # Área do cliente
│   ├── components/            # Componentes React
│   ├── hooks/                 # Custom Hooks
│   ├── lib/                   # Configurações e utilitários
│   ├── providers/             # Provedores de contexto
│   ├── scripts/               # Scripts de automação
│   ├── services/              # Serviços e integrações
│   ├── store/                 # Gerenciamento de estado global
│   ├── types/                 # Definições de tipos TypeScript
│   └── styles/                # Estilos globais
├── prisma/                    # Schema e migrações do Prisma
├── public/                    # Arquivos estáticos
└── package.json
```

## 🔒 Níveis de Acesso

O sistema possui dois níveis de acesso:

- 👤 **CUSTOMER**: Usuário comum que pode comprar produtos
- 🛡️ **ADMIN**: Administrador com acesso ao painel de controle

## 🎨 UI/UX

- Tema claro/escuro
- Design responsivo (Desktop, Tablet, Mobile)
- Componentes reutilizáveis do shadcn/ui
- Customização de cores via Tailwind

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev         # Inicia o servidor de desenvolvimento
npm run build      # Cria a build de produção
npm run start      # Inicia o servidor de produção
npm run lint       # Executa o linter
```

## ⚙️ Configuração do Supabase Local

1. Instale o Supabase CLI
2. Inicie os serviços locais:
```bash
supabase start
```

3. Use as credenciais fornecidas para configurar o .env.local

## 🔐 Variáveis de Ambiente

Para obter as variáveis de ambiente necessárias:

1. **Supabase**: Acesse o projeto no dashboard do Supabase
2. **MercadoPago**: Obtenha as credenciais no painel do MercadoPago
3. **S3/Storage**: Use as credenciais fornecidas pelo Supabase

## 📝 Notas de Desenvolvimento

- Use branches para novas features
- Mantenha os tipos TypeScript atualizados
- Siga o padrão de componentes do shadcn/ui
- Atualize o schema do Prisma quando necessário

---

📅 Última atualização: Dezembro 2023
