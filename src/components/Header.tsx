import React from 'react';
import { ASSETS } from '../data/mockData';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onToggleSidebar?: () => void;
  onOpenHostingerModal: () => void;
  onOpenImageLinksModal: () => void;
  onOpenAiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onToggleSidebar,
  onOpenHostingerModal,
  onOpenImageLinksModal,
  onOpenAiModal,
}) => {
  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'financeiro':
        return 'Financeiro';
      case 'clientes':
        return 'Clientes';
      case 'perfil-aluno':
        return 'Perfil Do Aluno';
      case 'novo-treino':
        return 'Novo Treino';
      case 'live-treino':
        return 'FitPulse Live';
      case 'treino-concluido':
        return 'Treino Concluído';
      case 'ai-hub':
        return 'Central de IA';
      case 'assistente-ia':
        return 'Assistente IA';
      case 'config-ia':
        return 'Configuração de IA';
      default:
        return 'Dashboard';
    }
  };

  const isDetailView = [
    'perfil-aluno',
    'novo-treino',
    'live-treino',
    'treino-concluido',
    'ai-hub',
    'assistente-ia',
    'config-ia',
  ].includes(currentView);

  return (
    <header className="fixed top-0 inset-x-0 md:left-72 sm:md:left-80 z-40 bg-[#ffffff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e9edff] pt-safe transition-all duration-300">
      <div className="max-w-4xl mx-auto h-16 px-3 sm:px-4 flex items-center justify-between gap-2">
        {/* Left side: hamburger menu or back button */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e1e8fd] transition-colors shrink-0 cursor-pointer"
              title="Abrir Menu Lateral"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}

          {isDetailView ? (
            <button
              onClick={() => onNavigate(currentView === 'treino-concluido' ? 'perfil-aluno' : 'dashboard')}
              aria-label="Voltar"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e1e8fd] transition-colors shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 cursor-pointer focus:outline-none text-left"
            >
              <img
                src={ASSETS.logo}
                alt="FitPulse Logo"
                className="h-7 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6e7b6c] leading-tight">
                  FitPulse
                </span>
                <h1 className="text-[16px] sm:text-[17px] font-bold text-[#141b2b] truncate leading-tight">
                  {getTitle()}
                </h1>
              </div>
            </button>
          )}

          {isDetailView && (
            <div className="flex flex-col min-w-0 ml-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#006b2c] leading-tight">
                FitPulse Pro
              </span>
              <h1 className="text-[16px] sm:text-[17px] font-bold text-[#141b2b] truncate leading-tight">
                {getTitle()}
              </h1>
            </div>
          )}
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* AI Hub & Coach Assistant button */}
          <button
            onClick={() => onNavigate('ai-hub')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#006b2c]/10 text-[#006b2c] hover:bg-[#006b2c]/20 transition-all font-semibold text-xs cursor-pointer shadow-sm"
            title="Central de IA & Assistente (High Thinking Mode)"
          >
            <span className="material-symbols-outlined text-[16px] animate-pulse">psychology</span>
            <span className="hidden sm:inline">IA Studio</span>
          </button>

          {/* Direct image links for HTML */}
          <button
            onClick={onOpenImageLinksModal}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e1e8fd] transition-colors text-xs font-medium cursor-pointer"
            title="Copiar links diretos de imagens"
          >
            <span className="material-symbols-outlined text-[16px] text-[#006b2c]">image</span>
            <span className="hidden md:inline">Imagens HTML</span>
          </button>

          {/* Hostinger PHP Export */}
          <button
            onClick={onOpenHostingerModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#673ab7]/10 text-[#673ab7] hover:bg-[#673ab7]/20 transition-colors text-xs font-bold cursor-pointer"
            title="Banco e Código PHP Hostinger"
          >
            <span className="material-symbols-outlined text-[16px]">database</span>
            <span className="hidden sm:inline">Hostinger PHP</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => alert('Notificações: Você tem 2 cobranças vencidas e 1 sessão marcada para hoje.')}
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#3e4a3d] hover:bg-[#f1f3ff] transition-colors cursor-pointer"
            aria-label="Notificações"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
          </button>

          {/* Carlos Trainer Profile */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="relative flex items-center justify-center p-0.5 cursor-pointer"
            title="Carlos Rossi (Coach)"
          >
            <img
              src={ASSETS.carlosAvatar}
              alt="Carlos Trainer"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#006b2c]/30"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#006b2c] ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
