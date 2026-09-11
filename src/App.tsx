import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PerksBar } from './components/PerksBar';
import { BelieveSection } from './components/BelieveSection';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { BundleBuilder } from './components/BundleBuilder';
import { CestaDiscountSection } from './components/CestaDiscountSection';
import { OffersCarousel } from './components/OffersCarousel';
import { PremiumShowcase } from './components/PremiumShowcase';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BenefitsSection } from './components/BenefitsSection';
import { FinalCta } from './components/FinalCta';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AiWizardModal } from './components/AiWizardModal';
import { CheckoutModal } from './components/CheckoutModal';
import { MobileMenu } from './components/MobileMenu';
import { ToastContainer } from './components/ToastContainer';
import { LoginModal } from './components/LoginModal';
import { LoginPage } from './components/LoginPage';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product, CartItem, ToastMessage } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES } from './data/products';
import { formatBRL, triggerConfetti } from './utils/format';
import { normalizeCategory, matchCategory, formatCategoryLabel } from './utils/category';
import { productManager, getLocalProducts } from './utils/productManager';
import { Filter, ArrowUpDown } from 'lucide-react';

function AppContent() {
  const { isLoginModalOpen, setIsLoginModalOpen, isAdminPanelOpen, setIsAdminPanelOpen } = useAuth();

  // Dynamic Products state initialized from local persistence and synced with backend
  const [products, setProducts] = useState<Product[]>(() => getLocalProducts());

  // Load products from productManager
  const fetchProducts = async () => {
    try {
      const list = await productManager.getAll();
      if (Array.isArray(list) && list.length > 0) {
        setProducts(list);
      }
    } catch (e) {
      console.error('Error fetching dynamic products:', e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Navigation Route ('home' | 'todos' | 'aniversario' | 'turismo' | 'casal' | 'produto')
  const [currentRoute, setCurrentRoute] = useState<string>('home');

  // Cart State with LocalStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mfia_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal / Drawer visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sorting & Filtering for category views
  const [sortBy, setSortBy] = useState<'pop' | 'price-asc' | 'price-desc' | 'reviews'>('pop');
  const [categorySubfilter, setCategorySubfilter] = useState<string>('todos');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('mfia_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['todos', 'aniversario', 'turismo', 'casal', 'login', 'admin'].includes(hash)) {
        setCurrentRoute(hash);
        setSelectedProduct(null);
      } else if (hash.startsWith('produto/')) {
        const slug = hash.replace('produto/', '');
        const p = products.find((item) => item.slug === slug) || INITIAL_PRODUCTS.find((item) => item.slug === slug);
        if (p) {
          setSelectedProduct(p);
          setCurrentRoute('produto');
        } else {
          setCurrentRoute('home');
          setSelectedProduct(null);
        }
      } else {
        setCurrentRoute('home');
        setSelectedProduct(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    setSelectedProduct(null);
    window.location.hash = route === 'home' ? '#/' : `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentRoute('produto');
    window.location.hash = `#/produto/${product.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity = 1, openDrawer = true) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast(`"${product.name}" adicionado à sacola!`);
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const handleToggleCartItem = (product: Product) => {
    const exists = cartItems.some((i) => i.product.id === product.id);
    if (exists) {
      setCartItems((prev) => prev.filter((i) => i.product.id !== product.id));
      showToast(`"${product.name}" removido da sacola.`);
    } else {
      handleAddToCart(product, 1, false);
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removido da sacola.');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Dynamic category options derived from products
  const dynamicCategories = React.useMemo(() => {
    const list: { id: string; name: string }[] = [
      { id: 'todos', name: 'Todos' },
      { id: 'aniversario', name: 'Aniversário' },
      { id: 'turismo', name: 'Turismo' },
      { id: 'casal', name: 'Casal' },
    ];
    (products || []).forEach((p) => {
      const cat = (p.category || p.cat || '').trim();
      if (!cat) return;
      const norm = normalizeCategory(cat);
      if (!list.some((item) => normalizeCategory(item.id) === norm || normalizeCategory(item.name) === norm)) {
        list.push({ id: norm, name: formatCategoryLabel(cat) });
      }
    });
    return list;
  }, [products]);

  // Get products for category view
  const getCategoryProducts = () => {
    let list = [...products];

    // Filter by route if currentRoute is a specific category (not 'todos', 'home', etc.)
    if (
      currentRoute !== 'todos' &&
      currentRoute !== 'home' &&
      currentRoute !== 'produto' &&
      currentRoute !== 'admin' &&
      currentRoute !== 'login'
    ) {
      list = list.filter((p) => matchCategory(p.category || (p as any).cat, currentRoute));
    }

    if (categorySubfilter !== 'todos') {
      list = list.filter((p) => matchCategory(p.category || (p as any).cat, categorySubfilter));
    }

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'reviews') list.sort((a, b) => (b.reviewsCount || b.reviews || 0) - (a.reviewsCount || a.reviews || 0));
    else list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));

    return list;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#221F1B] font-sans selection:bg-[#A6825B] selection:text-white">
      {/* Header with Navigation, Login and Ticker */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentRoute === 'home' ? (
          <>
            {/* 1. Hero Section */}
            <Hero
              onOpenWizard={() => setIsWizardOpen(true)}
              onNavigateToProducts={() => handleNavigate('todos')}
            />

            {/* 2. Perks Strip */}
            <PerksBar />

            {/* 3. Believe Section */}
            <BelieveSection />

            {/* 4. Category Bento Grid */}
            <CategoryGrid
              onSelectCategory={handleNavigate}
              onShowToast={showToast}
            />

            {/* 5. Main Products Catalog Grid */}
            <section id="produtos-section" className="py-16 sm:py-24 bg-white border-b border-[#E8E2D7]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-12">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A6825B]">
                    <span className="w-6 h-[1.5px] bg-[#A6825B]" />
                    <span>Catálogo de Ensaios</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#221F1B] mt-3">
                    Fotos que viram <em className="text-[#A6825B] font-medium not-italic">memórias</em>
                  </h2>
                  <p className="text-base text-[#666057] mt-3">
                    Ensaios fotográficos completos com direção artística profissional de inteligência artificial.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => handleAddToCart(p, 1, true)}
                      onSelectProduct={(p) => handleOpenProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 6. Interactive Before & After AI Transformation Slider */}
            <BeforeAfterSlider />

            {/* 7. Bundle Builder (Monte sua Cesta 30% OFF) */}
            <BundleBuilder
              onAddMultipleToCart={(products) => {
                products.forEach((p) => handleAddToCart(p, 1, false));
                setIsCartOpen(true);
              }}
              onShowToast={showToast}
            />

            {/* 8. Cesta Discount Explanation Strip */}
            <CestaDiscountSection
              cartItems={cartItems}
              onToggleCartItem={handleToggleCartItem}
              onOpenCart={() => setIsCartOpen(true)}
              onShowToast={showToast}
            />

            {/* 9. Limited Time Offers Carousel */}
            <OffersCarousel
              products={products}
              onAddToCart={(p) => handleAddToCart(p, 1, true)}
              onSelectProduct={(p) => handleOpenProduct(p)}
            />

            {/* 10. Premium Luxury Showcase */}
            <PremiumShowcase onSelectProduct={(p) => handleOpenProduct(p)} />

            {/* 11. Customer Testimonials */}
            <TestimonialsSection />

            {/* 12. Digital Benefits / Why Us */}
            <BenefitsSection />

            {/* 13. Final CTA Banner */}
            <FinalCta onOpenWizard={() => setIsWizardOpen(true)} />
          </>
        ) : currentRoute === 'produto' && selectedProduct ? (
          /* Product Detail View */
          <ProductPage
            product={selectedProduct}
            onAddToCart={(p, qty) => handleAddToCart(p, qty, true)}
            onBuyNow={(p, qty) => {
              handleAddToCart(p, qty, false);
              setIsCheckoutOpen(true);
            }}
            onSelectProduct={(p) => handleOpenProduct(p)}
            onNavigateHome={() => handleNavigate('home')}
            onShowToast={showToast}
          />
        ) : currentRoute === 'login' ? (
          /* Dedicated Login & Account Full Page */
          <LoginPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateToCatalog={() => handleNavigate('todos')}
            onNavigateToAdmin={() => handleNavigate('admin')}
            onShowToast={showToast}
          />
        ) : currentRoute === 'admin' ? (
          /* Dedicated Super Admin Dashboard Full Page */
          <AdminDashboardPage
            products={products}
            onRefreshProducts={fetchProducts}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateToCatalog={() => handleNavigate('todos')}
            onShowToast={showToast}
          />
        ) : (
          /* Category Catalog View ('todos', 'aniversario', 'turismo', 'casal' or custom) */
          <div className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Category Page Title */}
              <div className="mb-10 pb-8 border-b border-[#E8E2D7]">
                <div className="text-xs font-bold uppercase tracking-widest text-[#A6825B] mb-2">
                  {currentRoute === 'todos' ? 'Catálogo Completo' : 'Categoria Especial'}
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-normal text-[#221F1B]">
                  {currentRoute === 'todos' && 'Todos os Ensaios Digitais'}
                  {matchCategory(currentRoute, 'aniversario') && 'Ensaios de Aniversário & Luxo'}
                  {matchCategory(currentRoute, 'turismo') && 'Ensaios de Turismo & Destinos'}
                  {matchCategory(currentRoute, 'casal') && 'Ensaios de Casal & Romance'}
                  {!['todos', 'aniversario', 'turismo', 'casal'].some((c) => matchCategory(currentRoute, c)) &&
                    `Ensaios de ${formatCategoryLabel(currentRoute)}`}
                </h1>
                <p className="text-base text-[#666057] mt-3 max-w-2xl">
                  {currentRoute === 'todos' &&
                    'Explore toda a coleção de fotos hiper-realistas para celebrações, viagens e momentos inesquecíveis.'}
                  {matchCategory(currentRoute, 'aniversario') &&
                    'Comemore em grande estilo com ensaios Black Luxury, balões dourados, champanhe e estética cinematográfica.'}
                  {matchCategory(currentRoute, 'turismo') &&
                    'Viaje pelo mundo com fotos hiper-realistas na Torre Eiffel, bistrôs parisienses e cenários icônicos.'}
                  {matchCategory(currentRoute, 'casal') &&
                    'Celebre o amor com ensaios românticos profissionais, alta resolução e luz suave.'}
                  {!['todos', 'aniversario', 'turismo', 'casal'].some((c) => matchCategory(currentRoute, c)) &&
                    `Confira todos os ensaios digitais na categoria ${formatCategoryLabel(currentRoute)} criados com inteligência artificial.`}
                </p>
              </div>

              {/* Controls bar: Subfilters & Sorting */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-[#E8E6E2]">
                {/* Category tags */}
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                  <span className="text-xs font-bold text-[#888888] uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                    <Filter className="w-3.5 h-3.5" />
                    Filtrar:
                  </span>
                  {dynamicCategories.map((cat) => {
                    const isSelected =
                      categorySubfilter === cat.id ||
                      (categorySubfilter !== 'todos' && cat.id !== 'todos' && matchCategory(categorySubfilter, cat.id));
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategorySubfilter(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-white shadow-sm'
                            : 'bg-[#F4F2EE] text-[#555555] hover:bg-[#EAE8E4]'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#888888]" />
                  <span className="text-xs text-[#888888]">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#F4F2EE] border-none text-xs font-bold text-[#111111] rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="pop">Mais Populares</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                    <option value="reviews">Mais Avaliados</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {getCategoryProducts().map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => handleAddToCart(p, 1, true)}
                    onSelectProduct={(p) => handleOpenProduct(p)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenWizard={() => setIsWizardOpen(true)}
        onShowToast={showToast}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onNavigateToProducts={() => handleNavigate('todos')}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => handleOpenProduct(p)}
        products={products}
      />

      {/* AI Wizard Modal */}
      <AiWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onAddToCart={(p) => handleAddToCart(p, 1, true)}
        onSelectProduct={(p) => handleOpenProduct(p)}
      />

      {/* Checkout Modal with 10 photos upload and AbacatePay Pix */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={() => {
          setCartItems([]);
        }}
        onShowToast={showToast}
      />

      {/* Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenWizard={() => setIsWizardOpen(true)}
        onShowToast={showToast}
      />

      {/* Google Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onShowToast={showToast}
        onNavigateToCatalog={() => handleNavigate('todos')}
      />

      {/* Admin Panel Modal (Exclusive for jomamilionarios@gmail.com) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        products={products}
        onRefreshProducts={fetchProducts}
        onShowToast={showToast}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
