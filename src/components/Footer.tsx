import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Mail, Phone, Instagram, Youtube, ArrowUpRight, CheckCircle2, Crown, Lock } from 'lucide-react';
import { getImage } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenWizard: () => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenWizard,
  onShowToast,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { user, isAdmin, setIsLoginModalOpen, setIsAdminPanelOpen } = useAuth();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onShowToast('Por favor, informe um e-mail válido.');
      return;
    }
    setSubscribed(true);
    onShowToast('Inscrição confirmada! Você receberá novidades e cupons exclusivos.');
    setEmail('');
  };

  return (
    <footer className="bg-[#111111] text-[#CCCCCC] pt-16 pb-12 border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-[#252525]">
          {/* Brand Info */}
          <div className="space-y-5">
            <BrandLogo size="md" theme="dark" />
            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              Transforme seus momentos mais especiais em fotografias hiper-realistas criadas com inteligência artificial avançada.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram da loja"
                className="w-10 h-10 rounded-xl bg-[#1C1C1C] hover:bg-[#A6825B] text-white flex items-center justify-center transition-colors border border-[#2A2A2A]"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Canal no YouTube"
                className="w-10 h-10 rounded-xl bg-[#1C1C1C] hover:bg-[#A6825B] text-white flex items-center justify-center transition-colors border border-[#2A2A2A]"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5519988946958"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp da loja"
                className="w-10 h-10 rounded-xl bg-[#1C1C1C] hover:bg-[#25D366] text-white flex items-center justify-center transition-colors border border-[#2A2A2A]"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#A6825B] transition-colors flex items-center gap-1 text-left cursor-pointer"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('todos')}
                  className="hover:text-[#A6825B] transition-colors flex items-center gap-1 text-left cursor-pointer"
                >
                  Todos os Produtos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aniversario')}
                  className="hover:text-[#A6825B] transition-colors flex items-center gap-1 text-left cursor-pointer"
                >
                  Ensaio Aniversário (Black & Luxury)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('turismo')}
                  className="hover:text-[#A6825B] transition-colors flex items-center gap-1 text-left cursor-pointer"
                >
                  Ensaio Turismo (Paris)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('casal')}
                  className="hover:text-[#A6825B] transition-colors flex items-center gap-1 text-left cursor-pointer"
                >
                  Ensaio Casal Romântico
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional / Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Atendimento & Painel</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={onOpenWizard}
                  className="hover:text-[#A6825B] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Assistente de Criação IA <ArrowUpRight className="w-3 h-3 text-[#A6825B]" />
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/5519988946958"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#A6825B] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  WhatsApp: (19) 98894-6958
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@momentosfotosia.com.br"
                  className="hover:text-[#A6825B] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#A6825B]" />
                  contato@momentosfotosia.com.br
                </a>
              </li>
              <li>
                {user ? (
                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        if (isAdmin) {
                          onNavigate('admin');
                        } else {
                          onNavigate('login');
                        }
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-semibold"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAdmin ? 'Acessar Painel Admin Full' : 'Meu Painel de Ensaios'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors pt-2 inline-flex items-center gap-1.5 cursor-pointer font-semibold"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fazer Login com Google (Admin & Cliente)</span>
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Newsletter</h4>
            <p className="text-sm text-[#A0A0A0]">
              Cadastre-se para receber promoções especiais e lançamentos de novos temas.
            </p>
            {subscribed ? (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Obrigado por se inscrever!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#1A1A1A] border border-[#333333] focus:border-[#A6825B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#777777] outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#A6825B] hover:bg-[#94724C] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & CNPJ */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#888888] text-center md:text-left">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} Sants Fotograf.ia. Todos os direitos reservados.</p>
            <p className="text-[11px] text-[#A0A0A0]">
              CNPJ: <span className="text-[#CCCCCC] font-medium">63.665.794/0001-22</span> · Fotografias digitais e ensaios com IA
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <a
              href="https://wa.me/5519988946958"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: (19) 98894-6958</span>
            </a>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Ambiente 100% Seguro
            </span>
            <span>Download Instantâneo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
