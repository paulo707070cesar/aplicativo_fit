import React, { useState } from 'react';
import {
  HOSTINGER_SCHEMA_SQL,
  HOSTINGER_CONFIG_PHP,
  HOSTINGER_API_PHP,
} from '../../data/hostingerCode';

interface HostingerExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostingerExportModal: React.FC<HostingerExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'sql' | 'config' | 'api' | 'guide'>('sql');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'sql':
        return HOSTINGER_SCHEMA_SQL;
      case 'config':
        return HOSTINGER_CONFIG_PHP;
      case 'api':
        return HOSTINGER_API_PHP;
      case 'guide':
        return `# GUIA DE IMPLANTAÇÃO NA HOSTINGER (PASSO A PASSO)

1. ACESSE SEU PAINEL HOSTINGER (hPanel)
   - Faça login na sua conta Hostinger e selecione sua hospedagem.

2. CRIE O BANCO DE DADOS MYSQL
   - No menu lateral do hPanel, vá em: 'Bancos de Dados' -> 'Gerenciamento de Bancos de Dados MySQL'.
   - Crie um novo banco (ex: u123456789_fitpulse) com usuário e senha segura.
   - Guarde essas credenciais.

3. IMPORTE O ARQUIVO SQL NO PHPMYADMIN
   - Clique em 'Entrar no phpMyAdmin' ao lado do banco criado.
   - No phpMyAdmin, clique na aba 'Importar' (ou 'SQL').
   - Cole ou importe o conteúdo do arquivo 'schema.sql' fornecido aqui.
   - Clique em 'Executar'. Todas as tabelas e dados de teste (Mariana, Rafael, cobranças Pix) serão criados!

4. ENVIE OS ARQUIVOS PHP VIA GERENCIADOR DE ARQUIVOS / FTP
   - Abra o 'Gerenciador de Arquivos' da Hostinger.
   - Navegue até a pasta 'public_html'.
   - Crie o arquivo 'config.php' e atualize as linhas com o Nome, Usuário e Senha do banco que você criou no passo 2.
   - Crie o arquivo 'api.php' e cole o código da API PHP.
   - Envie os arquivos compilados da aplicação (pasta 'dist') para 'public_html'.

5. PRONTO!
   - Acesse seu domínio (ex: seudominio.com.br) e seu sistema FitPulse estará funcionando em produção na Hostinger!
`;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    let filename = 'schema.sql';
    let mime = 'text/plain';
    if (activeCodeTab === 'config') {
      filename = 'config.php';
      mime = 'application/x-httpd-php';
    } else if (activeCodeTab === 'api') {
      filename = 'api.php';
      mime = 'application/x-httpd-php';
    } else if (activeCodeTab === 'guide') {
      filename = 'COMO_INSTALAR_HOSTINGER.txt';
    }

    const blob = new Blob([getActiveCode()], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-50 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e9edff] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#673ab7] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">database</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">
                Exportador Hostinger (HTML, JS, PHP & MySQL)
              </h3>
              <p className="text-[11px] text-[#6e7b6c]">
                Código pronto para hospedar no cPanel / hPanel da Hostinger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f3ff] hover:bg-[#e9edff] flex items-center justify-center text-[#3e4a3d] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tabs for files */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveCodeTab('sql')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCodeTab === 'sql'
                ? 'bg-[#673ab7] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e9edff]'
            }`}
          >
            📄 schema.sql (Banco MySQL)
          </button>
          <button
            onClick={() => setActiveCodeTab('config')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCodeTab === 'config'
                ? 'bg-[#673ab7] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e9edff]'
            }`}
          >
            🐘 config.php (Conexão PDO)
          </button>
          <button
            onClick={() => setActiveCodeTab('api')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCodeTab === 'api'
                ? 'bg-[#673ab7] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e9edff]'
            }`}
          >
            ⚡ api.php (Endpoints REST)
          </button>
          <button
            onClick={() => setActiveCodeTab('guide')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCodeTab === 'guide'
                ? 'bg-[#673ab7] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e9edff]'
            }`}
          >
            📘 Passo a Passo Hostinger
          </button>
        </div>

        {/* Code preview block */}
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#141b2b] text-[#f9f9ff] p-4 flex flex-col font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
            <span className="text-[10px] text-white/60 uppercase tracking-wider">
              {activeCodeTab === 'sql'
                ? 'schema.sql - MySQL 5.7+ / MariaDB'
                : activeCodeTab === 'config'
                ? 'config.php - Hostinger PDO'
                : activeCodeTab === 'api'
                ? 'api.php - PHP REST API'
                : 'Instruções Hostinger'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 text-[11px] cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
                <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="px-2.5 py-1 rounded-lg bg-[#006b2c] hover:bg-[#00873a] text-white flex items-center gap-1 text-[11px] cursor-pointer font-bold shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Baixar</span>
              </button>
            </div>
          </div>

          <pre className="flex-1 overflow-y-auto pt-3 text-white/90 leading-relaxed whitespace-pre-wrap selection:bg-[#006b2c]">
            {getActiveCode()}
          </pre>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#e9edff] flex items-center justify-between text-xs text-[#6e7b6c] shrink-0">
          <span>Totalmente compatível com phpMyAdmin, Apache e Nginx da Hostinger.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] font-bold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
