# 📱 Comanda+ Mobile — Aplicativo React Native & Expo

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</p>

> **Aplicativo Mobile Multiplataforma** elegante de pedidos desenvolvido com React Native e Expo SDK. Oferece uma interface imersiva, fluida e viva (estilo marketplace de delivery/iFood) que se comunica em tempo real com a API REST de backend do Comanda+.

---

## 🛠️ Tecnologias e Versões

*   **Framework Mobile**: `React Native 0.81.5` (Componentização nativa de alta performance)
*   **Facilitador de Compilação**: `Expo SDK ~54.0.34` (Ferramental de build nativo e Expo Go)
*   **Gerenciamento de Navegação**: `React Navigation`
    *   `@react-navigation/native ^6.1.17` (Núcleo de navegação)
    *   `@react-navigation/bottom-tabs ^6.5.20` (Navegação inferior por abas do app)
    *   `@react-navigation/stack ^6.3.29` (Navegação em pilhas de visualização clássicas)
    *   `@react-navigation/native-stack ^7.14.10` (Pilha nativa otimizada para telas secundárias)
*   **Consumo de APIs**: `axios ^1.6.8` (Cliente HTTP para requisições assíncronas assinaladas)
*   **Componentes Web**: `react-native-web ^0.21.0` (Habilita a execução em navegadores padrão)

---

## 📂 Estrutura de Diretórios (mobile/)

```text
📦 mobile/
├── 📁 src/
│   ├── 📁 assets/               → Identidade visual do aplicativo
│   │   ├── 📁 images/           → Banners e imagens locais
│   │   └── 📁 icons/            → Ícones personalizados
│   ├── 📁 components/           → Elementos visuais reutilizáveis
│   │   ├── 📁 ui/
│   │   │   ├── Botao.js         → Componente flexível de botão (3 estilos)
│   │   │   └── Header.js        → Cabeçalho reutilizável com botão de voltar
│   │   ├── 📁 produto/
│   │   │   ├── CardProduto.js   → Cartão de produto exibindo foto, preço e botão "Adicionar"
│   │   │   └── CategoriaItem.js → Chips clicáveis para filtros de categorias
│   │   ├── 📁 carrinho/
│   │   │   └── ItemCarrinho.js  → Linha de item de carrinho com alteração de quantidade
│   │   └── 📁 restaurante/
│   │       └── CardRestaurante.js → Bloco de destaque para avaliação de restaurante parceiro
│   ├── 📁 context/
│   │   └── CartContext.js       → Gerenciador do estado global do carrinho de compras
│   ├── 📁 hooks/
│   │   └── useCart.js           → Gancho utilitário customizado para acesso simplificado ao carrinho
│   ├── 📁 navigation/
│   │   ├── AppNavigator.js      → Roteador mestre (Controla Telas de Login vs Telas do App)
│   │   ├── StackNavigator.js    → Fluxo linear de navegação secundária (Checkout, Confirmação)
│   │   └── TabNavigator.js      → Navegação inferior por ícones (Home, Perfil, Carrinho)
│   ├── 📁 screens/              → Telas cheias controladas pelo roteador
│   │   ├── 📁 auth/
│   │   │   └── LoginScreen.js
│   │   ├── 📁 home/
│   │   │   └── HomeScreen.js
│   │   ├── 📁 produtos/
│   │   │   ├── ProdutosScreen.js
│   │   │   └── DetalheProdutoScreen.js
│   │   ├── 📁 carrinho/
│   │   │   ├── CarrinhoScreen.js
│   │   │   └── CheckoutScreen.js
│   │   ├── 📁 pedido/
│   │   │   └── PedidoFinalizadoScreen.js
│   │   └── 📁 conta/
│   │       ├── ContaScreen.js
│   │       └── EnderecosScreen.js
│   ├── 📁 services/
│   │   ├── api.js               → Instância Axios com autodetector automático de IP
│   │   └── endpoints.js         → Métodos utilitários encapsulados de chamadas à API
│   ├── 📁 styles/
│   │   ├── theme.js             → Cores institucionais oficiais e tipografia (tokens)
│   │   └── globalStyles.js      → Estilos base compartilhados
│   └── 📁 utils/
│       └── format.js            → Formatador de moeda (BRL R$), CEP e CEP a texto
├── 📁 scripts/
│   └── generate-env.js          → Script de detecção automática de IP para rede local
├── App.js                       → Entry point e provedor de contextos gerais do app
├── app.json                     → Configurações de metadados e ícone do app Expo
├── babel.config.js
├── package.json
└── .env                         → Constantes geradas em tempo de inicialização (auto)
```

