import React from 'react';
import { Search, ShoppingBag, Sparkles, Menu, User, Crown, LogIn } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenWizard: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenWizard,
  onOpenMobileMenu,
}) => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { label: 'Início', route: 'home' },
    { label: 'Todos os Produtos', route: 'todos' },
    { label: 'Aniversário', route: 'aniversario' },
    { label: 'Turismo', route: 'turismo' },
    { label: 'Casal', route: 'casal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D7] transition-all">
      {/* Announcement Bar / Ticker */}
      <div id="announcement-ticker" className="bg-[#221F1B] text-[#FAF8F5] text-[11px] font-semibold tracking-wider uppercase overflow-hidden py-2 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          <div className="flex items-center gap-12 px-6">
            <span>PRODUTOS DIGITAIS · <strong className="text-[#C2A686]">SEM FRETE</strong> · DOWNLOAD INSTANTÂNEO</span>
            <span>LEVE <strong className="text-[#C2A686]">3 PRODUTOS</strong> E GANHE <strong className="text-[#C2A686]">30% OFF</strong> NA CESTA</span>
            <span>FOTOGRAFIAS HIPER-REALISTAS COM IA</span>
            <span>ENTREGA DIRETO NO SEU E-MAIL</span>
          </div>
          <div className="flex items-center gap-12 px-6">
            <span>PRODUTOS DIGITAIS · <strong className="text-[#C2A686]">SEM FRETE</strong> · DOWNLOAD INSTANTÂNEO</span>
            <span>LEVE <strong className="text-[#C2A686]">3 PRODUTOS</strong> E GANHE <strong className="text-[#C2A686]">30% OFF</strong> NA CESTA</span>
            <span>FOTOGRAFIAS HIPER-REALISTAS COM IA</span>
            <span>ENTREGA DIRETO NO SEU E-MAIL</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo with S Collage */}
        <button
          id="header-logo-btn"
          onClick={() => onNavigate('home')}
          className="flex items-center text-left focus:outline-none group cursor-pointer"
        >
          <BrandLogo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav id="desktop-navigation" className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                id={`nav-link-${item.route}`}
                onClick={() => onNavigate(item.route)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all relative ${
                  isActive
                    ? 'text-[#221F1B] font-bold bg-[#F5F2EB]'
                    : 'text-[#6B655D] hover:text-[#221F1B] hover:bg-[#FAF8F5]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#A6825B] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            id="open-search-modal-btn"
            onClick={onOpenSearch}
            aria-label="Buscar ensaios"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#221F1B] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
            title="Buscar ensaios"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Trigger */}
          <button
            id="open-cart-drawer-btn"
            onClick={onOpenCart}
            aria-label="Abrir sacola"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#221F1B] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
            title="Sacola de compras"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#A6825B] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth / Admin Button */}
          {user ? (
            <button
              id="header-user-account-btn"
              onClick={() => {
                if (isAdmin) {
                  onNavigate('admin');
                } else {
                  onNavigate('login');
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                isAdmin
                  ? currentRoute === 'admin'
                    ? 'bg-[#A6825B] text-white border-[#8F6D48] shadow-xs'
                    : 'bg-[#FAF6F0] border-[#DED7CA] text-[#5C452C] hover:bg-[#F5EDE1]'
                  : currentRoute === 'login'
                  ? 'bg-[#F5EDE1] border-[#C2A686] text-[#5C452C]'
                  : 'bg-[#FAF8F5] border-[#E8E2D7] text-[#221F1B] hover:bg-[#F0ECE2]'
              }`}
              title={isAdmin ? 'Abrir Painel Admin Full' : 'Meu Painel de Ensaios'}
            >
              {isAdmin ? (
                <Crown className={`w-4 h-4 ${currentRoute === 'admin' ? 'text-white' : 'text-[#A6825B]'}`} />
              ) : (
                <User className="w-4 h-4 text-[#6B655D]" />
              )}
              <span className="text-xs font-bold truncate max-w-[100px] hidden md:inline">
                {isAdmin ? 'Painel Admin' : user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => onNavigate('login')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentRoute === 'login'
                  ? 'bg-[#F5EDE1] border-[#C2A686] text-[#5C452C]'
                  : 'bg-[#FAF8F5] hover:bg-[#F0ECE2] border-[#E8E2D7] text-[#33302A]'
              }`}
              title="Fazer Login com Google"
            >
              <LogIn className="w-4 h-4 text-[#A6825B]" />
              <span className="hidden sm:inline">Fazer Login</span>
            </button>
          )}

          {/* AI Wizard CTA Button */}
          <button
            id="header-cta-wizard-btn"
            onClick={onOpenWizard}
            className="hidden sm:inline-flex items-center gap-2 bg-[#A6825B] hover:bg-[#94724C] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:shadow-[#A6825B]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Criar minhas fotos</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            id="open-mobile-menu-btn"
            onClick={onOpenMobileMenu}
            aria-label="Abrir menu mobile"
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#221F1B] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
