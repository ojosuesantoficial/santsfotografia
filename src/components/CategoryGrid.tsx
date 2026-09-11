import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { CATEGORIES, UPCOMING_CATEGORIES, getImage } from '../data/products';

interface CategoryGridProps {
  onSelectCategory: (categoryKey: string) => void;
  onShowToast: (msg: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, onShowToast }) => {
  return (
    <section id="categories-section" className="py-16 sm:py-24 bg-white border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
            <span className="w-6 h-[1.5px] bg-[#A6825B]" />
            <span>Categorias</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#221F1B] mt-3 tracking-tight">
            Encontre o seu <em className="text-[#A6825B] font-medium not-italic">momento</em>
          </h2>
          <p className="text-base text-[#666057] mt-3">
            Escolha uma categoria e transforme sua ideia em uma experiência visual inesquecível.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card: Todos os produtos (Wide span) */}
          <div
            onClick={() => onSelectCategory('todos')}
            className="group relative md:col-span-2 md:row-span-2 h-[340px] md:h-[480px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-[#ECE9E4]"
          >
            <img
              src={getImage('catTodos')}
              alt="Todos os Produtos"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-transform group-hover:-translate-y-1 border border-[#E8E2D7]">
              <h3 className="font-display font-medium text-2xl text-[#221F1B]">
                Todos os Produtos
              </h3>
              <p className="text-xs sm:text-sm text-[#666057] mt-1">
                Veja todos os nossos álbuns e ensaios fotográficos com IA
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A6825B]">
                <span>Explorar coleção</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card: Aniversário */}
          <div
            onClick={() => onSelectCategory('aniversario')}
            className="group relative md:col-span-2 h-[230px] md:h-[228px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-[#ECE9E4]"
          >
            <img
              src={getImage('catAni')}
              alt="Aniversário"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center justify-between border border-[#E8E2D7]">
              <div>
                <h3 className="font-display font-medium text-lg text-[#221F1B]">
                  Aniversário
                </h3>
                <p className="text-[11px] text-[#666057]">
                  Essa data especial celebrada com estilo único
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#F5EDE1] text-[#A6825B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#A6825B] group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card: Turismo */}
          <div
            onClick={() => onSelectCategory('turismo')}
            className="group relative h-[230px] md:h-[228px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-[#ECE9E4]"
          >
            <img
              src={getImage('catTur')}
              alt="Turismo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#E8E2D7]">
              <h3 className="font-display font-medium text-lg text-[#221F1B]">
                Turismo
              </h3>
              <p className="text-[11px] text-[#666057] line-clamp-1">
                Paris e cidades do mundo como cenário
              </p>
              <div className="mt-2 text-xs font-bold text-[#A6825B] flex items-center gap-1">
                <span>Ver ensaio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card: Casal */}
          <div
            onClick={() => onSelectCategory('casal')}
            className="group relative h-[230px] md:h-[228px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-[#ECE9E4]"
          >
            <img
              src={getImage('catCas')}
              alt="Casal"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#E8E2D7]">
              <h3 className="font-display font-medium text-lg text-[#221F1B]">
                Casal
              </h3>
              <p className="text-[11px] text-[#666057] line-clamp-1">
                Fotos de casal em cidades românticas
              </p>
              <div className="mt-2 text-xs font-bold text-[#A6825B] flex items-center gap-1">
                <span>Ver ensaio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

        {/* Upcoming Categories Pills */}
        <div className="mt-10 pt-8 border-t border-[#E8E2D7]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#888888] mr-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#A6825B]" />
              Em breve:
            </span>
            {UPCOMING_CATEGORIES.map((catName) => (
              <button
                key={catName}
                onClick={() => onShowToast(`O tema "${catName}" estará disponível em breve! Fique atento às novidades.`)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#666057] bg-[#F5F2EB] hover:bg-[#221F1B] hover:text-white border border-[#E8E2D7] transition-all cursor-pointer"
              >
                + {catName}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
