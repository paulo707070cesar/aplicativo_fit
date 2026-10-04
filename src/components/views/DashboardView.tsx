import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenQuickPix: (alunoNome: string, valor: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenQuickPix,
}) => {
  const [period, setPeriod] = useState('Outubro 2026');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [copiedAlert, setCopiedAlert] = useState(false);

  const periods = ['Hoje', 'Esta Semana', 'Outubro 2026', 'Últimos 90 dias'];

  return (
    <div className="flex flex-col w-full pb-8 space-y-4">
      {/* Top Greeting & Period Switcher */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-[#141b2b] tracking-tight flex items-center gap-1.5">
              Bom dia, Carlos <span className="inline-block transition-transform hover:rotate-12 cursor-default select-none">👋</span>
            </h2>
            <p className="text-sm text-[#3e4a3d] truncate">
              Aqui está o resumo do seu negócio hoje.
            </p>
          </div>

          {/* Period Selector Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="h-9 px-3 rounded-xl bg-[#e9edff] hover:bg-[#dce2f7] transition-colors flex items-center gap-1.5 text-[#141b2b] shadow-xs text-xs font-semibold cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006b2c]">calendar_today</span>
              <span>{period}</span>
              <span className={`material-symbols-outlined text-[16px] text-[#6e7b6c] transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {showPeriodDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-[#e9edff] p-1 z-30 flex flex-col gap-0.5 animate-in fade-in-50">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPeriod(p);
                      setShowPeriodDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      period === p
                        ? 'bg-[#e9edff] text-[#006b2c] font-bold'
                        : 'text-[#141b2b] hover:bg-[#f1f3ff]'
                    }`}
                  >
                    <span>{p}</span>
                    {period === p && (
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onNavigate('clientes')}
            className="h-10 px-3.5 rounded-xl bg-[#006b2c] text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 font-semibold text-xs cursor-pointer hover:bg-[#00873a]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Novo Aluno</span>
          </button>

          <button
            onClick={() => onNavigate('novo-treino')}
            className="h-10 px-3.5 rounded-xl bg-[#e9edff] hover:bg-[#dce2f7] text-[#141b2b] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 font-medium text-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006b2c]">fitness_center</span>
            <span>Criar Treino</span>
          </button>

          <button
            onClick={() => onNavigate('ai-hub')}
            className="h-10 px-3.5 rounded-xl bg-[#006b2c]/10 hover:bg-[#006b2c]/20 text-[#006b2c] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 font-bold text-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] animate-pulse">psychology</span>
            <span>Assistente IA</span>
          </button>

          <button
            onClick={() => onNavigate('financeiro')}
            className="h-10 px-3.5 rounded-xl bg-[#e9edff] hover:bg-[#dce2f7] text-[#141b2b] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 font-medium text-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#825100]">payments</span>
            <span>Registrar Pgto</span>
          </button>
        </div>
      </section>

      {/* Metric KPI Cards (2x2) */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c]">Indicadores Chave</span>
          <span className="text-[11px] text-[#006b2c] font-bold">Atualizado agora</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Clientes Ativos */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#f1f3ff] flex items-center justify-center text-[#006b2c]">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                +12%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-wider text-[#6e7b6c] font-semibold">Clientes Ativos</p>
              <p className="text-2xl font-bold text-[#141b2b] tabular-nums tracking-tight mt-0.5">48</p>
              <p className="text-[11px] text-[#3e4a3d] mt-0.5">+5 novos este mês</p>
            </div>
          </div>

          {/* Receita Mensal */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#f1f3ff] flex items-center justify-center text-[#0058be]">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                +18%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-wider text-[#6e7b6c] font-semibold">Receita Mensal</p>
              <p className="text-2xl font-bold text-[#141b2b] tabular-nums tracking-tight mt-0.5">
                <span className="text-xs text-[#6e7b6c] font-normal mr-0.5">R$</span> 14.850
              </p>
              <p className="text-[11px] text-[#3e4a3d] mt-0.5">Meta: R$ 15k</p>
            </div>
          </div>

          {/* Treinos Pendentes */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#ffddb8] flex items-center justify-center text-[#825100]">
                <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px]">warning</span>
                Revisão
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-wider text-[#6e7b6c] font-semibold">Pendentes</p>
              <p className="text-2xl font-bold text-[#141b2b] tabular-nums tracking-tight mt-0.5">8</p>
              <p className="text-[11px] text-[#825100] font-medium mt-0.5">3 expiram em 48h</p>
            </div>
          </div>

          {/* Retenção */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#f1f3ff] flex items-center justify-center text-[#006b2c]">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e9edff] text-[#3e4a3d] text-[10px] font-bold">
                LTV 8.4m
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-wider text-[#6e7b6c] font-semibold">Taxa Retenção</p>
              <p className="text-2xl font-bold text-[#141b2b] tabular-nums tracking-tight mt-0.5">94.2%</p>
              <p className="text-[11px] text-[#006b2c] font-bold mt-0.5">Alto padrão</p>
            </div>
          </div>
        </div>
      </section>

      {/* Evolução de Faturamento (6 Meses SVG Area Chart) */}
      <section className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">Evolução de Faturamento</span>
            <h3 className="text-lg font-bold text-[#141b2b] mt-0.5">Últimos 6 Meses</h3>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 bg-[#e9edff] px-2.5 py-1 rounded-full text-[#006b2c] font-bold text-xs tabular-nums">
              <span className="w-2 h-2 rounded-full bg-[#006b2c] animate-pulse"></span>
              Pico: R$ 14.850
            </div>
          </div>
        </div>

        {/* SVG Sparkline Area Chart */}
        <div className="relative w-full h-36 pt-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 120">
            <defs>
              <linearGradient id="revGradDash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#006b2c" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#006b2c" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Guide lines */}
            <line x1="0" y1="20" x2="320" y2="20" stroke="#e9edff" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="60" x2="320" y2="60" stroke="#e9edff" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="100" x2="320" y2="100" stroke="#e9edff" strokeDasharray="3 3" strokeWidth="1" />

            {/* Gradient polygon */}
            <polygon
              fill="url(#revGradDash)"
              points="10,105 10,95 70,82 130,70 190,45 250,38 310,18 310,115 10,115"
            />

            {/* Smooth line */}
            <polyline
              fill="none"
              stroke="#006b2c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="10,95 70,82 130,70 190,45 250,38 310,18"
            />

            {/* Nodes */}
            <circle cx="10" cy="95" r="2.5" fill="#006b2c" />
            <circle cx="70" cy="82" r="2.5" fill="#006b2c" />
            <circle cx="130" cy="70" r="2.5" fill="#006b2c" />
            <circle cx="190" cy="45" r="2.5" fill="#006b2c" />
            <circle cx="250" cy="38" r="2.5" fill="#006b2c" />
            <circle cx="310" cy="18" r="4.5" fill="#006b2c" stroke="#ffffff" strokeWidth="2" />
            <circle cx="310" cy="18" r="8" fill="none" stroke="#62df7d" strokeWidth="1.5" opacity="0.8" />
          </svg>

          {/* Month labels */}
          <div className="flex justify-between items-center text-[#6e7b6c] text-[11px] font-medium mt-1 px-1">
            <span>Mai</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Ago</span>
            <span>Set</span>
            <span className="text-[#006b2c] font-bold">Out (Atual)</span>
          </div>
        </div>
      </section>

      {/* Precisam de Atenção */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
            <h3 className="text-base font-bold text-[#141b2b]">Precisam de Atenção</h3>
          </div>
          <span className="text-[11px] text-[#6e7b6c] font-semibold">3 pendências críticas</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Mariana Silva */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={ASSETS.marianaAvatar}
                  alt="Mariana Silva"
                  className="w-11 h-11 rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-bold text-[9px] shadow-xs">
                  !
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#141b2b] truncate">Mariana Silva</h4>
                <p className="text-xs text-[#3e4a3d] truncate">Sem treino há 5 dias</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                  Risco de evasão
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('perfil-aluno')}
              className="shrink-0 h-9 px-3 rounded-xl bg-[#e9edff] hover:bg-[#dce2f7] text-[#141b2b] text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            >
              Ver aluna
            </button>
          </div>

          {/* Rafael Costa */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={ASSETS.rafaelAvatar}
                  alt="Rafael Costa"
                  className="w-11 h-11 rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  $
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#141b2b] truncate">Rafael Costa</h4>
                <p className="text-xs text-[#3e4a3d] truncate">Mensalidade venceu ontem</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                  Vencido (R$ 320)
                </span>
              </div>
            </div>
            <button
              onClick={() => onOpenQuickPix('Rafael Costa', 320)}
              className="shrink-0 h-9 px-3.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold active:scale-95 transition-all flex items-center gap-1 shadow-xs cursor-pointer hover:opacity-95"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              Cobrar
            </button>
          </div>

          {/* Lucas Oliveira */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={ASSETS.lucasOliveiraAvatar}
                  alt="Lucas Oliveira"
                  className="w-11 h-11 rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#006b2c] text-white flex items-center justify-center text-[10px] shadow-xs">
                  ✓
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#141b2b] truncate">Lucas Oliveira</h4>
                <p className="text-xs text-[#3e4a3d] truncate">Completou 100% do bloco A</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">
                  Revisar ficha
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('novo-treino')}
              className="shrink-0 h-9 px-3 rounded-xl bg-[#00873a] text-white text-xs font-bold active:scale-95 transition-all flex items-center gap-1 shadow-xs cursor-pointer hover:opacity-95"
            >
              <span className="material-symbols-outlined text-[15px]">edit_calendar</span>
              Novo Bloco
            </button>
          </div>
        </div>
      </section>

      {/* Agenda de Hoje */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006b2c] text-[20px]">event</span>
            <h3 className="text-base font-bold text-[#141b2b]">Agenda de Hoje</h3>
          </div>
          <span className="text-[11px] text-[#006b2c] font-bold">3 sessões marcadas</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col gap-3">
          {/* Mariana Silva */}
          <div className="flex gap-2.5 items-start">
            <div className="flex flex-col items-center shrink-0 w-14">
              <span className="text-xs font-bold text-[#006b2c] tabular-nums">08:00</span>
              <span className="text-[10px] text-[#6e7b6c]">50 min</span>
              <div className="w-0.5 h-10 bg-[#e9edff] mt-1.5"></div>
            </div>
            <div className="flex-1 bg-[#f1f3ff] p-3 rounded-xl min-w-0 hover:bg-[#e9edff] transition-colors">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[11px]">fitness_center</span>
                  Presencial
                </span>
                <span className="text-[10px] text-[#6e7b6c] font-semibold">Em 25 min</span>
              </div>
              <h4 className="text-sm font-bold text-[#141b2b] mt-1 truncate">Mariana Silva</h4>
              <p className="text-xs text-[#3e4a3d] flex items-center gap-1 mt-0.5 truncate">
                <span className="material-symbols-outlined text-[14px] text-[#6e7b6c]">location_on</span>
                Academia Smart (Unidade Jardins)
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('live-treino')}
                  className="text-xs font-bold text-[#006b2c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">play_circle</span>
                  Abrir Treino ao Vivo
                </button>
              </div>
            </div>
          </div>

          {/* João Pedro */}
          <div className="flex gap-2.5 items-start">
            <div className="flex flex-col items-center shrink-0 w-14">
              <span className="text-xs font-bold text-[#141b2b] tabular-nums">10:30</span>
              <span className="text-[10px] text-[#6e7b6c]">30 min</span>
              <div className="w-0.5 h-10 bg-[#e9edff] mt-1.5"></div>
            </div>
            <div className="flex-1 bg-[#f1f3ff] p-3 rounded-xl min-w-0 hover:bg-[#e9edff] transition-colors">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d8e2ff] text-[#001a42] text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[11px]">videocam</span>
                  Check-in Online
                </span>
                <button
                  onClick={() => alert('Link da chamada Google Meet / WhatsApp copiado!')}
                  className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#0058be] hover:text-[#141b2b] shadow-xs cursor-pointer"
                  title="Copiar link da reunião"
                >
                  <span className="material-symbols-outlined text-[14px]">link</span>
                </button>
              </div>
              <h4 className="text-sm font-bold text-[#141b2b] mt-1 truncate">João Pedro</h4>
              <p className="text-xs text-[#3e4a3d] flex items-center gap-1 mt-0.5 truncate">
                <span className="material-symbols-outlined text-[14px] text-[#6e7b6c]">video_chat</span>
                Alinhamento de dieta e volume semanal
              </p>
            </div>
          </div>

          {/* Ana Carolina */}
          <div className="flex gap-2.5 items-start">
            <div className="flex flex-col items-center shrink-0 w-14">
              <span className="text-xs font-bold text-[#141b2b] tabular-nums">15:00</span>
              <span className="text-[10px] text-[#6e7b6c]">45 min</span>
            </div>
            <div className="flex-1 bg-[#f1f3ff] p-3 rounded-xl min-w-0 hover:bg-[#e9edff] transition-colors">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[11px]">straighten</span>
                  Bioimpedância
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#141b2b] mt-1 truncate">Ana Carolina</h4>
              <p className="text-xs text-[#3e4a3d] flex items-center gap-1 mt-0.5 truncate">
                <span className="material-symbols-outlined text-[14px] text-[#6e7b6c]">domain</span>
                Estúdio FitPulse (Consultório 2)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
