# 🍽️ Comanda+

![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232a?style=flat-square&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)

> Aplicativo mobile de pedidos estilo iFood simplificado — desenvolvido para fins acadêmicos (Projeto Integrador).

---

## 📱 Sobre o Projeto

O **Comanda+** é uma aplicação full stack de pedidos com:

- 🔐 Tela de login
- 🏠 Home com banner de promoção e produtos recomendados
- 🍔 Cardápio com filtro por categoria e busca por nome
- 🛒 Carrinho funcional com controle de quantidade
- 💳 Checkout com seleção de endereço e forma de pagamento
- ✅ Confirmação de pedido com detalhes completos
- 👤 Perfil com gerenciamento de endereços

---

## 🚀 Tecnologias

### Frontend (mobile/)
| Tecnologia | Versão |
|---|---|
| React Native | 0.81.x |
| Expo | ~54.0 |
| React Navigation (Stack + Tabs) | ^6.x |
| Axios | ^1.6.x |

### Backend (backend/)
| Tecnologia | Versão |
|---|---|
| Node.js | 18+ |
| Express | ^4.18.x |
| sqlite3 | ^5.1.x |
| dotenv | ^16.x |
| cors | ^2.8.x |
| Mercado Pago | ^2.x (Checkout Pro) |

---

## 📂 Estrutura do Projeto

```
📦 comanda-plus/
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── database.js          → Re-export da instância do banco
│   │   ├── 📁 controllers/
│   │   │   ├── addressController.js
│   │   │   ├── authController.js    → Controller de cadastro e login
│   │   │   ├── cartController.js
│   │   │   ├── categoryController.js
│   │   │   ├── companyController.js → Controller para gestão de restaurantes
│   │   │   ├── dashboardController.js → Controller de dados estatísticos (BI)
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js → Controller do Mercado Pago (Checkout Pro)
│   │   │   └── productController.js
│   │   ├── 📁 database/
│   │   │   ├── db.js                → Conexão SQLite com Promises
│   │   │   └── init.js              → Criação de tabelas + dados mock de seed
│   │   ├── 📁 middlewares/
│   │   │   ├── errorHandler.js      → Tratamento global de erros
│   │   │   └── validationMiddleware.js → Processamento de validação do express-validator
│   │   ├── 📁 models/
│   │   │   ├── addressModel.js
│   │   │   ├── cartModel.js
│   │   │   ├── categoryModel.js
│   │   │   ├── companyModel.js      → Modelo relacional para restaurantes
│   │   │   ├── orderModel.js
│   │   │   ├── productModel.js
│   │   │   └── userModel.js         → Modelo para usuários com senhas seguras (bcryptjs)
│   │   ├── 📁 routes/
│   │   │   ├── index.js             → Agrupador central de rotas da API
│   │   │   ├── addressRoutes.js
│   │   │   ├── authRoutes.js        → Rotas de autenticação
│   │   │   ├── cartRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── companyRoutes.js     → Rotas para obter restaurantes
│   │   │   ├── dashboardRoutes.js   → Rota para exportar estatísticas da API
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js     → Rotas de criação de preferência e webhook do MP
│   │   │   └── productRoutes.js
│   │   ├── 📁 utils/
│   │   │   └── helpers.js           → Funções auxiliares
│   │   ├── 📁 validators/
│   │   │   └── index.js             → Esquemas de validação utilizando express-validator
│   │   └── app.js                   → Instanciação e middlewares globais do Express
│   ├── server.js                    → Entry point do servidor HTTP
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── 📁 mobile/
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── 📁 components/
│   │   │   ├── ui/
│   │   │   │   ├── Botao.js         → Botão reutilizável (3 variantes)
│   │   │   │   └── Header.js        → Cabeçalho com voltar e ação direita
│   │   │   ├── produto/
│   │   │   │   ├── CardProduto.js   → Card de produto com imagem e preço
│   │   │   │   └── CategoriaItem.js → Chip de filtro de categoria
│   │   │   ├── carrinho/
│   │   │   │   └── ItemCarrinho.js  → Item do carrinho com quantidade
│   │   │   └── restaurante/
│   │   │       └── CardRestaurante.js → Card de restaurante com avaliação e tempo
│   │   ├── 📁 context/
│   │   │   └── CartContext.js       → Estado global do carrinho
│   │   ├── 📁 hooks/
│   │   │   └── useCart.js           → Hook customizado para uso do carrinho
│   │   ├── 📁 navigation/
│   │   │   ├── AppNavigator.js      → Root Navigator (Login vs App)
│   │   │   ├── StackNavigator.js    → Fluxos e telas detalhadas do App
│   │   │   └── TabNavigator.js      → Abas principais de navegação inferior
│   │   ├── 📁 screens/
│   │   │   ├── auth/
│   │   │   │   └── LoginScreen.js
│   │   │   ├── home/
│   │   │   │   └── HomeScreen.js
│   │   │   ├── produtos/
│   │   │   │   ├── ProdutosScreen.js
│   │   │   │   └── DetalheProdutoScreen.js
│   │   │   ├── carrinho/
│   │   │   │   ├── CarrinhoScreen.js
│   │   │   │   └── CheckoutScreen.js
│   │   │   ├── pedido/
│   │   │   │   └── PedidoFinalizadoScreen.js
│   │   │   └── conta/
│   │   │       ├── ContaScreen.js
│   │   │       └── EnderecosScreen.js
│   │   ├── 📁 services/
│   │   │   ├── api.js               → Instância Axios com IP do host autodetectado
│   │   │   └── endpoints.js         → Funções utilitárias de requisição HTTP
│   │   ├── 📁 styles/
│   │   │   ├── theme.js             → Design tokens (cores oficiais, tipografia)
│   │   │   └── globalStyles.js      → Estilos globais compartilhados do app
│   │   └── 📁 utils/
│   │       └── format.js            → Formatação de dinheiro, data e endereços
│   ├── App.js                       → Entry point do React Native / Expo
│   ├── app.json                     → Configuração nativa e build do Expo
│   ├── babel.config.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão **18 ou superior**
- [Expo Go](https://expo.dev/go) instalado no celular (Android ou iOS)
- Celular e computador na **mesma rede Wi-Fi**

---

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/Projeto-PI-4.git
cd Projeto-PI-4/comanda-plus
```

