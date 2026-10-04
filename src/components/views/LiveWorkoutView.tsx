import React, { useState, useEffect } from 'react';
import { ASSETS } from '../../data/mockData';

interface LiveWorkoutViewProps {
  onNavigate: (view: string) => void;
}

export const LiveWorkoutView: React.FC<LiveWorkoutViewProps> = ({ onNavigate }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(48);
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(28);
  const [isSet3Completed, setIsSet3Completed] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const totalRest = 90;
  const circumference = 188.4;
  const strokeOffset = circumference - (secondsRemaining / totalRest) * circumference;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining]);

  const handleAdjustTimer = (delta: number) => {
    setSecondsRemaining((prev) => Math.max(0, Math.min(totalRest, prev + delta)));
  };

  const handleSkipTimer = () => {
    setSecondsRemaining(0);
  };

  const handleCompleteSet = () => {
    setIsSet3Completed(true);
    setShowToast('Série #3 Concluída! PR de carga mantido com sucesso.');
    setTimeout(() => setShowToast(null), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006b2c] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{showToast}</span>
        </div>
      )}

      {/* Workout Status Overview Banner */}
      <div className="flex flex-col gap-2.5 bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7ffc97]/40 text-[#006b2c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c] animate-pulse mr-1"></span>
              Sessão Ativa
            </span>
            <span className="text-xs text-[#6e7b6c] font-semibold">Mariana Silva</span>
          </div>
          <span className="text-xs font-bold text-[#006b2c]">35% concluído</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#141b2b]">
          <span className="font-semibold">2 de 6 exercícios concluídos</span>
          <span className="text-[#6e7b6c] tabular-nums">24 min decorridos</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#e9edff] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#006b2c] rounded-full transition-all duration-500"
            style={{ width: isSet3Completed ? '50%' : '35%' }}
          ></div>
        </div>

        {/* Coach Note Pill Box */}
        <div className="flex items-start gap-2 p-2.5 bg-[#f1f3ff] rounded-xl mt-0.5">
          <span className="material-symbols-outlined text-[#006b2c] text-[18px] shrink-0 mt-0.5">
            tips_and_updates
          </span>
          <p className="text-xs text-[#141b2b] leading-tight">
            <strong className="font-bold text-[#006b2c]">Orientação do Carlos:</strong> Foco na
            cadência e contração máxima no pico do movimento posterior.
          </p>
        </div>
      </div>

      {/* Active Exercise Hero Section */}
      <div className="flex flex-col bg-white rounded-2xl shadow-xs border border-[#e9edff] overflow-hidden">
        {/* Image Media Container */}
        <div className="relative w-full aspect-[4/3] bg-[#e9edff] overflow-hidden">
          <img
            src={ASSETS.stiffHalteresImg}
            alt="Stiff com Halteres executado por Mariana Silva"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141b2b]/85 via-transparent to-transparent"></div>

          {/* Video Demonstration Badge */}
          <button
            type="button"
            onClick={() => alert('Reproduzindo vídeo: Instruções de alinhamento lombar e joelhos no Stiff')}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141b2b]/60 backdrop-blur-md text-white text-[11px] font-bold active:scale-95 transition-transform shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#7ffc97]">play_circle</span>
            <span>Demonstração em Vídeo</span>
          </button>

          {/* Exercise Index & Name Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
            <span className="text-[10px] text-[#7ffc97] font-bold uppercase tracking-wider">
              Exercício 3 de 6
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Stiff com Halteres / RDL</h2>
          </div>
        </div>

        {/* Target Muscle Chips */}
        <div className="flex flex-wrap items-center gap-1.5 p-3.5 bg-white">
          <span className="px-2.5 py-1 rounded-full bg-[#d8e2ff]/60 text-[#0058be] text-[10px] font-bold">
            Glúteo Máximo
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#d8e2ff]/60 text-[#0058be] text-[10px] font-bold">
            Posteriores de Coxa
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#e9edff] text-[#3e4a3d] text-[10px] font-bold">
            Lombar
          </span>
        </div>
      </div>

      {/* Active Rest Timer Component */}
      <div className="flex flex-col p-4 bg-white rounded-2xl shadow-xs border border-[#e9edff]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006b2c] text-[20px]">timelapse</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6e7b6c]">
              Descanso Ativo
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f1f3ff] text-[#141b2b] hover:bg-[#e9edff] transition-colors cursor-pointer"
            title="Alternar áudio do alarme"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4 my-1">
          {/* Circular Progress Indicator */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
              <circle
                className="text-[#e9edff]"
                cx="36"
                cy="36"
                fill="transparent"
                r="30"
                stroke="currentColor"
                strokeWidth="5"
              ></circle>
              <circle
                className="text-[#006b2c] transition-all duration-1000 ease-linear"
                cx="36"
                cy="36"
                fill="transparent"
                r="30"
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="5"
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-[#141b2b] tabular-nums">
                {secondsRemaining}s
              </span>
            </div>
          </div>

          {/* Timer Context */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-[#141b2b]">
                00:{String(secondsRemaining).padStart(2, '0')}
              </span>
              <span className="text-xs text-[#6e7b6c]">/ 01:30 sugerido</span>
            </div>
            <p className="text-xs text-[#3e4a3d] line-clamp-2">
              Respire fundo e recupere o fôlego para a próxima série de carga máxima!
            </p>
          </div>
        </div>

        {/* Quick Timer Adjustment Buttons */}
        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-[#f1f3ff]">
          <button
            type="button"
            onClick={() => handleAdjustTimer(15)}
            className="flex-1 h-9 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            +15s
          </button>
          <button
            type="button"
            onClick={() => handleAdjustTimer(30)}
            className="flex-1 h-9 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            +30s
          </button>
          <button
            type="button"
            onClick={handleSkipTimer}
            className="flex-[1.4] h-9 px-3 rounded-xl bg-[#e9edff] hover:bg-[#dce2f7] text-[#006b2c] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>Pular</span>
            <span className="material-symbols-outlined text-[16px]">fast_forward</span>
          </button>
        </div>
      </div>

      {/* Interactive Sets Block */}
      <div className="flex flex-col bg-white rounded-2xl shadow-xs border border-[#e9edff] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#141b2b]">Séries do Exercício</h3>
          <span className="text-[10px] font-bold text-[#6e7b6c] uppercase">Total: 4 séries</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Set 1: Done */}
          <div className="flex items-center justify-between p-2.5 bg-[#f1f3ff] rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#7ffc97]/50 text-[#006b2c] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#141b2b]">Série 1</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#d8e2ff] text-[#001a42]">
                    Aquecimento
                  </span>
                </div>
                <span className="text-xs text-[#6e7b6c]">15 repetições • 16 kg</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7ffc97]/50 text-[#006b2c]">
              Concluída
            </span>
          </div>

          {/* Set 2: Done */}
          <div className="flex items-center justify-between p-2.5 bg-[#f1f3ff] rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#7ffc97]/50 text-[#006b2c] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#141b2b]">Série 2</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#e9edff] text-[#3e4a3d]">
                    Trabalho
                  </span>
                </div>
                <span className="text-xs text-[#6e7b6c]">12 repetições • 24 kg</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7ffc97]/50 text-[#006b2c]">
              Concluída
            </span>
          </div>

          {/* Set 3: ACTIVE & INTERACTIVE */}
          <div className="flex flex-col p-3.5 bg-white rounded-2xl shadow-md border-2 border-[#006b2c]/30 gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#006b2c] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#141b2b]">Série 3 (Atual)</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#7ffc97]/40 text-[#006b2c]">
                    Carga Máxima
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#006b2c] animate-pulse">
                {isSet3Completed ? 'REGISTRADA' : 'EM ANDAMENTO'}
              </span>
            </div>

            {/* Steppers */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Reps */}
              <div className="flex flex-col bg-[#f1f3ff] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-[#6e7b6c] uppercase mb-1">Repetições</span>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setReps((r) => Math.max(1, r - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] active:scale-95 cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-[#141b2b] tabular-nums">{reps}</span>
                  <button
                    type="button"
                    onClick={() => setReps((r) => r + 1)}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] active:scale-95 cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Weight */}
              <div className="flex flex-col bg-[#f1f3ff] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-[#6e7b6c] uppercase mb-1">Carga Total</span>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWeight((w) => Math.max(0, w - 2))}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] active:scale-95 cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-[#141b2b] tabular-nums">{weight}</span>
                    <span className="text-xs text-[#6e7b6c] ml-0.5">kg</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWeight((w) => w + 2)}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#141b2b] active:scale-95 cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Complete Set CTA */}
            <button
              type="button"
              onClick={handleCompleteSet}
              className={`w-full h-11 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer ${
                isSet3Completed ? 'bg-[#00873a]' : 'bg-[#006b2c] hover:bg-[#00873a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSet3Completed ? 'check' : 'check_circle'}
              </span>
              <span>{isSet3Completed ? 'Série #3 Registrada!' : 'Concluir Série #3'}</span>
            </button>
          </div>

          {/* Set 4: Pending */}
          <div className="flex items-center justify-between p-2.5 bg-[#f1f3ff]/60 rounded-xl opacity-60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#e9edff] text-[#6e7b6c] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#6e7b6c]">Série 4</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#e9edff] text-[#6e7b6c]">
                    Falha / Drop-set
                  </span>
                </div>
                <span className="text-xs text-[#6e7b6c]">8 repetições • 30 kg</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#6e7b6c]">Pendente</span>
          </div>
        </div>
      </div>

      {/* Next Exercise Preview Card */}
      <div className="flex flex-col bg-white rounded-2xl shadow-xs border border-[#e9edff] p-4">
        <span className="text-[10px] font-bold text-[#6e7b6c] uppercase mb-1">A seguir</span>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#e9edff] shrink-0 overflow-hidden flex items-center justify-center text-[#006b2c]">
            <span className="material-symbols-outlined text-[24px]">fitness_center</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#141b2b] truncate">#4 Elevação Pélvica com Barra</h4>
            <div className="flex items-center gap-2 text-xs text-[#6e7b6c] mt-0.5">
              <span>4 séries</span>
              <span>•</span>
              <span>80 kg</span>
              <span>•</span>
              <span className="text-[#006b2c] font-semibold">90s descanso</span>
            </div>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#6e7b6c]"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Bottom Workspace Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={() => onNavigate('treino-concluido')}
          className="w-full h-12 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">flag</span>
          <span>Finalizar Sessão de Treino</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="h-10 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Pausar Treino' : 'Retomar Treino'}</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Selecione exercício substituto compatível biomecanicamente.')}
            className="h-10 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
            <span>Substituir Exercício</span>
          </button>
        </div>
      </div>
    </div>
  );
};
