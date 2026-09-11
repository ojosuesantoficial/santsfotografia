import React from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, Gift, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { formatBRL, DISCOUNT_CONFIG } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onNavigateToProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onNavigateToProducts,
}) => {
  if (!isOpen) return null;

  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isDiscountUnlocked = totalUnits >= DISCOUNT_CONFIG.minItems;
  const discountAmount = isDiscountUnlocked ? subtotal * DISCOUNT_CONFIG.percent : 0;
  const finalTotal = subtotal - discountAmount;
  const missingItems = Math.max(0, DISCOUNT_CONFIG.minItems - totalUnits);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E6E2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#A6825B]" />
              <h3 className="font-display text-xl font-medium text-[#111111]">
                Sua <em className="text-[#A6825B] not-italic">sacola</em>
              </h3>
              <span className="text-xs font-bold text-[#777777] bg-[#F4F2EE] px-2 py-0.5 rounded-full">
                {totalUnits}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar sacola"
              className="w-9 h-9 rounded-xl hover:bg-[#F4F2EE] flex items-center justify-center text-[#777777] hover:text-[#111111] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 30% Promo Progress Strip */}
          {totalUnits > 0 && (
            <div className="bg-[#FAF9F7] px-6 py-3.5 border-b border-[#E8E6E2]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                {isDiscountUnlocked ? (
                  <span className="font-bold text-[#A6825B] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    Parabéns! 30% OFF aplicado na sacola
                  </span>
                ) : (
                  <span className="text-[#555555]">
                    Falta <strong>{missingItems} {missingItems === 1 ? 'item' : 'itens'}</strong> para liberar <strong>30% OFF</strong>
                  </span>
                )}
                <span className="font-bold text-[#111111]">
                  {Math.min(100, Math.round((totalUnits / DISCOUNT_CONFIG.minItems) * 100))}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#EAE8E4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A6825B] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (totalUnits / DISCOUNT_CONFIG.minItems) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-display font-medium text-xl text-[#111111]">
                  Sua sacola está vazia
                </h4>
                <p className="text-xs text-[#777777] max-w-xs mt-1">
                  Explore nossos ensaios e comece a criar memórias hiper-realistas agora mesmo.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToProducts();
                  }}
                  className="mt-6 bg-[#111111] hover:bg-[#A6825B] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Ver todos os produtos
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-xl border border-[#EAE8E4] bg-white flex gap-4 items-center shadow-sm"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#ECEAE6] flex-shrink-0">
                    <img
                      src={
                        item.product.coverImage ||
                        item.product.galleryImages?.[0] ||
                        item.product.gallery?.[0] ||
                        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm text-[#111111] truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-[#777777] block mt-0.5">
                      {item.product.photos} fotos · Download Digital
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#111111] block mt-1">
                      {formatBRL(item.product.price * item.quantity)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      aria-label="Remover item"
                      className="text-[#999999] hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#E0DCD6] rounded-lg overflow-hidden bg-[#FAF9F7]">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-[#555555] hover:bg-[#F3EFEA] hover:text-[#A6825B] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#555555] hover:bg-[#F3EFEA] hover:text-[#A6825B] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#E8E6E2] bg-[#FAF9F7] space-y-4">
              <div className="space-y-1.5 text-xs text-[#555555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>

                {isDiscountUnlocked && (
                  <div className="flex justify-between font-semibold text-[#A6825B]">
                    <span>Desconto Cesta (30% OFF)</span>
                    <span>- {formatBRL(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#EAE8E4]">
                  <span>Total</span>
                  <span className="text-[#A6825B]">{formatBRL(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full bg-[#A6825B] hover:bg-[#94724C] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-amber-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full text-center text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-[#111111] py-1 transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
