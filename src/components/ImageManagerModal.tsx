import React, { useState } from 'react';
import { X, Image as ImageIcon, Check, RotateCcw, Sparkles } from 'lucide-react';
import { DEFAULT_IMAGES } from '../data/products';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onReload: () => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onReload,
}) => {
  if (!isOpen) return null;

  const imageCategories = [
    {
      group: 'Hero Flutuante',
      items: [
        { key: 'heroAni', label: 'Hero 1 · Aniversário' },
        { key: 'heroCas', label: 'Hero 2 · Casal' },
        { key: 'heroTur', label: 'Hero 3 · Turismo Paris' },
        { key: 'heroRet', label: 'Hero 4 · Retrato Estúdio' },
      ],
    },
    {
      group: 'Produtos da Loja',
      items: [
        { key: 'aniBlackA', label: 'Aniversário 20 Black (Principal)' },
        { key: 'aniLuxA', label: 'Aniversário 50 Luxury (Principal)' },
        { key: 'casal25A', label: 'Álbum Casal 25 (Principal)' },
        { key: 'paris20A', label: 'Álbum Paris 20 (Principal)' },
      ],
    },
    {
      group: 'Categorias e Banners',
      items: [
        { key: 'believe', label: 'Banner "Nós Acreditamos"' },
        { key: 'catTodos', label: 'Categoria: Todos os Produtos' },
        { key: 'catAni', label: 'Categoria: Aniversário' },
        { key: 'catTur', label: 'Categoria: Turismo' },
        { key: 'catCas', label: 'Categoria: Casal' },
      ],
    },
  ];

  const handleSave = (key: string, url: string) => {
    if (!url.trim()) {
      localStorage.removeItem(`mfia_img_${key}`);
    } else {
      localStorage.setItem(`mfia_img_${key}`, url.trim());
    }
    onShowToast(`Imagem "${key}" atualizada!`);
    onReload();
  };

  const handleResetAll = () => {
    Object.keys(DEFAULT_IMAGES).forEach((k) => {
      localStorage.removeItem(`mfia_img_${k}`);
    });
    onShowToast('Todas as fotos foram restauradas para os padrões originais.');
    onReload();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8E6E2] overflow-hidden my-auto max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E8E6E2] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-medium text-xl text-[#111111]">
                Gerenciador de Links de Imagens
              </h3>
              <p className="text-xs text-[#777777]">
                Cole URLs personalizadas da loja Shopify se desejar alterar qualquer foto
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 rounded-xl hover:bg-[#F4F2EE] flex items-center justify-center text-[#777777] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-[#EAE8E4] text-xs text-[#555555] space-y-1">
            <p className="font-bold text-[#111111] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#A6825B]" />
              Como usar:
            </p>
            <p>
              1. Acesse <code>https://momentosfotosia.myshopify.com/</code>
            </p>
            <p>2. Clique com botão direito na foto desejada → "Copiar endereço da imagem"</p>
            <p>3. Cole no campo correspondente abaixo e clique no botão de salvar.</p>
          </div>

          {imageCategories.map((cat, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="font-display font-bold text-lg text-[#111111] border-b border-[#EAE8E4] pb-2">
                {cat.group}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cat.items.map((item) => {
                  const currentValue =
                    localStorage.getItem(`mfia_img_${item.key}`) || DEFAULT_IMAGES[item.key] || '';

                  return (
                    <div
                      key={item.key}
                      className="p-4 bg-[#FAF9F7] rounded-2xl border border-[#EAE8E4] space-y-2"
                    >
                      <label className="block text-xs font-bold text-[#111111]">
                        {item.label}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          defaultValue={currentValue}
                          id={`input_${item.key}`}
                          placeholder="https://..."
                          className="flex-1 bg-white border border-[#D0CDC7] rounded-xl px-3 py-2 text-xs text-[#111111] outline-none focus:border-[#A6825B]"
                        />
                        <button
                          onClick={() => {
                            const val = (
                              document.getElementById(`input_${item.key}`) as HTMLInputElement
                            )?.value;
                            handleSave(item.key, val);
                          }}
                          className="bg-[#111111] hover:bg-[#A6825B] text-white p-2 rounded-xl text-xs transition-colors cursor-pointer"
                          title="Salvar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E8E6E2] bg-[#FAF9F7] flex items-center justify-between">
          <button
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#888888] hover:text-[#A6825B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Fotos Originais</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#111111] hover:bg-[#A6825B] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
