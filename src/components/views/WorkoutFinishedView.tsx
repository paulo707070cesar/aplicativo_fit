import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';

interface WorkoutFinishedViewProps {
  onNavigate: (view: string) => void;
}

export const WorkoutFinishedView: React.FC<WorkoutFinishedViewProps> = ({ onNavigate }) => {
  const [selectedPse, setSelectedPse] = useState<'leve' | 'moderado' | 'intenso' | 'exaustivo'>('intenso');
  const [coachNotes, setCoachNotes] = useState(
    'Senti bastante os posteriores no Stiff, mas a carga de 28kg subiu com ótima estabilidade! Energia foi ótima hoje.'
  );
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleShare = () => {
    setShowToast('Treino e métricas compartilhados com o Coach Carlos!');
    setTimeout(() => {
      setShowToast(null);
      onNavigate('dashboard');
    }, 2000);
  };

  const handleStories = () => {
    setShowToast('Card de alta resolução gerado para os Stories do Instagram!');
    setTimeout(() => setShowToast(null), 3000);
  };

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const handleWhatsAppSummary = () => {
    const text = encodeURIComponent(
      `🏆 *RELATÓRIO DE TREINO CONCLUÍDO - FITPULSE PRO* 🏆\n\n` +
      `Aluno(a): Mariana Silva\n` +
      `Treino: Ficha B - Inferiores & Glúteo\n` +
      `Data: 15 de Outubro de 2026\n\n` +
      `⏱️ Duração: 52 min\n` +
      `🔥 Queima Est.: 435 kcal\n` +
      `🏋️ Carga Total: 3.840 kg\n` +
      `✅ Exercícios: 6/6 Concluídos (100% de adesão)\n\n` +
      `💪 Esforço (PSE): Intenso (8/10)\n` +
      `💬 Feedback: "${coachNotes}"\n\n` +
      `📈 Progresso: +320 kg vs treino anterior.\n\n` +
      `_Relatório gerado automaticamente pelo FitPulse Pro_`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShowToast('Resumo do treino enviado para o WhatsApp com sucesso!');
    setIsSummaryModalOpen(false);
  };

  const handleDownloadPdfOrImage = () => {
    setShowToast('Gerando e baixando Relatório PDF / Imagem do Treino...');
    setTimeout(() => {
      setShowToast('Relatório salvo com sucesso em seu dispositivo!');
      setIsSummaryModalOpen(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Toast Feedback */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006b2c] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{showToast}</span>
        </div>
      )}

      {/* Confetti & Celebration Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xs border border-[#e9edff] text-center flex flex-col items-center">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#7ffc97]/25 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#d8e2ff]/40 rounded-full blur-2xl pointer-events-none"></div>

        {/* Trophy Emblem */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full bg-[#7ffc97]/30 flex items-center justify-center text-[#006b2c] shadow-xs ring-4 ring-[#7ffc97]/50 animate-pulse">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#006b2c] text-white rounded-full p-0.5 shadow-xs flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">check</span>
          </div>
        </div>

        {/* Date badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e9edff] text-[#006b2c] rounded-full mb-1">
          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          <span className="text-[11px] font-bold">Hoje, 15 de Outubro • 09:18</span>
        </div>

        <h2 className="text-2xl font-bold text-[#141b2b] tracking-tight">
          Treino Concluído! 🎉
        </h2>
        <p className="text-xs text-[#3e4a3d] max-w-xs mt-1">
          Excelente trabalho, <strong className="text-[#141b2b] font-bold">Mariana</strong>! Você completou o Treino B (Inferiores & Glúteo) com consistência máxima.
        </p>

        {/* Coach attribution */}
        <div className="mt-3 pt-2 border-t border-[#f1f3ff] flex items-center gap-2 text-xs text-[#6e7b6c]">
          <div className="w-6 h-6 rounded-full bg-[#e9edff] flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-[16px] text-[#006b2c]">sports</span>
          </div>
          <span>Supervisionado por <strong className="font-bold text-[#141b2b]">Coach Carlos Rossi</strong></span>
        </div>
      </div>

      {/* Performance Metric Bento Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Tempo Total */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">Tempo Total</span>
            <div className="w-7 h-7 rounded-lg bg-[#f1f3ff] flex items-center justify-center text-[#006b2c]">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#141b2b] tabular-nums">52</span>
            <span className="text-xs text-[#6e7b6c] ml-0.5">min</span>
            <div className="mt-1 flex items-center gap-1 text-[#006b2c]">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span className="text-[11px] font-bold">Meta: 50 min</span>
            </div>
          </div>
        </div>

        {/* Queima Est. */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">Queima Est.</span>
            <div className="w-7 h-7 rounded-lg bg-[#ffddb8] flex items-center justify-center text-[#825100]">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#141b2b] tabular-nums">435</span>
            <span className="text-xs text-[#6e7b6c] ml-0.5">kcal</span>
            <div className="mt-1 flex items-center gap-1 text-[#825100]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span className="text-[11px] font-bold">+40 kcal vs média</span>
            </div>
          </div>
        </div>

        {/* Carga Total */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">Carga Total</span>
            <div className="w-7 h-7 rounded-lg bg-[#d8e2ff] flex items-center justify-center text-[#0058be]">
              <span className="material-symbols-outlined text-[18px]">fitness_center</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#141b2b] tabular-nums">3.840</span>
            <span className="text-xs text-[#6e7b6c] ml-0.5">kg</span>
            <div className="mt-1 flex items-center gap-1 text-[#006b2c]">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span className="text-[11px] font-bold">+320 kg vs anterior</span>
            </div>
          </div>
        </div>

        {/* Exercícios */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7b6c]">Exercícios</span>
            <div className="w-7 h-7 rounded-lg bg-[#e9edff] flex items-center justify-center text-[#006b2c]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#141b2b] tabular-nums">6/6</span>
            <span className="text-xs text-[#6e7b6c] ml-0.5">concluídos</span>
            <div className="mt-1 flex items-center gap-1 text-[#006b2c]">
              <span className="material-symbols-outlined text-[14px]">stars</span>
              <span className="text-[11px] font-bold">100% de adesão</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recordes & Conquistas (PRs) */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#825100] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
            <h3 className="text-sm font-bold text-[#141b2b]">Recordes & Conquistas</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#825100] text-[10px] font-bold">
            2 Novos PRs
          </span>
        </div>

        <div className="space-y-2">
          {/* PR 1 */}
          <div className="p-2.5 bg-[#f1f3ff] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#7ffc97]/50 text-[#006b2c] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#141b2b]">Stiff com Halteres</p>
                <p className="text-[11px] text-[#6e7b6c]">
                  Novo recorde: <strong className="text-[#141b2b]">28 kg / lado</strong>
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#7ffc97]/40 text-[#006b2c] rounded-full text-[10px] font-bold">
              +4kg PR
            </span>
          </div>

          {/* PR 2 */}
          <div className="p-2.5 bg-[#f1f3ff] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#d8e2ff] text-[#0058be] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">speed</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#141b2b]">Elevação Pélvica</p>
                <p className="text-[11px] text-[#6e7b6c]">
                  Cadência perfeita a <strong className="text-[#141b2b]">80 kg</strong>
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#d8e2ff] text-[#0058be] rounded-full text-[10px] font-bold">
              Técnica A+
            </span>
          </div>

          {/* Streak Pill */}
          <div className="p-2.5 bg-[#ffddb8]/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ffddb8] text-[#825100] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#141b2b]">Streak Semanal Protegida!</p>
                <p className="text-[11px] text-[#6e7b6c]">4 semanas sem falhar nenhum dia de treino</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#825100]">4 Semanas</span>
          </div>
        </div>
      </div>

      {/* Resumo dos Exercícios Executados */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006b2c] text-[20px]">format_list_bulleted</span>
            <h3 className="text-sm font-bold text-[#141b2b]">Exercícios Executados</h3>
          </div>
          <span className="text-xs text-[#6e7b6c]">6 itens</span>
        </div>

        <div className="space-y-1.5">
          {[
            { num: 1, nome: 'Agachamento Búlgaro', detalhe: '4 séries • até 20 kg' },
            { num: 2, nome: 'Leg Press 45°', detalhe: '3 séries • 140 kg' },
            { num: 3, nome: 'Stiff com Halteres', detalhe: '4 séries • 28 kg (PR)' },
            { num: 4, nome: 'Elevação Pélvica', detalhe: '4 séries • 80 kg' },
            { num: 5, nome: 'Cadeira Extensora', detalhe: '3 séries • 55 kg Drop-set' },
            { num: 6, nome: 'Panturrilha no Smith', detalhe: '4 séries • 45 kg' },
          ].map((item) => (
            <div
              key={item.num}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#f1f3ff]"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#006b2c] text-white text-[10px] flex items-center justify-center font-bold">
                  {item.num}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#141b2b]">{item.nome}</h4>
                  <p className="text-[11px] text-[#6e7b6c]">{item.detalhe}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#006b2c] text-[18px]">check</span>
            </div>
          ))}
        </div>
      </div>

      {/* Percepção de Esforço (PSE) & Feedback */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#141b2b]">Como foi a intensidade hoje?</h3>
            <p className="text-xs text-[#6e7b6c]">Percepção Subjetiva de Esforço (PSE)</p>
          </div>
          <span className="w-8 h-8 rounded-full bg-[#e9edff] flex items-center justify-center text-[#006b2c] text-xs font-bold">
            {selectedPse === 'leve' ? '3' : selectedPse === 'moderado' ? '5' : selectedPse === 'intenso' ? '8' : '10'}
          </span>
        </div>

        {/* Rating Selector */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            type="button"
            onClick={() => setSelectedPse('leve')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs transition-all cursor-pointer ${
              selectedPse === 'leve' ? 'bg-[#006b2c] text-white font-bold shadow-xs' : 'bg-[#f1f3ff] text-[#3e4a3d]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
            <span className="text-[10px] mt-0.5">Leve</span>
            <span className="text-[9px] opacity-70">1-4</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPse('moderado')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs transition-all cursor-pointer ${
              selectedPse === 'moderado' ? 'bg-[#006b2c] text-white font-bold shadow-xs' : 'bg-[#f1f3ff] text-[#3e4a3d]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">sentiment_neutral</span>
            <span className="text-[10px] mt-0.5">Moderado</span>
            <span className="text-[9px] opacity-70">5-6</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPse('intenso')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs transition-all cursor-pointer ${
              selectedPse === 'intenso' ? 'bg-[#006b2c] text-white font-bold shadow-xs' : 'bg-[#f1f3ff] text-[#3e4a3d]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              sentiment_very_dissatisfied
            </span>
            <span className="text-[10px] mt-0.5 font-bold">Intenso</span>
            <span className="text-[9px] opacity-90 font-medium">8/10</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPse('exaustivo')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs transition-all cursor-pointer ${
              selectedPse === 'exaustivo' ? 'bg-[#ba1a1a] text-white font-bold shadow-xs' : 'bg-[#f1f3ff] text-[#3e4a3d]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
            <span className="text-[10px] mt-0.5">Exaustivo</span>
            <span className="text-[9px] opacity-70">9-10</span>
          </button>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#141b2b] flex items-center justify-between">
            <span>Recado para o Coach Carlos:</span>
            <span className="text-[10px] text-[#006b2c] font-normal">Editável</span>
          </label>
          <textarea
            value={coachNotes}
            onChange={(e) => setCoachNotes(e.target.value)}
            rows={3}
            className="w-full p-2.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20 transition-colors resize-none"
          />
        </div>

        {/* Selfie Card */}
        <div className="p-2.5 rounded-xl bg-[#f1f3ff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#e9edff] shadow-xs">
              <img
                src={ASSETS.marianaSelfieImg}
                alt="Selfie pós-treino Mariana"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[#141b2b]">Foto pós-treino anexada</p>
              <p className="text-[11px] text-[#6e7b6c]">Pronta para o check-in visual</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert('Foto pós-treino capturada com sucesso!')}
            className="w-9 h-9 rounded-xl bg-white text-[#141b2b] flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#e9edff]"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => setIsSummaryModalOpen(true)}
          className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>Gerar Resumo (PDF/Imagem) & Enviar no WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="w-full h-11 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          <span>Salvar e Compartilhar com Carlos</span>
        </button>

        <button
          type="button"
          onClick={handleStories}
          className="w-full h-11 rounded-xl bg-white border border-[#e9edff] text-[#141b2b] font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#f1f3ff] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#0058be] text-[18px]">share</span>
          <span>Compartilhar nos Stories</span>
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-semibold text-[#6e7b6c] hover:text-[#141b2b] py-1 cursor-pointer"
          >
            Voltar ao Início
          </button>
        </div>
      </div>

      {/* ========================================================
          MODAL: RESUMO EM PDF / IMAGEM PARA WHATSAPP
          ======================================================== */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#141b2b]">Resumo do Treino</h3>
                  <p className="text-xs text-[#6e7b6c]">PDF / Imagem Pronta para Compartilhar</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] hover:bg-[#e9edff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Preview Card */}
            <div className="bg-[#f9f9ff] border border-[#e9edff] rounded-2xl p-4 space-y-3 text-xs text-[#3e4a3d]">
              <div className="flex items-center justify-between border-b border-[#e9edff] pb-2">
                <span className="font-bold text-[#006b2c]">FITPULSE PRO • RELATÓRIO</span>
                <span className="text-[10px] text-[#6e7b6c]">15 Out 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={ASSETS.marianaAvatar} alt="Mariana" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <strong className="text-sm text-[#141b2b] block">Mariana Silva</strong>
                  <span className="text-[11px] text-[#6e7b6c]">Treino B - Inferiores & Glúteo</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="bg-white p-2 rounded-xl border border-[#e9edff]">
                  <span className="text-[10px] text-[#6e7b6c] block">Duração</span>
                  <strong className="text-xs text-[#141b2b]">52 min</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#e9edff]">
                  <span className="text-[10px] text-[#6e7b6c] block">Carga</span>
                  <strong className="text-xs text-[#141b2b]">3.840 kg</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#e9edff]">
                  <span className="text-[10px] text-[#6e7b6c] block">Calorias</span>
                  <strong className="text-xs text-[#141b2b]">435 kcal</strong>
                </div>
              </div>
              <p className="text-[11px] italic text-[#6e7b6c] bg-white p-2 rounded-xl border border-[#e9edff]">
                "{coachNotes}"
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleWhatsAppSummary}
                className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Enviar Relatório no WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdfOrImage}
                className="w-full h-11 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Baixar Imagem / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
