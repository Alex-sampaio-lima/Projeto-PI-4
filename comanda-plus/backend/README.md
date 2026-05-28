# 💻 Comanda+ Backend — API REST

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
</p>

> **API REST** robusta desenvolvida em Node.js e Express com banco de dados SQLite3. Atua como o núcleo operacional de persistência de dados, autenticação de usuários, processamento de pedidos, integração de meios de pagamento e exportação de inteligência de negócios (BI).

---

## 🛠️ Tecnologias e Versões

*   **Runtime**: `Node.js 18 ou superior`
*   **Servidor Web**: `Express ^4.18.3` (gerenciamento de rotas e requisições HTTP)
*   **Persistência**: `sqlite3 ^5.1.7` (banco de dados local relacional rápido)
*   **Hash Criptográfico**: `bcryptjs ^3.0.3` (armazenamento seguro de senhas)
*   **Validador**: `express-validator ^7.3.2` (sanitização de requisições de entrada)
*   **Pagamentos**: `mercadopago ^2.12.0` (SDK do Checkout Pro do Mercado Pago)
*   **Dados de Teste**: `@faker-js/faker ^10.4.0` (população de banco histórico de BI)
*   **Suíte de Testes**: `jest ^29.7.0` & `supertest ^7.0.0` (testes de API integrados)
*   **Variáveis de Ambiente**: `dotenv ^16.4.5` & `cors ^2.8.5`

---

## 📂 Estrutura de Diretórios (backend/)

```text
📦 backend/
├── 📁 src/
│   ├── 📁 config/
│   │   └── database.js          → Re-export da conexão SQLite
│   ├── 📁 controllers/
│   │   ├── addressController.js → Cadastro de endereços de entrega
│   │   ├── authController.js    → Login e registro com hash bcryptjs
│   │   ├── cartController.js    → Manipulação dinâmica do carrinho local
│   │   ├── categoryController.js→ Filtragem por tipo de alimento
│   │   ├── companyController.js → Restaurantes e lojas parceiras
│   │   ├── dashboardController.js → Agregações prontas para BI / PowerBI
│   │   ├── orderController.js   → Converte carrinho ativo em pedido final
│   │   ├── paymentController.js → Criação de preferências do Mercado Pago
│   │   └── productController.js → CRUD e listagem de produtos
│   ├── 📁 database/
│   │   ├── db.js                → Inicializador SQLite com suporte a Promises
│   │   └── init.js              → Estrutura de tabelas e inserção de dados iniciais (seed)
│   ├── 📁 middlewares/
│   │   ├── errorHandler.js      → Interceptador global de exceções HTTP
│   │   └── validationMiddleware.js → Processamento automático de esquemas do express-validator
│   ├── 📁 models/
│   │   ├── addressModel.js
│   │   ├── cartModel.js
│   │   ├── categoryModel.js
│   │   ├── companyModel.js
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── 📁 routes/
│   │   ├── index.js             → Roteador central (/api)
│   │   ├── ...Routes.js         → Divisões de rotas dos controladores
│   ├── 📁 utils/
│   │   └── helpers.js           → Auxiliares gerais
│   ├── 📁 validators/
│   │   └── index.js             → Regras rígidas de entrada para rotas críticas
│   └── app.js                   → Instanciação básica e middlewares padrão
├── 📁 scripts/
│   ├── seed-large.js            → Script faker para gerar dados de massa histórica
│   ├── export-dashboard.js      → Exportador estruturado de faturamento para PowerBI
│   └── exportar-colab.js        → Exportador em colunas planas de vendas para Google Colab
├── 📁 __tests__/
│   ├── auth.test.js             → Testes de fluxos de login e registro
│   ├── products.test.js         → Testes de integridade de catálogo e rotas REST
│   └── setup.js                 → Configurações de banco temporário Jest
├── jest.config.js
├── server.js                    → Entry point do servidor HTTP (escuta de porta)
├── .env.example
├── package.json
└── database.sqlite              → Banco de dados relacional ativo (gerado)
```

---

## ⚙️ Configuração e Execução

### 1. Instalar as dependências do projeto
Certifique-se de estar na pasta `/comanda-plus/backend/` e execute:
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo para o arquivo `.env` definitivo:
```bash
# No Windows (CMD/PowerShell)
copy .env.example .env

# No Linux ou macOS
cp .env.example .env
```

