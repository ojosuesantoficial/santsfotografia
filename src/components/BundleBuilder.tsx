import React, { useState } from 'react';
import { ShoppingBag, Plus, Check, Gift, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { formatBRL, DISCOUNT_CONFIG, triggerConfetti } from '../utils/format';

interface BundleBuilderProps {
  onAddMultipleToCart: (products: Product[]) => void;
  onShowToast: (msg: string) => void;
}

export const BundleBuilder: React.FC<BundleBuilderProps> = ({
  onAddMultipleToCart,
  onShowToast,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['p1', 'p2']);

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      const next = [...selectedIds, id];
      setSelectedIds(next);
      if (next.length === DISCOUNT_CONFIG.minItems) {
        triggerConfetti();
        onShowToast('Parabéns! Você desbloqueou 30% de desconto no pacote!');
      }
    }
  };

  const selectedProducts = PRODUCTS.filter((p) => selectedIds.includes(p.id));
  const subtotal = selectedProducts.reduce((acc, p) => acc + p.price, 0);
  const isDiscountUnlocked = selectedProducts.length >= DISCOUNT_CONFIG.minItems;
  const discountAmount = isDiscountUnlocked ? subtotal * DISCOUNT_CONFIG.percent : 0;
  const finalTotal = subtotal - discountAmount;
  const progressPercent = Math.min(100, (selectedProducts.length / DISCOUNT_CONFIG.minItems) * 100);

  const handleAddBundleToCart = () => {
    if (selectedProducts.length === 0) return;
    onAddMultipleToCart(selectedProducts);
    onShowToast(`${selectedProducts.length} itens adicionados à sacola!`);
  };

  return (
    <section id="monte-seu-pacote-section" className="py-16 sm:py-24 bg-white border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
            <span className="w-6 h-[1.5px] bg-[#A6825B]" />
            <span>Monte seu pacote</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] mt-3">
            Construa seu <em className="text-[#A6825B] font-medium not-italic">álbum</em>
          </h2>
          <p className="text-base text-[#666666] mt-3">
            A personalização é sua. Escolha diferentes produtos e monte uma coleção com <strong className="text-[#A6825B]">30% OFF</strong> ao atingir 3 itens.
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Products Selector List */}
          <div className="lg:col-span-7 space-y-4">
            {PRODUCTS.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer ${
                    isSelected
                      ? 'border-[#A6825B] bg-[#FAF8F5] shadow-md shadow-amber-900/5'
                      : 'border-[#EAE8E4] bg-white hover:border-[#D0CDC7]'
                  }`}
                >
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#ECEAE6] flex-shrink-0">
                    <img
                      src={product.galleryImages[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                        {product.photos} fotos digitais
                      </span>
                    </div>
                    <h3 className="font-display font-medium text-sm sm:text-base text-[#111111] truncate mt-0.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#666666] line-clamp-1 mt-1 hidden sm:block">
                      {product.desc}
                    </p>
                    <span className="text-sm sm:text-base font-bold text-[#111111] block mt-1.5 font-sans">
                      {formatBRL(product.price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProduct(product.id);
                    }}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#A6825B] text-white'
                        : 'bg-[#F4F2EE] hover:bg-[#111111] hover:text-white text-[#111111]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">No Pacote</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Adicionar</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bundle Summary Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#FAF9F7] rounded-2xl p-6 border-2 border-[#EAE8E4] shadow-lg">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE8E4]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-[#111111]">
                      Resumo do Pacote
                    </h4>
                    <span className="text-xs text-[#777777]">
                      {selectedProducts.length} {selectedProducts.length === 1 ? 'ensaio selecionado' : 'ensaios selecionados'}
                    </span>
                  </div>
                </div>

                <span className="font-display font-bold text-2xl text-[#111111]">
                  {selectedProducts.length} / {DISC_COUNT}
                </span>
              </div>

              {/* Progress Bar towards 30% OFF */}
              <div className="my-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#555555]">Progresso para 30% OFF</span>
                  <span className="font-bold text-[#A6825B]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-3 w-full bg-[#EAE8E4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A6825B] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#777777] italic">
                  {isDiscountUnlocked ? (
                    <span className="text-[#A6825B] font-bold not-italic flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Desconto de 30% ativado com sucesso!
                    </span>
                  ) : (
                    `Adicione mais ${DISCOUNT_CONFIG.minItems - selectedProducts.length} ensaio(s) para liberar 30% de desconto.`
                  )}
                </p>
              </div>

              {/* Selected items breakdown */}
              <div className="space-y-2 py-4 border-t border-b border-[#EAE8E4] max-h-48 overflow-y-auto pr-1">
                {selectedProducts.length === 0 ? (
                  <p className="text-xs text-[#999999] text-center py-4">
                    Nenhum produto selecionado ainda. Clique nos itens ao lado para montar seu pacote.
                  </p>
                ) : (
                  selectedProducts.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-[#444444]">
                      <span className="truncate pr-2">{item.name}</span>
                      <span className="font-semibold text-[#111111] flex-shrink-0">
                        {formatBRL(item.price)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Pricing Totals */}
              <div className="space-y-2 pt-4 text-sm">
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>

                {isDiscountUnlocked && (
                  <div className="flex justify-between text-[#A6825B] font-semibold">
                    <span>Desconto Combo (30% OFF)</span>
                    <span>- {formatBRL(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold text-[#111111] pt-2 border-t border-[#EAE8E4]">
                  <span>Total</span>
                  <span className="text-[#A6825B]">{formatBRL(finalTotal)}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                disabled={selectedProducts.length === 0}
                onClick={handleAddBundleToCart}
                className="w-full mt-6 bg-[#A6825B] hover:bg-[#94724C] disabled:bg-[#CCCCCC] disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-amber-900/10 hover:shadow-amber-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar Pacote à Sacola</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

const DISC_COUNT = 3;
