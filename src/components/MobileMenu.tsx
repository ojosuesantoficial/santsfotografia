import React from 'react';
import { X, Sparkles, Phone, Mail, ArrowRight, Crown, User, LogIn, LogOut } from 'lucide-react';
import { UPCOMING_CATEGORIES } from '../data/products';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenWizard: () => void;
  onShowToast: (msg: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  onOpenWizard,
  onShowToast,
}) => {
  const { user, isAdmin, logout } = useAuth();

  if (!isOpen) return null;

  const navLinks = [
    { label: 'Início', route: 'home' },
    { label: 'Todos os Produtos', route: 'todos' },
    { label: 'Aniversário', route: 'aniversario' },
    { label: 'Turismo', route: 'turismo' },
    { label: 'Casal', route: 'casal' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col justify-between p-6">
          
          <div className="space-y-5">
            {/* Logo and close */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D7]">
              <BrandLogo size="sm" />

              <button
                onClick={onClose}
                aria-label="Fechar menu"
                className="w-8 h-8 rounded-lg hover:bg-[#F5F2EB] flex items-center justify-center text-[#777777] hover:text-[#221F1B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auth / Admin Bar & Logout Button */}
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    if (isAdmin) {
                      onNavigate('admin');
                    } else {
                      onNavigate('login');
                    }
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isAdmin ? 'bg-[#FAF6F0] border-[#DED7CA] text-[#5C452C] hover:bg-[#F5EDE1]' : 'bg-[#FAF8F5] border-[#E8E2D7] text-[#221F1B] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isAdmin ? (
                      <Crown className="w-4 h-4 text-[#A6825B] flex-shrink-0" />
                    ) : (
                      <User className="w-4 h-4 text-[#6B655D] flex-shrink-0" />
                    )}
                    <div className="text-left truncate">
                      <div className="text-xs font-bold truncate">{isAdmin ? 'Painel Admin Oficial' : user.name}</div>
                      <div className="text-[10px] text-[#666666] truncate">{user.email}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-50 flex-shrink-0" />
                </button>

                {/* Explicit Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    onClose();
                    onShowToast('Você saiu da sua conta.');
                  }}
                  className="w-full py-2 px-3 bg-[#F5F2EB] hover:bg-[#EFEAE1] text-[#666666] hover:text-[#221F1B] border border-[#E8E2D7] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair da Conta (Logout)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onNavigate('login');
                }}
                className="w-full py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#E8E2D7] rounded-xl text-xs font-bold text-[#221F1B] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#A6825B]" />
                <span>Fazer Login com Google</span>
              </button>
            )}

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.route;
                return (
                  <button
                    key={link.route}
                    onClick={() => {
                      onNavigate(link.route);
                      onClose();
                    }}
                    className={`w-full text-left py-2.5 px-3.5 rounded-xl font-display font-medium text-base flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#F5EDE1] text-[#5C452C] font-bold'
                        : 'text-[#221F1B] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-60" />
                  </button>
                );
              })}
            </nav>

            {/* Upcoming Categories */}
            <div className="pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-2">
                Em Breve:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {UPCOMING_CATEGORIES.slice(0, 5).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onShowToast(`Tema "${cat}" em breve!`)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D7] text-[#666666]"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[#E8E2D7] space-y-3">
            <button
              onClick={() => {
                onClose();
                onOpenWizard();
              }}
              className="w-full bg-[#A6825B] hover:bg-[#94724C] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar minhas fotos</span>
            </button>

            <div className="pt-1 space-y-1 text-xs text-[#777777]">
              <a
                href="https://wa.me/5519988946958"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#221F1B] py-0.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                WhatsApp: (19) 98894-6958
              </a>
              <a
                href="mailto:contato@momentosfotosia.com.br"
                className="flex items-center gap-2 hover:text-[#221F1B] py-0.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#A6825B]" />
                contato@momentosfotosia.com.br
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
