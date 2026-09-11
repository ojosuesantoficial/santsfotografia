import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getImage } from '../data/products';

interface FinalCtaProps {
  onOpenWizard: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenWizard }) => {
  return (
    <section className="relative bg-[#E8E0D5] text-[#2C241B] py-20 sm:py-28 overflow-hidden border-t border-[#DCD3C6]">
      {/* Floating Polaroid Cards */}
      <div className="hidden lg:block absolute left-12 top-12 w-32 p-2 bg-white rounded-lg shadow-2xl -rotate-6 animate-float">
        <img
          src={getImage('cta1')}
          alt="Foto IA Polaroid"
          className="w-full aspect-[4/5] object-cover rounded"
        />
      </div>

      <div className="hidden lg:block absolute right-16 top-16 w-28 p-2 bg-white rounded-lg shadow-2xl rotate-6 animate-float" style={{ animationDelay: '-2s' }}>
        <img
          src={getImage('cta2')}
          alt="Foto IA Polaroid"
          className="w-full aspect-[4/5] object-cover rounded"
        />
      </div>

      <div className="hidden lg:block absolute left-20 bottom-12 w-28 p-2 bg-white rounded-lg shadow-2xl rotate-12 animate-float" style={{ animationDelay: '-4s' }}>
        <img
          src={getImage('cta3')}
          alt="Foto IA Polaroid"
          className="w-full aspect-[4/5] object-cover rounded"
        />
      </div>

      <div className="hidden lg:block absolute right-24 bottom-12 w-32 p-2 bg-white rounded-lg shadow-2xl -rotate-12 animate-float" style={{ animationDelay: '-1.5s' }}>
        <img
          src={getImage('cta4')}
          alt="Foto IA Polaroid"
          className="w-full aspect-[4/5] object-cover rounded"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5C452C] bg-white/60 border border-[#D5C7B5] px-4 py-1.5 rounded-full backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#A6825B]" />
          <span>Eternize Agora</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-[#1A1612]">
          Qual momento você quer <em className="italic font-medium text-[#A6825B]">transformar</em> em foto?
        </h2>

        <p className="text-base sm:text-lg text-[#5C4E40] max-w-xl mx-auto leading-relaxed">
          Escolha seu ensaio agora e crie memórias com iluminação e qualidade de estúdio profissional em poucos cliques.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onOpenWizard}
            className="inline-flex items-center gap-2.5 bg-[#111111] hover:bg-[#2C241B] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-2xl hover:scale-105 active:scale-100 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#D5B895]" />
            <span>Fazer minhas fotos</span>
            <ArrowRight className="w-4 h-4 text-[#D5B895]" />
          </button>
        </div>
      </div>
    </section>
  );
};
