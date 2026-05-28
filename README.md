# 🍽️ Comanda+ — Ecossistema de Autoatendimento e Cardápio Digital
Node.js Express React Native Expo SQLite CI GitHub Actions

Este projeto é um ecossistema digital de autoatendimento, gerenciamento de comandas e cardápio interativo, permitindo que clientes realizem seus próprios pedidos, gerenciem carrinhos de compras e finalizem pagamentos de forma ágil e segura em bares e restaurantes. Desenvolvido como parte do Projeto Integrador IV (PI-4) no Senac.

🚀 Tecnologias Utilizadas
Backend
*   **Node.js (18+)**: Ambiente de execução Javascript no servidor.
*   **Express 4.18.3**: Framework minimalista e flexível para construção de APIs RESTful.
*   **Bcryptjs**: Criptografia segura (hashing) para as senhas dos usuários.
*   **Express Validator 7.3.2**: Validação e sanitização de dados recebidos nas rotas HTTP.
*   **Jest 29.7.0**: Framework de testes automatizados para execução de suíte funcional.
*   **Supertest 7.0.0**: Biblioteca para simulação de requisições HTTP e teste de endpoints.

Frontend (Mobile)
*   **React Native 0.81.5**: Framework principal para construção da interface móvel nativa.
*   **Expo SDK 54.0.34**: Conjunto de ferramentas de desenvolvimento rápido para React Native.
*   **React Navigation 6.x / 7.x**: Biblioteca de roteamento para telas em pilha (Stack) e guias (Tabs).
*   **Axios 1.6.8**: Cliente HTTP baseado em Promises para consumo assíncrono das APIs.

Banco de Dados
*   **SQLite**: Banco de dados relacional orientado a arquivos locais, leve e transacional.

BI & Análise de Dados (Data Science)
*   **Python 3**: Linguagem de programação para ciência de dados e machine learning.
*   **Pandas**: Biblioteca profissional de análise e manipulação flexível de dados.
*   **Matplotlib & Seaborn**: Bibliotecas gráficas para plotagem estatística e dashboards visuais.
*   **Google Colaboratory**: Ambiente iterativo na nuvem para análise exploratória de negócios.

CI/CD
*   **GitHub Actions**: Pipeline de integração contínua integrada com validações de backend e mobile paralelas.

🛠️ Como Executar o Projeto
Pré-requisitos
*   Node.js 18+ instalado.
*   Dispositivo celular com aplicativo Expo Go instalado (para rodar nativamente) ou simulador configurado.

1. Clonar o Repositório
```bash
git clone https://github.com/Alex-sampaio-lima/Projeto-PI-4.git
cd Projeto-PI-4
```

2. Executar o Backend
```bash
cd comanda-plus/backend
npm install
npm run dev
```
O servidor backend estará disponível em `http://localhost:3000`.

3. Executar o Mobile
```bash
cd comanda-plus/mobile
npm install
npm run dev
```
O aplicativo móvel será aberto pelo utilitário Expo CLI, contando com autodetecção inteligente do IP privado local da máquina para comunicação direta com a API.

✨ Funcionalidades Principais
*   **Autenticação**: Registro e login de clientes com segurança, controle de sessão e criptografia de senhas via bcryptjs.
*   **Cardápio Digital**: Navegação fluida por categorias de produtos (bebidas, pratos principais, sobremesas) e visualização de detalhes.
*   **Gestão de Carrinho**: Adição, alteração de quantidade e remoção de itens em tempo real com estado persistente.
*   **Gestão de Endereços (CRUD)**: Criação, visualização, atualização e exclusão de múltiplos endereços do cliente.
*   **Pedidos e Checkout**: Envio seguro da comanda com simulação de pagamento integrada via SDK do Mercado Pago.
*   **Inteligência de Negócios (BI)**: Contém gerador faker de massa de dados histórica densa, ferramentas autônomas de exportação para PowerBI e o script científico de dashboard **`ado_estatistica.py`** na raiz da API, gerando relatórios gráficos dinâmicos em HTML e imagens estáticas PNG das principais métricas do negócio.

🧪 Testes e Qualidade
O projeto foca em integridade de fluxos de ponta a ponta através de suíte de testes de rotas integradas.

Backend
Rodar os testes funcionais e de endpoints HTTP:
```bash
cd comanda-plus/backend
npm test
```

> [!NOTE]
> Os testes do backend do Comanda+ realizam chamadas simuladas de rotas HTTP de forma integrada usando Jest & Supertest, cobrindo cenários críticos de criação de contas de usuários, autenticação, controle de acessos a rotas privadas, gestão de comandas, pedidos e carrinho. Isso garante que a API funcione de forma consistente e segura a cada mudança sem a necessidade de interferência de testes manuais exaustivos.

⚙️ Pipeline CI/CD (GitHub Actions)
O pipeline de integração contínua é executado automaticamente a cada push ou pull_request em qualquer branch de desenvolvimento para garantir qualidade de código.

```text
ci-backend (Jest)  ──→ ci-full (Status Consolidado)
ci-mobile (Expo)   ──→ (executa em paralelo)
```

| Job | Descrição |
| :--- | :--- |
| **ci-backend** | Instala as dependências do backend, monta a estrutura SQLite e roda testes integrados com Jest & Supertest. |
| **ci-mobile** | Instala as dependências do mobile e roda o utilitário Expo Doctor para auditar dependências nativas. |
| **ci-full** | Consolida o status dos jobs paralelos em uma única aprovação de integridade antes da união da branch (merge). |

📁 Estrutura do Projeto
```text
Projeto-PI-4/
├── .github/
│   └── workflows/
│       ├── ci-backend.yml     # Pipeline de testes do Backend Node.js
│       ├── ci-mobile.yml      # Pipeline de saúde do Mobile Expo
│       └── ci-full.yml        # Pipeline integrado consolidado
├── comanda-plus/
│   ├── backend/               # API REST em Node.js com SQLite (Servidor)
│   │   ├── src/               # Código fonte (controllers, models, routes)
│   │   ├── scripts/           # Massa de testes faker e exportadores estatísticos
│   │   └── __tests__/         # Testes de integração de rotas com Jest & Supertest
│   └── mobile/                # Aplicativo mobile em React Native e Expo (Cliente)
│       ├── src/               # Componentes, Contextos, Telas e Serviços
│       └── scripts/           # Script inteligente de detecção de IP privado
├── Referencia/                # Documentos de apoio acadêmicos e análises de BI
└── README.md                  # Documentação principal
```

👥 Desenvolvedores
*   **Alexsander Sampaio Lima**
*   **Ana Julia Ferreira Lima**
*   **Sthephany Viana da Silva**
*   **Thalyta Cristina Santana Silva**

Este projeto foi desenvolvido com foco em práticas de Qualidade de Software (Q.A) e Engenharia de Requisitos aplicada ao Food Service.
