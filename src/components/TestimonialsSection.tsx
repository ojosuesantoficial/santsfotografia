import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="depoimentos-section" className="py-16 sm:py-24 bg-white border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
            <Heart className="w-3.5 h-3.5 fill-[#A6825B]" />
            <span>Prova Social</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] mt-3">
            Milhares de momentos <em className="text-[#A6825B] font-medium not-italic">transformados</em> em fotos
          </h2>
          <p className="text-base text-[#666666] mt-3">
            Histórias de quem já eternizou memórias e celebrações com a inteligência artificial da nossa loja.
          </p>
        </div>

        {/* 2-Column Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#FAF9F7] p-8 rounded-2xl border border-[#EAE8E4] shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-1 text-[#A6825B]">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#A6825B]" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#A6825B]/20" />
                </div>

                <p className="font-display italic text-base sm:text-lg text-[#333333] leading-relaxed">
                  “{testimonial.text}”
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#EAE8E4]">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#111111]">{testimonial.name}</h4>
                  <p className="text-xs text-[#777777]">{testimonial.city}</p>
                  <span className="text-[11px] font-bold text-[#A6825B] block mt-0.5">
                    {testimonial.productName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#999999] mt-8">
          Avaliações reais de clientes com compra verificada e entrega digital confirmada.
        </p>

      </div>
    </section>
  );
};
