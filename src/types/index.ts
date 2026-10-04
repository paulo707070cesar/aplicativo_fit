export interface Aluno {
  id: string;
  nome: string;
  whatsapp?: string; // Telefone/WhatsApp para cobranças via Pix e notificações
  foto: string;
  status: 'active' | 'pending' | 'inactive';
  plano: string;
  objetivo: string;
  ultimoTreino: string;
  renovacao: string;
  emDia: boolean;
  mensalidade: number;
  idade: number;
  altura: string;
  peso: number;
  historicoPeso?: { data: string; peso: number }[];
  adesao: number;
  treinosRealizados: number;
  treinosTotal: number;
  volumeCargaKg: number;
  imc: number;
  comparativoFotos?: {
    antes: { url: string; data: string; peso: string };
    atual: { url: string; data: string; peso: string; nota: string };
  };
  fichaAtiva?: {
    nome: string;
    frequencia: string;
    exerciciosCount: number;
    meta: string;
  };
  atividadesRecentes?: {
    tipo: 'treino' | 'pagamento' | 'avaliacao';
    titulo: string;
    tempo: string;
    descricao: string;
  }[];
}

export interface Serie {
  numero: string;
  tipo: 'Aquec.' | 'Trabalho' | 'Falha' | 'Drop-set';
  reps: number;
  peso: number;
  pausa: string;
}

export interface Exercicio {
  id: string;
  numero: number;
  nome: string;
  grupoMuscular: string;
  equipamento: string;
  imagemUrl: string;
  temVideo?: boolean;
  series: Serie[];
  instrucaoTecnica?: string;
  tag?: string;
}

export interface TreinoPlano {
  id: string;
  nome: string;
  versao: string;
  alunoId: string;
  alunoNome: string;
  alunoFoto: string;
  duracaoSemanas: number;
  frequenciaSemanal: string;
  nivel: string;
  diaAtual: string;
  rotina: {
    dia: string;
    titulo: string;
    subtitulo: string;
    exercicios: Exercicio[];
  }[];
}

export interface CobrancaPix {
  id: string;
  alunoId: string;
  alunoNome: string;
  alunoWhatsapp?: string; // Telefone WhatsApp para envio de cobrança
  alunoFoto?: string;
  iniciais?: string;
  plano: string;
  valor: number;
  status: 'pagos' | 'pendentes' | 'atrasados';
  vencimento: string;
  detalheData?: string;
  tipoTransacao: string;
  comprovante?: string;
  chavePix: string;
  qrCodeUrl?: string;
}

export interface IndicadoresDashboard {
  receitaMes: number;
  receitaMeta: number;
  receitaCrescimentoPct: number;
  aReceber: number;
  pendenciasCount: number;
  atrasados: number;
  atrasadosCount: number;
  ticketMedio: number;
  clientesAtivos: number;
  taxaRetencaoPct: number;
}

export interface PlanoIA {
  id: string;
  alunoNome: string;
  titulo: string;
  tipo: 'periodizacao' | 'hipertrofia' | 'reabilitacao' | 'deload';
  conteudo: string;
  data: string;
  status: 'aprovado' | 'rascunho' | 'arquivado';
  nivelRaciocinio: 'HIGH' | 'BALANCED';
}

export interface AnaliseIA {
  id: string;
  alunoNome: string;
  data: string;
  titulo: string;
  resumo: string;
  recomendacao: string;
  scorePontuacao: number;
  tags: string[];
}

export interface MensagemChatIA {
  id: string;
  sender: 'user' | 'assistant';
  texto: string;
  timestamp: string;
}

export interface ConversaIA {
  id: string;
  titulo: string;
  alunoNome: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
  topico: 'periodizacao' | 'biomecanica' | 'retencao' | 'nutricao' | 'geral';
  mensagens: MensagemChatIA[];
}

export interface TemplatePromptIA {
  id: string;
  titulo: string;
  categoria: 'periodizacao' | 'biomecanica' | 'comunicacao' | 'nutricao';
  descricao: string;
  promptTemplate: string;
  icone: string;
}

export interface ConfiguracaoIA {
  modelo: string;
  thinkingLevel: 'HIGH' | 'BALANCED';
  tomVoz: 'cientifico' | 'motivador' | 'direto';
  temperatura: number;
  formatoSaida: 'markdown' | 'topicos' | 'tabela';
  especialidadeFoco: string;
  autoAplicarPeriodizacao: boolean;
  systemPromptCustomizado?: string;
  notificarEvasaoIA?: boolean;
  sugerirCargasIA?: boolean;
}

