import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { formatBRL } from '../utils/format';
import { normalizeCategory, formatCategoryLabel } from '../utils/category';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products = INITIAL_PRODUCTS,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularTags = ['Aniversário', 'Luxury', 'Casal', 'Paris', 'Black', 'Romântico', 'Turismo'];

  const normalizedQuery = normalizeCategory(query);

  const productList = products && products.length > 0 ? products : INITIAL_PRODUCTS;

  const filteredProducts = normalizedQuery
    ? productList.filter((p) => {
        const name = normalizeCategory(p.name);
        const category = normalizeCategory(p.category || p.cat);
        const desc = normalizeCategory(p.description || p.desc);
        const badge = normalizeCategory(p.badge);
        const tags = (p.tags || []).map((t) => normalizeCategory(t)).join(' ');

        return (
          name.includes(normalizedQuery) ||
          category.includes(normalizedQuery) ||
          desc.includes(normalizedQuery) ||
          badge.includes(normalizedQuery) ||
          tags.includes(normalizedQuery)
        );
      })
    : productList;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8E6E2] overflow-hidden">
        
        {/* Search Header */}
        <div className="p-6 border-b border-[#E8E6E2] flex items-center justify-between gap-4">
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-[#888888] absolute left-4 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por aniversário, Paris, casal, luxury..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#FAF9F7] border-2 border-[#E8E6E2] focus:border-[#A6825B] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[#111111] placeholder-[#888888] outline-none transition-colors"
            />
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar busca"
            className="w-10 h-10 rounded-xl hover:bg-[#F4F2EE] flex items-center justify-center text-[#777777] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion pills */}
        <div className="px-6 py-3 bg-[#FAF9F7] border-b border-[#E8E6E2] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] whitespace-nowrap">
            Sugestões:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white text-[#555555] hover:text-[#A6825B] hover:border-[#A6825B] border border-[#E0DCD6] whitespace-nowrap transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-[#888888]">
              <p className="font-display font-medium text-lg text-[#111111]">
                Nenhum ensaio encontrado para "{query}"
              </p>
              <p className="text-xs mt-1">
                Tente buscar por termos como "aniversário", "casal", "Paris" ou "luxury".
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const imageSrc =
                product.coverImage ||
                (product.galleryImages && product.galleryImages[0]) ||
                (product.gallery && product.gallery[0]) ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
              const photoCount = product.photoCount || product.photos || 20;
              const displayCat = formatCategoryLabel(product.category || product.cat);

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl hover:bg-[#FAF9F7] border border-transparent hover:border-[#E8E6E2] transition-all flex items-center gap-4 cursor-pointer group"
                >
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#ECEAE6] flex-shrink-0">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6825B]">
                      {photoCount} fotos · {displayCat}
                    </span>
                    <h4 className="font-display font-medium text-sm sm:text-base text-[#111111] truncate group-hover:text-[#A6825B] transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-[#777777] mt-0.5">
                      <Star className="w-3 h-3 fill-[#A6825B] text-[#A6825B]" />
                      <span>{product.rating || 4.9} ({product.reviewsCount || product.reviews || 100} avaliações)</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <span className="font-bold text-sm sm:text-base text-[#111111] font-sans">
                      {formatBRL(product.price)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#888888] group-hover:text-[#A6825B] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