---

## ⚙️ Configuração e Execução

### 1. Instalar as dependências do projeto
Abra o terminal na pasta `/comanda-plus/mobile/` e execute:
```bash
npm install
```

---

### 2. Executar no Dispositivo Móvel (Android / iOS) via LAN

> **⚡ Automação Inteligente (Sem Configuração Manual):**  
> Dispositivos físicos que rodam o Expo Go não conseguem se conectar com a API usando o endereço `localhost` do computador. Para contornar isso de forma profissional, criamos um script utilitário rodado no `npm run dev`.  
> O script **detecta automaticamente o IP privado da sua máquina** na rede local, gera o arquivo `.env` com a URL correta da API e injeta o hostname dinâmico nas configurações de empacotamento do Expo para que o QR Code use a rota certa de LAN de forma 100% autônoma!

Inicie o ambiente de desenvolvimento mobile:
```bash
npm run dev
```

✅ Saída esperada no terminal de sucesso:
```text
✅ [Scripts] IP Detectado: 192.168.1.15
📝 [Scripts] .env atualizado com: http://192.168.1.15:3000/api
🚀 [Scripts] Iniciando Expo...
...
› Metro waiting on exp://192.168.1.15:8081
› Scan the QR code above with Expo Go (Android) or Camera (iOS)
```

**Como conectar o celular:**
1. Instale o aplicativo **[Expo Go](https://expo.dev/go)** na Google Play Store ou App Store.
2. Certifique-se de que o seu celular e o seu computador estão **conectados na mesma rede Wi-Fi**.
3. Abra a câmera do celular (iOS) ou o app Expo Go (Android) e **escaneie o QR Code** exibido no terminal da sua máquina. O aplicativo será carregado de imediato!

---

### 3. Executar em Emulação Web (Navegador)
Caso prefira rodar e testar a aplicação de forma ágil direto no navegador web do seu computador:
```bash
npm run web
```
*A aplicação compilará os componentes nativos para web e abrirá automaticamente o navegador padrão no endereço `http://localhost:8081`.*

---

## 📐 Navegação e Estado Global

### Roteamento (React Navigation)
O fluxo de transição de telas foi arquitetado em três camadas:
1.  **`AppNavigator`**: Detecta se o usuário está logado. Se não estiver, prende o fluxo na tela de `LoginScreen`. Caso contrário, roteia para o `TabNavigator`.
2.  **`TabNavigator`**: Controla as abas permanentes inferiores da aplicação (Home, Carrinho, Conta).
3.  **`StackNavigator`**: Controla as telas de foco e fluxos sequenciais que não pertencem ao menu inferior permanente (ex: detalhamento de prato, preenchimento de endereço, fechamento de checkout e tela de sucesso final).

### Estado Global do Carrinho (Context API)
Desenvolvemos o provedor **`CartContext`** (`src/context/CartContext.js`) que encapsula:
*   Os itens ativos pré-selecionados para compra.
*   Cálculo automático de quantidade total de itens.
*   Preço acumulado e aplicação dinâmica de fretes por restaurante.
*   Funções de inclusão (`addToCart`), decremento (`decrementQuantity`) e limpeza total (`clearCart`).

Qualquer tela ou componente secundário do ecossistema consome o carrinho facilmente importando o gancho personalizado `useCart()`:
```javascript
import { useCart } from '../hooks/useCart';

const { cart, addToCart } = useCart();
```

---

## 🎨 Componentização baseada em Props (Reusabilidade)

Em conformidade com as melhores práticas de Engenharia de Software, criamos componentes desacoplados das regras de estado internos que recebem propriedades externas (Props) para renderização customizada:

### Exemplo: Componente `Botao` (`src/components/ui/Botao.js`)
Pode ser invocado passando diferentes rótulos, funções de gatilho de eventos e variantes de design:
```jsx
// Botão de preenchimento principal
<Botao 
  titulo="Adicionar ao Carrinho" 
  onPress={handleAdicionar} 
  variant="primary" 
/>

// Botão menor ou secundário de contorno
<Botao 
  titulo="Cancelar Pedido" 
  onPress={handleCancelar} 
  variant="outline" 
/>
```