Edite o arquivo `.env` gerado com os parâmetros operacionais desejados:
```env
PORT=3000
DB_PATH=./database.sqlite

# Token do Mercado Pago para testes (Checkout Pro)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
WEBHOOK_URL=
```

### 3. Iniciar o Servidor
Você pode rodar o backend em dois modos diferentes:
```bash
# Modo de Desenvolvimento (reinicia automaticamente a cada modificação do código)
npm run dev

# Modo de Produção
npm start
```

✅ Saída esperada no terminal de sucesso:
```text
✅ Banco de dados conectado: ...database.sqlite
✅ Tabelas criadas com sucesso!
✅ Dados mock inseridos com sucesso!

🚀 Servidor rodando em: http://localhost:3000
📡 API disponível em:   http://localhost:3000/api
```

> **Importante:** O arquivo `database.sqlite` é gerado automaticamente na primeira execução do servidor. Caso queira zerar o banco de dados e recarregar os dados padrões de demonstração, basta apagar o arquivo `database.sqlite` e reiniciar o servidor.

---

## 🧪 Executando os Testes Automatizados

O backend conta com uma suíte de testes de integração escrita em Jest utilizando Supertest para verificar a consistência das rotas e regras de negócio:
```bash
# Executa todos os arquivos de teste
npm test

# Executa os testes exibindo um relatório com cobertura de código
npm run test:coverage
```

---

## 📊 Geração de Massa de Vendas & Relatórios de BI (PI-4)

Para atender aos requisitos de modelagem estatística e análise de dados no Projeto Integrador, o backend fornece ferramentas autônomas de manipulação e exportação de dados analíticos fictícios:

### A. Popular Banco Histórico de Vendas (Seed Fake)
Para testar visualizações gráficas de dashboards com massa de dados densa de centenas de registros distribuídos ao longo do tempo:
```bash
npm run db:seed-large
```
*(Este comando utilizará o Faker para povoar as tabelas de pedidos de maneira consistente com distribuições de data, bairros e produtos).*

### B. Exportação Consolidada de BI (PowerBI / Excel)
Para extrair um resumo analítico pronto de faturamento, ticket médio e vendas acumuladas de produtos:
```bash
npm run exportar-dados
```
*Gera o arquivo `dashboard-estatisticas.json` estruturado pronto para carregamento no Microsoft PowerBI ou Excel.*

### C. Análise Científica & Dashboard (Pandas / Python / Plotly)
Para conduzir estudos estatísticos detalhados de dados utilizando scripts baseados em bibliotecas científicas Python (Pandas, Matplotlib, Seaborn e Plotly):
```bash
npm run db:export-colab
```
*Gera o arquivo plano de transações `dashboard-comanda-plus.json` na raiz da pasta backend.*

O projeto conta com o script solicitado pelo professor:
*   **`ado_estatistica.py`** (localizado na pasta raiz `/backend`): Um script completo que lê os dados de transações do arquivo `dashboard-comanda-plus.json`, calcula KPIs de desempenho de faturamento, vendas, ticket médio, sazonalidade, formas de pagamento, produtos líderes e gera gráficos avançados em formato de imagens (`.png`) e um painel interativo de BI dinâmico em HTML (`dashboard_vendas.html`).

Para executá-lo localmente (requer Python 3 e as bibliotecas científicas listadas na célula 1):
```bash
python ado_estatistica.py
```

👉 Consulte também os arquivos de suporte científico em `scripts/codigo_colab.py` e `scripts/codigo_colab.md` para instruções adicionais no ambiente do Google Colab!

---

## 🗄️ Modelagem e Estrutura das Tabelas (SQLite)

O banco relacional conta com o seguinte mapeamento lógico:

1.  **`users`**: Armazena clientes cadastrados.
    *   `id` (INTEGER, PK), `name` (TEXT), `email` (TEXT, UNIQUE), `password` (TEXT - Criptografada com bcryptjs), `created_at` (DATETIME).
2.  **`companies`**: Restaurantes/estabelecimentos ativos no marketplace.
    *   `id` (INTEGER, PK), `name` (TEXT), `logo` (TEXT), `rating` (REAL), `delivery_time` (TEXT), `delivery_fee` (REAL), `category` (TEXT).
