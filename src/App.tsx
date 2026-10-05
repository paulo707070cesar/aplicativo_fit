/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Aluno } from './types';
import { INITIAL_ALUNOS } from './data/mockData';
import { DashboardView } from './components/views/DashboardView';
import { FinanceView } from './components/views/FinanceView';
import { ClientsView } from './components/views/ClientsView';
import { ClientProfileView } from './components/views/ClientProfileView';
import { WorkoutBuilderView } from './components/views/WorkoutBuilderView';
import { LiveWorkoutView } from './components/views/LiveWorkoutView';
import { WorkoutFinishedView } from './components/views/WorkoutFinishedView';
import { HostingerExportModal } from './components/views/HostingerExportModal';
import { ImageLinksModal } from './components/views/ImageLinksModal';
import { AiCoachModal } from './components/views/AiCoachModal';
import { AiHubView } from './components/views/AiHubView';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/views/LoginView';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUserRole, setCurrentUserRole] = useState<'coach' | 'aluno'>('coach');
  const [currentUserName, setCurrentUserName] = useState<string>('Carlos Rossi');

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [alunos, setAlunos] = useState<Aluno[]>(INITIAL_ALUNOS);
  const [selectedAluno, setSelectedAluno] = useState<Aluno>(INITIAL_ALUNOS[0]);
  const [quickPixTarget, setQuickPixTarget] = useState<{ nome: string; valor: number } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modals
  const [isHostingerModalOpen, setIsHostingerModalOpen] = useState(false);
  const [isImageLinksModalOpen, setIsImageLinksModalOpen] = useState(false);
  const [isAiCoachModalOpen, setIsAiCoachModalOpen] = useState(false);

  if (window.location.pathname.replaceAll('/', '') === 'landing') return <LandingPage />;

  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={(role, name) => {
          setCurrentUserRole(role);
          setCurrentUserName(name);
          setIsAuthenticated(true);
          if (role === 'aluno') {
            setCurrentView('perfil-aluno');
          } else {
            setCurrentView('dashboard');
          }
        }}
      />
    );
  }

  const handleNavigate = (view: string) => {
    if (currentUserRole === 'aluno') {
      if (['financeiro', 'clientes', 'novo-treino', 'ai-hub', 'config-ia'].includes(view)) {
        setCurrentView('perfil-aluno');
      } else {
        setCurrentView(view);
      }
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuickPix = (alunoNome: string, valor: number) => {
    setQuickPixTarget({ nome: alunoNome, valor });
    setCurrentView('financeiro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateAluno = (updated: Aluno) => {
    setSelectedAluno(updated);
    setAlunos((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b] flex font-sans selection:bg-[#7ffc97] selection:text-[#002109]">
      {/* Mobile Floating Menu Button (Header and Footer removed) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-3 left-3 z-40 md:hidden w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-[#e9edff] flex items-center justify-center text-[#141b2b] hover:bg-white active:scale-95 transition-all cursor-pointer"
        title="Abrir Menu Lateral"
        aria-label="Abrir Menu Lateral"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>

      {/* Collapsible Sidebar with ALL navigation links */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAiModal={() => setIsAiCoachModalOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
        userRole={currentUserRole}
      />

      {/* Main Content Area (dynamically adapts width when sidebar is collapsed or expanded) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'
        }`}
      >
        <main className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-6 pt-16 md:pt-6 pb-12">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onOpenQuickPix={handleOpenQuickPix}
            />
          )}

          {currentView === 'financeiro' && (
            <FinanceView
              quickAluno={quickPixTarget?.nome}
              quickValor={quickPixTarget?.valor}
            />
          )}

          {currentView === 'clientes' && (
            <ClientsView
              onSelectAluno={(aluno) => {
                setSelectedAluno(aluno);
              }}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'perfil-aluno' && (
            <ClientProfileView
              aluno={selectedAluno}
              onNavigate={handleNavigate}
              onUpdateAluno={handleUpdateAluno}
            />
          )}

          {currentView === 'novo-treino' && (
            <WorkoutBuilderView onNavigate={handleNavigate} />
          )}

          {currentView === 'live-treino' && (
            <LiveWorkoutView onNavigate={handleNavigate} />
          )}

          {currentView === 'treino-concluido' && (
            <WorkoutFinishedView onNavigate={handleNavigate} />
          )}

          {(currentView === 'ai-hub' || currentView === 'assistente-ia' || currentView === 'config-ia') && (
            <AiHubView
              initialTab={currentView === 'config-ia' ? 'config' : 'assistente'}
              targetAlunoNome={selectedAluno?.nome}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      {/* Hostinger Exporter Modal */}
      <HostingerExportModal
        isOpen={isHostingerModalOpen}
        onClose={() => setIsHostingerModalOpen(false)}
      />

      {/* Direct Image Links Modal */}
      <ImageLinksModal
        isOpen={isImageLinksModalOpen}
        onClose={() => setIsImageLinksModalOpen(false)}
      />

      {/* FitPulse AI Coach Modal (Thinking Mode) */}
      <AiCoachModal
        isOpen={isAiCoachModalOpen}
        onClose={() => setIsAiCoachModalOpen(false)}
      />
    </div>
  );
}
