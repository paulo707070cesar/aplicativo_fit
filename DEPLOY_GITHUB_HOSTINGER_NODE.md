# Guia de Deploy: GitHub + Hostinger Node.js

Este guia detalha o passo a passo para enviar o projeto **FitPulse Pro** para o **GitHub** e configurá-lo para rodar em produção na **Hospedagem Node.js da Hostinger**.

---

## Passo 1: Enviar o Projeto para o GitHub

1. **Criar um Repositório no GitHub**:
   - Acesse [github.com](https://github.com) e crie um novo repositório (ex: `fitpulse-pro`). Deixe-o público ou privado, sem adicionar `README` inicial (para evitar conflitos).

2. **Inicializar Git e Fazer o Push Local**:
   Abra o terminal na raiz do projeto e execute os comandos:
   ```bash
   git init
   git add .
   git commit -m "feat: FitPulse Pro pronto para produção Node.js"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```

---

## Passo 2: Configurar o Aplicativo Node.js na Hostinger

1. **Acessar o hPanel da Hostinger**:
   - Faça login na sua conta Hostinger e vá em **Painel do Domínio** -> **Gerenciador de Aplicativos Node.js** (*Node.js Application*).

2. **Criar/Configurar a Aplicação Node.js**:
   - **Versão do Node.js**: Selecione **Node.js 22.x** (a versão usada no deploy atual).
   - **Modo de Aplicação**: `Production`.
   - **Diretório da Aplicação**: Caminho da pasta pública (ex: `public_html` ou o diretório raiz do subdomínio/domínio).
   - **Arquivo de Inicialização (Startup File)**: `server.js`. Esse arquivo carrega `server.ts` pelo `tsx` sem top-level await, compatível com o carregador Node.js da Hostinger.

3. **Conectar ao GitHub (Git Deployment)** (Opcional, se a Hostinger oferecer integração Git na sua versão de painel):
   - Conecte sua conta do GitHub e aponte para o repositório `main`.
   - A Hostinger fará o clone automático.

---

## Passo 3: Configurar Variáveis de Ambiente (Environment Variables)

No painel Node.js da Hostinger, na seção de **Variáveis de Ambiente** (*Environment Variables*), adicione:

* `NODE_ENV` = `production`
* `PORT` = use a porta fornecida automaticamente pela Hostinger; não defina um valor fixo
* `GEMINI_API_KEY` = `sua-chave-api-do-gemini-aqui`

---

## Passo 4: Instalação e Execução na Hostinger

O gerenciador Node.js da Hostinger executará automaticamente os comandos configurados no seu `package.json`:

1. **Instalação de Dependências (`npm install`)**:
   - Instalará todas as dependências listadas em `dependencies`, incluindo `express`, `@google/genai`, `tsx`, etc.
2. **Build de Produção (`npm run build`)**:
   - Compila o front-end React com Vite e gera a pasta `dist/`.
3. **Inicialização (`npm start`)**:
   - Inicia o servidor Express (`server.ts` executado via `tsx`), que gerencia as rotas de API da IA Gemini (`/api/ai/*`) e serve os arquivos estáticos de produção.

---
*Pronto! Seu backend Node.js com Express e IA Gemini estará rodando com alta performance na Hostinger.*
