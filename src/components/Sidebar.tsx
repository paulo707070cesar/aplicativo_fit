import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAiModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  currentView,
  onNavigate,
  onOpenAiModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    onClose();
  };

  const isDetailView = [
    'perfil-aluno',
    'novo-treino',
    'live-treino',
    'treino-concluido',
  ].includes(currentView);

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-[#e9edff] shadow-xl md:shadow-none flex flex-col justify-between transition-all duration-300 ease-in-out ${
          // Mobile open/close
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          // Desktop width: collapsed (w-20) vs expanded (w-72)
          isCollapsed ? 'md:w-20' : 'md:w-72'
        } w-72`}
        aria-label="Menu Lateral FitPulse"
      >
        {/* Top Header / Brand & Collapse Toggle */}
        <div className="p-3.5 border-b border-[#e9edff] flex items-center justify-between gap-2 min-h-[64px]">
          {/* Logo & Title (hidden text when collapsed) */}
          <button
            onClick={() => handleLinkClick('dashboard')}
            className={`flex items-center gap-2.5 cursor-pointer text-left focus:outline-none min-w-0 ${
              isCollapsed ? 'md:justify-center md:w-full' : ''
            }`}
            title="FitPulse Pro - Início"
          >
            <img
              src={ASSETS.logo}
              alt="FitPulse Logo"
              className="h-8 w-8 object-contain shrink-0"
            />
            {(!isCollapsed || isOpen) && (
              <div className="flex flex-col min-w-0 md:flex">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#006b2c] leading-tight">
                  FitPulse Pro
                </span>
                <span className="text-base font-bold text-[#141b2b] tracking-tight truncate">
                  Gestão & Treinos
                </span>
              </div>
            )}
          </button>

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-8 h-8 rounded-xl bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#3e4a3d] items-center justify-center cursor-pointer transition-colors shrink-0"
            title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>

          {/* Close button (Mobile only) */}
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 rounded-xl bg-[#f1f3ff] text-[#3e4a3d] flex items-center justify-center cursor-pointer hover:bg-[#e9edff]"
            aria-label="Fechar menu lateral"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4 no-scrollbar">
          {/* Back button when inside detail views */}
          {isDetailView && (
            <button
              onClick={() =>
                handleLinkClick(
                  currentView === 'treino-concluido' ? 'perfil-aluno' : 'dashboard'
                )
              }
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#006b2c] bg-[#006b2c]/10 hover:bg-[#006b2c]/20 transition-all cursor-pointer ${
                isCollapsed ? 'md:justify-center' : ''
              }`}
              title="Voltar para tela anterior"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              {(!isCollapsed || isOpen) && <span>Voltar</span>}
            </button>
          )}

          {/* SEÇÃO 1: PRINCIPAL / COCKPIT */}
          <div>
            {(!isCollapsed || isOpen) && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c] block mb-1">
                Principal & Treinos
              </span>
            )}

            <div className="space-y-1">
              {/* Dashboard */}
              <button
                onClick={() => handleLinkClick('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title="Dashboard Principal"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings:
                        currentView === 'dashboard' ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    dashboard
                  </span>
                  {(!isCollapsed || isOpen) && <span>Dashboard</span>}
                </div>
                {(!isCollapsed || isOpen) && currentView === 'dashboard' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>

              {/* Clientes */}
              <button
                onClick={() => handleLinkClick('clientes')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'clientes' || currentView === 'perfil-aluno'
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title="Clientes & Alunos"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings:
                        currentView === 'clientes' || currentView === 'perfil-aluno'
                          ? "'FILL' 1"
                          : "'FILL' 0",
                    }}
                  >
                    group
                  </span>
                  {(!isCollapsed || isOpen) && <span>Clientes</span>}
                </div>
                {(!isCollapsed || isOpen) && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentView === 'clientes' || currentView === 'perfil-aluno'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#e9edff] text-[#006b2c]'
                    }`}
                  >
                    48
                  </span>
                )}
              </button>

              {/* Construtor de Treinos */}
              <button
                onClick={() => handleLinkClick('novo-treino')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'novo-treino'
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title="Construtor de Treinos"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings:
                        currentView === 'novo-treino' ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    fitness_center
                  </span>
                  {(!isCollapsed || isOpen) && <span>Criar Treino</span>}
                </div>
              </button>

              {/* FitPulse Live (Ao Vivo) */}
              <button
                onClick={() => handleLinkClick('live-treino')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'live-treino'
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title="FitPulse Live (Treino Ao Vivo)"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings:
                        currentView === 'live-treino' ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    play_circle
                  </span>
                  {(!isCollapsed || isOpen) && <span>Treino Ao Vivo</span>}
                </div>
                {(!isCollapsed || isOpen) && (
                  <span className="text-[9px] font-bold bg-[#7ffc97] text-[#002109] px-1.5 py-0.5 rounded-full">
                    Mariana
                  </span>
                )}
              </button>

              {/* Treino Concluído */}
              <button
                onClick={() => handleLinkClick('treino-concluido')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'treino-concluido'
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title="Treino Concluído (Feedback & PSE)"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings:
                        currentView === 'treino-concluido' ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    emoji_events
                  </span>
                  {(!isCollapsed || isOpen) && <span>Treino Concluído</span>}
                </div>
              </button>
            </div>
          </div>

          {/* SEÇÃO 2: GESTÃO FINANCEIRA & PIX */}
          <div>
            {(!isCollapsed || isOpen) && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c] block mb-1">
                Finanças & Cobranças
              </span>
            )}

            <div className="space-y-1">
              <button
                onClick={() => handleLinkClick('financeiro')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'financeiro'
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title="Módulo Financeiro Pix"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings:
                        currentView === 'financeiro' ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    payments
                  </span>
                  {(!isCollapsed || isOpen) && <span>Financeiro Pix</span>}
                </div>
                {(!isCollapsed || isOpen) && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentView === 'financeiro'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#e9edff] text-[#006b2c]'
                    }`}
                  >
                    R$ 14.8k
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* SEÇÃO 3: INTELIGÊNCIA ARTIFICIAL */}
          <div>
            {(!isCollapsed || isOpen) && (
              <div className="px-3 flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">
                  Inteligência Artificial
                </span>
                <span className="text-[9px] font-bold bg-[#7ffc97] text-[#002109] px-1.5 py-0.2 rounded">
                  Gemini 3.1
                </span>
              </div>
            )}

            <div className="space-y-1">
              {/* Central IA / Hub */}
              <button
                onClick={() => handleLinkClick('ai-hub')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'ai-hub' || currentView === 'assistente-ia'
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title="Central de IA & Chat Interativo"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[20px] animate-pulse"
                    style={{
                      fontVariationSettings:
                        currentView === 'ai-hub' || currentView === 'assistente-ia'
                          ? "'FILL' 1"
                          : "'FILL' 0",
                    }}
                  >
                    psychology
                  </span>
                  {(!isCollapsed || isOpen) && <span>Central & Chat IA</span>}
                </div>
                {(!isCollapsed || isOpen) && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      currentView === 'ai-hub' || currentView === 'assistente-ia'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#7ffc97]/40 text-[#002109]'
                    }`}
                  >
                    CRUD
                  </span>
                )}
              </button>

              {/* Configurar API IA */}
              <button
                onClick={() => handleLinkClick('config-ia')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'config-ia'
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'text-[#3e4a3d] hover:bg-[#f1f3ff] hover:text-[#141b2b]'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title="Configurações da API de IA"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings:
                        currentView === 'config-ia' ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    tune
                  </span>
                  {(!isCollapsed || isOpen) && <span>Configurar API IA</span>}
                </div>
              </button>

              {/* Modal Rápido IA Coach */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAiModal();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#006b2c] hover:bg-[#006b2c]/10 transition-colors cursor-pointer ${
                  isCollapsed ? 'md:justify-center md:px-0' : ''
                }`}
                title="Popup Rápido IA Coach"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  {(!isCollapsed || isOpen) && <span>Popup Rápido IA</span>}
                </div>
              </button>
            </div>
          </div>

          {/* SEÇÃO 4: INTEGRAÇÕES & FERRAMENTAS */}
          <div>
            {(!isCollapsed || isOpen) && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c] block mb-1">
                Integrações & Sistema
              </span>
            )}

            <div className="space-y-1">
              {/* Notificações */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#3e4a3d] hover:bg-[#f1f3ff] transition-colors cursor-pointer ${
                  isCollapsed ? 'md:justify-center md:px-0' : ''
                }`}
                title="Alertas & Notificações (2)"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">
                    notifications
                  </span>
                  {(!isCollapsed || isOpen) && <span>Alertas</span>}
                </div>
                <span className="w-5 h-5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
              </button>

              {showNotifications && (!isCollapsed || isOpen) && (
                <div className="p-3 bg-[#fff0f0] border border-[#ffdad6] rounded-xl text-xs space-y-1.5 animate-in fade-in-50">
                  <p className="font-bold text-[#ba1a1a] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Alertas Pendentes
                  </p>
                  <p className="text-[11px] text-[#410002]">• 2 cobranças Pix vencidas hoje.</p>
                  <p className="text-[11px] text-[#410002]">• Mariana iniciou sessão de treino.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Profile / Coach Badge */}
        <div className="p-3 border-t border-[#e9edff] bg-[#f9f9ff]">
          <div
            onClick={() => handleLinkClick('dashboard')}
            className={`flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-white transition-all cursor-pointer group ${
              isCollapsed ? 'md:justify-center' : ''
            }`}
            title="Carlos Rossi (Head Coach Pro)"
          >
            <div className="relative shrink-0">
              <img
                src={ASSETS.carlosAvatar}
                alt="Carlos Rossi"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#006b2c]/30 group-hover:ring-[#006b2c]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#006b2c] ring-2 ring-white" />
            </div>

            {(!isCollapsed || isOpen) && (
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#141b2b] truncate group-hover:text-[#006b2c]">
                    Carlos Rossi
                  </span>
                  <span className="text-[9px] font-bold bg-[#7ffc97] text-[#002109] px-1.5 py-0.2 rounded">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-[#6e7b6c] truncate">
                  Head Coach
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
