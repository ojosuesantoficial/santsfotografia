import React, { useState } from 'react';
import { X, Sparkles, Heart, Globe, Cake, ArrowRight, ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';
import { formatBRL } from '../utils/format';

interface AiWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const AiWizardModal: React.FC<AiWizardModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onSelectProduct,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCat, setSelectedCat] = useState<ProductCategory>('aniversario');
  const [ideaText, setIdeaText] = useState('');

  if (!isOpen) return null;

  const categoryOptions = [
    {
      id: 'aniversario' as ProductCategory,
      title: 'Aniversário',
      desc: 'Idade especial, balões pretos e dourados, looks de gala ou festa íntima',
      icon: Cake,
    },
    {
      id: 'casal' as ProductCategory,
      title: 'Casal',
      desc: 'Momentos românticos, luz do pôr do sol, abraços carinhosos em cidades do mundo',
      icon: Heart,
    },
    {
      id: 'turismo' as ProductCategory,
      title: 'Turismo',
      desc: 'Paris, Torre Eiffel, cafés europeus, monumentos famosos e poses espontâneas',
      icon: Globe,
    },
  ];

  const examplePrompts: Partial<Record<ProductCategory, string>> = {
    aniversario:
      'Ensaio de 30 anos com iluminação de estúdio preta e dourada, vestido elegante, balões metalizados e champagne.',
    casal:
      'Casal apaixonado caminhando pelas ruas de Paris ao entardecer, casacos elegantes de inverno, clima cinematográfico.',
    turismo:
      'Eu na frente da Torre Eiffel à noite com luzes cintilantes, casaco sobretudo preto, pose espontânea com café na mão.',
    profissional:
      'Ensaio executivo em estúdio com blazer neutro, iluminação suave e postura de autoridade.',
    infantil:
      'Ensaio infantil com tema lúdico, cores suaves e iluminação natural de estúdio.',
    fitness:
      'Ensaio atlético em academia moderna com iluminação dramática e sportswear de alta performance.',
    moda:
      'Ensaio editorial de moda urbana com looks de alta costura e atmosfera cosmopolita.',
  };

  // Determine best matching recommendation
  const recommendedProduct =
    PRODUCTS.find((p) => p.cat === selectedCat && p.badgeType === 'best') ||
    PRODUCTS.find((p) => p.cat === selectedCat) ||
    PRODUCTS[0];

  const handleNext = () => {
    if (step === 1) {
      if (!ideaText) setIdeaText(examplePrompts[selectedCat]);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleFillExample = () => {
    setIdeaText(examplePrompts[selectedCat]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8E6E2] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E8E6E2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-medium text-xl text-[#111111]">
                Assistente de Criação IA
              </h3>
              <span className="text-xs text-[#777777]">
                Passo {step} de 3
              </span>
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

        {/* Step Progress Indicators */}
        <div className="flex px-6 pt-4 gap-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step >= num ? 'bg-[#A6825B]' : 'bg-[#EAE8E4]'
              }`}
            />
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A6825B] block mb-1">
                  Passo 1
                </span>
                <h4 className="font-display font-normal text-2xl text-[#111111]">
                  Qual momento você deseja eternizar?
                </h4>
                <p className="text-xs sm:text-sm text-[#666666] mt-1">
                  Selecione o tema principal para o seu ensaio fotográfico personalizado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedCat === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedCat(opt.id);
                        setIdeaText(examplePrompts[opt.id]);
                      }}
                      className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#A6825B] bg-[#FAF8F5] shadow-md shadow-amber-900/5'
                          : 'border-[#EAE8E4] bg-white hover:border-[#D0CDC7]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-display font-bold text-base text-[#111111]">
                          {opt.title}
                        </h5>
                        <p className="text-[11px] text-[#777777] mt-1 line-clamp-3">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A6825B] block mb-1">
                  Passo 2
                </span>
                <h4 className="font-display font-normal text-2xl text-[#111111]">
                  Conte a sua ideia ou cenário dos sonhos
                </h4>
                <p className="text-xs sm:text-sm text-[#666666] mt-1">
                  Descreva as roupas, iluminação, cores ou detalhes que você imagina.
                </p>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Ex: Aniversário de 30 anos com luzes douradas e pretas, vestido de gala..."
                  className="w-full bg-[#FAF9F7] border-2 border-[#E8E6E2] focus:border-[#A6825B] rounded-2xl p-4 text-sm text-[#111111] placeholder-[#888888] outline-none transition-colors"
                />

                <div className="mt-2 flex items-center justify-between text-xs text-[#777777]">
                  <button
                    onClick={handleFillExample}
                    className="text-[#A6825B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Preencher com ideia de exemplo
                  </button>
                  <span>{ideaText.length} caracteres</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A6825B] block mb-1">
                  Passo 3 · Pronto!
                </span>
                <h4 className="font-display font-normal text-2xl text-[#111111]">
                  Sua ideia está pronta para virar foto
                </h4>
                <p className="text-xs sm:text-sm text-[#666666] mt-1">
                  Com base no seu perfil, este é o ensaio perfeito para o seu resultado final.
                </p>
              </div>

              {/* Quote from user */}
              <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-[#EAE8E4] italic text-xs sm:text-sm text-[#444444] font-display">
                “{ideaText || examplePrompts[selectedCat]}”
              </div>

              {/* Recommended Product Preview Card */}
              <div className="p-4 rounded-2xl border-2 border-[#A6825B] bg-[#FAF8F5] flex items-center gap-4">
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#ECEAE6] flex-shrink-0">
                  <img
                    src={recommendedProduct.galleryImages[0]}
                    alt={recommendedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6825B]">
                    Recomendado para você · {recommendedProduct.photos} Fotos
                  </span>
                  <h5 className="font-display font-bold text-base text-[#111111] truncate mt-0.5">
                    {recommendedProduct.name}
                  </h5>
                  <p className="text-xs text-[#666666] line-clamp-1 mt-0.5">
                    {recommendedProduct.desc}
                  </p>
                  <span className="text-base font-bold text-[#111111] block mt-1 font-sans">
                    {formatBRL(recommendedProduct.price)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 border-t border-[#E8E6E2] bg-[#FAF9F7] flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D0CDC7] hover:bg-white text-xs font-bold uppercase tracking-wider text-[#111111] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-[#A6825B] hover:bg-[#94724C] text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-900/10 transition-all cursor-pointer"
            >
              <span>Avançar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onSelectProduct(recommendedProduct);
                  onClose();
                }}
                className="px-5 py-3 rounded-xl border border-[#111111] hover:bg-[#111111] hover:text-white text-xs font-bold uppercase tracking-wider text-[#111111] transition-all cursor-pointer"
              >
                Ver Detalhes
              </button>
              <button
                onClick={() => {
                  onAddToCart(recommendedProduct);
                  onClose();
                }}
                className="inline-flex items-center gap-2 bg-[#A6825B] hover:bg-[#94724C] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-900/15 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar à Sacola</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
