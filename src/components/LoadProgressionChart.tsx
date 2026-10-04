import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface LoadDataPoint {
  mes: string;
  dataCompleta: string;
  agachamento: number;
  stiff: number;
  legPress: number;
  elevacaoPelvica: number;
  volumeTotal: number;
}

const DEFAULT_LOAD_DATA: LoadDataPoint[] = [
  { mes: 'Jul', dataCompleta: '15/07/2026', agachamento: 32, stiff: 16, legPress: 90, elevacaoPelvica: 50, volumeTotal: 8400 },
  { mes: 'Ago', dataCompleta: '15/08/2026', agachamento: 38, stiff: 20, legPress: 110, elevacaoPelvica: 62, volumeTotal: 10200 },
  { mes: 'Set', dataCompleta: '15/09/2026', agachamento: 44, stiff: 24, legPress: 125, elevacaoPelvica: 72, volumeTotal: 12600 },
  { mes: 'Out (Atual)', dataCompleta: '18/10/2026', agachamento: 50, stiff: 28, legPress: 140, elevacaoPelvica: 80, volumeTotal: 14800 },
];

interface LoadProgressionChartProps {
  alunoNome?: string;
}

export const LoadProgressionChart: React.FC<LoadProgressionChartProps> = ({
  alunoNome = 'Mariana Silva',
}) => {
  const [data, setData] = useState<LoadDataPoint[]>(DEFAULT_LOAD_DATA);
  const [selectedExercise, setSelectedExercise] = useState<
    'todos' | 'agachamento' | 'stiff' | 'legPress' | 'elevacaoPelvica'
  >('todos');
  const [viewMetric, setViewMetric] = useState<'carga' | 'volume'>('carga');
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  // Form state to add new load record
  const [newMes, setNewMes] = useState('Nov');
  const [newAgachamento, setNewAgachamento] = useState('54');
  const [newStiff, setNewStiff] = useState('30');
  const [newLegPress, setNewLegPress] = useState('150');
  const [newElevacao, setNewElevacao] = useState('85');

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newPoint: LoadDataPoint = {
      mes: newMes,
      dataCompleta: `01/11/2026`,
      agachamento: parseFloat(newAgachamento) || 50,
      stiff: parseFloat(newStiff) || 28,
      legPress: parseFloat(newLegPress) || 140,
      elevacaoPelvica: parseFloat(newElevacao) || 80,
      volumeTotal: 16200,
    };
    setData([...data, newPoint]);
    setIsAddRecordModalOpen(false);
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#141b2b] text-white p-3 rounded-2xl shadow-xl border border-white/10 text-xs space-y-1 z-30">
          <p className="font-bold text-[#7ffc97] border-b border-white/10 pb-1 flex items-center justify-between gap-3">
            <span>Sessão: {label}</span>
            <span className="text-[10px] text-white/70 font-normal">
              {payload[0]?.payload?.dataCompleta}
            </span>
          </p>
          <div className="pt-1 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-white/80">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span>{entry.name}:</span>
                </span>
                <span className="font-bold tabular-nums text-white">
                  {entry.value} {viewMetric === 'volume' ? 'kg total' : 'kg'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e9edff] flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#006b2c]">
              fitness_center
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6e7b6c]">
              Periodização & Sobrecarga
            </span>
          </div>
          <h3 className="text-base font-bold text-[#141b2b] mt-0.5">
            Evolução de Carga & Ganho de Força
          </h3>
          <p className="text-xs text-[#6e7b6c]">
            Progressão real nos exercícios fundamentais ({alunoNome})
          </p>
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-[#006b2c]/10 hover:bg-[#006b2c]/20 text-[#006b2c] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          title="Adicionar nova medição de carga"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span className="hidden sm:inline">Novo PR</span>
        </button>
      </div>

      {/* 3 Metric Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-[#f1f3ff] p-2 rounded-xl">
          <span className="text-[10px] text-[#6e7b6c] uppercase block font-semibold">Stiff (RDL)</span>
          <strong className="text-sm font-bold text-[#006b2c]">+75%</strong>
          <span className="text-[9px] text-[#6e7b6c] block">16kg → 28kg</span>
        </div>
        <div className="bg-[#f1f3ff] p-2 rounded-xl">
          <span className="text-[10px] text-[#6e7b6c] uppercase block font-semibold">Agachamento</span>
          <strong className="text-sm font-bold text-[#0058be]">+56%</strong>
          <span className="text-[9px] text-[#6e7b6c] block">32kg → 50kg</span>
        </div>
        <div className="bg-[#f1f3ff] p-2 rounded-xl">
          <span className="text-[10px] text-[#6e7b6c] uppercase block font-semibold">Leg Press</span>
          <strong className="text-sm font-bold text-[#825100]">+55%</strong>
          <span className="text-[9px] text-[#6e7b6c] block">90kg → 140kg</span>
        </div>
      </div>

      {/* Filter Chips & View Mode Toggle */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pt-1">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedExercise('todos')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedExercise === 'todos'
                ? 'bg-[#141b2b] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#3e4a3d] hover:bg-[#e9edff]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedExercise('stiff')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedExercise === 'stiff'
                ? 'bg-[#006b2c] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#3e4a3d] hover:bg-[#e9edff]'
            }`}
          >
            Stiff
          </button>
          <button
            onClick={() => setSelectedExercise('agachamento')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedExercise === 'agachamento'
                ? 'bg-[#0058be] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#3e4a3d] hover:bg-[#e9edff]'
            }`}
          >
            Agachamento
          </button>
          <button
            onClick={() => setSelectedExercise('elevacaoPelvica')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedExercise === 'elevacaoPelvica'
                ? 'bg-[#2170e4] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#3e4a3d] hover:bg-[#e9edff]'
            }`}
          >
            Pélvica
          </button>
          <button
            onClick={() => setSelectedExercise('legPress')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              selectedExercise === 'legPress'
                ? 'bg-[#825100] text-white shadow-xs'
                : 'bg-[#f1f3ff] text-[#3e4a3d] hover:bg-[#e9edff]'
            }`}
          >
            Leg Press
          </button>
        </div>

        <button
          onClick={() => setViewMetric(viewMetric === 'carga' ? 'volume' : 'carga')}
          className="px-2 py-1 rounded-lg bg-[#e9edff] hover:bg-[#dce2f7] text-[#006b2c] text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
          title="Alternar entre Cargas individuais (kg) e Volume total acumulado (kg)"
        >
          {viewMetric === 'carga' ? 'Ver Volume Total' : 'Ver Cargas (kg)'}
        </button>
      </div>

      {/* Recharts Interactive Chart */}
      <div className="w-full h-56 relative pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMetric === 'volume' ? (
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006b2c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#006b2c" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9edff" vertical={false} />
              <XAxis dataKey="mes" stroke="#6e7b6c" fontSize={11} tickLine={false} />
              <YAxis stroke="#6e7b6c" fontSize={11} tickLine={false} unit="k" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="volumeTotal"
                name="Volume Total (kg)"
                stroke="#006b2c"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
              <Line
                type="monotone"
                dataKey="volumeTotal"
                stroke="#006b2c"
                strokeWidth={3}
                dot={{ r: 4, fill: '#006b2c', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#7ffc97', stroke: '#006b2c', strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : (
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9edff" vertical={false} />
              <XAxis dataKey="mes" stroke="#6e7b6c" fontSize={11} tickLine={false} />
              <YAxis stroke="#6e7b6c" fontSize={11} tickLine={false} unit="kg" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={28}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              />

              {(selectedExercise === 'todos' || selectedExercise === 'stiff') && (
                <Line
                  type="monotone"
                  dataKey="stiff"
                  name="Stiff (kg/lado)"
                  stroke="#006b2c"
                  strokeWidth={selectedExercise === 'stiff' ? 3.5 : 2.5}
                  dot={{ r: 4, fill: '#006b2c', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#7ffc97', stroke: '#006b2c', strokeWidth: 2 }}
                />
              )}

              {(selectedExercise === 'todos' || selectedExercise === 'agachamento') && (
                <Line
                  type="monotone"
                  dataKey="agachamento"
                  name="Agachamento (kg)"
                  stroke="#0058be"
                  strokeWidth={selectedExercise === 'agachamento' ? 3.5 : 2}
                  dot={{ r: 4, fill: '#0058be', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#adc6ff', stroke: '#0058be', strokeWidth: 2 }}
                />
              )}

              {(selectedExercise === 'todos' || selectedExercise === 'elevacaoPelvica') && (
                <Line
                  type="monotone"
                  dataKey="elevacaoPelvica"
                  name="El. Pélvica (kg)"
                  stroke="#2170e4"
                  strokeWidth={selectedExercise === 'elevacaoPelvica' ? 3.5 : 2}
                  dot={{ r: 4, fill: '#2170e4', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#adc6ff', stroke: '#2170e4', strokeWidth: 2 }}
                />
              )}

              {(selectedExercise === 'todos' || selectedExercise === 'legPress') && (
                <Line
                  type="monotone"
                  dataKey="legPress"
                  name="Leg Press 45º (kg)"
                  stroke="#825100"
                  strokeWidth={selectedExercise === 'legPress' ? 3.5 : 2}
                  dot={{ r: 4, fill: '#825100', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#ffddb8', stroke: '#825100', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer insight */}
      <div className="bg-[#f1f3ff] rounded-xl p-2.5 flex items-center justify-between text-[11px] text-[#3e4a3d]">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-[#006b2c]">
            trending_up
          </span>
          <span>
            Sobrecarga progressiva constante: <strong className="text-[#006b2c]">+34% de força global</strong> nos últimos 90 dias.
          </span>
        </div>
      </div>

      {/* Modal Add Load PR */}
      {isAddRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">fitness_center</span>
                </div>
                <h3 className="text-base font-bold text-[#141b2b]">Registrar Nova Carga (PR)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRecordModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Mês / Ciclo</label>
                <input
                  type="text"
                  required
                  value={newMes}
                  onChange={(e) => setNewMes(e.target.value)}
                  placeholder="Ex: Nov"
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Stiff (kg/lado)</label>
                  <input
                    type="number"
                    value={newStiff}
                    onChange={(e) => setNewStiff(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#006b2c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Agachamento (kg)</label>
                  <input
                    type="number"
                    value={newAgachamento}
                    onChange={(e) => setNewAgachamento(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#0058be] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Elevação Pélvica (kg)</label>
                  <input
                    type="number"
                    value={newElevacao}
                    onChange={(e) => setNewElevacao(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#2170e4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Leg Press 45º (kg)</label>
                  <input
                    type="number"
                    value={newLegPress}
                    onChange={(e) => setNewLegPress(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#825100] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f1f3ff] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#006b2c] text-white font-bold text-xs hover:bg-[#00873a] cursor-pointer"
                >
                  Adicionar ao Gráfico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
