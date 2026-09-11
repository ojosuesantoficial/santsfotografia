import React from 'react';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatBRL } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
}) => {
  const getBadgeStyle = () => {
    switch (product.badgeType) {
      case 'best':
        return 'bg-[#A6825B] text-white';
      case 'cheap':
        return 'bg-white text-[#221F1B] border border-[#DED7CA]';
      case 'new':
        return 'bg-[#221F1B] text-white';
      default:
        return 'bg-[#A6825B] text-white';
    }
  };

  const coverImage =
    product.coverImage ||
    product.galleryImages?.[0] ||
    product.gallery?.[0] ||
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#EAE8E4] transition-all duration-300 flex flex-col cursor-pointer"
      onClick={() => onSelectProduct(product)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/4.6] bg-[#ECEAE6] overflow-hidden">
        <img
          src={coverImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span
              className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm ${getBadgeStyle()}`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View and Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-[#111111] text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver fotos</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, e);
            }}
            aria-label={`Adicionar ${product.name} à sacola`}
            className="bg-[#A6825B] hover:bg-[#94724C] text-white p-2.5 rounded-xl shadow-md flex items-center justify-center transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              {product.photoCount || product.photos || 10} fotos digitais
            </span>
            <div className="flex items-center gap-1 text-xs text-[#666666]">
              <Star className="w-3 h-3 fill-[#A6825B] text-[#A6825B]" />
              <span className="font-semibold">{product.rating}</span>
            </div>
          </div>

          <h3 className="font-display font-medium text-base sm:text-lg text-[#221F1B] mt-1.5 leading-snug group-hover:text-[#A6825B] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing and Action row */}
        <div className="mt-4 pt-3 border-t border-[#F0EEEB] flex items-center justify-between gap-2">
          <div>
            <span className="text-lg sm:text-xl font-bold text-[#221F1B] font-sans">
              {formatBRL(product.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, e);
            }}
            className="inline-flex items-center gap-1.5 bg-[#221F1B] hover:bg-[#A6825B] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
