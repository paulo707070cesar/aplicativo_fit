import React, { useState, useEffect } from 'react';
import { Aluno } from '../../types';
import { ASSETS, INITIAL_ALUNOS } from '../../data/mockData';
import { LoadProgressionChart } from '../LoadProgressionChart';

interface ClientProfileViewProps {
  aluno: Aluno;
  onNavigate: (view: string) => void;
  onUpdateAluno?: (updated: Aluno) => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  aluno: initialAluno,
  onNavigate,
  onUpdateAluno,
}) => {
  const [aluno, setAluno] = useState<Aluno>(initialAluno);
  const [activeTab, setActiveTab] = useState<'geral' | 'treinos' | 'evolucao' | 'pagamentos' | 'notas'>('geral');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student Switcher
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  // Notes state
  const [coachNotesList, setCoachNotesList] = useState<string[]>([
    'Aluna com excelente adesão e controle na fase excêntrica. Manter cadência 3-0-1-0.',
    'Ajustar ingestão hídrica pós-treino (meta: 2,5L/dia).',
    'Sem queixas articulares em joelhos ou coluna lombar.',
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Edit Form Fields
  const [editNome, setEditNome] = useState(aluno.nome);
  const [editWhatsapp, setEditWhatsapp] = useState(aluno.whatsapp || '(11) 98765-4321');
  const [editFoto, setEditFoto] = useState(aluno.foto);
  const [editPlano, setEditPlano] = useState(aluno.plano);
  const [editStatus, setEditStatus] = useState<'active' | 'pending' | 'inactive'>(aluno.status);
  const [editObjetivo, setEditObjetivo] = useState(aluno.objetivo);
  const [editIdade, setEditIdade] = useState(aluno.idade);
  const [editAltura, setEditAltura] = useState(aluno.altura);
  const [editPeso, setEditPeso] = useState(aluno.peso);
  const [editMensalidade, setEditMensalidade] = useState(aluno.mensalidade);
  const [editMetaFicha, setEditMetaFicha] = useState(aluno.fichaAtiva?.meta || 'Hipertrofia & Glúteos');

  // Evaluation Form Fields
  const [evalData, setEvalData] = useState('2026-10-24');
  const [evalPeso, setEvalPeso] = useState(String(aluno.peso));
  const [evalGordura, setEvalGordura] = useState('21.2');
  const [evalNotas, setEvalNotas] = useState('Excelente progressão de tônus muscular e redução de retenção.');

  // Camera Modal State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [photoTarget, setPhotoTarget] = useState<'antes' | 'atual'>('atual');

  const startCamera = async (target: 'antes' | 'atual') => {
    setPhotoTarget(target);
    setIsCameraModalOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      showToast('Câmera ativada em modo de demonstração/simulador.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');

        const antesData = aluno.comparativoFotos?.antes || { url: ASSETS.marianaAntesImg, data: 'Antes • Fev/26', peso: '67,6 kg' };
        const atualData = aluno.comparativoFotos?.atual || { url: ASSETS.marianaAtualImg, data: 'Atual • Out/26', peso: `${aluno.peso} kg`, nota: '+ Definição' };

        const updatedComparativo = {
          antes: photoTarget === 'antes' ? { url: dataUrl, data: `Antes • ${new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`, peso: `${aluno.peso} kg` } : antesData,
          atual: photoTarget === 'atual' ? { url: dataUrl, data: `Atual • ${new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`, peso: `${aluno.peso} kg`, nota: '+ Evolução Câmera' } : atualData,
        };

        const updated = { ...aluno, comparativoFotos: updatedComparativo };
        setAluno(updated);
        if (onUpdateAluno) onUpdateAluno(updated);

        stopCamera();
        showToast(`Foto ${photoTarget.toUpperCase()} capturada e salva com sucesso!`);
        return;
      }
    }

    // Fallback if video isn't streaming
    const samplePhotos = [ASSETS.marianaAntesImg, ASSETS.marianaAtualImg, ASSETS.marianaSelfieImg];
    const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    const antesData = aluno.comparativoFotos?.antes || { url: ASSETS.marianaAntesImg, data: 'Antes • Fev/26', peso: '67,6 kg' };
    const atualData = aluno.comparativoFotos?.atual || { url: ASSETS.marianaAtualImg, data: 'Atual • Out/26', peso: `${aluno.peso} kg`, nota: '+ Definição' };

    const updatedComparativo = {
      antes: photoTarget === 'antes' ? { url: randomPhoto, data: 'Antes • Capturado', peso: `${aluno.peso} kg` } : antesData,
      atual: photoTarget === 'atual' ? { url: randomPhoto, data: 'Atual • Capturado', peso: `${aluno.peso} kg`, nota: '+ Evolução Câmera' } : atualData,
    };

    const updated = { ...aluno, comparativoFotos: updatedComparativo };
    setAluno(updated);
    if (onUpdateAluno) onUpdateAluno(updated);

    stopCamera();
    showToast(`Foto ${photoTarget.toUpperCase()} capturada via câmera com sucesso!`);
  };

  // Synchronize state when prop initialAluno changes
  useEffect(() => {
    setAluno(initialAluno);
    setEditNome(initialAluno.nome);
    setEditWhatsapp(initialAluno.whatsapp || '(11) 98765-4321');
    setEditFoto(initialAluno.foto);
    setEditPlano(initialAluno.plano);
    setEditStatus(initialAluno.status);
    setEditObjetivo(initialAluno.objetivo);
    setEditIdade(initialAluno.idade);
    setEditAltura(initialAluno.altura);
    setEditPeso(initialAluno.peso);
    setEditMensalidade(initialAluno.mensalidade);
    setEditMetaFicha(initialAluno.fichaAtiva?.meta || 'Hipertrofia & Glúteos');
    setEvalPeso(String(initialAluno.peso));
  }, [initialAluno]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCobrarMensalidadeWhatsApp = () => {
    const raw = aluno.whatsapp || '11999999999';
    const phone = raw.replace(/\D/g, '');
    const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`;
    const text = encodeURIComponent(
      `Olá ${aluno.nome}! Tudo bem? Aqui é o Carlos Rossi da FitPulse Pro.\n\n` +
      `Estou passando para lembrar da renovação da sua consultoria (${aluno.plano}) no valor de R$ ${aluno.mensalidade.toFixed(2).replace('.', ',')}.\n` +
      `Chave Pix: coach.carlos@fitpulse.com.br\n\n` +
      `Assim que efetuar o pagamento, por favor envie o comprovante por aqui. Muito obrigado e foco nos treinos!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    showToast(`Cobrança Pix direcionada ao WhatsApp de ${aluno.nome}!`);
  };

  // Open edit modal and sync current state
  const handleOpenEditModal = () => {
    setEditNome(aluno.nome);
    setEditWhatsapp(aluno.whatsapp || '');
    setEditFoto(aluno.foto);
    setEditPlano(aluno.plano);
    setEditStatus(aluno.status);
    setEditObjetivo(aluno.objetivo);
    setEditIdade(aluno.idade);
    setEditAltura(aluno.altura);
    setEditPeso(aluno.peso);
    setEditMensalidade(aluno.mensalidade);
    setEditMetaFicha(aluno.fichaAtiva?.meta || 'Hipertrofia & Glúteos');
    setIsEditModalOpen(true);
  };

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    let heightM = 1.68;
    const heightMatch = editAltura.match(/(\d+[.,]\d+)/);
    if (heightMatch) {
      heightM = parseFloat(heightMatch[1].replace(',', '.'));
    }
    const newImc = heightM > 0 ? parseFloat((editPeso / (heightM * heightM)).toFixed(1)) : aluno.imc;

    const updatedAluno: Aluno = {
      ...aluno,
      nome: editNome,
      whatsapp: editWhatsapp.trim() || aluno.whatsapp,
      foto: editFoto,
      plano: editPlano,
      status: editStatus,
      objetivo: editObjetivo,
      idade: editIdade,
      altura: editAltura,
      peso: editPeso,
      mensalidade: editMensalidade,
      imc: newImc,
      fichaAtiva: aluno.fichaAtiva
        ? {
            ...aluno.fichaAtiva,
            meta: editMetaFicha,
          }
        : undefined,
    };

    setAluno(updatedAluno);
    if (onUpdateAluno) {
      onUpdateAluno(updatedAluno);
    }

    setIsEditModalOpen(false);
    showToast(`Perfil de ${editNome} atualizado com sucesso!`);
  };

  // Save new evaluation
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const newWeightNum = parseFloat(evalPeso.replace(',', '.'));

    const updatedHist = aluno.historicoPeso ? [...aluno.historicoPeso] : [];
    const formattedDate = evalData.split('-').reverse().slice(0, 2).join(' ');
    updatedHist.push({ data: formattedDate, peso: newWeightNum });

    const newActivity = {
      tipo: 'avaliacao' as const,
      titulo: `Avaliação Física Registrada (${evalPeso} kg)`,
      tempo: 'Hoje',
      descricao: `Gordura corporal: ${evalGordura}% • ${evalNotas}`,
    };

    const updatedAluno: Aluno = {
      ...aluno,
      peso: newWeightNum,
      historicoPeso: updatedHist,
      atividadesRecentes: aluno.atividadesRecentes ? [newActivity, ...aluno.atividadesRecentes] : [newActivity],
    };

    setAluno(updatedAluno);
    if (onUpdateAluno) {
      onUpdateAluno(updatedAluno);
    }

    setIsEvalModalOpen(false);
    showToast(`Nova avaliação de ${evalPeso} kg registrada com sucesso!`);
  };

  // Add coach note
  const handleAddCoachNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    setCoachNotesList([newNoteInput.trim(), ...coachNotesList]);
    setNewNoteInput('');
    showToast('Anotação técnica adicionada com sucesso!');
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006b2c] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e9edff] flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={aluno.foto || ASSETS.marianaAvatar}
                alt={aluno.nome}
                className="w-16 h-16 rounded-full object-cover shadow-xs ring-2 ring-[#006b2c]/20"
              />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ring-2 ring-white ${
                  aluno.status === 'active'
                    ? 'bg-[#006b2c]'
                    : aluno.status === 'pending'
                    ? 'bg-[#ff9800]'
                    : 'bg-[#9e9e9e]'
                }`}
              ></span>
            </div>
            <div className="min-w-0">
              {/* Name & Quick Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowStudentMenu(!showStudentMenu)}
                  className="flex items-center gap-1 text-left cursor-pointer group"
                >
                  <h2 className="text-lg font-bold text-[#141b2b] truncate group-hover:text-[#006b2c] transition-colors">
                    {aluno.nome}
                  </h2>
                  <span className="material-symbols-outlined text-[18px] text-[#6e7b6c] group-hover:text-[#006b2c]">
                    expand_more
                  </span>
                </button>

                {showStudentMenu && (
                  <div className="absolute top-7 left-0 z-30 w-56 bg-white rounded-2xl shadow-xl border border-[#e9edff] p-1.5 animate-in fade-in-50">
                    <span className="text-[9px] font-bold text-[#6e7b6c] uppercase px-2 py-1 block">
                      Alternar Aluno:
                    </span>
                    {INITIAL_ALUNOS.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setAluno(a);
                          if (onUpdateAluno) onUpdateAluno(a);
                          setShowStudentMenu(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          aluno.id === a.id
                            ? 'bg-[#e9edff] text-[#006b2c] font-bold'
                            : 'hover:bg-[#f1f3ff] text-[#141b2b]'
                        }`}
                      >
                        <img src={a.foto} alt={a.nome} className="w-6 h-6 rounded-full object-cover" />
                        <span className="truncate">{a.nome}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 bg-[#7ffc97]/30 text-[#006b2c] px-2.5 py-0.5 rounded-full mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c] animate-pulse"></span>
                <span className="text-[10px] font-bold">
                  {aluno.status === 'active' ? 'Cliente Ativo' : aluno.status === 'pending' ? 'Cliente Pendente' : 'Inativo'} • {aluno.plano}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* BOTÃO CONSULTORIA IA */}
            <button
              onClick={() => onNavigate('ai-hub')}
              className="w-10 h-10 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer shadow-xs"
              title="Consultar Assistente de IA para este Aluno"
              aria-label="Assistente IA"
            >
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </button>

            {/* BOTÃO COBRAR VIA WHATSAPP */}
            <button
              onClick={handleCobrarMensalidadeWhatsApp}
              className="w-10 h-10 rounded-xl bg-[#006b2c]/10 hover:bg-[#006b2c]/20 text-[#006b2c] flex items-center justify-center transition-colors active:scale-95 cursor-pointer shadow-xs"
              title={`Cobrar mensalidade via WhatsApp (${aluno.whatsapp || 'sem número cadastrado'})`}
              aria-label="Cobrar via WhatsApp"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
            </button>

            {/* BOTÃO EDITAR PERFIL COM AÇÃO COMPLETA */}
            <button
              onClick={handleOpenEditModal}
              className="w-10 h-10 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] flex items-center justify-center transition-colors active:scale-95 cursor-pointer shadow-xs"
              title="Editar Perfil do Aluno"
              aria-label="Editar Perfil"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>
        </div>

        {/* Biometric Pills Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {aluno.whatsapp && (
            <button
              type="button"
              onClick={handleCobrarMensalidadeWhatsApp}
              className="shrink-0 bg-[#7ffc97]/30 hover:bg-[#7ffc97]/50 text-[#006b2c] px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Clique para cobrar via WhatsApp"
            >
              <span className="material-symbols-outlined text-[13px]">chat</span>
              <span>{aluno.whatsapp}</span>
            </button>
          )}
          <span className="shrink-0 bg-[#f1f3ff] px-2.5 py-1 rounded-full text-[11px] font-medium text-[#3e4a3d]">
            {aluno.idade} anos
          </span>
          <span className="shrink-0 bg-[#f1f3ff] px-2.5 py-1 rounded-full text-[11px] font-medium text-[#3e4a3d]">
            {aluno.altura}
          </span>
          <span className="shrink-0 bg-[#f1f3ff] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#141b2b]">
            {aluno.peso} kg
          </span>
          <span className="shrink-0 bg-[#f1f3ff] px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#006b2c] flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">flag</span>
            {aluno.objetivo}
          </span>
          <span className="shrink-0 bg-[#f1f3ff] px-2.5 py-1 rounded-full text-[11px] font-medium text-[#3e4a3d]">
            Desde Fev/2026
          </span>
        </div>
      </section>

      {/* Segmented Tabs Navigation */}
      <nav className="bg-[#e9edff] rounded-xl p-1 flex items-center overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('geral')}
          className={`flex-1 min-w-[90px] py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            activeTab === 'geral' ? 'bg-white text-[#141b2b] shadow-xs font-bold' : 'text-[#6e7b6c] hover:text-[#141b2b]'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('treinos')}
          className={`flex-1 min-w-[80px] py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            activeTab === 'treinos' ? 'bg-white text-[#141b2b] shadow-xs font-bold' : 'text-[#6e7b6c] hover:text-[#141b2b]'
          }`}
        >
          Treinos
        </button>
        <button
          onClick={() => setActiveTab('evolucao')}
          className={`flex-1 min-w-[100px] py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            activeTab === 'evolucao' ? 'bg-white text-[#141b2b] shadow-xs font-bold' : 'text-[#6e7b6c] hover:text-[#141b2b]'
          }`}
        >
          Evolução/Fotos
        </button>
        <button
          onClick={() => setActiveTab('pagamentos')}
          className={`flex-1 min-w-[90px] py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            activeTab === 'pagamentos' ? 'bg-white text-[#141b2b] shadow-xs font-bold' : 'text-[#6e7b6c] hover:text-[#141b2b]'
          }`}
        >
          Pagamentos
        </button>
        <button
          onClick={() => setActiveTab('notas')}
          className={`flex-1 min-w-[70px] py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            activeTab === 'notas' ? 'bg-white text-[#141b2b] shadow-xs font-bold' : 'text-[#6e7b6c] hover:text-[#141b2b]'
          }`}
        >
          Notas
        </button>
      </nav>

      {/* ========================================================
          TAB 1: VISÃO GERAL
          ======================================================== */}
      {activeTab === 'geral' && (
        <div className="flex flex-col gap-3">
          {/* 2x2 Metric Cards Grid */}
          <section className="grid grid-cols-2 gap-2.5">
            {/* Peso Atual */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e9edff] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6e7b6c]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Peso Atual</span>
                <span className="material-symbols-outlined text-[18px]">scale</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-[#141b2b] tracking-tight">
                  {aluno.peso} <span className="text-xs font-normal text-[#6e7b6c]">kg</span>
                </span>
              </div>
              <div className="mt-2 inline-flex items-center gap-0.5 bg-[#7ffc97] text-[#002109] px-2 py-0.5 rounded-full w-fit">
                <span className="material-symbols-outlined text-[13px]">trending_down</span>
                <span className="text-[10px] font-bold">-4,2 kg total</span>
              </div>
            </div>

            {/* IMC Atual */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e9edff] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6e7b6c]">
                <span className="text-[10px] font-bold uppercase tracking-wider">IMC Atual</span>
                <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-[#141b2b] tracking-tight">{aluno.imc}</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 bg-[#e9edff] text-[#006b2c] px-2 py-0.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c]"></span>
                <span className="text-[10px] font-bold">Faixa Normal</span>
              </div>
            </div>

            {/* Adesão Mês */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e9edff] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6e7b6c]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Adesão Mês</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-[#141b2b] tracking-tight">{aluno.adesao}%</span>
              </div>
              <div className="mt-2">
                <span className="text-[11px] text-[#3e4a3d]">{aluno.treinosRealizados} de {aluno.treinosTotal} treinos feitos</span>
              </div>
            </div>

            {/* Volume Carga */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e9edff] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6e7b6c]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Volume Carga</span>
                <span className="material-symbols-outlined text-[18px]">fitness_center</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-[#141b2b] tracking-tight">
                  {aluno.volumeCargaKg.toLocaleString('pt-BR')} <span className="text-xs font-normal text-[#6e7b6c]">kg</span>
                </span>
              </div>
              <div className="mt-2 inline-flex items-center gap-0.5 bg-[#7ffc97] text-[#002109] px-2 py-0.5 rounded-full w-fit">
                <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
                <span className="text-[10px] font-bold">+8% este ciclo</span>
              </div>
            </div>
          </section>

          {/* Evolução do Peso (SVG Chart) */}
          <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e9edff] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-[#141b2b]">Evolução do Peso</h3>
                <p className="text-xs text-[#6e7b6c]">Últimos meses • Queda progressiva consistente</p>
              </div>
              <span className="text-[11px] font-semibold bg-[#e9edff] px-2.5 py-0.5 rounded-full text-[#3e4a3d]">
                Jul - Out
              </span>
            </div>

            {/* SVG Sparkline Curve Chart */}
            <div className="w-full h-36 relative mt-1">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 340 120">
                <defs>
                  <linearGradient id="weightGradProfile" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#006b2c" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#006b2c" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line stroke="#e9edff" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="340" y1="20" y2="20" />
                <line stroke="#e9edff" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="340" y1="60" y2="60" />
                <line stroke="#e9edff" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="340" y1="100" y2="100" />

                <polygon fill="url(#weightGradProfile)" points="10,25 100,48 200,72 320,102 320,118 10,118" />
                <path
                  d="M 10,25 C 60,35 70,45 100,48 C 140,52 160,68 200,72 C 240,76 280,95 320,102"
                  fill="none"
                  stroke="#006b2c"
                  strokeLinecap="round"
                  strokeWidth="3"
                />

                <circle cx="10" cy="25" fill="#f9f9ff" r="4.5" stroke="#006b2c" strokeWidth="2.5" />
                <circle cx="100" cy="48" fill="#f9f9ff" r="4.5" stroke="#006b2c" strokeWidth="2.5" />
                <circle cx="200" cy="72" fill="#f9f9ff" r="4.5" stroke="#006b2c" strokeWidth="2.5" />
                <circle cx="320" cy="102" fill="#006b2c" r="5" stroke="#f9f9ff" strokeWidth="2" />
              </svg>

              <div className="absolute right-0 bottom-2 bg-[#006b2c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <span>{aluno.peso} kg</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6e7b6c] pt-2 border-t border-[#f1f3ff]">
              <div className="text-left">
                <span className="block font-bold text-[#141b2b]">67,6 kg</span>
                <span>15 Jul</span>
              </div>
              <div className="text-center">
                <span className="block font-medium">66,1 kg</span>
                <span>15 Ago</span>
              </div>
              <div className="text-center">
                <span className="block font-medium">64,8 kg</span>
                <span>15 Set</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-[#006b2c]">{aluno.peso} kg</span>
                <span>Hoje</span>
              </div>
            </div>
          </section>

          {/* Gráfico Recharts de Evolução de Carga & Ganho de Força */}
          <LoadProgressionChart alunoNome={aluno.nome} />

          {/* Comparativo Visual Antes / Atual */}
          <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e9edff] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#141b2b]">Comparativo Visual</h3>
                <p className="text-xs text-[#6e7b6c]">Avaliação de postura e tônus muscular</p>
              </div>
              <button
                onClick={() => setActiveTab('evolucao')}
                className="text-xs font-bold text-[#006b2c] hover:underline cursor-pointer"
              >
                Ver Galeria
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-1">
              {/* Antes */}
              <div className="flex flex-col gap-1.5">
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#e9edff] shadow-xs">
                  <img
                    src={aluno.comparativoFotos?.antes.url || ASSETS.marianaAntesImg}
                    alt="Antes"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#293040]/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {aluno.comparativoFotos?.antes.data || 'Antes • Fev 2026'}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-[#141b2b] px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {aluno.comparativoFotos?.antes.peso || '67,6 kg'}
                  </div>
                </div>
                <span className="text-[11px] text-[#6e7b6c] text-center font-medium">Início do Programa</span>
              </div>

              {/* Atual */}
              <div className="flex flex-col gap-1.5">
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#e9edff] shadow-xs">
                  <img
                    src={aluno.comparativoFotos?.atual.url || ASSETS.marianaAtualImg}
                    alt="Atual"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#006b2c] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {aluno.comparativoFotos?.atual.data || 'Atual • Out 2026'}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-[#006b2c] px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {aluno.peso} kg (-4,2kg)
                  </div>
                </div>
                <span className="text-[11px] text-[#006b2c] font-bold text-center">
                  {aluno.comparativoFotos?.atual.nota || '+ Definição Abdominal'}
                </span>
              </div>
            </div>
          </section>

          {/* Ficha Ativa */}
          <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e9edff] flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#7ffc97] flex items-center justify-center text-[#002109] shrink-0 font-bold">
                  <span className="material-symbols-outlined text-[22px]">fitness_center</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-[#00873a] text-white px-2 py-0.5 rounded-full">
                      EM ANDAMENTO
                    </span>
                    <span className="text-[11px] text-[#6e7b6c]">{aluno.fichaAtiva?.frequencia || '4x por semana'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#141b2b] mt-0.5">
                    {aluno.fichaAtiva?.nome || 'Ficha B - Membros Inferiores & Glúteo'}
                  </h4>
                </div>
              </div>
            </div>

            <div className="bg-[#f1f3ff] rounded-xl p-2.5 flex items-center justify-between text-xs text-[#3e4a3d]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006b2c]">replay</span>
                <span>{aluno.fichaAtiva?.exerciciosCount || 8} exercícios cadastrados</span>
              </div>
              <div className="text-[11px] font-semibold text-[#006b2c]">
                Meta: {aluno.fichaAtiva?.meta || 'Hipertrofia & Glúteos'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onNavigate('novo-treino')}
                className="w-full h-10 bg-[#e9edff] hover:bg-[#dce2f7] text-[#141b2b] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">tune</span>
                Editar Ficha
              </button>
              <button
                onClick={() => onNavigate('live-treino')}
                className="w-full h-10 bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                Iniciar Treino
              </button>
            </div>
          </section>

          {/* Atividades Recentes Timeline */}
          <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e9edff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#141b2b]">Atividades Recentes</h3>
              <span className="text-xs text-[#6e7b6c] font-semibold">Timeline</span>
            </div>

            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#e9edff]"></div>

              {aluno.atividadesRecentes?.map((ativ, idx) => (
                <div key={idx} className="relative flex items-start gap-2.5">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                      ativ.tipo === 'treino'
                        ? 'bg-[#7ffc97]'
                        : ativ.tipo === 'pagamento'
                        ? 'bg-[#e9edff]'
                        : 'bg-[#ffddb8]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[12px] ${
                        ativ.tipo === 'treino'
                          ? 'text-[#006b2c]'
                          : ativ.tipo === 'pagamento'
                          ? 'text-[#0058be]'
                          : 'text-[#825100]'
                      }`}
                    >
                      {ativ.tipo === 'treino' ? 'check' : ativ.tipo === 'pagamento' ? 'payments' : 'straighten'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#141b2b]">{ativ.titulo}</span>
                      <span className="text-[10px] font-bold text-[#006b2c]">{ativ.tempo}</span>
                    </div>
                    <p className="text-[11px] text-[#3e4a3d] mt-0.5">{ativ.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Floating Call-To-Action Button */}
          <div className="pt-2">
            <button
              onClick={() => setIsEvalModalOpen(true)}
              className="w-full h-12 bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Adicionar Avaliação / Registro</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: TREINOS E FICHAS
          ======================================================== */}
      {activeTab === 'treinos' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">Fichas Ativas & Divisões</h3>
              <p className="text-xs text-[#6e7b6c]">Prescrição atualizada para {aluno.nome}</p>
            </div>
            <button
              onClick={() => onNavigate('novo-treino')}
              className="px-3 py-1.5 bg-[#006b2c] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Novo Bloco</span>
            </button>
          </div>

          {/* Ficha A */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#006b2c] uppercase bg-[#7ffc97]/40 px-2 py-0.5 rounded-full">
                  Treino A • Segunda
                </span>
                <h4 className="text-sm font-bold text-[#141b2b] mt-1">Inferiores & Foco Quads</h4>
              </div>
              <button
                onClick={() => onNavigate('live-treino')}
                className="px-3 py-1.5 rounded-xl bg-[#006b2c] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">play_circle</span>
                Iniciar
              </button>
            </div>
            <div className="text-xs text-[#3e4a3d] space-y-1 bg-[#f1f3ff] p-3 rounded-xl">
              <div className="flex justify-between font-semibold">
                <span>1. Agachamento Livre com Barra</span>
                <span className="text-[#006b2c]">4x 10-15 (50kg)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>2. Leg Press 45º</span>
                <span className="text-[#006b2c]">3x 12 (140kg)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>3. Cadeira Extensora (Drop-set)</span>
                <span className="text-[#006b2c]">3x 12+8+falha</span>
              </div>
            </div>
          </div>

          {/* Ficha B */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#0058be] uppercase bg-[#d8e2ff] px-2 py-0.5 rounded-full">
                  Treino B • Terça
                </span>
                <h4 className="text-sm font-bold text-[#141b2b] mt-1">Superiores & Costas</h4>
              </div>
              <button
                onClick={() => onNavigate('live-treino')}
                className="px-3 py-1.5 rounded-xl bg-[#0058be] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">play_circle</span>
                Iniciar
              </button>
            </div>
            <div className="text-xs text-[#3e4a3d] space-y-1 bg-[#f1f3ff] p-3 rounded-xl">
              <div className="flex justify-between font-semibold">
                <span>1. Puxada Aberta no Pulley</span>
                <span className="text-[#0058be]">4x 10 (45kg)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>2. Remada Curvada com Halteres</span>
                <span className="text-[#0058be]">3x 12 (16kg/lado)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>3. Desenvolvimento com Halteres</span>
                <span className="text-[#0058be]">3x 10 (12kg/lado)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: EVOLUÇÃO E FOTOS (ANTES & DEPOIS)
          ======================================================== */}
      {activeTab === 'evolucao' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">Evolução Visual • Antes & Depois</h3>
              <p className="text-xs text-[#6e7b6c]">Comparativo lado a lado e captura por câmera em tempo real</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => startCamera('antes')}
                className="flex-1 sm:flex-none px-3 py-2 bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>Tirar Foto "Antes"</span>
              </button>
              <button
                type="button"
                onClick={() => startCamera('atual')}
                className="flex-1 sm:flex-none px-3 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>Tirar Foto "Atual"</span>
              </button>
            </div>
          </div>

          {/* Grid de Fotos de Postura (Antes & Depois Lado a Lado) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#293040] text-white px-2 py-0.5 rounded-md">
                  ANTES (Início)
                </span>
                <button
                  type="button"
                  onClick={() => startCamera('antes')}
                  className="text-[11px] text-[#006b2c] font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                  Câmera
                </button>
              </div>
              <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#e9edff] shadow-inner">
                <img
                  src={aluno.comparativoFotos?.antes.url || ASSETS.marianaAntesImg}
                  alt="Foto Antes"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-[#141b2b] px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs">
                  {aluno.comparativoFotos?.antes.data || 'Antes • Fev/26'} • {aluno.comparativoFotos?.antes.peso || '67,6 kg'}
                </div>
              </div>
              <span className="text-[11px] text-[#6e7b6c] text-center font-medium">Postura Inicial de Avaliação</span>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-xs border border-[#e9edff] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#006b2c] text-white px-2 py-0.5 rounded-md">
                  DEPOIS (Atual)
                </span>
                <button
                  type="button"
                  onClick={() => startCamera('atual')}
                  className="text-[11px] text-[#006b2c] font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                  Câmera
                </button>
              </div>
              <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#e9edff] shadow-inner">
                <img
                  src={aluno.comparativoFotos?.atual.url || ASSETS.marianaAtualImg}
                  alt="Foto Depois"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-[#006b2c] px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs">
                  {aluno.comparativoFotos?.atual.data || 'Atual • Out/26'} • {aluno.peso} kg
                </div>
              </div>
              <span className="text-[11px] text-[#006b2c] text-center font-bold">
                {aluno.comparativoFotos?.atual.nota || '+ Definição Abdominal'}
              </span>
            </div>
          </div>

          {/* Tabela de Medidas de Circunferência */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] space-y-2">
            <h4 className="text-sm font-bold text-[#141b2b]">Perimetria (cm)</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#f1f3ff] p-2.5 rounded-xl">
                <span className="text-[10px] text-[#6e7b6c] block">Cintura</span>
                <strong className="text-sm text-[#006b2c]">66 cm</strong>
                <span className="text-[9px] text-[#006b2c] block font-bold">-4 cm</span>
              </div>
              <div className="bg-[#f1f3ff] p-2.5 rounded-xl">
                <span className="text-[10px] text-[#6e7b6c] block">Quadril</span>
                <strong className="text-sm text-[#006b2c]">98 cm</strong>
                <span className="text-[9px] text-[#006b2c] block font-bold">+2 cm (tônus)</span>
              </div>
              <div className="bg-[#f1f3ff] p-2.5 rounded-xl">
                <span className="text-[10px] text-[#6e7b6c] block">Coxa</span>
                <strong className="text-sm text-[#006b2c]">58 cm</strong>
                <span className="text-[9px] text-[#006b2c] block font-bold">+1,5 cm</span>
              </div>
            </div>
          </div>

          {/* Gráfico Recharts de Evolução de Carga & Ganho de Força */}
          <LoadProgressionChart alunoNome={aluno.nome} />
        </div>
      )}

      {/* ========================================================
          TAB 4: PAGAMENTOS
          ======================================================== */}
      {activeTab === 'pagamentos' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">Financeiro do Aluno</h3>
              <p className="text-xs text-[#6e7b6c]">Plano: {aluno.plano} • R$ {aluno.mensalidade}/mês</p>
            </div>
            <button
              onClick={handleCobrarMensalidadeWhatsApp}
              className="px-3.5 py-1.5 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              title={`Enviar cobrança no WhatsApp (${aluno.whatsapp || 'sem número'})`}
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Cobrar via WhatsApp</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e7b6c]">Histórico Recente</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#f1f3ff] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#141b2b]">Mensalidade Outubro 2026</span>
                  <p className="text-[11px] text-[#6e7b6c]">Pago em 15/10 às 09:24 via Pix</p>
                </div>
                <div className="text-right">
                  <strong className="text-sm text-[#006b2c]">R$ {aluno.mensalidade},00</strong>
                  <span className="block text-[10px] text-[#006b2c] font-bold">Confirmado</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f1f3ff] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#141b2b]">Mensalidade Setembro 2026</span>
                  <p className="text-[11px] text-[#6e7b6c]">Pago em 14/09 via Pix</p>
                </div>
                <div className="text-right">
                  <strong className="text-sm text-[#006b2c]">R$ {aluno.mensalidade},00</strong>
                  <span className="block text-[10px] text-[#006b2c] font-bold">Confirmado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: NOTAS DO COACH
          ======================================================== */}
      {activeTab === 'notas' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e9edff]">
            <h3 className="text-base font-bold text-[#141b2b]">Anotações Técnicas & Anamnese</h3>
            <p className="text-xs text-[#6e7b6c]">Observações restritas do Coach Carlos</p>

            <form onSubmit={handleAddCoachNote} className="mt-3 space-y-2">
              <textarea
                rows={2}
                placeholder="Adicionar nova observação sobre o aluno..."
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#f1f3ff] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20 resize-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#006b2c] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer hover:bg-[#00873a]"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Salvar Nota</span>
              </button>
            </form>
          </div>

          <div className="space-y-2">
            {coachNotesList.map((note, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e9edff] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#825100] mt-0.5">
                  sticky_note_2
                </span>
                <p className="text-xs text-[#3e4a3d] flex-1 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL INTERATIVO: EDITAR PERFIL DO ALUNO
          ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-50 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#141b2b]">Editar Perfil do Aluno</h3>
                  <p className="text-[11px] text-[#6e7b6c]">Atualize dados cadastrais, plano e biometria</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] hover:bg-[#e9edff] flex items-center justify-center text-[#3e4a3d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {/* Nome */}
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                />
              </div>

              {/* WhatsApp para Cobrança */}
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
                    placeholder="Ex: (11) 98765-4321"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20"
                  />
                </div>
                <span className="text-[10px] text-[#6e7b6c] mt-0.5 block">
                  Número oficial para envio de link de cobrança Pix e mensagens
                </span>
              </div>

              {/* Status e Plano */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Status do Aluno</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold focus:outline-none"
                  >
                    <option value="active">Ativo (Em dia)</option>
                    <option value="pending">Pendente (Cobrança/Avaliação)</option>
                    <option value="inactive">Inativo / Pausado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Plano Atual</label>
                  <select
                    value={editPlano}
                    onChange={(e) => setEditPlano(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold focus:outline-none"
                  >
                    <option value="Premium Trimestral">Premium Trimestral</option>
                    <option value="Premium Semestral">Premium Semestral</option>
                    <option value="Personal Híbrido">Personal Híbrido</option>
                    <option value="Consultoria Online">Consultoria Online</option>
                    <option value="Mensal Presencial">Mensal Presencial</option>
                  </select>
                </div>
              </div>

              {/* Objetivo Principal */}
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Objetivo de Treino</label>
                <input
                  type="text"
                  value={editObjetivo}
                  onChange={(e) => setEditObjetivo(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-medium focus:bg-white focus:outline-none"
                />
              </div>

              {/* Biometria (Idade, Altura, Peso) */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Idade (anos)</label>
                  <input
                    type="number"
                    value={editIdade}
                    onChange={(e) => setEditIdade(parseInt(e.target.value) || 0)}
                    className="w-full h-10 px-3 text-center rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-bold focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Altura (m)</label>
                  <input
                    type="text"
                    value={editAltura}
                    onChange={(e) => setEditAltura(e.target.value)}
                    className="w-full h-10 px-3 text-center rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-bold focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Peso Atual (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editPeso}
                    onChange={(e) => setEditPeso(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 text-center rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-bold text-[#006b2c] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Mensalidade e Meta da Ficha */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Mensalidade (R$)</label>
                  <input
                    type="number"
                    value={editMensalidade}
                    onChange={(e) => setEditMensalidade(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-bold focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Meta da Ficha Ativa</label>
                  <input
                    type="text"
                    value={editMetaFicha}
                    onChange={(e) => setEditMetaFicha(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-semibold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Foto de Perfil URL */}
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">URL da Foto de Perfil</label>
                <div className="flex items-center gap-2">
                  <img
                    src={editFoto || ASSETS.marianaAvatar}
                    alt="Preview"
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#e9edff]"
                  />
                  <input
                    type="text"
                    value={editFoto}
                    onChange={(e) => setEditFoto(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl bg-[#f1f3ff] text-[#141b2b] text-xs font-mono focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#e9edff] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-[#f1f3ff] text-[#141b2b] font-bold text-xs hover:bg-[#e9edff] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#006b2c] text-white font-bold text-xs hover:bg-[#00873a] shadow-sm cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL INTERATIVO: ADICIONAR AVALIAÇÃO / REGISTRO
          ======================================================== */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl flex flex-col space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">straighten</span>
                </div>
                <h3 className="text-base font-bold text-[#141b2b]">Nova Avaliação Física</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEvalModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Data</label>
                  <input
                    type="date"
                    value={evalData}
                    onChange={(e) => setEvalData(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Peso Atual (kg)</label>
                  <input
                    type="text"
                    required
                    value={evalPeso}
                    onChange={(e) => setEvalPeso(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#006b2c] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">% Gordura Corporal</label>
                <input
                  type="text"
                  value={evalGordura}
                  onChange={(e) => setEvalGordura(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Observações Técnicas</label>
                <textarea
                  rows={2}
                  value={evalNotas}
                  onChange={(e) => setEvalNotas(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#f1f3ff] text-xs focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEvalModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f1f3ff] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#006b2c] text-white font-bold text-xs hover:bg-[#00873a] cursor-pointer"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CAPTURAR FOTO VIA CÂMERA DO DISPOSITIVO
          ======================================================== */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#141b2b]">
                    Capturar Foto ({photoTarget === 'antes' ? 'Antes / Inicial' : 'Depois / Atual'})
                  </h3>
                  <p className="text-xs text-[#6e7b6c]">Posicione o aluno no enquadramento</p>
                </div>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] hover:bg-[#e9edff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Video Preview */}
            <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/40 pointer-events-none rounded-2xl m-3"></div>
              <span className="absolute bottom-3 bg-black/60 text-white text-[11px] px-3 py-1 rounded-full font-mono">
                Câmera Ativa • HD
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={stopCamera}
                className="flex-1 h-11 rounded-xl bg-[#f1f3ff] text-xs font-semibold text-[#3e4a3d] hover:bg-[#e9edff] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-[1.5] h-11 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
                <span>Tirar Foto Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
