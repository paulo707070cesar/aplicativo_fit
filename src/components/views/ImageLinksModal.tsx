import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';

interface ImageLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLinksModal: React.FC<ImageLinksModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const imageList = [
    {
      key: 'logo',
      titulo: 'Logo FitPulse (Verde & Hexágono)',
      url: ASSETS.logo,
      categoria: 'Identidade Visual',
    },
    {
      key: 'carlosAvatar',
      titulo: 'Carlos Rossi (Coach / Personal Trainer)',
      url: ASSETS.carlosAvatar,
      categoria: 'Treinador',
    },
    {
      key: 'marianaAvatar',
      titulo: 'Mariana Silva (Foto Perfil Atleta)',
      url: ASSETS.marianaAvatar,
      categoria: 'Aluna',
    },
    {
      key: 'marianaAntes',
      titulo: 'Mariana Silva (Antes • Fev 2026 - 67,6 kg)',
      url: ASSETS.marianaAntesImg,
      categoria: 'Evolução / Postura',
    },
    {
      key: 'marianaAtual',
      titulo: 'Mariana Silva (Atual • Out 2026 - 63,4 kg)',
      url: ASSETS.marianaAtualImg,
      categoria: 'Evolução / Postura',
    },
    {
      key: 'marianaSelfie',
      titulo: 'Mariana Silva (Selfie Pós-Treino Check-in)',
      url: ASSETS.marianaSelfieImg,
      categoria: 'Check-in',
    },
    {
      key: 'agachamento',
      titulo: 'Exercício: Agachamento Livre com Barra',
      url: ASSETS.agachamentoLivreImg,
      categoria: 'Exercícios',
    },
    {
      key: 'legpress',
      titulo: 'Exercício: Leg Press 45º Inclinado',
      url: ASSETS.legPress45Img,
      categoria: 'Exercícios',
    },
    {
      key: 'extensora',
      titulo: 'Exercício: Cadeira Extensora',
      url: ASSETS.cadeiraExtensoraImg,
      categoria: 'Exercícios',
    },
    {
      key: 'stiff',
      titulo: 'Exercício: Stiff com Halteres / RDL',
      url: ASSETS.stiffHalteresImg,
      categoria: 'Exercícios',
    },
    {
      key: 'rafael',
      titulo: 'Rafael Costa (Aluno Consultoria)',
      url: ASSETS.rafaelAvatar,
      categoria: 'Alunos',
    },
    {
      key: 'joaoPedro',
      titulo: 'João Pedro (Aluno Hipertrofia)',
      url: ASSETS.joaoPedroAvatar,
      categoria: 'Alunos',
    },
    {
      key: 'anaCarolina',
      titulo: 'Ana Carolina (Aluna Híbrido)',
      url: ASSETS.anaCarolinaAvatar,
      categoria: 'Alunos',
    },
    {
      key: 'lucasOliveira',
      titulo: 'Lucas Oliveira (Aluno Powerlifting)',
      url: ASSETS.lucasOliveiraAvatar,
      categoria: 'Alunos',
    },
  ];

  const handleCopyUrl = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyImgTag = (key: string, url: string, alt: string) => {
    const tag = `<img src="${url}" alt="${alt}" class="w-full h-auto object-cover rounded-xl" />`;
    navigator.clipboard.writeText(tag);
    setCopiedKey(key + '-tag');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-5 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-between border-b border-[#e9edff] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#006b2c] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">link</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">
                Links Diretos das Imagens para HTML
              </h3>
              <p className="text-[11px] text-[#6e7b6c]">
                Copie a URL direta ou a tag &lt;img /&gt; pronta para colar no seu código HTML/PHP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f3ff] hover:bg-[#e9edff] flex items-center justify-center text-[#3e4a3d] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* List of images */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
          {imageList.map((img) => (
            <div
              key={img.key}
              className="p-3 rounded-2xl bg-[#f1f3ff] border border-[#e9edff] flex items-center justify-between gap-3 hover:bg-white hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shadow-xs shrink-0 border border-[#e9edff] flex items-center justify-center">
                  <img
                    src={img.url}
                    alt={img.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#e9edff] text-[#006b2c] px-2 py-0.5 rounded-full">
                      {img.categoria}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#141b2b] truncate mt-0.5">
                    {img.titulo}
                  </h4>
                  <p className="text-[10px] text-[#6e7b6c] truncate max-w-xs font-mono">
                    {img.url}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopyUrl(img.key, img.url)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#e9edff] text-[#141b2b] text-[11px] font-bold border border-[#e9edff] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#006b2c]">
                    {copiedKey === img.key ? 'done' : 'content_copy'}
                  </span>
                  <span>{copiedKey === img.key ? 'Copiado!' : 'Copiar URL'}</span>
                </button>

                <button
                  onClick={() => handleCopyImgTag(img.key, img.url, img.titulo)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  title="Copiar tag <img> completa"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedKey === img.key + '-tag' ? 'done' : 'code'}
                  </span>
                  <span>{copiedKey === img.key + '-tag' ? 'Tag Copiada!' : 'Tag <img>'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#e9edff] flex items-center justify-between text-xs text-[#6e7b6c] shrink-0">
          <span>Imagens hospedadas em CDN de alta performance com HTTPS ativo.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f1f3ff] hover:bg-[#e9edff] text-[#141b2b] font-bold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
