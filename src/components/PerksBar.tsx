import React from 'react';
import { Zap, Award, Sparkles, Heart } from 'lucide-react';

export const PerksBar: React.FC = () => {
  const perks = [
    {
      icon: Zap,
      title: 'Download Instantâneo',
      desc: 'Receba seus arquivos digitais na hora',
    },
    {
      icon: Award,
      title: 'Qualidade Premium',
      desc: 'Acabamento fotográfico editorial',
    },
    {
      icon: Sparkles,
      title: 'Fotos Hiper-Realistas',
      desc: 'IA generativa de última geração',
    },
    {
      icon: Heart,
      title: 'Memórias Personalizadas',
      desc: 'Sua história com emoção e estilo',
    },
  ];

  return (
    <div className="bg-white border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E6E2]">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 py-5 px-4 sm:px-6 hover:bg-[#FAF9F6] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-[#111111] leading-tight">
                    {p.title}
                  </h4>
                  <p className="text-xs text-[#777777] mt-0.5">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