---

### 2. Rodar o Backend

```bash
cd backend
npm install
```

Copie e configure o arquivo de variáveis de ambiente:

```bash
# Windows
copy .env.example .env

# Linux / Mac
cp .env.example .env
```

Conteúdo do `backend/.env`:
```env
PORT=3000
DB_PATH=./database.sqlite

# Integração Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
WEBHOOK_URL=
```

Inicie o servidor:

```bash
# Modo Produção
npm start

# Modo Desenvolvimento (com auto-reload)
npm run dev
```

✅ Saída esperada no terminal:
```
✅ Banco de dados conectado: ...database.sqlite
✅ Tabelas criadas com sucesso!
✅ Dados mock inseridos com sucesso!

🚀 Servidor rodando em: http://localhost:3000
📡 API disponível em:   http://localhost:3000/api
```

> O banco SQLite é criado e populado automaticamente na primeira execução!

---

### 4. Testes (Backend)

O projeto possui uma suíte de testes automatizados para garantir a integridade da API:

```bash
cd backend

# Rodar todos os testes
npm test

# Rodar testes com relatório de cobertura
npm run test:coverage
```

---

### 3. Geração de Dados para o Dashboard & Análise Estatística (PI)

Para fins de Análise de Dados e Estatística (Requisito do Roteiro Acadêmico do Projeto Integrador), o backend conta com um ecossistema completo para geração e análise de dados de vendas simulados:

#### A. Seed de Dados de Massa (Múltiplas Vendas)
Para que os gráficos e análises fiquem ricos e realistas, você pode popular o banco de dados com centenas de registros de vendas simuladas (distribuídas entre anos, meses, categorias, clientes e bairros diferentes):
```bash
cd backend
npm run db:seed-large
```
*(Esse comando preenche as tabelas de pedidos com dados consistentes usando o Faker).*

