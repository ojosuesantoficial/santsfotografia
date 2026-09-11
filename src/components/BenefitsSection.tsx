import React from 'react';
import { Award, Download, Gift, ShieldCheck } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Award,
      title: 'Qualidade Premium',
      text: 'Fotos produzidas em alta resolução com atenção minuciosa aos detalhes, iluminação e texturas.',
    },
    {
      icon: Download,
      title: 'Download Instantâneo',
      text: 'Receba seu link de acesso diretamente no seu e-mail logo após a confirmação do pedido.',
    },
    {
      icon: Gift,
      title: 'Indique e Ganhe',
      text: 'Compartilhe seu link exclusivo com amigos e ganhe 15% de desconto acumulativo na sua próxima compra.',
    },
    {
      icon: ShieldCheck,
      title: 'Pagamento Seguro',
      text: 'Seus dados e informações de pagamento são processados com total criptografia e segurança via Pix ou Cartão.',
    },
  ];

  return (
    <section className="py-16 bg-[#F8F7F5] border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E8E6E2] shadow-sm overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E6E2]">
          {benefits.map((b, index) => {
            const Icon = b.icon;
            return (
              <div
                key={index}
                className="p-8 hover:bg-[#FAF8F5] transition-colors duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-base text-[#111111] mb-2">
                  {b.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  {b.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
