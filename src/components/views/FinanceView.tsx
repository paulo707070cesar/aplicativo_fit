import React, { useState } from 'react';
import { CobrancaPix } from '../../types';
import { INITIAL_COBRANCAS, INITIAL_ALUNOS } from '../../data/mockData';

interface FinanceViewProps {
  quickAluno?: string;
  quickValor?: number;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ quickAluno, quickValor }) => {
  const [cobrancas, setCobrancas] = useState<CobrancaPix[]>(INITIAL_COBRANCAS);
  const [filter, setFilter] = useState<'todos' | 'pagos' | 'pendentes' | 'atrasados'>('todos');
  const [selectedStudent, setSelectedStudent] = useState(quickAluno || 'Rafael Costa');
  const [quickAmount, setQuickAmount] = useState(quickValor ? `${quickValor},00` : '320,00');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New charge modal fields
  const [newNome, setNewNome] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newValor, setNewValor] = useState('');
  const [newVencimento, setNewVencimento] = useState('2026-10-25');
  const [newDescricao, setNewDescricao] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyPix = (chave: string) => {
    navigator.clipboard.writeText(chave);
    showToast('Código Copia e Cola do Pix copiado para a área de transferência!');
  };

  const handleSendWhatsApp = (nome: string, valor: string | number, whatsappNumber?: string) => {
    const matched = INITIAL_ALUNOS.find(
      (a) => a.nome.toLowerCase() === nome.toLowerCase()
    );
    const raw = whatsappNumber || matched?.whatsapp || '11999999999';
    const phone = raw.replace(/\D/g, '');
    const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`;
    const valorFormatted =
      typeof valor === 'number'
        ? valor.toFixed(2).replace('.', ',')
        : valor.toString();

    const text = encodeURIComponent(
      `Olá ${nome}! Tudo bem? Aqui é o Carlos Rossi da FitPulse Pro.\n\n` +
      `Estou enviando a cobrança referente à sua consultoria/treinos no valor de R$ ${valorFormatted}.\n` +
      `Chave Pix: fitpulse-carlos-trainer@pix.com.br\n\n` +
      `Favor enviar o comprovante por aqui assim que efetuar o Pix. Muito obrigado!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    showToast(`Cobrança Pix direcionada para o WhatsApp de ${nome} (${raw})!`);
  };

  const handleCreateCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome || !newValor) return;

    const valNum = parseFloat(newValor.replace(',', '.'));
    const novaCob: CobrancaPix = {
      id: `cob-${Date.now()}`,
      alunoId: `aluno-temp-${Date.now()}`,
      alunoNome: newNome,
      alunoWhatsapp: newWhatsapp.trim() || undefined,
      iniciais: newNome.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      plano: newDescricao || 'Mensalidade FitPulse',
      valor: isNaN(valNum) ? 350 : valNum,
      status: 'pendentes',
      vencimento: newVencimento,
      detalheData: `Vence em ${newVencimento.split('-').reverse().join('/')}`,
      tipoTransacao: 'Aguardando Pix',
      chavePix: `00020126580014br.gov.bcb.pix0136fitpulse-carlos-trainer@pix.com.br520400005303986540${valNum.toFixed(2)}5802BR5913Carlos Trainer6009Sao Paulo62070503***6304E8A2`,
    };

    setCobrancas([novaCob, ...cobrancas]);
    setIsModalOpen(false);
    setNewNome('');
    setNewWhatsapp('');
    setNewValor('');
    setNewDescricao('');
    showToast(`Cobrança de R$ ${valNum.toFixed(2)} para ${newNome} criada com sucesso!`);
  };

  const filteredCobrancas = cobrancas.filter((c) => {
    if (filter === 'todos') return true;
    return c.status === filter;
  });

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006b2c] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006b2c] animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6e7b6c]">
                Módulo Financeiro
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#141b2b] tracking-tight">Financeiro & Cobranças</h2>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-[#006b2c]">calendar_month</span>
            <span>Outubro 2026</span>
          </div>
        </div>

        {/* Quick buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-[#006b2c] text-white font-bold text-xs shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            <span>+ Nova Cobrança Pix</span>
          </button>

          <button
            onClick={() => alert('Opções de conciliação bancária e exportação ativadas.')}
            className="h-11 px-3.5 flex items-center justify-center rounded-xl bg-[#f1f3ff] text-[#141b2b] shadow-xs hover:bg-[#e9edff] transition-colors cursor-pointer"
            title="Mais opções"
          >
            <span className="material-symbols-outlined text-[20px] text-[#3e4a3d]">tune</span>
          </button>
        </div>
      </div>

      {/* 4 Bento KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Receita em Out */}
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#e9edff] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">Receita em Out</span>
            <div className="w-6 h-6 rounded-lg bg-[#e9edff] flex items-center justify-center text-[#006b2c]">
              <span className="material-symbols-outlined text-[15px]">payments</span>
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#141b2b] tracking-tight">
              <span className="text-xs text-[#6e7b6c] font-normal mr-0.5">R$</span>14.850
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#7ffc97] text-[#002109]">
                <span className="material-symbols-outlined text-[11px] mr-0.5">arrow_upward</span>18%
              </span>
              <span className="text-[11px] text-[#6e7b6c] truncate">vs set/26</span>
            </div>
          </div>
        </div>

        {/* A Receber */}
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#e9edff] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">A Receber</span>
            <div className="w-6 h-6 rounded-lg bg-[#d8e2ff] flex items-center justify-center text-[#0058be]">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#141b2b] tracking-tight">
              <span className="text-xs text-[#6e7b6c] font-normal mr-0.5">R$</span>2.450
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[11px] text-[#3e4a3d] font-medium">7 pendências ativas</span>
            </div>
          </div>
        </div>

        {/* Atrasados */}
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#e9edff] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a]">Atrasados</span>
            <div className="w-6 h-6 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[15px]">warning</span>
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#ba1a1a] tracking-tight">
              <span className="text-xs text-[#ba1a1a]/70 font-normal mr-0.5">R$</span>640
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#ffdad6] text-[#93000a]">
                2 alunos
              </span>
              <span className="text-[11px] text-[#ba1a1a] font-semibold truncate">requer ação</span>
            </div>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#e9edff] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">Ticket Médio</span>
            <div className="w-6 h-6 rounded-lg bg-[#ffddb8] flex items-center justify-center text-[#825100]">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#141b2b] tracking-tight">
              <span className="text-xs text-[#6e7b6c] font-normal mr-0.5">R$</span>325
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[11px] text-[#6e7b6c]">48 alunos ativos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pix Rápido & Baixa Automática */}
      <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#e9edff] relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#006b2c] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#141b2b] leading-tight">Pix Rápido & Baixa Automática</h3>
              <p className="text-[11px] text-[#6e7b6c] leading-tight">Cobrança gerada e liquidada em segundos</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#7ffc97] text-[#002109] text-[10px] font-bold">
            0% Taxa
          </span>
        </div>

        <form
          className="space-y-2.5 relative z-10"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendWhatsApp(selectedStudent, quickAmount);
          }}
        >
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-7">
              <label className="block text-[11px] font-semibold text-[#3e4a3d] mb-1">Selecionar Aluno</label>
              <div className="relative">
                <select
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                    if (e.target.value.includes('Rafael')) setQuickAmount('320,00');
                    else if (e.target.value.includes('Ana')) setQuickAmount('450,00');
                    else if (e.target.value.includes('Lucas')) setQuickAmount('300,00');
                    else setQuickAmount('150,00');
                  }}
                  className="w-full h-10 pl-3 pr-8 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-medium appearance-none focus:outline-none focus:bg-[#e9edff] transition-all cursor-pointer"
                >
                  <option value="Rafael Costa">Rafael Costa (Atrasado R$ 320)</option>
                  <option value="Ana Carolina">Ana Carolina (Pendente R$ 450)</option>
                  <option value="Lucas Oliveira">Lucas Oliveira (Mensal R$ 300)</option>
                  <option value="Fernanda Rocha">Fernanda Rocha (Avulso R$ 150)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#6e7b6c] text-[18px] pointer-events-none">
                  unfold_more
                </span>
              </div>
            </div>

            <div className="col-span-5">
              <label className="block text-[11px] font-semibold text-[#3e4a3d] mb-1">Valor (R$)</label>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-xs text-[#6e7b6c] pointer-events-none font-semibold">R$</span>
                <input
                  type="text"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  className="w-full h-10 pl-8 pr-2.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-bold focus:outline-none focus:bg-[#e9edff] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleCopyPix('00020126580014br.gov.bcb.pix0136fitpulse-carlos-trainer@pix.com.br5204000053039865406320.005802BR5913Carlos Trainer6009Sao Paulo62070503***6304E8A2')}
              className="h-10 px-3 rounded-xl bg-[#e1e8fd] text-[#141b2b] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#dce2f7] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#006b2c]">content_copy</span>
              <span>Copiar Chave</span>
            </button>
            <button
              type="submit"
              className="h-10 px-3 rounded-xl bg-[#006b2c] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">send</span>
              <span>Cobrar WhatsApp</span>
            </button>
          </div>
        </form>
      </div>

      {/* Fluxo de Cobranças */}
      <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#e9edff]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-[#141b2b]">Fluxo de Cobranças</h3>
            <p className="text-[11px] text-[#6e7b6c]">Distribuição do volume total (R$ 17.940)</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e9edff] text-[#3e4a3d]">
            Taxa: 82% pago
          </span>
        </div>

        {/* Segmented Bar */}
        <div className="w-full h-3 rounded-full bg-[#e9edff] flex overflow-hidden p-0.5 gap-0.5">
          <div className="h-full bg-[#006b2c] rounded-l-full" style={{ width: '82%' }} title="82% Pago"></div>
          <div className="h-full bg-[#a36700]" style={{ width: '14%' }} title="14% Pendente"></div>
          <div className="h-full bg-[#ba1a1a] rounded-r-full" style={{ width: '4%' }} title="4% Atrasado"></div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs mt-3 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006b2c]"></span>
            <span className="text-[#141b2b] font-medium">Pago (82%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a36700]"></span>
            <span className="text-[#141b2b] font-medium">Pendente (14%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
            <span className="text-[#141b2b] font-medium">Atrasado (4%)</span>
          </div>
        </div>

        {/* Mini Sparkline 4 months */}
        <div className="mt-3 pt-3 border-t border-[#f1f3ff] flex items-center justify-between bg-[#f1f3ff] rounded-xl px-3 py-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#6e7b6c]">Evolução Mensal</span>
            <span className="text-xs font-bold text-[#141b2b]">+34% vs Julho</span>
          </div>
          <div className="flex items-end gap-2.5 h-8">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3.5 rounded-t bg-[#006b2c]/40 h-3"></div>
              <span className="text-[9px] text-[#6e7b6c]">Jul</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3.5 rounded-t bg-[#006b2c]/60 h-4"></div>
              <span className="text-[9px] text-[#6e7b6c]">Ago</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3.5 rounded-t bg-[#006b2c]/80 h-6"></div>
              <span className="text-[9px] text-[#6e7b6c]">Set</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3.5 rounded-t bg-[#006b2c] h-7"></div>
              <span className="text-[9px] font-bold text-[#006b2c]">Out</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
        <button
          onClick={() => setFilter('todos')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'todos' ? 'bg-[#141b2b] text-white shadow-xs' : 'bg-[#e1e8fd] text-[#141b2b] hover:bg-[#dce2f7]'
          }`}
        >
          Todos ({cobrancas.length})
        </button>
        <button
          onClick={() => setFilter('pagos')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'pagos' ? 'bg-[#141b2b] text-white shadow-xs' : 'bg-[#e1e8fd] text-[#141b2b] hover:bg-[#dce2f7]'
          }`}
        >
          Pagos (3)
        </button>
        <button
          onClick={() => setFilter('pendentes')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'pendentes' ? 'bg-[#141b2b] text-white shadow-xs' : 'bg-[#e1e8fd] text-[#141b2b] hover:bg-[#dce2f7]'
          }`}
        >
          Pendentes (1)
        </button>
        <button
          onClick={() => setFilter('atrasados')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === 'atrasados' ? 'bg-[#ba1a1a] text-white shadow-xs' : 'bg-[#e1e8fd] text-[#ba1a1a] hover:bg-[#ffdad6]'
          }`}
        >
          Atrasados (1)
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredCobrancas.map((cob) => (
          <div
            key={cob.id}
            className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#e9edff] flex flex-col gap-2.5 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {cob.alunoFoto ? (
                    <img
                      src={cob.alunoFoto}
                      alt={cob.alunoNome}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#0058be] font-bold text-sm">
                      {cob.iniciais || 'FP'}
                    </div>
                  )}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                      cob.status === 'pagos'
                        ? 'bg-[#006b2c]'
                        : cob.status === 'pendentes'
                        ? 'bg-[#a36700]'
                        : 'bg-[#ba1a1a]'
                    }`}
                  ></span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#141b2b]">{cob.alunoNome}</h4>
                  <span className="text-xs text-[#6e7b6c]">{cob.plano}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-base font-bold ${cob.status === 'pagos' ? 'text-[#006b2c]' : 'text-[#141b2b]'}`}>
                  R$ {cob.valor.toFixed(2).replace('.', ',')}
                </span>
                <span
                  className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                    cob.status === 'pagos'
                      ? 'bg-[#7ffc97] text-[#002109]'
                      : cob.status === 'pendentes'
                      ? 'bg-[#ffddb8] text-[#2a1700]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  {cob.status === 'pagos' && <span className="material-symbols-outlined text-[11px] mr-0.5">check</span>}
                  {cob.status === 'pagos' ? 'Confirmado (Pix)' : cob.status === 'pendentes' ? 'Aguardando Pix' : 'Vencido há 2 dias'}
                </span>
              </div>
            </div>

            {/* Bottom Row Actions */}
            <div className="flex items-center justify-between pt-1.5 text-xs bg-[#f1f3ff] px-3 py-1.5 rounded-xl">
              <span className="text-[#6e7b6c] flex items-center gap-1 text-[11px]">
                <span className="material-symbols-outlined text-[13px]">
                  {cob.status === 'pagos' ? 'done_all' : cob.status === 'pendentes' ? 'alarm' : 'event_busy'}
                </span>
                {cob.detalheData || cob.vencimento}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopyPix(cob.chavePix)}
                  className="p-1.5 rounded-lg bg-white text-[#141b2b] hover:bg-[#e9edff] shadow-xs cursor-pointer"
                  title="Copiar código Pix"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendWhatsApp(cob.alunoNome, cob.valor, cob.alunoWhatsapp)}
                  className="px-2.5 py-1 rounded-lg bg-[#006b2c] text-white font-bold text-[11px] flex items-center gap-1 hover:opacity-95 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[14px]">chat</span>
                  <span>Cobrar WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Atalhos & Relatórios */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7b6c] px-1">
          Atalhos & Relatórios
        </span>

        <div className="grid grid-cols-1 gap-2">
          {/* Extrato 0% Pix */}
          <button
            onClick={() => alert('Seu plano FitPulse Pro conta com taxa de 0% em todas as cobranças via Pix! Economia média de R$ 480/mês.')}
            className="p-3 rounded-2xl bg-white shadow-xs border border-[#e9edff] flex items-center justify-between text-left hover:bg-[#f1f3ff] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#7ffc97] flex items-center justify-center text-[#006b2c]">
                <span className="material-symbols-outlined text-[20px]">percent</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#141b2b]">Extrato de Taxas (0% Pix)</h5>
                <p className="text-[11px] text-[#6e7b6c]">Economia acumulada de R$ 480 este mês</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7b6c] text-[20px]">chevron_right</span>
          </button>

          {/* Exportar Relatório Fiscal */}
          <button
            onClick={() => showToast('Exportando relatório financeiro fiscal em .CSV e .PDF...')}
            className="p-3 rounded-2xl bg-white shadow-xs border border-[#e9edff] flex items-center justify-between text-left hover:bg-[#f1f3ff] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#d8e2ff] flex items-center justify-center text-[#0058be]">
                <span className="material-symbols-outlined text-[20px]">file_download</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#141b2b]">Exportar Relatório Fiscal (.PDF / .CSV)</h5>
                <p className="text-[11px] text-[#6e7b6c]">Pronto para contabilidade e imposto</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7b6c] text-[20px]">chevron_right</span>
          </button>

          {/* Configuração Chave Pix */}
          <button
            onClick={() => alert('Chave Pix atual ativa: fitpulse-carlos-trainer@pix.com.br (Banco Itaú)')}
            className="p-3 rounded-2xl bg-white shadow-xs border border-[#e9edff] flex items-center justify-between text-left hover:bg-[#f1f3ff] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ffddb8] flex items-center justify-center text-[#825100]">
                <span className="material-symbols-outlined text-[20px]">key</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#141b2b]">Configurações de Chave Pix</h5>
                <p className="text-[11px] text-[#6e7b6c]">Carlos Trainer - Chave E-mail Ativa</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7b6c] text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Modal: Nova Cobrança Pix */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add_card</span>
                </div>
                <h3 className="text-base font-bold text-[#141b2b]">Emitir Cobrança Pix</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] hover:text-[#141b2b]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCharge} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Nome do Aluno / Contato</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lucas Mendes"
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-sm focus:bg-white focus:ring-2 focus:ring-[#006b2c]/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                  WhatsApp para Envio da Cobrança Pix
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#006b2c] material-symbols-outlined text-[18px]">
                    chat
                  </span>
                  <input
                    type="tel"
                    placeholder="Ex: (11) 98765-4321"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    className="w-full h-11 pl-9 pr-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-sm focus:bg-white focus:ring-2 focus:ring-[#006b2c]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Valor (R$)</label>
                  <input
                    type="text"
                    required
                    placeholder="350,00"
                    value={newValor}
                    onChange={(e) => setNewValor(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#006b2c]/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Vencimento</label>
                  <input
                    type="date"
                    value={newVencimento}
                    onChange={(e) => setNewVencimento(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-sm focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Descrição do Treino/Plano</label>
                <input
                  type="text"
                  placeholder="Ex: Mensalidade Presencial + Treino FitPulse"
                  value={newDescricao}
                  onChange={(e) => setNewDescricao(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-sm focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#006b2c] text-white text-xs font-bold shadow-sm hover:bg-[#00873a] cursor-pointer"
                >
                  Criar & Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
