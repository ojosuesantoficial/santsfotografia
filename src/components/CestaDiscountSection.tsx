import React from 'react';
import { Gift, Check, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data/products';
import { formatBRL, DISCOUNT_CONFIG, triggerConfetti } from '../utils/format';

interface CestaDiscountSectionProps {
  cartItems: CartItem[];
  onToggleCartItem: (product: Product) => void;
  onOpenCart: () => void;
  onShowToast: (msg: string) => void;
}

export const CestaDiscountSection: React.FC<CestaDiscountSectionProps> = ({
  cartItems = [],
  onToggleCartItem,
  onOpenCart,
  onShowToast,
}) => {
  const safeItems = Array.isArray(cartItems) ? cartItems : [];
  const totalUnits = safeItems.reduce((acc, item) => acc + item.quantity, 0);
  const isUnlocked = totalUnits >= DISCOUNT_CONFIG.minItems;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, totalUnits / DISCOUNT_CONFIG.minItems);
  const strokeDashoffset = circumference * (1 - progressRatio);

  const subtotal = safeItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = isUnlocked ? subtotal * DISCOUNT_CONFIG.percent : 0;
  const finalTotal = subtotal - discount;

  const handleToggle = (product: Product) => {
    const isAlreadyIn = safeItems.some((i) => i.product.id === product.id);
    if (onToggleCartItem) onToggleCartItem(product);

    if (!isAlreadyIn && totalUnits + 1 === DISCOUNT_CONFIG.minItems) {
      triggerConfetti();
      if (onShowToast) onShowToast('30% de desconto desbloqueado na cesta!');
    }
  };

  return (
    <section id="cesta-section" className="py-16 sm:py-24 bg-[#F8F7F5] border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
            <Gift className="w-3.5 h-3.5" />
            <span>Cesta com Desconto Especial</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] mt-3">
            Adicione à <em className="text-[#A6825B] font-medium not-italic">cesta</em>
          </h2>
          <p className="text-base text-[#666666] mt-3">
            Adicione 3 produtos à sua sacola e garanta <strong className="text-[#A6825B]">30% de desconto imediato</strong>. O contador acompanha sua cesta em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Radial Meter Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-8 border border-[#E8E6E2] shadow-lg text-center flex flex-col items-center justify-center">
            
            {/* SVG Radial Meter */}
            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-[#EAE8E4]"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-[#A6825B] transition-all duration-700 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-4xl text-[#111111]">
                  {totalUnits}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#777777]">
                  de {DISCOUNT_CONFIG.minItems} itens
                </span>
              </div>
            </div>

            {/* Unlocked / Missing alert */}
            {isUnlocked ? (
              <div className="mt-4 bg-[#A6825B]/10 border border-[#A6825B]/20 text-[#A6825B] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-bounce">
                <Sparkles className="w-4 h-4" />
                <span>30% OFF Desbloqueado!</span>
              </div>
            ) : (
              <p className="text-xs text-[#777777] mt-3">
                Faltam <strong>{Math.max(0, DISCOUNT_CONFIG.minItems - totalUnits)}</strong> produto(s) para liberar o desconto.
              </p>
            )}

            {totalUnits > 0 && (
              <div className="w-full mt-6 pt-5 border-t border-[#EAE8E4] flex flex-col items-center">
                <span className="text-xs text-[#888888] uppercase tracking-wider">Total com cesta</span>
                <span className="text-2xl font-bold text-[#111111] mt-1 font-sans">
                  {formatBRL(finalTotal)}
                </span>
              </div>
            )}

            <button
              onClick={onOpenCart}
              className="w-full mt-6 bg-[#111111] hover:bg-[#A6825B] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{totalUnits > 0 ? 'Ver Sacola' : 'Abrir Sacola'}</span>
            </button>
          </div>

          {/* Product Items List */}
          <div className="lg:col-span-8 space-y-4">
            {PRODUCTS.map((product) => {
              const inCart = cartItems.find((i) => i.product.id === product.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-2xl border border-[#E8E6E2] shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#ECEAE6] flex-shrink-0">
                    <img
                      src={product.galleryImages[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                      {product.photos} fotos digitais
                    </span>
                    <h3 className="font-display font-medium text-sm sm:text-base text-[#111111] truncate mt-0.5">
                      {product.name}
                    </h3>
                    <span className="text-sm sm:text-base font-bold text-[#111111] block mt-1 font-sans">
                      {formatBRL(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggle(product)}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
                      qty > 0
                        ? 'bg-[#A6825B]/10 text-[#A6825B] border border-[#A6825B]'
                        : 'bg-[#111111] hover:bg-[#A6825B] text-white'
                    }`}
                  >
                    {qty > 0 ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Na Cesta ({qty})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Adicionar à Cesta</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
