# 🏁 Projeto PI-4 (Comanda+)

> **Projeto Integrador - 4º Semestre**  
> Repositório central para o desenvolvimento do ecossistema **Comanda+**, uma solução full stack para gerenciamento de pedidos e cardápio digital.

[![CI Completo](https://github.com/Alex-sampaio-lima/Projeto-PI-4/actions/workflows/ci-full.yml/badge.svg)](https://github.com/Alex-sampaio-lima/Projeto-PI-4/actions/workflows/ci-full.yml)
[![CI Backend](https://github.com/Alex-sampaio-lima/Projeto-PI-4/actions/workflows/ci-backend.yml/badge.svg)](https://github.com/Alex-sampaio-lima/Projeto-PI-4/actions/workflows/ci-backend.yml)
[![CI Mobile](https://github.com/Alex-sampaio-lima/Projeto-PI-4/actions/workflows/ci-mobile.yml/badge.svg)](https://github.com/Alex-sampaio-lima/Projeto-PI-4/actions/workflows/ci-mobile.yml)

---

## 📂 Organização do Repositório

O projeto está dividido nas seguintes pastas principais:

*   **[comanda-plus/](./comanda-plus)**: Contém o código-fonte principal da aplicação (Mobile + Backend).
    *   `backend/`: API REST desenvolvida em Node.js com SQLite.
    *   `mobile/`: Aplicativo mobile desenvolvido em React Native com Expo.
*   **[Referencia/](./Referencia)**: Materiais de apoio, diagramas e documentação auxiliar do curso.

---

## 🚀 Como Começar

Para ver as instruções detalhadas de como rodar o projeto, configurar o banco de dados e conectar o aplicativo ao servidor, acesse a documentação principal em:

👉 **[Documentação Comanda+](./comanda-plus/README.md)**

---

## 🛠️ Tecnologias Principais

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=DBC4A0)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

---

## 🤖 Integração Contínua (CI/CD)

O projeto conta com pipelines de **Integração Contínua (CI)** totalmente automatizados através do **GitHub Actions**. Isso garante a estabilidade do ecossistema a cada novo commit ou pull request.

### ⚙️ Nossos Workflows
*   **🚀 Pipeline Completo (`ci-full.yml`)**: Executa em paralelo a validação do backend (testes do Jest) e do mobile (Expo Doctor), realizando uma checagem de status unificada para a branch principal.
*   **🔧 CI — Backend (`ci-backend.yml`)**: Dispara automaticamente a cada alteração em `comanda-plus/backend/` para rodar os testes automatizados (Jest) e validar a sintaxe do Node.js.
*   **📱 CI — Mobile (`ci-mobile.yml`)**: Dispara a cada alteração em `comanda-plus/mobile/` para rodar o `npx expo-doctor` e certificar que a estrutura do app Expo está perfeitamente saudável.

Esses mecanismos impedem a inserção de código quebrado no ambiente de desenvolvimento e facilitam o trabalho em equipe!
