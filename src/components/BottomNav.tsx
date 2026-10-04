import React, { useState } from 'react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSidebar?: () => void;
  onOpenHostingerModal: () => void;
  onOpenImageLinksModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenSidebar,
  onOpenHostingerModal,
  onOpenImageLinksModal,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      {/* Floating "Mais" Menu Drawer / Popover */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl space-y-3 mb-16 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-[22px]">apps</span>
                <h3 className="font-bold text-[#141b2b] text-base">Mais Telas & Recursos</h3>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Central de IA & Assistente */}
              <button
                onClick={() => {
                  onNavigate('ai-hub');
                  setShowMoreMenu(false);
                }}
                className={`p-3 rounded-2xl flex flex-col items-start gap-1.5 transition-all text-left col-span-2 ${
                  currentView === 'ai-hub' || currentView === 'assistente-ia'
                    ? 'bg-[#006b2c] text-white shadow-md'
                    : 'bg-gradient-to-r from-[#006b2c]/10 to-[#7ffc97]/20 border border-[#006b2c]/20 hover:bg-[#006b2c]/15 text-[#141b2b]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#006b2c]">
                      <span className="material-symbols-outlined text-[20px] animate-pulse">psychology</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">Central de Inteligência Artificial</h4>
                      <p className={`text-[11px] ${currentView === 'ai-hub' ? 'text-white/80' : 'text-[#6e7b6c]'}`}>
                        Assistente, CRUD de Treinos, Análises e Agentes
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#7ffc97] text-[#002109] px-2 py-0.5 rounded-full shrink-0">
                    Gemini 3.1
                  </span>
                </div>
              </button>

              {/* Configuração da API de IA */}
              <button
                onClick={() => {
                  onNavigate('config-ia');
                  setShowMoreMenu(false);
                }}
                className={`p-3 rounded-2xl flex flex-col items-start gap-1.5 transition-all text-left ${
                  currentView === 'config-ia'
                    ? 'bg-[#006b2c]/10 text-[#006b2c] ring-1 ring-[#006b2c]'
                    : 'bg-[#f9f9ff] hover:bg-[#e9edff] text-[#141b2b]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#006b2c]">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs">Configurar API IA</h4>
                  <p className="text-[11px] text-[#6e7b6c]">Parâmetros, modelo & teste</p>
                </div>
              </button>

              {/* Financeiro */}
              <button
                onClick={() => {
                  onNavigate('financeiro');
                  setShowMoreMenu(false);
                }}
                className={`p-3 rounded-2xl flex flex-col items-start gap-1.5 transition-all text-left ${
                  currentView === 'financeiro' ? 'bg-[#006b2c]/10 text-[#006b2c] ring-1 ring-[#006b2c]' : 'bg-[#f9f9ff] hover:bg-[#e9edff] text-[#141b2b]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#006b2c]">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs">Módulo Financeiro</h4>
                  <p className="text-[11px] text-[#6e7b6c]">Cobranças Pix & KPIs</p>
                </div>
              </button>

              {/* Treino Ao Vivo (Mariana) */}
              <button
                onClick={() => {
                  onNavigate('live-treino');
                  setShowMoreMenu(false);
                }}
                className={`p-3 rounded-2xl flex flex-col items-start gap-1.5 transition-all text-left ${
                  currentView === 'live-treino' ? 'bg-[#006b2c]/10 text-[#006b2c] ring-1 ring-[#006b2c]' : 'bg-[#f9f9ff] hover:bg-[#e9edff] text-[#141b2b]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#2170e4]">
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs">FitPulse Live</h4>
                  <p className="text-[11px] text-[#6e7b6c]">Treino ao vivo em execução</p>
                </div>
              </button>

              {/* Treino Concluído */}
              <button
                onClick={() => {
                  onNavigate('treino-concluido');
                  setShowMoreMenu(false);
                }}
                className={`p-3 rounded-2xl flex flex-col items-start gap-1.5 transition-all text-left ${
                  currentView === 'treino-concluido' ? 'bg-[#006b2c]/10 text-[#006b2c] ring-1 ring-[#006b2c]' : 'bg-[#f9f9ff] hover:bg-[#e9edff] text-[#141b2b]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#ff9800]">
                  <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs">Treino Concluído</h4>
                  <p className="text-[11px] text-[#6e7b6c]">Métricas & Feedback PSE</p>
                </div>
              </button>

              {/* Hostinger Exporter */}
              <button
                onClick={() => {
                  onOpenHostingerModal();
                  setShowMoreMenu(false);
                }}
                className="p-3 rounded-2xl bg-[#673ab7]/10 hover:bg-[#673ab7]/20 text-[#673ab7] flex flex-col items-start gap-1.5 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#673ab7]">
                  <span className="material-symbols-outlined text-[18px]">database</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs">Hostinger PHP & SQL</h4>
                  <p className="text-[11px] text-[#673ab7]/80">Arquivos para servidor</p>
                </div>
              </button>

              {/* Links de Imagens HTML */}
              <button
                onClick={() => {
                  onOpenImageLinksModal();
                  setShowMoreMenu(false);
                }}
                className="p-3 rounded-2xl bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#141b2b] flex flex-col items-start gap-1.5 transition-all text-left col-span-2"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#006b2c]">link</span>
                  <span className="font-bold text-xs">Links Diretos das Imagens para HTML</span>
                </div>
                <p className="text-[11px] text-[#6e7b6c]">
                  Copie URLs prontas para usar nas tags &lt;img src="..." /&gt; do seu código HTML/PHP
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main fixed bottom navigation bar (Mobile only) */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#e9edff] shadow-[0_-2px_12px_rgba(0,0,0,0.04)] md:hidden"
        aria-label="Navegação Principal Mobile"
      >
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
          {/* Dashboard */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'text-[#006b2c] font-bold'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: currentView === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}
            >
              dashboard
            </span>
            <span className="text-[11px]">Dashboard</span>
          </button>

          {/* Clientes */}
          <button
            onClick={() => onNavigate('clientes')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] transition-all cursor-pointer ${
              currentView === 'clientes' || currentView === 'perfil-aluno'
                ? 'text-[#006b2c] font-bold'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings:
                  currentView === 'clientes' || currentView === 'perfil-aluno' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              group
            </span>
            <span className="text-[11px]">Clientes</span>
          </button>

          {/* Treinos */}
          <button
            onClick={() => onNavigate('novo-treino')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] transition-all cursor-pointer ${
              currentView === 'novo-treino'
                ? 'text-[#006b2c] font-bold'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: currentView === 'novo-treino' ? "'FILL' 1" : "'FILL' 0" }}
            >
              fitness_center
            </span>
            <span className="text-[11px]">Treinos</span>
          </button>

          {/* Sidebar Menu Button */}
          <button
            onClick={() => {
              if (onOpenSidebar) {
                onOpenSidebar();
              } else {
                setShowMoreMenu(!showMoreMenu);
              }
            }}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] transition-all cursor-pointer ${
              ['financeiro', 'live-treino', 'treino-concluido', 'ai-hub', 'assistente-ia', 'config-ia'].includes(
                currentView
              )
                ? 'text-[#006b2c] font-bold'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings: [
                  'financeiro',
                  'live-treino',
                  'treino-concluido',
                  'ai-hub',
                  'assistente-ia',
                  'config-ia',
                ].includes(currentView)
                  ? "'FILL' 1"
                  : "'FILL' 0",
              }}
            >
              menu_open
            </span>
            <span className="text-[11px]">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
};
