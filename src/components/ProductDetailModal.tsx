import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, ShieldCheck, Download, Sparkles, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { formatBRL } from '../utils/format';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const rawGallery =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : product.gallery && product.gallery.length > 0
      ? product.gallery
      : [
          product.coverImage ||
            'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
        ];

  const currentImage = rawGallery[activeImageIndex] || rawGallery[0];
  const photoCount = product.photoCount || product.photos || 20;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#E8E6E2] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#E8E6E2] flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à loja</span>
          </button>
          
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 rounded-xl hover:bg-[#F4F2EE] flex items-center justify-center text-[#777777] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-10">
          
          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-[4/4.5] rounded-2xl overflow-hidden bg-[#ECEAE6] border border-[#EAE8E4] shadow-md relative">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#A6825B] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {rawGallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#A6825B] shadow-sm ring-2 ring-[#A6825B]/20'
                        : 'border-[#EAE8E4] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info and Actions Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A6825B]">
                    {product.cat || product.category} · {photoCount} fotos
                  </span>
                  <span className="text-[#CCCCCC]">·</span>
                  <div className="flex items-center gap-1 text-xs text-[#666666]">
                    <Star className="w-3.5 h-3.5 fill-[#A6825B] text-[#A6825B]" />
                    <span className="font-semibold">{product.rating}</span>
                    <span>({product.reviews} avaliações)</span>
                  </div>
                </div>

                <h1 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-[#111111] mt-2 leading-tight">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-display font-bold text-3xl sm:text-4xl text-[#111111] font-sans">
                    {formatBRL(product.price)}
                  </span>
                  <span className="text-xs text-[#777777] uppercase tracking-wider">
                    Produto Digital · Sem Frete
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                {product.desc}
              </p>

              {/* Included Features Checklist */}
              {product.features && (
                <div className="bg-[#FAF9F7] p-5 rounded-2xl border border-[#EAE8E4] space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#A6825B]" />
                    O que está incluído no ensaio:
                  </h4>
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#444444]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A6825B] mt-1.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">
                  Quantidade:
                </span>
                <div className="flex items-center border-2 border-[#E0DCD6] rounded-xl overflow-hidden bg-[#FAF9F7]">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    className="w-9 h-9 flex items-center justify-center text-[#555555] hover:bg-[#F3EFEA] hover:text-[#A6825B] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#111111]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(1)}
                    className="w-9 h-9 flex items-center justify-center text-[#555555] hover:bg-[#F3EFEA] hover:text-[#A6825B] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar à Sacola</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="bg-[#A6825B] hover:bg-[#94724C] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-amber-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Comprar Agora</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-2 border-t border-[#EAE8E4] grid grid-cols-2 gap-3 text-xs text-[#666666]">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#A6825B] flex-shrink-0" />
                  <span>Download instantâneo</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#A6825B] flex-shrink-0" />
                  <span>Compra 100% segura</span>
                </div>
              </div>

            </div>

          </div>

          {/* Related Products */}
          <div className="pt-8 border-t border-[#E8E6E2]">
            <h3 className="font-display font-medium text-xl text-[#111111] mb-6">
              Você também pode <em className="text-[#A6825B] not-italic">gostar</em>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectProduct(rel);
                    setActiveImageIndex(0);
                    setQuantity(1);
                  }}
                  className="p-3 bg-[#FAF9F7] rounded-2xl border border-[#EAE8E4] hover:border-[#A6825B] transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-16 h-18 rounded-xl overflow-hidden bg-[#ECEAE6] flex-shrink-0">
                    <img
                      src={rel.galleryImages[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-medium text-xs text-[#111111] truncate group-hover:text-[#A6825B]">
                      {rel.name}
                    </h4>
                    <span className="text-xs font-bold text-[#111111] block mt-1">
                      {formatBRL(rel.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
