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
│   │   │   ├── cartController.js
│   │   │   ├── categoryController.js
│   │   │   ├── orderController.js
│   │   │   └── productController.js
│   │   ├── 📁 database/
│   │   │   ├── db.js                → Conexão SQLite
│   │   │   └── init.js              → Criação de tabelas + dados mock
│   │   ├── 📁 middlewares/
│   │   │   └── errorHandler.js      → Tratamento global de erros
│   │   ├── 📁 models/
│   │   │   ├── addressModel.js
│   │   │   ├── cartModel.js
│   │   │   ├── categoryModel.js
│   │   │   ├── orderModel.js
│   │   │   └── productModel.js
│   │   ├── 📁 routes/
│   │   │   ├── index.js             → Agrupador de rotas
│   │   │   ├── addressRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── productRoutes.js
│   │   ├── 📁 utils/
│   │   │   └── helpers.js           → Funções auxiliares
│   │   └── app.js                   → Configuração do Express
│   ├── server.js                    → Entry point do servidor
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
│   │   │   └── carrinho/
│   │   │       └── ItemCarrinho.js  → Item do carrinho com quantidade
│   │   ├── 📁 context/
│   │   │   └── CartContext.js       → Estado global do carrinho
│   │   ├── 📁 hooks/
│   │   │   └── useCart.js           → Hook para acessar o carrinho
│   │   ├── 📁 navigation/
│   │   │   ├── AppNavigator.js      → Root: Login → App
│   │   │   ├── StackNavigator.js    → Stack com Tabs + telas de detalhe
│   │   │   └── TabNavigator.js      → Bottom Tabs (4 abas)
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
│   │   │   ├── api.js               → Instância Axios configurada
│   │   │   └── endpoints.js         → Funções para cada endpoint
│   │   ├── 📁 styles/
│   │   │   ├── theme.js             → Design tokens (cores, tipografia)
│   │   │   └── globalStyles.js      → Estilos compartilhados
│   │   └── 📁 utils/
│   │       └── format.js            → Formatação de moeda, data, endereço
│   ├── App.js                       → Entry point do app
│   ├── app.json                     → Configuração do Expo
│   ├── babel.config.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                     → Scripts raiz
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

### 3. Rodar o Mobile

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

O banco SQLite é gerenciado automaticamente. Tabelas criadas:

| Tabela | Descrição |
|---|---|
| `categories` | Categorias dos produtos |
| `products` | Produtos com preço, imagem e avaliação |
| `cart` | Itens do carrinho de compras |
| `orders` | Pedidos realizados |
| `order_items` | Itens de cada pedido |
| `addresses` | Endereços de entrega |

### Dados Mock (inseridos automaticamente)

- **5 categorias:** Hambúrguer, Pizza, Bebidas, Sobremesas, Saudável
- **10 produtos** com nome, descrição, preço, imagem (Unsplash) e avaliação
- **1 endereço** de exemplo pré-cadastrado

---

## 📡 Endpoints da API

Base URL: `http://localhost:3000/api`

### Produtos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/products` | Lista todos os produtos |
| GET | `/products?category_id=1` | Filtra por categoria |
| GET | `/products/:id` | Busca produto por ID |
| POST | `/products` | Cria novo produto |
| PUT | `/products/:id` | Atualiza produto |
| DELETE | `/products/:id` | Remove produto |

### Categorias
| Método | Rota | Descrição |
|---|---|---|
| GET | `/categories` | Lista todas as categorias |
| GET | `/categories/:id` | Busca categoria por ID |
| POST | `/categories` | Cria nova categoria |
| PUT | `/categories/:id` | Atualiza categoria |
| DELETE | `/categories/:id` | Remove categoria |

### Carrinho
| Método | Rota | Descrição |
|---|---|---|
| GET | `/cart` | Lista itens + total |
| POST | `/cart` | Adiciona produto ao carrinho |
| PUT | `/cart/:id` | Atualiza quantidade |
| DELETE | `/cart/:id` | Remove item |
| DELETE | `/cart/clear` | Limpa o carrinho inteiro |

### Pedidos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/orders` | Lista todos os pedidos |
| GET | `/orders/:id` | Busca pedido com itens |
| POST | `/orders` | Cria pedido (usa o carrinho atual) |
| PUT | `/orders/:id/status` | Atualiza status do pedido |
| DELETE | `/orders/:id` | Remove pedido |

### Endereços
| Método | Rota | Descrição |
|---|---|---|
| GET | `/addresses` | Lista endereços |
| GET | `/addresses/:id` | Busca endereço por ID |
| POST | `/addresses` | Cria novo endereço |
| PUT | `/addresses/:id` | Atualiza endereço |
| DELETE | `/addresses/:id` | Remove endereço |

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

## 👥 Equipe

Projeto desenvolvido para fins acadêmicos — **PI (Projeto Integrador)**.
