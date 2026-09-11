import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, MoveHorizontal } from 'lucide-react';
import { getImage } from '../data/products';

export const BeforeAfterSlider: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aniversario' | 'casal' | 'paris'>('aniversario');
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const comparisons = {
    aniversario: {
      title: 'Aniversário',
      before: getImage('ba1Antes'),
      after: getImage('ba1'),
      labelBefore: 'Foto Original / Ideia',
      labelAfter: 'Ensaio Hiper-Realista IA',
    },
    casal: {
      title: 'Casal',
      before: getImage('ba2Antes'),
      after: getImage('ba2'),
      labelBefore: 'Foto Comum do Celular',
      labelAfter: 'Ensaio de Casal com IA',
    },
    paris: {
      title: 'Paris / Turismo',
      before: getImage('ba3Antes'),
      after: getImage('ba3'),
      labelBefore: 'Foto Sem Produção',
      labelAfter: 'Ensaio Turístico em Paris',
    },
  };

  const current = comparisons[activeTab];

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSliderPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section id="comparacao-section" className="py-16 sm:py-24 bg-[#F8F7F5] border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comparação</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] mt-3">
            Veja a <em className="text-[#A6825B] font-medium not-italic">diferença</em>
          </h2>
          <p className="text-base text-[#666666] mt-3">
            Arraste o divisor central para comparar uma foto comum com a qualidade de estúdio entregue pela inteligência artificial.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-2 mb-8">
          {(['aniversario', 'casal', 'paris'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSliderPos(50);
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#111111] text-white shadow-md'
                  : 'bg-white text-[#555555] hover:text-[#111111] border border-[#E0DCD6]'
              }`}
            >
              {comparisons[tab].title}
            </button>
          ))}
        </div>

        {/* Before After Stage */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden shadow-2xl bg-[#EAE8E4] cursor-ew-resize select-none touch-none border border-[#E0DCD6]"
          >
            {/* After Image (Background) */}
            <img
              src={current.after}
              alt="Versão com Inteligência Artificial"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Before Image (Foreground Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={current.before}
                alt="Foto Original"
                className="absolute inset-0 w-full h-full object-cover grayscale-[30%] brightness-95 pointer-events-none"
              />
            </div>

            {/* Tags */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="bg-black/75 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
                {current.labelBefore}
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="bg-[#A6825B]/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {current.labelAfter}
              </span>
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Central Drag Handle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#111111] shadow-2xl flex items-center justify-center border-2 border-[#111111] pointer-events-none">
                <div className="flex items-center -space-x-1 text-[#111111]">
                  <ChevronLeft className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#777777]">
            <MoveHorizontal className="w-4 h-4 text-[#A6825B]" />
            <span>Arraste para os lados para comparar os detalhes</span>
          </div>
        </div>

      </div>
    </section>
  );
};
