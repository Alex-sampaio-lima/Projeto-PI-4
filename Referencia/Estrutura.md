# 📱 Projeto Mobile - App de Pedidos Comanda+

## 🚀 Tecnologias Utilizadas

### Frontend

* React Native (Expo)
* React Navigation

### Backend

* Node.js
* Express

### Banco de Dados

* SQLite

---

## 📂 Estrutura do Projeto

```bash
📦 comanda-plus
├── 📁 mobile
│   ├── 📁 src
│   │   ├── 📁 assets
│   │   │   ├── images
│   │   │   └── icons
│   │   │
│   │   ├── 📁 screens
│   │   │   ├── auth
│   │   │   │   └── LoginScreen.js
│   │   │   │
│   │   │   ├── home
│   │   │   │   └── HomeScreen.js
│   │   │   │
│   │   │   ├── produtos
│   │   │   │   ├── ProdutosScreen.js
│   │   │   │   └── DetalheProdutoScreen.js
│   │   │   │
│   │   │   ├── carrinho
│   │   │   │   ├── CarrinhoScreen.js
│   │   │   │   └── CheckoutScreen.js
│   │   │   │
│   │   │   ├── pedido
│   │   │   │   └── PedidoFinalizadoScreen.js
│   │   │   │
│   │   │   ├── conta
│   │   │   │   ├── ContaScreen.js
│   │   │   │   └── EnderecosScreen.js
│   │   │
│   │   ├── 📁 components
│   │   │   ├── ui
│   │   │   │   ├── Botao.js
│   │   │   │   └── Header.js
│   │   │   │
│   │   │   ├── produto
│   │   │   │   ├── CardProduto.js
│   │   │   │   └── CategoriaItem.js
│   │   │   │
│   │   │   ├── carrinho
│   │   │   │   └── ItemCarrinho.js
│   │   │
│   │   ├── 📁 navigation
│   │   │   ├── AppNavigator.js
│   │   │   ├── StackNavigator.js
│   │   │   └── TabNavigator.js
│   │   │
│   │   ├── 📁 services
│   │   │   ├── api.js
│   │   │   └── endpoints.js
│   │   │
│   │   ├── 📁 hooks
│   │   │   └── useCart.js
│   │   │
│   │   ├── 📁 context
│   │   │   └── CartContext.js
│   │   │
│   │   ├── 📁 utils
│   │   │   └── format.js
│   │   │
│   │   ├── 📁 styles
│   │   │   ├── globalStyles.js
│   │   │   └── theme.js
│   │   │
│   │   └── App.js
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── 📁 backend
│   ├── 📁 src
│   │   ├── 📁 config
│   │   │   └── database.js
│   │   │
│   │   ├── 📁 routes
│   │   │   ├── index.js
│   │   │   ├── productRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── addressRoutes.js
│   │   │
│   │   ├── 📁 controllers
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   └── addressController.js
│   │   │
│   │   ├── 📁 models
│   │   │   ├── productModel.js
│   │   │   ├── categoryModel.js
│   │   │   ├── cartModel.js
│   │   │   ├── orderModel.js
│   │   │   └── addressModel.js
│   │   │
│   │   ├── 📁 database
│   │   │   ├── db.js
│   │   │   └── init.js
│   │   │
│   │   ├── 📁 middlewares
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── 📁 utils
│   │   │   └── helpers.js
│   │   │
│   │   └── app.js
│   │
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🧠 Organização do Frontend

### 📁 screens

Contém todas as telas do aplicativo.

### 📁 components

Componentes reutilizáveis que utilizam **props**:

* Recebem dados (nome, preço, imagem)
* Recebem funções (ex: adicionar ao carrinho)

### 📁 navigation

Configuração da navegação:

* Stack Navigator
* Bottom Tab Navigator

### 📁 services

Responsável pela comunicação com a API:

* Requisições HTTP (fetch ou axios)

---

## ⚙️ Organização do Backend

### 📁 routes

Define os endpoints da API.

### 📁 controllers

Contém a lógica das rotas.

### 📁 database

Configuração do SQLite:

* Criação do banco
* Criação das tabelas
* Inserção de dados iniciais

---

## 🔗 Integração

O frontend consome a API através do arquivo:

```bash
src/services/api.js
```

⚠️ Importante:

* Utilizar o IP local da máquina
* Não usar `localhost` no Expo

---

## 🧩 Uso de Props

Os componentes utilizam props para:

* Exibir dados dinâmicos
* Reutilização de código
* Comunicação entre componentes

Exemplo:

```jsx
<CardProduto 
  nome="Hambúrguer"
  preco={25.90}
  onAdd={adicionarAoCarrinho}
/>
```

---

## ▶️ Como Executar o Projeto

### Backend

```bash
cd backend
npm install
node server.js
```

Servidor rodando em:

```bash
http://localhost:3000
```

---

### Frontend (Expo)

```bash
cd mobile
npm install
npx expo start
```

---

## 📌 Observações

* O projeto utiliza dados mockados no início
* O banco SQLite é criado automaticamente
* Estrutura simples e didática para aprendizado

---

## 👩‍💻 Autor

Projeto desenvolvido para fins acadêmicos.

