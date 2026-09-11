import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Download,
  Sparkles,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Lock,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  Camera,
  Layers,
  Heart,
  Share2
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { formatBRL } from '../utils/format';
import { matchCategory, formatCategoryLabel } from '../utils/category';
import { ProductCard } from './ProductCard';

interface ProductPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
  onShowToast: (msg: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onNavigateHome,
  onShowToast,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'how-it-works' | 'reviews' | 'faq'>('details');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Related products prioritizing same category
  const relatedProducts = React.useMemo(() => {
    const currentCat = product.category || product.cat || '';
    const sameCat = PRODUCTS.filter(
      (p) => p.id !== product.id && matchCategory(p.category || (p as any).cat, currentCat)
    );
    const others = PRODUCTS.filter(
      (p) => p.id !== product.id && !matchCategory(p.category || (p as any).cat, currentCat)
    );
    return [...sameCat, ...others].slice(0, 4);
  }, [product]);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Link do produto copiado para a área de transferência!');
    } else {
      onShowToast('Compartilhe o link deste ensaio!');
    }
  };

  const faqs = [
    {
      q: 'Como funciona a criação das fotos com Inteligência Artificial?',
      a: 'Você realiza a compra do ensaio desejado e, logo após a confirmação, acessa nosso assistente para enviar de 5 a 10 fotos simples do seu dia a dia (selfies ou fotos de celular). Nossa IA treinada estilizou poses, cenários, iluminação e vestimentas profissionais mantendo 100% da sua identidade facial e naturalidade.',
    },
    {
      q: 'Em quanto tempo recebo as fotos do meu ensaio?',
      a: 'O processo é ultra-rápido! Após o envio das suas fotos de referência, seu ensaio fotográfico completo em alta resolução fica pronto em até 20 a 40 minutos diretamente no seu painel e é enviado para seu e-mail e WhatsApp.',
    },
    {
      q: 'Posso imprimir as fotos em fotolivro ou quadros?',
      a: 'Sim! Todas as fotos são entregues em altíssima resolução (4K Ultra HD a 300 DPI), perfeitas tanto para postar nas redes sociais (Instagram, LinkedIn, WhatsApp) quanto para impressão profissional em álbuns, quadros e porta-retratos.',
    },
    {
      q: 'Minhas fotos originais ficam salvas com segurança?',
      a: 'Absoluta segurança e privacidade. Suas fotos enviadas são processadas em ambiente criptografado e excluídas permanentemente dos servidores após a geração do seu ensaio. Jamais compartilhamos seus dados.',
    },
    {
      q: 'E se eu não gostar do resultado final?',
      a: 'Oferecemos garantia de satisfação total! Se qualquer foto não atender às suas expectativas de semelhança ou acabamento, realizamos novos ajustes e refinamentos gratuitos na nossa plataforma.',
    },
  ];

  const reviewsList = [
    {
      name: 'Mariana Silveira',
      city: 'São Paulo, SP',
      date: 'Há 2 dias',
      rating: 5,
      comment: 'Fiquei chocada com a qualidade! Parecia que contratei um estúdio caríssimo em SP. As fotos de aniversário ficaram perfeitas para o meu feed!',
      tag: 'Compra Verificada',
    },
    {
      name: 'Lucas & Beatriz',
      city: 'Curitiba, PR',
      date: 'Há 5 dias',
      rating: 5,
      comment: 'Fizemos o ensaio de casal para comemorar nosso aniversário de namoro. O acabamento da luz e a semelhança do rosto impressionaram toda a família.',
      tag: 'Compra Verificada',
    },
    {
      name: 'Camila Rocha',
      city: 'Rio de Janeiro, RJ',
      date: 'Há 1 semana',
      rating: 5,
      comment: 'O tema de Paris parece que viajei de verdade! Super fácil de enviar as fotos e o resultado saiu em menos de meia hora.',
      tag: 'Compra Verificada',
    },
  ];

  const rawGallery =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : product.gallery && product.gallery.length > 0
      ? product.gallery
      : [
          product.coverImage ||
            'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
        ];

  const currentHeroImage = rawGallery[activeImageIndex] || rawGallery[0];
  const photoCount = product.photoCount || product.photos || 20;

  return (
    <div className="min-h-screen bg-[#F8F7F5] pb-24 lg:pb-20">
      
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#E8E6E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-[#777777] flex-wrap">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#111111] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Início</span>
            </button>
            <span>/</span>
            <button
              onClick={onNavigateHome}
              className="hover:text-[#111111] transition-colors cursor-pointer"
            >
              Ensaios com IA
            </button>
            <span>/</span>
            <span className="text-[#A6825B] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-[#666666] hover:text-[#111111] font-semibold text-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* LEFT: Sticky Gallery Column */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            
            {/* Big Main Stage */}
            <div className="aspect-[4/4.8] sm:aspect-[4/4.5] rounded-3xl overflow-hidden bg-[#ECEAE6] border border-[#EAE8E4] shadow-lg relative group">
              <img
                src={currentHeroImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
                }}
              />

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#A6825B] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Photo Counter Pill */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#A6825B]" />
                <span>Foto {activeImageIndex + 1} de {rawGallery.length}</span>
              </div>
            </div>

            {/* High-Resolution Thumbnails Strip */}
            <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
              {rawGallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#A6825B] shadow-md ring-2 ring-[#A6825B]/30 scale-95'
                      : 'border-[#EAE8E4] opacity-70 hover:opacity-100 hover:border-[#CCCCCC]'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Key Quality Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-[#EAE8E4] text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center mb-1.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#111111] block">Ultra HD 4K</span>
                <span className="text-[10px] text-[#777777]">300 DPI Imprimível</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#EAE8E4] text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center mb-1.5">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#111111] block">Entrega Ágil</span>
                <span className="text-[10px] text-[#777777]">Direto no E-mail</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#EAE8E4] text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-[#A6825B]/10 text-[#A6825B] flex items-center justify-center mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#111111] block">Garantia Total</span>
                <span className="text-[10px] text-[#777777]">Ajustes Inclusos</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Product Buy Box & Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title, Rating and Header */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A6825B] bg-[#A6825B]/10 px-2.5 py-1 rounded-lg">
                  {formatCategoryLabel(product.category || (product as any).cat || 'Ensaio')}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">
                  · {product.photoCount || (product as any).photos || 10} Fotos Exclusivas
                </span>
                <div className="flex items-center gap-1 text-xs text-[#555555] ml-auto">
                  <div className="flex text-[#A6825B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#A6825B]" />
                    ))}
                  </div>
                  <span className="font-bold text-[#111111]">{product.rating}</span>
                  <span className="text-[#888888]">({product.reviews} avaliações)</span>
                </div>
              </div>

              <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#111111] leading-tight">
                {product.name}
              </h1>

              <p className="text-sm sm:text-base text-[#555555] leading-relaxed pt-1">
                {product.desc}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8E6E2] shadow-sm space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-4xl sm:text-5xl text-[#111111]">
                      {formatBRL(product.price)}
                    </span>
                    <span className="text-xs text-[#888888] line-through">
                      {formatBRL(product.price * 1.5)}
                    </span>
                  </div>
                  <p className="text-xs text-[#2E7D32] font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Economia de {formatBRL(product.price * 0.5)} hoje · Sem custo de frete
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider text-[#888888] block font-bold">
                    Parcelamento
                  </span>
                  <span className="text-xs font-semibold text-[#111111] block">
                    ou 3x de {formatBRL(product.price / 3)}
                  </span>
                </div>
              </div>

              {/* Instant Alert */}
              <div className="bg-[#FAF9F7] p-3.5 rounded-2xl border border-[#EAE8E4] flex items-center gap-2.5 text-xs text-[#444444]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse flex-shrink-0" />
                <span>
                  <strong>Produto 100% Digital:</strong> Acesso imediato para envio das fotos após a compra.
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">
                  Quantidade de Ensaios:
                </span>
                <div className="flex items-center border-2 border-[#E0DCD6] rounded-xl overflow-hidden bg-[#FAF9F7]">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    className="w-10 h-10 flex items-center justify-center text-[#555555] hover:bg-[#A6825B]/10 hover:text-[#A6825B] transition-colors cursor-pointer"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-[#111111]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(1)}
                    className="w-10 h-10 flex items-center justify-center text-[#555555] hover:bg-[#A6825B]/10 hover:text-[#A6825B] transition-colors cursor-pointer"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onBuyNow(product, quantity)}
                  className="w-full bg-[#A6825B] hover:bg-[#94724C] text-white text-sm font-bold uppercase tracking-wider py-4 px-6 rounded-2xl shadow-xl shadow-[#A6825B]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-[0.98]"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Comprar Agora ({formatBRL(product.price * quantity)})</span>
                </button>

                <button
                  onClick={() => onAddToCart(product, quantity)}
                  className="w-full bg-[#111111] hover:bg-[#2A2A2A] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar à Sacola de Compras</span>
                </button>
              </div>

              {/* Trust Badges Footer */}
              <div className="pt-3 border-t border-[#EAE8E4] flex items-center justify-around text-[11px] text-[#777777]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Pix / Cartão 100% Seguro</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#A6825B]" />
                  <span>Download Imediato</span>
                </div>
              </div>
            </div>

            {/* Checklist: What is Included */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8E6E2] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A6825B]" />
                O que está incluído no seu pedido:
              </h3>
              <div className="space-y-2.5">
                {product.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#444444]">
                    <CheckCircle2 className="w-4 h-4 text-[#A6825B] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#444444]">
                  <CheckCircle2 className="w-4 h-4 text-[#A6825B] flex-shrink-0 mt-0.5" />
                  <span>Garantia de semelhança facial com ajuste inteligente de luz e cores</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Informative Tabs Section (Details / How it works / Reviews / FAQ) */}
        <div className="mt-16 lg:mt-24">
          
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-[#E8E6E2] overflow-x-auto scrollbar-none pb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'details'
                  ? 'text-[#A6825B] border-b-2 border-[#A6825B]'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Sobre o Ensaio
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`pb-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'how-it-works'
                  ? 'text-[#A6825B] border-b-2 border-[#A6825B]'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Como Funciona (3 Passos)
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-[#A6825B] border-b-2 border-[#A6825B]'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Avaliações ({product.reviews})
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`pb-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'faq'
                  ? 'text-[#A6825B] border-b-2 border-[#A6825B]'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Perguntas Frequentes
            </button>
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-[#444444] text-sm leading-relaxed">
              <div className="bg-white p-8 rounded-3xl border border-[#E8E6E2] space-y-4">
                <h4 className="font-display font-medium text-xl text-[#111111]">
                  Direção de Arte & Qualidade Editorial
                </h4>
                <p>
                  O <strong>{product.name}</strong> foi planejado para entregar um resultado equivalente aos maiores ensaios de moda e retratos profissionais do mundo, sem a necessidade de alugar estúdios, contratar maquiadores caros ou viajar até o local.
                </p>
                <p>
                  Nossa tecnologia de inteligência artificial analisa os traços da sua foto de base e aplica correção de iluminação volumétrica, texturas de pele ultrarrealistas e composição harmônica.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#E8E6E2] space-y-4">
                <h4 className="font-display font-medium text-xl text-[#111111]">
                  Formatos e Entrega
                </h4>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A6825B]" />
                    <span><strong>Resolução:</strong> Ultra HD 4K (4096x5120 px a 300 DPI)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A6825B]" />
                    <span><strong>Proporção:</strong> 4:5 (Perfeita para Instagram Feed) e 9:16 (Stories)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A6825B]" />
                    <span><strong>Formato do Arquivo:</strong> JPEG e PNG sem compressão de dados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A6825B]" />
                    <span><strong>Uso:</strong> Livre para redes sociais, sites e impressões em fotolivros</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: How It Works */}
          {activeTab === 'how-it-works' && (
            <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-[#E8E6E2] space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#A6825B]/10 text-[#A6825B] font-bold text-lg flex items-center justify-center font-display">
                  1
                </div>
                <h4 className="font-display font-medium text-lg text-[#111111]">
                  Finalize seu Pedido
                </h4>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  Selecione o ensaio e confirme seu pagamento seguro por Pix ou Cartão. Você receberá seu comprovante digital instantâneo.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#E8E6E2] space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#A6825B]/10 text-[#A6825B] font-bold text-lg flex items-center justify-center font-display">
                  2
                </div>
                <h4 className="font-display font-medium text-lg text-[#111111]">
                  Envie 5 a 10 Fotos Comuns
                </h4>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  Tire fotos comuns pelo celular ou envie selfies da sua galeria. Nosso assistente orienta os melhores ângulos.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#E8E6E2] space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#A6825B]/10 text-[#A6825B] font-bold text-lg flex items-center justify-center font-display">
                  3
                </div>
                <h4 className="font-display font-medium text-lg text-[#111111]">
                  Receba seu Álbum em 4K
                </h4>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  Em poucos minutos, seu álbum fotográfico completo fica pronto para download em altíssima qualidade diretamente no seu e-mail.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="py-10 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-[#E8E6E2] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="font-display font-bold text-5xl text-[#111111]">{product.rating}</span>
                    <div>
                      <div className="flex text-[#A6825B]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#A6825B]" />
                        ))}
                      </div>
                      <span className="text-xs text-[#777777] block mt-0.5">
                        Baseado em {product.reviews} avaliações reais
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onShowToast('Obrigado! Formulário de avaliação aberto para clientes que receberam o ensaio.')}
                  className="bg-[#111111] hover:bg-[#A6825B] text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Deixar uma Avaliação
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviewsList.map((rev, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-[#E8E6E2] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#A6825B]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#A6825B]" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#888888]">{rev.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#444444] leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    <div className="pt-2 border-t border-[#F0EEEB] flex items-center justify-between">
                      <div>
                        <span className="font-display font-semibold text-xs text-[#111111] block">
                          {rev.name}
                        </span>
                        <span className="text-[10px] text-[#888888]">{rev.city}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                        {rev.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: FAQ */}
          {activeTab === 'faq' && (
            <div className="py-10 space-y-3 max-w-4xl mx-auto">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#E8E6E2] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-display font-medium text-base text-[#111111] hover:text-[#A6825B] cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#777777] transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? 'rotate-180 text-[#A6825B]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#555555] leading-relaxed border-t border-[#F4F2EE] pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Related Products Carousel / Grid */}
        <div className="mt-16 lg:mt-24 pt-12 border-t border-[#E8E6E2]">
          <div className="max-w-xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A6825B]">
              Combinações Perfeitas
            </span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#111111] mt-1">
              Quem comprou este ensaio também <em className="text-[#A6825B] not-italic font-normal">levou</em>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onAddToCart={(p) => onAddToCart(p, 1)}
                onSelectProduct={(p) => onSelectProduct(p)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Mobile Conversion Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E8E6E2] p-3.5 z-40 lg:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-[#888888] block uppercase tracking-wider font-bold">
            Preço Especial
          </span>
          <span className="font-display font-bold text-xl text-[#111111]">
            {formatBRL(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddToCart(product, quantity)}
            className="p-3 bg-[#111111] text-white rounded-xl active:scale-95 transition-all"
            aria-label="Adicionar à sacola"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onBuyNow(product, quantity)}
            className="bg-[#A6825B] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-5 rounded-xl shadow-lg shadow-[#A6825B]/25 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Comprar Agora</span>
          </button>
        </div>
      </div>

    </div>
  );
};
