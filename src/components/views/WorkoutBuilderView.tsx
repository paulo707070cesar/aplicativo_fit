import React, { useState } from 'react';
import { TreinoPlano, Exercicio, Serie } from '../../types';
import { INITIAL_WORKOUT_PLAN, INITIAL_ALUNOS, ASSETS } from '../../data/mockData';

interface WorkoutBuilderViewProps {
  onNavigate: (view: string) => void;
}

export const WorkoutBuilderView: React.FC<WorkoutBuilderViewProps> = ({ onNavigate }) => {
  const [plano, setPlano] = useState<TreinoPlano>(INITIAL_WORKOUT_PLAN);
  const [activeTab, setActiveTab] = useState(0);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Edit Plan Details Modal State
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [editPlanNome, setEditPlanNome] = useState(plano.nome);
  const [editPlanAluno, setEditPlanAluno] = useState(plano.alunoNome);
  const [editPlanVersao, setEditPlanVersao] = useState(plano.versao);
  const [editPlanDuracao, setEditPlanDuracao] = useState(plano.duracaoSemanas);
  const [editPlanFreq, setEditPlanFreq] = useState(plano.frequenciaSemanal);
  const [editPlanNivel, setEditPlanNivel] = useState(plano.nivel);

  // Edit Coach Note State
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [selectedExForNote, setSelectedExForNote] = useState<Exercicio | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  const notify = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleOpenEditPlanModal = () => {
    setEditPlanNome(plano.nome);
    setEditPlanAluno(plano.alunoNome);
    setEditPlanVersao(plano.versao);
    setEditPlanDuracao(plano.duracaoSemanas);
    setEditPlanFreq(plano.frequenciaSemanal);
    setEditPlanNivel(plano.nivel);
    setIsEditPlanModalOpen(true);
  };

  const handleSavePlanMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlanNome.trim()) return;

    const matchedAluno = INITIAL_ALUNOS.find((a) => a.nome === editPlanAluno);

    setPlano({
      ...plano,
      nome: editPlanNome.trim(),
      alunoNome: editPlanAluno,
      alunoFoto: matchedAluno?.foto || plano.alunoFoto,
      alunoId: matchedAluno?.id || plano.alunoId,
      versao: editPlanVersao.trim() || plano.versao,
      duracaoSemanas: Number(editPlanDuracao) || plano.duracaoSemanas,
      frequenciaSemanal: editPlanFreq.trim() || plano.frequenciaSemanal,
      nivel: editPlanNivel,
    });

    setIsEditPlanModalOpen(false);
    notify(`Plano "${editPlanNome.trim()}" atualizado com sucesso!`);
  };

  const handleOpenEditNote = (ex: Exercicio) => {
    setSelectedExForNote(ex);
    setEditNoteText(ex.instrucaoTecnica || '');
    setIsEditNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExForNote) return;

    const updatedRotina = [...plano.rotina];
    const currentDay = updatedRotina[activeTab];
    const ex = currentDay.exercicios.find((e) => e.id === selectedExForNote.id);
    if (ex) {
      ex.instrucaoTecnica = editNoteText.trim();
      setPlano({ ...plano, rotina: updatedRotina });
      notify(`Instrução técnica de ${ex.nome} atualizada!`);
    }
    setIsEditNoteModalOpen(false);
  };

  const handleUpdateSerie = (
    exId: string,
    serieIdx: number,
    field: keyof Serie,
    val: string | number
  ) => {
    const updatedRotina = [...plano.rotina];
    const currentDay = updatedRotina[activeTab];
    const ex = currentDay.exercicios.find((e) => e.id === exId);
    if (!ex) return;

    ex.series[serieIdx] = {
      ...ex.series[serieIdx],
      [field]: val,
    };
    setPlano({ ...plano, rotina: updatedRotina });
  };

  const handleAddSerie = (exId: string) => {
    const updatedRotina = [...plano.rotina];
    const currentDay = updatedRotina[activeTab];
    const ex = currentDay.exercicios.find((e) => e.id === exId);
    if (!ex) return;

    const lastSerie = ex.series[ex.series.length - 1];
    const newNum = String(ex.series.length + 1).padStart(2, '0');
    ex.series.push({
      numero: newNum,
      tipo: 'Trabalho',
      reps: lastSerie ? lastSerie.reps : 10,
      peso: lastSerie ? lastSerie.peso : 20,
      pausa: '90s',
    });
    setPlano({ ...plano, rotina: updatedRotina });
    notify(`Série ${newNum} adicionada ao ${ex.nome}!`);
  };

  const handleRemoveSerie = (exId: string, serieIdx: number) => {
    const updatedRotina = [...plano.rotina];
    const currentDay = updatedRotina[activeTab];
    const ex = currentDay.exercicios.find((e) => e.id === exId);
    if (!ex || ex.series.length <= 1) return;

    ex.series.splice(serieIdx, 1);
    setPlano({ ...plano, rotina: updatedRotina });
  };

  const handleAddExerciseFromLibrary = () => {
    const updatedRotina = [...plano.rotina];
    const currentDay = updatedRotina[activeTab];

    const novoEx: Exercicio = {
      id: `ex-${Date.now()}`,
      numero: currentDay.exercicios.length + 1,
      nome: 'Elevação Pélvica com Barra',
      grupoMuscular: 'Glúteos & Isquiotibiais',
      equipamento: 'Barra & Banco',
      imagemUrl: ASSETS.stiffHalteresImg,
      instrucaoTecnica: 'Manter contração de 2 segundos no topo do movimento.',
      series: [
        { numero: '01', tipo: 'Aquec.', reps: 15, peso: 40, pausa: '60s' },
        { numero: '02', tipo: 'Trabalho', reps: 10, peso: 80, pausa: '90s' },
        { numero: '03', tipo: 'Falha', reps: 8, peso: 90, pausa: '120s' },
      ],
    };

    currentDay.exercicios.push(novoEx);
    setPlano({ ...plano, rotina: updatedRotina });
    notify('Elevação Pélvica adicionada da biblioteca!');
  };

  const currentExercicios = plano.rotina[activeTab]?.exercicios || [];

  return (
    <div className="flex flex-col w-full pb-28 space-y-4">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006b2c] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{showToast}</span>
        </div>
      )}

      {/* Informações Gerais do Treino */}
      <section className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006b2c] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#006b2c] uppercase tracking-wider">
              Construtor de Planilha
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#3e4a3d] bg-[#e9edff] px-2.5 py-0.5 rounded-full">
            {plano.versao}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-[#6e7b6c]">
              Nome do Plano de Treino
            </label>
            <span className="text-[10px] text-[#006b2c] font-medium flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">touch_app</span>
              Clique no lápis para editar detalhes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={plano.nome}
              onChange={(e) => setPlano({ ...plano, nome: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                  notify(`Nome do plano salvo: "${plano.nome}"`);
                }
              }}
              className="w-full text-base font-bold text-[#141b2b] bg-[#f1f3ff] px-3 py-2 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006b2c]/20 transition-colors truncate"
              placeholder="Digite o nome do plano de treino..."
            />
            <button
              type="button"
              onClick={handleOpenEditPlanModal}
              className="p-2.5 rounded-xl bg-[#006b2c]/10 hover:bg-[#006b2c]/20 text-[#006b2c] transition-all cursor-pointer shrink-0 shadow-xs flex items-center justify-center active:scale-95"
              title="Editar nome e configurações completas do plano"
              aria-label="Editar Plano de Treino"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>
        </div>

        {/* Aluno Vinculado */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <div className="flex items-center gap-2 bg-[#f1f3ff] px-3 py-1.5 rounded-full min-w-0">
            <img
              src={plano.alunoFoto || ASSETS.marianaAvatar}
              alt={plano.alunoNome}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#141b2b] truncate font-bold">{plano.alunoNome}</span>
              <span className="text-[10px] text-[#006b2c] truncate leading-none font-semibold">
                Aluna Ativa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
            <span className="bg-[#e9edff] text-[#3e4a3d] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">calendar_month</span>
              {plano.duracaoSemanas} sem
            </span>
            <span className="bg-[#e9edff] text-[#3e4a3d] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">repeat</span>
              {plano.frequenciaSemanal}
            </span>
            <span className="bg-[#d8e2ff] text-[#001a42] font-bold px-2 py-1 rounded-full">
              {plano.nivel}
            </span>
          </div>
        </div>
      </section>

      {/* Seletor de Divisão / Dias */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-[#6e7b6c] uppercase tracking-wider font-bold">
            Rotina Semanal
          </span>
          <span className="text-xs text-[#006b2c] font-semibold">
            {plano.rotina.length} sessões cadastradas
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {plano.rotina.map((r, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl shadow-xs text-xs transition-all text-left cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#006b2c] text-white font-bold'
                  : 'bg-white text-[#141b2b] border border-[#e9edff] hover:bg-[#f1f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {idx === 0
                  ? 'fitness_center'
                  : idx === 1
                  ? 'sports_gymnastics'
                  : idx === 2
                  ? 'airline_seat_legroom_extra'
                  : 'bolt'}
              </span>
              <div>
                <p className="leading-none font-bold">{r.dia}</p>
                <p
                  className={`text-[10px] mt-0.5 truncate max-w-[130px] ${
                    activeTab === idx ? 'text-white/80' : 'text-[#6e7b6c]'
                  }`}
                >
                  {r.titulo}
                </p>
              </div>
            </button>
          ))}

          <button
            onClick={() => {
              const newDay = {
                dia: `Dia ${plano.rotina.length + 1}`,
                titulo: 'Nova Sessão Customizada',
                subtitulo: 'Treino personalizado',
                exercicios: [],
              };
              setPlano({ ...plano, rotina: [...plano.rotina, newDay] });
              setActiveTab(plano.rotina.length);
              notify('Nova sessão de treino adicionada à rotina semanal!');
            }}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#e1e8fd] text-[#006b2c] hover:bg-[#dce2f7] transition-colors font-bold text-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Novo Dia</span>
          </button>
        </div>
      </section>

      {/* Lista de Exercícios da Sessão Ativa */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#141b2b]">
              {plano.rotina[activeTab]?.dia || 'Treino'}
            </span>
            <span className="bg-[#7ffc97] text-[#002109] text-[10px] px-2 py-0.5 rounded-full font-bold">
              {currentExercicios.length} Exercícios
            </span>
          </div>
          <button
            onClick={() => notify('Modo de reordenação ativado! Arraste os cards para alterar a ordem.')}
            className="text-xs text-[#006b2c] font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">swap_vert</span>
            Reordenar
          </button>
        </div>

        {/* Exercícios Renderizados */}
        {currentExercicios.map((ex) => (
          <article
            key={ex.id}
            className="bg-white rounded-2xl shadow-xs border border-[#e9edff] p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <button
                  type="button"
                  className="cursor-grab text-[#6e7b6c]/60 hover:text-[#141b2b] p-0.5 mt-0.5"
                  title="Arrastar para reordenar"
                >
                  <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
                </button>

                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-xs bg-[#e9edff]">
                  <img
                    src={ex.imagemUrl}
                    alt={ex.nome}
                    className="w-full h-full object-cover"
                  />
                  {ex.temVideo && (
                    <button
                      onClick={() => alert(`Reproduzindo vídeo demonstrativo de execução: ${ex.nome}`)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_circle
                      </span>
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[#006b2c] bg-[#7ffc97]/50 px-1.5 py-0.5 rounded font-bold">
                      #{ex.numero}
                    </span>
                    <h2 className="text-sm font-bold text-[#141b2b] truncate">{ex.nome}</h2>
                    {ex.tag && (
                      <span className="bg-[#ffddb8] text-[#825100] text-[10px] px-1.5 py-0.2 rounded font-bold">
                        {ex.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6e7b6c] truncate mt-0.5">
                    {ex.grupoMuscular} • {ex.equipamento}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => notify(`Exercício ${ex.nome} duplicado com sucesso!`)}
                  className="w-8 h-8 rounded-lg bg-[#f1f3ff] hover:bg-[#e9edff] flex items-center justify-center text-[#6e7b6c] cursor-pointer"
                  title="Duplicar exercício"
                >
                  <span className="material-symbols-outlined text-[17px]">content_copy</span>
                </button>
                <button
                  onClick={() => alert(`Opções avançadas de cadência e intervalo para: ${ex.nome}`)}
                  className="w-8 h-8 rounded-lg bg-[#f1f3ff] hover:bg-[#e9edff] flex items-center justify-center text-[#6e7b6c] cursor-pointer"
                  title="Mais opções"
                >
                  <span className="material-symbols-outlined text-[17px]">more_vert</span>
                </button>
              </div>
            </div>

            {/* Tabela de Séries Editável */}
            <div className="bg-[#f1f3ff] rounded-xl p-2.5 flex flex-col gap-1.5">
              <div className="grid grid-cols-12 gap-1.5 text-[#6e7b6c] font-bold text-[10px] px-1 pb-1 uppercase">
                <span className="col-span-2">SET</span>
                <span className="col-span-3">TIPO</span>
                <span className="col-span-2 text-center">REPS</span>
                <span className="col-span-2 text-center">PESO</span>
                <span className="col-span-2 text-center">PAUSA</span>
                <span className="col-span-1"></span>
              </div>

              {ex.series.map((serie, sIdx) => (
                <div
                  key={sIdx}
                  className="grid grid-cols-12 gap-1.5 items-center bg-white p-1.5 rounded-lg shadow-xs"
                >
                  <span className="col-span-2 text-xs text-[#141b2b] font-bold pl-1">
                    {serie.numero}
                  </span>

                  <div className="col-span-3">
                    <span
                      className={`block text-[10px] font-bold px-1.5 py-0.5 rounded text-center truncate ${
                        serie.tipo === 'Aquec.'
                          ? 'bg-[#d8e2ff] text-[#001a42]'
                          : serie.tipo === 'Falha'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : serie.tipo === 'Drop-set'
                          ? 'bg-[#ffddb8] text-[#825100]'
                          : 'bg-[#7ffc97] text-[#002109]'
                      }`}
                    >
                      {serie.tipo}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={serie.reps}
                      onChange={(e) =>
                        handleUpdateSerie(ex.id, sIdx, 'reps', parseInt(e.target.value) || 0)
                      }
                      className="w-full text-center text-xs text-[#141b2b] bg-[#f1f3ff] rounded py-1 font-bold focus:outline-none focus:bg-[#e9edff]"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={serie.peso}
                      onChange={(e) =>
                        handleUpdateSerie(ex.id, sIdx, 'peso', parseInt(e.target.value) || 0)
                      }
                      className="w-full text-center text-xs text-[#141b2b] bg-[#f1f3ff] rounded py-1 font-bold focus:outline-none focus:bg-[#e9edff]"
                    />
                  </div>

                  <div className="col-span-2 text-center text-[11px] text-[#3e4a3d] font-semibold">
                    {serie.pausa}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSerie(ex.id, sIdx)}
                    className="col-span-1 text-[#6e7b6c]/50 hover:text-[#ba1a1a] flex justify-center cursor-pointer"
                    title="Remover série"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddSerie(ex.id)}
                className="w-full py-1.5 mt-1 rounded-lg bg-[#e9edff] hover:bg-[#dce2f7] text-[#006b2c] font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Adicionar Série
              </button>
            </div>

            {/* Coach Notes */}
            {ex.instrucaoTecnica && (
              <div className="bg-[#f1f3ff] rounded-xl p-2.5 flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#825100] mt-0.5">
                  tips_and_updates
                </span>
                <div className="flex-1">
                  <span className="text-[10px] text-[#825100] uppercase tracking-wider font-bold block">
                    Instrução Técnica ao Aluno
                  </span>
                  <p className="text-xs text-[#3e4a3d]">{ex.instrucaoTecnica}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenEditNote(ex)}
                  className="p-1 rounded-lg text-[#6e7b6c] hover:text-[#006b2c] hover:bg-[#e9edff] transition-colors cursor-pointer"
                  title="Editar instrução técnica"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                </button>
              </div>
            )}
          </article>
        ))}

        {/* Botão Adicionar da Biblioteca */}
        <button
          type="button"
          onClick={handleAddExerciseFromLibrary}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border border-dashed border-[#006b2c]/40 text-[#006b2c] shadow-xs hover:bg-[#f1f3ff] flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">library_add</span>
          <span>Adicionar Exercício da Biblioteca</span>
        </button>
      </section>

      {/* Barra Fixa Flutuante Inferior para Ações Rápidas */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)] border-t border-[#e9edff] z-40 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => notify('Rascunho do treino salvo com sucesso!')}
            className="flex-1 py-3 rounded-xl bg-[#f1f3ff] text-[#141b2b] font-bold text-xs hover:bg-[#e9edff] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Salvar Rascunho</span>
          </button>

          <button
            type="button"
            onClick={() => {
              notify('Treino publicado no aplicativo do aluno com sucesso!');
              setTimeout(() => onNavigate('live-treino'), 1200);
            }}
            className="flex-[1.5] py-3 rounded-xl bg-[#006b2c] text-white font-bold text-xs shadow-md hover:bg-[#00873a] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span>Publicar Treino</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODAL: EDITAR INFORMAÇÕES DO PLANO DE TREINO
          ======================================================== */}
      {isEditPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#141b2b]">
                    Editar Plano de Treino
                  </h3>
                  <p className="text-xs text-[#6e7b6c]">Altere o nome e configurações da planilha</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditPlanModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] hover:bg-[#e9edff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePlanMetadata} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                  Nome do Plano de Treino
                </label>
                <input
                  type="text"
                  required
                  value={editPlanNome}
                  onChange={(e) => setEditPlanNome(e.target.value)}
                  placeholder="Ex: Hipertrofia Feminina & Glúteo - Bloco 2"
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                    Aluno Vinculado
                  </label>
                  <select
                    value={editPlanAluno}
                    onChange={(e) => setEditPlanAluno(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                  >
                    {INITIAL_ALUNOS.map((a) => (
                      <option key={a.id} value={a.nome}>
                        {a.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                    Versão da Planilha
                  </label>
                  <input
                    type="text"
                    value={editPlanVersao}
                    onChange={(e) => setEditPlanVersao(e.target.value)}
                    placeholder="Ex: v2.4 Ativa"
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                    Duração
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="52"
                      value={editPlanDuracao}
                      onChange={(e) => setEditPlanDuracao(Number(e.target.value))}
                      className="w-full h-10 px-2.5 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                    />
                    <span className="absolute right-2 top-2.5 text-[10px] text-[#6e7b6c]">sem</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                    Frequência
                  </label>
                  <input
                    type="text"
                    value={editPlanFreq}
                    onChange={(e) => setEditPlanFreq(e.target.value)}
                    placeholder="Ex: 4x na semana"
                    className="w-full h-10 px-2.5 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                    Nível
                  </label>
                  <select
                    value={editPlanNivel}
                    onChange={(e) => setEditPlanNivel(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Atleta Pro">Atleta Pro</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditPlanModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f1f3ff] text-xs font-semibold text-[#3e4a3d] hover:bg-[#e9edff] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDITAR INSTRUÇÃO TÉCNICA DO COACH
          ======================================================== */}
      {isEditNoteModalOpen && selectedExForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl flex flex-col space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#825100] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">tips_and_updates</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#141b2b]">
                    Instrução Técnica: {selectedExForNote.nome}
                  </h3>
                  <p className="text-[11px] text-[#6e7b6c]">Orientações para execução do aluno</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditNoteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] hover:bg-[#e9edff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                  Recomendação Técnica / Postural
                </label>
                <textarea
                  rows={4}
                  required
                  value={editNoteText}
                  onChange={(e) => setEditNoteText(e.target.value)}
                  placeholder="Ex: Manter contração de 2 segundos no topo, manter escápulas retraídas..."
                  className="w-full p-3 rounded-2xl bg-[#f1f3ff] text-xs text-[#141b2b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20 resize-none font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditNoteModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f1f3ff] text-xs font-semibold text-[#3e4a3d] hover:bg-[#e9edff] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Salvar Instrução
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