3.  **`categories`**: Filtros de tipos alimentícios (ex: Pizza, Lanches).
    *   `id` (INTEGER, PK), `name` (TEXT), `image` (TEXT).
4.  **`products`**: Pratos e produtos disponíveis.
    *   `id` (INTEGER, PK), `company_id` (INTEGER, FK -> companies), `category_id` (INTEGER, FK -> categories), `name` (TEXT), `description` (TEXT), `price` (REAL), `image` (TEXT), `rating` (REAL).
5.  **`cart`**: Estado de itens pré-selecionados para checkout.
    *   `id` (INTEGER, PK), `user_id` (INTEGER), `product_id` (INTEGER, FK -> products), `quantity` (INTEGER).
6.  **`orders`**: Cabeçalho de pedidos de vendas consolidados.
    *   `id` (INTEGER, PK), `user_id` (INTEGER), `company_id` (INTEGER, FK -> companies), `address_id` (INTEGER, FK -> addresses), `status` (TEXT), `payment_method` (TEXT), `delivery_fee` (REAL), `total_amount` (REAL), `created_at` (DATETIME).
7.  **`order_items`**: Detalhamento individual dos produtos de um pedido concluído.
    *   `id` (INTEGER, PK), `order_id` (INTEGER, FK -> orders), `product_id` (INTEGER, FK -> products), `quantity` (INTEGER), `price` (REAL - Valor histórico da venda).
8.  **`addresses`**: Cadastro de múltiplos endereços de entrega por perfil.
    *   `id` (INTEGER, PK), `user_id` (INTEGER), `street` (TEXT), `number` (TEXT), `neighborhood` (TEXT), `city` (TEXT), `state` (TEXT), `zip_code` (TEXT).

---

## 📡 Lista de Endpoints Operacionais

Todos os caminhos respondem tendo como prefixo `http://localhost:3000/api`:

### 🔑 Autenticação e Conta
*   `POST /auth/register` - Cria e inicializa uma nova conta de usuário.
*   `POST /auth/login` - Verifica credenciais fornecendo os metadados do perfil.
*   `POST /auth/reset-password` - Fluxo de simulação de redefinição de credencial.

### 🏬 Catálogo e Restaurantes
*   `GET /companies` - Retorna estabelecimentos parceiros cadastrados (suporta query `?category=x`).
*   `GET /companies/:id` - Retorna restaurante específico e exibe seu cardápio de produtos.
*   `GET /products` - Retorna a listagem total de produtos cadastrados.
*   `GET /products/:id` - Busca prato individual por ID.
*   `GET /categories` - Retorna categorias para renderização de chips de filtros.

### 🛒 Manipulação do Carrinho
*   `GET /cart` - Consulta do carrinho unificado com valores agregados e taxas de frete.
*   `POST /cart` - Inclui item no carrinho de compras (ou incrementa se duplicado).
*   `PUT /cart/:id` - Altera a quantidade de um determinado produto do carrinho.
*   `DELETE /cart/:id` - Remove determinado produto do carrinho de compras.
*   `DELETE /cart/clear` - Esvazia por completo o carrinho ativo do usuário.

### 📦 Gestão de Pedidos
*   `GET /orders` - Histórico de pedidos gravados no banco SQLite.
*   `GET /orders/:id` - Consulta ficha detalhada de venda (cabeçalho + itens adquiridos).
*   `POST /orders` - Converte os itens salvos do carrinho em pedido formalizado de venda.
*   `PUT /orders/:id/status` - Modifica o status atual de logística do pedido.

### 📍 Gerenciamento de Endereços (CRUD)
*   `GET /addresses` - Lista endereços de entrega cadastrados no perfil do cliente.
*   `POST /addresses` - Adiciona novo local físico para recebimento de entregas.
*   `PUT /addresses/:id` - Modifica logradouro, número ou bairro de endereço salvo.
*   `DELETE /addresses/:id` - Remove endereço.

### 💳 Pagamento
*   `POST /payments/create-preference` - Gera uma preferência de Checkout Pro do Mercado Pago enviando link de pagamento.
*   `POST /payments/webhook` - Webhook de recebimento assíncrono de status transacionais (Mercado Pago IPN).

### 📊 Estatística e Dashboard
*   `GET /dashboard/export` - Retorna as consolidações históricas de faturamento em JSON desenhadas para BI.
