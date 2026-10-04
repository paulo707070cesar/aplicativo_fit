import React, { useState } from 'react';
import { Aluno } from '../../types';
import { INITIAL_ALUNOS } from '../../data/mockData';

interface ClientsViewProps {
  onSelectAluno: (aluno: Aluno) => void;
  onNavigate: (view: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ onSelectAluno, onNavigate }) => {
  const [alunos, setAlunos] = useState<Aluno[]>(INITIAL_ALUNOS);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'inactive' | 'trial'>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student state
  const [novoNome, setNovoNome] = useState('');
  const [novoWhatsapp, setNovoWhatsapp] = useState('');
  const [novoPlano, setNovoPlano] = useState('Premium Mensal');
  const [novoObjetivo, setNovoObjetivo] = useState('Hipertrofia');
  const [novoValor, setNovoValor] = useState('350');

  const filteredAlunos = alunos.filter((aluno) => {
    const matchesFilter = filter === 'all' || aluno.status === filter;
    const matchesSearch =
      search === '' ||
      aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
      aluno.objetivo.toLowerCase().includes(search.toLowerCase()) ||
      aluno.plano.toLowerCase().includes(search.toLowerCase()) ||
      (aluno.whatsapp && aluno.whatsapp.includes(search));
    return matchesFilter && matchesSearch;
  });

  const handleAddAluno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome) return;

    const novo: Aluno = {
      id: `aluno-${Date.now()}`,
      nome: novoNome,
      whatsapp: novoWhatsapp.trim() || '(11) 99876-5432',
      foto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM0yp6BunHGlji0oemTjLAsK00Xg4FODQvNwrzmmcuNSLNAlWJmKgj2R6DtFLiVpFgNkNmiaJVck7W5Q9YYFAlhXImyhiezcC2oJCO-jAj9fyIC_NvhtGt1BbcXjQs5yqj5Asjnzch-B691NfOHDsht5I6981NaYtN9LMzHtdmalMM7UUkp5tj8YU34RKgwH8EF3j0ztqYwFnNY_Me7sjQAeTsa441BniAoN9qMnnxgBst-qo9pP4KbQ',
      status: 'active',
      plano: novoPlano,
      objetivo: novoObjetivo,
      ultimoTreino: 'Recém cadastrado',
      renovacao: '30 dias',
      emDia: true,
      mensalidade: parseFloat(novoValor) || 350,
      idade: 26,
      altura: '1.70m',
      peso: 70,
      adesao: 100,
      treinosRealizados: 0,
      treinosTotal: 12,
      volumeCargaKg: 0,
      imc: 24.2,
    };

    setAlunos([novo, ...alunos]);
    setShowAddModal(false);
    setNovoNome('');
    setNovoWhatsapp('');
  };

  const handleCobrarWhatsApp = (aluno: Aluno) => {
    const raw = aluno.whatsapp || '11999999999';
    const phone = raw.replace(/\D/g, '');
    const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`;
    const text = encodeURIComponent(
      `Olá ${aluno.nome}! Tudo bem? Aqui é o Carlos Rossi da FitPulse Pro.\n\n` +
      `Segue a cobrança da sua mensalidade (${aluno.plano}) no valor de R$ ${aluno.mensalidade.toFixed(2).replace('.', ',')}.\n` +
      `Chave Pix: coach.carlos@fitpulse.com.br\n\n` +
      `Favor enviar o comprovante por aqui assim que efetuar o pagamento. Bons treinos!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleReactivate = (id: string) => {
    setAlunos(
      alunos.map((a) => (a.id === id ? { ...a, status: 'active', emDia: true } : a))
    );
    alert('Plano do aluno reativado com sucesso!');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Nome,Status,Plano,Objetivo,Mensalidade,UltimoTreino\n' +
      alunos
        .map(
          (a) =>
            `"${a.nome}","${a.status}","${a.plano}","${a.objetivo}","R$ ${a.mensalidade}","${a.ultimoTreino}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'fitpulse_alunos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full pb-12 space-y-3">
      {/* Top Action Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-baseline gap-1.5">
          <h2 className="text-xl font-bold text-[#141b2b]">Clientes</h2>
          <span className="text-xs font-semibold text-[#3e4a3d] bg-[#e9edff] px-2 py-0.5 rounded-full">
            ({alunos.length})
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Adicionar</span>
        </button>
      </div>

      {/* Search and Smart Filters */}
      <div className="flex flex-col space-y-2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e7b6c]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, objetivo ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white text-[#141b2b] placeholder:text-[#6e7b6c] text-xs font-medium rounded-xl shadow-xs border border-[#e9edff] focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20 transition-all"
          />
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6e7b6c] hover:text-[#141b2b] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {search ? 'close' : 'tune'}
            </span>
          </button>
        </div>

        {/* Scrollable Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-nowrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer ${
              filter === 'all'
                ? 'bg-[#006b2c] text-white'
                : 'bg-[#e9edff] text-[#3e4a3d] hover:bg-[#dce2f7]'
            }`}
          >
            Todos ({alunos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-95 cursor-pointer ${
              filter === 'active'
                ? 'bg-[#006b2c] text-white'
                : 'bg-[#e9edff] text-[#3e4a3d] hover:bg-[#dce2f7]'
            }`}
          >
            Ativos (4)
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-95 cursor-pointer ${
              filter === 'pending'
                ? 'bg-[#006b2c] text-white'
                : 'bg-[#e9edff] text-[#3e4a3d] hover:bg-[#dce2f7]'
            }`}
          >
            Pendentes (1)
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-95 cursor-pointer ${
              filter === 'inactive'
                ? 'bg-[#006b2c] text-white'
                : 'bg-[#e9edff] text-[#3e4a3d] hover:bg-[#dce2f7]'
            }`}
          >
            Inativos (1)
          </button>
          <button
            onClick={() => alert('Filtro Trial: Nenhum aluno em período gratuito no momento.')}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#e9edff] text-[#3e4a3d] hover:bg-[#dce2f7] transition-transform active:scale-95 cursor-pointer"
          >
            Trial
          </button>
        </div>
      </div>

      {/* Client Cards List */}
      <div className="flex flex-col space-y-2.5">
        {filteredAlunos.map((aluno) => (
          <div
            key={aluno.id}
            className={`bg-white rounded-2xl p-4 shadow-xs border border-[#e9edff] flex flex-col gap-3 transition-all hover:shadow-md ${
              aluno.status === 'inactive' ? 'opacity-85' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={aluno.foto}
                    alt={aluno.nome}
                    className={`w-12 h-12 rounded-full object-cover ${
                      aluno.status === 'inactive' ? 'grayscale contrast-75' : ''
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                      aluno.status === 'active'
                        ? 'bg-[#006b2c]'
                        : aluno.status === 'pending'
                        ? 'bg-[#ff9800]'
                        : 'bg-[#9e9e9e]'
                    }`}
                  ></span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-[#141b2b] leading-snug">{aluno.nome}</h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-[#6e7b6c]">{aluno.plano}</span>
                    {aluno.whatsapp && (
                      <span className="text-[10px] text-[#006b2c] font-semibold flex items-center gap-0.5 bg-[#7ffc97]/25 px-1.5 py-0.2 rounded">
                        <span className="material-symbols-outlined text-[11px]">chat</span>
                        {aluno.whatsapp}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  aluno.status === 'active'
                    ? 'bg-[#7ffc97]/40 text-[#006b2c]'
                    : aluno.status === 'pending'
                    ? 'bg-[#ffddb8] text-[#825100]'
                    : 'bg-[#e9edff] text-[#6e7b6c]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    aluno.status === 'active'
                      ? 'bg-[#006b2c]'
                      : aluno.status === 'pending'
                      ? 'bg-[#825100]'
                      : 'bg-[#6e7b6c]'
                  }`}
                ></span>
                {aluno.status === 'active'
                  ? 'Ativo'
                  : aluno.status === 'pending'
                  ? 'Pendente'
                  : 'Inativo'}
              </span>
            </div>

            {/* Objetivo Banner */}
            <div className="bg-[#f1f3ff] rounded-xl p-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#006b2c]">
                {aluno.nome.includes('Mariana')
                  ? 'target'
                  : aluno.nome.includes('João')
                  ? 'fitness_center'
                  : aluno.nome.includes('Ana')
                  ? 'accessibility_new'
                  : 'sports_gymnastics'}
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#6e7b6c] font-semibold uppercase">Objetivo</span>
                <span className="text-xs font-semibold text-[#141b2b]">{aluno.objetivo}</span>
              </div>
            </div>

            {/* Special status warning for pending */}
            {aluno.status === 'pending' && aluno.nome.includes('Ana') && (
              <div className="bg-[#ffdad6]/60 rounded-xl p-2 flex items-center gap-2 text-[#93000a]">
                <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
                  assignment_late
                </span>
                <span className="text-xs font-semibold">Avaliação física pendente</span>
              </div>
            )}

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#3e4a3d]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#6e7b6c]">schedule</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-[#6e7b6c] leading-tight">Último treino</span>
                  <span className="text-xs truncate text-[#141b2b] font-medium">
                    {aluno.ultimoTreino}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#6e7b6c]">
                  event_repeat
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-[#6e7b6c] leading-tight">Renovação</span>
                  <span className="text-xs truncate text-[#141b2b] font-medium">
                    {aluno.renovacao}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Status Pill */}
            <div className="flex items-center justify-between pt-1 border-t border-[#f1f3ff]">
              {aluno.status === 'inactive' ? (
                <button
                  onClick={() => handleReactivate(aluno.id)}
                  className="text-[#006b2c] text-xs font-bold hover:underline cursor-pointer"
                >
                  Reativar Plano
                </button>
              ) : (
                <div className="flex items-center gap-1 text-[#006b2c] text-[11px] font-bold bg-[#7ffc97]/30 px-2 py-0.5 rounded-md">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Em dia (R$ {aluno.mensalidade}/mês)</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCobrarWhatsApp(aluno)}
                  title={`Cobrar mensalidade de R$ ${aluno.mensalidade} via WhatsApp (${aluno.whatsapp || 'sem número'})`}
                  aria-label="Cobrar via WhatsApp"
                  className="h-8 px-2.5 rounded-lg bg-[#006b2c]/10 hover:bg-[#006b2c]/20 text-[#006b2c] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Cobrar Pix</span>
                </button>

                <button
                  onClick={() => {
                    onSelectAluno(aluno);
                    onNavigate('perfil-aluno');
                  }}
                  className="bg-[#e9edff] hover:bg-[#dce2f7] text-[#141b2b] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Floating Bar */}
      <div className="sticky bottom-20 z-30 w-full mt-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#e9edff] p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Selecione uma planilha .CSV para importar alunos para o FitPulse.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] font-semibold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#6e7b6c]">file_upload</span>
              <span>Importar</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] font-semibold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#6e7b6c]">download</span>
              <span>Exportar</span>
            </button>
          </div>

          <button
            onClick={() => alert('Opções em massa: Enviar cobrança para todos os atrasados, Notificar check-in semanal, Exportar fichas.')}
            className="flex items-center gap-1 text-[#006b2c] font-bold text-xs hover:underline cursor-pointer"
          >
            <span>Ações em massa</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-[20px]">person_add</span>
                <h3 className="text-base font-bold text-[#141b2b]">Cadastrar Novo Aluno</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddAluno} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriela Duarte"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                  WhatsApp / Celular (para cobranças via Pix)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#006b2c] material-symbols-outlined text-[18px]">
                    chat
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={novoWhatsapp}
                    onChange={(e) => setNovoWhatsapp(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f1f3ff] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  />
                </div>
                <span className="text-[10px] text-[#6e7b6c] mt-0.5 block">
                  Usado para cobrança rápida Pix e mensagens automáticas
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Plano</label>
                  <select
                    value={novoPlano}
                    onChange={(e) => setNovoPlano(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-semibold focus:outline-none"
                  >
                    <option value="Premium Mensal">Premium Mensal</option>
                    <option value="Consultoria Online">Consultoria Online</option>
                    <option value="Personal Presencial">Personal Presencial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Valor Mensal (R$)</label>
                  <input
                    type="number"
                    value={novoValor}
                    onChange={(e) => setNovoValor(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Objetivo Principal</label>
                <input
                  type="text"
                  placeholder="Ex: Emagrecimento, Hipertrofia..."
                  value={novoObjetivo}
                  onChange={(e) => setNovoObjetivo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-sm focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f1f3ff] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#006b2c] text-white text-xs font-bold hover:bg-[#00873a] cursor-pointer"
                >
                  Salvar Aluno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
