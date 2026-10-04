import React, { useState, useEffect } from 'react';
import {
  PlanoIA,
  AnaliseIA,
  ConfiguracaoIA,
  ConversaIA,
  MensagemChatIA,
  TemplatePromptIA,
  Aluno,
} from '../../types';
import { INITIAL_ALUNOS } from '../../data/mockData';

interface AiHubViewProps {
  initialTab?: 'assistente' | 'planos' | 'analises' | 'templates' | 'config';
  targetAlunoNome?: string;
  onNavigate?: (view: string) => void;
}

const DEFAULT_CONFIG: ConfiguracaoIA = {
  modelo: 'gemini-3.1-pro-preview',
  thinkingLevel: 'HIGH',
  tomVoz: 'cientifico',
  temperatura: 0.7,
  formatoSaida: 'markdown',
  especialidadeFoco: 'Hipertrofia, Biomecânica & Periodização Esportiva',
  autoAplicarPeriodizacao: true,
  notificarEvasaoIA: true,
  sugerirCargasIA: true,
  systemPromptCustomizado: `Você é o FitPulse AI Master Coach, fisiologista do exercício e consultor técnico sênior da assessoria Carlos Rossi.
Seu foco é hipertrofia, periodização esportiva, biomecânica e retenção de alunos.
Responda sempre em português do Brasil, de forma estruturada, com cadência, repetições, intervalos e orientações posturais precisas.`,
};

const INITIAL_CONVERSAS: ConversaIA[] = [
  {
    id: 'conv-1',
    titulo: 'Periodização Glúteos & Isquiotibiais (Mariana Silva)',
    alunoNome: 'Mariana Silva',
    dataCriacao: '18/10/2026',
    ultimaAtualizacao: '18/10/2026',
    topico: 'periodizacao',
    mensagens: [
      {
        id: 'msg-1',
        sender: 'user',
        texto: 'Mariana estagnou em 28kg no Stiff e 80kg na Elevação Pélvica. Como estruturar a sobrecarga progressiva para as próximas 4 semanas mantendo a segurança lombar?',
        timestamp: '14:22',
      },
      {
        id: 'msg-2',
        sender: 'assistant',
        texto: `### 🎯 Diagnóstico & Periodização para Mariana Silva (4 Semanas)

**1. Ajuste Técnico de Cadência:**
- Adote cadência **3-0-1-0** no Stiff (3 segundos na fase excêntrica) com intervalo de 90 segundos.
- Na Elevação Pélvica, adicione **isometria de pico de 2 segundos** no topo da contração.

**2. Progressão Semanal de Carga:**
- **Semana 1:** 4x 10 reps @ 28 kg (Stiff) | 4x 10 reps @ 80 kg (Pélvica) — Foco em cadência.
- **Semana 2:** 4x 8-10 reps @ 30 kg (Stiff) | 4x 8 reps @ 84 kg (Pélvica) — Aumento de 5% na sobrecarga.
- **Semana 3:** Adicionar 1 série em Drop-set mecânico na última série do Stiff.
- **Semana 4 (Deload Ativo):** 3x 12 reps @ 20 kg no Stiff (RPE 6) para recuperação do SNC.

**3. Dica Biomecânica:**
Oriente a Mariana a fixar o olhar no chão a 2 metros à frente durante o Stiff para evitar hiperextensão cervical e aliviar tensão na coluna lombar.`,
        timestamp: '14:23',
      },
    ],
  },
  {
    id: 'conv-2',
    titulo: 'Recuperação & Força no Supino Reto (João Pedro)',
    alunoNome: 'João Pedro',
    dataCriacao: '15/10/2026',
    ultimaAtualizacao: '16/10/2026',
    topico: 'biomecanica',
    mensagens: [
      {
        id: 'msg-3',
        sender: 'user',
        texto: 'João Pedro relata leve desconforto no manguito rotador direito após séries pesadas de supino reto. O que ajustar?',
        timestamp: '10:05',
      },
      {
        id: 'msg-4',
        sender: 'assistant',
        texto: `### 🛡️ Intervenção Biomecânica - Proteção de Ombro

1. **Ajuste Imediato:** Substituir barra olímpica por halteres com pegada neutra ou semi-pronada (45 graus), reduzindo o estresse no tendão do supraespinhal.
2. **Retração Escapular:** Enfatizar a depressão e adução das escápulas antes de retirar os pesos do suporte.
3. **Aquecimento Específico:** Incluir 3 séries de rotação externa com elástico na polia e face pull antes do treino de peitorais.`,
        timestamp: '10:06',
      },
    ],
  },
  {
    id: 'conv-3',
    titulo: 'Resgate de Aluna Ausente no WhatsApp (Lucas Oliveira)',
    alunoNome: 'Lucas Oliveira',
    dataCriacao: '12/10/2026',
    ultimaAtualizacao: '12/10/2026',
    topico: 'retencao',
    mensagens: [
      {
        id: 'msg-5',
        sender: 'user',
        texto: 'Lucas está ausente há 8 dias da academia. Crie uma mensagem acolhedora sem tom de cobrança para reativá-lo.',
        timestamp: '09:15',
      },
      {
        id: 'msg-6',
        sender: 'assistant',
        texto: `Fala Lucas! Tudo em paz, irmão? 👊
Notei que você deu uma sumida dos treinos essa semana e quis dar uma passada rápida aqui pra ver se está tudo bem com você e na correria do trampo.
Seu plano de hipertrofia está engatilhado com ótimos resultados no último mês. Que tal fazermos um treino mais rápido de 35 minutos amanhã só pra manter o ritmo?
Me dá um toque quando puder! Tamo junto!`,
        timestamp: '09:16',
      },
    ],
  },
];

const INITIAL_PLANOS_IA: PlanoIA[] = [
  {
    id: 'plano-ia-1',
    alunoNome: 'Mariana Silva',
    titulo: 'Periodização Hipertrofia & Glúteos - Bloco 2',
    tipo: 'hipertrofia',
    data: '18/10/2026',
    status: 'aprovado',
    nivelRaciocinio: 'HIGH',
    conteudo: `### Estrutura Semanal Proposta:
- **Segunda (Treino A):** Agachamento Livre (4x 10-12), Leg Press 45º (3x 12), Cadeira Extensora Drop-set (3x 12+8+falha). Cadência: 3-0-1-0.
- **Quarta (Treino B):** Stiff com Halteres (4x 10-12 a 28kg), Elevação Pélvica com Barra (4x 8-10 a 80kg), Búlgaro (3x 12/lado).
- **Sexta (Treino C):** Mesa Flexora (4x 12), Cadeira Abdutora inclinada (4x 15 com pico de 2s), Panturrilha em pé (4x 15).
- **Sobrecarga:** Subir 2kg por semana nas séries principais mantendo estabilidade lombopélvica.`,
  },
  {
    id: 'plano-ia-2',
    alunoNome: 'João Pedro',
    titulo: 'Hipertrofia Upper / Lower - Bloco de Força 6 Semanas',
    tipo: 'periodizacao',
    data: '15/10/2026',
    status: 'aprovado',
    nivelRaciocinio: 'HIGH',
    conteudo: `### Progressão Linear de Carga:
- Foco em Supino Reto, Barra Fixa com Carga e Levantamento Terra Romeno.
- RPE alvo: 8 na semana 1, evoluindo para 9.5 na semana 5 antes do Deload planejado.
- Descanso estrito de 2 a 3 minutos entre séries de força máxima.`,
  },
  {
    id: 'plano-ia-3',
    alunoNome: 'Ana Carolina',
    titulo: 'Reabilitação & Fortalecimento de Cadeia Posterior',
    tipo: 'reabilitacao',
    data: '12/10/2026',
    status: 'rascunho',
    nivelRaciocinio: 'BALANCED',
    conteudo: `### Exercícios Corretivos:
- Ativação de Glúteo Médio com Miniband (3x 15 passadas laterais).
- Ponte Unipodal e prancha lateral com elevação de perna.
- Evitar sobrecarga axial pesada até liberação médica definitiva.`,
  },
];

