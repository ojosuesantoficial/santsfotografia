import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { matchCategory } from '../utils/category';

interface OffersCarouselProps {
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export const OffersCarousel: React.FC<OffersCarouselProps> = ({
  onAddToCart,
  onSelectProduct,
  products = INITIAL_PRODUCTS,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const productList = products && products.length > 0 ? products : INITIAL_PRODUCTS;

  const filteredProducts =
    activeFilter === 'todos'
      ? productList
      : productList.filter((p) => matchCategory(p.category || p.cat, activeFilter));

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth',
    });
  };

  const filterTabs = [
    { key: 'todos', label: 'Todos' },
    { key: 'aniversario', label: 'Aniversários' },
    { key: 'turismo', label: 'Turismo' },
    { key: 'casal', label: 'Casal' },
  ];


  return (
    <section id="ofertas-section" className="py-16 sm:py-24 bg-white border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Carousel Header with Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
              <Tag className="w-3.5 h-3.5" />
              <span>Ofertas</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] mt-3">
              Ofertas selecionadas <em className="text-[#A6825B] font-medium not-italic">para você</em>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Anterior"
              className="w-11 h-11 rounded-xl border border-[#D8D4CD] hover:border-[#111111] hover:bg-[#111111] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Próximo"
              className="w-11 h-11 rounded-xl border border-[#D8D4CD] hover:border-[#111111] hover:bg-[#111111] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === tab.key
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-[#F4F2EE] text-[#555555] hover:text-[#111111] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-none"
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[300px] md:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start"
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
