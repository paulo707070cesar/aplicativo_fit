# Instruções de Deploy para Produção na Hostinger (FitPulse Pro PWA)

Este documento descreve o passo a passo completo para compilar e publicar a aplicação **FitPulse Pro** em produção em uma hospedagem da **Hostinger** (hospedagem de sites ou VPS baseada em Apache/Nginx), configurando-a como um **Progressive Web App (PWA)** instalável em celulares e computadores.

---

## 1. Verificação de Prontidão (Code Review & CRUD)
O sistema foi totalmente auditado e testado para produção:
- **CRUD Completo**: Cadastro, edição, listagem e remoção de alunos, fichas de treino, cobranças Pix e anotações do coach.
- **Funcionalidades Nativas e WhatsApp**:
  - Geração de resumo de treino concluído em imagem/PDF para compartilhamento instantâneo via WhatsApp (`wa.me`).
  - Seção de "Evolução Visual" com fotos de *Antes e Depois* lado a lado e suporte a captura por câmera em tempo real (`getUserMedia`).
  - Módulo Financeiro Pix com gatilhos de cobrança rápida integrados ao WhatsApp.
- **Interface Responsiva & Tailwind CSS v4**: Otimizado para telas mobile (smartphones) e desktop com navegação fluida.

---

## 2. Passo a Passo para Deploy na Hostinger

### Passo 1: Gerar o Build de Produção
No seu ambiente de desenvolvimento local ou terminal com acesso ao projeto, execute o comando de build do Vite:
```bash
npm run build
```
Isso criará uma pasta chamada **`dist/`** na raiz do projeto contendo todos os arquivos otimizados, minificados e prontos para produção (`index.html`, arquivos JS e CSS otimizados).

### Passo 2: Configurar o Arquivo `.htaccess` (Essencial para SPA / React Router / Navegação)
Como o FitPulse é uma aplicação SPA (Single Page Application) baseada em rotas dinâmicas simuladas via estado e views, é necessário instruir o servidor Apache da Hostinger a redirecionar todas as rotas para `index.html`.

Crie um arquivo chamado **`.htaccess`** dentro da pasta `dist/` (ou envie-o para a raiz do seu domínio no Gerenciador de Arquivos da Hostinger) com o seguinte conteúdo:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache e Compressão para alta performance PWA
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### Passo 3: Enviar os Arquivos para a Hostinger
1. Acesse o **hPanel da Hostinger** do seu domínio.
2. Abra o **Gerenciador de Arquivos** (*File Manager*) ou utilize um cliente **FTP/SFTP** (como FileZilla).
3. Navegue até a pasta pública do seu domínio (geralmente **`public_html`** ou `domains/seudominio.com/public_html`).
4. Faça o upload de **todo o conteúdo** gerado dentro da pasta `dist/` (incluindo o arquivo `.htaccess` e a pasta `assets`).

---

## 3. Configuração como Progressive Web App (PWA) na Hostinger

Para garantir que os alunos e coaches possam instalar o FitPulse diretamente na tela inicial do celular ou computador (com ícone de aplicativo nativo):

1. **Certificado SSL (HTTPS Obrigatório)**:
   - Na Hostinger, certifique-se de ativar o **SSL Gratuito (Let's Encrypt)** no painel do seu domínio. PWAs exigem HTTPS para registrar Service Workers e usar APIs de câmera.
2. **Manifesto do Aplicativo (`manifest.json`)**:
   - Garanta que seu domínio tenha permissão para carregamento de assets. Como todos os ícones e avatares são gerados em alta performance via SVG/DataURL e componentes React, o app funciona instantaneamente sem falhas de CORS ou links externos quebrados.
3. **Instalação no Celular**:
   - Acesse o site publicado na Hostinger pelo navegador do celular (Chrome no Android ou Safari no iOS).
   - Toque no menu do navegador e selecione **"Adicionar à Tela Inicial"** (*Add to Home Screen*). O FitPulse abrirá em tela cheia como um aplicativo nativo.

---
*Pronto! Seu aplicativo FitPulse Pro está totalmente auditado, otimizado e pronto para rodar em alta performance na Hostinger.*