#### B. Exportação para Relatórios de BI (PowerBI / Excel)
Para exportar um consolidado analítico de faturamento, tickets e produtos com agregações prontas:
```bash
cd backend
npm run exportar-dados
```
✅ Isso criará o arquivo **`dashboard-estatisticas.json`** na raiz da pasta `backend`. Este arquivo está formatado e resumido, ideal para ser importado diretamente no PowerBI ou Excel.

#### C. Exportação e Análise Avançada no Google Colab (Python / Pandas)
Para realizar uma análise estatística de dados detalhada no Google Colab de acordo com os requisitos acadêmicos, use o script de exportação plano:
```bash
cd backend
npm run db:export-colab
```
✅ Isso criará o arquivo **`dashboard-comanda-plus.json`** na raiz do seu `backend`, contendo colunas planas (`Data`, `Ano`, `Mês`, `Vendedor`, `Cliente`, `Região`, `Produto`, `Valor`, `FormaPgto`) ideais para modelagem em Pandas.

👉 **Como executar a análise no Google Colab:**
1. Copie o código contido em [codigo_colab.py](file:///c:/Users/sthep/Documents/GitHub/Projeto-PI-4/comanda-plus/backend/scripts/codigo_colab.py) ou siga o passo a passo em [codigo_colab.md](file:///c:/Users/sthep/Documents/GitHub/Projeto-PI-4/comanda-plus/backend/scripts/codigo_colab.md).
2. Faça o upload do arquivo `dashboard-comanda-plus.json` gerado na aba lateral do seu caderno do Google Colab.
3. Execute as células para gerar automaticamente gráficos ricos de faturamento por bairro, sazonalidade de restaurantes, ranking de produtos e mapa de calor!

---

### 4. Rodar o Mobile

Abra um **novo terminal**:

```bash
cd mobile
npm install
```

O projeto mobile possui um script de automação (`npm run dev`) que detecta o IP local da sua máquina automaticamente, gera o arquivo `.env` necessário para conectar à API e inicia o Expo. **Não é preciso configurar o IP e criar o `.env` manualmente!**

Inicie o ambiente:

#### Mobile (Android/iOS)
```bash
npm run dev
```
Escaneie o **QR Code** com o app **Expo Go** no celular (certifique-se de que o celular e o computador estão na mesma rede Wi-Fi).

#### Web (Navegador)
```bash
npm run web
```
O aplicativo será aberto no seu navegador padrão em `http://localhost:8081`.

---

## 🗄️ Banco de Dados

O banco SQLite é gerenciado automaticamente. Tabelas criadas e ativas:

| Tabela | Descrição |
|---|---|
| `users` | Usuários do sistema (com criptografia bcryptjs nas senhas) |
| `companies` | Restaurantes/Lojas parceiras cadastrados no marketplace |
| `categories` | Categorias dos produtos |
| `products` | Produtos com preço, imagem, avaliação e chave estrangeira para empresa |
| `cart` | Itens temporários do carrinho de compras do cliente |
| `orders` | Pedidos realizados pelo cliente (com empresa, endereço e forma de pagamento) |
| `order_items` | Itens detalhados de cada pedido realizado (preço histórico e quantidade) |
| `addresses` | Endereços de entrega vinculados ao perfil do usuário |

### Dados Mock (inseridos automaticamente)

- **5 Restaurantes:** McDonald's, Pizza Hut, Subway, Starbucks, etc.
- **5 Categorias:** Hambúrguer, Pizza, Bebidas, Sobremesas, Saudável.
- **10 Produtos** com imagens do Unsplash vinculados a seus respectivos restaurantes.
- **1 Endereço** e **1 Conta de Usuário de teste** pré-cadastrada.

---

## 📡 Endpoints da API

Base URL: `http://localhost:3000/api`

### 🔑 Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cria uma nova conta de usuário |
| POST | `/auth/login` | Realiza login e valida credenciais |
| POST | `/auth/reset-password` | Simula redefinição de senha |

### 🏬 Empresas (Restaurantes)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/companies` | Lista todas as empresas (com filtro opcional por categoria) |
| GET | `/companies/:id` | Detalhes de um restaurante específico e seus produtos |

### 🍔 Produtos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/products` | Lista todos os produtos |
| GET | `/products?category_id=1` | Filtra por categoria |
| GET | `/products/:id` | Busca produto por ID |
| POST | `/products` | Cria novo produto |
| PUT | `/products/:id` | Atualiza produto |
| DELETE | `/products/:id` | Remove produto |

### 📁 Categorias
| Método | Rota | Descrição |
|---|---|---|
| GET | `/categories` | Lista todas as categorias |
| GET | `/categories/:id` | Busca categoria por ID |
| POST | `/categories` | Cria nova categoria |
| PUT | `/categories/:id` | Atualiza categoria |
| DELETE | `/categories/:id` | Remove categoria |

### 🛒 Carrinho
| Método | Rota | Descrição |
|---|---|---|
| GET | `/cart` | Lista itens + total |
| POST | `/cart` | Adiciona produto ao carrinho |
| PUT | `/cart/:id` | Atualiza quantidade |
| DELETE | `/cart/:id` | Remove item |
| DELETE | `/cart/clear` | Limpa o carrinho inteiro |

### 📦 Pedidos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/orders` | Lista todos os pedidos |
| GET | `/orders/:id` | Busca pedido com itens detalhados |
| POST | `/orders` | Cria pedido (converte o carrinho atual em pedido) |
| PUT | `/orders/:id/status` | Atualiza status do pedido |
| DELETE | `/orders/:id` | Remove pedido |

### 📍 Endereços
| Método | Rota | Descrição |
|---|---|---|
| GET | `/addresses` | Lista todos os endereços |
| GET | `/addresses/:id` | Busca endereço por ID |
| POST | `/addresses` | Cria novo endereço |
| PUT | `/addresses/:id` | Atualiza endereço |
| DELETE | `/addresses/:id` | Remove endereço |

### 💳 Pagamentos (Mercado Pago)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/payments/create-preference` | Cria preferência de pagamento no Mercado Pago (Checkout Pro) |
| POST | `/payments/webhook` | Webhook para recebimento de atualizações de transações |

### 📊 Dashboard (BI / Estatísticas)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard/export` | Retorna JSON estruturado e agregado para fins analíticos de BI |

---

## 🌿 Branches

```
main        → código estável e revisado
develop     → integração das funcionalidades
feature/*   → desenvolvimento de features individuais
```

Exemplo de fluxo:
```bash
git checkout develop
git checkout -b feature/minha-feature
# ... desenvolva ...
git push origin feature/minha-feature
# Abra Pull Request para develop
```

---

## 📌 Observações Importantes

- O banco SQLite é criado automaticamente ao iniciar o backend — **não é necessário rodar migrations**
- Dados mock são inseridos apenas na **primeira execução** (quando o banco estiver vazio)
- O login é **simulado** (qualquer email/senha funciona) — autenticação real pode ser implementada futuramente
- **Não use `localhost`** no `.env` do mobile — o Expo roda no celular físico e não acessa o localhost do computador

---

## 🎓 Requisitos do Projeto Integrador (PI) Atendidos

1. **3.1 - CRUD (Criar, Ler, Atualizar, Deletar)**: Cumprido 100%. Exemplo visual na tela de Meus Endereços.
2. **3.2 - Consumo de APIs RESTful**: Cumprido 100%. Mobile utiliza `Axios` para todas as requisições, perfeitamente sincronizado com o banco do backend.
3. **3.3 - Geração de JSON para Dashboard**: Cumprido 100%. Comando autônomo `npm run exportar-dados` gera um arquivo real e local pronto para análises estatísticas.

---

## 👥 Equipe

Projeto desenvolvido para fins acadêmicos — **PI (Projeto Integrador)**.