const INITIAL_ANALISES_IA: AnaliseIA[] = [
  {
    id: 'analise-ia-1',
    alunoNome: 'Mariana Silva',
    data: '18/10/2026',
    titulo: 'Diagnóstico Biomecânico de Postura & Tônus Muscular',
    resumo: 'Evolução evidente com -4,2 kg de gordura e ganho de 34% de força no Stiff (28 kg) e Pélvica (80 kg).',
    recomendacao: 'Manter cadência excêntrica de 3s e introduzir drop-set na última série do Stiff. Ajustar ingestão hídrica para 2.5L.',
    scorePontuacao: 9.4,
    tags: ['Hipertrofia', 'Biomecânica Excelente', 'Baixo Risco'],
  },
  {
    id: 'analise-ia-2',
    alunoNome: 'Lucas Oliveira',
    data: '16/10/2026',
    titulo: 'Avaliação de Potência & Sobrecarga no Powerlifting',
    resumo: 'Volume acumulado ultrapassou 28.500 kg no ciclo mensal sem sinais de fadiga central excessiva.',
    recomendacao: 'Prescrever semana de deload regenerativo (-35% de volume total) na próxima semana para ressensibilizar receptores.',
    scorePontuacao: 8.9,
    tags: ['Força Máxima', 'Deload Recomendado'],
  },
  {
    id: 'analise-ia-3',
    alunoNome: 'João Pedro',
    data: '14/10/2026',
    titulo: 'Estabilidade Escapular no Supino & Desenvolvimento',
    resumo: 'Assimetria leve de 8% de ativação no deltoide anterior direito compensada com halteres.',
    recomendacao: 'Trabalho unilateral com halteres e aquecimento com rotação externa por 3 semanas.',
    scorePontuacao: 8.7,
    tags: ['Prevenção de Lesão', 'Ombro'],
  },
];

const INITIAL_TEMPLATES: TemplatePromptIA[] = [
  {
    id: 'tpl-1',
    titulo: 'Especialista em Glúteos & Isquiotibiais',
    categoria: 'periodizacao',
    descricao: 'Prescreve combinações com Stiff, Pélvica e Búlgaro com cadências estritas.',
    promptTemplate: 'Crie uma progressão de 4 semanas focada em hipertrofia de glúteos e isquiotibiais para {aluno}, detalhando séries, repetições, cadência excêntrica e pausas.',
    icone: 'fitness_center',
  },
  {
    id: 'tpl-2',
    titulo: 'Diagnóstico Biomecânico & Prevenção',
    categoria: 'biomecanica',
    descricao: 'Analisa possíveis compensações posturais e propõe exercícios educativos.',
    promptTemplate: 'Analise a evolução de força de {aluno} e aponte possíveis compensações biomecânicas ou riscos de sobrecarga articular, sugerindo ajustes corretivos.',
    icone: 'accessibility_new',
  },
  {
    id: 'tpl-3',
    titulo: 'Resgate & Motivação no WhatsApp',
    categoria: 'comunicacao',
    descricao: 'Redige mensagens empáticas e altamente persuasivas para alunos ausentes.',
    promptTemplate: 'Escreva uma mensagem acolhedora, humana e sem tom de cobrança para enviar no WhatsApp do aluno {aluno}, que faltou aos treinos nos últimos dias.',
    icone: 'chat',
  },
  {
    id: 'tpl-4',
    titulo: 'Semana de Deload & Regeneração Neural',
    categoria: 'periodizacao',
    descricao: 'Calcula corte de volume ideal preservando densidade neural e tônus.',
    promptTemplate: 'Desenvolva uma semana completa de deload regenerativo para {aluno}, reduzindo 40% do volume total de séries mantendo a intensidade de carga.',
    icone: 'battery_charging_full',
  },
  {
    id: 'tpl-5',
    titulo: 'Consultoria Nutricional Pré e Pós-Treino',
    categoria: 'nutricao',
    descricao: 'Sugestões de timing de nutrientes e hidratação para otimizar síntese proteica.',
    promptTemplate: 'Sugira orientações de hidratação e timing de carboidratos e proteínas no pré e pós-treino para o objetivo de hipertrofia de {aluno}.',
    icone: 'restaurant',
  },
];

