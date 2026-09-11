import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { formatBRL } from '../utils/format';

interface PremiumShowcaseProps {
  onSelectProduct: (product: Product) => void;
}

export const PremiumShowcase: React.FC<PremiumShowcaseProps> = ({ onSelectProduct }) => {
  const premiumProducts = [PRODUCTS[1], PRODUCTS[3]]; // Luxury Birthday & Paris

  return (
    <section id="premium-showcase-section" className="py-16 sm:py-24 bg-[#F8F7F5] border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coleção Premium</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] mt-3">
            Produtos Premium · Download <em className="text-[#A6825B] font-medium not-italic">Instantâneo</em>
          </h2>
          <p className="text-base text-[#666666] mt-3">
            Fotos produzidas para transformar seus momentos em memórias dignas de capa de revista.
          </p>
        </div>

        {/* 2-Column High-End Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {premiumProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-[#111111] text-white aspect-[16/11]"
            >
              <img
                src={product.galleryImages[1] || product.galleryImages[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-95"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Floating Bottom Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md text-[#111111] p-6 rounded-2xl shadow-xl flex items-center justify-between gap-4 transition-transform group-hover:-translate-y-1">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6825B] block">
                    {product.photos} Fotos · Direção Editorial
                  </span>
                  <h3 className="font-display font-medium text-lg sm:text-xl text-[#111111] truncate mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#666666] line-clamp-1 mt-0.5">
                    {product.desc.split('.')[0]}.
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-lg sm:text-xl font-bold text-[#111111] block font-sans">
                    {formatBRL(product.price)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#A6825B] uppercase tracking-wider mt-1">
                    <span>Ver ensaio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
