import React, { useState } from 'react';
import { Sparkles, ArrowRight, Star, Camera } from 'lucide-react';
import { getImage } from '../data/products';

interface HeroProps {
  onOpenWizard: () => void;
  onNavigateToProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenWizard, onNavigateToProducts }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const cards = [
    {
      key: 'heroAni',
      label: 'Aniversário · 30 Anos',
      className: 'top-8 left-2 sm:left-6 w-36 sm:w-48 z-10',
      rotation: -6,
    },
    {
      key: 'heroCas',
      label: 'Casal · Paris',
      className: 'top-2 right-4 sm:right-10 w-32 sm:w-44 z-20',
      rotation: 5,
    },
    {
      key: 'heroTur',
      label: 'Turismo · Paris',
      className: 'bottom-8 right-6 sm:right-16 w-36 sm:w-48 z-30',
      rotation: -4,
    },
    {
      key: 'heroRet',
      label: 'Retrato de Estúdio',
      className: 'bottom-16 left-0 sm:left-8 w-32 sm:w-40 z-20',
      rotation: 8,
    },
    {
      key: 'heroFam',
      label: 'Celebration Moment',
      className: 'top-1/3 left-1/3 w-32 sm:w-40 z-10 hidden sm:block',
      rotation: -2,
    },
  ];

  return (
    <section
      id="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5F2EB] border-b border-[#E8E2D7] py-12 lg:py-20"
    >
      {/* Subtle corner viewfinders for photography camera feel */}
      <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-[#A6825B]/30 pointer-events-none" />
      <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-[#A6825B]/30 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-[#A6825B]/30 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-[#A6825B]/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F5EDE1] border border-[#DED7CA] text-[#5C452C] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#A6825B]" />
              <span>Fotografias hiper-realistas com IA</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#221F1B] leading-[1.05]">
              Suas memórias.<br />
              Agora em <em className="text-[#A6825B] font-medium not-italic">fotos.</em>
            </h1>

            <p className="text-base sm:text-lg text-[#666057] max-w-xl leading-relaxed font-normal">
              Transforme suas ideias, celebrações e sonhos em fotografias hiper-realistas criadas com inteligência artificial de última geração. Sem precisar de estúdio ou fotógrafo.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-create-photos-btn"
                onClick={onOpenWizard}
                className="inline-flex items-center justify-center gap-2.5 bg-[#A6825B] hover:bg-[#94724C] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-4 rounded-xl shadow-lg shadow-[#A6825B]/25 hover:shadow-xl hover:shadow-[#A6825B]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Criar minhas fotos</span>
              </button>

              <button
                id="hero-view-products-btn"
                onClick={onNavigateToProducts}
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#221F1B] text-[#221F1B] hover:text-white border-2 border-[#221F1B] font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Ver produtos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Proof */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#E8E2D7] text-xs text-[#666057]">
              <div className="flex items-center gap-1 text-[#A6825B]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#A6825B]" />
                ))}
              </div>
              <span className="font-semibold text-[#221F1B]">4.9 de 5.0 estrelas</span>
              <span className="text-[#D0CDC7]">·</span>
              <span className="font-semibold text-[#221F1B]">+12.400 memórias entregues</span>
            </div>
          </div>

          {/* 3D Floating Scene */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[480px] w-full flex items-center justify-center">
            <div
              className="relative w-full h-full max-w-lg transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
              }}
            >
              {cards.map((c, index) => (
                <div
                  key={c.key}
                  style={{
                    transform: `rotate(${c.rotation}deg)`,
                  }}
                  className={`absolute ${c.className} bg-white p-2.5 pb-7 rounded-xl shadow-xl shadow-black/10 border border-[#E8E2D7] transition-transform hover:scale-105 hover:z-40 animate-float`}
                >
                  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-[#ECEAE6]">
                    <img
                      src={getImage(c.key)}
                      alt={c.label}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between px-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#777777]">
                      {c.label}
                    </span>
                    <Camera className="w-3 h-3 text-[#A6825B]" />
                  </div>
                </div>
              ))}

              {/* Rotating Guarantee Seal */}
              <div className="absolute -bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#221F1B] text-[#FAF8F5] w-24 sm:w-28 h-24 sm:h-28 rounded-full p-2 flex items-center justify-center shadow-2xl border-2 border-white">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                  <path
                    id="sealCircle"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[8.5px] uppercase font-bold tracking-[2.5px] fill-white">
                    <textPath href="#sealCircle">
                      CRIADO COM IA · HIPER-REALISTA ·
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#C2A686]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
