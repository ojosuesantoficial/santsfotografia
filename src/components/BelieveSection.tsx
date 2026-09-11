import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { getImage } from '../data/products';

export const BelieveSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F8F7F5] border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial manifesto */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
              <span className="w-6 h-[1.5px] bg-[#A6825B]" />
              <span>Nós acreditamos</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] leading-tight">
              Nós acreditamos nas <em className="text-[#A6825B] font-medium not-italic">lembranças</em> criadas com inteligência artificial
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#555555] font-normal leading-relaxed">
              <p>
                Acreditamos que toda foto carrega uma história, um sentimento e um momento precioso que merece ser guardado com carinho.
              </p>
              <p>
                Por isso, usamos a inteligência artificial para transformar ideias, aniversários, viagens dos sonhos e momentos a dois em imagens únicas, emocionantes e cheias de significado.
              </p>
              <p>
                Mais do que criar fotos, queremos ajudar você a reviver celebrações, imaginar novas histórias e eternizar aquilo que realmente importa — com a facilidade do mundo digital.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <div className="w-10 h-[2px] bg-[#A6825B]" />
              <span className="font-bold text-xs uppercase tracking-widest text-[#111111]">
                Momentos Fotos IA
              </span>
            </div>
          </div>

          {/* Portrait Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-3 border border-[#E8E6E2]">
              <div className="aspect-[4/4.8] sm:aspect-[4/4.5] rounded-xl overflow-hidden bg-[#E7E5E1]">
                <img
                  src={getImage('believe')}
                  alt="Lembrança fotográfica criada com inteligência artificial"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl border border-white/50">
                <div className="font-display font-bold text-2xl sm:text-3xl text-[#111111] leading-none flex items-center gap-2">
                  <span>12.400+</span>
                  <Sparkles className="w-5 h-5 text-[#A6825B]" />
                </div>
                <span className="text-[11px] font-bold tracking-wider text-[#777777] uppercase block mt-1">
                  Memórias Criadas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