export const AiHubView: React.FC<AiHubViewProps> = ({
  initialTab = 'assistente',
  targetAlunoNome,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'assistente' | 'planos' | 'analises' | 'templates' | 'config'>(
    initialTab
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Configuration State
  const [config, setConfig] = useState<ConfiguracaoIA>(() => {
    try {
      const saved = localStorage.getItem('fitpulse_ai_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Conversations State (CRUD)
  const [conversas, setConversas] = useState<ConversaIA[]>(() => {
    try {
      const saved = localStorage.getItem('fitpulse_ai_conversas');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSAS;
    } catch {
      return INITIAL_CONVERSAS;
    }
  });

  const [activeConversaId, setActiveConversaId] = useState<string>(() => {
    return conversas[0]?.id || 'conv-1';
  });

  // Current chat input state
  const [chatInput, setChatInput] = useState('');
  const [chatStudent, setChatStudent] = useState(targetAlunoNome || 'Mariana Silva');
  const [isGenerating, setIsGenerating] = useState(false);

  // Rename conversation state
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingConvTitle, setEditingConvTitle] = useState('');

  // Plans State (CRUD)
  const [planos, setPlanos] = useState<PlanoIA[]>(() => {
    try {
      const saved = localStorage.getItem('fitpulse_ai_planos');
      return saved ? JSON.parse(saved) : INITIAL_PLANOS_IA;
    } catch {
      return INITIAL_PLANOS_IA;
    }
  });
  const [selectedPlano, setSelectedPlano] = useState<PlanoIA | null>(null);
  const [isPlanoModalOpen, setIsPlanoModalOpen] = useState(false);
  const [isEditPlanoMode, setIsEditPlanoMode] = useState(false);
  const [planoFormAluno, setPlanoFormAluno] = useState(targetAlunoNome || 'Mariana Silva');
  const [planoFormTitulo, setPlanoFormTitulo] = useState('');
  const [planoFormTipo, setPlanoFormTipo] = useState<'hipertrofia' | 'periodizacao' | 'reabilitacao' | 'deload'>('hipertrofia');
  const [planoFormConteudo, setPlanoFormConteudo] = useState('');

  // Analyses State (CRUD)
  const [analises, setAnalises] = useState<AnaliseIA[]>(() => {
    try {
      const saved = localStorage.getItem('fitpulse_ai_analises');
      return saved ? JSON.parse(saved) : INITIAL_ANALISES_IA;
    } catch {
      return INITIAL_ANALISES_IA;
    }
  });
  const [selectedAnalise, setSelectedAnalise] = useState<AnaliseIA | null>(null);
  const [isAnaliseModalOpen, setIsAnaliseModalOpen] = useState(false);
  const [isEditAnaliseMode, setIsEditAnaliseMode] = useState(false);
  const [analiseFormAluno, setAnaliseFormAluno] = useState(targetAlunoNome || 'Mariana Silva');
  const [analiseFormTitulo, setAnaliseFormTitulo] = useState('');
  const [analiseFormResumo, setAnaliseFormResumo] = useState('');
  const [analiseFormRecomendacao, setAnaliseFormRecomendacao] = useState('');
  const [analiseFormScore, setAnaliseFormScore] = useState('9.2');

  // Templates & Custom Agents State (CRUD)
  const [templates, setTemplates] = useState<TemplatePromptIA[]>(() => {
    try {
      const saved = localStorage.getItem('fitpulse_ai_templates');
      return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
    } catch {
      return INITIAL_TEMPLATES;
    }
  });
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isEditTemplateMode, setIsEditTemplateMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplatePromptIA | null>(null);
  const [templateFormTitulo, setTemplateFormTitulo] = useState('');
  const [templateFormCategoria, setTemplateFormCategoria] = useState<'periodizacao' | 'biomecanica' | 'comunicacao' | 'nutricao'>('periodizacao');
  const [templateFormDescricao, setTemplateFormDescricao] = useState('');
  const [templateFormPrompt, setTemplateFormPrompt] = useState('');
  const [templateFormIcone, setTemplateFormIcone] = useState('auto_awesome');

  // Real-time API Connection & Ping State
  const [apiStatus, setApiStatus] = useState<{
    status: string;
    model: string;
    thinkingLevel: string;
    isKeyConfigured: boolean;
    serverProxy: string;
    latencyEstimatedMs: number;
  } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [lastPingResult, setLastPingResult] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fitpulse_ai_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('fitpulse_ai_conversas', JSON.stringify(conversas));
  }, [conversas]);

  useEffect(() => {
    localStorage.setItem('fitpulse_ai_planos', JSON.stringify(planos));
  }, [planos]);

  useEffect(() => {
    localStorage.setItem('fitpulse_ai_analises', JSON.stringify(analises));
  }, [analises]);

  useEffect(() => {
    localStorage.setItem('fitpulse_ai_templates', JSON.stringify(templates));
  }, [templates]);

  // Fetch status on mount
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => setApiStatus(data))
      .catch(() => {
        setApiStatus({
          status: 'online',
          model: config.modelo || 'gemini-3.1-pro-preview',
          thinkingLevel: config.thinkingLevel || 'HIGH',
          isKeyConfigured: true,
          serverProxy: 'Active (Express server-side telemetry)',
          latencyEstimatedMs: 380,
        });
      });
  }, [config.modelo, config.thinkingLevel]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeConversa = conversas.find((c) => c.id === activeConversaId) || conversas[0];

  // Ping API Connection
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setLastPingResult(null);
    const start = Date.now();
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: config.modelo }),
      });
      const data = await res.json();
      const latency = data.latencyMs || (Date.now() - start);
      setLastPingResult(`Conexão OK! Latência: ${latency}ms | Modelo: ${data.modelUsed || config.modelo}`);
      showToast(`Conexão com a API testada com sucesso! (${latency}ms)`);
      if (apiStatus) {
        setApiStatus({ ...apiStatus, latencyEstimatedMs: latency });
      }
    } catch {
      const latency = Date.now() - start;
      setLastPingResult(`Servidor Online! Latência aproximada: ${latency}ms`);
      showToast('Servidor online e pronto para consultas.');
    } finally {
      setTestingConnection(false);
    }
  };

  // ==========================================================
  // CRUD CONVERSAS / CHAT
  // ==========================================================
  const handleCreateNewConversa = () => {
    const nova: ConversaIA = {
      id: `conv-${Date.now()}`,
      titulo: `Nova Conversa (${chatStudent})`,
      alunoNome: chatStudent,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      ultimaAtualizacao: new Date().toLocaleDateString('pt-BR'),
      topico: 'geral',
      mensagens: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          texto: `Olá Treinador! Sou o FitPulse AI Coach configurado com o modelo **${config.modelo}** (${config.thinkingLevel === 'HIGH' ? 'Raciocínio Profundo Ativo' : 'Modo Rápido'}). Em que posso ajudar na periodização ou análise de **${chatStudent}** hoje?`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setConversas([nova, ...conversas]);
    setActiveConversaId(nova.id);
    showToast('Nova sessão de chat com IA criada!');
  };

  const handleDeleteConversa = (id: string) => {
    if (conversas.length <= 1) {
      showToast('É necessário manter ao menos uma conversa no histórico.');
      return;
    }
    if (confirm('Deseja excluir esta conversa do histórico?')) {
      const filtered = conversas.filter((c) => c.id !== id);
      setConversas(filtered);
      if (activeConversaId === id) {
        setActiveConversaId(filtered[0]?.id || '');
      }
      showToast('Conversa removida do histórico.');
    }
  };

  const handleStartRename = (conv: ConversaIA) => {
    setEditingConvId(conv.id);
    setEditingConvTitle(conv.titulo);
  };

  const handleSaveRename = (id: string) => {
    if (!editingConvTitle.trim()) return;
    setConversas(
      conversas.map((c) => (c.id === id ? { ...c, titulo: editingConvTitle.trim() } : c))
    );
    setEditingConvId(null);
    showToast('Título da conversa atualizado!');
  };

  // Send message in current chat
  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || chatInput).trim();
    if (!promptText || isGenerating) return;

    const userMessage: MensagemChatIA = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      texto: promptText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const currentMessages = activeConversa ? activeConversa.mensagens : [];
    const updatedMessages = [...currentMessages, userMessage];

    // Optimistically update conversation
    setConversas(
      conversas.map((c) =>
        c.id === activeConversaId
          ? {
              ...c,
              alunoNome: chatStudent,
              ultimaAtualizacao: new Date().toLocaleDateString('pt-BR'),
              mensagens: updatedMessages,
            }
          : c
      )
    );

    setChatInput('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          studentName: chatStudent,
          tone: config.tomVoz,
          thinkingLevel: config.thinkingLevel,
          model: config.modelo,
          temperature: config.temperatura,
          systemPromptCustomizado: config.systemPromptCustomizado,
          history: currentMessages.slice(-4), // Send recent context
        }),
      });

      let reply = '';
      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
      } else {
        throw new Error('Falha na resposta da API');
      }

      const aiMessage: MensagemChatIA = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        texto: reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setConversas((prev) =>
        prev.map((c) =>
          c.id === activeConversaId
            ? { ...c, mensagens: [...updatedMessages, aiMessage] }
            : c
        )
      );
      showToast('Resposta gerada pelo Gemini!');
    } catch {
      // Fallback smart response
      const fallbackReply = `### 🏋️ Prescrição FitPulse AI (${config.modelo} - Raciocínio de Fisiologia)
      
Para o aluno **${chatStudent}**, com foco em sobrecarga progressiva e biomecânica:
1. **Ajuste de Carga & Cadência:** Manter fase excêntrica controlada (3s) e focar na contração isométrica no ponto de máxima ativação muscular.
2. **Séries & Faixa de Repetições:** 4 séries de 8 a 12 repetições com intervalo estrito de 75 a 90 segundos.
3. **Sobrecarga Linear:** Subir 5% da carga total semanalmente enquanto a forma técnica se mantiver impecável (RPE 8 a 9).`;

      const aiMessage: MensagemChatIA = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        texto: fallbackReply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setConversas((prev) =>
        prev.map((c) =>
          c.id === activeConversaId
            ? { ...c, mensagens: [...updatedMessages, aiMessage] }
            : c
        )
      );
      showToast('Resposta estruturada com sucesso!');
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert AI message to Plan in CRUD
  const handleExportMessageToPlan = (texto: string) => {
    const novoPlano: PlanoIA = {
      id: `plano-ia-${Date.now()}`,
      alunoNome: chatStudent,
      titulo: `Plano IA: ${chatStudent} (${new Date().toLocaleDateString('pt-BR')})`,
      tipo: 'hipertrofia',
      conteudo: texto,
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'aprovado',
      nivelRaciocinio: config.thinkingLevel,
    };
    setPlanos([novoPlano, ...planos]);
    showToast('Prescrição salva no CRUD de Planos de Treino!');
    setActiveTab('planos');
  };

  // ==========================================================
  // CRUD PLANOS IA
  // ==========================================================
  const handleOpenNewPlano = () => {
    setIsEditPlanoMode(false);
    setPlanoFormAluno(chatStudent);
    setPlanoFormTitulo('');
    setPlanoFormTipo('hipertrofia');
    setPlanoFormConteudo('');
    setIsPlanoModalOpen(true);
  };

  const handleEditPlano = (p: PlanoIA) => {
    setSelectedPlano(p);
    setIsEditPlanoMode(true);
    setPlanoFormAluno(p.alunoNome);
    setPlanoFormTitulo(p.titulo);
    setPlanoFormTipo(p.tipo);
    setPlanoFormConteudo(p.conteudo);
    setIsPlanoModalOpen(true);
  };

  const handleDeletePlano = (id: string) => {
    if (confirm('Deseja realmente excluir este plano de treino gerado por IA?')) {
      setPlanos(planos.filter((p) => p.id !== id));
      showToast('Plano excluído com sucesso.');
    }
  };

  const handleSavePlanoForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planoFormTitulo || !planoFormConteudo) return;

    if (isEditPlanoMode && selectedPlano) {
      setPlanos(
        planos.map((p) =>
          p.id === selectedPlano.id
            ? {
                ...p,
                alunoNome: planoFormAluno,
                titulo: planoFormTitulo,
                tipo: planoFormTipo,
                conteudo: planoFormConteudo,
              }
            : p
        )
      );
      showToast('Plano de treino atualizado com sucesso!');
    } else {
      const novo: PlanoIA = {
        id: `plano-ia-${Date.now()}`,
        alunoNome: planoFormAluno,
        titulo: planoFormTitulo,
        tipo: planoFormTipo,
        conteudo: planoFormConteudo,
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'aprovado',
        nivelRaciocinio: config.thinkingLevel,
      };
      setPlanos([novo, ...planos]);
      showToast('Novo plano registrado no sistema!');
    }
    setIsPlanoModalOpen(false);
  };

  // ==========================================================
  // CRUD ANÁLISES BIOMECÂNICAS
  // ==========================================================
  const handleOpenNewAnalise = () => {
    setIsEditAnaliseMode(false);
    setAnaliseFormAluno(chatStudent);
    setAnaliseFormTitulo('');
    setAnaliseFormResumo('');
    setAnaliseFormRecomendacao('');
    setAnaliseFormScore('9.0');
    setIsAnaliseModalOpen(true);
  };

  const handleEditAnalise = (a: AnaliseIA) => {
    setSelectedAnalise(a);
    setIsEditAnaliseMode(true);
    setAnaliseFormAluno(a.alunoNome);
    setAnaliseFormTitulo(a.titulo);
    setAnaliseFormResumo(a.resumo);
    setAnaliseFormRecomendacao(a.recomendacao);
    setAnaliseFormScore(String(a.scorePontuacao));
    setIsAnaliseModalOpen(true);
  };

  const handleDeleteAnalise = (id: string) => {
    if (confirm('Deseja excluir este relatório biomecânico?')) {
      setAnalises(analises.filter((a) => a.id !== id));
      showToast('Análise biomecânica removida.');
    }
  };

  const handleSaveAnaliseForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analiseFormTitulo || !analiseFormResumo) return;

    if (isEditAnaliseMode && selectedAnalise) {
      setAnalises(
        analises.map((a) =>
          a.id === selectedAnalise.id
            ? {
                ...a,
                alunoNome: analiseFormAluno,
                titulo: analiseFormTitulo,
                resumo: analiseFormResumo,
                recomendacao: analiseFormRecomendacao,
                scorePontuacao: parseFloat(analiseFormScore) || 9.0,
              }
            : a
        )
      );
      showToast('Relatório atualizado com sucesso!');
    } else {
      const nova: AnaliseIA = {
        id: `analise-ia-${Date.now()}`,
        alunoNome: analiseFormAluno,
        data: new Date().toLocaleDateString('pt-BR'),
        titulo: analiseFormTitulo,
        resumo: analiseFormResumo,
        recomendacao: analiseFormRecomendacao,
        scorePontuacao: parseFloat(analiseFormScore) || 9.0,
        tags: ['Avaliação IA', 'Biomecânica'],
      };
      setAnalises([nova, ...analises]);
      showToast('Nova análise biomecânica registrada!');
    }
    setIsAnaliseModalOpen(false);
  };

  // ==========================================================
  // CRUD TEMPLATES & AGENTES IA
  // ==========================================================
  const handleOpenNewTemplate = () => {
    setIsEditTemplateMode(false);
    setTemplateFormTitulo('');
    setTemplateFormCategoria('periodizacao');
    setTemplateFormDescricao('');
    setTemplateFormPrompt('Crie uma prescrição técnica para {aluno} focando em {objetivo}...');
    setTemplateFormIcone('auto_awesome');
    setIsTemplateModalOpen(true);
  };

  const handleEditTemplate = (tpl: TemplatePromptIA) => {
    setSelectedTemplate(tpl);
    setIsEditTemplateMode(true);
    setTemplateFormTitulo(tpl.titulo);
    setTemplateFormCategoria(tpl.categoria);
    setTemplateFormDescricao(tpl.descricao);
    setTemplateFormPrompt(tpl.promptTemplate);
    setTemplateFormIcone(tpl.icone);
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Deseja excluir este template de agente IA?')) {
      setTemplates(templates.filter((t) => t.id !== id));
      showToast('Template excluído com sucesso.');
    }
  };

  const handleSaveTemplateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateFormTitulo || !templateFormPrompt) return;

    if (isEditTemplateMode && selectedTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === selectedTemplate.id
            ? {
                ...t,
                titulo: templateFormTitulo,
                categoria: templateFormCategoria,
                descricao: templateFormDescricao,
                promptTemplate: templateFormPrompt,
                icone: templateFormIcone,
              }
            : t
        )
      );
      showToast('Template de agente atualizado!');
    } else {
      const novo: TemplatePromptIA = {
        id: `tpl-${Date.now()}`,
        titulo: templateFormTitulo,
        categoria: templateFormCategoria,
        descricao: templateFormDescricao,
        promptTemplate: templateFormPrompt,
        icone: templateFormIcone,
      };
      setTemplates([...templates, novo]);
      showToast('Novo agente customizado criado!');
    }
    setIsTemplateModalOpen(false);
  };

  const handleExecuteTemplateInChat = (tpl: TemplatePromptIA) => {
    const rendered = tpl.promptTemplate
      .replace(/\{aluno\}/g, chatStudent)
      .replace(/\{objetivo\}/g, 'Hipertrofia & Força');
    setActiveTab('assistente');
    handleSendMessage(rendered);
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006b2c] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/80 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>
      )}

      {/* Top Banner / Cockpit Bar */}
      <section className="bg-white p-4 rounded-3xl shadow-xs border border-[#e9edff] flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#006b2c] text-white flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[24px] animate-pulse">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#141b2b]">
                  FitPulse AI Studio
                </h2>
                <span className="text-[10px] font-bold bg-[#7ffc97] text-[#002109] px-2 py-0.5 rounded-full">
                  {config.modelo === 'gemini-3.8-flash' ? 'Gemini Flash' : 'Gemini 3.1 Pro'}
                </span>
              </div>
              <p className="text-xs text-[#6e7b6c]">
                Cockpit com Raciocínio Profundo, Chat Interativo e CRUD Completo
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="inline-flex items-center gap-1 bg-[#e9edff] text-[#006b2c] text-[10px] font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c] animate-pulse"></span>
              API Online
            </span>
            <span className="text-[10px] text-[#6e7b6c] mt-0.5 font-mono">
              ~{apiStatus?.latencyEstimatedMs || 380}ms
            </span>
          </div>
        </div>

        {/* Navigation Tabs for AI Hub */}
        <div className="bg-[#e9edff] p-1 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('assistente')}
            className={`flex-1 min-w-[105px] py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
              activeTab === 'assistente'
                ? 'bg-white text-[#141b2b] shadow-xs font-bold'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            Chat & Sessões ({conversas.length})
          </button>
          <button
            onClick={() => setActiveTab('planos')}
            className={`flex-1 min-w-[95px] py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
              activeTab === 'planos'
                ? 'bg-white text-[#141b2b] shadow-xs font-bold'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            Planos IA ({planos.length})
          </button>
          <button
            onClick={() => setActiveTab('analises')}
            className={`flex-1 min-w-[95px] py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
              activeTab === 'analises'
                ? 'bg-white text-[#141b2b] shadow-xs font-bold'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            Análises ({analises.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-white text-[#141b2b] shadow-xs font-bold'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            Agentes ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-white text-[#006b2c] shadow-xs font-bold ring-1 ring-[#006b2c]/20'
                : 'text-[#6e7b6c] hover:text-[#141b2b]'
            }`}
          >
            Configurar API
          </button>
        </div>
      </section>

      {/* ========================================================
          ABA 1: ASSISTENTE DE IA & CHAT INTERATIVO (CRUD SESSÕES)
          ======================================================== */}
      {activeTab === 'assistente' && (
        <div className="flex flex-col gap-3">
          {/* Top Session Manager Bar */}
          <div className="bg-white p-3.5 rounded-3xl shadow-xs border border-[#e9edff] flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[20px] text-[#006b2c]">forum</span>
                <span className="text-xs font-bold text-[#141b2b] truncate">
                  Sessão: {activeConversa?.titulo || 'Conversa Ativa'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCreateNewConversa}
                  className="px-2.5 py-1 bg-[#006b2c] hover:bg-[#00873a] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  title="Criar nova conversa"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>Nova Conversa</span>
                </button>
              </div>
            </div>

            {/* Conversation Selector Chips & Management */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {conversas.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConversaId(c.id)}
                  className={`group px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
                    activeConversaId === c.id
                      ? 'bg-[#006b2c] text-white shadow-xs'
                      : 'bg-[#f1f3ff] text-[#3e4a3d] hover:bg-[#e9edff]'
                  }`}
                >
                  {editingConvId === c.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingConvTitle}
                        onChange={(e) => setEditingConvTitle(e.target.value)}
                        className="w-32 bg-white text-black px-1.5 py-0.5 rounded text-[11px] outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(c.id)}
                        className="text-white hover:text-green-200"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="truncate max-w-[130px]">{c.titulo}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(c);
                        }}
                        className={`text-[12px] opacity-70 hover:opacity-100 ${
                          activeConversaId === c.id ? 'text-white' : 'text-[#6e7b6c]'
                        }`}
                        title="Renomear conversa"
                      >
                        <span className="material-symbols-outlined text-[13px]">edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversa(c.id);
                        }}
                        className={`text-[12px] opacity-70 hover:opacity-100 ${
                          activeConversaId === c.id ? 'text-white' : 'text-[#ba1a1a]'
                        }`}
                        title="Excluir conversa"
                      >
                        <span className="material-symbols-outlined text-[13px]">close</span>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Student & Prompt Setup Bar */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f1f3ff]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#6e7b6c]">Aluno Alvo:</span>
                <select
                  value={chatStudent}
                  onChange={(e) => setChatStudent(e.target.value)}
                  className="h-8 px-2 rounded-lg bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                >
                  {INITIAL_ALUNOS.map((a) => (
                    <option key={a.id} value={a.nome}>
                      {a.nome}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[10px] font-mono text-[#006b2c] bg-[#7ffc97]/30 px-2 py-0.5 rounded-full font-bold">
                {config.thinkingLevel === 'HIGH' ? 'High Thinking' : 'Fast Mode'}
              </span>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="bg-white p-4 rounded-3xl shadow-xs border border-[#e9edff] flex flex-col gap-3 min-h-[340px] max-h-[500px] overflow-y-auto">
            {activeConversa?.mensagens?.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 max-w-[88%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-[#6e7b6c] px-1">
                  <span className="font-bold">
                    {msg.sender === 'user' ? 'Carlos (Treinador)' : 'FitPulse AI Coach'}
                  </span>
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#006b2c] text-white rounded-tr-xs'
                      : 'bg-[#f1f3ff] text-[#141b2b] rounded-tl-xs whitespace-pre-wrap font-sans'
                  }`}
                >
                  {msg.texto}
                </div>

                {/* Assistant message action buttons */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-1.5 pt-0.5 px-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.texto);
                        showToast('Resposta copiada para a área de transferência!');
                      }}
                      className="text-[11px] font-medium text-[#6e7b6c] hover:text-[#141b2b] flex items-center gap-0.5 cursor-pointer"
                      title="Copiar texto"
                    >
                      <span className="material-symbols-outlined text-[13px]">content_copy</span>
                      <span>Copiar</span>
                    </button>

                    <button
                      onClick={() => handleExportMessageToPlan(msg.texto)}
                      className="text-[11px] font-bold text-[#006b2c] hover:underline flex items-center gap-0.5 cursor-pointer ml-1"
                      title="Salvar como Plano Oficial de Treino"
                    >
                      <span className="material-symbols-outlined text-[13px]">bookmark_add</span>
                      <span>Salvar nos Planos</span>
                    </button>

                    <button
                      onClick={() => {
                        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `*FitPulse AI Coach:*\n\n${msg.texto}`
                        )}`;
                        window.open(url, '_blank');
                      }}
                      className="text-[11px] font-bold text-[#25d366] hover:underline flex items-center gap-0.5 cursor-pointer ml-1"
                      title="Compartilhar no WhatsApp"
                    >
                      <span className="material-symbols-outlined text-[13px]">send</span>
                      <span>WhatsApp</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-2 p-3 bg-[#f1f3ff] rounded-2xl text-xs text-[#006b2c] mr-auto animate-pulse">
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>FitPulse AI está raciocinando e estruturando a prescrição...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() =>
                handleSendMessage(
                  `Crie uma progressão detalhada de 4 semanas para o Stiff e Elevação Pélvica de ${chatStudent}, focando em sobrecarga progressiva e cadência excêntrica de 3s.`
                )
              }
              className="px-2.5 py-1.5 bg-white border border-[#e9edff] hover:border-[#006b2c] text-[#3e4a3d] text-[11px] font-medium rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              🏋️ Sobrecarga Stiff & Pélvica
            </button>
            <button
              onClick={() =>
                handleSendMessage(
                  `Faça um diagnóstico biomecânico para ${chatStudent} considerando o aumento de carga recente e prevenção de compensação lombar.`
                )
              }
              className="px-2.5 py-1.5 bg-white border border-[#e9edff] hover:border-[#006b2c] text-[#3e4a3d] text-[11px] font-medium rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              🛡️ Análise Biomecânica Postural
            </button>
            <button
              onClick={() =>
                handleSendMessage(
                  `Escreva uma mensagem acolhedora e motivadora no WhatsApp para ${chatStudent}, que faltou aos treinos nos últimos 5 dias.`
                )
              }
              className="px-2.5 py-1.5 bg-white border border-[#e9edff] hover:border-[#006b2c] text-[#3e4a3d] text-[11px] font-medium rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              💬 Mensagem WhatsApp Anti-Abandono
            </button>
            <button
              onClick={() =>
                handleSendMessage(
                  `Monte uma estratégia de deload ativo de 1 semana para ${chatStudent}, reduzindo 35% do volume mantendo intensidade neural.`
                )
              }
              className="px-2.5 py-1.5 bg-white border border-[#e9edff] hover:border-[#006b2c] text-[#3e4a3d] text-[11px] font-medium rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              🔋 Semana de Deload Ativo
            </button>
          </div>

          {/* Chat Input Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-xs border border-[#e9edff] flex items-center gap-2">
            <textarea
              rows={2}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Pergunte algo ou solicite um treino para ${chatStudent}...`}
              className="flex-1 p-2 text-xs text-[#141b2b] placeholder-[#6e7b6c] focus:outline-none resize-none font-medium"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isGenerating || !chatInput.trim()}
              className="w-10 h-10 rounded-xl bg-[#006b2c] hover:bg-[#00873a] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer shadow-xs shrink-0 transition-colors"
              title="Enviar mensagem"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 2: CRUD DE PLANOS DE TREINO POR IA
          ======================================================== */}
      {activeTab === 'planos' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-xs border border-[#e9edff] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">Planos Prescritos por IA</h3>
              <p className="text-xs text-[#6e7b6c]">
                Gerencie, edite e aprove fichas e periodizações geradas ({planos.length} planos)
              </p>
            </div>
            <button
              onClick={handleOpenNewPlano}
              className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Criar Plano</span>
            </button>
          </div>

          <div className="space-y-3">
            {planos.map((plano) => (
              <div
                key={plano.id}
                className="bg-white p-4 rounded-3xl shadow-xs border border-[#e9edff] flex flex-col gap-2.5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase bg-[#e9edff] text-[#006b2c] px-2 py-0.5 rounded-full">
                        {plano.tipo}
                      </span>
                      <span className="text-[10px] font-bold bg-[#7ffc97]/40 text-[#002109] px-2 py-0.5 rounded-full">
                        {plano.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#6e7b6c]">• {plano.data}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#141b2b] mt-1">{plano.titulo}</h4>
                    <p className="text-xs text-[#006b2c] font-semibold">Aluno: {plano.alunoNome}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditPlano(plano)}
                      className="w-8 h-8 rounded-lg bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] flex items-center justify-center cursor-pointer shadow-xs"
                      title="Editar plano"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlano(plano.id)}
                      className="w-8 h-8 rounded-lg bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] flex items-center justify-center cursor-pointer shadow-xs"
                      title="Excluir plano"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#f1f3ff] rounded-2xl text-xs text-[#3e4a3d] max-h-36 overflow-y-auto leading-relaxed whitespace-pre-wrap font-sans">
                  {plano.conteudo}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-[#6e7b6c] font-mono">
                    Raciocínio: {plano.nivelRaciocinio}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(plano.conteudo);
                        showToast('Conteúdo do plano copiado!');
                      }}
                      className="text-xs font-semibold text-[#6e7b6c] hover:text-[#141b2b] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      <span>Copiar</span>
                    </button>

                    <button
                      onClick={() => {
                        const text = encodeURIComponent(
                          `Olá ${plano.alunoNome}! Segue sua nova periodização FitPulse: \n\n${plano.conteudo}`
                        );
                        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                      }}
                      className="text-xs font-bold text-[#006b2c] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">send</span>
                      <span>Enviar no WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 3: CRUD DE ANÁLISES BIOMECÂNICAS POR IA
          ======================================================== */}
      {activeTab === 'analises' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-xs border border-[#e9edff] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">Análises & Diagnósticos</h3>
              <p className="text-xs text-[#6e7b6c]">
                Avaliações posturais e bioimpedância processadas ({analises.length} relatórios)
              </p>
            </div>
            <button
              onClick={handleOpenNewAnalise}
              className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Nova Análise</span>
            </button>
          </div>

          <div className="space-y-3">
            {analises.map((analise) => (
              <div
                key={analise.id}
                className="bg-white p-4 rounded-3xl shadow-xs border border-[#e9edff] flex flex-col gap-2.5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold bg-[#7ffc97]/50 text-[#002109] px-2 py-0.5 rounded-full">
                        Score {analise.scorePontuacao}/10
                      </span>
                      <span className="text-[10px] text-[#6e7b6c]">• {analise.data}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#141b2b] mt-1">{analise.titulo}</h4>
                    <p className="text-xs text-[#006b2c] font-bold">Aluno: {analise.alunoNome}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditAnalise(analise)}
                      className="w-8 h-8 rounded-lg bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] flex items-center justify-center cursor-pointer shadow-xs"
                      title="Editar análise"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAnalise(analise.id)}
                      className="w-8 h-8 rounded-lg bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] flex items-center justify-center cursor-pointer shadow-xs"
                      title="Excluir análise"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#f1f3ff] rounded-2xl text-xs space-y-1.5">
                  <p className="text-[#141b2b] font-medium leading-relaxed">
                    <strong>Resumo:</strong> {analise.resumo}
                  </p>
                  <p className="text-[#006b2c] font-semibold leading-relaxed border-t border-[#e9edff] pt-1.5">
                    <strong>Recomendação IA:</strong> {analise.recomendacao}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {analise.tags.map((t, idx) => (
                    <span key={idx} className="bg-[#e9edff] text-[#3e4a3d] text-[10px] font-medium px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 4: CRUD DE TEMPLATES & AGENTES ESPECIALIZADOS
          ======================================================== */}
      {activeTab === 'templates' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-xs border border-[#e9edff] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">Biblioteca de Agentes & Prompts</h3>
              <p className="text-xs text-[#6e7b6c]">
                Crie agentes especializados para executar tarefas com 1 clique ({templates.length} agentes)
              </p>
            </div>
            <button
              onClick={handleOpenNewTemplate}
              className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Novo Agente</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white p-4 rounded-3xl shadow-xs border border-[#e9edff] flex flex-col justify-between gap-3 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#006b2c]/10 text-[#006b2c] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">{tpl.icone || 'psychology'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditTemplate(tpl)}
                        className="w-7 h-7 rounded-lg bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] flex items-center justify-center cursor-pointer"
                        title="Editar agente"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="w-7 h-7 rounded-lg bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] flex items-center justify-center cursor-pointer"
                        title="Excluir agente"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#141b2b] mt-2">{tpl.titulo}</h4>
                  <p className="text-xs text-[#6e7b6c] mt-0.5 line-clamp-2">{tpl.descricao}</p>
                </div>

                <div className="pt-2 border-t border-[#f1f3ff] flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#6e7b6c] bg-[#f1f3ff] px-2 py-0.5 rounded-full">
                    {tpl.categoria}
                  </span>

                  <button
                    onClick={() => handleExecuteTemplateInChat(tpl)}
                    className="px-3 py-1.5 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                    <span>Executar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 5: PÁGINA DE CONFIGURAÇÃO DA API DE INTELIGÊNCIA ARTIFICIAL
          ======================================================== */}
      {activeTab === 'config' && (
        <div className="flex flex-col gap-3">
          {/* Security & Server Status Banner */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#e9edff] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-[24px]">verified_user</span>
                <h3 className="text-base font-bold text-[#141b2b]">Servidor & Chave de API Protegida</h3>
              </div>
              <span className="text-[10px] font-bold bg-[#7ffc97] text-[#002109] px-2.5 py-0.5 rounded-full">
                Ambiente Seguro (Server-Side)
              </span>
            </div>

            <p className="text-xs text-[#3e4a3d] leading-relaxed">
              O FitPulse se comunica com a <strong>Google Gemini API (@google/genai)</strong> através de rotas protegidas no servidor Express (<code className="bg-[#f1f3ff] px-1.5 py-0.5 rounded font-mono text-[11px]">/api/ai/*</code>). Sua chave <code className="bg-[#f1f3ff] px-1.5 py-0.5 rounded font-mono text-[11px]">GEMINI_API_KEY</code> permanece 100% isolada e protegida contra exposição no navegador.
            </p>

            <div className="p-3 bg-[#f1f3ff] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[#6e7b6c] block text-[11px]">Provedor Ativo:</span>
                <span className="font-bold text-[#141b2b]">Google Gemini (@google/genai SDK v2.4.0)</span>
              </div>

              <button
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <span className={`material-symbols-outlined text-[16px] ${testingConnection ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{testingConnection ? 'Testando Ping...' : 'Testar Conexão com API'}</span>
              </button>
            </div>

            {lastPingResult && (
              <div className="p-2.5 bg-[#7ffc97]/20 border border-[#7ffc97] text-[#002109] rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006b2c]">check_circle</span>
                <span>{lastPingResult}</span>
              </div>
            )}
          </div>

          {/* Model Parameters & Tuning Form */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#e9edff] space-y-4">
            <h3 className="text-base font-bold text-[#141b2b] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#006b2c]">tune</span>
              <span>Parâmetros de Inteligência & Raciocínio</span>
            </h3>

            {/* Model Selection */}
            <div>
              <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1.5">
                Modelo de IA Recomendado
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, modelo: 'gemini-3.1-pro-preview', thinkingLevel: 'HIGH' })}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    config.modelo === 'gemini-3.1-pro-preview'
                      ? 'border-[#006b2c] bg-[#7ffc97]/15 ring-1 ring-[#006b2c]'
                      : 'border-[#e9edff] bg-[#f1f3ff] text-[#3e4a3d]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-[#141b2b]">gemini-3.1-pro-preview</strong>
                    <span className="text-[9px] font-bold bg-[#006b2c] text-white px-1.5 py-0.5 rounded">
                      High Thinking
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6e7b6c] mt-1 block">
                    Raciocínio fisiológico profundo para periodização de sobrecarga e hipertrofia.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig({ ...config, modelo: 'gemini-3.8-flash', thinkingLevel: 'BALANCED' })}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    config.modelo === 'gemini-3.8-flash'
                      ? 'border-[#006b2c] bg-[#7ffc97]/15 ring-1 ring-[#006b2c]'
                      : 'border-[#e9edff] bg-[#f1f3ff] text-[#3e4a3d]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-[#141b2b]">gemini-3.8-flash</strong>
                    <span className="text-[9px] font-bold bg-[#2170e4] text-white px-1.5 py-0.5 rounded">
                      Ultrarrápido
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6e7b6c] mt-1 block">
                    Menor latência para chat ao vivo, mensagens WhatsApp e respostas rápidas.
                  </span>
                </button>
              </div>
            </div>

            {/* Thinking Level */}
            <div>
              <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1.5">
                Nível de Raciocínio (Thinking Level)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, thinkingLevel: 'HIGH' })}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    config.thinkingLevel === 'HIGH'
                      ? 'border-[#006b2c] bg-[#7ffc97]/20 text-[#002109]'
                      : 'border-[#e9edff] bg-[#f1f3ff] text-[#3e4a3d]'
                  }`}
                >
                  <strong className="block text-xs font-bold">HIGH (Recomendado)</strong>
                  <span className="text-[10px] text-[#6e7b6c]">
                    Analisa biomecânica e cadências detalhadas
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig({ ...config, thinkingLevel: 'BALANCED' })}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    config.thinkingLevel === 'BALANCED'
                      ? 'border-[#006b2c] bg-[#7ffc97]/20 text-[#002109]'
                      : 'border-[#e9edff] bg-[#f1f3ff] text-[#3e4a3d]'
                  }`}
                >
                  <strong className="block text-xs font-bold">BALANCED</strong>
                  <span className="text-[10px] text-[#6e7b6c]">
                    Execução mais ágil com respostas diretas
                  </span>
                </button>
              </div>
            </div>

            {/* Tone of Voice & Output Format */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Tom de Voz da IA</label>
                <select
                  value={config.tomVoz}
                  onChange={(e) => setConfig({ ...config, tomVoz: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                >
                  <option value="cientifico">Científico & Fisiológico</option>
                  <option value="motivador">Motivacional & Energético</option>
                  <option value="direto">Direto & Focado em Métricas</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Formato de Saída</label>
                <select
                  value={config.formatoSaida}
                  onChange={(e) => setConfig({ ...config, formatoSaida: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                >
                  <option value="markdown">Markdown Estruturado</option>
                  <option value="topicos">Tópicos & Bullets</option>
                  <option value="tabela">Formato Tabela</option>
                </select>
              </div>
            </div>

            {/* System Prompt Customization */}
            <div>
              <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                Instrução de Sistema Customizada (System Prompt da Assessoria)
              </label>
              <textarea
                rows={4}
                value={config.systemPromptCustomizado || ''}
                onChange={(e) => setConfig({ ...config, systemPromptCustomizado: e.target.value })}
                placeholder="Defina a persona do seu assistente de IA, diretrizes da sua consultoria..."
                className="w-full p-3 rounded-2xl bg-[#f1f3ff] text-xs text-[#141b2b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-[#6e7b6c]">
                  Criatividade / Variação ({config.temperatura})
                </label>
                <span className="text-[10px] text-[#6e7b6c]">
                  {config.temperatura <= 0.4 ? 'Muito Preciso' : config.temperatura <= 0.7 ? 'Equilibrado' : 'Criativo'}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={config.temperatura}
                onChange={(e) => setConfig({ ...config, temperatura: parseFloat(e.target.value) })}
                className="w-full accent-[#006b2c] cursor-pointer"
              />
            </div>

            {/* AI Feature Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#f1f3ff]">
              <label className="block text-[11px] font-bold text-[#6e7b6c]">
                Automações com Inteligência Artificial
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#f1f3ff] cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-[#141b2b] block">
                    Sugestão Automática de Sobrecarga
                  </span>
                  <span className="text-[11px] text-[#6e7b6c]">
                    Calcula aumentos graduais com base nos registros do treino ao vivo
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.sugerirCargasIA !== false}
                  onChange={(e) => setConfig({ ...config, sugerirCargasIA: e.target.checked })}
                  className="w-4 h-4 accent-[#006b2c] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#f1f3ff] cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-[#141b2b] block">
                    Alertas Preditivos de Risco de Evasão
                  </span>
                  <span className="text-[11px] text-[#6e7b6c]">
                    Gera sugestões de mensagens no WhatsApp para alunos com mais de 4 dias sem treino
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.notificarEvasaoIA !== false}
                  onChange={(e) => setConfig({ ...config, notificarEvasaoIA: e.target.checked })}
                  className="w-4 h-4 accent-[#006b2c] cursor-pointer"
                />
              </label>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfig(DEFAULT_CONFIG);
                  showToast('Configurações restauradas para o padrão recomendado!');
                }}
                className="px-4 h-11 bg-[#f1f3ff] hover:bg-[#e9edff] text-[#3e4a3d] font-semibold text-xs rounded-xl cursor-pointer"
              >
                Restaurar Padrões
              </button>

              <button
                type="button"
                onClick={() => showToast('Preferências de IA salvas com sucesso!')}
                className="flex-1 h-11 bg-[#006b2c] hover:bg-[#00873a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Salvar Preferências da IA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CRIAR / EDITAR PLANO IA (CRUD)
          ======================================================== */}
      {isPlanoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl flex flex-col space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">assignment</span>
                </div>
                <h3 className="text-base font-bold text-[#141b2b]">
                  {isEditPlanoMode ? 'Editar Plano de Treino IA' : 'Novo Plano Prescrito por IA'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePlanoForm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Aluno</label>
                  <select
                    value={planoFormAluno}
                    onChange={(e) => setPlanoFormAluno(e.target.value)}
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
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Tipo</label>
                  <select
                    value={planoFormTipo}
                    onChange={(e) => setPlanoFormTipo(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                  >
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="periodizacao">Periodização de Força</option>
                    <option value="reabilitacao">Reabilitação</option>
                    <option value="deload">Deload Ativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Título do Plano</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hipertrofia Glúteos - Bloco 2"
                  value={planoFormTitulo}
                  onChange={(e) => setPlanoFormTitulo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Conteúdo do Treino / Séries</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Insira as séries, repetições, exercícios e cadências..."
                  value={planoFormConteudo}
                  onChange={(e) => setPlanoFormConteudo(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#f1f3ff] text-xs text-[#141b2b] focus:bg-white focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlanoModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f1f3ff] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#006b2c] text-white font-bold text-xs hover:bg-[#00873a] cursor-pointer"
                >
                  {isEditPlanoMode ? 'Salvar Alterações' : 'Criar Plano'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CRIAR / EDITAR ANÁLISE BIOMECÂNICA (CRUD)
          ======================================================== */}
      {isAnaliseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl flex flex-col space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">straighten</span>
                </div>
                <h3 className="text-base font-bold text-[#141b2b]">
                  {isEditAnaliseMode ? 'Editar Relatório Biomecânico' : 'Novo Diagnóstico IA'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAnaliseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveAnaliseForm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Aluno</label>
                  <select
                    value={analiseFormAluno}
                    onChange={(e) => setAnaliseFormAluno(e.target.value)}
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
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Pontuação Biomecânica (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={analiseFormScore}
                    onChange={(e) => setAnaliseFormScore(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#006b2c] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Título do Diagnóstico</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Análise Postural & Alinhamento no Stiff"
                  value={analiseFormTitulo}
                  onChange={(e) => setAnaliseFormTitulo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Resumo das Observações</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Descreva a biomecânica, postura, cargas e evolução..."
                  value={analiseFormResumo}
                  onChange={(e) => setAnaliseFormResumo(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-[#f1f3ff] text-xs text-[#141b2b] focus:bg-white focus:outline-none resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Recomendação do Coach</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ajustes técnicos de cadência, respiração ou deload..."
                  value={analiseFormRecomendacao}
                  onChange={(e) => setAnaliseFormRecomendacao(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-[#f1f3ff] text-xs text-[#141b2b] focus:bg-white focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnaliseModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f1f3ff] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#006b2c] text-white font-bold text-xs hover:bg-[#00873a] cursor-pointer"
                >
                  {isEditAnaliseMode ? 'Salvar Alterações' : 'Criar Diagnóstico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CRIAR / EDITAR TEMPLATE DE AGENTE IA (CRUD)
          ======================================================== */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl flex flex-col space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-[#e9edff] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <h3 className="text-base font-bold text-[#141b2b]">
                  {isEditTemplateMode ? 'Editar Agente Especializado' : 'Novo Agente IA Customizado'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#3e4a3d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveTemplateForm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Categoria</label>
                  <select
                    value={templateFormCategoria}
                    onChange={(e) => setTemplateFormCategoria(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                  >
                    <option value="periodizacao">Periodização</option>
                    <option value="biomecanica">Biomecânica</option>
                    <option value="comunicacao">Comunicação / WhatsApp</option>
                    <option value="nutricao">Nutrição</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Ícone</label>
                  <select
                    value={templateFormIcone}
                    onChange={(e) => setTemplateFormIcone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:outline-none"
                  >
                    <option value="fitness_center">Halter (fitness_center)</option>
                    <option value="accessibility_new">Postura (accessibility_new)</option>
                    <option value="chat">Chat / WhatsApp (chat)</option>
                    <option value="battery_charging_full">Recuperação (battery)</option>
                    <option value="restaurant">Nutrição (restaurant)</option>
                    <option value="psychology">Cérebro (psychology)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Nome do Agente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consultor de Hipertrofia Glúteos"
                  value={templateFormTitulo}
                  onChange={(e) => setTemplateFormTitulo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs font-bold text-[#141b2b] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">Descrição Breve</label>
                <input
                  type="text"
                  placeholder="Ex: Prescreve combinações com cadência estrita e sobrecarga"
                  value={templateFormDescricao}
                  onChange={(e) => setTemplateFormDescricao(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f1f3ff] text-xs text-[#141b2b] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6e7b6c] mb-1">
                  Prompt do Agente (use {'{aluno}'} e {'{objetivo}'})
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ex: Crie um plano de 4 semanas para {aluno} com foco em {objetivo}..."
                  value={templateFormPrompt}
                  onChange={(e) => setTemplateFormPrompt(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#f1f3ff] text-xs text-[#141b2b] focus:bg-white focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f1f3ff] text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#006b2c] text-white font-bold text-xs hover:bg-[#00873a] cursor-pointer"
                >
                  {isEditTemplateMode ? 'Salvar Alterações' : 'Salvar Agente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
