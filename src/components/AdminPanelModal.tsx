import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { CustomerOrder, CustomerPhoto, PaymentStatus, Product } from '../types';
import { formatBRL } from '../utils/format';
import { normalizeCategory, matchCategory, formatCategoryLabel } from '../utils/category';
import { ProductEditModal } from './ProductEditModal';
import { productManager } from '../utils/productManager';
import { orderManager } from '../utils/orderManager';
import {
  X,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Crown,
  DollarSign,
  Users,
  Image as ImageIcon,
  Sparkles,
  Send,
  Trash2,
  Filter,
  Check,
  ShieldCheck,
  Maximize2,
  LogOut,
  Package,
  Plus,
  Edit3,
  Copy,
  Tag,
  Layers,
  RotateCcw,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRefreshProducts: () => Promise<void>;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onRefreshProducts,
  onShowToast,
}) => {
  const { user, logout } = useAuth();

  // Active Tab: 'products' by default
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Orders State
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'WITH_PHOTOS'>('ALL');

  // Product Management State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Selected photo for Lightbox
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<{
    photo: CustomerPhoto;
    orderCode: string;
    clientName: string;
  } | null>(null);

  // Delivery link drafts for each order
  const [deliveryLinks, setDeliveryLinks] = useState<{ [orderId: string]: string }>({});

  // Fetch orders from backend / localStorage
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const list = await orderManager.getAll();
      setOrders(list);
      const drafts: { [id: string]: string } = {};
      list.forEach((o: CustomerOrder) => {
        if (o.aiDeliveryLink) drafts[o.id] = o.aiDeliveryLink;
      });
      setDeliveryLinks(drafts);
    } catch (e) {
      console.error('Error loading orders:', e);
      onShowToast('Erro ao carregar lista de pedidos.', 'error');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  // Sync specific order with AbacatePay
  const handleSyncAbacatePay = async (order: CustomerOrder) => {
    if (!order.pixId) {
      onShowToast('Este pedido não possui ID do Pix AbacatePay.', 'info');
      return;
    }

    setIsSyncingId(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}/sync-abacatepay`, { method: 'POST' });
      const data = await res.json();

      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o)));
        if (data.order.paymentStatus === 'PAID') {
          onShowToast(`Pagamento do pedido ${order.code} confirmado no AbacatePay!`, 'success');
        } else {
          onShowToast(`Status no AbacatePay: ${data.abacateData?.status || 'Pendente'}`, 'info');
        }
      } else {
        onShowToast(data.error || 'Erro ao consultar AbacatePay', 'error');
      }
    } catch (e: any) {
      onShowToast('Falha na comunicação com AbacatePay', 'error');
    } finally {
      setIsSyncingId(null);
    }
  };

  // Change payment status manually
  const handleUpdateStatus = async (orderId: string, newStatus: PaymentStatus) => {
    try {
      const updated = await orderManager.updateStatus(orderId, newStatus);
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newStatus, updatedAt: new Date().toISOString() } : o))
        );
      }
      onShowToast(`Status do pedido atualizado para ${newStatus === 'PAID' ? 'PAGO' : 'PENDENTE'}!`, 'success');
    } catch (e) {
      onShowToast('Erro ao atualizar status', 'error');
    }
  };

  // Save AI Delivery Link
  const handleSaveDeliveryLink = async (orderId: string) => {
    const link = (deliveryLinks[orderId] || '').trim();
    try {
      const updated = await orderManager.saveDeliveryLink(orderId, link);
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      } else {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  aiDeliveryLink: link,
                  aiDeliveryStatus: link.trim() ? 'delivered' : 'pending',
                  updatedAt: new Date().toISOString(),
                }
              : o
          )
        );
      }
      onShowToast('Link do ensaio gerado salvo com sucesso!', 'success');
    } catch (e) {
      onShowToast('Erro ao salvar link do ensaio', 'error');
    }
  };

  // Delete an order
  const handleDeleteOrder = async (orderId: string, code: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o pedido ${code}?`)) return;

    try {
      await orderManager.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      onShowToast(`Pedido ${code} excluído com sucesso.`, 'info');
    } catch (e) {
      onShowToast('Erro ao excluir pedido', 'error');
    }
  };

  // ==========================================================
  // PRODUCT MANAGEMENT ACTIONS
  // ==========================================================

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      const isEdit = Boolean(editingProduct && editingProduct.id);
      const saved = await productManager.saveProduct(productData, editingProduct?.id);
      
      onShowToast(
        isEdit
          ? `Álbum "${saved.name}" atualizado com sucesso!`
          : `Novo álbum "${saved.name}" criado com sucesso!`,
        'success'
      );
      
      await onRefreshProducts();
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Error saving product in modal:', err);
      onShowToast('Erro ao salvar produto.', 'error');
    }
  };

  const handleDeleteProduct = async (prod: Product) => {
    if (!window.confirm(`Deseja realmente excluir o álbum "${prod.name}" da loja?`)) return;

    try {
      await productManager.deleteProduct(prod.id);
      onShowToast(`Álbum "${prod.name}" removido com sucesso.`, 'info');
      await onRefreshProducts();
    } catch (e) {
      onShowToast('Erro ao excluir álbum.', 'error');
    }
  };

  const handleDuplicateProduct = async (prod: Product) => {
    try {
      const duplicated = await productManager.duplicateProduct(prod);
      onShowToast(`Cópia do álbum "${duplicated.name}" criada com sucesso!`, 'success');
      await onRefreshProducts();
    } catch (e) {
      onShowToast('Erro ao duplicar produto.', 'error');
    }
  };

  const handleResetProducts = async () => {
    if (!window.confirm('Deseja restaurar todos os álbuns padrões originais do sistema?')) return;
    try {
      await productManager.resetToDefaults();
      onShowToast('Álbuns originais restaurados com sucesso!', 'success');
      await onRefreshProducts();
    } catch (e) {
      onShowToast('Erro ao restaurar álbuns.', 'error');
    }
  };

  const handleQuickPromoToggle = async (prod: Product) => {
    try {
      await productManager.togglePromo(prod);
      onShowToast(`Status promocional de "${prod.name}" alterado!`, 'success');
      await onRefreshProducts();
    } catch (e) {
      onShowToast('Erro ao alterar status promocional.', 'error');
    }
  };

  // Computed metrics
  const metrics = useMemo(() => {
    const totalCount = orders.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
    const paidCount = paidOrders.length;
    const pendingCount = totalCount - paidCount;
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalPhotosUploaded = orders.reduce((sum, o) => sum + (o.customerPhotos?.length || 0), 0);
    const photosOrderCount = orders.filter((o) => (o.customerPhotos?.length || 0) > 0).length;

    return {
      totalCount,
      paidCount,
      pendingCount,
      totalRevenue,
      totalPhotosUploaded,
      photosOrderCount,
      totalProducts: (products || []).length,
    };
  }, [orders, products]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        orderSearchQuery === '' ||
        order.code.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.whatsapp.includes(orderSearchQuery) ||
        (order.pixId && order.pixId.toLowerCase().includes(orderSearchQuery.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter === 'PAID') matchesStatus = order.paymentStatus === 'PAID';
      if (statusFilter === 'PENDING') matchesStatus = order.paymentStatus !== 'PAID';
      if (statusFilter === 'WITH_PHOTOS') matchesStatus = (order.customerPhotos?.length || 0) > 0;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, statusFilter]);

  // Available Categories dynamically extracted and deduplicated by normalized key
  const availableCategories = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    (products || []).forEach((p) => {
      const cat = p.category || p.cat;
      if (cat && typeof cat === 'string' && cat.trim()) {
        const norm = normalizeCategory(cat);
        const label = formatCategoryLabel(cat);
        if (!map.has(norm)) {
          map.set(norm, { label, count: 1 });
        } else {
          map.get(norm)!.count += 1;
        }
      }
    });
    return Array.from(map.entries()).map(([normKey, data]) => ({
      key: normKey,
      label: data.label,
      count: data.count,
    }));
  }, [products]);

  // Filtered products with accent-insensitive search and category matching
  const filteredProducts = useMemo(() => {
    const query = normalizeCategory(productSearchQuery);
    return (products || []).filter((prod) => {
      const catNorm = normalizeCategory(prod.category || prod.cat);
      const nameNorm = normalizeCategory(prod.name);
      const badgeNorm = normalizeCategory(prod.badge);
      const descNorm = normalizeCategory(prod.description || prod.desc);
      const tagsNorm = (prod.tags || []).map((t) => normalizeCategory(t)).join(' ');

      const matchesSearch =
        query === '' ||
        nameNorm.includes(query) ||
        catNorm.includes(query) ||
        badgeNorm.includes(query) ||
        descNorm.includes(query) ||
        tagsNorm.includes(query);

      const matchesCat =
        productCategoryFilter === 'all' ||
        matchCategory(catNorm, productCategoryFilter);

      return matchesSearch && matchesCat;
    });
  }, [products, productSearchQuery, productCategoryFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF9F7] w-full max-w-6xl rounded-3xl shadow-2xl border border-[#D5D2CB] overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-[#E8E6E2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-[#111111]">
                  Painel de Controle do Administrador
                </h2>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-[#666666]">
                Logado como <strong className="text-[#111111]">{user?.email || 'jomamilionarios@gmail.com'}</strong> · Gestão completa de produtos, preços, fotos e pedidos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await logout();
                onClose();
                onShowToast('Você saiu da sua conta.', 'info');
              }}
              className="p-2 text-[#777777] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title="Sair da Conta"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#FAF9F7] hover:bg-[#EAE8E4] text-[#666666] flex items-center justify-center transition-colors cursor-pointer border border-[#E0DDD8]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="p-3 sm:px-6 bg-white border-b border-[#E8E6E2] flex items-center justify-between">
          <div className="flex items-center gap-2 p-1 bg-[#EAE8E4] rounded-2xl w-full sm:w-fit">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Gestão de Álbuns & Produtos ({metrics.totalProducts})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Users className="w-4 h-4 text-[#A6825B]" />
              <span>Pedidos & Fotos dos Clientes ({metrics.totalCount})</span>
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PRODUCTS & ALBUMS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Toolbar for Products */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E6E2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-[#111111] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#A6825B]" />
                    <span>Catálogo de Álbuns da Loja</span>
                  </h3>
                  <p className="text-xs text-[#666666] mt-0.5">
                    Edite preços, fotos de capa, promoções ou adicione novos temas fotográficos para seus clientes.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleResetProducts}
                    className="px-3 py-2 rounded-xl bg-[#FAF9F7] hover:bg-[#F0EFEA] border border-[#E0DDD8] text-xs font-bold text-[#666666] transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Restaurar originais"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar</span>
                  </button>

                  <button
                    onClick={handleOpenCreateProduct}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#A6825B] hover:bg-[#94724C] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Álbum</span>
                  </button>
                </div>
              </div>

              {/* Filters and Search Bar for Products */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E6E2] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setProductCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      productCategoryFilter === 'all'
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'bg-[#FAF9F7] text-[#555555] hover:bg-[#F0EFEA]'
                    }`}
                  >
                    Todos ({(products || []).length})
                  </button>
                  {availableCategories.map((cat) => {
                    const isSelected = matchCategory(productCategoryFilter, cat.key);
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setProductCategoryFilter(cat.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#111111] text-white shadow-xs'
                            : 'bg-[#FAF9F7] text-[#555555] hover:bg-[#F0EFEA]'
                        }`}
                      >
                        {cat.label} ({cat.count})
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar álbuns..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF9F7] border border-[#D0CDC7] focus:border-[#A6825B] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#111111] outline-none"
                  />
                  {productSearchQuery && (
                    <button
                      onClick={() => setProductSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Products List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => {
                  const coverImg =
                    prod.coverImage ||
                    prod.galleryImages?.[0] ||
                    prod.gallery?.[0] ||
                    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
                  const totalPhotos = prod.photoCount || prod.photos || 20;
                  const hours = prod.deliveryHours || 12;
                  const desc = prod.description || prod.desc || '';

                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-[#E8E6E2] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF9F7]">
                        <img
                          src={coverImg}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                          {prod.badge && (
                            <span className="bg-[#111111]/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              {prod.badge}
                            </span>
                          )}
                          {prod.isPromo && (
                            <span className="bg-[#A6825B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Promoção
                            </span>
                          )}
                        </div>
                        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-[#111111] text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {totalPhotos} Fotos
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-[#777777] mb-1">
                            <span className="uppercase font-bold tracking-wider text-[#A6825B]">
                              {formatCategoryLabel(prod.category || prod.cat)}
                            </span>
                            <span>{hours}h entrega</span>
                          </div>
                          <h4 className="font-display font-bold text-sm text-[#111111] line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-[#666666] line-clamp-2 mt-1 leading-relaxed">
                            {desc}
                          </p>
                        </div>

                        <div className="p-2.5 bg-[#FAF9F7] rounded-xl border border-[#EAE8E4] flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-[#888888] uppercase block font-bold">Preço</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-display text-base font-bold text-emerald-700">
                                {formatBRL(prod.price)}
                              </span>
                              {prod.originalPrice && (
                                <span className="text-[11px] line-through text-[#999999]">
                                  {formatBRL(prod.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleQuickPromoToggle(prod)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              prod.isPromo
                                ? 'bg-[#A6825B]/10 text-[#A6825B]'
                                : 'bg-white text-[#777777] border border-[#D5D2CB]'
                            }`}
                            title="Alternar Promoção"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-[#F0EFEA] flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="flex-1 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(prod)}
                            className="p-2 bg-[#FAF9F7] hover:bg-[#F0EFEA] border border-[#E0DDD8] text-[#555555] rounded-xl transition-colors cursor-pointer"
                            title="Duplicar"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod)}
                            className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl transition-colors cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & CLIENTS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#E8E6E2] shadow-xs">
                  <div className="flex items-center justify-between text-[#777777] mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Faturamento</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-display text-xl font-bold text-[#111111]">
                    {formatBRL(metrics.totalRevenue)}
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    {metrics.paidCount} de {metrics.totalCount} aprovados
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E8E6E2] shadow-xs">
                  <div className="flex items-center justify-between text-[#777777] mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Pedidos</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="font-display text-xl font-bold text-[#111111]">
                    {metrics.totalCount}
                  </div>
                  <p className="text-[10px] text-[#666666] mt-0.5">
                    {metrics.pendingCount} pendentes
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E8E6E2] shadow-xs">
                  <div className="flex items-center justify-between text-[#777777] mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Fotos Clientes</span>
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="font-display text-xl font-bold text-[#111111]">
                    {metrics.totalPhotosUploaded}
                  </div>
                  <p className="text-[10px] text-purple-700 mt-0.5">
                    Em {metrics.photosOrderCount} ensaios
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E8E6E2] shadow-xs">
                  <div className="flex items-center justify-between text-[#777777] mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">AbacatePay</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-display text-base font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Conectado</span>
                  </div>
                  <p className="text-[10px] text-[#666666] mt-0.5 truncate">
                    Sync Pix Ativo
                  </p>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E6E2] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'ALL'
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'bg-[#FAF9F7] text-[#555555] hover:bg-[#F0EFEA]'
                    }`}
                  >
                    Todos ({metrics.totalCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('PAID')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      statusFilter === 'PAID'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Pagos ({metrics.paidCount})</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('PENDING')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      statusFilter === 'PENDING'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Pendentes ({metrics.pendingCount})</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('WITH_PHOTOS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      statusFilter === 'WITH_PHOTOS'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 text-blue-800'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Com Fotos ({metrics.photosOrderCount})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar pedido, cliente..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full bg-[#FAF9F7] border border-[#D0CDC7] focus:border-[#A6825B] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#111111] outline-none"
                    />
                    {orderSearchQuery && (
                      <button
                        onClick={() => setOrderSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={loadOrders}
                    disabled={isLoadingOrders}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF9F7] hover:bg-[#F0EFEA] border border-[#E0DDD8] text-xs font-bold text-[#333333] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 text-emerald-600 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Orders Cards */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E6E2] space-y-2">
                    <Filter className="w-6 h-6 mx-auto text-[#999999]" />
                    <h4 className="font-bold text-sm text-[#111111]">Nenhum pedido encontrado</h4>
                    <p className="text-xs text-[#666666]">
                      Não há pedidos correspondentes aos filtros selecionados.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const isPaid = order.paymentStatus === 'PAID';
                    const cleanWhatsapp = (order.whatsapp || '').replace(/\D/g, '');
                    const whatsappLink = `https://wa.me/55${cleanWhatsapp}?text=${encodeURIComponent(
                      `Olá ${order.name}! Aqui é da equipe Momentos Fotos IA sobre seu ensaio fotográfico (Pedido ${order.code}).`
                    )}`;
                    const deliveryWhatsappLink = `https://wa.me/55${cleanWhatsapp}?text=${encodeURIComponent(
                      `Olá ${order.name}! Seu ensaio fotográfico hiper-realista da Momentos Fotos IA ficou pronto! 🎉✨\n\nAcesse e baixe suas fotografias pelo link:\n${
                        deliveryLinks[order.id] || order.aiDeliveryLink || ''
                      }\n\nAgradecemos a preferência!`
                    )}`;

                    return (
                      <div
                        key={order.id}
                        className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                          isPaid ? 'border-emerald-200' : 'border-amber-200'
                        }`}
                      >
                        <div className="p-3.5 border-b border-[#F0EFEA] flex flex-wrap items-center justify-between gap-2 bg-[#FAF9F7]/60">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#111111] bg-white px-2.5 py-0.5 rounded-lg border border-[#E0DDD8]">
                              {order.code}
                            </span>
                            {isPaid ? (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Pix Confirmado
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Pendente Pix
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#777777]">
                              {new Date(order.createdAt).toLocaleString('pt-BR')}
                            </span>
                            <button
                              onClick={() => handleDeleteOrder(order.id, order.code)}
                              className="p-1 text-[#999999] hover:text-red-600 rounded-lg cursor-pointer"
                              title="Excluir pedido"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Client */}
                          <div className="space-y-2">
                            <p className="font-bold text-[#111111]">{order.name}</p>
                            <p className="text-[#555555] flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-[#888888]" />
                              <span className="truncate">{order.email}</span>
                            </p>
                            <p className="text-[#555555] flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#888888]" />
                              <span>{order.whatsapp}</span>
                              {cleanWhatsapp && (
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </p>
                            <div className="pt-1 flex justify-between border-t border-[#F0EFEA]">
                              <span>Total:</span>
                              <strong className="font-bold text-[#111111]">{formatBRL(order.total)}</strong>
                            </div>
                            {!isPaid && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'PAID')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Confirmar Pix Manual</span>
                              </button>
                            )}
                          </div>

                          {/* Items */}
                          <div className="space-y-1.5">
                            <span className="font-bold text-[11px] uppercase tracking-wider text-[#777777] block">
                              Itens Solicitados ({order.items.length})
                            </span>
                            {order.items.map((item) => (
                              <div key={item.product.id} className="p-2 bg-[#FAF9F7] rounded-xl border border-[#EAE8E4] flex items-center gap-2">
                                <img
                                  src={item.product.coverImage}
                                  alt={item.product.name}
                                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-[11px] text-[#111111] truncate">{item.product.name}</p>
                                  <p className="text-[10px] text-[#777777]">Qtd: {item.quantity} · {formatBRL(item.product.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Photos & Delivery */}
                          <div className="space-y-2">
                            <span className="font-bold text-[11px] uppercase tracking-wider text-[#777777] block">
                              Fotos Enviadas ({order.customerPhotos?.length || 0})
                            </span>
                            {order.customerPhotos && order.customerPhotos.length > 0 ? (
                              <div className="grid grid-cols-4 gap-1.5">
                                {order.customerPhotos.map((photo) => (
                                  <div
                                    key={photo.id}
                                    onClick={() =>
                                      setActiveLightboxPhoto({
                                        photo,
                                        orderCode: order.code,
                                        clientName: order.name,
                                      })
                                    }
                                    className="relative aspect-square rounded-lg overflow-hidden border border-[#D5D2CB] group cursor-pointer"
                                  >
                                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                                      <Maximize2 className="w-3.5 h-3.5" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-[#888888] italic">Nenhuma foto enviada.</p>
                            )}

                            {/* Delivery Link */}
                            <div className="pt-2 border-t border-[#F0EFEA] space-y-1.5">
                              <div className="flex gap-1">
                                <input
                                  type="url"
                                  placeholder="Link Drive com fotos prontas..."
                                  value={deliveryLinks[order.id] ?? (order.aiDeliveryLink || '')}
                                  onChange={(e) =>
                                    setDeliveryLinks((prev) => ({ ...prev, [order.id]: e.target.value }))
                                  }
                                  className="flex-1 bg-[#FAF9F7] border border-[#D5D2CB] rounded-lg px-2 py-1 text-[11px] text-[#111111] outline-none"
                                />
                                <button
                                  onClick={() => handleSaveDeliveryLink(order.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs"
                                  title="Salvar"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              </div>

                              {order.aiDeliveryLink && cleanWhatsapp && (
                                <a
                                  href={deliveryWhatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] py-1 rounded-lg"
                                >
                                  Enviar Fotos no WhatsApp do Cliente
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Product Modal */}
      <ProductEditModal
        isOpen={isProductModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        onShowToast={onShowToast}
      />

      {/* Photo Lightbox Modal */}
      {activeLightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setActiveLightboxPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#D5B895] flex items-center gap-1 text-xs font-bold uppercase cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>Fechar</span>
            </button>
            <img
              src={activeLightboxPhoto.photo.url}
              alt={activeLightboxPhoto.photo.name}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <p className="font-bold text-sm">
                Foto de {activeLightboxPhoto.clientName} (Pedido {activeLightboxPhoto.orderCode})
              </p>
              <p className="text-xs text-white/70">{activeLightboxPhoto.photo.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
